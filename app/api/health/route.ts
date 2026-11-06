import { NextResponse } from "next/server";
export async function GET() {
  return NextResponse.json({
    ok: true,
    app: "RAMZY AI",
    aiConfigured: Boolean(process.env.AI_API_KEY),
    ownerConfigured: Boolean(process.env.OWNER_PASSWORD && process.env.SESSION_SECRET)
  });
}
