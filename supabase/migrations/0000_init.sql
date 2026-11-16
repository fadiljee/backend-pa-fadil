CREATE TYPE "public"."jawaban_opsi" AS ENUM('a', 'b', 'c', 'd');--> statement-breakpoint
CREATE TABLE "data_siswa" (
	"id" serial PRIMARY KEY NOT NULL,
	"nama" text NOT NULL,
	"nisn" varchar(10) NOT NULL,
	"kelas" text NOT NULL,
	"sekolah" text,
	"alamat" text,
	"profile_picture" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "data_siswa_nisn_unique" UNIQUE("nisn"),
	CONSTRAINT "chk_data_siswa_nisn" CHECK ("data_siswa"."nisn" ~ '^[0-9]{10}$')
);
--> statement-breakpoint
CREATE TABLE "data_user" (
	"id" serial PRIMARY KEY NOT NULL,
	"nama" text NOT NULL,
	"no_hp" text NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "data_user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "hasil_kuis" (
	"id" serial PRIMARY KEY NOT NULL,
	"siswa_id" integer NOT NULL,
	"kuis_id" integer NOT NULL,
	"jawaban_user" "jawaban_opsi" NOT NULL,
	"skor" integer NOT NULL,
	"waktu_dikerjakan" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "kuis" (
	"id" serial PRIMARY KEY NOT NULL,
	"materi_id" integer NOT NULL,
	"pertanyaan" text NOT NULL,
	"jawaban_a" text NOT NULL,
	"jawaban_b" text NOT NULL,
	"jawaban_c" text NOT NULL,
	"jawaban_d" text NOT NULL,
	"jawaban_benar" "jawaban_opsi" NOT NULL,
	"nilai" integer DEFAULT 10 NOT NULL,
	"pembahasan" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "materi_siswa_unlock" (
	"id" serial PRIMARY KEY NOT NULL,
	"siswa_id" integer NOT NULL,
	"materi_id" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "materis" (
	"id" serial PRIMARY KEY NOT NULL,
	"judul" text NOT NULL,
	"konten" text NOT NULL,
	"gambar" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "siswa_tokens" (
	"id" serial PRIMARY KEY NOT NULL,
	"siswa_id" integer NOT NULL,
	"token_hash" char(64) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"last_used_at" timestamp with time zone,
	"expires_at" timestamp with time zone,
	CONSTRAINT "siswa_tokens_token_hash_unique" UNIQUE("token_hash")
);
--> statement-breakpoint
ALTER TABLE "hasil_kuis" ADD CONSTRAINT "hasil_kuis_siswa_id_data_siswa_id_fk" FOREIGN KEY ("siswa_id") REFERENCES "public"."data_siswa"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hasil_kuis" ADD CONSTRAINT "hasil_kuis_kuis_id_kuis_id_fk" FOREIGN KEY ("kuis_id") REFERENCES "public"."kuis"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "kuis" ADD CONSTRAINT "kuis_materi_id_materis_id_fk" FOREIGN KEY ("materi_id") REFERENCES "public"."materis"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "materi_siswa_unlock" ADD CONSTRAINT "materi_siswa_unlock_siswa_id_data_siswa_id_fk" FOREIGN KEY ("siswa_id") REFERENCES "public"."data_siswa"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "materi_siswa_unlock" ADD CONSTRAINT "materi_siswa_unlock_materi_id_materis_id_fk" FOREIGN KEY ("materi_id") REFERENCES "public"."materis"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "siswa_tokens" ADD CONSTRAINT "siswa_tokens_siswa_id_data_siswa_id_fk" FOREIGN KEY ("siswa_id") REFERENCES "public"."data_siswa"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_data_siswa_kelas" ON "data_siswa" USING btree ("kelas");--> statement-breakpoint
CREATE UNIQUE INDEX "uq_hasil_kuis_siswa_kuis" ON "hasil_kuis" USING btree ("siswa_id","kuis_id");--> statement-breakpoint
CREATE INDEX "idx_hasil_kuis_siswa_id" ON "hasil_kuis" USING btree ("siswa_id");--> statement-breakpoint
CREATE INDEX "idx_hasil_kuis_kuis_id" ON "hasil_kuis" USING btree ("kuis_id");--> statement-breakpoint
CREATE INDEX "idx_kuis_materi_id" ON "kuis" USING btree ("materi_id");--> statement-breakpoint
CREATE UNIQUE INDEX "uq_materi_siswa_unlock" ON "materi_siswa_unlock" USING btree ("siswa_id","materi_id");--> statement-breakpoint
CREATE INDEX "idx_materis_judul" ON "materis" USING btree ("judul");--> statement-breakpoint
CREATE INDEX "idx_siswa_tokens_siswa_id" ON "siswa_tokens" USING btree ("siswa_id");