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

async function seed() {
  console.log("Memulai seeding Supabase SMPN 1 Merawang...");
  const supabase = getSupabaseAdmin();

  // 1. Seed Admin & Guru (data_user) dari konfigurasi .env
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
  console.log(`Admin siap: ${env.SEED_ADMIN_EMAIL} & ${env.SEED_GURU_EMAIL}`);

  // 2. Seed Data Siswa (data_siswa)
  const siswaSeed = [
    {
      nama: "Budi Santoso",
      nisn: "0012345678",
      kelas: "7A",
      sekolah: "SMPN 1 Merawang",
      alamat: "Jl. Raya Merawang No. 12",
    },
    {
      nama: "Siti Aminah",
      nisn: "0012345679",
      kelas: "7A",
      sekolah: "SMPN 1 Merawang",
      alamat: "Desa Air Anyir, Merawang",
    },
    {
      nama: "Ahmad Rizky",
      nisn: "0012345680",
      kelas: "7B",
      sekolah: "SMPN 1 Merawang",
      alamat: "Desa Balun Ijuk, Merawang",
    },
    {
      nama: "Dewi Lestari",
      nisn: "0012345681",
      kelas: "7B",
      sekolah: "SMPN 1 Merawang",
      alamat: "Desa Riding Panjang, Merawang",
    },
    {
      nama: "Fajar Pratama",
      nisn: "0012345682",
      kelas: "8A",
      sekolah: "SMPN 1 Merawang",
      alamat: "Desa Jurung, Merawang",
    },
    {
      nama: "Nadia Putri",
      nisn: "0012345683",
      kelas: "8A",
      sekolah: "SMPN 1 Merawang",
      alamat: "Desa Baturusa, Merawang",
    },
  ];

  const { error: siswaErr } = await supabase
    .from("data_siswa")
    .upsert(siswaSeed, { onConflict: "nisn", ignoreDuplicates: true });
  if (siswaErr) throw siswaErr;

  const { data: allSiswaRaw } = await supabase.from("data_siswa").select("*").order("id");
  const allSiswa = (allSiswaRaw ?? []) as SiswaRow[];
  console.log(`Total siswa di Supabase: ${allSiswa.length}`);

  // 3. Seed Materi & Kuis (hanya jika tabel materis masih kosong)
  const { data: existingMateri } = await supabase.from("materis").select("*").order("id");
  let allMateri = (existingMateri ?? []) as MateriRow[];

  if (allMateri.length === 0) {
    const materiData = [
      {
        judul: "Operasi Hitung Bilangan Bulat",
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
            nilai: 10,
            pembahasan: "-5 + 12 sama dengan 12 - 5 = 7.",
          },
          {
            pertanyaan: "Hasil dari 8 × (-3) adalah...",
            jawaban_a: "24",
            jawaban_b: "-11",
            jawaban_c: "-24",
            jawaban_d: "11",
            jawaban_benar: "c" as const,
            nilai: 10,
            pembahasan: "Bilangan positif dikali negatif hasilnya negatif: 8 × (-3) = -24.",
          },
          {
            pertanyaan: "Hasil dari (-18) : (-3) adalah...",
            jawaban_a: "-6",
            jawaban_b: "6",
            jawaban_c: "-15",
            jawaban_d: "15",
            jawaban_benar: "b" as const,
            nilai: 10,
            pembahasan: "Negatif dibagi negatif menghasilkan positif: 18 : 3 = 6.",
          },
          {
            pertanyaan: "Suhu di puncak gunung awalnya -4°C, lalu turun 5°C. Suhu sekarang adalah...",
            jawaban_a: "-9°C",
            jawaban_b: "-1°C",
            jawaban_c: "1°C",
            jawaban_d: "9°C",
            jawaban_benar: "a" as const,
            nilai: 10,
            pembahasan: "Turun berarti dikurangi: -4 - 5 = -9°C.",
          },
          {
            pertanyaan: "Hasil dari 15 - (-7) adalah...",
            jawaban_a: "8",
            jawaban_b: "-8",
            jawaban_c: "22",
            jawaban_d: "-22",
            jawaban_benar: "c" as const,
            nilai: 10,
            pembahasan: "15 - (-7) = 15 + 7 = 22.",
          },
        ],
      },
      {
        judul: "Pecahan dan Desimal",
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
            nilai: 10,
            pembahasan: "3 dibagi 4 = 0,75.",
          },
          {
            pertanyaan: "Hasil dari 1/2 + 1/4 adalah...",
            jawaban_a: "2/6",
            jawaban_b: "3/4",
            jawaban_c: "1/4",
            jawaban_d: "2/4",
            jawaban_benar: "b" as const,
            nilai: 10,
            pembahasan: "1/2 = 2/4, sehingga 2/4 + 1/4 = 3/4.",
          },
          {
            pertanyaan: "Hasil dari 2/3 × 3/5 adalah...",
            jawaban_a: "2/5",
            jawaban_b: "5/8",
            jawaban_c: "6/8",
            jawaban_d: "3/5",
            jawaban_benar: "a" as const,
            nilai: 10,
            pembahasan: "(2 × 3) / (3 × 5) = 6/15 = 2/5.",
          },
          {
            pertanyaan: "Bentuk pecahan paling sederhana dari 0,6 adalah...",
            jawaban_a: "6/100",
            jawaban_b: "3/5",
            jawaban_c: "2/5",
            jawaban_d: "3/10",
            jawaban_benar: "b" as const,
            nilai: 10,
            pembahasan: "0,6 = 6/10, disederhanakan dengan dibagi 2 menjadi 3/5.",
          },
          {
            pertanyaan: "Hasil dari 4/5 - 1/5 adalah...",
            jawaban_a: "3/5",
            jawaban_b: "5/5",
            jawaban_c: "3/10",
            jawaban_d: "4/10",
            jawaban_benar: "a" as const,
            nilai: 10,
            pembahasan: "Karena penyebut sudah sama, langsung kurangkan pembilang: (4 - 1)/5 = 3/5.",
          },
        ],
      },
      {
        judul: "Bentuk Aljabar Dasar",
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
            nilai: 10,
            pembahasan: "(3 + 5 - 2)x = 6x.",
          },
          {
            pertanyaan: "Koefisien dari variabel y pada bentuk 4x - 7y + 9 adalah...",
            jawaban_a: "4",
            jawaban_b: "7",
            jawaban_c: "-7",
            jawaban_d: "9",
            jawaban_benar: "c" as const,
            nilai: 10,
            pembahasan: "Tanda minus ikut ke koefisien y, yaitu -7.",
          },
          {
            pertanyaan: "Hasil dari 2(3a + 4) adalah...",
            jawaban_a: "6a + 4",
            jawaban_b: "5a + 6",
            jawaban_c: "6a + 8",
            jawaban_d: "6a + 6",
            jawaban_benar: "c" as const,
            nilai: 10,
            pembahasan: "Gunakan sifat distributif: 2×3a + 2×4 = 6a + 8.",
          },
          {
            pertanyaan: "Jika x = 3, maka nilai dari 4x - 5 adalah...",
            jawaban_a: "7",
            jawaban_b: "12",
            jawaban_c: "17",
            jawaban_d: "2",
            jawaban_benar: "a" as const,
            nilai: 10,
            pembahasan: "4(3) - 5 = 12 - 5 = 7.",
          },
          {
            pertanyaan: "Konstanta dari bentuk aljabar 5p + 2q - 11 adalah...",
            jawaban_a: "5",
            jawaban_b: "2",
            jawaban_c: "11",
            jawaban_d: "-11",
            jawaban_benar: "d" as const,
            nilai: 10,
            pembahasan: "Konstanta adalah suku tanpa variabel, yaitu -11.",
          },
        ],
      },
      {
        judul: "Persamaan Linear Satu Variabel",
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
            nilai: 10,
            pembahasan: "x = 15 - 7 = 8.",
          },
          {
            pertanyaan: "Penyelesaian dari 3x = 27 adalah...",
            jawaban_a: "x = 9",
            jawaban_b: "x = 24",
            jawaban_c: "x = 30",
            jawaban_d: "x = 81",
            jawaban_benar: "a" as const,
            nilai: 10,
            pembahasan: "x = 27 / 3 = 9.",
          },
          {
            pertanyaan: "Nilai p dari persamaan 2p - 4 = 10 adalah...",
            jawaban_a: "3",
            jawaban_b: "5",
            jawaban_c: "7",
            jawaban_d: "14",
            jawaban_benar: "c" as const,
            nilai: 10,
            pembahasan: "2p = 10 + 4 = 14, sehingga p = 14 / 2 = 7.",
          },
          {
            pertanyaan: "Jika 4k + 2 = 18, maka nilai k adalah...",
            jawaban_a: "4",
            jawaban_b: "5",
            jawaban_c: "3",
            jawaban_d: "16",
            jawaban_benar: "a" as const,
            nilai: 10,
            pembahasan: "4k = 18 - 2 = 16, sehingga k = 4.",
          },
          {
            pertanyaan: "Keliling persegi dengan sisi x cm adalah 36 cm. Nilai x adalah...",
            jawaban_a: "6",
            jawaban_b: "9",
            jawaban_c: "12",
            jawaban_d: "18",
            jawaban_benar: "b" as const,
            nilai: 10,
            pembahasan: "4x = 36, sehingga x = 36 / 4 = 9 cm.",
          },
        ],
      },
    ];

    const insertedMateris: MateriRow[] = [];
    for (const m of materiData) {
      const { data: createdMateri, error: mErr } = await supabase
        .from("materis")
        .insert({ judul: m.judul, konten: m.konten })
        .select("*")
        .single();
      if (mErr || !createdMateri) throw mErr;

      const typedMateri = createdMateri as MateriRow;
      insertedMateris.push(typedMateri);

      const { error: kErr } = await supabase.from("kuis").insert(
        m.soals.map((soal) => ({
          materi_id: typedMateri.id,
          ...soal,
        }))
      );
      if (kErr) throw kErr;
    }

    allMateri = insertedMateris;
    console.log(`Berhasil seed ${allMateri.length} materi dan soal kuisnya.`);
  }

  // 4. Seed Contoh Hasil Kuis & Unlock (hanya jika hasil_kuis masih kosong)
  const { data: existingHasil } = await supabase.from("hasil_kuis").select("id").limit(1);
  if ((!existingHasil || existingHasil.length === 0) && allSiswa.length >= 3 && allMateri.length >= 2) {
    const { data: allKuisRaw } = await supabase.from("kuis").select("*");
    const allKuis = (allKuisRaw ?? []) as KuisRow[];
    const kuisMateri1 = allKuis.filter((k) => k.materi_id === allMateri[0].id);
    const kuisMateri2 = allKuis.filter((k) => k.materi_id === allMateri[1].id);

    const [budi, siti, ahmad] = allSiswa;
    const hasilToInsert: {
      siswa_id: number;
      kuis_id: number;
      jawaban_user: "a" | "b" | "c" | "d";
      skor: number;
    }[] = [];

    for (const k of [...kuisMateri1, ...kuisMateri2]) {
      hasilToInsert.push({
        siswa_id: budi.id,
        kuis_id: k.id,
        jawaban_user: k.jawaban_benar,
        skor: calculateScore(k.jawaban_benar, k.jawaban_benar, k.nilai),
      });
    }

    for (let i = 0; i < kuisMateri1.length; i++) {
      const k = kuisMateri1[i];
      const jawaban = i < 4 ? k.jawaban_benar : k.jawaban_benar === "a" ? "b" : "a";
      hasilToInsert.push({
        siswa_id: siti.id,
        kuis_id: k.id,
        jawaban_user: jawaban,
        skor: calculateScore(k.jawaban_benar, jawaban, k.nilai),
      });
    }

    for (let i = 0; i < kuisMateri1.length; i++) {
      const k = kuisMateri1[i];
      const jawaban = i < 2 ? k.jawaban_benar : k.jawaban_benar === "a" ? "b" : "a";
      hasilToInsert.push({
        siswa_id: ahmad.id,
        kuis_id: k.id,
        jawaban_user: jawaban,
        skor: calculateScore(k.jawaban_benar, jawaban, k.nilai),
      });
    }

    await supabase
      .from("hasil_kuis")
      .upsert(hasilToInsert, { onConflict: "siswa_id,kuis_id", ignoreDuplicates: true });

    const maxM1 = kuisMateri1.reduce((acc, k) => acc + k.nilai, 0);
    const maxM2 = kuisMateri2.reduce((acc, k) => acc + k.nilai, 0);
    const unlocks: { siswa_id: number; materi_id: number }[] = [];

    if (canUnlockNext(maxM1, maxM1)) {
      unlocks.push({ siswa_id: budi.id, materi_id: allMateri[1].id });
      unlocks.push({ siswa_id: siti.id, materi_id: allMateri[1].id });
    }
    if (allMateri[2] && canUnlockNext(maxM2, maxM2)) {
      unlocks.push({ siswa_id: budi.id, materi_id: allMateri[2].id });
    }

    if (unlocks.length > 0) {
      await supabase
        .from("materi_siswa_unlock")
        .upsert(unlocks, { onConflict: "siswa_id,materi_id", ignoreDuplicates: true });
    }

    console.log("Contoh hasil kuis dan status unlock siswa berhasil di-seed.");
  }

  console.log("Seeding Supabase selesai!");
}

seed().catch((err) => {
  console.error("Seed error:", err);
  process.exit(1);
});
