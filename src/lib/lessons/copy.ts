import type { Localized } from "@/lib/task-types";

/** Words the lesson frame adds around a game task. Everything else is the task's own copy. */
export const LESSON_COPY = {
  kicker: { en: "Lesson", es: "Lección" },
  guest: { en: "Student", es: "Estudiante" },
  doneLine: { en: "You did it. Lesson complete.", es: "Lo lograste. Terminaste la lección." },
  practiceAgain: { en: "Practice again", es: "Practicar otra vez" },
  backToLessons: { en: "Back to lessons", es: "Volver a las lecciones" },
  library: { en: "Lessons", es: "Lecciones" },
  libraryIntro: {
    en: "Short practice with real computer tasks. Each lesson runs on its own, on the same practice computer as the game.",
    es: "Práctica corta con tareas reales de computadora. Cada lección funciona sola, en la misma computadora de práctica del juego.",
  },
  openTask: { en: "Open the task", es: "Abrir la tarea" },
  start: { en: "Start lesson", es: "Empezar la lección" },
  minutes: { en: "{n} min", es: "{n} min" },
  guided: { en: "Guided", es: "Con guía" },
  independent: { en: "On my own", es: "Por mi cuenta" },
  supportLabel: { en: "Help level", es: "Nivel de ayuda" },
  signInToSave: { en: "Sign in to save", es: "Inicia sesión para guardar" },
  savedHere: {
    en: "This computer remembers it. Sign in so your teacher can see it.",
    es: "Esta computadora lo recuerda. Inicia sesión para que tu maestro lo vea.",
  },
  saving: { en: "Saving…", es: "Guardando…" },
  savedAccount: { en: "Saved. Your teacher can see it.", es: "Guardado. Tu maestro lo puede ver." },
  notSaved: {
    en: "It did not save yet. Try again, or tell your teacher.",
    es: "Todavía no se guardó. Vuelve a intentar o avísale a tu maestro.",
  },
  tryAgain: { en: "Try saving again", es: "Intentar guardar otra vez" },
} satisfies Record<string, Localized>;

/** Teacher-facing words: the preview bar and the guide. Never shown to a student. */
export const TEACHER_COPY = {
  preview: { en: "Teacher preview", es: "Vista del docente" },
  previewNote: { en: "Nothing is saved in preview.", es: "En la vista previa no se guarda nada." },
  guide: { en: "Teacher guide", es: "Guía para el docente" },
  hideGuide: { en: "Hide guide", es: "Ocultar guía" },
  copyLink: { en: "Copy student link", es: "Copiar enlace para estudiantes" },
  copied: { en: "Link copied", es: "Enlace copiado" },
  copyThis: { en: "Copy this link", es: "Copia este enlace" },
  previewLink: { en: "Teacher preview and guide", es: "Vista del docente y guía" },
  skills: { en: "Skills practiced", es: "Habilidades que practican" },
  prepare: { en: "Before class", es: "Antes de la clase" },
  stickingPoints: { en: "Where students get stuck", es: "Dónde se atascan" },
  followUp: { en: "Questions for after", es: "Preguntas para después" },
  finishedEarly: { en: "Finished early?", es: "¿Terminaron antes?" },
  supportTip: {
    en: "Choose support by computer experience, not English level. New computer users start with Guided.",
    es: "Elige el apoyo según la experiencia con computadoras, no el nivel de inglés. Quienes usan poco la computadora empiezan con Con guía.",
  },
} satisfies Record<string, Localized>;
