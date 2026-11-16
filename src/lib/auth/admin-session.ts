import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getIronSession } from "iron-session";
import bcrypt from "bcryptjs";
import { env } from "@/lib/config/env";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { DataUserRow } from "@/lib/supabase/types";
import { AdminSessionData, adminSessionOptions } from "./session-options";

export type { AdminSessionData };
export { adminSessionOptions };

export async function getAdminSession() {
  const cookieStore = await cookies();
  return getIronSession<AdminSessionData>(cookieStore, adminSessionOptions);
}

/**
 * Memastikan request berasal dari admin yang sudah login.
 * Jika belum, langsung redirect ke `/login`.
 */
export async function requireAdminSession() {
  const session = await getAdminSession();
  if (!session.isLoggedIn) {
    redirect("/login");
  }
  return session;
}

export async function verifyAdminCredentials(
  email: string,
  password: string
): Promise<DataUserRow | null> {
  const supabase = getSupabaseAdmin();
  const { data: user, error } = await supabase
    .from("data_user")
    .select("*")
    .eq("email", email.trim().toLowerCase())
    .maybeSingle();

  if (error || !user) {
    return null;
  }

  const typedUser = user as DataUserRow;
  const isValid = await bcrypt.compare(password, typedUser.password_hash);
  if (!isValid) {
    return null;
  }

  return typedUser;
}

// Rate limiter sliding window berbasis konfigurasi environment
const loginAttempts = new Map<string, number[]>();

export function checkLoginRateLimit(identifier: string): boolean {
  const now = Date.now();
  const timestamps = (loginAttempts.get(identifier) ?? []).filter(
    (ts) => now - ts < env.LOGIN_RATE_LIMIT_WINDOW_MS
  );
  if (timestamps.length >= env.LOGIN_RATE_LIMIT_MAX_ATTEMPTS) {
    loginAttempts.set(identifier, timestamps);
    return false;
  }
  timestamps.push(now);
  loginAttempts.set(identifier, timestamps);
  return true;
}
