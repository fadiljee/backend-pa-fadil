import { NextResponse } from "next/server";
import { ANNOUNCEMENTS_LIST, SITE_INFO } from "@/lib/content";

export async function GET(
  _req: Request,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params;

  if (slug === "kalender-akademik") {
    const body = [
      `KALENDER AKADEMIK 2026/2027 — ${SITE_INFO.schoolName.toUpperCase()}`,
      "Kecamatan Merawang, Kabupaten Bangka, Kepulauan Bangka Belitung",
      "============================================================",
      "",
      "Semester Ganjil (Juli 2026 – Desember 2026):",
      "- Juli 2026      : Hari Pertama Sekolah & Masa Pengenalan Lingkungan Sekolah (MPLS)",
      "- Agustus 2026   : Peringatan HUT RI & Pemilihan Pengurus OSIS",
      "- September 2026 : Penilaian Tengah Semester (PTS) Ganjil",
      "- Oktober 2026   : Rapat Komite Sekolah & Pekan Kreativitas Siswa",
      "- Desember 2026  : Penilaian Akhir Semester (PAS) Ganjil & Pembagian Rapor",
      "",
      "Semester Genap (Januari 2027 – Juni 2027):",
      "- Januari 2027   : Awal Kegiatan Belajar Semester Genap",
      "- Maret 2027     : Penilaian Tengah Semester (PTS) Genap",
      "- Mei 2027       : Ujian Sekolah Kelas IX",
      "- Juni 2027      : Penilaian Akhir Tahun (PAT) & Pembagian Rapor Kenaikan Kelas",
      "",
      SITE_INFO.copyright,
    ].join("\n");

    return new NextResponse(body, {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Content-Disposition":
          'attachment; filename="kalender-akademik-smpn1-merawang-2026-2027.txt"',
      },
    });
  }

  const item = ANNOUNCEMENTS_LIST.find((a) => a.slug === slug);
  if (!item) {
    return NextResponse.json(
      { error: "Pengumuman tidak ditemukan" },
      { status: 404 }
    );
  }

  const body = [
    item.title.toUpperCase(),
    `${SITE_INFO.schoolName} — ${item.date}`,
    "============================================================",
    "",
    item.summary,
    "",
    item.content,
    "",
    SITE_INFO.copyright,
  ].join("\n");

  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Content-Disposition": `attachment; filename="${item.slug}.txt"`,
    },
  });
}
