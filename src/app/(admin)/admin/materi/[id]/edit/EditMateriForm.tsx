"use client";

import Link from "next/link";
import { useActionState } from "react";
import { MateriActionState, updateMateriAction } from "../../actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";

interface MateriData {
  id: number;
  judul: string;
  konten: string;
  gambarUrl: string | null;
}

const initialState: MateriActionState = {};

export function EditMateriForm({ materi }: { materi: MateriData }) {
  const boundAction = updateMateriAction.bind(null, materi.id);
  const [state, formAction, isPending] = useActionState(boundAction, initialState);

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/materi"
          aria-label="Kembali ke data materi"
          className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
        </Link>
        <h1 className="text-2xl font-bold text-slate-900">Edit Materi</h1>
      </div>

      <Card className="border-slate-200">
        <CardContent>
          {state.error && (
            <div role="alert" className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {state.error}
            </div>
          )}

          <form action={formAction} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="judul">Judul Materi *</Label>
              <Input
                id="judul"
                name="judul"
                type="text"
                required
                defaultValue={materi.judul}
                className="min-h-11"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="konten">Konten Materi *</Label>
              <Textarea
                id="konten"
                name="konten"
                rows={8}
                required
                defaultValue={materi.konten}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="gambar">Ganti Gambar (Opsional, JPG/PNG, maks. 2 MB)</Label>
              {materi.gambarUrl && (
                <div className="mb-2">
                  <img
                    src={materi.gambarUrl}
                    alt={`Ilustrasi materi ${materi.judul}`}
                    width={160}
                    height={112}
                    className="w-40 h-28 object-cover rounded-lg border border-slate-200"
                  />
                </div>
              )}
              <Input
                id="gambar"
                name="gambar"
                type="file"
                accept="image/jpeg,image/png"
                className="min-h-11 cursor-pointer file:mr-4 file:rounded-md file:border-0 file:bg-primary-light file:px-3 file:py-1 file:text-xs file:font-semibold file:text-primary"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button
                variant="outline"
                nativeButton={false}
                render={
                  <Link href="/admin/materi" className="min-h-11 px-4">
                    Batal
                  </Link>
                }
              />
              <Button type="submit" disabled={isPending} className="min-h-11 px-5">
                {isPending ? "Menyimpan..." : "Simpan Perubahan"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
