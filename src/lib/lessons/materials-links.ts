import type { Lang } from "@/lib/task-types";
import type { TaskKey } from "@/lib/desktop-content";

// Keep the authored packets out of the learner desktop's client bundle.
export const MATERIAL_TASKS: readonly TaskKey[] = [
  "mail-reply", "mail-attach", "calendar", "files", "spreadsheet", "appointment-scheduling",
];
export function materialsHref(key: string, lang: Lang): string | undefined {
  return MATERIAL_TASKS.includes(key as TaskKey) ? `/lessons/${key}/materials?lang=${lang}` : undefined;
}
export const MATERIAL_COPY = {
  open: { en: "Workplace materials", es: "Materiales del trabajo" },
  label: { en: "Classroom practice pack", es: "Materiales de práctica para clase" },
  note: { en: "Fictional documents for a teacher-led extension after the computer lesson. These are a new situation, not answers to the simulator. No account or completion credit is needed.", es: "Documentos ficticios para una actividad con el docente después de la lección en computadora. Es una situación nueva, no las respuestas del simulador. No se necesita cuenta ni se otorga crédito." },
  sources: { en: "Source documents", es: "Documentos de consulta" },
  teacher: { en: "Teacher discussion notes", es: "Notas de discusión para el docente" },
  discuss: { en: "Discuss together", es: "Para conversar" },
  evidence: { en: "Evidence to listen for", es: "Evidencia que se puede observar" },
  change: { en: "Change the situation", es: "Cambiar la situación" },
  support: { en: "Read the documents aloud if helpful. Learners can point, speak, or write; accept short answers in either language. Ask which document supports the answer. Observe the decision separately from reading or typing speed.", es: "Lea los documentos en voz alta si ayuda. Se puede señalar, hablar o escribir; acepte respuestas cortas en cualquiera de los dos idiomas. Pregunte qué documento respalda la respuesta. Observe la decisión por separado de la velocidad de lectura o escritura." },
  print: { en: "Print source documents", es: "Imprimir documentos de consulta" },
  back: { en: "Back to teacher preview", es: "Volver a la vista del docente" },
  fictional: { en: "Fictional practice document", es: "Documento ficticio de práctica" },
} as const;
