CREATE TABLE IF NOT EXISTS "pesan_pengunjung" (
  "id" serial PRIMARY KEY NOT NULL,
  "nama" text NOT NULL,
  "email" text NOT NULL,
  "no_hp" text NOT NULL,
  "keperluan" text NOT NULL,
  "pesan" text,
  "created_at" timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS "idx_pesan_pengunjung_created"
  ON "pesan_pengunjung" ("created_at" DESC);
