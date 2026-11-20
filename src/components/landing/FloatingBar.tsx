import { Newspaper, MessageSquare } from "lucide-react";
import { SectionButton } from "./SectionLink";

export function FloatingBar() {
  return (
    <div
      aria-label="Akses cepat"
      className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-3 z-40 flex items-center gap-1.5 rounded-full bg-crimson p-1.5 text-white shadow-lg sm:bottom-auto sm:right-0 sm:top-[32%] sm:w-12 sm:flex-col sm:rounded-l-xl sm:rounded-r-none sm:px-0.5 sm:py-1.5"
    >
      <SectionButton
        targetId="berita"
        ariaLabel="Lihat berita dan kegiatan sekolah"
        className="flex h-11 w-11 items-center justify-center rounded-full transition hover:bg-crimson-dark active:scale-95 sm:rounded-lg"
      >
        <Newspaper className="h-5 w-5" aria-hidden="true" />
      </SectionButton>
      <SectionButton
        targetId="kontak"
        ariaLabel="Lihat informasi kontak sekolah"
        className="flex h-11 w-11 items-center justify-center rounded-full transition hover:bg-crimson-dark active:scale-95 sm:rounded-lg"
      >
        <MessageSquare className="h-5 w-5" aria-hidden="true" />
      </SectionButton>
    </div>
  );
}
