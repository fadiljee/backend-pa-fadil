import Link from "next/link";
import { Button } from "@/components/ui/button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
  extraParams?: Record<string, string>;
}

export function Pagination({
  currentPage,
  totalPages,
  basePath,
  extraParams = {},
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const buildHref = (page: number) => {
    const params = new URLSearchParams({ ...extraParams, page: String(page) });
    return `${basePath}?${params.toString()}`;
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 px-4 py-3 text-sm">
      <div className="text-slate-600">
        Halaman <span className="font-semibold text-slate-900">{currentPage}</span> dari{" "}
        <span className="font-semibold text-slate-900">{totalPages}</span>
      </div>
      <div className="flex items-center gap-2">
        {currentPage > 1 ? (
          <Button
            variant="outline"
            nativeButton={false}
            render={
              <Link href={buildHref(currentPage - 1)} className="min-h-11 px-4">
                Sebelumnya
              </Link>
            }
          />
        ) : (
          <Button variant="outline" disabled className="min-h-11 px-4">
            Sebelumnya
          </Button>
        )}
        {currentPage < totalPages ? (
          <Button
            variant="outline"
            nativeButton={false}
            render={
              <Link href={buildHref(currentPage + 1)} className="min-h-11 px-4">
                Berikutnya
              </Link>
            }
          />
        ) : (
          <Button variant="outline" disabled className="min-h-11 px-4">
            Berikutnya
          </Button>
        )}
      </div>
    </div>
  );
}
