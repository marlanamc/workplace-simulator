import type { Localized } from "@/lib/task-types";
import type { Mode, PracticeActivity } from "./types";
export type { Mode } from "./types";
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
const HELP: Localized = {
  en: "The underlined registration link opens the form. Type the details below into the matching fields. You can go back and edit before submitting.",
  es: "El enlace subrayado abre el formulario. Escribe los datos de abajo en los campos correspondientes. Puedes volver y corregir antes de enviar.",
};
export const workshop: PracticeActivity<Draft> = {
  id: "workshop",
  version: 1,
  eyebrow: { en: "EMAIL · ONLINE FORMS", es: "CORREO · FORMULARIOS" },
  title: { en: "Register for a workshop", es: "Inscribirse en un taller" },
  summary: {
    en: "Read an invitation, complete a form, and check your confirmation.",
    es: "Lee una invitación, completa un formulario y revisa la confirmación.",
  },
  minutes: {
    en: "About 5–10 minutes · No account needed",
    es: "Aproximadamente 5–10 minutos · Sin cuenta",
  },
  stages: ["email", "form", "review", "complete"],
  blank,
  parseDraft,
  instructions,
  help: { email: HELP, form: HELP, review: HELP, complete: HELP },
  goal,
  details: [
    { label: { en: "First name", es: "Nombre" }, value: "Maya" },
    { label: { en: "Last name", es: "Apellido" }, value: "Torres" },
    { label: { en: "Email", es: "Correo" }, value: "maya.torres@example.com" },
    {
      label: { en: "Requested session", es: "Sesión solicitada" },
      value: { en: "Tuesday · 6:00 PM", es: "Martes · 6:00 PM" },
    },
  ],
  guide: {
    skills: [
      {
        en: "Open a link inside an email",
        es: "Abrir un enlace dentro de un correo",
      },
      {
        en: "Type into form fields and choose from a list",
        es: "Escribir en campos de un formulario y elegir de una lista",
      },
      {
        en: "Review answers and fix mistakes before submitting",
        es: "Revisar respuestas y corregir errores antes de enviar",
      },
      { en: "Read a confirmation page", es: "Leer una página de confirmación" },
    ],
    prepare: [
      {
        en: "Project the invitation and point out what a link looks like (underlined, a different color).",
        es: "Proyecta la invitación y muestra cómo se ve un enlace (subrayado, de otro color).",
      },
      {
        en: "Choose support by computer experience, not English level: new computer users start with Guided.",
        es: "Elige el apoyo según la experiencia con computadoras, no el nivel de inglés: quienes usan poco la computadora empiezan con Con guía.",
      },
    ],
    stickingPoints: [
      {
        en: "Typing the email address: the dot and the @ sign.",
        es: "Escribir el correo: el punto y la arroba (@).",
      },
      {
        en: "Choosing Saturday instead of Tuesday — the form says what is wrong.",
        es: "Elegir el sábado en vez del martes — el formulario dice qué está mal.",
      },
      {
        en: "Worrying that Review sends the form. Show the Edit answers button.",
        es: "Pensar que Revisar envía el formulario. Muestra el botón Edit answers.",
      },
    ],
    followUp: [
      {
        en: "Where do you see links like this in your real email or text messages?",
        es: "¿Dónde ves enlaces así en tu correo o mensajes reales?",
      },
      {
        en: "What do you check before you press Submit on a real form?",
        es: "¿Qué revisas antes de presionar Enviar en un formulario real?",
      },
      {
        en: "How do you know the registration worked?",
        es: "¿Cómo sabes que la inscripción funcionó?",
      },
    ],
    peerHelp: {
      en: "Students who finish early can sit beside a classmate and point to the screen — the classmate does the clicking.",
      es: "Quienes terminen antes pueden sentarse junto a un compañero y señalar la pantalla — el compañero hace los clics.",
    },
  },
};
