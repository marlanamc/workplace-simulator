/**
 * Who may open Studio. Its time machine replaces the signed-in account's
 * progress with one click, so a learner in a real class must never reach it.
 *
 * Teachers always may. Other accounts may only if their class code is on
 * `STUDIO_CLASS_CODES`: comma-separated, case-insensitive, and an entry ending
 * in `*` matches by prefix. This is how the e2e suite and staff demo accounts
 * get in. Left unset, it allows only the e2e suite's own codes.
 */
export const DEFAULT_STUDIO_CLASS_CODES = "TEST-E2E,E2E-*";

export function studioClassCodes(raw: string | undefined): string[] {
  return (raw ?? DEFAULT_STUDIO_CLASS_CODES)
    .split(",")
    .map((code) => code.trim().toUpperCase())
    // A bare "*" would open Studio to every class, so it is ignored.
    .filter((code) => code !== "" && code !== "*");
}

export function canUseStudio(
  account: { role: string; classCode: string } | null | undefined,
  allowed: string[] = studioClassCodes(process.env.STUDIO_CLASS_CODES),
): boolean {
  if (!account) return false;
  if (account.role === "teacher") return true;
  const code = account.classCode.trim().toUpperCase();
  return allowed.some((entry) => (entry.endsWith("*") ? code.startsWith(entry.slice(0, -1)) : code === entry));
}
