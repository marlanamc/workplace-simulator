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

/** The lesson library page (/lessons). `{n}`, `{d}`, `{q}` and `{topic}` are filled in. */
export const LIBRARY_COPY = {
  ask: { en: "What do you want to practice?", es: "¿Qué quieres practicar?" },
  search: { en: "Search lessons", es: "Buscar lecciones" },
  searchHint: { en: "Type a word, like email", es: "Escribe una palabra, como correo" },
  searchButton: { en: "Search", es: "Buscar" },
  try: { en: "Try:", es: "Prueba:" },
  chooseTopic: { en: "Or choose a topic", es: "O elige un tema" },
  back: { en: "All topics", es: "Todos los temas" },
  listen: { en: "Listen", es: "Escuchar" },
  otherLang: { en: "Español", es: "English" },
  start: { en: "Start", es: "Empezar" },
  again: { en: "Do again", es: "Otra vez" },
  done: { en: "Done", es: "Hecha" },
  minutes: { en: "{n} minutes", es: "{n} minutos" },
  oneLesson: { en: "1 lesson", es: "1 lección" },
  lessons: { en: "{n} lessons", es: "{n} lecciones" },
  progress: { en: "{d} of {n} done", es: "{d} de {n} hechas" },
  show: { en: "Show:", es: "Mostrar:" },
  all: { en: "All", es: "Todas" },
  notDone: { en: "Not done yet", es: "Sin hacer" },
  allDoneTopic: { en: "✓ You did every lesson in this topic.", es: "✓ Hiciste todas las lecciones de este tema." },
  oneResult: { en: "1 lesson for “{q}”", es: "1 lección para “{q}”" },
  results: { en: "{n} lessons for “{q}”", es: "{n} lecciones para “{q}”" },
  oneResultIn: { en: "1 lesson for “{q}” in {topic}", es: "1 lección para “{q}” en {topic}" },
  resultsIn: { en: "{n} lessons for “{q}” in {topic}", es: "{n} lecciones para “{q}” en {topic}" },
  empty: {
    en: "No lessons match. Try a different word, or choose a topic.",
    es: "Ninguna lección coincide. Prueba otra palabra o elige un tema.",
  },
  seeTopics: { en: "See all topics", es: "Ver todos los temas" },
  forTeachers: { en: "For teachers", es: "Para docentes" },
  hideTeacher: { en: "Hide teacher links", es: "Ocultar enlaces del docente" },
  footer: {
    en: "Lessons use made-up names and details. This computer remembers what you finish.",
    es: "Las lecciones usan nombres y datos inventados. Esta computadora recuerda lo que terminas.",
  },
} satisfies Record<string, Localized>;

export const fill = (text: string, values: Record<string, string | number>) =>
  text.replace(/\{(\w+)\}/g, (m, k: string) => (k in values ? String(values[k]) : m));
