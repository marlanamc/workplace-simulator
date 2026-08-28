import type { Lang, Localized } from "@/lib/task-types";

/**
 * Every work email a learner reads opens by naming them. A bare "Hi," reads as a
 * mass mailing; "Hi Ana," is what a manager who knows you actually sends, and
 * that greeting line is the first piece of American email etiquette we model.
 */
export function firstName(displayName: string): string {
  return displayName.trim().split(/\s+/)[0] ?? "";
}

/** "Hi Ana," / "Hola Ana," — falls back to a warm generic if we have no name. */
export function mailGreeting(lang: Lang, displayName: string): string {
  const name = firstName(displayName);
  if (lang === "es") return name ? `Hola ${name},` : "Hola,";
  return name ? `Hi ${name},` : "Hi there,";
}

/**
 * The block a professional's email ends with: who they are, what they do, and
 * how to reach them. Learners read this to answer questions the body doesn't —
 * "is this person my manager?", "what number do I call?" — which is the whole
 * reason real signatures exist.
 */
export interface MailSignature {
  /** Full name as it is typed in the signature, not the first-name sign-off. */
  name: string;
  /** Job title. Localized — the same person, named in the learner's language. */
  title: Localized<string>;
  org: string;
  email: string;
  /** Optional: departments and outside senders don't always publish one. */
  phone?: string;
}

const HARBORSIDE = "Harborside Cafe";

/**
 * Keyed by the `from` name the inbox already shows, so a row and its signature
 * can never drift apart. A sender with no entry here signs off with just their
 * name — a coworker firing off a quick note doesn't paste a signature block,
 * and pretending otherwise would teach the wrong norm.
 */
export const SIGNATURES: Record<string, MailSignature> = {
  "Maria Delgado": {
    name: "Maria Delgado",
    title: { en: "Cafe Manager", es: "Gerente del café" },
    org: HARBORSIDE,
    email: "maria.delgado@harborsidecafe.com",
    phone: "(555) 0142",
  },
  "Harborside HR": {
    name: "Harborside HR",
    title: { en: "Human Resources", es: "Recursos Humanos" },
    org: HARBORSIDE,
    email: "hr@harborsidecafe.com",
  },
  "Jordan Kim": {
    name: "Jordan Kim",
    title: { en: "Shift Lead", es: "Líder de turno" },
    org: HARBORSIDE,
    email: "jordan.kim@harborsidecafe.com",
  },
};

export function signatureFor(from: string): MailSignature | undefined {
  return SIGNATURES[from];
}

/**
 * The signature as lines of text, for read-aloud and for surfaces that render
 * a body as plain paragraphs. The rendered block in Mail uses the object.
 */
export function signatureLines(sig: MailSignature, lang: Lang): string[] {
  return [
    sig.name,
    `${sig.title[lang]}, ${sig.org}`,
    sig.email,
    ...(sig.phone ? [sig.phone] : []),
  ];
}
