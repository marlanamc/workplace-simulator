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
    title: { en: "Do my classwork online", es: "Hacer mis tareas en línea" },
    summary: { en: "Practice signing in, replying to a teacher, sending a file, and submitting an assignment.", es: "Practica entrar a una cuenta, responder al docente, enviar un archivo y entregar una tarea." },
    taskKeys: ["account-recovery", "mail-reply", "mail-attach", "coursework"],
  },
  {
    key: "work-communication",
    title: { en: "Communicate at work", es: "Comunicarme en el trabajo" },
    summary: { en: "Practice replying to messages, checking your schedule, and responding to a meeting invitation.", es: "Practica responder mensajes, revisar tu horario y responder a una invitación de reunión." },
    taskKeys: ["mail-reply", "schedule", "calendar"],
  },
  {
    key: "job-application",
    title: { en: "Apply for a job", es: "Solicitar un empleo" },
    summary: { en: "Practice reading a job posting, filling out an application, and drafting a résumé with fictional information.", es: "Practica leer un anuncio de empleo, llenar una solicitud y preparar un currículum con datos ficticios." },
    taskKeys: ["job-posting", "job-application", "resume-build"],
  },
];

export const pathwayByKey = (key?: string | null) => LESSON_PATHWAYS.find(p => p.key === key);
export const PATHWAY_COPY = {
  heading: { en: "Practice for a goal", es: "Practica para una meta" },
  intro: { en: "Choose a short pathway of lessons that go together.", es: "Elige una ruta corta de lecciones relacionadas." },
  open: { en: "See the lessons", es: "Ver las lecciones" },
  order: { en: "Follow this suggested order, or choose any lesson. You can stop and come back.", es: "Sigue este orden sugerido o elige cualquier lección. Puedes parar y volver después." },
};
