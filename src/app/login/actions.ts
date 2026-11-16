"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { adminLoginSchema } from "@/lib/validators/schemas";
import {
  checkLoginRateLimit,
  getAdminSession,
  verifyAdminCredentials,
} from "@/lib/auth/admin-session";

export type LoginState = {
  error?: string;
};

export async function loginAdminAction(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const hdrs = await headers();
  const ip = hdrs.get("x-forwarded-for") ?? "unknown";
  if (!checkLoginRateLimit(`admin:${ip}`)) {
    return { error: "Terlalu banyak percobaan login. Silakan tunggu beberapa menit." };
  }

  const parsed = adminLoginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Input tidak valid" };
  }

  const user = await verifyAdminCredentials(parsed.data.email, parsed.data.password);
  if (!user) {
    return { error: "Email dan Password Salah!" };
  }

  const session = await getAdminSession();
  session.isLoggedIn = true;
  session.userId = user.id;
  session.nama = user.nama;
  session.email = user.email;
  await session.save();

  redirect("/admin");
}

export async function logoutAdminAction() {
  const session = await getAdminSession();
  session.destroy();
  redirect("/login");
}
