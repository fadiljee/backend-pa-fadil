import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { withCorsHeaders } from "./cors";

export function jsonSuccess(req: NextRequest, data: unknown, status = 200): NextResponse {
  const res = NextResponse.json(data, { status });
  return withCorsHeaders(req, res);
}

export function jsonError(
  req: NextRequest,
  message: string,
  status = 400,
  errors?: Record<string, string[]>
): NextResponse {
  const body = errors ? { message, errors } : { message };
  const res = NextResponse.json(body, { status });
  return withCorsHeaders(req, res);
}

export function jsonValidationError(req: NextRequest, error: ZodError): NextResponse {
  const fieldErrors: Record<string, string[]> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "field";
    if (!fieldErrors[key]) {
      fieldErrors[key] = [];
    }
    fieldErrors[key].push(issue.message);
  }
  return jsonError(req, "Validasi gagal", 422, fieldErrors);
}

export async function parseJsonBody(
  req: NextRequest
): Promise<{ ok: true; data: unknown } | { ok: false; response: NextResponse }> {
  try {
    const data = await req.json();
    return { ok: true, data };
  } catch {
    return { ok: false, response: jsonError(req, "Body JSON tidak valid", 400) };
  }
}
