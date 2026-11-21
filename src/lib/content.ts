export interface NavMenuItem {
  label: string;
  targetId: string;
}

export interface HeroSlideData {
  id: string;
  title: string;
  description: string;
  imageUrl: string | null;
}

export interface StatItemData {
  id: string;
  icon: "trophy" | "users" | "students" | "cap";
  target: number;
  suffix: string;
  label: string;
}

export interface MosaicSlotData {
  id: string;
  alt: string;
  imageUrl: string | null;
}

export interface LandingNewsItem {
  id: number | string;
  href: string;
  title: string;
  excerpt: string;
  category?: string;
  content?: string;
  dateLabel: string;
  dateIso: string;
  imageUrl: string | null;
}

export interface AnnouncementItem {
  slug: string;
  title: string;
  date: string;
  summary: string;
  content: string;
}

export const SITE_INFO = {
  schoolName: "SMPN 1 Merawang",
  subtitle: "Profil Sekolah",
  searchPlaceholder: "Cari berita…",
  copyright: "© 2026 SMPN 1 Merawang. Hak cipta dilindungi.",
};

export const NAV_MENU: NavMenuItem[] = [
  { label: "Beranda", targetId: "home" },
  { label: "Profil", targetId: "tentang" },
  { label: "Statistik", targetId: "statistik" },
  { label: "Galeri", targetId: "galeri" },
  { label: "Berita", targetId: "berita" },
  { label: "Kontak", targetId: "kontak" },
];

export const HERO_SLIDES_CONTENT: HeroSlideData[] = [
  {
    id: "ruang-kelas",
    title: "Ruang Kelas",
    description: "Ruang belajar yang nyaman, tertib, dan kondusif bagi peserta didik.",
    imageUrl: "/images/seed/ruang-kelas.webp",
  },
  {
    id: "perpustakaan",
    title: "Perpustakaan",
    description: "Pusat literasi dengan koleksi buku bacaan dan referensi pelajaran.",
    imageUrl: "/images/seed/perpustakaan.webp",
  },
  {
    id: "lapangan-sekolah",
    title: "Lingkungan Sekolah",
    description: "Halaman luas untuk upacara, olahraga, dan kebersamaan warga sekolah.",
    imageUrl: "/images/hero-smpn1-merawang.webp",
  },
  {
    id: "kegiatan-belajar",
    title: "Kegiatan Belajar",
    description: "Pembelajaran aktif dan diskusi terbimbing bersama dewan guru.",
    imageUrl: "/images/seed/diskusi-belajar.webp",
  },
  {
    id: "lab-komputer",
    title: "Lab Komputer",
    description: "Fasilitas laboratorium komputer untuk menunjang keterampilan teknologi siswa.",
    imageUrl: "/images/seed/lab-komputer.webp",
  },
];

export const WELCOME_CONTENT = {
  title: "Selamat Datang di SMPN 1 Merawang",
  paragraph:
    "SMPN 1 Merawang merupakan sekolah menengah pertama negeri di Kecamatan Merawang, Kabupaten Bangka, yang berkomitmen menyelenggarakan pendidikan berkualitas dalam lingkungan belajar yang tertib, aman, dan ramah bagi seluruh peserta didik. Bersama tenaga pendidik yang berdedikasi, sekolah membina keseimbangan antara prestasi akademik, penguatan karakter, kedisiplinan, serta pengembangan minat dan bakat melalui beragam kegiatan ekstrakurikuler.",
  ctaLabel: "Lihat Berita & Kegiatan",
  ctaTargetId: "berita",
};

export const STATS_HEADER = {
  title: "Sekilas Tentang SMPN 1 Merawang",
  subtitle: "Sekolah Menengah Pertama Negeri di Kecamatan Merawang, Kabupaten Bangka",
};

export const DEFAULT_STATS: StatItemData[] = [
  { id: "pengabdian", icon: "trophy", target: 20, suffix: "+", label: "Tahun Pengabdian" },
  { id: "guru", icon: "users", target: 35, suffix: "+", label: "Guru & Staf" },
  { id: "siswa", icon: "students", target: 450, suffix: "+", label: "Peserta Didik" },
  { id: "kelulusan", icon: "cap", target: 98, suffix: "%", label: "Tingkat Kelulusan" },
];

export const MOSAIC_DEFAULT_ALTS: string[] = [
  "Kegiatan belajar siswa di ruang kelas",
  "Suasana halaman SMPN 1 Merawang",
  "Siswa membaca di perpustakaan sekolah",
  "Diskusi kelompok bersama guru pembimbing",
  "Kegiatan praktik di laboratorium komputer",
  "Pembelajaran aktif di dalam kelas",
  "Kebersamaan warga sekolah di lapangan",
  "Aktivitas kelompok belajar siswa",
];

export const FALLBACK_NEWS: LandingNewsItem[] = [
  {
    id: "pembukaan-tahun-ajaran-2026-2027",
    href: "/berita/pembukaan-tahun-ajaran-2026-2027",
    category: "Kegiatan",
    title: "Upacara Bendera dan Pembukaan Tahun Ajaran Baru 2026/2027",
    excerpt:
      "Seluruh peserta didik, dewan guru, dan staf tata usaha mengikuti apel pembukaan tahun ajaran baru dengan penuh semangat di lapangan utama SMPN 1 Merawang.",
    content:
      "SMPN 1 Merawang mengawali Tahun Ajaran 2026/2027 dengan pelaksanaan upacara bendera di lapangan utama sekolah yang diikuti oleh seluruh peserta didik kelas VII, VIII, dan IX beserta dewan guru serta tenaga kependidikan.\n\nDalam amanatnya, kepala sekolah menekankan pentingnya kedisiplinan, saling menghormati antarwarga sekolah, serta menjaga kebersihan dan ketertiban lingkungan belajar setiap hari.\n\nKegiatan pembukaan dilanjutkan dengan perkenalan wali kelas serta sosialisasi tata tertib dan program ekstrakurikuler bagi peserta didik baru.",
    dateLabel: "13 Juli 2026",
    dateIso: "2026-07-13",
    imageUrl: "/images/hero-smpn1-merawang.webp",
  },
  {
    id: "literasi-pagi-perpustakaan",
    href: "/berita/literasi-pagi-perpustakaan",
    category: "Akademik",
    title: "Program Pembiasaan Literasi Pagi di Perpustakaan Sekolah",
    excerpt:
      "SMPN 1 Merawang melaksanakan kegiatan membaca 15 menit sebelum jam pelajaran pertama untuk menumbuhkan minat baca dan daya nalar peserta didik.",
    content:
      "Sebagai bagian dari penguatan budaya membaca di sekolah, SMPN 1 Merawang rutin melaksanakan program Literasi Pagi setiap hari Selasa dan Kamis bersama wali kelas dan petugas perpustakaan.\n\nPeserta didik memanfaatkan koleksi buku fiksi, ensiklopedia, maupun buku pengetahuan umum di perpustakaan sekolah, kemudian menuliskan ringkasan singkat dari bacaan yang telah dipelajari.\n\nMelalui pembiasaan ini, sekolah berharap wawasan siswa semakin luas serta mampu berkomunikasi dengan santun dan terstruktur.",
    dateLabel: "18 Agustus 2026",
    dateIso: "2026-08-18",
    imageUrl: "/images/seed/perpustakaan.webp",
  },
  {
    id: "lomba-cerdas-cermat-antar-kelas",
    href: "/berita/lomba-cerdas-cermat-antar-kelas",
    category: "Prestasi",
    title: "Lomba Cerdas Cermat dan Pekan Kreativitas Antar Kelas",
    excerpt:
      "Siswa kelas VII–IX berkompetisi dalam lomba cerdas cermat dan pekan kreativitas sekolah untuk mengasah wawasan, sportivitas, dan kerja sama tim.",
    content:
      "Dalam rangka menyemarakkan kegiatan kesiswaan semester ganjil, SMPN 1 Merawang menyelenggarakan Lomba Cerdas Cermat dan Pekan Kreativitas antar kelas yang diikuti oleh perwakilan seluruh rombongan belajar.\n\nSetiap tim menampilkan kekompakan dalam menjawab pertanyaan pengetahuan umum, sains, bahasa, serta studi sosial. Antusiasme dukungan teman-teman sekelas menjadikan suasana kegiatan terasa hangat dan inspiratif.\n\nPihak sekolah memberikan piagam penghargaan kepada para pemenang sebagai bentuk apresiasi atas usaha dan sportivitas peserta didik.",
    dateLabel: "5 September 2026",
    dateIso: "2026-09-05",
    imageUrl: "/images/seed/diskusi-belajar.webp",
  },
];

export const CALENDAR_BANNER = {
  title: "Mencari Kalender Akademik?",
  buttonLabel: "Unduh Sekarang",
  downloadHref: "/api/pengumuman/kalender-akademik",
};

export const ANNOUNCEMENTS_HEADER = {
  title: "Pengumuman",
  subtitle: "Untuk tahun ajaran berjalan (Juli 2026 – Juni 2027)",
};

export const ANNOUNCEMENTS_LIST: AnnouncementItem[] = [
  {
    slug: "jadwal-pts-ganjil-2026-2027",
    title: "Jadwal Penilaian Tengah Semester (PTS) Ganjil 2026/2027",
    date: "September 2026",
    summary:
      "Informasi jadwal pelaksanaan Penilaian Tengah Semester Ganjil bagi seluruh peserta didik kelas VII, VIII, dan IX SMPN 1 Merawang.",
    content:
      "Kepada seluruh peserta didik dan orang tua/wali siswa SMPN 1 Merawang,\n\nPenilaian Tengah Semester (PTS) Ganjil Tahun Ajaran 2026/2027 akan dilaksanakan sesuai jadwal kelas masing-masing mulai pekan ketiga September 2026.\n\nSeluruh peserta didik diharapkan hadir tepat waktu, membawa perlengkapan alat tulis lengkap, serta mempersiapkan diri dengan mengulang catatan pelajaran dari setiap mata pelajaran.",
  },
  {
    slug: "pelaksanaan-mpls-2026",
    title: "Pengumuman Masa Pengenalan Lingkungan Sekolah (MPLS) Siswa Baru",
    date: "Juli 2026",
    summary:
      "Ketentuan jadwal, perlengkapan, dan rangkaian kegiatan MPLS bagi peserta didik baru kelas VII SMPN 1 Merawang.",
    content:
      "Selamat datang kepada seluruh peserta didik baru SMPN 1 Merawang Tahun Ajaran 2026/2027.\n\nMasa Pengenalan Lingkungan Sekolah (MPLS) dilaksanakan selama tiga hari pada minggu pertama masuk sekolah. Kegiatan mencakup pengenalan lingkungan dan fasilitas sekolah, tata tertib siswa, wawasan kebangsaan, serta pengenalan organisasi OSIS dan ekstrakurikuler.",
  },
  {
    slug: "jadwal-ekstrakurikuler-2026",
    title: "Jadwal Kegiatan Ekstrakurikuler Semester Ganjil 2026/2027",
    date: "Agustus 2026",
    summary:
      "Daftar pilihan dan jadwal latihan ekstrakurikuler Pramuka, Olahraga, Seni, PMR, dan Kelompok Ilmiah Remaja.",
    content:
      "SMPN 1 Merawang membuka pendaftaran dan pelaksanaan kegiatan ekstrakurikuler rutin setiap sore setelah jam pelajaran selesai:\n\n1. Pramuka — Setiap hari Jumat pukul 14.30 WIB.\n2. Olahraga (Bola Voli, Futsal, Bulu Tangkis) — Selasa & Kamis pukul 15.00 WIB.\n3. Palang Merah Remaja (PMR) & UKS — Rabu pukul 14.30 WIB.\n4. Seni Tari, Musik, & Paduan Suara — Kamis pukul 14.30 WIB.\n\nSetiap peserta didik diharapkan mengikuti minimal satu kegiatan ekstrakurikuler sesuai minat dan bakat.",
  },
  {
    slug: "rapat-komite-dan-orang-tua",
    title: "Undangan Rapat Komite Sekolah dan Orang Tua/Wali Peserta Didik",
    date: "Oktober 2026",
    summary:
      "Sinergi sekolah dan orang tua dalam mendukung program pendidikan, pembinaan karakter, serta persiapan evaluasi semester.",
    content:
      "Dalam rangka mempererat kerja sama antara sekolah dan keluarga, SMPN 1 Merawang mengundang pengurus Komite Sekolah serta orang tua/wali peserta didik untuk menghadiri rapat koordinasi program pendidikan semester ganjil.\n\nAgenda pembahasan meliputi penyampaian laporan perkembangan belajar siswa, program pembinaan karakter, serta rencana kegiatan sekolah pada semester berjalan.",
  },
];

export interface FooterLinkItem {
  label: string;
  targetId?: string;
  href?: string;
}

export const FOOTER_CONTENT: {
  schoolName: string;
  description: string;
  contact: { address: string; email: string; phone: string };
  aboutLinks: FooterLinkItem[];
  campusLinks: FooterLinkItem[];
  copyright: string;
} = {
  schoolName: "SMPN 1 Merawang",
  description:
    "Website profil resmi SMPN 1 Merawang, Kecamatan Merawang, Kabupaten Bangka. Membentuk generasi berkarakter, disiplin, dan berprestasi.",
  contact: {
    address: "SMPN 1 Merawang, Kab. Bangka, Kep. Bangka Belitung",
    email: "info@smpn1merawang.sch.id",
    phone: "+62 717 123456",
  },
  aboutLinks: [
    { label: "Profil Sekolah", targetId: "tentang" },
    { label: "Statistik Sekolah", targetId: "statistik" },
    { label: "Pengumuman", targetId: "pengumuman" },
    { label: "Berita & Kegiatan", targetId: "berita" },
    { label: "Kontak", targetId: "kontak" },
  ],
  campusLinks: [
    { label: "Lingkungan Sekolah", targetId: "home" },
    { label: "Galeri Kegiatan", targetId: "galeri" },
    { label: "Ekstrakurikuler", href: "/pengumuman/jadwal-ekstrakurikuler-2026" },
    { label: "Info MPLS", href: "/pengumuman/pelaksanaan-mpls-2026" },
    { label: "Kalender Akademik", href: "/api/pengumuman/kalender-akademik" },
  ],
  copyright: "© 2026 SMPN 1 Merawang. Hak cipta dilindungi.",
};
