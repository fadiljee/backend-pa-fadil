"use client";

import Link from "next/link";
import { useActionState } from "react";
import { MateriActionState, updateMateriAction } from "../../actions";
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
          className="p-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <h1 className="text-2xl font-bold text-slate-900">Edit Materi</h1>
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
              Judul Materi *
            </label>
            <input
              name="judul"
              type="text"
              required
              defaultValue={materi.judul}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Konten Materi *
            </label>
            <textarea
              name="konten"
              rows={8}
              required
              defaultValue={materi.konten}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Ganti Gambar (Opsional, JPG/PNG, maks. 2 MB)
            </label>
            {materi.gambarUrl && (
              <div className="mb-2">
                <img
                  src={materi.gambarUrl}
                  alt={materi.judul}
                  className="w-40 h-28 object-cover rounded-lg border border-slate-200"
                />
              </div>
            )}
            <input
              name="gambar"
              type="file"
              accept="image/jpeg,image/png"
              className="w-full text-sm text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Link
              href="/admin/materi"
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
