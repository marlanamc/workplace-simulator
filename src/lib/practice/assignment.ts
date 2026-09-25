import type { Localized } from "@/lib/task-types";
import { MODES, type Mode, type PracticeActivity } from "./types";
export type AssignmentStage =
  "classwork" | "assignment" | "turnedIn" | "complete";
export type FileId = "schedule" | "schedule-old" | "shopping" | "photo";
export type AssignmentDraft = {
  version: 1;
  stage: AssignmentStage;
  mode: Mode;
  attached: FileId[];
  comment: string;
};
const STAGES: readonly AssignmentStage[] = [
  "classwork",
  "assignment",
  "turnedIn",
  "complete",
];
/** The simulated class stays in English; only the reason a file is wrong is bilingual. */
export const FILES: {
  id: FileId;
  name: string;
  modified: string;
  wrong?: Localized;
}[] = [
  {
    id: "schedule-old",
    name: "My schedule (old).docx",
    modified: "Sep 3",
    wrong: {
      en: "“My schedule (old).docx” is last month’s file. Remove it and attach My schedule.docx.",
      es: "“My schedule (old).docx” es el archivo del mes pasado. Quítalo y adjunta My schedule.docx.",
    },
  },
  { id: "schedule", name: "My schedule.docx", modified: "Today" },
  {
    id: "shopping",
    name: "Shopping list.docx",
    modified: "Yesterday",
    wrong: {
      en: "“Shopping list.docx” is not the homework. Remove it and attach My schedule.docx.",
      es: "“Shopping list.docx” no es la tarea. Quítalo y adjunta My schedule.docx.",
    },
  },
  {
    id: "photo",
    name: "IMG_0412.jpg",
    modified: "Sep 20",
    wrong: {
      en: "“IMG_0412.jpg” is a photo, not the document. Remove it and attach My schedule.docx.",
      es: "“IMG_0412.jpg” es una foto, no el documento. Quítala y adjunta My schedule.docx.",
    },
  },
];
export const fileName = (id: FileId) => FILES.find((f) => f.id === id)!.name;
export const blankAssignment = (mode: Mode = "guided"): AssignmentDraft => ({
  version: 1,
  stage: "classwork",
  mode,
  attached: [],
  comment: "",
});
/** Messages for Turn in; empty means the right file, and only it, is attached. */
export function attachmentErrors(d: AssignmentDraft): Localized[] {
  if (!d.attached.length)
    return [
      {
        en: "Nothing is attached yet. Click Add or create and choose My schedule.docx.",
        es: "Todavía no hay nada adjunto. Haz clic en Add or create y elige My schedule.docx.",
      },
    ];
  // Every wrong file's message already says to attach the right one.
  return d.attached.flatMap((id) => {
    const w = FILES.find((f) => f.id === id)?.wrong;
    return w ? [w] : [];
  });
}
export const commentWords = (s: string) =>
  s.trim().split(/\s+/).filter(Boolean).length;
export function commentError(d: AssignmentDraft): Localized | null {
  return commentWords(d.comment) >= 4
    ? null
    : {
        en: "Write a full sentence — four words or more. Example: My busiest day is Monday.",
        es: "Escribe una oración completa — cuatro palabras o más. Ejemplo: My busiest day is Monday.",
      };
}
export function parseAssignment(value: unknown): AssignmentDraft | null {
  if (!value || typeof value !== "object") return null;
  const d = value as AssignmentDraft;
  if (
    d.version !== 1 ||
    !STAGES.includes(d.stage) ||
    !MODES.includes(d.mode) ||
    !Array.isArray(d.attached) ||
    d.attached.length > FILES.length ||
    new Set(d.attached).size !== d.attached.length ||
    !d.attached.every((id) => FILES.some((f) => f.id === id)) ||
    typeof d.comment !== "string" ||
    d.comment.length > 500
  )
    return null;
  const clean: AssignmentDraft = {
    version: 1,
    stage: d.stage,
    mode: d.mode,
    attached: [...d.attached],
    comment: d.comment,
  };
  if (
    ["turnedIn", "complete"].includes(d.stage) &&
    attachmentErrors(clean).length
  )
    return null;
  if (d.stage === "complete" && commentError(clean)) return null;
  return clean;
}
export const assignment: PracticeActivity<AssignmentDraft> = {
  id: "assignment",
  version: 1,
  eyebrow: { en: "CLASSROOM · FILES", es: "CLASSROOM · ARCHIVOS" },
  title: { en: "Turn in homework", es: "Entregar una tarea" },
  summary: {
    en: "Find an assignment, attach the right file, turn it in, and write a class comment.",
    es: "Encuentra una tarea, adjunta el archivo correcto, entrégala y escribe un comentario para la clase.",
  },
  minutes: {
    en: "About 5–10 minutes · No account needed",
    es: "Aproximadamente 5–10 minutos · Sin cuenta",
  },
  stages: STAGES,
  blank: blankAssignment,
  parseDraft: parseAssignment,
  instructions: {
    classwork: {
      en: "Find the assignment “My weekly schedule.” Click it, then click View instructions.",
      es: "Busca la tarea “My weekly schedule”. Haz clic en ella y luego en View instructions.",
    },
    assignment: {
      en: "Click Add or create. Attach My schedule.docx — not the old one. Then click Turn in.",
      es: "Haz clic en Add or create. Adjunta My schedule.docx — no el viejo. Luego haz clic en Turn in.",
    },
    turnedIn: {
      en: "Check that it says Turned in. Then add a class comment: answer Ms. Rivera’s question or reply to Sam.",
      es: "Revisa que diga Turned in. Luego escribe un comentario para la clase: responde la pregunta de Ms. Rivera o contesta a Sam.",
    },
    complete: {
      en: "Your practice homework was turned in and your comment was posted. Nothing went to a real class.",
      es: "Entregaste tu tarea de práctica y publicaste tu comentario. No se envió nada a una clase real.",
    },
  },
  help: {
    classwork: {
      en: "Classwork is the list of homework. Each line is one assignment. Look for the name, then click it to see more. Stream and People are other pages of the class.",
      es: "Classwork es la lista de tareas. Cada línea es una tarea. Busca el nombre y haz clic para ver más. Stream y People son otras páginas de la clase.",
    },
    assignment: {
      en: "Google Drive and File both show Maya’s files. Look at the names and dates — the newest schedule is from Today. If you attach the wrong file, click the ✕ next to it to remove it.",
      es: "Google Drive y File muestran los archivos de Maya. Mira los nombres y las fechas — el horario más nuevo es de Today (hoy). Si adjuntas el archivo equivocado, haz clic en la ✕ para quitarlo.",
    },
    turnedIn: {
      en: "The words Turned in mean your teacher can see your file. Class comments are for the whole class: type in the box and click the arrow to post. One or two sentences is enough.",
      es: "Turned in significa que tu maestra puede ver tu archivo. Los comentarios de la clase los ven todos: escribe en el cuadro y haz clic en la flecha para publicar. Una o dos oraciones son suficientes.",
    },
    complete: {
      en: "Made a mistake on real homework? Click Unsubmit, fix the file, and turn it in again.",
      es: "¿Te equivocaste en una tarea real? Haz clic en Unsubmit, corrige el archivo y vuelve a entregarla.",
    },
  },
  goal: {
    en: "Turn in Maya’s file for “My weekly schedule,” then post a class comment.",
    es: "Entrega el archivo de Maya para “My weekly schedule” y luego publica un comentario para la clase.",
  },
  details: [
    { label: { en: "Class", es: "Clase" }, value: "English 3 · Ms. Rivera" },
    { label: { en: "Assignment", es: "Tarea" }, value: "My weekly schedule" },
    {
      label: { en: "File to attach", es: "Archivo para adjuntar" },
      value: "My schedule.docx",
    },
    {
      label: { en: "Class comment", es: "Comentario" },
      value: {
        en: "One or two sentences about your week",
        es: "Una o dos oraciones sobre tu semana (en inglés)",
      },
    },
  ],
  guide: {
    skills: [
      {
        en: "Find one assignment in a list",
        es: "Encontrar una tarea en una lista",
      },
      {
        en: "Attach a file — and choose the right one by name and date",
        es: "Adjuntar un archivo — y elegir el correcto por nombre y fecha",
      },
      {
        en: "Remove a wrong attachment",
        es: "Quitar un archivo adjunto equivocado",
      },
      {
        en: "Turn in, confirm, and check the status says Turned in",
        es: "Entregar, confirmar y revisar que diga Turned in",
      },
      {
        en: "Write a short class comment",
        es: "Escribir un comentario corto para la clase",
      },
    ],
    prepare: [
      {
        en: "If your class uses Google Classroom, show where Classwork is in your real class afterward.",
        es: "Si tu clase usa Google Classroom, muestra después dónde está Classwork en tu clase real.",
      },
      {
        en: "Choose support by computer experience, not English level: new computer users start with Guided.",
        es: "Elige el apoyo según la experiencia con computadoras, no el nivel de inglés: quienes usan poco la computadora empiezan con Con guía.",
      },
    ],
    stickingPoints: [
      {
        en: "Choosing “My schedule (old).docx.” Talk about how file names and dates help.",
        es: "Elegir “My schedule (old).docx”. Habla de cómo ayudan los nombres y las fechas.",
      },
      {
        en: "Clicking Turn in with nothing attached.",
        es: "Hacer clic en Turn in sin nada adjunto.",
      },
      {
        en: "Not knowing if it worked. Point to the words Turned in.",
        es: "No saber si funcionó. Señala las palabras Turned in.",
      },
      {
        en: "The comment: one full sentence is enough. Students can reply to Sam instead of the teacher.",
        es: "El comentario: una oración completa es suficiente. Pueden contestar a Sam en vez de a la maestra.",
      },
    ],
    followUp: [
      {
        en: "Where are the files on your phone or Chromebook? How do you find the newest one?",
        es: "¿Dónde están los archivos en tu teléfono o Chromebook? ¿Cómo encuentras el más nuevo?",
      },
      {
        en: "How can you tell your homework was turned in?",
        es: "¿Cómo sabes que entregaste la tarea?",
      },
      {
        en: "What would you do if you turned in the wrong file?",
        es: "¿Qué harías si entregaras el archivo equivocado?",
      },
    ],
    peerHelp: {
      en: "Students who finish early can sit beside a classmate and point to the screen — the classmate does the clicking.",
      es: "Quienes terminen antes pueden sentarse junto a un compañero y señalar la pantalla — el compañero hace los clics.",
    },
  },
};
