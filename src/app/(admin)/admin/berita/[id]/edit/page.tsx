import { notFound } from "next/navigation";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { BeritaRow } from "@/lib/supabase/types";
import { getGambarUrl } from "@/lib/storage";
import { EditBeritaForm } from "./EditBeritaForm";

export const dynamic = "force-dynamic";

export default async function EditBeritaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const numId = Number(id);
  if (!Number.isInteger(numId) || numId <= 0) {
    notFound();
  }

  const supabase = getSupabaseAdmin();
  const { data } = await supabase
    .from("berita_sekolah")
    .select("*")
    .eq("id", numId)
    .maybeSingle();

  if (!data) {
    notFound();
  }

  const berita = data as BeritaRow;
  const currentImageUrl = getGambarUrl(berita.gambar);

  return <EditBeritaForm berita={berita} currentImageUrl={currentImageUrl} />;
}
