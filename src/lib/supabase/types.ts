export type JawabanOpsi = "a" | "b" | "c" | "d";

export interface DataUserRow {
  id: number;
  nama: string;
  no_hp: string;
  email: string;
  password_hash: string;
  created_at: string;
  updated_at: string;
}

export interface SiswaRow {
  id: number;
  nama: string;
  nisn: string;
  kelas: string;
  sekolah: string | null;
  alamat: string | null;
  profile_picture: string | null;
  created_at: string;
  updated_at: string;
}

export interface MateriRow {
  id: number;
  judul: string;
  konten: string;
  gambar: string | null;
  created_at: string;
  updated_at: string;
}

export interface KuisRow {
  id: number;
  materi_id: number;
  pertanyaan: string;
  jawaban_a: string;
  jawaban_b: string;
  jawaban_c: string;
  jawaban_d: string;
  jawaban_benar: JawabanOpsi;
  nilai: number;
  pembahasan: string | null;
  created_at: string;
  updated_at: string;
}

export interface HasilKuisRow {
  id: number;
  siswa_id: number;
  kuis_id: number;
  jawaban_user: JawabanOpsi;
  skor: number;
  waktu_dikerjakan: string;
  created_at: string;
  updated_at: string;
}

export interface MateriSiswaUnlockRow {
  id: number;
  siswa_id: number;
  materi_id: number;
  created_at: string;
  updated_at: string;
}

export interface SiswaTokenRow {
  id: number;
  siswa_id: number;
  token_hash: string;
  created_at: string;
  last_used_at: string | null;
  expires_at: string | null;
}

export interface BeritaRow {
  id: number;
  judul: string;
  ringkasan: string;
  konten: string;
  kategori: string;
  tanggal_kegiatan: string;
  gambar: string | null;
  published: boolean;
  created_at: string;
  updated_at: string;
}
