"use client";

import Link from "next/link";
import { useActionState } from "react";
import { KuisActionState, updateKuisAction } from "../../actions";
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
          className="p-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <h1 className="text-2xl font-bold text-slate-900">Edit Kuis</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        {state.error && (
          <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {state.error}
          </div>
        )}

        <form action={formAction} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Materi *
              </label>
              <select
                name="materi_id"
                defaultValue={soal.materiId}
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {materiList.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.judul}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Nilai Poin *
              </label>
              <input
                name="nilai"
                type="number"
                min={1}
                defaultValue={soal.nilai}
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Pertanyaan *
            </label>
            <textarea
              name="pertanyaan"
              rows={3}
              required
              defaultValue={soal.pertanyaan}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Pilihan A *
              </label>
              <input
                name="jawaban_a"
                type="text"
                required
                defaultValue={soal.jawabanA}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Pilihan B *
              </label>
              <input
                name="jawaban_b"
                type="text"
                required
                defaultValue={soal.jawabanB}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Pilihan C *
              </label>
              <input
                name="jawaban_c"
                type="text"
                required
                defaultValue={soal.jawabanC}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Pilihan D *
              </label>
              <input
                name="jawaban_d"
                type="text"
                required
                defaultValue={soal.jawabanD}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Kunci Jawaban Benar *
            </label>
            <select
              name="jawaban_benar"
              defaultValue={soal.jawabanBenar}
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="a">A</option>
              <option value="b">B</option>
              <option value="c">C</option>
              <option value="d">D</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Pembahasan (Opsional)
            </label>
            <textarea
              name="pembahasan"
              rows={3}
              defaultValue={soal.pembahasan ?? ""}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Link
              href="/admin/kuis"
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
