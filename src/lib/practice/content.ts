import type { Localized } from "@/lib/task-types";
export type Mode = "guided" | "independent";
export type Stage = "email" | "form" | "review" | "complete";
export type Draft = {
  version: 1;
  stage: Stage;
  mode: Mode;
  firstName: string;
  lastName: string;
  email: string;
  session: string;
};
export const blank = (mode: Mode = "guided"): Draft => ({
  version: 1,
  stage: "email",
  mode,
  firstName: "",
  lastName: "",
  email: "",
  session: "",
});
export const instructions: Record<Stage, Localized> = {
  email: {
    en: "Read the invitation. Open its registration link.",
    es: "Lee la invitación. Abre el enlace de inscripción.",
  },
  form: {
    en: "Use Maya’s practice details. Choose Tuesday at 6:00 PM, then review your answers.",
    es: "Usa los datos de práctica de Maya. Elige el martes a las 6:00 PM y revisa tus respuestas.",
  },
  review: {
    en: "Check each answer. Edit if needed, then submit the registration.",
    es: "Revisa cada respuesta. Corrige lo necesario y envía la inscripción.",
  },
  complete: {
    en: "The confirmation means your practice registration was submitted. No real workshop was booked.",
    es: "La confirmación indica que enviaste tu inscripción de práctica. No reservaste un taller real.",
  },
};
export const goal: Localized = {
  en: "Register Maya Torres for the Tuesday computer workshop using the invitation.",
  es: "Inscribe a Maya Torres en el taller de computación del martes usando la invitación.",
};
export function errors(
  d: Draft,
): Partial<Record<"firstName" | "lastName" | "email" | "session", Localized>> {
  const out: ReturnType<typeof errors> = {};
  if (d.firstName.trim().toLowerCase() !== "maya")
    out.firstName = {
      en: "Use the practice first name: Maya.",
      es: "Usa el nombre de práctica: Maya.",
    };
  if (d.lastName.trim().toLowerCase() !== "torres")
    out.lastName = {
      en: "Use the practice last name: Torres.",
      es: "Usa el apellido de práctica: Torres.",
    };
  if (d.email.trim().toLowerCase() !== "maya.torres@example.com")
    out.email = {
      en: "Check the practice email: maya.torres@example.com.",
      es: "Revisa el correo de práctica: maya.torres@example.com.",
    };
  if (d.session !== "tuesday")
    out.session = {
      en: "The invitation asks for Tuesday at 6:00 PM.",
      es: "La invitación pide el martes a las 6:00 PM.",
    };
  return out;
}
export function parseDraft(value: unknown): Draft | null {
  if (!value || typeof value !== "object") return null;
  const d = value as Draft;
  if (
    d.version !== 1 ||
    !["email", "form", "review", "complete"].includes(d.stage) ||
    !["guided", "independent"].includes(d.mode)
  )
    return null;
  if (
    ![d.firstName, d.lastName, d.email, d.session].every(
      (v) => typeof v === "string" && v.length <= 200,
    )
  )
    return null;
  if (["review", "complete"].includes(d.stage) && Object.keys(errors(d)).length)
    return null;
  return {
    version: 1,
    stage: d.stage,
    mode: d.mode,
    firstName: d.firstName,
    lastName: d.lastName,
    email: d.email,
    session: d.session,
  };
}
export function practiceReturn(raw: string): string {
  if (raw === "/teacher" || raw === "/studio") return raw;
  try {
    const u = new URL(raw, "https://practice.invalid");
    if (
      u.origin !== "https://practice.invalid" ||
      u.pathname !== "/practice/workshop"
    )
      return "/";
    const q = new URLSearchParams();
    for (const [key, choices] of Object.entries({
      mode: ["guided", "independent"],
      lang: ["en", "es"],
      transfer: ["1"],
    })) {
      const v = u.searchParams.get(key);
      if (v && choices.includes(v)) q.set(key, v);
    }
    return "/practice/workshop" + (q.size ? "?" + q : "");
  } catch {
    return "/";
  }
}
