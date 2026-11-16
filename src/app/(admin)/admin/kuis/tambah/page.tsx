import { getSupabaseAdmin } from "@/lib/supabase/server";
import { CreateKuisForm } from "./CreateKuisForm";

export const dynamic = "force-dynamic";

export default async function TambahKuisPage() {
  const supabase = getSupabaseAdmin();
  const { data } = await supabase
    .from("materis")
    .select("id, judul")
    .order("id", { ascending: true });

  const materiList = (data ?? []) as { id: number; judul: string }[];
  return <CreateKuisForm materiList={materiList} />;
}
