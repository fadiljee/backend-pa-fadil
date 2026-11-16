import Link from "next/link";

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
    <div className="flex items-center justify-between border-t border-slate-200 px-4 py-3 text-sm">
      <div className="text-slate-500">
        Halaman <span className="font-medium text-slate-800">{currentPage}</span> dari{" "}
        <span className="font-medium text-slate-800">{totalPages}</span>
      </div>
      <div className="flex items-center gap-2">
        {currentPage > 1 ? (
          <Link
            href={buildHref(currentPage - 1)}
            className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700"
          >
            Sebelumnya
          </Link>
        ) : (
          <span className="px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-400">
            Sebelumnya
          </span>
        )}
        {currentPage < totalPages ? (
          <Link
            href={buildHref(currentPage + 1)}
            className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700"
          >
            Berikutnya
          </Link>
        ) : (
          <span className="px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-400">
            Berikutnya
          </span>
        )}
      </div>
    </div>
  );
}
