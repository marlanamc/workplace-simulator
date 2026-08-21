"use server";

import { redirect } from "next/navigation";
import { setSessionCookie, hashPin, verifyPin } from "@/lib/auth";
import { createLearner, findLearner } from "@/lib/db/queries";

export interface LoginResult {
  error: string | null;
}

const PIN_RE = /^\d{4}$/;

export async function loginOrSignup(_prev: LoginResult, formData: FormData): Promise<LoginResult> {
  const displayName = String(formData.get("displayName") ?? "").trim();
  const pin = String(formData.get("pin") ?? "").trim();
  const classCode = String(formData.get("classCode") ?? "").trim().toUpperCase();

  if (!displayName) return { error: "Enter your first name." };
  if (!PIN_RE.test(pin)) return { error: "Your PIN is 4 numbers." };
  if (!classCode) return { error: "Enter your class code." };

  const existing = await findLearner(displayName, classCode);

  if (existing) {
    const ok = await verifyPin(pin, existing.pinHash);
    if (!ok) return { error: "That PIN doesn't match. Try again, or ask your teacher." };
    await setSessionCookie(existing.id);
  } else {
    const pinHash = await hashPin(pin);
    const learner = await createLearner(displayName, pinHash, classCode);
    await setSessionCookie(learner.id);
  }

  const nextRaw = String(formData.get("next") ?? "/");
  redirect(nextRaw === "/studio" ? "/studio" : "/");
}
