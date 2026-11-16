import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth/admin-session";
import { Sidebar } from "@/components/admin/Sidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();
  if (!session.isLoggedIn) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen flex bg-slate-100">
      <Sidebar adminName={session.nama ?? "Admin"} />
      <main className="flex-1 min-w-0 p-6 md:p-8">{children}</main>
    </div>
  );
}
