import { NextRequest, NextResponse } from "next/server";
import { createOwnerSession, verifyOwnerPassword } from "@/lib/auth";

export const runtime = "nodejs";
const attempts = new Map<string, { count: number; reset: number }>();

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const now = Date.now();
  const state = attempts.get(ip);
  if (state && state.reset > now && state.count >= 5) {
    return NextResponse.json({ error: "Too many login attempts. Wait 10 minutes." }, { status: 429 });
  }
  if (!state || state.reset <= now) attempts.set(ip, { count: 1, reset: now + 10 * 60_000 });
  else state.count += 1;

  try {
    const body = await request.json();
    const password = typeof body.password === "string" ? body.password : "";
    if (!verifyOwnerPassword(password)) {
      return NextResponse.json({ error: "Invalid password." }, { status: 401 });
    }
    attempts.delete(ip);
    await createOwnerSession();
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Login is not configured. Set OWNER_PASSWORD and SESSION_SECRET." }, { status: 503 });
  }
}
