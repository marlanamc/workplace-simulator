import { createHmac, randomBytes, scrypt as scryptCb, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { cookies } from "next/headers";

const scrypt = promisify(scryptCb);

const SESSION_COOKIE = "ws_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 180; // ~6 months, a shared classroom device

function getSecret() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET is not set");
  return secret;
}

function sign(value: string) {
  return createHmac("sha256", getSecret()).update(value).digest("base64url");
}

/** learnerId signed as `<id>.<hmac>` so a tampered cookie is rejected. */
export function encodeSession(learnerId: string) {
  return `${learnerId}.${sign(learnerId)}`;
}

export function decodeSession(token: string): string | null {
  const dot = token.lastIndexOf(".");
  if (dot < 0) return null;
  const learnerId = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const expected = sign(learnerId);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  return learnerId;
}

export async function setSessionCookie(learnerId: string) {
  const store = await cookies();
  store.set(SESSION_COOKIE, encodeSession(learnerId), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: SESSION_MAX_AGE_SECONDS,
    path: "/",
  });
}

export async function clearSessionCookie() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

/** Returns the signed-in learner's id, or null if there's no valid session cookie. */
export async function getSessionLearnerId(): Promise<string | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return decodeSession(token);
}

export async function hashPin(pin: string) {
  const salt = randomBytes(16);
  const derived = (await scrypt(pin, salt, 32)) as Buffer;
  return `${salt.toString("base64url")}.${derived.toString("base64url")}`;
}

export async function verifyPin(pin: string, stored: string) {
  const [saltB64, hashB64] = stored.split(".");
  if (!saltB64 || !hashB64) return false;
  const salt = Buffer.from(saltB64, "base64url");
  const expected = Buffer.from(hashB64, "base64url");
  const derived = (await scrypt(pin, salt, 32)) as Buffer;
  return derived.length === expected.length && timingSafeEqual(derived, expected);
}
