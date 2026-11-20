CREATE TABLE IF NOT EXISTS "berita_sekolah" (
  "id" serial PRIMARY KEY NOT NULL,
  "judul" text NOT NULL,
  "ringkasan" text NOT NULL,
  "konten" text NOT NULL,
  "kategori" text NOT NULL DEFAULT 'Kegiatan',
  "tanggal_kegiatan" date NOT NULL DEFAULT CURRENT_DATE,
  "gambar" text,
  "published" boolean NOT NULL DEFAULT true,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS "idx_berita_sekolah_tanggal"
  ON "berita_sekolah" ("tanggal_kegiatan" DESC, "id" DESC);
