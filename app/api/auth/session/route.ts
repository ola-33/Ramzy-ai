import { NextResponse } from "next/server";
import { isOwner } from "@/lib/auth";

export async function GET() {
  return NextResponse.json({ authenticated: await isOwner() });
}
