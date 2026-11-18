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
    <div className="min-h-screen bg-slate-50 md:flex">
      <a
        href="#admin-main"
        className="sr-only focus:not-sr-only fixed left-3 top-3 z-50 rounded-lg bg-sky-900 px-4 py-2 text-sm font-semibold text-white shadow-md"
      >
        Lewati ke konten utama
      </a>
      <Sidebar adminName={session.nama ?? "Admin"} />
      <main id="admin-main" tabIndex={-1} className="min-w-0 flex-1 p-4 sm:p-6 md:p-8">
        {children}
      </main>
    </div>
  );
}
