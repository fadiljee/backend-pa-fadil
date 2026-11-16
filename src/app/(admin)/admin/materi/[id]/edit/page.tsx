import { notFound } from "next/navigation";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { MateriRow } from "@/lib/supabase/types";
import { getGambarUrl } from "@/lib/storage";
import { EditMateriForm } from "./EditMateriForm";

export const dynamic = "force-dynamic";

export default async function EditMateriPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const materiId = Number(id);
  if (!Number.isInteger(materiId) || materiId <= 0) {
    notFound();
  }

  const supabase = getSupabaseAdmin();
  const { data: materi } = await supabase
    .from("materis")
    .select("*")
    .eq("id", materiId)
    .maybeSingle();

  if (!materi) {
    notFound();
  }

  const m = materi as MateriRow;
  return (
    <EditMateriForm
      materi={{
        id: m.id,
        judul: m.judul,
        konten: m.konten,
        gambarUrl: getGambarUrl(m.gambar),
      }}
    />
  );
}
