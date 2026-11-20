"use client";

import Link from "next/link";
import { useActionState } from "react";
import { createBeritaAction, BeritaActionState } from "../actions";
import { BERITA_KATEGORI_OPTIONS } from "@/lib/services/berita";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";

const initialState: BeritaActionState = {};

function getTodayDateString(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export default function TambahBeritaPage() {
  const [state, formAction, isPending] = useActionState(createBeritaAction, initialState);

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/berita"
          aria-label="Kembali ke daftar berita"
          className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        </Link>
        <h1 className="text-2xl font-bold text-slate-900">Tambah Berita Kegiatan</h1>
      </div>

      <Card className="border-slate-200">
        <CardContent>
          {state.error && (
            <div
              role="alert"
              className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {state.error}
            </div>
          )}

          <form action={formAction} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="judul">Judul Berita *</Label>
              <Input
                id="judul"
                name="judul"
                type="text"
                required
                placeholder="Contoh: Upacara Peringatan Hari Pendidikan Nasional di SMPN 1 Merawang"
                className="min-h-11"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="kategori">Kategori *</Label>
                <select
                  id="kategori"
                  name="kategori"
                  defaultValue="Kegiatan"
                  className="flex min-h-11 w-full rounded-md border border-input bg-white px-3 py-2 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  {BERITA_KATEGORI_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="tanggal_kegiatan">Tanggal Kegiatan *</Label>
                <Input
                  id="tanggal_kegiatan"
                  name="tanggal_kegiatan"
                  type="date"
                  required
                  defaultValue={getTodayDateString()}
                  className="min-h-11"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="ringkasan">Ringkasan Singkat *</Label>
              <Textarea
                id="ringkasan"
                name="ringkasan"
                rows={3}
                required
                placeholder="Ringkasan 1-2 kalimat yang akan tampil di kartu berita halaman depan..."
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="konten">Isi Berita Lengkap *</Label>
              <Textarea
                id="konten"
                name="konten"
                rows={8}
                required
                placeholder="Tuliskan detail pelaksanaan kegiatan, peserta, dan informasi penting lainnya..."
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="gambar">Foto Kegiatan (Opsional, JPG/PNG, maks. 2 MB)</Label>
              <Input
                id="gambar"
                name="gambar"
                type="file"
                accept="image/jpeg,image/png"
                className="min-h-11 cursor-pointer file:mr-4 file:rounded-md file:border-0 file:bg-primary-light file:px-3 file:py-1 file:text-xs file:font-semibold file:text-primary"
              />
            </div>

            <div className="flex items-center gap-2.5 pt-1">
              <input
                id="published"
                name="published"
                type="checkbox"
                defaultChecked
                className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
              />
              <Label htmlFor="published" className="cursor-pointer font-medium text-slate-800">
                Publikasikan langsung di halaman profil sekolah
              </Label>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button
                variant="outline"
                nativeButton={false}
                render={
                  <Link href="/admin/berita" className="min-h-11 px-4">
                    Batal
                  </Link>
                }
              />
              <Button type="submit" disabled={isPending} className="min-h-11 px-5">
                {isPending ? "Menyimpan..." : "Simpan Berita"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
