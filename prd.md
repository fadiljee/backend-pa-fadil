# PRD 1 — Migrasi Backend Laravel ke Next.js + PostgreSQL

**Produk:** Backend & Panel Admin Media Pembelajaran Matematika (SMPN 1 Merawang) **Klien yang dilayani:** Aplikasi Flutter *Ayo Berhitung* (lihat PRD 2) **Status:** Draft untuk review **Sumber:** `desc_1.md` (backend Laravel 11) dan `desc.md` (klien Flutter)

---

## 1. Ringkasan

Backend saat ini adalah satu codebase **Laravel 11** yang berperan ganda: (a) panel admin web berbasis Blade + AdminLTE untuk guru, dan (b) REST API berbasis Sanctum untuk aplikasi siswa. Dokumen ini mendefinisikan kebutuhan untuk memigrasikan keduanya ke **Next.js** dengan database **PostgreSQL**, **tanpa merusak aplikasi Flutter yang sudah ada**.

**Prinsip migrasi:**

1. **Kompatibilitas kontrak API dulu.** Flutter harus tetap berjalan hanya dengan mengganti base URL.
2. **Perilaku bisnis dipertahankan**, kecuali temuan bug yang dicantumkan eksplisit di bagian 9.
3. **Perbaikan utang teknis dilakukan sambil migrasi**, karena skema baru dibuat dari nol di PostgreSQL.

## 2. Tujuan & Non-Tujuan

### 2.1 Tujuan

| ID | Tujuan | Indikator keberhasilan |
| :-- | :-- | :-- |
| G-1 | Seluruh fitur backend Laravel tersedia di Next.js | 100% endpoint API dan 7 modul admin (ADM-01 s.d. ADM-07) lolos UAT |
| G-2 | Data tersimpan di PostgreSQL tanpa kehilangan | Jumlah baris dan checksum per tabel cocok dengan sumber |
| G-3 | Flutter berjalan tanpa perubahan kontrak | Seluruh alur login → materi → kuis → unlock → profil berhasil dengan build Flutter terbaru |
| G-4 | Temuan bug backend lama teratasi | Seluruh item di bagian 9 berstatus selesai |
| G-5 | Satu stack TypeScript untuk API dan admin | Tidak ada PHP/Blade tersisa di repo baru |

### 2.2 Non-Tujuan

- Tidak membangun ulang aplikasi Flutter (hanya penyesuaian, lihat PRD 2).
- Tidak menambah fitur baru di luar yang disebut eksplisit (leaderboard API termasuk karena sudah ada di controller lama).
- Tidak mengubah desain visual panel admin secara radikal; fokus pada paritas fungsi.

## 3. Pengguna

| Persona | Kanal | Kebutuhan utama |
| :-- | :-- | :-- |
| **Admin / Guru** | Panel admin web (Next.js) | Kelola siswa, materi, kuis; pantau hasil dan leaderboard |
| **Siswa** | Aplikasi Flutter → REST API | Login NISN, baca materi terbuka, kerjakan kuis, lihat skor dan gelar |

## 4. Arsitektur & Tech Stack Target

| Lapisan | Laravel (lama) | Next.js (target) | Catatan |
| :-- | :-- | :-- | :-- |
| Framework | Laravel 11, PHP 8.2 | **Next.js 15+ (App Router), TypeScript, Node 20/22 LTS** | Route Handler untuk `/api/*`, Server Components/Server Actions untuk admin |
| Database | MySQL/MariaDB (diasumsikan) | **PostgreSQL 16+** | Konfirmasi engine sumber di bagian 12 |
| ORM & migrasi | Eloquent + migrations | **Drizzle ORM** (alternatif: Prisma) | Migrasi SQL ter-versioning di repo |
| Validasi | FormRequest / `validate()` | **Zod** | Skema dipakai bersama di API dan form admin |
| Auth siswa | Sanctum token | **Bearer token opak**, hash disimpan di DB | Lihat 6.1 |
| Auth admin | Session custom (`loginStatus`) | **Auth.js (credentials) atau iron-session**, cookie `httpOnly` + `SameSite=Lax` | CSRF ditangani oleh pola Server Action / token |
| UI admin | Blade + AdminLTE + DataTables | **React + Tailwind + shadcn/ui + TanStack Table** | Paritas fungsi, bukan paritas visual |
| Upload gambar | `storage/app/public/materi_gambar` | **Object storage S3-compatible** (R2/S3/MinIO) atau volume persisten | Hindari filesystem lokal bila di-deploy serverless |
| Hashing | bcrypt (`Hash::check`) | **bcryptjs/argon2** | Hash `$2y$` lama harus diuji kompatibilitasnya |
| Test | PHPUnit | **Vitest + Playwright**, uji kontrak API | Lihat bagian 10 |
| Deploy | — | **Docker** (Next.js standalone + Postgres) atau Vercel + Postgres terkelola | Keputusan di bagian 12 |

**Struktur repo yang diusulkan**

```text
app/
  api/                    # Route Handlers (kontrak REST untuk Flutter)
    login/route.ts
    materi/route.ts, materi/[id]/route.ts, materi/cari/route.ts
    materi-unlock/route.ts
    kuis/route.ts, kuis/[id]/route.ts
    hasil-kuis/route.ts
    unlock-next-materi/route.ts
    user/profile/route.ts, user/stats/route.ts
    leaderboard/route.ts
  (admin)/admin/          # Panel admin (dashboard, siswa, materi, kuis, hasil-kuis, leaderboard)
  login/page.tsx
lib/
  db/ (schema, migrations, client)
  auth/ (token siswa, sesi admin)
  services/ (scoring, unlock, gelar)   # logika bisnis murni, mudah diuji
  validators/ (zod)
  storage/ (upload gambar)
```

Logika bisnis (skor, unlock, gelar) ditempatkan di `lib/services` agar **API dan panel admin memakai satu sumber kebenaran**.

## 5. Pemetaan Laravel → Next.js

| Komponen Laravel | Pengganti Next.js |
| :-- | :-- |
| `routes/api.php` + `Api\AuthController` | `app/api/**/route.ts` + `lib/services` |
| `routes/web.php` + controller web | Halaman `app/(admin)/**` + Server Actions |
| Middleware `auth:sanctum` | Helper `requireSiswa(req)` memvalidasi bearer token |
| Middleware `LoggedIn` / `LoginCheck` | `middleware.ts` + guard sesi admin |
| Rule `App\Rules\LoginCheck` | Fungsi `verifyAdminCredentials()` |
| Model Eloquent + relasi | Skema Drizzle + relasi |
| `HasApiTokens` / `personal_access_tokens` | Tabel `siswa_tokens` |
| Blade views | Komponen React |
| `Storage::disk('public')` | Modul `lib/storage` |
| Pagination Eloquent | Query `limit/offset` + komponen tabel |

## 6. Kebutuhan Fungsional

### 6.1 REST API Siswa (kontrak kompatibel Flutter)

Base path: `/api`. Semua endpoint selain `POST /login` wajib `Authorization: Bearer <token>`. Format respons JSON, status HTTP konsisten.

| ID | Method & Path | Request | Respons sukses | Error |
| :-- | :-- | :-- | :-- | :-- |
| API-01 | `POST /login` | `{ "nisn": "1234567890" }` (10 digit) | `200 { token, data_siswa: { id, nisn, nama, kelas, sekolah, alamat, profile_picture } }` | `422` format NISN salah, `404` NISN tidak terdaftar |
| API-02 | `GET /user/profile` | — | `200 { id, nisn, nama, kelas, sekolah, alamat, profile_picture }` | `401` |
| API-03 | `GET /materi` | — | `200` array `{ id, judul, ... }` terurut `id` naik | `401` |
| API-03b | `GET /materi/{id}` | — | `200 { id, judul, konten, gambar_url }` | `401`, `404` |
| API-04 | `GET /materi/cari?judul=` | `judul` min. 3 karakter | `200` array materi | `422`, `401` |
| API-05 | `GET /kuis` dan `GET /kuis/{materi_id}` | — | `200 { kuis: [ { id, materi_id, pertanyaan, jawaban_a..d, jawaban_benar, nilai, pembahasan } ] }` | `401`, `404` |
| API-06 | `POST /hasil-kuis` | `{ kuis_id, jawaban_user: "a"\|"b"\|"c"\|"d" }` | `200 { hasil: { ... , skor }, total_skor }` | `422`, `404` kuis tidak ada |
| API-07 | `GET /user/stats` | — | `200 { total_skor, gelar }` | `401` |
| API-08 | `POST /unlock-next-materi` | `{ materi_id }` | `200 { message, unlocked: boolean }` | `422`, `401` |
| API-09 | `GET /materi-unlock` | — | `200 { unlocked_materi_ids: [1, ...] }` (ID 1 selalu ada) | `401` |
| API-10 | `GET /leaderboard` *(baru, controller lama sudah ada)* | `?limit=` (default 10) | `200` array `{ rank, nama, kelas, total_skor, gelar }` | `401` |

**Aturan kontrak:**

- Kunci respons (`token`, `data_siswa`, `kuis`, `unlocked_materi_ids`, `total_skor`, `gelar`, `gambar_url`) **tidak boleh berubah nama** karena dibaca langsung oleh Flutter.
- `gambar_url` selalu berupa **URL absolut** yang dapat diakses klien.
- `POST /login` menghapus token lama siswa tersebut lalu menerbitkan token baru (perilaku Laravel dipertahankan: satu sesi aktif per siswa).
- Error memakai bentuk seragam: `{ message: string, errors?: Record<string,string[]> }`.
- Tambahkan header CORS yang dapat dikonfigurasi (wajib bila Flutter Web dipakai).

**Autentikasi token siswa:** token acak 32 byte (`crypto.randomBytes`), dikirim ke klien sekali, disimpan sebagai **hash SHA-256** di tabel `siswa_tokens` dengan `siswa_id`, `last_used_at`, `expires_at` (opsional, default tidak kedaluwarsa agar perilaku sama dengan Sanctum; lihat pertanyaan terbuka).

### 6.2 Panel Admin Web

| ID | Fitur | Kebutuhan |
| :-- | :-- | :-- |
| ADM-01 | Autentikasi admin | Login email + password dari `data_user`, logout menghapus sesi, rute admin diproteksi, admin yang sudah login diarahkan dari halaman login ke dashboard. Rate limit percobaan login. |
| ADM-02 | Dashboard | Total siswa, total materi, total kuis, 5 materi terbaru, **grafik berbasis data nyata** (menggantikan data contoh statis). |
| ADM-03 | CRUD Siswa | Validasi: nama min. 5 karakter, NISN tepat 10 digit dan unik, kelas wajib. Field baru opsional: `sekolah`, `alamat`, foto profil. |
| ADM-04 | CRUD Materi | Judul, konten teks, gambar opsional (jpg/jpeg/png, maks. 2 MB). Ganti gambar menghapus file lama; hapus materi menghapus file gambarnya. |
| ADM-05 | CRUD Kuis | Pilihan ganda A–D, kunci jawaban, pembahasan (opsional), relasi ke materi. Form memakai huruf kecil `a–d` secara internal. |
| ADM-06 | Monitoring hasil kuis | Daftar siswa yang punya riwayat, cari nama, filter kelas, pagination 10; detail riwayat per siswa dengan pagination 15 (soal, jawaban siswa, skor, waktu). |
| ADM-07 | Leaderboard & gelar | Peringkat total skor (dibatasi maks. 100), badge gelar, pagination 10. |

## 7. Aturan Bisnis (dipertahankan dari sistem lama)

1. **Penilaian:** jawaban benar bernilai `kuis.nilai` (default 10), salah bernilai 0.
2. **Total skor** untuk statistik dan leaderboard dibatasi maksimal **100**.
3. **Materi 1 selalu terbuka.** Materi `N+1` terbuka bila syarat skor pada materi `N` terpenuhi (lihat 9.1 untuk koreksi aturan).
4. **Gelar:**

| Total skor | Gelar |
| :-- | :-- |
| 81 – 100 | Juara Matematika |
| 61 – 80 | Master Operasi Hitung |
| 41 – 60 | Ahli Hitung Dasar |
| 21 – 40 | Penjelajah Angka |
| 1 – 20 | Pemula Matematika |
| 0 | Belum Ada Gelar |

Semua fungsi di atas harus berupa **fungsi murni dengan unit test** (`calculateScore`, `computeGelar`, `canUnlockNext`).

## 8. Desain Database PostgreSQL

Skema dibuat ulang (bukan sekadar konversi), dengan perbaikan tipe dan constraint.

| Tabel | Kolom utama | Constraint & indeks |
| :-- | :-- | :-- |
| `data_user` (admin) | `id` PK identity, `nama`, `no_hp`, `email`, `password_hash`, `created_at`, `updated_at` | `UNIQUE(email)` |
| `data_siswa` | `id` PK, `nama`, **`nisn VARCHAR(10)`**, `kelas`, `sekolah` null, `alamat` null, `profile_picture` null, timestamps | `UNIQUE(nisn)`, `CHECK (nisn ~ '^[0-9]{10}$')`, indeks `kelas` |
| `materis` | `id` PK, `judul`, `konten` text, `gambar` null (**simpan key relatif saja**), timestamps | indeks `judul` (trigram opsional untuk pencarian) |
| `kuis` | `id` PK, `materi_id` FK, `pertanyaan` text, `jawaban_a..d`, `jawaban_benar` enum `('a','b','c','d')`, `nilai` int default 10, **`pembahasan` text null**, timestamps | FK `ON DELETE CASCADE`, indeks `materi_id` |
| `hasil_kuis` | `id` PK, `siswa_id` FK, `kuis_id` FK, `jawaban_user` enum a–d, `skor` int, `waktu_dikerjakan` timestamptz, timestamps | FK cascade, **`UNIQUE(siswa_id, kuis_id)`** (lihat 9.2), indeks `(siswa_id)`, `(kuis_id)` |
| `materi_siswa_unlock` | `id` PK, `siswa_id` FK, `materi_id` FK, timestamps | `UNIQUE(siswa_id, materi_id)` |
| `siswa_tokens` | `id` PK, `siswa_id` FK, `token_hash` char(64), `created_at`, `last_used_at`, `expires_at` null | `UNIQUE(token_hash)`, indeks `siswa_id` |

**Catatan desain:**

- **NISN disimpan sebagai teks 10 digit.** Kolom integer di sistem lama berisiko menghilangkan angka nol di depan dan melewati batas `INT` 32-bit pada beberapa engine.
- Gunakan `timestamptz` untuk seluruh waktu; zona waktu tampilan diatur di aplikasi (WIB).
- Leaderboard dihitung dengan `LEAST(SUM(skor), 100)` atau view termaterialisasi bila data besar.
- Seed awal: satu akun admin, dan materi serta kuis hasil migrasi.

## 9. Temuan Backend Lama yang Wajib Diperbaiki saat Migrasi

| # | Temuan | Perbaikan di sistem baru |
| :-- | :-- | :-- |
| 1 | Rute `GET /materi/{id}` didefinisikan sebelum `/materi/cari`, sehingga pencarian tertangkap `{id}` | Di Next.js, folder statis `materi/cari` otomatis diprioritaskan; tambahkan uji rute |
| 2 | Case jawaban tidak konsisten: API `a–d`, admin `A–D`, enum DB `a–d` | Seragamkan **huruf kecil** di DB, API, dan form; normalisasi input dengan Zod |
| 3 | Kolom `pembahasan` dipakai kode tetapi tidak ada di migrasi kuis | Masuk skema awal (nullable) |
| 4 | Path gambar tidak konsisten (`materi_gambar` vs `materi/`) | Satu fungsi `getGambarUrl(key)` di `lib/storage`; kolom hanya menyimpan key relatif |
| 5 | Grafik dashboard memakai data contoh dan query `$peringkatSiswa` memakai `where('id')` tanpa pembanding | Grafik dan peringkat dihitung dari data nyata |
| 6 | `AuthController::leaderboard()` belum terdaftar di rute | Didaftarkan sebagai API-10 |
| 7 | Respons API membocorkan `jawaban_benar` ke klien | Tetap dipertahankan di fase 1 demi kompatibilitas Flutter; rencanakan fase 2 (lihat 9.3) |

### 9.1 Koreksi aturan unlock (butuh keputusan)

Backend lama membuka materi berikutnya bila **`SUM(skor)` materi ≥ 70 (angka absolut)**, sedangkan Flutter memicu pemanggilan unlock bila **persentase ≥ 70%**. Keduanya hanya setara bila total skor maksimum materi tepat 100. Bila sebuah materi punya 5 soal × 10 poin (maks. 50), siswa yang menjawab semua benar tidak akan pernah membuka materi berikutnya. **Rekomendasi:** server menghitung `skor_didapat / skor_maksimum_materi ≥ 70%`. Ini perubahan perilaku yang harus disetujui pemilik produk.

### 9.2 Pengerjaan ulang kuis

Tanpa constraint unik, siswa yang mengirim jawaban berulang untuk soal yang sama dapat menggandakan skor. **Rekomendasi:** `UNIQUE(siswa_id, kuis_id)` dengan *upsert* (jawaban terbaru menggantikan yang lama), sehingga skor tidak bisa dimanipulasi dan pengulangan kuis tetap diizinkan.

### 9.3 Fase 2: validasi jawaban di server

Ubah `GET /kuis/{id}` agar tidak mengirim `jawaban_benar`, dan `POST /hasil-kuis` mengembalikan `benar: boolean` serta `pembahasan`. Membutuhkan rilis Flutter baru, jadi dijadwalkan setelah paritas tercapai.

## 10. Persyaratan Non-Fungsional

| Area | Persyaratan |
| :-- | :-- |
| **Keamanan** | HTTPS wajib; token disimpan sebagai hash; password admin di-hash (bcrypt/argon2); rate limit pada `POST /login` (siswa dan admin); validasi Zod di semua input; sanitasi konten materi bila dirender sebagai HTML; header keamanan (CSP, HSTS); secret hanya lewat variabel lingkungan |
| **Validasi upload** | Cek MIME dan magic bytes (bukan hanya ekstensi), maks. 2 MB, nama file diacak |
| **Performa** | p95 endpoint baca < 300 ms pada 500 siswa aktif; tidak ada query N+1 pada daftar kuis/hasil; connection pooling (PgBouncer atau pool bawaan driver) |
| **Ketersediaan** | Backup harian PostgreSQL, uji restore minimal sekali sebelum go-live |
| **Observabilitas** | Log terstruktur, ID permintaan, pelaporan error (Sentry atau setara), endpoint `GET /api/health` |
| **Kualitas** | TypeScript strict, ESLint, CI menjalankan lint + unit + uji kontrak pada setiap PR |
| **Pagination** | Tetap 10 (daftar/leaderboard) dan 15 (riwayat) |

## 11. Strategi Migrasi Data & Cutover

1. **Ekstrak** data dari DB lama (`mysqldump` atau akses langsung).
2. **Transformasi & muat** ke PostgreSQL memakai `pgloader` atau skrip TypeScript: NISN diubah ke teks 10 digit (pad nol bila perlu), enum jawaban dipaksa huruf kecil, `gambar` dinormalisasi menjadi key relatif.
3. **Gambar:** salin isi `storage/app/public/materi_gambar` ke storage baru dan verifikasi tiap baris `materis.gambar` punya file.
4. **Admin:** salin `data_user`. Uji login dengan hash `$2y$` lama; bila pustaka tidak menerima, ganti prefix menjadi `$2b$` (algoritma setara) atau paksa reset password.
5. **Token Sanctum tidak dimigrasi.** Seluruh siswa wajib login ulang satu kali setelah cutover (komunikasikan ke guru).
6. **Validasi:** hitung jumlah baris, `SUM(skor)` per siswa, dan jumlah unlock; bandingkan hasil API lama dan baru untuk sampel siswa.
7. **Cutover:** freeze tulis di sistem lama → migrasi final → ganti base URL / DNS → pantau 48 jam. **Rollback:** arahkan kembali base URL ke Laravel (sistem lama tetap hidup dalam mode baca selama 2 minggu).

## 12. Milestone

| Fase | Cakupan | Kriteria selesai |
| :-- | :-- | :-- |
| **0. Fondasi** | Repo, CI, skema Postgres + migrasi, seed, helper auth | Migrasi berjalan bersih di DB kosong |
| **1. API paritas** | API-01 s.d. API-10, uji kontrak terhadap Flutter | Seluruh alur Flutter berjalan di staging |
| **2. Panel admin** | ADM-01 s.d. ADM-07, upload gambar | UAT guru lulus |
| **3. Migrasi data & hardening** | ETL, backup, rate limit, observabilitas, load test | Rekonsiliasi data 100% cocok |
| **4. Cutover** | Go-live, pemantauan, rollback siap | 48 jam tanpa insiden severity tinggi |
| **5. Pasca-migrasi** | Fase 2 validasi server (9.3), matikan Laravel | Laravel dipensiunkan |

## 13. Strategi Pengujian

- **Unit:** `calculateScore`, `computeGelar`, `canUnlockNext` (termasuk batas 0, 20/21, 40/41, 60/61, 80/81, 100).
- **Uji kontrak API:** snapshot bentuk respons setiap endpoint dibandingkan dengan respons Laravel lama.
- **Integrasi:** alur login → materi → kuis → unlock → stats pada database uji.
- **E2E admin (Playwright):** login, CRUD siswa/materi/kuis, upload gambar, filter hasil kuis.
- **Keamanan:** akses tanpa token → 401, akses lintas siswa tidak mungkin, upload file palsu ditolak.
- **Regresi Flutter:** jalankan build Flutter terhadap staging sebelum go-live.

## 14. Risiko

| Risiko | Dampak | Mitigasi |
| :-- | :-- | :-- |
| Perubahan kecil pada kunci JSON memutus Flutter | Aplikasi siswa error | Uji kontrak otomatis, jangan ubah nama kunci |
| Hash password `$2y$` tidak terbaca | Admin tidak bisa login | Uji di fase 0; siapkan skrip reset |
| Penyimpanan gambar hilang pada deploy serverless | Gambar materi 404 | Wajib object storage atau volume persisten |
| Perubahan aturan unlock (9.1) mengejutkan pengguna | Siswa terkunci atau terbuka tak terduga | Persetujuan tertulis, catat di rilis |
| Siswa harus login ulang | Keluhan di hari pertama | Pengumuman sebelum cutover |
| Koneksi Postgres habis pada serverless | Error 500 saat ramai | Connection pooling, batasi koneksi per instance |

## 15. Pertanyaan Terbuka

1. Database sumber saat ini MySQL/MariaDB atau lainnya?
2. Target hosting: VPS + Docker, Vercel + Postgres terkelola, atau lainnya? (menentukan storage gambar dan pooling)
3. Aturan unlock: setuju beralih ke persentase ≥ 70% (9.1)?
4. Pengerjaan ulang kuis: diizinkan dengan upsert (9.2) atau dikunci setelah sekali kirim?
5. Apakah token siswa perlu kedaluwarsa (mis. 30 hari)? Saat ini tidak.
6. Batas skor 100 pada leaderboard: dipertahankan walau jumlah materi bertambah?
7. Apakah ada lebih dari satu admin/peran (mis. guru vs superadmin)? Saat ini hanya satu jenis.
8. Apakah panel admin perlu fitur impor siswa massal (CSV)? Tidak ada di sistem lama.

## 16. Definition of Done

- Seluruh kebutuhan fungsional 6.1 dan 6.2 lulus UAT.
- Uji kontrak API hijau terhadap respons referensi Laravel.
- Rekonsiliasi data 100% cocok, backup dan restore terbukti.
- Dokumen operasional (deploy, rollback, rotasi secret) tersedia.
- Temuan 1–6 di bagian 9 selesai; keputusan 9.1–9.3 tercatat.
