import type { Localized } from "./task-types";

/**
 * The cast — the people at Harborside Cafe the learner emails, reads about,
 * and reports to.
 *
 * This is the identity layer only: a person's name, avatar color, initials,
 * and email address, plus a signature block for the ones who send formal
 * mail. Renaming Maria, or moving the cafe to a new domain, is a one-line
 * edit here. Narrative prose that *mentions* a character ("Maria asked you
 * to…") stays in the task content where it belongs — this file can't and
 * shouldn't rewrite a story beat.
 */

export const CAFE_NAME = "Harborside Cafe";
export const CAFE_DOMAIN = "harborsidecafe.com";

const at = (local: string) => `${local}@${CAFE_DOMAIN}`;

export interface CastMember {
  /** Full name as the inbox and signature show it. */
  name: string;
  /** Two-letter avatar / sender-chip monogram. */
  initials: string;
  /** Avatar / sender-chip color. */
  color: string;
  email: string;
  /** Set only for people who send email with a signature block. */
  title?: Localized<string>;
  org?: string;
  phone?: string;
}

export type CastKey = "maria" | "hr" | "jordan" | "darnell" | "alex";

export const CAST: Record<CastKey, CastMember> = {
  maria: {
    name: "Maria Delgado",
    initials: "MD",
    color: "#1a73e8",
    email: at("maria.delgado"),
    title: { en: "Cafe Manager", es: "Gerente del café" },
    org: CAFE_NAME,
    phone: "(555) 0142",
  },
  hr: {
    name: "Harborside HR",
    initials: "HR",
    color: "#9334e6",
    email: at("hr"),
    title: { en: "Human Resources", es: "Recursos Humanos" },
    org: CAFE_NAME,
  },
  jordan: {
    name: "Jordan Kim",
    initials: "JK",
    color: "#0f9d58",
    email: at("jordan.kim"),
    title: { en: "Shift Lead", es: "Líder de turno" },
    org: CAFE_NAME,
  },
  darnell: {
    name: "Darnell Washington",
    initials: "DW",
    color: "#e37400",
    email: at("darnell.washington"),
  },
  alex: {
    name: "Alex Chen",
    initials: "AC",
    color: "#5f6368",
    email: at("alex.chen"),
  },
};

/** The inbox-row identity fields (`from` / `initials` / `color`) for a cast member. */
export function inboxSender(m: CastMember): { from: string; initials: string; color: string } {
  return { from: m.name, initials: m.initials, color: m.color };
}

export function castByName(name: string): CastMember | undefined {
  return Object.values(CAST).find((m) => m.name === name);
}
