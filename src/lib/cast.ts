import type { Localized } from "./task-types";

/**
 * The cast — the people the learner emails, reads about, and reports to across
 * the whole arc.
 *
 * This is the identity layer only: a person's name, avatar color, initials, and
 * email address, plus a signature block for the ones who send formal mail.
 * Renaming someone, or moving an org to a new domain, is a one-line edit here.
 * Narrative prose that *mentions* a character ("Renata asked you to…") stays in
 * the task content where it belongs — this file can't and shouldn't rewrite a
 * story beat.
 *
 * Who manages which stretch of the story:
 *   - Maria Delgado (Cafe Manager) — the new-hire arc only: Act I and the Act II
 *     incident/handbook level, i.e. through `level3c`. Plus one finale cameo.
 *   - Renata Silva (General Manager) — from the Shift Lead promotion (`level3b`)
 *     through Act IV. Same cafe building.
 *   - Marcus Bell (Academic Advisor, BHCC) — Act V, Path A.
 *   - Thuy Nguyen (Front Desk Supervisor, Harborside Health) — Act V, Path B.
 *   - Anita Raman (Operations Director, Harborside HQ) — Acts VI–VII.
 * Every stop is the same Harborside company; the later ones are internal moves.
 */

export const CAFE_NAME = "Harborside Cafe";
export const CAFE_DOMAIN = "harborsidecafe.com";
export const HEALTH_NAME = "Harborside Health";
export const HEALTH_DOMAIN = "harborsidehealth.com";
export const HQ_NAME = "Harborside HQ";
export const HQ_DOMAIN = "harborsidehq.com";
export const COLLEGE_NAME = "Bunker Hill Community College";
export const COLLEGE_DOMAIN = "bhcc.edu";

const at = (local: string, domain: string = CAFE_DOMAIN) => `${local}@${domain}`;

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

export type CastKey =
  | "maria"
  | "hr"
  | "jordan"
  | "darnell"
  | "alex"
  | "renata"
  | "marcus"
  | "thuy"
  | "anita"
  | "chris";

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
  // General Manager. Takes over from Maria at the Shift Lead promotion and runs
  // the story through Act IV.
  renata: {
    name: "Renata Silva",
    initials: "RS",
    color: "#d93025",
    email: at("renata.silva"),
    title: { en: "General Manager", es: "Gerente general" },
    org: CAFE_NAME,
    phone: "(555) 0148",
  },
  // Act V, Path A — the community college advisor.
  marcus: {
    name: "Marcus Bell",
    initials: "MB",
    color: "#1967d2",
    email: at("mbell", COLLEGE_DOMAIN),
    title: { en: "Academic Advisor", es: "Asesor académico" },
    org: COLLEGE_NAME,
    phone: "(617) 555 0106",
  },
  // Act V, Path B — the front-desk supervisor at Harborside Health.
  thuy: {
    name: "Thuy Nguyen",
    initials: "TN",
    color: "#188038",
    email: at("thuy.nguyen", HEALTH_DOMAIN),
    title: { en: "Front Desk Supervisor", es: "Supervisora de recepción" },
    org: HEALTH_NAME,
    phone: "(555) 0170",
  },
  // Acts VI–VII — the operations director at Harborside HQ.
  anita: {
    name: "Anita Raman",
    initials: "AR",
    color: "#8430ce",
    email: at("anita.raman", HQ_DOMAIN),
    title: { en: "Operations Director", es: "Directora de operaciones" },
    org: HQ_NAME,
    phone: "(555) 0191",
  },
  // Acts VI–VII — an HQ coworker. Sends quick notes, no signature block (no title).
  chris: {
    name: "Chris Okafor",
    initials: "CO",
    color: "#e8710a",
    email: at("chris.okafor", HQ_DOMAIN),
    org: HQ_NAME,
  },
};

/** The inbox-row identity fields (`from` / `initials` / `color`) for a cast member. */
export function inboxSender(m: CastMember): { from: string; initials: string; color: string } {
  return { from: m.name, initials: m.initials, color: m.color };
}

export function castByName(name: string): CastMember | undefined {
  return Object.values(CAST).find((m) => m.name === name);
}
