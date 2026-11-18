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
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 px-4 py-3 text-sm">
      <div className="text-slate-600">
        Halaman <span className="font-semibold text-slate-900">{currentPage}</span> dari{" "}
        <span className="font-semibold text-slate-900">{totalPages}</span>
      </div>
      <div className="flex items-center gap-2">
        {currentPage > 1 ? (
          <Link
            href={buildHref(currentPage - 1)}
            className="inline-flex min-h-11 items-center rounded-lg border border-slate-300 bg-white px-4 py-2 font-medium text-slate-700 hover:bg-slate-50"
          >
            Sebelumnya
          </Link>
        ) : (
          <span
            aria-disabled="true"
            className="inline-flex min-h-11 items-center rounded-lg border border-slate-200 bg-slate-100 px-4 py-2 font-medium text-slate-600"
          >
            Sebelumnya
          </span>
        )}
        {currentPage < totalPages ? (
          <Link
            href={buildHref(currentPage + 1)}
            className="inline-flex min-h-11 items-center rounded-lg border border-slate-300 bg-white px-4 py-2 font-medium text-slate-700 hover:bg-slate-50"
          >
            Berikutnya
          </Link>
        ) : (
          <span
            aria-disabled="true"
            className="inline-flex min-h-11 items-center rounded-lg border border-slate-200 bg-slate-100 px-4 py-2 font-medium text-slate-600"
          >
            Berikutnya
          </span>
        )}
      </div>
    </div>
  );
}
