import { NextRequest, NextResponse } from "next/server";
import { env } from "@/lib/config/env";

function getAllowedOrigin(req: NextRequest): string {
  const configured = env.CORS_ALLOWED_ORIGINS;
  if (configured === "*") {
    return "*";
  }
  const requestOrigin = req.headers.get("origin") ?? "";
  const allowedList = configured.split(",").map((o) => o.trim());
  if (allowedList.includes(requestOrigin)) {
    return requestOrigin;
  }
  return allowedList[0] ?? "*";
}

export function withCorsHeaders(req: NextRequest, res: NextResponse): NextResponse {
  const origin = getAllowedOrigin(req);
  res.headers.set("Access-Control-Allow-Origin", origin);
  res.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization, Accept");
  if (origin !== "*") {
    res.headers.set("Vary", "Origin");
  }
  return res;
}

export function handleCorsOptions(req: NextRequest): NextResponse {
  const res = new NextResponse(null, { status: 204 });
  return withCorsHeaders(req, res);
}
