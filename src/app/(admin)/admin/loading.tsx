import { Card, CardContent } from "@/components/ui/card";

export default function AdminDashboardLoading() {
  return (
    <div className="space-y-6" role="status" aria-live="polite">
      <div className="rounded-xl bg-primary px-5 py-4 text-white">
        <p className="text-sm font-medium text-sky-100">
          Memuat ringkasan dan grafik analitik dashboard admin...
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="border-slate-200">
            <CardContent className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-slate-200" />
              <div className="space-y-2">
                <div className="h-6 w-16 rounded bg-slate-200" />
                <div className="h-4 w-24 rounded bg-slate-100" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-slate-200">
        <CardContent className="h-72 flex items-center justify-center">
          <p className="text-sm text-slate-600">
            Menyiapkan data grafik aktivitas kuis, distribusi nilai, dan progres materi...
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
