import { NextRequest, NextResponse } from "next/server";
import { isOwner } from "@/lib/auth";

export const runtime = "nodejs";

const hits = new Map<string, { count: number; reset: number }>();
const limit = 15;
const windowMs = 60_000;

function allowed(key: string) {
  const now = Date.now();
  const current = hits.get(key);
  if (!current || current.reset <= now) {
    hits.set(key, { count: 1, reset: now + windowMs });
    return true;
  }
  if (current.count >= limit) return false;
  current.count += 1;
  return true;
}

export async function POST(request: NextRequest) {
  if (!(await isOwner())) return NextResponse.json({ error: "Please sign in." }, { status: 401 });

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "owner";
  if (!allowed(ip)) return NextResponse.json({ error: "Too many requests. Wait one minute." }, { status: 429 });

  const key = process.env.AI_API_KEY;
  if (!key) return NextResponse.json({ error: "AI is not connected yet. Add AI_API_KEY in your hosting environment settings." }, { status: 503 });

  let body: { messages?: unknown };
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const messages = Array.isArray(body.messages) ? body.messages.slice(-12) : [];
  const safeMessages = messages.filter((m): m is { role: "user" | "assistant"; content: string } =>
    !!m && typeof m === "object" &&
    ((m as { role?: string }).role === "user" || (m as { role?: string }).role === "assistant") &&
    typeof (m as { content?: unknown }).content === "string" &&
    (m as { content: string }).content.length <= 4000
  );
  if (!safeMessages.length) return NextResponse.json({ error: "Write a message first." }, { status: 400 });

  const base = (process.env.AI_BASE_URL || "https://api.openai.com/v1").replace(/\/$/, "");
  const model = process.env.AI_MODEL || "gpt-4o-mini";
  try {
    const response = await fetch(base + "/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: "Bearer " + key },
      body: JSON.stringify({
        model,
        temperature: 0.3,
        max_tokens: 900,
        messages: [
          { role: "system", content: "You are RAMZY AI, a concise website and network security learning assistant. Help only with systems the user owns or has explicit permission to test. Focus on defensive assessment, secure configuration, safe lab exercises, interpreting scan results, and remediation. Do not provide instructions, code, or operational steps to break into accounts, evade detection, steal credentials, deploy malware, disrupt services, or compromise third-party systems. When authorization is unclear, ask the user to use a lab or confirm they own the target. Never claim to have scanned or accessed a system unless a supported tool actually did so. Do not ask for passwords, API keys, or secrets." },
          ...safeMessages
        ]
      }),
      signal: AbortSignal.timeout(25_000)
    });
    if (!response.ok) {
      return NextResponse.json({ error: response.status === 429 ? "AI provider rate limit reached. Try again later." : "The AI provider could not complete that request. Check your API settings." }, { status: 502 });
    }
    const data = await response.json();
    const answer = data?.choices?.[0]?.message?.content;
    if (typeof answer !== "string") throw new Error("Invalid AI response");
    return NextResponse.json({ answer });
  } catch {
    return NextResponse.json({ error: "Could not reach the AI provider. Check the base URL and try again." }, { status: 502 });
  }
}
