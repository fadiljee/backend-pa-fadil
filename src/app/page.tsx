import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth/admin-session";

export default async function HomePage() {
  const session = await getAdminSession();
  if (session.isLoggedIn) {
    redirect("/admin");
  }
  redirect("/login");
}
