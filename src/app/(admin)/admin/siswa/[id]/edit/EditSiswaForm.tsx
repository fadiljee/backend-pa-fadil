"use client";

import Link from "next/link";
import { useActionState } from "react";
import { FormActionState, updateSiswaAction } from "../../actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";

interface SiswaData {
  id: number;
  nama: string;
  nisn: string;
  kelas: string;
  sekolah: string | null;
  alamat: string | null;
}

const initialState: FormActionState = {};

export function EditSiswaForm({ siswa }: { siswa: SiswaData }) {
  const boundAction = updateSiswaAction.bind(null, siswa.id);
  const [state, formAction, isPending] = useActionState(boundAction, initialState);

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/siswa"
          aria-label="Kembali ke data siswa"
          className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
        </Link>
        <h1 className="text-2xl font-bold text-slate-900">Edit Siswa</h1>
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
              <Label htmlFor="nama">Nama Lengkap *</Label>
              <Input
                id="nama"
                name="nama"
                type="text"
                required
                minLength={5}
                defaultValue={siswa.nama}
                className="min-h-11"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="nisn">NISN (10 digit) *</Label>
                <Input
                  id="nisn"
                  name="nisn"
                  type="text"
                  required
                  pattern="[0-9]{10}"
                  maxLength={10}
                  defaultValue={siswa.nisn}
                  className="min-h-11 font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="kelas">Kelas *</Label>
                <Input
                  id="kelas"
                  name="kelas"
                  type="text"
                  required
                  defaultValue={siswa.kelas}
                  className="min-h-11"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="sekolah">Sekolah (Opsional)</Label>
              <Input
                id="sekolah"
                name="sekolah"
                type="text"
                defaultValue={siswa.sekolah ?? ""}
                className="min-h-11"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="alamat">Alamat (Opsional)</Label>
              <Textarea
                id="alamat"
                name="alamat"
                rows={3}
                defaultValue={siswa.alamat ?? ""}
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button
                variant="outline"
                nativeButton={false}
                render={
                  <Link href="/admin/siswa" className="min-h-11 px-4">
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
