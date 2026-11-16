"use client";

import Link from "next/link";
import { useActionState } from "react";
import { FormActionState, updateSiswaAction } from "../../actions";
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
          className="p-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <h1 className="text-2xl font-bold text-slate-900">Edit Siswa</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        {state.error && (
          <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {state.error}
          </div>
        )}

        <form action={formAction} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Nama Lengkap *
            </label>
            <input
              name="nama"
              type="text"
              required
              minLength={5}
              defaultValue={siswa.nama}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                NISN (10 digit) *
              </label>
              <input
                name="nisn"
                type="text"
                required
                pattern="[0-9]{10}"
                maxLength={10}
                defaultValue={siswa.nisn}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Kelas *
              </label>
              <input
                name="kelas"
                type="text"
                required
                defaultValue={siswa.kelas}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Sekolah (Opsional)
            </label>
            <input
              name="sekolah"
              type="text"
              defaultValue={siswa.sekolah ?? ""}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Alamat (Opsional)
            </label>
            <textarea
              name="alamat"
              rows={3}
              defaultValue={siswa.alamat ?? ""}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Link
              href="/admin/siswa"
              className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 text-sm font-medium hover:bg-slate-50"
            >
              Batal
            </Link>
            <button
              type="submit"
              disabled={isPending}
              className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-sm font-medium cursor-pointer"
            >
              {isPending ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
