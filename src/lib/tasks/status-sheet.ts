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
