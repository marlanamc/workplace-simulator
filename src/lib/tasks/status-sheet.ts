/** Shared numbers for the Weekly Status Template and the student's copy. */

export const COPY_NAME = "status-week-of-aug-24";

export const STATUS_ROWS = [
  { key: "mon", day: "Monday", dayEs: "Lunes", value: 12 },
  { key: "tue", day: "Tuesday", dayEs: "Martes", value: 9 },
  { key: "wed", day: "Wednesday", dayEs: "Miércoles", value: 14 },
  { key: "thu", day: "Thursday", dayEs: "Jueves", value: 11 },
  { key: "fri", day: "Friday", dayEs: "Viernes", value: 15 },
] as const;

export const STATUS_TOTAL = STATUS_ROWS.reduce((sum, r) => sum + r.value, 0);

export function normalizeCopyName(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, "-").replace(/\.xlsx?$/, "");
}

export function isValidSumFormula(formula: string) {
  const m = formula.trim().match(/^=\s*sum\s*\(\s*B\s*(\d+)\s*:\s*B\s*(\d+)\s*\)\s*$/i);
  if (!m) return false;
  const start = Math.min(Number(m[1]), Number(m[2]));
  const end = Math.max(Number(m[1]), Number(m[2]));
  return start <= 2 && end >= 6;
}

/** A plain number, the way a sheet reads one ("61", " 61 ", "61.0"). */
const typedNumber = (typed: string): number | null => {
  const t = typed.trim();
  return /^-?\d+(\.\d+)?$/.test(t) ? Number(t) : null;
};

/**
 * What the total cell shows for what the learner typed, the way real Sheets
 * would: the sum for a good formula, a typed number or word as typed, and
 * #ERROR! only for a formula it cannot read. (It used to show "#ERROR?" for
 * a correct 61 typed by hand.)
 */
export function totalCellShows(typed: string): string {
  if (isValidSumFormula(typed)) return String(STATUS_TOTAL);
  const t = typed.trim();
  if (!t) return "";
  return t.startsWith("=") ? "#ERROR!" : t;
}

export type TotalProblem = "rightNumber" | "number" | "formula";

/** Why the total is not done yet, so the Job Card can say the right thing. */
export function totalProblem(typed: string): TotalProblem | null {
  if (isValidSumFormula(typed)) return null;
  const n = typedNumber(typed);
  if (n === STATUS_TOTAL) return "rightNumber";
  if (n !== null) return "number";
  return "formula";
}
