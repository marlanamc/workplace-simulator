import type { Lang, Lesson, Localized } from "@/lib/task-types";

export const DUE = { en: "Friday, 11:59 PM", es: "Viernes, 11:59 PM" };

export const COURSEWORK_COPY: Record<Lang, {
  helpBtn: string;
  course: string;
  heading: string;
  syllabus: string;
  dueLabel: string;
  assignment: string;
  prompt: string;
  ackLabel: string;
  writeHere: string;
  submit: string;
  needAck: string;
  empty: string;
  weak: string;
  sentKicker: string;
  tryAgain: string;
  backToDesk: string;
  lessonKicker: string;
  tipLabel: string;
  gotIt: string;
}> = {
  en: {
    helpBtn: "Help me with this step",
    course: "Workplace Writing 101",
    heading: "This week's assignment",
    syllabus: "Read the assigned email. Write 3–4 sentences on how you would reply at work. Due Friday, 11:59 PM. Late work is not accepted.",
    dueLabel: "Due",
    assignment: "How would you reply?",
    prompt: "A coworker emailed you a complaint from a customer. Write a short reply you would actually send.",
    ackLabel: "I see this is due Friday at 11:59 PM",
    writeHere: "Write your reply…",
    submit: "Submit assignment",
    needAck: "Check the due date first. It is on the syllabus.",
    empty: "Write a short reply first.",
    weak: "A real reply says you heard them and what you will do next.",
    sentKicker: "Assignment submitted",
    tryAgain: "Do it again",
    backToDesk: "Back to desktop",
    lessonKicker: "2-minute lesson",
    tipLabel: "Tip",
    gotIt: "Got it. Back to my task",
  },
  es: {
    helpBtn: "Ayúdame con este paso",
    course: "Escritura en el trabajo 101",
    heading: "Tarea de esta semana",
    syllabus: "Lee el correo. Escribe 3–4 oraciones sobre cómo responderías en el trabajo. Entrega: viernes, 11:59 PM. No se acepta tarde.",
    dueLabel: "Entrega",
    assignment: "¿Cómo responderías?",
    prompt: "Un compañero te reenvió una queja de un cliente. Escribe una respuesta corta que de verdad enviarías.",
    ackLabel: "Ya vi que se entrega el viernes a las 11:59 PM",
    writeHere: "Escribe tu respuesta…",
    submit: "Entregar tarea",
    needAck: "Marca la fecha primero. Está en el temario.",
    empty: "Primero escribe una respuesta corta.",
    weak: "Una respuesta real dice que los oíste y qué harás después.",
    sentKicker: "Tarea entregada",
    tryAgain: "Hacerlo otra vez",
    backToDesk: "Volver al escritorio",
    lessonKicker: "Lección de 2 minutos",
    tipLabel: "Consejo",
    gotIt: "Entendido. Volver a mi tarea",
  },
};

export const STARTERS: Record<Lang, string[]> = {
  en: [
    "Thank you for telling me. I will look into this today and write you back.",
    "I hear you. I will check with my manager and follow up this afternoon.",
    "Gracias por avisar. Voy a revisar esto hoy y te escribo.",
  ],
  es: [
    "Gracias por avisar. Voy a revisar esto hoy y te escribo.",
    "Te escuché. Voy a hablar con mi gerente y te confirmo esta tarde.",
    "Thank you for telling me. I will look into this today.",
  ],
};

export function responseIsComplete(body: string): boolean {
  const t = body.trim();
  if (t.length < 28) return false;
  return /thank|gracias|sorry|siento|look|revis|follow|seguir|check|hablar|manager|gerente|today|hoy|afternoon|tarde/.test(
    t.toLowerCase(),
  );
}

export const LESSONS: Record<Lang, Lesson[]> = {
  en: [
    {
      t: "The due date is part of the job",
      s: [
        "Read the syllabus before you write. The date is the first fact.",
        "Check the box only after you have seen Friday 11:59 PM.",
        "A complete reply is short: you heard them, and you will do a next step.",
      ],
      tip: "Submitting without reading the date is the miss this lesson is about.",
    },
  ],
  es: [
    {
      t: "La fecha es parte del trabajo",
      s: [
        "Lee el temario antes de escribir. La fecha es el primer dato.",
        "Marca la casilla solo cuando ya viste el viernes a las 11:59 PM.",
        "Una respuesta completa es corta: los oíste, y harás un siguiente paso.",
      ],
      tip: "Entregar sin leer la fecha es el error de esta lección.",
    },
  ],
};

export const RIGHT_NOW_LABEL: Localized = { en: "Right now", es: "Ahora mismo" };
export const RIGHT_NOW_STEPS: Localized[] = [
  { en: "Read the syllabus due date.", es: "Lee la fecha del temario." },
  { en: "Check that you saw Friday 11:59 PM.", es: "Marca que viste el viernes a las 11:59 PM." },
  { en: "Write a short reply and submit.", es: "Escribe una respuesta corta y entrega." },
];
