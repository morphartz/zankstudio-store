import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ ok: true, service: "zankstudio-store", timestamp: new Date().toISOString() });
}
