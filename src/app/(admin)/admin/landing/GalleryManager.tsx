"use client";

import { useActionState, useRef } from "react";
import { AlertCircle, CheckCircle2, ImagePlus, Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  addGalleryItemAction,
  deleteGalleryItemAction,
  LandingFormState,
} from "./actions";

export interface GalleryPreviewItem {
  id: string;
  judul: string;
  gambar: string;
  url: string | null;
}

const initialState: LandingFormState = {};

export function GalleryManager({ items }: { items: GalleryPreviewItem[] }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, isPending] = useActionState(
    async (prev: LandingFormState, formData: FormData) => {
      const res = await addGalleryItemAction(prev, formData);
      if (res.status === "success") {
        formRef.current?.reset();
      }
      return res;
    },
    initialState
  );

  return (
    <Card id="kelola-galeri" className="border-slate-200">
      <CardHeader>
        <CardTitle className="text-base font-semibold text-slate-900">
          Kelola Foto Galeri Sekolah (Khusus Galeri)
        </CardTitle>
        <p className="text-xs text-slate-500">
          Foto yang diunggah di sini tampil eksklusif pada bagian Galeri Sekolah — terpisah dari
          Berita &amp; Kegiatan maupun Foto Profil Sekolah.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {state.status === "success" && state.message && (
          <div
            role="status"
            className="flex items-start gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-sm text-emerald-900"
          >
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" aria-hidden="true" />
            <span>{state.message}</span>
          </div>
        )}

        {state.status === "error" && state.message && (
          <div
            role="alert"
            className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3.5 text-sm text-red-900"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-700" aria-hidden="true" />
            <span>{state.message}</span>
          </div>
        )}

        <form
          ref={formRef}
          action={formAction}
          className="grid grid-cols-1 items-end gap-4 rounded-xl border border-slate-200/80 bg-slate-50/70 p-4 md:grid-cols-12"
        >
          <div className="space-y-1.5 md:col-span-5">
            <Label htmlFor="gallery-judul" className="text-sm font-semibold text-slate-800">
              Judul / Keterangan Foto
            </Label>
            <Input
              id="gallery-judul"
              name="judul"
              required
              minLength={2}
              maxLength={120}
              placeholder="Contoh: Upacara Bendera Hari Senin"
              className="min-h-11 bg-white"
            />
          </div>

          <div className="space-y-1.5 md:col-span-5">
            <Label htmlFor="gallery-gambar" className="text-sm font-semibold text-slate-800">
              File Foto (JPG/PNG)
            </Label>
            <Input
              id="gallery-gambar"
              name="gambar"
              type="file"
              accept="image/jpeg,image/png"
              required
              className="min-h-11 bg-white file:mr-3 file:rounded-md file:border-0 file:bg-slate-100 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-slate-700"
            />
          </div>

          <div className="md:col-span-2">
            <Button
              type="submit"
              disabled={isPending}
              className="min-h-11 w-full gap-1.5"
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              ) : (
                <ImagePlus className="h-4 w-4" aria-hidden="true" />
              )}
              <span>Tambah</span>
            </Button>
          </div>
        </form>

        {items.length === 0 ? (
          <p className="rounded-xl border border-dashed border-slate-200 py-8 text-center text-sm text-slate-500">
            Belum ada foto galeri yang diunggah. Tambahkan foto kegiatan sekolah di atas.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white"
              >
                <div className="aspect-[4/3] w-full bg-slate-100">
                  {item.url ? (
                    <img
                      src={item.url}
                      alt={item.judul}
                      className="h-full w-full object-cover"
                    />
                  ) : null}
                </div>
                <div className="flex items-center justify-between gap-2 p-3">
                  <p className="truncate text-xs font-semibold text-slate-800" title={item.judul}>
                    {item.judul}
                  </p>
                  <form action={deleteGalleryItemAction.bind(null, item.id)}>
                    <Button
                      type="submit"
                      variant="ghost"
                      size="icon"
                      aria-label={`Hapus foto ${item.judul}`}
                      className="h-8 w-8 shrink-0 text-red-600 hover:bg-red-50 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                    </Button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
