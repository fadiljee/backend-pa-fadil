import { SessionOptions } from "iron-session";
import { env } from "@/lib/config/env";

export interface AdminSessionData {
  isLoggedIn: boolean;
  userId?: number;
  nama?: string;
  email?: string;
}

export const adminSessionOptions: SessionOptions = {
  password: env.SESSION_SECRET,
  cookieName: env.SESSION_COOKIE_NAME,
  ttl: env.SESSION_MAX_AGE_SECONDS,
  cookieOptions: {
    httpOnly: true,
    sameSite: "lax",
    secure: env.NODE_ENV === "production",
    path: "/",
    maxAge: env.SESSION_MAX_AGE_SECONDS,
  },
};
