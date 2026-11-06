import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const COOKIE = "ramzy_owner";
const lifetime = 60 * 60 * 24 * 7;

function secret() {
  const value = process.env.SESSION_SECRET;
  if (!value || value.length < 32) throw new Error("SESSION_SECRET must contain at least 32 characters.");
  return value;
}

function sign(value: string) {
  return createHmac("sha256", secret()).update(value).digest("hex");
}

export async function createOwnerSession() {
  const expires = Math.floor(Date.now() / 1000) + lifetime;
  const value = String(expires);
  const jar = await cookies();
  jar.set(COOKIE, value + "." + sign(value), {
    httpOnly: true, secure: process.env.NODE_ENV === "production",
    sameSite: "strict", path: "/", maxAge: lifetime
  });
}

export async function clearOwnerSession() {
  const jar = await cookies();
  jar.delete(COOKIE);
}

export async function isOwner() {
  try {
    const jar = await cookies();
    const token = jar.get(COOKIE)?.value;
    if (!token) return false;
    const [expires, signature] = token.split(".");
    if (!expires || !signature || !/^\d+$/.test(expires)) return false;
    if (Number(expires) < Math.floor(Date.now() / 1000)) return false;
    const expected = sign(expires);
    const a = Buffer.from(signature, "hex");
    const b = Buffer.from(expected, "hex");
    return a.length === b.length && timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export function verifyOwnerPassword(input: string) {
  const expected = process.env.OWNER_PASSWORD;
  if (!expected || input.length > 256) return false;
  const a = Buffer.from(input);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}
