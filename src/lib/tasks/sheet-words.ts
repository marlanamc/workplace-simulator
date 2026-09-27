import type { Lang, Localized } from "@/lib/task-types";

/**
 * Formula names as the sheet shows them in each language. Sheets set to
 * Spanish really does say SUMA, PROMEDIO and SI, so the Spanish screen shows
 * those, and every check accepts the English name too (a learner may have
 * seen SUM at work). One decision for all three sheet lessons: spreadsheet,
 * formula-check and budget-sheet.
 */
export const SHEET_FN = {
  SUM: { en: "SUM", es: "SUMA" },
  AVERAGE: { en: "AVERAGE", es: "PROMEDIO" },
  IF: { en: "IF", es: "SI" },
} as const satisfies Record<string, Localized>;

export type SheetFn = keyof typeof SHEET_FN;

/** The function name for this screen's language. */
export const fnName = (fn: SheetFn, lang: Lang): string => SHEET_FN[fn][lang];

/** A regex source matching either language's name, longest first ("SUMA" before "SUM"). */
export function fnPattern(fn: SheetFn): string {
  const names = [SHEET_FN[fn].en, SHEET_FN[fn].es].sort((a, b) => b.length - a.length);
  return `(?:${names.join("|")})`;
}
