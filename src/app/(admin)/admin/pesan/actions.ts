"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { requireAdminSession } from "@/lib/auth/admin-session";

export async function deletePesanAction(id: number) {
  await requireAdminSession();
  const supabase = getSupabaseAdmin();
  await supabase.from("pesan_pengunjung").delete().eq("id", id);
  revalidatePath("/admin/pesan");
}
