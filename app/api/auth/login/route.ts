import { NextRequest, NextResponse } from "next/server";
import { createOwnerSession, verifyOwnerPassword } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const password = typeof body.password === "string" ? body.password : "";
    if (!verifyOwnerPassword(password)) {
      return NextResponse.json({ error: "Invalid password." }, { status: 401 });
    }
    await createOwnerSession();
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Login is not configured. Set OWNER_PASSWORD and SESSION_SECRET." }, { status: 503 });
  }
}
