import fs from "fs";
import path from "path";

// Muat .env secara otomatis sebelum membaca env config
const envPath = path.join(process.cwd(), ".env");
if (fs.existsSync(envPath) && typeof process.loadEnvFile === "function") {
  try {
    process.loadEnvFile(envPath);
  } catch {
    // Abaikan jika gagal membaca .env
  }
}

import bcrypt from "bcryptjs";
import { env } from "@/lib/config/env";
import { getSupabaseAdmin } from "../supabase/server";
import { KuisRow, MateriRow, SiswaRow } from "../supabase/types";
import { calculateScore, canUnlockNext } from "../services/learning";
import { DEFAULT_LANDING_SETTINGS } from "../services/landing-settings";

async function seed() {
  console.log("Memulai seeding lengkap Supabase SMPN 1 Merawang...");
  const supabase = getSupabaseAdmin();

  // =========================================================================
  // 1. Seed Admin & Guru (data_user)
  // =========================================================================
  const adminUsers = [
    {
      nama: "Administrator SMPN 1 Merawang",
      no_hp: env.SEED_ADMIN_PHONE,
      email: env.SEED_ADMIN_EMAIL,
      password_hash: await bcrypt.hash(env.SEED_ADMIN_PASSWORD, 10),
    },
    {
      nama: "Guru Matematika",
      no_hp: env.SEED_GURU_PHONE,
      email: env.SEED_GURU_EMAIL,
      password_hash: await bcrypt.hash(env.SEED_GURU_PASSWORD, 10),
    },
  ];

  const { error: adminErr } = await supabase
    .from("data_user")
    .upsert(adminUsers, { onConflict: "email", ignoreDuplicates: true });
  if (adminErr) throw adminErr;
  console.log(`[1/7] Admin & Guru siap: ${env.SEED_ADMIN_EMAIL}, ${env.SEED_GURU_EMAIL}`);

  // =========================================================================
  // 2. Seed Data Siswa (data_siswa) — 12 siswa lintas kelas 7A–9B
  // =========================================================================
  const siswaSeed = [
    {
      nama: "Budi Santoso",
      nisn: "0012345678",
      kelas: "7A",
      sekolah: "SMPN 1 Merawang",
      alamat: "Jl. Raya Merawang No. 12, Kec. Merawang",
    },
    {
      nama: "Siti Aminah",
      nisn: "0012345679",
      kelas: "7A",
      sekolah: "SMPN 1 Merawang",
      alamat: "Desa Air Anyir, Kec. Merawang",
    },
    {
      nama: "Ahmad Rizky",
      nisn: "0012345680",
      kelas: "7B",
      sekolah: "SMPN 1 Merawang",
      alamat: "Desa Balun Ijuk, Kec. Merawang",
    },
    {
      nama: "Dewi Lestari",
      nisn: "0012345681",
      kelas: "7B",
      sekolah: "SMPN 1 Merawang",
      alamat: "Desa Riding Panjang, Kec. Merawang",
    },
    {
      nama: "Fajar Pratama",
      nisn: "0012345682",
      kelas: "8A",
      sekolah: "SMPN 1 Merawang",
      alamat: "Desa Jurung, Kec. Merawang",
    },
    {
      nama: "Nadia Putri",
      nisn: "0012345683",
      kelas: "8A",
      sekolah: "SMPN 1 Merawang",
      alamat: "Desa Baturusa, Kec. Merawang",
    },
    {
      nama: "Raka Mahendra",
      nisn: "0012345684",
      kelas: "8B",
      sekolah: "SMPN 1 Merawang",
      alamat: "Desa Pagarawan, Kec. Merawang",
    },
    {
      nama: "Aulia Rahmawati",
      nisn: "0012345685",
      kelas: "8B",
      sekolah: "SMPN 1 Merawang",
      alamat: "Desa Kimak, Kec. Merawang",
    },
    {
      nama: "Dimas Saputra",
      nisn: "0012345686",
      kelas: "9A",
      sekolah: "SMPN 1 Merawang",
      alamat: "Desa Jada Bahrin, Kec. Merawang",
    },
    {
      nama: "Intan Permata Sari",
      nisn: "0012345687",
      kelas: "9A",
      sekolah: "SMPN 1 Merawang",
      alamat: "Desa Merawang, Kec. Merawang",
    },
    {
      nama: "Hendra Wijaya",
      nisn: "0012345688",
      kelas: "9B",
      sekolah: "SMPN 1 Merawang",
      alamat: "Desa Dwi Makmur, Kec. Merawang",
    },
    {
      nama: "Putri Wulandari",
      nisn: "0012345689",
      kelas: "9B",
      sekolah: "SMPN 1 Merawang",
      alamat: "Desa Air Duren, Kec. Merawang",
    },
  ];

  const { error: siswaErr } = await supabase
    .from("data_siswa")
    .upsert(siswaSeed, { onConflict: "nisn", ignoreDuplicates: true });
  if (siswaErr) throw siswaErr;

  const { data: allSiswaRaw } = await supabase.from("data_siswa").select("*").order("id");
  const allSiswa = (allSiswaRaw ?? []) as SiswaRow[];
  console.log(`[2/7] Total siswa siap: ${allSiswa.length} siswa`);

  // =========================================================================
  // 3. Seed Materi & Soal Kuis (materis + kuis) — 6 bab, 30 soal
  // =========================================================================
  const materiData = [
    {
      judul: "Operasi Hitung Bilangan Bulat",
      gambar: "/images/seed/ruang-kelas.webp",
      konten:
        "Bilangan bulat terdiri dari bilangan bulat negatif, nol (0), dan bilangan bulat positif. Pada penjumlahan dan pengurangan, tanda bilangan menentukan arah pergeseran pada garis bilangan. Pada perkalian dan pembagian: tanda sama menghasilkan positif, tanda berbeda menghasilkan negatif.",
      soals: [
        {
          pertanyaan: "Hasil dari -5 + 12 adalah...",
          jawaban_a: "-7",
          jawaban_b: "7",
          jawaban_c: "17",
          jawaban_d: "-17",
          jawaban_benar: "b" as const,
          nilai: 20,
          pembahasan: "-5 + 12 sama dengan 12 - 5 = 7.",
        },
        {
          pertanyaan: "Hasil dari 8 × (-3) adalah...",
          jawaban_a: "24",
          jawaban_b: "-11",
          jawaban_c: "-24",
          jawaban_d: "11",
          jawaban_benar: "c" as const,
          nilai: 20,
          pembahasan: "Bilangan positif dikali negatif hasilnya negatif: 8 × (-3) = -24.",
        },
        {
          pertanyaan: "Hasil dari (-18) : (-3) adalah...",
          jawaban_a: "-6",
          jawaban_b: "6",
          jawaban_c: "-15",
          jawaban_d: "15",
          jawaban_benar: "b" as const,
          nilai: 20,
          pembahasan: "Negatif dibagi negatif menghasilkan positif: 18 : 3 = 6.",
        },
        {
          pertanyaan: "Suhu di puncak gunung awalnya -4°C, lalu turun 5°C. Suhu sekarang adalah...",
          jawaban_a: "-9°C",
          jawaban_b: "-1°C",
          jawaban_c: "1°C",
          jawaban_d: "9°C",
          jawaban_benar: "a" as const,
          nilai: 20,
          pembahasan: "Turun berarti dikurangi: -4 - 5 = -9°C.",
        },
        {
          pertanyaan: "Hasil dari 15 - (-7) adalah...",
          jawaban_a: "8",
          jawaban_b: "-8",
          jawaban_c: "22",
          jawaban_d: "-22",
          jawaban_benar: "c" as const,
          nilai: 20,
          pembahasan: "15 - (-7) = 15 + 7 = 22.",
        },
      ],
    },
    {
      judul: "Pecahan dan Desimal",
      gambar: "/images/seed/perpustakaan.webp",
      konten:
        "Bilangan pecahan dinyatakan dalam bentuk a/b dengan a sebagai pembilang, b sebagai penyebut (b ≠ 0). Penjumlahan dan pengurangan pecahan mengharuskan penyamaan penyebut terlebih dahulu. Pecahan dapat diubah ke bentuk desimal dengan membagi pembilang oleh penyebut.",
      soals: [
        {
          pertanyaan: "Bentuk desimal dari 3/4 adalah...",
          jawaban_a: "0,25",
          jawaban_b: "0,5",
          jawaban_c: "0,75",
          jawaban_d: "1,25",
          jawaban_benar: "c" as const,
          nilai: 20,
          pembahasan: "3 dibagi 4 = 0,75.",
        },
        {
          pertanyaan: "Hasil dari 1/2 + 1/4 adalah...",
          jawaban_a: "2/6",
          jawaban_b: "3/4",
          jawaban_c: "1/4",
          jawaban_d: "2/4",
          jawaban_benar: "b" as const,
          nilai: 20,
          pembahasan: "1/2 = 2/4, sehingga 2/4 + 1/4 = 3/4.",
        },
        {
          pertanyaan: "Hasil dari 2/3 × 3/5 adalah...",
          jawaban_a: "2/5",
          jawaban_b: "5/8",
          jawaban_c: "6/8",
          jawaban_d: "3/5",
          jawaban_benar: "a" as const,
          nilai: 20,
          pembahasan: "(2 × 3) / (3 × 5) = 6/15 = 2/5.",
        },
        {
          pertanyaan: "Bentuk pecahan paling sederhana dari 0,6 adalah...",
          jawaban_a: "6/100",
          jawaban_b: "3/5",
          jawaban_c: "2/5",
          jawaban_d: "3/10",
          jawaban_benar: "b" as const,
          nilai: 20,
          pembahasan: "0,6 = 6/10, disederhanakan dengan dibagi 2 menjadi 3/5.",
        },
        {
          pertanyaan: "Hasil dari 4/5 - 1/5 adalah...",
          jawaban_a: "3/5",
          jawaban_b: "5/5",
          jawaban_c: "3/10",
          jawaban_d: "4/10",
          jawaban_benar: "a" as const,
          nilai: 20,
          pembahasan: "Karena penyebut sudah sama, langsung kurangkan pembilang: (4 - 1)/5 = 3/5.",
        },
      ],
    },
    {
      judul: "Bentuk Aljabar Dasar",
      gambar: "/images/seed/diskusi-belajar.webp",
      konten:
        "Bentuk aljabar terdiri atas variabel (huruf pengganti bilangan), koefisien (angka pengali variabel), dan konstanta (bilangan tetap). Suku-suku sejenis memiliki variabel dan pangkat yang sama sehingga dapat dijumlahkan atau dikurangkan.",
      soals: [
        {
          pertanyaan: "Bentuk sederhana dari 3x + 5x - 2x adalah...",
          jawaban_a: "6x",
          jawaban_b: "8x",
          jawaban_c: "10x",
          jawaban_d: "4x",
          jawaban_benar: "a" as const,
          nilai: 20,
          pembahasan: "(3 + 5 - 2)x = 6x.",
        },
        {
          pertanyaan: "Koefisien dari variabel y pada bentuk 4x - 7y + 9 adalah...",
          jawaban_a: "4",
          jawaban_b: "7",
          jawaban_c: "-7",
          jawaban_d: "9",
          jawaban_benar: "c" as const,
          nilai: 20,
          pembahasan: "Tanda minus ikut ke koefisien y, yaitu -7.",
        },
        {
          pertanyaan: "Hasil dari 2(3a + 4) adalah...",
          jawaban_a: "6a + 4",
          jawaban_b: "5a + 6",
          jawaban_c: "6a + 8",
          jawaban_d: "6a + 6",
          jawaban_benar: "c" as const,
          nilai: 20,
          pembahasan: "Gunakan sifat distributif: 2×3a + 2×4 = 6a + 8.",
        },
        {
          pertanyaan: "Jika x = 3, maka nilai dari 4x - 5 adalah...",
          jawaban_a: "7",
          jawaban_b: "12",
          jawaban_c: "17",
          jawaban_d: "2",
          jawaban_benar: "a" as const,
          nilai: 20,
          pembahasan: "4(3) - 5 = 12 - 5 = 7.",
        },
        {
          pertanyaan: "Konstanta dari bentuk aljabar 5p + 2q - 11 adalah...",
          jawaban_a: "5",
          jawaban_b: "2",
          jawaban_c: "11",
          jawaban_d: "-11",
          jawaban_benar: "d" as const,
          nilai: 20,
          pembahasan: "Konstanta adalah suku tanpa variabel, yaitu -11.",
        },
      ],
    },
    {
      judul: "Persamaan Linear Satu Variabel",
      gambar: "/images/seed/lab-komputer.webp",
      konten:
        "Persamaan Linear Satu Variabel (PLSV) adalah kalimat terbuka dengan satu variabel berpangkat satu yang dihubungkan tanda sama dengan (=). Penyelesaiannya dilakukan dengan menambah, mengurangi, mengali, atau membagi kedua ruas dengan bilangan yang sama.",
      soals: [
        {
          pertanyaan: "Nilai x yang memenuhi x + 7 = 15 adalah...",
          jawaban_a: "22",
          jawaban_b: "8",
          jawaban_c: "7",
          jawaban_d: "-8",
          jawaban_benar: "b" as const,
          nilai: 20,
          pembahasan: "x = 15 - 7 = 8.",
        },
        {
          pertanyaan: "Penyelesaian dari 3x = 27 adalah...",
          jawaban_a: "x = 9",
          jawaban_b: "x = 24",
          jawaban_c: "x = 30",
          jawaban_d: "x = 81",
          jawaban_benar: "a" as const,
          nilai: 20,
          pembahasan: "x = 27 / 3 = 9.",
        },
        {
          pertanyaan: "Nilai p dari persamaan 2p - 4 = 10 adalah...",
          jawaban_a: "3",
          jawaban_b: "5",
          jawaban_c: "7",
          jawaban_d: "14",
          jawaban_benar: "c" as const,
          nilai: 20,
          pembahasan: "2p = 10 + 4 = 14, sehingga p = 14 / 2 = 7.",
        },
        {
          pertanyaan: "Jika 4k + 2 = 18, maka nilai k adalah...",
          jawaban_a: "4",
          jawaban_b: "5",
          jawaban_c: "3",
          jawaban_d: "16",
          jawaban_benar: "a" as const,
          nilai: 20,
          pembahasan: "4k = 18 - 2 = 16, sehingga k = 4.",
        },
        {
          pertanyaan: "Keliling persegi dengan sisi x cm adalah 36 cm. Nilai x adalah...",
          jawaban_a: "6",
          jawaban_b: "9",
          jawaban_c: "12",
          jawaban_d: "18",
          jawaban_benar: "b" as const,
          nilai: 20,
          pembahasan: "4x = 36, sehingga x = 36 / 4 = 9 cm.",
        },
      ],
    },
    {
      judul: "Perbandingan dan Skala",
      gambar: "/images/seed/ruang-kelas.webp",
      konten:
        "Perbandingan menyatakan hubungan dua besaran sejenis dalam bentuk paling sederhana (a : b). Perbandingan senilai terjadi ketika kenaikan satu besaran diikuti kenaikan besaran lain secara proporsional, sedangkan perbandingan berbalik nilai sebaliknya. Skala peta adalah perbandingan jarak pada peta terhadap jarak sebenarnya.",
      soals: [
        {
          pertanyaan: "Bentuk perbandingan paling sederhana dari 12 : 18 adalah...",
          jawaban_a: "2 : 3",
          jawaban_b: "3 : 4",
          jawaban_c: "4 : 6",
          jawaban_d: "6 : 9",
          jawaban_benar: "a" as const,
          nilai: 20,
          pembahasan: "Bagi kedua bilangan dengan FPB 6: 12/6 : 18/6 = 2 : 3.",
        },
        {
          pertanyaan: "Harga 4 buku tulis adalah Rp16.000. Harga 7 buku tulis yang sama adalah...",
          jawaban_a: "Rp24.000",
          jawaban_b: "Rp28.000",
          jawaban_c: "Rp32.000",
          jawaban_d: "Rp26.000",
          jawaban_benar: "b" as const,
          nilai: 20,
          pembahasan: "Harga 1 buku = Rp4.000, sehingga 7 buku = 7 × Rp4.000 = Rp28.000.",
        },
        {
          pertanyaan: "Skala peta 1 : 200.000. Jika jarak pada peta 5 cm, jarak sebenarnya adalah...",
          jawaban_a: "1 km",
          jawaban_b: "5 km",
          jawaban_c: "10 km",
          jawaban_d: "20 km",
          jawaban_benar: "c" as const,
          nilai: 20,
          pembahasan: "5 × 200.000 cm = 1.000.000 cm = 10 km.",
        },
        {
          pertanyaan: "Pekerjaan selesai oleh 6 pekerja dalam 10 hari. Jika dikerjakan 12 pekerja, selesai dalam...",
          jawaban_a: "4 hari",
          jawaban_b: "5 hari",
          jawaban_c: "8 hari",
          jawaban_d: "20 hari",
          jawaban_benar: "b" as const,
          nilai: 20,
          pembahasan: "Perbandingan berbalik nilai: (6 × 10) / 12 = 5 hari.",
        },
        {
          pertanyaan: "Perbandingan kelereng Andi dan Budi adalah 3 : 5. Jika jumlahnya 40 butir, kelereng Budi adalah...",
          jawaban_a: "15",
          jawaban_b: "20",
          jawaban_c: "25",
          jawaban_d: "30",
          jawaban_benar: "c" as const,
          nilai: 20,
          pembahasan: "Kelereng Budi = (5 / (3+5)) × 40 = (5/8) × 40 = 25 butir.",
        },
      ],
    },
    {
      judul: "Bangun Datar Segiempat dan Segitiga",
      gambar: "/images/seed/diskusi-belajar.webp",
      konten:
        "Bangun datar segiempat meliputi persegi, persegi panjang, jajargenjang, belah ketupat, layang-layang, dan trapesium. Segitiga memiliki jumlah sudut dalam selalu 180° dengan luas L = 1/2 × alas × tinggi.",
      soals: [
        {
          pertanyaan: "Luas persegi panjang dengan panjang 12 cm dan lebar 7 cm adalah...",
          jawaban_a: "38 cm²",
          jawaban_b: "72 cm²",
          jawaban_c: "84 cm²",
          jawaban_d: "96 cm²",
          jawaban_benar: "c" as const,
          nilai: 20,
          pembahasan: "Luas = p × l = 12 × 7 = 84 cm².",
        },
        {
          pertanyaan: "Luas segitiga dengan alas 10 cm dan tinggi 8 cm adalah...",
          jawaban_a: "40 cm²",
          jawaban_b: "80 cm²",
          jawaban_c: "18 cm²",
          jawaban_d: "36 cm²",
          jawaban_benar: "a" as const,
          nilai: 20,
          pembahasan: "Luas = 1/2 × 10 × 8 = 40 cm².",
        },
        {
          pertanyaan: "Jumlah besar ketiga sudut dalam suatu segitiga adalah...",
          jawaban_a: "90°",
          jawaban_b: "180°",
          jawaban_c: "270°",
          jawaban_d: "360°",
          jawaban_benar: "b" as const,
          nilai: 20,
          pembahasan: "Jumlah sudut dalam segitiga selalu tepat 180°.",
        },
        {
          pertanyaan: "Keliling persegi yang memiliki luas 64 cm² adalah...",
          jawaban_a: "16 cm",
          jawaban_b: "24 cm",
          jawaban_c: "32 cm",
          jawaban_d: "64 cm",
          jawaban_benar: "c" as const,
          nilai: 20,
          pembahasan: "Sisi = √64 = 8 cm, keliling = 4 × 8 = 32 cm.",
        },
        {
          pertanyaan: "Luas trapesium dengan sisi sejajar 8 cm dan 12 cm serta tinggi 6 cm adalah...",
          jawaban_a: "48 cm²",
          jawaban_b: "60 cm²",
          jawaban_c: "72 cm²",
          jawaban_d: "120 cm²",
          jawaban_benar: "b" as const,
          nilai: 20,
          pembahasan: "Luas = 1/2 × (8 + 12) × 6 = 1/2 × 20 × 6 = 60 cm².",
        },
      ],
    },
  ];

  const { data: existingMateriRaw } = await supabase.from("materis").select("*").order("id");
  const existingMateri = (existingMateriRaw ?? []) as MateriRow[];
  const existingTitles = new Set(existingMateri.map((m) => m.judul.toLowerCase()));

  let addedMateriCount = 0;
  for (const m of materiData) {
    if (existingTitles.has(m.judul.toLowerCase())) continue;

    const { data: createdMateri, error: mErr } = await supabase
      .from("materis")
      .insert({ judul: m.judul, konten: m.konten, gambar: m.gambar })
      .select("*")
      .single();
    if (mErr || !createdMateri) throw mErr;

    const typedMateri = createdMateri as MateriRow;
    const { error: kErr } = await supabase.from("kuis").insert(
      m.soals.map((soal) => ({
        materi_id: typedMateri.id,
        ...soal,
      }))
    );
    if (kErr) throw kErr;
    addedMateriCount++;
  }

  const { data: allMateriRaw } = await supabase.from("materis").select("*").order("id");
  const allMateri = (allMateriRaw ?? []) as MateriRow[];
  console.log(`[3/7] Total materi siap: ${allMateri.length} bab (+${addedMateriCount} baru)`);

  // =========================================================================
  // 4. Seed Hasil Kuis & Unlock Siswa (hasil_kuis + materi_siswa_unlock)
  // =========================================================================
  const { data: allKuisRaw } = await supabase.from("kuis").select("*").order("id");
  const allKuis = (allKuisRaw ?? []) as KuisRow[];

  if (allSiswa.length >= 6 && allMateri.length >= 4 && allKuis.length > 0) {
    const kuisByMateri = new Map<number, KuisRow[]>();
    for (const k of allKuis) {
      const list = kuisByMateri.get(k.materi_id) ?? [];
      list.push(k);
      kuisByMateri.set(k.materi_id, list);
    }

    // Pola pengerjaan realistis untuk 10 siswa pertama agar dashboard & leaderboard hidup
    const studentProfiles: Array<{ materiDone: number; accuracy: number }> = [
      { materiDone: 5, accuracy: 1.0 },  // Budi Santoso — skor tinggi
      { materiDone: 4, accuracy: 0.9 },  // Siti Aminah
      { materiDone: 4, accuracy: 0.8 },  // Ahmad Rizky
      { materiDone: 3, accuracy: 1.0 },  // Dewi Lestari
      { materiDone: 3, accuracy: 0.8 },  // Fajar Pratama
      { materiDone: 3, accuracy: 0.7 },  // Nadia Putri
      { materiDone: 2, accuracy: 0.9 },  // Raka Mahendra
      { materiDone: 2, accuracy: 0.8 },  // Aulia Rahmawati
      { materiDone: 2, accuracy: 0.6 },  // Dimas Saputra
      { materiDone: 1, accuracy: 0.8 },  // Intan Permata Sari
    ];

    const hasilToInsert: Array<{
      siswa_id: number;
      kuis_id: number;
      jawaban_user: "a" | "b" | "c" | "d";
      skor: number;
      waktu_dikerjakan: string;
    }> = [];
    const unlocksToInsert: Array<{ siswa_id: number; materi_id: number }> = [];

    const nowMs = Date.now();
    studentProfiles.forEach((profile, sIdx) => {
      const siswa = allSiswa[sIdx];
      if (!siswa) return;

      const limitMateri = Math.min(profile.materiDone, allMateri.length);
      for (let mIdx = 0; mIdx < limitMateri; mIdx++) {
        const materi = allMateri[mIdx];
        const kuisList = kuisByMateri.get(materi.id) ?? [];
        if (kuisList.length === 0) continue;

        const targetCorrect = Math.round(kuisList.length * profile.accuracy);
        let earned = 0;
        let maxSkor = 0;

        kuisList.forEach((k, qIdx) => {
          const isCorrect = qIdx < targetCorrect;
          const jawaban: "a" | "b" | "c" | "d" = isCorrect
            ? k.jawaban_benar
            : k.jawaban_benar === "a"
              ? "b"
              : "a";
          const skor = calculateScore(k.jawaban_benar, jawaban, k.nilai);
          earned += skor;
          maxSkor += k.nilai;

          // Sebar waktu pengerjaan dalam 10 hari terakhir agar grafik tren 14 hari terisi
          const daysAgo = (sIdx + mIdx) % 10;
          const attemptDate = new Date(nowMs - daysAgo * 24 * 60 * 60 * 1000).toISOString();

          hasilToInsert.push({
            siswa_id: siswa.id,
            kuis_id: k.id,
            jawaban_user: jawaban,
            skor,
            waktu_dikerjakan: attemptDate,
          });
        });

        const nextMateri = allMateri[mIdx + 1];
        if (nextMateri && canUnlockNext(earned, maxSkor)) {
          unlocksToInsert.push({ siswa_id: siswa.id, materi_id: nextMateri.id });
        }
      }
    });

    if (hasilToInsert.length > 0) {
      const { error: hErr } = await supabase
        .from("hasil_kuis")
        .upsert(hasilToInsert, { onConflict: "siswa_id,kuis_id", ignoreDuplicates: true });
      if (hErr) throw hErr;
    }

    if (unlocksToInsert.length > 0) {
      const { error: uErr } = await supabase
        .from("materi_siswa_unlock")
        .upsert(unlocksToInsert, { onConflict: "siswa_id,materi_id", ignoreDuplicates: true });
      if (uErr) throw uErr;
    }

    console.log(
      `[4/7] Hasil kuis (${hasilToInsert.length} entri) & unlock (${unlocksToInsert.length} entri) siap.`
    );
  }

  // =========================================================================
  // 5. Seed Berita & Kegiatan Sekolah (berita_sekolah) — 6 berita profil umum
  // =========================================================================
  const oldAppBeritaTitles = [
    "Peluncuran Media Pembelajaran Matematika SMPN 1 Merawang",
    "Pelatihan Penggunaan Panel Admin Pembelajaran untuk Guru",
    "Lomba Cerdas Cermat Matematika Antar Kelas Tahun 2026",
    "Kegiatan Literasi Numerasi Pagi di Perpustakaan Sekolah",
    "Persiapan Penilaian Tengah Semester (PTS) Ganjil 2026/2027",
    "Apresiasi Siswa Berprestasi Peringkat Teratas Kuis Bulanan",
  ];

  const beritaSeed = [
    {
      judul: "Upacara Bendera dan Pembukaan Tahun Ajaran Baru 2026/2027",
      kategori: "Kegiatan",
      tanggal_kegiatan: "2026-07-13",
      gambar: "/images/hero-smpn1-merawang.webp",
      ringkasan:
        "Seluruh peserta didik, dewan guru, dan tenaga kependidikan mengikuti apel pembukaan tahun ajaran baru dengan penuh semangat di lapangan utama SMPN 1 Merawang.",
      konten:
        "SMPN 1 Merawang mengawali Tahun Ajaran 2026/2027 dengan pelaksanaan upacara bendera di lapangan utama sekolah yang diikuti oleh seluruh peserta didik kelas VII, VIII, dan IX beserta dewan guru serta staf tata usaha.\n\nDalam amanatnya, kepala sekolah menekankan pentingnya kedisiplinan, sikap saling menghormati antarwarga sekolah, serta menjaga kebersihan dan ketertiban lingkungan belajar setiap hari.\n\nKegiatan pembukaan dilanjutkan dengan perkenalan wali kelas serta sosialisasi tata tertib dan program ekstrakurikuler bagi peserta didik baru.",
      published: true,
    },
    {
      judul: "Program Pembiasaan Literasi Pagi di Perpustakaan Sekolah",
      kategori: "Akademik",
      tanggal_kegiatan: "2026-08-18",
      gambar: "/images/seed/perpustakaan.webp",
      ringkasan:
        "SMPN 1 Merawang melaksanakan kegiatan membaca 15 menit sebelum jam pelajaran pertama untuk menumbuhkan minat baca dan daya nalar peserta didik.",
      konten:
        "Sebagai bagian dari penguatan budaya membaca di sekolah, SMPN 1 Merawang secara rutin melaksanakan program Literasi Pagi setiap hari Selasa dan Kamis bersama wali kelas serta petugas perpustakaan.\n\nPeserta didik memanfaatkan koleksi buku fiksi, ensiklopedia, maupun buku pengetahuan umum di perpustakaan sekolah, kemudian menuliskan ringkasan singkat dari bacaan yang telah dipelajari.\n\nMelalui pembiasaan ini, sekolah berharap wawasan siswa semakin luas serta mampu berkomunikasi dengan santun dan terstruktur.",
      published: true,
    },
    {
      judul: "Lomba Cerdas Cermat dan Pekan Kreativitas Antar Kelas",
      kategori: "Prestasi",
      tanggal_kegiatan: "2026-09-05",
      gambar: "/images/seed/diskusi-belajar.webp",
      ringkasan:
        "Siswa kelas VII–IX berkompetisi dalam lomba cerdas cermat dan pekan kreativitas sekolah untuk mengasah wawasan, sportivitas, dan kerja sama tim.",
      konten:
        "Dalam rangka menyemarakkan kegiatan kesiswaan semester ganjil, SMPN 1 Merawang menyelenggarakan Lomba Cerdas Cermat dan Pekan Kreativitas antar kelas yang diikuti oleh perwakilan seluruh rombongan belajar.\n\nSetiap tim menampilkan kekompakan dalam menjawab pertanyaan pengetahuan umum, sains, bahasa, serta studi sosial. Antusiasme dukungan teman-teman sekelas menjadikan suasana kegiatan terasa hangat dan inspiratif.\n\nPihak sekolah memberikan piagam penghargaan kepada para pemenang sebagai bentuk apresiasi atas usaha dan sportivitas peserta didik.",
      published: true,
    },
    {
      judul: "Workshop Penguatan Pembelajaran Aktif Dewan Guru SMPN 1 Merawang",
      kategori: "Akademik",
      tanggal_kegiatan: "2026-09-14",
      gambar: "/images/seed/lab-komputer.webp",
      ringkasan:
        "Dewan guru mengikuti lokakarya peningkatan metode pembelajaran kolaboratif dan pemanfaatan fasilitas laboratorium komputer sekolah.",
      konten:
        "Dewan guru SMPN 1 Merawang melaksanakan lokakarya internal di ruang laboratorium komputer sekolah untuk memperkuat kualitas proses belajar mengajar pada tahun ajaran berjalan.\n\nDalam sesi diskusi dan praktik, para pendidik berbagi praktik baik penyusunan bahan ajar kreatif, strategi pendampingan kelas yang inklusif, serta pemanfaatan media visual dalam menjelaskan konsep pelajaran.\n\nKegiatan ini menjadi wujud komitmen sekolah dalam menghadirkan pengalaman belajar yang menyenangkan bagi seluruh peserta didik.",
      published: true,
    },
    {
      judul: "Informasi Persiapan Penilaian Tengah Semester (PTS) Ganjil 2026/2027",
      kategori: "Pengumuman",
      tanggal_kegiatan: "2026-09-24",
      gambar: "/images/seed/ruang-kelas.webp",
      ringkasan:
        "Pemberitahuan jadwal belajar mandiri dan ketentuan pelaksanaan Penilaian Tengah Semester Ganjil bagi seluruh kelas VII, VIII, dan IX.",
      konten:
        "Menjelang pelaksanaan Penilaian Tengah Semester (PTS) Ganjil Tahun Ajaran 2026/2027, seluruh peserta didik SMPN 1 Merawang diimbau untuk meninjau kembali catatan pelajaran dan jadwal ujian di ruang kelas masing-masing.\n\nPeserta didik diharapkan hadir 15 menit sebelum bel masuk, mengenakan seragam lengkap sesuai ketentuan, dan menjaga ketertiban selama ujian berlangsung.\n\nOrang tua dan wali siswa diharapkan turut mendampingi jadwal belajar dan istirahat putra-putrinya di rumah.",
      published: true,
    },
    {
      judul: "Apresiasi Siswa Berprestasi Akademik dan Ekstrakurikuler",
      kategori: "Prestasi",
      tanggal_kegiatan: "2026-10-12",
      gambar: "/images/hero-smpn1-merawang.webp",
      ringkasan:
        "Penyerahan piagam penghargaan kepada peserta didik berprestasi pada bidang akademik, olahraga, seni, dan kepramukaan tingkat kecamatan dan kabupaten.",
      konten:
        "Pada apel pagi hari Senin di halaman SMPN 1 Merawang, sekolah menyerahkan piagam penghargaan kepada para siswa yang berhasil menorehkan prestasi di berbagai lomba akademik maupun non-akademik.\n\nPenghargaan ini diberikan atas dedikasi siswa dalam mengharumkan nama sekolah melalui cabang olahraga, seni budaya, kepramukaan, serta kompetisi sains pelajar.\n\nSekolah terus mendukung pengembangan minat dan bakat setiap peserta didik secara seimbang bersama pembina ekstrakurikuler.",
      published: true,
    },
  ];

  const { data: existingBeritaRaw, error: beritaCheckErr } = await supabase
    .from("berita_sekolah")
    .select("id, judul");

  if (beritaCheckErr) {
    console.warn(`[5/7] Lewati berita_sekolah: ${beritaCheckErr.message}`);
  } else {
    // Hapus berita seed lama yang bertema aplikasi agar profil sekolah bersih
    await supabase.from("berita_sekolah").delete().in("judul", oldAppBeritaTitles);

    const { data: refreshedBerita } = await supabase.from("berita_sekolah").select("judul");
    const existingBeritaTitles = new Set(
      ((refreshedBerita ?? existingBeritaRaw ?? []) as Array<{ judul: string }>).map((b) =>
        b.judul.toLowerCase()
      )
    );
    const toInsertBerita = beritaSeed.filter(
      (b) => !existingBeritaTitles.has(b.judul.toLowerCase())
    );
    if (toInsertBerita.length > 0) {
      const { error: insBeritaErr } = await supabase
        .from("berita_sekolah")
        .insert(toInsertBerita);
      if (insBeritaErr) throw insBeritaErr;
    }
    console.log(
      `[5/7] Berita sekolah (profil umum) siap (+${toInsertBerita.length} baru).`
    );
  }

  // =========================================================================
  // 6. Seed Pengaturan Landing Page & Galeri Mosaik 8 Foto (landing_settings)
  // =========================================================================
  const seedGalleryItems = [
    {
      id: "seed-galeri-1",
      judul: "Kegiatan belajar siswa di ruang kelas",
      gambar: "/images/seed/ruang-kelas.webp",
    },
    {
      id: "seed-galeri-2",
      judul: "Lingkungan halaman SMPN 1 Merawang",
      gambar: "/images/hero-smpn1-merawang.webp",
    },
    {
      id: "seed-galeri-3",
      judul: "Kegiatan literasi di perpustakaan sekolah",
      gambar: "/images/seed/perpustakaan.webp",
    },
    {
      id: "seed-galeri-4",
      judul: "Diskusi kelompok bersama guru pembimbing",
      gambar: "/images/seed/diskusi-belajar.webp",
    },
    {
      id: "seed-galeri-5",
      judul: "Praktik pembelajaran di laboratorium komputer",
      gambar: "/images/seed/lab-komputer.webp",
    },
    {
      id: "seed-galeri-6",
      judul: "Suasana belajar aktif bersama dewan guru",
      gambar: "/images/seed/ruang-kelas.webp",
    },
    {
      id: "seed-galeri-7",
      judul: "Kebersamaan warga sekolah di lapangan",
      gambar: "/images/hero-smpn1-merawang.webp",
    },
    {
      id: "seed-galeri-8",
      judul: "Kerja sama kelompok siswa SMPN 1 Merawang",
      gambar: "/images/seed/diskusi-belajar.webp",
    },
  ];

  const seededLandingSettings = {
    ...DEFAULT_LANDING_SETTINGS,
    aboutPhoto: "/images/hero-smpn1-merawang.webp",
    contactAddress: "SMPN 1 Merawang, Kab. Bangka, Kep. Bangka Belitung",
    contactEmail: "info@smpn1merawang.sch.id",
    contactPhone: "+62 717 123456",
    galleryItems: seedGalleryItems,
  };

  const { error: settingsErr } = await supabase.from("landing_settings").upsert(
    {
      id: 1,
      data: seededLandingSettings,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "id" }
  );

  if (settingsErr) {
    console.warn(`[6/7] Lewati landing_settings: ${settingsErr.message}`);
  } else {
    console.log(
      `[6/7] Landing settings & ${seedGalleryItems.length} foto galeri mosaik berhasil di-seed.`
    );
  }

  // =========================================================================
  // 7. Seed Pesan Pengunjung (pesan_pengunjung) — 4 pesan contoh
  // =========================================================================
  const { data: existingPesan, error: pesanCheckErr } = await supabase
    .from("pesan_pengunjung")
    .select("id")
    .limit(1);

  if (pesanCheckErr) {
    console.warn(`[7/7] Lewati pesan_pengunjung: ${pesanCheckErr.message}`);
  } else if (!existingPesan || existingPesan.length === 0) {
    const pesanSeed = [
      {
        nama: "Ibu Rahmawati",
        email: "rahmawati.wali@example.com",
        no_hp: "081271001122",
        keperluan: "Informasi Pembelajaran",
        pesan:
          "Selamat pagi, apakah anak saya di kelas 7A sudah bisa menggunakan NISN untuk latihan kuis Matematika di rumah?",
      },
      {
        nama: "Bapak Hendrianto",
        email: "hendrianto.merawang@example.com",
        no_hp: "081367889900",
        keperluan: "Kalender Akademik",
        pesan:
          "Mohon informasi jadwal Penilaian Tengah Semester Ganjil 2026/2027 untuk kelas 8B. Terima kasih.",
      },
      {
        nama: "Rina Oktaviani",
        email: "rina.oktaviani@example.com",
        no_hp: "085268112233",
        keperluan: "PPDB & Kunjungan",
        pesan:
          "Ingin menanyakan jam operasional tata usaha SMPN 1 Merawang untuk konsultasi mutasi siswa.",
      },
      {
        nama: "Ahmad Fauzi",
        email: "ahmad.fauzi@example.com",
        no_hp: "082177445566",
        keperluan: "Masukan Website",
        pesan:
          "Website profil dan berita kegiatan SMPN 1 Merawang sekarang sangat rapi dan mudah dibaca di ponsel.",
      },
    ];
    const { error: insPesanErr } = await supabase
      .from("pesan_pengunjung")
      .insert(pesanSeed);
    if (insPesanErr) throw insPesanErr;
    console.log(`[7/7] Pesan pengunjung siap: ${pesanSeed.length} pesan contoh.`);
  } else {
    console.log("[7/7] Pesan pengunjung sudah terisi, tidak diduplikasi.");
  }

  console.log("Seeding lengkap Supabase SMPN 1 Merawang selesai!");
}

seed().catch((err) => {
  console.error("Seed error:", err);
  process.exit(1);
});
