"use server";

import { practiceReturn } from "@/lib/practice/activities";
import { redirect } from "next/navigation";
import { setSessionCookie, hashPin, verifyPin } from "@/lib/auth";
import { createLearner, findLearner } from "@/lib/db/queries";

/**
 * Login failures are reported as a key rather than a sentence: this is a
 * server action, so it has no access to the learner's chosen language, and
 * returning English text here put an English wall on the one screen a Spanish
 * learner meets before anything else. `LoginForm` holds `lang` and renders it.
 */
export type LoginErrorKey = "name" | "pin" | "classCode" | "wrongPin";

export interface LoginResult {
  error: LoginErrorKey | null;
}

const PIN_RE = /^\d{4}$/;

export async function loginOrSignup(_prev: LoginResult, formData: FormData): Promise<LoginResult> {
  const displayName = String(formData.get("displayName") ?? "").trim();
  const pin = String(formData.get("pin") ?? "").trim();
  const classCode = String(formData.get("classCode") ?? "").trim().toUpperCase();

  if (!displayName) return { error: "name" };
  if (!PIN_RE.test(pin)) return { error: "pin" };
  if (!classCode) return { error: "classCode" };

  const existing = await findLearner(displayName, classCode);

  if (existing) {
    const ok = await verifyPin(pin, existing.pinHash);
    if (!ok) return { error: "wrongPin" };
    await setSessionCookie(existing.id);
  } else {
    const pinHash = await hashPin(pin);
    const learner = await createLearner(displayName, pinHash, classCode);
    await setSessionCookie(learner.id);
  }

  const nextRaw = String(formData.get("next") ?? "/");
  redirect(practiceReturn(nextRaw));
}
