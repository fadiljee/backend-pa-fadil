"use client";

import Link from "next/link";
import { useActionState } from "react";
import { KuisActionState, updateKuisAction } from "../../actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";

interface SoalData {
  id: number;
  materiId: number;
  pertanyaan: string;
  jawabanA: string;
  jawabanB: string;
  jawabanC: string;
  jawabanD: string;
  jawabanBenar: "a" | "b" | "c" | "d";
  nilai: number;
  pembahasan: string | null;
}

const initialState: KuisActionState = {};

export function EditKuisForm({
  soal,
  materiList,
}: {
  soal: SoalData;
  materiList: { id: number; judul: string }[];
}) {
  const boundAction = updateKuisAction.bind(null, soal.id);
  const [state, formAction, isPending] = useActionState(boundAction, initialState);

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/kuis"
          aria-label="Kembali ke data kuis"
          className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
        </Link>
        <h1 className="text-2xl font-bold text-slate-900">Edit Kuis</h1>
      </div>

      <Card className="border-slate-200">
        <CardContent>
          {state.error && (
            <div role="alert" className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {state.error}
            </div>
          )}

          <form action={formAction} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2 space-y-1.5">
                <Label htmlFor="materi_id">Materi *</Label>
                <select
                  id="materi_id"
                  name="materi_id"
                  defaultValue={soal.materiId}
                  required
                  className="min-h-11 w-full px-3 py-2 border border-input rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {materiList.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.judul}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="nilai">Nilai Poin *</Label>
                <Input
                  id="nilai"
                  name="nilai"
                  type="number"
                  min={1}
                  defaultValue={soal.nilai}
                  required
                  className="min-h-11"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="pertanyaan">Pertanyaan *</Label>
              <Textarea
                id="pertanyaan"
                name="pertanyaan"
                rows={3}
                required
                defaultValue={soal.pertanyaan}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="jawaban_a">Pilihan A *</Label>
                <Input
                  id="jawaban_a"
                  name="jawaban_a"
                  type="text"
                  required
                  defaultValue={soal.jawabanA}
                  className="min-h-11"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="jawaban_b">Pilihan B *</Label>
                <Input
                  id="jawaban_b"
                  name="jawaban_b"
                  type="text"
                  required
                  defaultValue={soal.jawabanB}
                  className="min-h-11"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="jawaban_c">Pilihan C *</Label>
                <Input
                  id="jawaban_c"
                  name="jawaban_c"
                  type="text"
                  required
                  defaultValue={soal.jawabanC}
                  className="min-h-11"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="jawaban_d">Pilihan D *</Label>
                <Input
                  id="jawaban_d"
                  name="jawaban_d"
                  type="text"
                  required
                  defaultValue={soal.jawabanD}
                  className="min-h-11"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="jawaban_benar">Kunci Jawaban Benar *</Label>
              <select
                id="jawaban_benar"
                name="jawaban_benar"
                defaultValue={soal.jawabanBenar}
                required
                className="min-h-11 w-full px-3 py-2 border border-input rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="a">A</option>
                <option value="b">B</option>
                <option value="c">C</option>
                <option value="d">D</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="pembahasan">Pembahasan (Opsional)</Label>
              <Textarea
                id="pembahasan"
                name="pembahasan"
                rows={3}
                defaultValue={soal.pembahasan ?? ""}
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button
                variant="outline"
                nativeButton={false}
                render={
                  <Link href="/admin/kuis" className="min-h-11 px-4">
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
