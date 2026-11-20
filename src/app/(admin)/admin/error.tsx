"use client";

import { Card, CardContent } from "@/components/ui/card";

export default function AdminDashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <Card className="border-red-200 bg-white">
      <CardContent className="space-y-4 py-6">
        <div role="alert" className="space-y-1">
          <h1 className="text-lg font-bold text-slate-900">
            Gagal memuat data dashboard admin
          </h1>
          <p className="text-sm text-slate-700">
            Terjadi kendala saat mengambil data ringkasan atau grafik dari server.
            {error.message ? ` Detail: ${error.message}` : ""}
          </p>
        </div>

        <button
          type="button"
          onClick={() => reset()}
          className="inline-flex min-h-11 items-center justify-center rounded-lg bg-primary px-4 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
        >
          Coba Muat Ulang
        </button>
      </CardContent>
    </Card>
  );
}
