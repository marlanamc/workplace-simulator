import type { Lang } from "@/lib/task-types";

/** Shared Act III crew sheet. Level 9 fills Saturday close; Level 10 totals the same week. */

export const DAYS = ["mon", "tue", "wed", "thu", "fri", "sat"] as const;
export type DayKey = (typeof DAYS)[number];

export const DAY_LABELS: Record<Lang, Record<DayKey, string>> = {
  en: { mon: "Mon", tue: "Tue", wed: "Wed", thu: "Thu", fri: "Fri", sat: "Sat" },
  es: { mon: "Lun", tue: "Mar", wed: "Mié", thu: "Jue", fri: "Vie", sat: "Sáb" },
};

export interface ShiftCell {
  /** Empty string = uncovered / available. */
  label: string;
  hours: number;
  /** Locked cells cannot be edited (already scheduled, or requested off). */
  locked?: boolean;
}

export interface CrewMember {
  key: string;
  name: string;
  email: string;
  shifts: Record<DayKey, ShiftCell>;
  /** Why this person is the wrong (or right) Saturday cover. */
  saturdayHint: Record<Lang, string>;
}

export const GAP_DAY: DayKey = "sat";
export const GAP_SHIFT_LABEL = "4–10";
export const GAP_HOURS = 6;
export const CORRECT_COVER = "jordan";

export const CREW: CrewMember[] = [
  {
    key: "alex",
    name: "Alex Chen",
    email: "alex.chen@harborsidecafe.com",
    shifts: {
      mon: { label: "8–4", hours: 8, locked: true },
      tue: { label: "8–4", hours: 8, locked: true },
      wed: { label: "8–4", hours: 8, locked: true },
      thu: { label: "8–4", hours: 8, locked: true },
      fri: { label: "8–4", hours: 8, locked: true },
      sat: { label: "", hours: 0 },
    },
    saturdayHint: {
      en: "Alex already has 40 hours. A lead does not push someone into overtime if someone else has room.",
      es: "Alex ya tiene 40 horas. Un líder no manda a alguien a tiempo extra si otra persona tiene espacio.",
    },
  },
  {
    key: "riley",
    name: "Riley Park",
    email: "riley.park@harborsidecafe.com",
    shifts: {
      mon: { label: "8–4", hours: 8, locked: true },
      tue: { label: "8–4", hours: 8, locked: true },
      wed: { label: "8–4", hours: 8, locked: true },
      thu: { label: "8–4", hours: 8, locked: true },
      fri: { label: "12–4", hours: 4, locked: true },
      sat: { label: "", hours: 0 },
    },
    saturdayHint: {
      en: "Riley would go over 40 hours. Look at the Hours column and pick someone with room.",
      es: "Riley pasaría de 40 horas. Mira la columna de Horas y elige a alguien con espacio.",
    },
  },
  {
    key: "jordan",
    name: "Jordan Kim",
    email: "jordan.kim@harborsidecafe.com",
    shifts: {
      mon: { label: "2–10", hours: 8, locked: true },
      tue: { label: "", hours: 0, locked: true },
      wed: { label: "2–10", hours: 8, locked: true },
      thu: { label: "", hours: 0, locked: true },
      fri: { label: "2–10", hours: 8, locked: true },
      sat: { label: "", hours: 0 },
    },
    saturdayHint: {
      en: "Jordan has room this week and is free Saturday.",
      es: "Jordan tiene espacio esta semana y está libre el sábado.",
    },
  },
  {
    key: "sam",
    name: "Sam Rivera",
    email: "sam.rivera@harborsidecafe.com",
    shifts: {
      mon: { label: "8–4", hours: 8, locked: true },
      tue: { label: "8–4", hours: 8, locked: true },
      wed: { label: "8–4", hours: 8, locked: true },
      thu: { label: "", hours: 0, locked: true },
      fri: { label: "", hours: 0, locked: true },
      sat: { label: "8–4", hours: 8, locked: true },
    },
    saturdayHint: {
      en: "Sam already works Saturday morning. Do not stack a close on top of an open.",
      es: "Sam ya trabaja el sábado por la mañana. No le pongas el cierre encima de la apertura.",
    },
  },
  {
    key: "casey",
    name: "Casey Brooks",
    email: "casey.brooks@harborsidecafe.com",
    shifts: {
      mon: { label: "8–4", hours: 8, locked: true },
      tue: { label: "8–4", hours: 8, locked: true },
      wed: { label: "", hours: 0, locked: true },
      thu: { label: "8–4", hours: 8, locked: true },
      fri: { label: "12–4", hours: 4, locked: true },
      sat: { label: "Off", hours: 0, locked: true },
    },
    saturdayHint: {
      en: "Casey asked for Saturday off. That cell is already marked Off.",
      es: "Casey pidió el sábado libre. Esa celda ya dice Libre.",
    },
  },
];

export function hoursFor(member: CrewMember, saturdayCover: boolean): number {
  const base = DAYS.reduce((sum, day) => sum + member.shifts[day].hours, 0);
  if (saturdayCover && member.key === CORRECT_COVER) return base + GAP_HOURS;
  return base;
}

export function weekHours(saturdayCover: boolean): number[] {
  return CREW.map((m) => hoursFor(m, saturdayCover));
}

export const CORRECT_WEEK_TOTAL = weekHours(true).reduce((a, b) => a + b, 0);
export const SHORT_WEEK_TOTAL = weekHours(true).slice(0, -1).reduce((a, b) => a + b, 0);
