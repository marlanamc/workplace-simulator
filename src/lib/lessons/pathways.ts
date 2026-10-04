import type { TaskKey } from "@/lib/desktop-content";
import type { Localized } from "@/lib/task-types";

export type LessonPathway = {
  key: string;
  title: Localized;
  summary: Localized;
  taskKeys: TaskKey[];
};

/** Short, optional sequences of published lessons. Never gates or separate credits. */
export const LESSON_PATHWAYS: LessonPathway[] = [
  {
    key: "classwork",
    title: { en: "Do classwork online", es: "Hacer tareas en línea" },
    summary: { en: "Practice signing in, replying to a teacher, sending a file, and submitting an assignment.", es: "Practica entrar a una cuenta, responder al docente, enviar un archivo y entregar una tarea." },
    taskKeys: ["account-recovery", "mail-reply", "mail-attach", "coursework"],
  },
  {
    key: "work-communication",
    title: { en: "Talk at work", es: "Hablar en el trabajo" },
    summary: { en: "Practice replying to messages, checking your schedule, and responding to a meeting invitation.", es: "Practica responder mensajes, revisar tu horario y responder a una invitación de reunión." },
    taskKeys: ["mail-reply", "schedule", "calendar"],
  },
  {
    key: "job-application",
    title: { en: "Get a job", es: "Conseguir empleo" },
    summary: { en: "Practice reading a job posting, filling out an application, and drafting a résumé with fictional information.", es: "Practica leer un anuncio de empleo, llenar una solicitud y preparar un currículum con datos ficticios." },
    taskKeys: ["job-posting", "job-application", "resume-build"],
  },
];

/** One or two words per lesson, shown on its puzzle piece in a goal's tower. */
export const PIECE_LABELS: Partial<Record<TaskKey, Localized>> = {
  "account-recovery": { en: "Sign in", es: "Entrar" },
  "mail-reply": { en: "Reply", es: "Responder" },
  "mail-attach": { en: "Attach", es: "Adjuntar" },
  coursework: { en: "Turn in", es: "Entregar" },
  schedule: { en: "Schedule", es: "Horario" },
  calendar: { en: "Meeting", es: "Reunión" },
  "job-posting": { en: "Job ad", es: "Anuncio" },
  "job-application": { en: "Apply", es: "Solicitud" },
  "resume-build": { en: "Résumé", es: "Currículum" },
};

export const pathwayByKey = (key?: string | null) => LESSON_PATHWAYS.find(p => p.key === key);
export const PATHWAY_COPY = {
  heading: { en: "Pick a goal", es: "Elige una meta" },
  order: { en: "Follow this suggested order, or choose any lesson. You can stop and come back.", es: "Sigue este orden sugerido o elige cualquier lección. Puedes parar y volver después." },
};
