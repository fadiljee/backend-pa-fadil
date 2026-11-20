"use client";

import * as React from "react";
import Link from "next/link";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Label,
  LabelList,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { DashboardAnalyticsData } from "@/lib/services/dashboard-analytics";

type RangeDays = 7 | 14 | 30;
type ViewMode = "chart" | "table";

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = React.useState(false);

  React.useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(media.matches);

    const listener = (event: MediaQueryListEvent) => {
      setReduced(event.matches);
    };
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, []);

  return reduced;
}

const activityChartConfig = {
  jumlahPengerjaan: {
    label: "Soal Dikerjakan",
    color: "#054E85",
  },
} satisfies ChartConfig;

const scoreChartConfig = {
  tinggi: {
    label: "Nilai ≥ 85",
    color: "#15803D",
  },
  sedang: {
    label: "Nilai 70 sampai 84",
    color: "#B45309",
  },
  rendah: {
    label: "Nilai < 70",
    color: "#B91C1C",
  },
} satisfies ChartConfig;

const unlockChartConfig = {
  jumlahSiswa: {
    label: "Siswa Membuka Materi",
    color: "#054E85",
  },
} satisfies ChartConfig;

const SCORE_COLOR_MAP: Record<"tinggi" | "sedang" | "rendah", string> = {
  tinggi: "#15803D",
  sedang: "#B45309",
  rendah: "#B91C1C",
};

function ViewModeToggle({
  value,
  onChange,
  chartLabel,
}: {
  value: ViewMode;
  onChange: (next: ViewMode) => void;
  chartLabel: string;
}) {
  return (
    <div
      role="group"
      aria-label={`Mode tampilan ${chartLabel}`}
      className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-0.5"
    >
      <button
        type="button"
        aria-pressed={value === "chart"}
        onClick={() => onChange("chart")}
        className={`min-h-11 rounded-md px-3 text-xs font-semibold transition-colors ${
          value === "chart"
            ? "bg-primary text-white shadow-xs"
            : "text-slate-700 hover:bg-slate-200/70"
        }`}
      >
        Grafik
      </button>
      <button
        type="button"
        aria-pressed={value === "table"}
        onClick={() => onChange("table")}
        className={`min-h-11 rounded-md px-3 text-xs font-semibold transition-colors ${
          value === "table"
            ? "bg-primary text-white shadow-xs"
            : "text-slate-700 hover:bg-slate-200/70"
        }`}
      >
        Tabel
      </button>
    </div>
  );
}

export function DashboardCharts({ data }: { data: DashboardAnalyticsData }) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [rangeDays, setRangeDays] = React.useState<RangeDays>(14);
  const [activityView, setActivityView] = React.useState<ViewMode>("chart");
  const [scoreView, setScoreView] = React.useState<ViewMode>("chart");
  const [unlockView, setUnlockView] = React.useState<ViewMode>("chart");

  const filteredActivity = React.useMemo(
    () => data.dailyActivity30d.slice(-rangeDays),
    [data.dailyActivity30d, rangeDays]
  );

  const totalPengerjaanInRange = React.useMemo(
    () => filteredActivity.reduce((sum, item) => sum + item.jumlahPengerjaan, 0),
    [filteredActivity]
  );

  const peakDay = React.useMemo(() => {
    if (filteredActivity.length === 0) return null;
    return filteredActivity.reduce((best, cur) =>
      cur.jumlahPengerjaan > best.jumlahPengerjaan ? cur : best
    );
  }, [filteredActivity]);

  const nonZeroScoreSlices = React.useMemo(
    () => data.scoreDistribution.filter((item) => item.jumlahSiswa > 0),
    [data.scoreDistribution]
  );

  const barChartHeight = Math.max(240, data.materiUnlockProgress.length * 46 + 32);

  return (
    <div className="space-y-6">
      {/* Grafik 1 (Fokal Utama): Area Chart Aktivitas Pengerjaan Kuis Harian */}
      <Card className="border-slate-200">
        <CardHeader className="flex flex-col gap-4 border-b border-slate-100 pb-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 space-y-1">
            <CardTitle className="text-base font-semibold text-slate-900">
              <h2 className="text-balance">
                Aktivitas Pengerjaan Kuis Harian ({rangeDays} Hari Terakhir)
              </h2>
            </CardTitle>
            <CardDescription className="text-pretty text-slate-600">
              {totalPengerjaanInRange > 0 && peakDay
                ? `Total ${totalPengerjaanInRange} soal dikerjakan. Puncak aktivitas pada ${peakDay.shortLabel} (${peakDay.jumlahPengerjaan} soal).`
                : `Memantau jumlah jawaban kuis yang dikumpulkan siswa setiap hari dalam ${rangeDays} hari terakhir.`}
            </CardDescription>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div
              role="group"
              aria-label="Rentang waktu aktivitas kuis"
              className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-0.5"
            >
              {([7, 14, 30] as const).map((days) => (
                <button
                  key={days}
                  type="button"
                  aria-pressed={rangeDays === days}
                  onClick={() => setRangeDays(days)}
                  className={`min-h-11 rounded-md px-3 text-xs font-semibold transition-colors ${
                    rangeDays === days
                      ? "bg-primary text-white shadow-xs"
                      : "text-slate-700 hover:bg-slate-200/70"
                  }`}
                >
                  {days} Hari
                </button>
              ))}
            </div>
            <ViewModeToggle
              value={activityView}
              onChange={setActivityView}
              chartLabel="Aktivitas Pengerjaan Kuis Harian"
            />
          </div>
        </CardHeader>

        <CardContent className="pt-4">
          {totalPengerjaanInRange === 0 ? (
            <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50/70 p-6 text-center">
              <p className="text-sm font-medium text-slate-900">
                Belum ada pengerjaan kuis dalam {rangeDays} hari terakhir.
              </p>
              <p className="mt-1 text-xs text-slate-600">
                Grafik akan terisi otomatis setelah siswa mengerjakan soal di aplikasi.
                Periksa ketersediaan soal aktif di menu kuis.
              </p>
              <Link
                href="/admin/kuis"
                className="mt-4 inline-flex min-h-11 items-center justify-center rounded-lg bg-primary px-4 text-xs font-semibold text-white transition-colors hover:bg-primary-dark"
              >
                Kelola Soal Kuis
              </Link>
            </div>
          ) : activityView === "table" ? (
            <div
              role="region"
              aria-label="Tabel aktivitas pengerjaan kuis harian"
              tabIndex={0}
              className="max-h-72 overflow-auto rounded-lg border border-slate-200"
            >
              <Table>
                <TableCaption className="sr-only">
                  Jumlah soal kuis dikerjakan dan siswa aktif per hari selama {rangeDays} hari terakhir.
                </TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead scope="col">Tanggal</TableHead>
                    <TableHead scope="col" className="text-right">
                      Soal Dikerjakan
                    </TableHead>
                    <TableHead scope="col" className="text-right">
                      Siswa Aktif
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredActivity.map((point) => (
                    <TableRow key={point.dateKey}>
                      <TableCell className="font-medium text-slate-900">
                        {point.fullLabel}
                      </TableCell>
                      <TableCell className="text-right text-slate-700">
                        {point.jumlahPengerjaan}
                      </TableCell>
                      <TableCell className="text-right text-slate-700">
                        {point.siswaAktif}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <figure>
              <ChartContainer
                config={activityChartConfig}
                className="aspect-auto h-[260px] w-full"
              >
                <AreaChart
                  data={filteredActivity}
                  margin={{ top: 10, right: 12, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="fillQuizActivity" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#054E85" stopOpacity={0.28} />
                      <stop offset="95%" stopColor="#054E85" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} stroke="#E2E8F0" strokeDasharray="3 3" />
                  <XAxis
                    dataKey="shortLabel"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    minTickGap={24}
                    tick={{ fill: "#475569", fontSize: 12 }}
                  />
                  <YAxis
                    allowDecimals={false}
                    tickLine={false}
                    axisLine={false}
                    width={36}
                    tick={{ fill: "#475569", fontSize: 12 }}
                  />
                  <ChartTooltip
                    cursor={{ stroke: "#054E85", strokeWidth: 1, strokeDasharray: "3 3" }}
                    content={
                      <ChartTooltipContent
                        labelFormatter={(_label, payload) => {
                          const item = payload?.[0]?.payload as
                            | { fullLabel?: string }
                            | undefined;
                          return item?.fullLabel ?? _label;
                        }}
                      />
                    }
                  />
                  <Area
                    dataKey="jumlahPengerjaan"
                    type="monotone"
                    fill="url(#fillQuizActivity)"
                    stroke="#054E85"
                    strokeWidth={2.25}
                    isAnimationActive={!prefersReducedMotion}
                  />
                </AreaChart>
              </ChartContainer>
              <figcaption className="mt-2 text-xs text-slate-600">
                Sumber: tabel hasil kuis (zona waktu WIB). Gunakan tombol Tabel di kanan atas untuk membaca angka rinci per tanggal.
              </figcaption>
            </figure>
          )}
        </CardContent>
      </Card>

      {/* Baris Bawah (Asimetris 5 : 7): Donut Distribusi Nilai + Horizontal Bar Progres Unlock Materi */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Grafik 2: Donut Chart Distribusi Kategori Nilai Siswa */}
        <Card className="min-w-0 border-slate-200 lg:col-span-5">
          <CardHeader className="flex flex-col gap-3 border-b border-slate-100 pb-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0 space-y-1">
              <CardTitle className="text-base font-semibold text-slate-900">
                <h2 className="text-balance">Distribusi Kategori Nilai Siswa</h2>
              </CardTitle>
              <CardDescription className="text-pretty text-slate-600">
                Proporsi ketuntasan dari {data.totalEvaluatedSiswa} siswa yang sudah mengerjakan kuis.
              </CardDescription>
            </div>
            <ViewModeToggle
              value={scoreView}
              onChange={setScoreView}
              chartLabel="Distribusi Kategori Nilai Siswa"
            />
          </CardHeader>

          <CardContent className="pt-4">
            {data.totalEvaluatedSiswa === 0 ? (
              <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50/70 p-6 text-center">
                <p className="text-sm font-medium text-slate-900">
                  Belum ada nilai siswa yang tercatat.
                </p>
                <p className="mt-1 text-xs text-slate-600">
                  Kategori nilai akan muncul setelah minimal satu siswa menyelesaikan soal kuis.
                </p>
                <Link
                  href="/admin/siswa"
                  className="mt-4 inline-flex min-h-11 items-center justify-center rounded-lg border border-slate-300 bg-white px-4 text-xs font-semibold text-slate-800 transition-colors hover:bg-slate-100"
                >
                  Lihat Daftar Siswa
                </Link>
              </div>
            ) : scoreView === "table" ? (
              <div
                role="region"
                aria-label="Tabel distribusi kategori nilai siswa"
                tabIndex={0}
                className="overflow-x-auto rounded-lg border border-slate-200"
              >
                <Table>
                  <TableCaption className="sr-only">
                    Sebaran jumlah dan persentase siswa berdasarkan kategori nilai kuis.
                  </TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead scope="col">Kategori</TableHead>
                      <TableHead scope="col" className="text-right">
                        Siswa
                      </TableHead>
                      <TableHead scope="col" className="text-right">
                        Persentase
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.scoreDistribution.map((row) => (
                      <TableRow key={row.key}>
                        <TableCell className="font-medium text-slate-900">
                          {row.label} ({row.rangeLabel})
                        </TableCell>
                        <TableCell className="text-right text-slate-700">
                          {row.jumlahSiswa}
                        </TableCell>
                        <TableCell className="text-right font-semibold text-slate-900">
                          {row.persentase}%
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <figure className="space-y-4">
                <ChartContainer
                  config={scoreChartConfig}
                  className="mx-auto aspect-square max-h-[220px]"
                >
                  <PieChart>
                    <ChartTooltip
                      cursor={false}
                      content={
                        <ChartTooltipContent
                          nameKey="key"
                          formatter={(value, _name, item) => {
                            const payload = item.payload as {
                              rangeLabel?: string;
                              persentase?: number;
                            };
                            return (
                              <div className="flex w-full items-center justify-between gap-4">
                                <span className="text-slate-600">
                                  {payload.rangeLabel}
                                </span>
                                <span className="font-semibold text-slate-900">
                                  {value} siswa ({payload.persentase ?? 0}%)
                                </span>
                              </div>
                            );
                          }}
                        />
                      }
                    />
                    <Pie
                      data={nonZeroScoreSlices}
                      dataKey="jumlahSiswa"
                      nameKey="key"
                      innerRadius={58}
                      outerRadius={88}
                      stroke="#FFFFFF"
                      strokeWidth={2}
                      isAnimationActive={!prefersReducedMotion}
                    >
                      {nonZeroScoreSlices.map((entry) => (
                        <Cell
                          key={entry.key}
                          fill={SCORE_COLOR_MAP[entry.key]}
                        />
                      ))}
                      <Label
                        content={({ viewBox }) => {
                          if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                            return (
                              <text
                                x={viewBox.cx}
                                y={viewBox.cy}
                                textAnchor="middle"
                                dominantBaseline="middle"
                              >
                                <tspan
                                  x={viewBox.cx}
                                  y={viewBox.cy}
                                  className="fill-slate-900 text-2xl font-bold"
                                >
                                  {data.totalEvaluatedSiswa}
                                </tspan>
                                <tspan
                                  x={viewBox.cx}
                                  y={(viewBox.cy ?? 0) + 20}
                                  className="fill-slate-600 text-xs"
                                >
                                  siswa aktif
                                </tspan>
                              </text>
                            );
                          }
                          return null;
                        }}
                      />
                    </Pie>
                  </PieChart>
                </ChartContainer>

                {/* Keterangan eksplisit agar status tidak hanya mengandalkan warna */}
                <ul className="space-y-2 border-t border-slate-100 pt-3 text-xs">
                  {data.scoreDistribution.map((item) => (
                    <li
                      key={item.key}
                      className="flex items-center justify-between gap-2"
                    >
                      <span className="flex items-center gap-2 text-slate-700">
                        <span
                          aria-hidden="true"
                          className="h-2.5 w-2.5 shrink-0 rounded-xs"
                          style={{ backgroundColor: SCORE_COLOR_MAP[item.key] }}
                        />
                        <span className="font-medium text-slate-900">{item.label}</span>
                        <span className="text-slate-600">({item.rangeLabel})</span>
                      </span>
                      <span className="font-semibold text-slate-900">
                        {item.jumlahSiswa} ({item.persentase}%)
                      </span>
                    </li>
                  ))}
                </ul>
                <figcaption className="sr-only">
                  Distribusi kategori nilai dari {data.totalEvaluatedSiswa} siswa aktif.
                </figcaption>
              </figure>
            )}
          </CardContent>
        </Card>

        {/* Grafik 3: Horizontal Bar Chart Progres Pembukaan Materi oleh Siswa */}
        <Card className="min-w-0 border-slate-200 lg:col-span-7">
          <CardHeader className="flex flex-col gap-3 border-b border-slate-100 pb-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0 space-y-1">
              <CardTitle className="text-base font-semibold text-slate-900">
                <h2 className="text-balance">Progres Pembukaan Materi oleh Siswa</h2>
              </CardTitle>
              <CardDescription className="text-pretty text-slate-600">
                Jumlah siswa yang telah membuka (unlock) tiap materi dari total {data.totalRegisteredSiswa} siswa terdaftar.
              </CardDescription>
            </div>
            <ViewModeToggle
              value={unlockView}
              onChange={setUnlockView}
              chartLabel="Progres Pembukaan Materi oleh Siswa"
            />
          </CardHeader>

          <CardContent className="pt-4">
            {data.materiUnlockProgress.length === 0 ? (
              <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50/70 p-6 text-center">
                <p className="text-sm font-medium text-slate-900">
                  Belum ada materi pembelajaran yang dibuat.
                </p>
                <p className="mt-1 text-xs text-slate-600">
                  Tambahkan materi terlebih dahulu agar progres pembukaan materi siswa dapat dipantau.
                </p>
                <Link
                  href="/admin/materi"
                  className="mt-4 inline-flex min-h-11 items-center justify-center rounded-lg bg-primary px-4 text-xs font-semibold text-white transition-colors hover:bg-primary-dark"
                >
                  Tambah Materi Pertama
                </Link>
              </div>
            ) : unlockView === "table" ? (
              <div
                role="region"
                aria-label="Tabel progres pembukaan materi oleh siswa"
                tabIndex={0}
                className="max-h-80 overflow-auto rounded-lg border border-slate-200"
              >
                <Table>
                  <TableCaption className="sr-only">
                    Daftar materi beserta jumlah dan persentase siswa yang sudah membukanya.
                  </TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead scope="col">Materi</TableHead>
                      <TableHead scope="col" className="text-right">
                        Siswa Unlock
                      </TableHead>
                      <TableHead scope="col" className="text-right">
                        Cakupan
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.materiUnlockProgress.map((item) => (
                      <TableRow key={item.materiId}>
                        <TableCell className="font-medium text-slate-900">
                          {item.judul}
                        </TableCell>
                        <TableCell className="text-right text-slate-700">
                          {item.jumlahSiswa} / {data.totalRegisteredSiswa}
                        </TableCell>
                        <TableCell className="text-right font-semibold text-slate-900">
                          {item.persentase}%
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <figure>
                <ChartContainer
                  config={unlockChartConfig}
                  className="aspect-auto w-full"
                  style={{ height: `${barChartHeight}px` }}
                >
                  <BarChart
                    data={data.materiUnlockProgress}
                    layout="vertical"
                    margin={{ top: 4, right: 56, left: 4, bottom: 4 }}
                  >
                    <CartesianGrid horizontal={false} stroke="#E2E8F0" strokeDasharray="3 3" />
                    <YAxis
                      dataKey="judulSingkat"
                      type="category"
                      tickLine={false}
                      axisLine={false}
                      width={132}
                      tick={{ fill: "#1B2433", fontSize: 12 }}
                    />
                    <XAxis
                      type="number"
                      allowDecimals={false}
                      hide
                      domain={[0, Math.max(data.totalRegisteredSiswa, 1)]}
                    />
                    <ChartTooltip
                      cursor={{ fill: "#E6EFF7", opacity: 0.6 }}
                      content={
                        <ChartTooltipContent
                          labelFormatter={(_label, payload) => {
                            const item = payload?.[0]?.payload as
                              | { judul?: string }
                              | undefined;
                            return item?.judul ?? _label;
                          }}
                          formatter={(value, _name, item) => {
                            const payload = item.payload as { persentase?: number };
                            return (
                              <div className="flex w-full items-center justify-between gap-4">
                                <span className="text-slate-600">Siswa unlock</span>
                                <span className="font-semibold text-slate-900">
                                  {value} siswa ({payload.persentase ?? 0}%)
                                </span>
                              </div>
                            );
                          }}
                        />
                      }
                    />
                    <Bar
                      dataKey="jumlahSiswa"
                      fill="#054E85"
                      radius={[0, 6, 6, 0]}
                      barSize={24}
                      isAnimationActive={!prefersReducedMotion}
                    >
                      <LabelList
                        dataKey="jumlahSiswa"
                        position="right"
                        offset={8}
                        className="fill-slate-800 text-xs font-semibold"
                        formatter={(val) => `${val ?? 0} siswa`}
                      />
                    </Bar>
                  </BarChart>
                </ChartContainer>
                <figcaption className="mt-2 text-xs text-slate-600">
                  Urutan materi mengikuti alur pembelajaran. Penurunan batang menunjukkan titik materi tempat siswa mulai berhenti.
                </figcaption>
              </figure>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
