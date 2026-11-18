import Link from "next/link";
import { UserCheck, MessageSquare } from "lucide-react";

export function FloatingBar({ isLoggedIn }: { isLoggedIn: boolean }) {
  return (
    <div
      aria-label="Akses cepat"
      className="fixed bottom-4 right-3 z-40 flex items-center gap-1 rounded-full bg-primary p-1 text-white shadow-lg sm:bottom-auto sm:right-0 sm:top-[28%] sm:w-11 sm:flex-col sm:rounded-l-xl sm:rounded-r-none sm:px-0 sm:py-1.5"
    >
      <Link
        href={isLoggedIn ? "/admin" : "/login"}
        aria-label={isLoggedIn ? "Buka Panel Admin" : "Masuk Admin"}
        className="flex h-11 w-11 items-center justify-center rounded-full transition hover:bg-primary-dark sm:rounded-lg"
      >
        <UserCheck className="h-5 w-5" aria-hidden="true" />
      </Link>
      <a
        href="#kontak"
        aria-label="Lihat informasi kontak sekolah"
        className="flex h-11 w-11 items-center justify-center rounded-full transition hover:bg-primary-dark sm:rounded-lg"
      >
        <MessageSquare className="h-5 w-5" aria-hidden="true" />
      </a>
    </div>
  );
}
