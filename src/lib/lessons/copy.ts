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
} satisfies Record<string, Localized>;
