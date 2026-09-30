import type { Lang } from "@/lib/task-types";

/**
 * The learner's language lives on their account, not only on this device
 * (Wave 5 F-20: a Spanish learner who signed in on another Chromebook landed
 * in English and had to find the small "ES" on the shelf). Classroom
 * Chromebooks are shared and reassigned, so the account is what follows them.
 */

/** A stored value that is really a language, or null (not set yet, or junk). */
export function asLang(value: unknown): Lang | null {
  return value === "en" || value === "es" ? value : null;
}

/**
 * What the simulator shows on load: a choice made just now; then this
 * learner's choice on this device that the account has not confirmed yet
 * (a reload right after switching, before the save lands, must not undo the
 * switch); then the account's language; then this device's (a learner from
 * before the account kept it); then English.
 */
export function resolveLang({
  chosenNow,
  pending = null,
  account,
  device,
}: {
  chosenNow: Lang | null;
  pending?: Lang | null;
  account: Lang | null;
  device: Lang | null;
}): Lang {
  return chosenNow ?? pending ?? account ?? device ?? "en";
}

/**
 * At sign-in, the language to save on the account, or null to leave it. A
 * new account takes the language picked on the login page. An existing
 * account keeps its own, and only an account that never had one (made
 * before this existed) takes the login page's.
 */
export function langToSaveAtSignIn({
  isNew,
  account,
  loginPage,
}: {
  isNew: boolean;
  account: Lang | null;
  loginPage: Lang | null;
}): Lang | null {
  if (isNew) return loginPage ?? "en";
  return account ? null : loginPage;
}
