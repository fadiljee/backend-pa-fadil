import { notFound } from "next/navigation";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { KuisRow } from "@/lib/supabase/types";
import { EditKuisForm } from "./EditKuisForm";

export const dynamic = "force-dynamic";

export default async function EditKuisPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const kuisId = Number(id);
  if (!Number.isInteger(kuisId) || kuisId <= 0) {
    notFound();
  }

  const supabase = getSupabaseAdmin();
  const [{ data: soal }, { data: materiData }] = await Promise.all([
    supabase.from("kuis").select("*").eq("id", kuisId).maybeSingle(),
    supabase.from("materis").select("id, judul").order("id", { ascending: true }),
  ]);

  if (!soal) {
    notFound();
  }

  const s = soal as KuisRow;
  const materiList = (materiData ?? []) as { id: number; judul: string }[];

  return (
    <EditKuisForm
      soal={{
        id: s.id,
        materiId: s.materi_id,
        pertanyaan: s.pertanyaan,
        jawabanA: s.jawaban_a,
        jawabanB: s.jawaban_b,
        jawabanC: s.jawaban_c,
        jawabanD: s.jawaban_d,
        jawabanBenar: s.jawaban_benar,
        nilai: s.nilai,
        pembahasan: s.pembahasan,
      }}
      materiList={materiList}
    />
  );
}
