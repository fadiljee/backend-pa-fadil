import { NextRequest } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { jsonError, jsonSuccess } from "@/lib/http/response";
import { handleCorsOptions as corsOptions } from "@/lib/http/cors";

export async function OPTIONS(req: NextRequest) {
  return corsOptions(req);
}

export async function GET(req: NextRequest) {
  try {
    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from("data_user").select("id").limit(1);
    if (error) {
      return jsonError(req, `Supabase error: ${error.message}`, 503);
    }
    return jsonSuccess(req, {
      status: "ok",
      provider: "supabase",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Healthcheck Supabase error:", error);
    return jsonError(req, "Supabase tidak dapat dijangkau", 503);
  }
}
