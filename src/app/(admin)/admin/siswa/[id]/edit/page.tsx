import { notFound } from "next/navigation";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { SiswaRow } from "@/lib/supabase/types";
import { EditSiswaForm } from "./EditSiswaForm";

export const dynamic = "force-dynamic";

export default async function EditSiswaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const siswaId = Number(id);
  if (!Number.isInteger(siswaId) || siswaId <= 0) {
    notFound();
  }

  const supabase = getSupabaseAdmin();
  const { data: siswa } = await supabase
    .from("data_siswa")
    .select("*")
    .eq("id", siswaId)
    .maybeSingle();

  if (!siswa) {
    notFound();
  }

  return <EditSiswaForm siswa={siswa as SiswaRow} />;
}
