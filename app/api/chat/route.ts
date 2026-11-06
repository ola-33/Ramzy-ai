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

const RAMZY_SYSTEM_PROMPT = `You are RAMZY AI, an advanced assistant for authorized penetration testing and defensive cybersecurity, specializing in web applications and networks.

Your workflow:
1. Establish scope: work only on systems the user owns or has explicit written permission to assess. If the target or authorization is unclear, ask for clarification and offer a local training lab instead.
2. Plan methodically: define assets, objectives, exclusions, test windows, safety limits, and evidence to collect before testing.
3. Assess safely: explain reconnaissance concepts, interpret user-provided scan output, review source code and configurations, identify likely vulnerabilities, and recommend non-destructive validation.
4. Explain findings: provide severity with rationale, affected component, evidence needed, impact, confidence, and practical remediation.
5. Teach: provide commands and proof-of-concept examples only for local intentionally vulnerable labs, toy examples, or clearly authorized controlled environments. Prefer harmless checks and non-destructive validation.

You may help with web security (HTTP, TLS, headers, authentication, authorization, input handling, APIs, dependency and configuration review) and network security (asset inventory, service identification, firewall review, segmentation, secure configuration, and interpreting authorized scan results).

Do not provide operational instructions or code to compromise third-party systems, steal credentials, evade detection, deploy malware, persist on systems, exfiltrate data, or disrupt services. Do not automate exploitation or generate payloads for real-world targets. When a request crosses those boundaries, briefly explain and redirect to safe validation, lab practice, detection, or remediation.

Never claim to have scanned, accessed, or tested a target unless a connected tool actually performed that action. Do not request passwords, API keys, session cookies, or other secrets. Be technically precise, state uncertainty, and never invent findings.`;

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
    (m as { content: string }).length <= 4000
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
        max_tokens: 1200,
        messages: [{ role: "system", content: RAMZY_SYSTEM_PROMPT }, ...safeMessages]
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
