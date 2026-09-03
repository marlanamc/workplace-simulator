import type { TaskKey } from "@/lib/desktop-content";
import { CAST, inboxSender } from "@/lib/cast";
import { firstName, mailGreeting, signatureFor } from "@/lib/mail-greeting";
import type { Lang, Localized } from "@/lib/task-types";
import { LEVELS, taskKeysForLevel } from "@/lib/tracks-content";
import { TASK_LIST } from "@/lib/tasks/registry";

export const HUDDLE_TIME_FLAG = "huddleTime";
/** Set when the learner flags a hours mismatch and Mail should open to compose. */
export const TIMECLOCK_MAIL_FLAG = "timeclock-mail-open";

export type StoryFlags = Record<string, string>;

export type InboxRow = {
  key: string;
  from: string;
  initials: string;
  color: string;
  time: string;
  isTarget?: boolean;
  unread?: boolean;
  story?: boolean;
  subject: Localized;
  preview: Localized;
  wrongHint?: Localized;
  body?: Record<Lang, string[]>;
  unlockAfter: TaskKey;
};

/**
 * Done-screen "Next" button, keyed by the task it opens, and one line of
 * clock time per task for the desktop briefing. Both derived from the task
 * registry (`src/lib/tasks/registry.ts`).
 *
 * On `shiftMoment`: **time only ever moves forward.** Read the registry top
 * to bottom, these are the days of the learner's employment in order, and
 * each level (see `dayNumber`) is one workday. `story-coherence.test.ts`
 * enforces the weekday ordering; when you add a task give it a moment at or
 * after the task above it, and never reuse a weekday for a different level.
 */
export const HANDOFF_CTA: Record<TaskKey, Localized> = Object.fromEntries(
  TASK_LIST.map((d) => [d.key, d.handoffCta]),
) as Record<TaskKey, Localized>;

export const SHIFT_MOMENT: Record<TaskKey, Localized> = Object.fromEntries(
  TASK_LIST.map((d) => [d.key, d.shiftMoment]),
) as Record<TaskKey, Localized>;

const MARIA = inboxSender(CAST.maria);

export function extractHuddleTime(text: string): "10am" | "2pm" {
  if (/\b2\s*(p\.?m\.?|pm)\b/i.test(text) || /\b14:00\b/.test(text)) return "2pm";
  return "10am";
}

function huddleReply(flags: StoryFlags): Pick<InboxRow, "subject" | "preview" | "body"> {
  if (flags[HUDDLE_TIME_FLAG] === "2pm") {
    return {
      subject: { en: "Thursday at 2 PM works", es: "El jueves a las 2 PM funciona" },
      preview: { en: "See you at the huddle.", es: "Nos vemos en la reunión." },
      body: {
        en: [
          "Thursday at 2 PM works. See you at the huddle.",
          "Thank you for catching that.",
          "Monday, Jordan starts. Share the file, not the folder.",
        ],
        es: [
          "El jueves a las 2 PM funciona. Nos vemos en la reunión.",
          "Gracias por darte cuenta.",
          "El lunes empieza Jordan. Comparte el archivo, no la carpeta.",
        ],
      },
    };
  }
  return {
    subject: { en: "Thursday at 10 AM works", es: "El jueves a las 10 AM funciona" },
    preview: { en: "See you at the huddle.", es: "Nos vemos en la reunión." },
    body: {
        en: [
          "Thursday at 10 AM works. See you at the huddle.",
          "Thank you for catching that.",
          "Monday, Jordan starts. Share the file, not the folder.",
        ],
        es: [
          "El jueves a las 10 AM funciona. Nos vemos en la reunión.",
          "Gracias por darte cuenta.",
          "El lunes empieza Jordan. Comparte el archivo, no la carpeta.",
        ],
    },
  };
}

const STORY_MAILS: InboxRow[] = [
  {
    key: "story-mail",
    ...MARIA,
    time: "8:22 AM",
    unread: true,
    story: true,
    // Fires after the last Day One mail job (welcome thank-you + safety attach).
    unlockAfter: "mail-attach",
    subject: { en: "Got it. Thank you", es: "Lo tengo. Gracias" },
    preview: { en: "Thanks for sending this so fast.", es: "Gracias por enviarlo tan rápido." },
    body: {
      en: [
        "Got it. Thank you for sending the July report so fast.",
        "See you on the floor.",
        "Next I need you to check your schedule.",
      ],
      es: [
        "Lo tengo. Gracias por enviar el reporte de julio tan rápido.",
        "Nos vemos en el piso.",
        "Ahora necesito que revises tu horario. Dos turnos se cruzan.",
      ],
    },
  },
  {
    key: "story-schedule",
    ...MARIA,
    time: "10:04 AM",
    unread: true,
    story: true,
    unlockAfter: "schedule",
    subject: { en: "Thursday swap", es: "Cambio del jueves" },
    preview: { en: "You're on the later shift Thursday.", es: "El jueves estás en el turno de tarde." },
    body: {
      en: [
        "Approved. You're on 2 to 10 Thursday, so go to your appointment.",
        "Thanks for catching it when the schedule went up instead of that morning.",
        "When the day ends, clock out and check your hours.",
      ],
      es: [
        "Aprobado. El jueves entras de 2 a 10, así que ve a tu cita.",
        "Gracias por verlo cuando salió el horario y no esa misma mañana.",
        "Al final del día, marca salida y revisa tus horas.",
      ],
    },
  },
  {
    key: "story-timeclock",
    ...MARIA,
    time: "6:41 PM",
    unread: true,
    story: true,
    unlockAfter: "timeclock",
    subject: { en: "Your hours note", es: "Tu nota de horas" },
    preview: { en: "I'll look at the punch.", es: "Voy a revisar el registro." },
    body: {
      en: [
        "Got your note about the hours. I'll look at the punch and fix it if it is wrong.",
        "Friday is payday. Practice on Alex Chen's stub.",
      ],
      es: [
        "Recibí tu nota sobre las horas. Voy a revisar el registro y lo corrijo si está mal.",
        "El viernes es día de pago. Practica con el recibo de Alex Chen.",
      ],
    },
  },
  {
    key: "story-paystub",
    ...inboxSender(CAST.hr),
    time: "Fri",
    unread: true,
    story: true,
    unlockAfter: "paystub",
    subject: { en: "Alex's numbers check out", es: "Los números de Alex cuadran" },
    preview: { en: "You opened the right stub.", es: "Abriste el recibo correcto." },
    body: {
      en: [
        "You opened Alex Chen's stub, not the first name on the list.",
        "When yours lands in two weeks, read it the same way. If something looks off, write Maria.",
        "Monday is a normal shift, start to finish. Run it.",
      ],
      es: [
        "Abriste el recibo de Alex Chen, no el primer nombre de la lista.",
        "Cuando llegue el tuyo en dos semanas, léelo igual. Si algo se ve mal, escríbele a Maria.",
        "El lunes es un turno normal, de principio a fin. Hazlo.",
      ],
    },
  },
  {
    key: "story-call-out-sick",
    ...MARIA,
    time: "6:31 AM",
    unread: true,
    story: true,
    unlockAfter: "call-out-sick",
    subject: { en: "Feel better", es: "Que te mejores" },
    preview: { en: "I've got the shift covered.", es: "Ya cubrí el turno." },
    body: {
      en: [
        "Got it, and I have the shift covered. Rest today.",
        "You wrote before the shift instead of after it started, which is the part that matters. Two hours' notice is the rule here.",
        "When you're back, something may go wrong on the floor. Write it up if it does.",
      ],
      es: [
        "Recibido, y ya cubrí el turno. Descansa hoy.",
        "Escribiste antes del turno y no después de que empezara, que es lo que importa. Aquí la regla son dos horas de aviso.",
        "Cuando regreses, puede pasar algo en el piso. Escríbelo si pasa.",
      ],
    },
  },
  {
    key: "story-incident",
    ...MARIA,
    time: "2:18 PM",
    unread: true,
    story: true,
    unlockAfter: "incident",
    subject: { en: "Incident logged", es: "Incidente registrado" },
    preview: { en: "I have the write-up. Thank you.", es: "Tengo el reporte. Gracias." },
    body: {
      en: [
        "I have the write-up about the slip. Thank you.",
        "I'll follow up with the floor.",
        "The handbook is on your desk if they ask you something.",
      ],
      es: [
        "Tengo el reporte del resbalón. Gracias.",
        "Voy a dar seguimiento en el piso.",
        "El manual está en tu escritorio si te preguntan algo.",
      ],
    },
  },
  {
    key: "story-handbook",
    ...MARIA,
    time: "8:51 PM",
    unread: true,
    story: true,
    unlockAfter: "handbook",
    subject: { en: "You looked it up", es: "Lo buscaste" },
    preview: { en: "That's what the handbook is for.", es: "Para eso es el manual." },
    body: {
      en: [
        "You found the answer in the handbook instead of guessing. That is exactly what it is for.",
        "Next week you are a lead. The calendar is yours. Open it from the bookmarks bar.",
      ],
      es: [
        "Encontraste la respuesta en el manual en vez de adivinar. Para eso es.",
        "La semana que viene eres líder. El calendario es tuyo. Ábrelo en la barra de marcadores.",
      ],
    },
  },
  {
    key: "story-calendar",
    ...MARIA,
    time: "9:06 AM",
    unread: true,
    story: true,
    unlockAfter: "calendar",
    subject: { en: "Thursday at 10 AM works", es: "El jueves a las 10 AM funciona" },
    preview: { en: "See you at the huddle.", es: "Nos vemos en la reunión." },
  },
  {
    key: "story-files",
    ...MARIA,
    time: "11:12 AM",
    unread: true,
    story: true,
    unlockAfter: "files",
    subject: { en: "Jordan has the file", es: "Jordan ya tiene el archivo" },
    preview: { en: "Shared view only — just what I wanted.", es: "Compartido en solo ver, justo lo que quería." },
    body: {
      en: [
        "Jordan has this week's schedule as view only. That's exactly what I wanted.",
        "Friday the counts are due. Add them up yourself.",
      ],
      es: [
        "Jordan ya tiene el horario de esta semana en modo solo ver. Eso es justo lo que quería.",
        "El viernes hay que entregar las cuentas. Súmalas tú.",
      ],
    },
  },
  {
    key: "story-spreadsheet",
    ...MARIA,
    time: "4:03 PM",
    unread: true,
    story: true,
    unlockAfter: "spreadsheet",
    subject: { en: "Tip total", es: "Total de propinas" },
    preview: { en: "Got the number. I'll add it to pay.", es: "Tengo el número. Lo sumo al pago." },
    body: {
      en: [
        "Got the total. I'll add it to this week's pay.",
        "I shared a template. It is view only. Copy it first.",
      ],
      es: [
        "Tengo el total. Lo sumo al pago de esta semana.",
        "Compartí una plantilla. Es solo ver. Cópiala primero.",
      ],
    },
  },
  {
    key: "story-make-a-copy",
    ...MARIA,
    time: "9:18 AM",
    unread: true,
    story: true,
    unlockAfter: "make-a-copy",
    subject: { en: "Your copy, not the master", es: "Tu copia, no el original" },
    preview: { en: "That's the right way. Work in your copy.", es: "Así es como se hace. Trabaja en tu copia." },
    body: {
      en: ["You copied the template. The master is still clean.", "Now put this week's numbers in your copy."],
      es: ["Copiaste la plantilla. El original sigue limpio.", "Ahora pon los números de esta semana en tu copia."],
    },
  },
  {
    key: "story-status-report",
    ...MARIA,
    time: "11:02 AM",
    unread: true,
    story: true,
    unlockAfter: "status-report",
    subject: { en: "Got the total — and Jordan did too", es: "Tengo el total — y Jordan también" },
    preview: { en: "That's what a status email should look like.", es: "Así se ve un buen correo de estado." },
    body: {
      en: [
        "Got the SUM, and Jordan is on the email. That's what a status email should look like.",
        "Tuesday you'll have two things going at once. Do not let either one slip.",
      ],
      es: [
        "Tengo el SUM, y Jordan está en el correo. Así se ve un buen correo de estado.",
        "El martes vas a tener dos cosas a la vez. No dejes que se te pase ninguna.",
      ],
    },
  },
  {
    key: "story-triage",
    ...MARIA,
    time: "10:11 AM",
    unread: true,
    story: true,
    unlockAfter: "triage",
    subject: { en: "Friday 10 AM works", es: "El viernes a las 10 AM funciona" },
    preview: { en: "And Sam has the file. Thank you.", es: "Y Sam ya tiene el archivo. Gracias." },
    body: {
      en: [
        "Friday 10 AM works for inventory.",
        "Sam has the allergen list, view only. You did not forget either one.",
        "You write the crew's schedule now. Saturday's close still has no one on it.",
      ],
      es: [
        "El viernes a las 10 AM funciona para inventario.",
        "Sam tiene la lista de alérgenos, solo ver. No te olvidaste de ninguna.",
        "Ahora tú haces el horario del equipo. El cierre del sábado todavía no tiene a nadie.",
      ],
    },
  },
  {
    key: "story-team-schedule",
    ...inboxSender(CAST.jordan),
    time: "11:40 AM",
    unread: true,
    story: true,
    unlockAfter: "team-schedule",
    subject: { en: "Saturday close", es: "Cierre del sábado" },
    preview: { en: "Got it. I'll take 4–10.", es: "Listo. Yo hago el 4–10." },
    body: {
      en: [
        "Got it. I'll take Saturday close, 4–10.",
        "Thank you for asking the person with room.",
        "Friday, check the hours formula before payroll.",
      ],
      es: [
        "Listo. Yo hago el cierre del sábado, 4–10.",
        "Gracias por preguntarle a quien tenía espacio.",
        "El viernes, revisa la fórmula de horas antes de nómina.",
      ],
    },
  },
  {
    key: "story-formula-check",
    ...MARIA,
    time: "3:12 PM",
    unread: true,
    story: true,
    unlockAfter: "formula-check",
    subject: { en: "Hours total", es: "Total de horas" },
    preview: { en: "Casey was missing. Good catch.", es: "Faltaba Casey. Buen ojo." },
    body: {
      en: [
        "The SUM was one row short. Casey was missing.",
        "The new total is the one I'll send to payroll. Thank you.",
        "You call the huddle now. Short agenda.",
      ],
      es: [
        "El SUM se quedó corto una fila. Faltaba Casey.",
        "El total nuevo es el que mando a nómina. Gracias.",
        "Ahora tú llamas la reunión. Agenda corta.",
      ],
    },
  },
  {
    key: "story-team-meeting",
    ...MARIA,
    time: "10:04 AM",
    unread: true,
    story: true,
    unlockAfter: "team-meeting",
    subject: { en: "See you Thursday", es: "Nos vemos el jueves" },
    preview: { en: "A short agenda is a good huddle.", es: "Una agenda corta es una buena reunión." },
    body: {
      en: [
        "Thursday 10 AM. I saw the agenda.",
        "Two or three points is the right size for a huddle a lead can run.",
        "Thursday will be busy. Three things at once.",
      ],
      es: [
        "Jueves 10 AM. Vi la agenda.",
        "Dos o tres puntos es el tamaño justo para una reunión que un líder puede dirigir.",
        "El jueves va a estar movido. Tres cosas a la vez.",
      ],
    },
  },
  {
    key: "story-priority-call",
    ...MARIA,
    time: "6:02 PM",
    unread: true,
    story: true,
    unlockAfter: "priority-call",
    subject: { en: "You kept the floor running", es: "Mantuviste el local funcionando" },
    preview: { en: "There's an Assistant Manager opening.", es: "Hay una vacante de asistente de gerencia." },
    body: {
      en: [
        "Dana got a real answer. Thursday's close is covered. Saturday 10 AM works for me.",
        "There's an Assistant Manager opening. I want you to read the offer when you're ready.",
      ],
      es: [
        "Dana recibió una respuesta real. El cierre del jueves está cubierto. El sábado a las 10 AM me funciona.",
        "Hay una vacante de asistente de gerencia. Quiero que leas la oferta cuando estés listo.",
      ],
    },
  },
  {
    key: "story-college-offer",
    ...MARIA,
    time: "4:18 PM",
    unread: true,
    story: true,
    unlockAfter: "college-offer",
    subject: { en: "Class is on the calendar", es: "La clase ya está en el calendario" },
    preview: { en: "We'll work out Tuesday's close before the semester.", es: "Resolvemos el cierre del martes antes del semestre." },
    body: {
      en: [
        "You accepted the offer and put the class on a week that already had a close shift.",
        "We'll work out Tuesday before the semester starts. That is why it helps to say it now.",
        "Wednesday I need you to read this week's budget. One category is over.",
      ],
      es: [
        "Aceptaste la oferta y pusiste la clase en una semana que ya tenía un turno de cierre.",
        "Resolvemos lo del martes antes de que empiece el semestre. Por eso ayuda decirlo ahora.",
        "El miércoles necesito que leas el presupuesto de esta semana. Una categoría se pasó.",
      ],
    },
  },
  {
    key: "story-budget-sheet",
    ...MARIA,
    time: "3:40 PM",
    unread: true,
    story: true,
    unlockAfter: "budget-sheet",
    subject: { en: "Labor was the one over budget", es: "Mano de obra era la que se pasó" },
    preview: { en: "You read the IF. HQ writes next.", es: "Leíste el IF. HQ escribe después." },
    body: {
      en: [
        "Labor was over budget. You opened the formula instead of guessing from the total.",
        "I passed it up to HQ. They will email the cafe a question on Friday.",
        "Read the whole thread before you answer. Not every message needs to go to everyone.",
      ],
      es: [
        "Mano de obra se pasó del presupuesto. Abriste la fórmula en vez de adivinar por el total.",
        "Lo pasé a HQ. Ellos le van a escribir una pregunta al café el viernes.",
        "Lee todo el hilo antes de responder. No todos los mensajes tienen que ir a todos.",
      ],
    },
  },
  {
    key: "story-reply-all",
    ...MARIA,
    time: "5:12 PM",
    unread: true,
    story: true,
    unlockAfter: "reply-all",
    subject: { en: "You sent it to Dana", es: "Se lo enviaste a Dana" },
    preview: { en: "That's how an Assistant Manager writes.", es: "Así escribe un asistente de gerencia." },
    body: {
      en: [
        "Dana got a clear yes. The rest of the thread did not need to see it.",
        "You read your draft again before you sent it. Taking that moment is part of the job.",
        "There is more to come. For today, this was a real week as Assistant Manager.",
      ],
      es: [
        "Dana recibió un sí claro. El resto del hilo no tenía que verlo.",
        "Volviste a leer tu borrador antes de enviarlo. Tomarte ese momento es parte del trabajo.",
        "Viene más. Por hoy, esta fue una semana de verdad como asistente de gerencia.",
      ],
    },
  },
  {
    key: "story-enrollment",
    ...MARIA,
    time: "4:10 PM",
    unread: true,
    story: true,
    unlockAfter: "enrollment",
    subject: { en: "You sent the application", es: "Enviaste la solicitud" },
    preview: { en: "Find the deadline first, then apply.", es: "Primero busca la fecha límite, luego aplica." },
    body: {
      en: [
        "You found the deadline and sent the statement. That is how you use a portal.",
        "Wednesday the award letter lands. The amount and the accept-by date are on the page.",
      ],
      es: [
        "Encontraste la fecha y enviaste la carta. Así se usa un portal.",
        "El miércoles llega la carta de ayuda financiera. El monto y la fecha para aceptar están en la página.",
      ],
    },
  },
  {
    key: "story-appointment-scheduling",
    ...MARIA,
    time: "4:10 PM",
    unread: true,
    story: true,
    unlockAfter: "appointment-scheduling",
    subject: { en: "11:30 is on the book", es: "Las 11:30 ya están" },
    preview: { en: "You offered the open slot.", es: "Ofreciste el hueco libre." },
    body: {
      en: [
        "The 10:00 was taken. You offered 11:30 and sent a confirmation.",
        "Wednesday a new patient checks in. File the form. Do not overshare it.",
      ],
      es: [
        "Las 10:00 estaban ocupadas. Ofreciste las 11:30 y enviaste la confirmación.",
        "El miércoles llega un paciente nuevo. Archiva el formulario. No lo compartas de más.",
      ],
    },
  },
  {
    key: "story-financial-aid",
    ...inboxSender(CAST.hr),
    time: "11:22 AM",
    unread: true,
    story: true,
    unlockAfter: "financial-aid",
    subject: { en: "You read the letter", es: "Leíste la carta" },
    preview: { en: "$2,400. Accept by October 15.", es: "$2,400. Aceptar antes del 15 de octubre." },
    body: {
      en: [
        "The award is $2,400. Accept by October 15. You pulled both numbers off the page.",
        "Thursday, coursework is due. Read the syllabus first.",
      ],
      es: [
        "La ayuda es $2,400. Acepta antes del 15 de octubre. Sacaste los dos números de la página.",
        "El jueves hay que entregar la tarea del curso. Lee el temario primero.",
      ],
    },
  },
  {
    key: "story-patient-intake",
    ...MARIA,
    time: "11:22 AM",
    unread: true,
    story: true,
    unlockAfter: "patient-intake",
    subject: { en: "The form is filed", es: "El formulario está archivado" },
    preview: { en: "You did not hand it to the wrong person.", es: "No se lo diste a la persona equivocada." },
    body: {
      en: [
        "The intake is in. You kept it off a coworker who is not on the care team.",
        "Thursday, the billing sheet has one charge that does not match.",
      ],
      es: [
        "El ingreso está archivado. No se lo diste a un compañero que no está en el equipo de cuidado.",
        "El jueves, la hoja de facturación tiene un cargo que no cuadra.",
      ],
    },
  },
  {
    key: "story-coursework",
    ...MARIA,
    time: "6:40 PM",
    unread: true,
    story: true,
    unlockAfter: "coursework",
    subject: { en: "Submitted before the date", es: "Entregado antes de la fecha" },
    preview: { en: "You read the syllabus first.", es: "Leíste el temario primero." },
    body: {
      en: [
        "You saw the due date was Friday 11:59 PM and still sent it Thursday. That is the whole skill here.",
        "Friday, find one source you would actually cite.",
      ],
      es: [
        "Viste que la fecha de entrega era el viernes a las 11:59 PM y aun así lo enviaste el jueves. Esa es toda la habilidad aquí.",
        "El viernes, encuentra una fuente que de verdad citarías.",
      ],
    },
  },
  {
    key: "story-billing-sheet",
    ...MARIA,
    time: "6:40 PM",
    unread: true,
    story: true,
    unlockAfter: "billing-sheet",
    subject: { en: "93000 was the mismatch", es: "93000 era el que no cuadraba" },
    preview: { en: "You named the row and the right charge.", es: "Nombraste la fila y el cargo correcto." },
    body: {
      en: [
        "The EKG was billed at $185. The list says $85. You told the office both numbers.",
        "Friday the phone will ring. You will not be able to be sure who is calling.",
      ],
      es: [
        "El EKG se cobró a $185. La lista dice $85. Le dijiste a la oficina los dos números.",
        "El viernes va a sonar el teléfono. No vas a poder estar seguro de quién llama.",
      ],
    },
  },
  {
    key: "story-research",
    ...MARIA,
    time: "3:55 PM",
    unread: true,
    story: true,
    unlockAfter: "research",
    subject: { en: "You cited the database", es: "Citaste la base de datos" },
    preview: { en: "You picked the database, not the ad or the forum.", es: "Elegiste la base de datos, no el anuncio ni el foro." },
    body: {
      en: [
        "You picked the library database and said why. The ad and the forum looked easier, but you did not use them.",
        "That path is done. Monday, Dana needs you at HQ.",
      ],
      es: [
        "Elegiste la base de datos de la biblioteca y dijiste por qué. El anuncio y el foro se veían más fáciles, pero no los usaste.",
        "Ese camino ya está terminado. El lunes Dana te necesita en HQ.",
      ],
    },
  },
  {
    key: "story-confidentiality-call",
    ...MARIA,
    time: "3:55 PM",
    unread: true,
    story: true,
    unlockAfter: "confidentiality-call",
    subject: { en: "You did not confirm", es: "No confirmaste" },
    preview: { en: "Polite, and you offered a callback.", es: "Amable, y ofreciste devolver la llamada." },
    body: {
      en: [
        "You did not share the visit. You offered to have the patient call back. That was the right call.",
        "That path is done. Monday, Dana needs you at HQ.",
      ],
      es: [
        "No compartiste la visita. Ofreciste que el paciente devuelva la llamada. Esa fue la decisión correcta.",
        "Ese camino ya está terminado. El lunes Dana te necesita en HQ.",
      ],
    },
  },
  {
    key: "story-office-drive",
    ...MARIA,
    time: "9:18 AM",
    unread: true,
    story: true,
    unlockAfter: "office-drive",
    subject: { en: "You sent Dana the current file", es: "Le enviaste a Dana el archivo actual" },
    preview: { en: "The current file, shared view only.", es: "El archivo actual, compartido en solo ver." },
    body: {
      en: [
        "You found the current Q3 notes and shared them as view only. You left last quarter's file alone.",
        "Wednesday, find a time that works for everyone. Then join the call.",
      ],
      es: [
        "Encontraste las notas actuales del T3 y las compartiste en modo solo ver. Dejaste en paz el archivo del trimestre pasado.",
        "El miércoles, encuentra un horario que sirva para todos. Luego únete a la llamada.",
      ],
    },
  },
  {
    key: "story-multi-person-scheduling",
    ...MARIA,
    time: "10:42 AM",
    unread: true,
    story: true,
    unlockAfter: "multi-person-scheduling",
    subject: { en: "2 PM is the only open slot", es: "Las 2 PM es el único hueco libre" },
    preview: { en: "Everyone is free at that time.", es: "Todos están libres a esa hora." },
    body: {
      en: [
        "You invited the one time that was open on everyone's calendar. That was exactly right.",
        "The meeting is starting. Join with your mic off.",
      ],
      es: [
        "Invitaste a la única hora que estaba libre en el calendario de todos. Eso estuvo perfecto.",
        "La reunión está empezando. Entra con el micrófono apagado.",
      ],
    },
  },
  {
    key: "story-video-call",
    ...MARIA,
    time: "2:20 PM",
    unread: true,
    story: true,
    unlockAfter: "video-call",
    subject: { en: "You asked in chat", es: "Preguntaste en el chat" },
    preview: { en: "Mic off, and you did not talk over anyone.", es: "Micrófono apagado, y no hablaste encima de nadie." },
    body: {
      en: [
        "You joined with your mic off, tried the camera, and asked your question in chat. You did not talk over anyone.",
        "Thursday the expense report is due. One row has no receipt.",
      ],
      es: [
        "Entraste con el micrófono apagado, probaste la cámara y preguntaste en el chat. No hablaste encima de nadie.",
        "El jueves hay que entregar el informe de gastos. Una fila no tiene recibo.",
      ],
    },
  },
  {
    key: "story-expense-report",
    ...MARIA,
    time: "4:08 PM",
    unread: true,
    story: true,
    unlockAfter: "expense-report",
    subject: { en: "You flagged the dinner", es: "Marcaste la cena" },
    preview: { en: "The receipts added up to $188.", es: "Los recibos sumaron $188." },
    body: {
      en: [
        "You matched the four receipts and flagged the team dinner. You did not submit it as-is.",
        "Friday, that $188 goes on the middle slide. Present the slides.",
      ],
      es: [
        "Emparejaste los cuatro recibos y marcaste la cena del equipo. No lo enviaste así como estaba.",
        "El viernes, esos $188 van en la diapositiva del medio. Presenta las diapositivas.",
      ],
    },
  },
  {
    key: "story-slide-deck",
    ...MARIA,
    time: "3:22 PM",
    unread: true,
    story: true,
    unlockAfter: "slide-deck",
    subject: { en: "Three slides, one real number", es: "Tres diapositivas, un número real" },
    preview: { en: "You presented it.", es: "Lo presentaste." },
    body: {
      en: [
        "A title, the $188, and one takeaway. You presented it. That is all HQ needs for now.",
        "There is more to come. Check Studio if you still want to try the other path.",
      ],
      es: [
        "Un título, los $188, y una idea. Lo presentaste. Eso es todo lo que HQ necesita por ahora.",
        "Viene más. Revisa Studio si todavía quieres probar el otro camino.",
      ],
    },
  },

  // ---- Act VII: Team Lead ----

  {
    key: "story-meeting-minutes",
    ...MARIA,
    time: "11:30 AM",
    unread: true,
    story: true,
    unlockAfter: "meeting-minutes",
    subject: { en: "Good first meeting", es: "Buena primera reunión" },
    preview: { en: "The follow-up said who owes what by when.", es: "El seguimiento dijo quién hace qué y para cuándo." },
    body: {
      en: [
        "The agenda kept it short, and the follow-up said who owes what by when. That is the part people usually skip.",
        "The team knows what to do now.",
        "Tuesday there is a review to write for one of them.",
      ],
      es: [
        "La agenda la mantuvo corta, y el seguimiento dijo quién hace qué y para cuándo. Esa es la parte que la gente suele saltarse.",
        "El equipo ya sabe qué hacer.",
        "El martes hay una evaluación que escribir para uno de ellos.",
      ],
    },
  },
  {
    key: "story-performance-review",
    ...MARIA,
    time: "3:05 PM",
    unread: true,
    story: true,
    unlockAfter: "performance-review",
    subject: { en: "That was fair", es: "Fue justa" },
    preview: { en: "Specific, and not harsh.", es: "Concreta, y no dura." },
    body: {
      en: [
        "You named something real they did well, and something real to work on. Both specific, neither harsh.",
        "That is a review someone can actually use.",
        "Thursday, the full weekly report is yours — every app, one packet.",
      ],
      es: [
        "Nombraste algo real que hicieron bien, y algo real para trabajar. Las dos cosas concretas, ninguna dura.",
        "Esa es una evaluación que de verdad se puede usar.",
        "El jueves, el reporte semanal completo es tuyo — todas las apps, un solo paquete.",
      ],
    },
  },
  {
    key: "story-ops-report-packet",
    ...MARIA,
    time: "4:20 PM",
    unread: true,
    story: true,
    unlockAfter: "ops-report-packet",
    subject: { en: "Got the packet", es: "Recibí el paquete" },
    preview: { en: "One email, not three loose attachments.", es: "Un correo, no tres adjuntos sueltos." },
    body: {
      en: [
        "The number, the calendar note, and the summary all came together, in one email. Not three loose attachments.",
        "That is the whole weekly report, start to finish, on your own.",
        "One last thing before you go — look back at where you started.",
      ],
      es: [
        "El número, la nota del calendario y el resumen llegaron juntos, en un solo correo. No tres adjuntos sueltos.",
        "Ese es el reporte semanal completo, de principio a fin, tú solo.",
        "Una última cosa antes de irte — mira atrás, a dónde empezaste.",
      ],
    },
  },
  {
    key: "story-portfolio-reflection",
    ...MARIA,
    time: "Fri",
    unread: true,
    story: true,
    unlockAfter: "portfolio-reflection",
    subject: { en: "From day one to here", es: "Del primer día hasta aquí" },
    preview: { en: "Look how much you can do now.", es: "Mira todo lo que ya puedes hacer." },
    body: {
      en: [
        "I still have your first email — the one where you thanked me for the welcome. Look how much you can do now.",
        "This summary is yours. Show it to whoever you want.",
        "Whatever is next for you, you are ready for it.",
      ],
      es: [
        "Todavía tengo tu primer correo — ese donde me agradeciste la bienvenida. Mira todo lo que ya puedes hacer.",
        "Este resumen es tuyo. Muéstraselo a quien quieras.",
        "Lo que siga para ti, estás lista para eso.",
      ],
    },
  },
];

export function storyMailAfter(taskKey: TaskKey): InboxRow | undefined {
  return STORY_MAILS.find((m) => m.unlockAfter === taskKey);
}

const CLOSING: Record<Lang, string> = { en: "Thanks,", es: "Gracias," };

/**
 * A story email as the learner reads it: greeted by name at the top, closed at
 * the bottom. The middle lines are the beat itself and stay verbatim. Modeling
 * the full greeting-body-closing shape is the point — a learner who only ever
 * sees bare paragraphs never learns what a work email looks like.
 *
 * The typed name after the closing is left off for anyone who has a signature
 * block, since that block already names them; a sender without one still types
 * their first name, the way a quick note from a coworker actually arrives.
 */
export function storyBodyFor(row: InboxRow, lang: Lang, displayName: string): string[] {
  if (!row.body) return [];
  const signed = signatureFor(row.from) ? [] : [firstName(row.from)];
  return [mailGreeting(lang, displayName), ...row.body[lang], CLOSING[lang], ...signed];
}

export function noteIsFromMaria(taskKey: TaskKey): boolean {
  return storyMailAfter(taskKey)?.from === MARIA.from;
}

const WEEKDAYS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
const MONTHS: Record<string, number> = {
  jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
  jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11,
};

/** Higher = newer. Clock times count as today; dated labels sit further back. */
export function inboxTimeRank(time: string): number {
  const t = time.trim();
  const clock = t.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (clock) {
    let hours = Number(clock[1]);
    const minutes = Number(clock[2]);
    const ap = clock[3].toUpperCase();
    if (ap === "PM" && hours !== 12) hours += 12;
    if (ap === "AM" && hours === 12) hours = 0;
    return 4_000_000 + hours * 60 + minutes;
  }
  if (/^yesterday$/i.test(t)) return 3_000_000;
  const weekday = WEEKDAYS.indexOf(t.toLowerCase());
  if (weekday >= 0) return 2_000_000 + weekday;
  const dated = t.match(/^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+(\d{1,2})$/i);
  if (dated) {
    const month = MONTHS[dated[1].slice(0, 3).toLowerCase()] ?? 0;
    return 1_000_000 + month * 32 + Number(dated[2]);
  }
  return 0;
}

export function sortInboxByTime<T extends { time: string }>(rows: T[]): T[] {
  return rows
    .map((row, index) => ({ row, index }))
    .sort((a, b) => {
      const diff = inboxTimeRank(b.row.time) - inboxTimeRank(a.row.time);
      return diff !== 0 ? diff : a.index - b.index;
    })
    .map(({ row }) => row);
}

/** Newest completed beat first, so the inbox feels like time is moving. */
export function storyMailsFor(completedTaskKeys: TaskKey[], flags: StoryFlags): InboxRow[] {
  const unlocked = STORY_MAILS.filter((m) => completedTaskKeys.includes(m.unlockAfter));
  unlocked.sort(
    (a, b) => completedTaskKeys.indexOf(b.unlockAfter) - completedTaskKeys.indexOf(a.unlockAfter),
  );
  return unlocked.map((mail) => {
    if (mail.key !== "story-calendar") return mail;
    const reply = huddleReply(flags);
    return { ...mail, ...reply };
  });
}

/** Every task in the order the game hands them out. */
const CURRICULUM_ORDER: TaskKey[] = LEVELS.flatMap((l) => taskKeysForLevel(l, null));

/**
 * The inbox as it looked at a moment in the story. While a mail task is
 * being done — including a REPLAY of an early level — only story mails
 * unlocked by tasks that come BEFORE it in the curriculum appear. Without
 * this, a learner replaying Day One faces a dozen future Maria emails and
 * "find Maria's email" stops making sense. Pass null when no mail task is
 * active (just browsing) to get everything unlocked so far.
 */
export function storyMailsUpTo(
  activeTaskKey: TaskKey | null,
  completedTaskKeys: TaskKey[],
  flags: StoryFlags,
): InboxRow[] {
  const unlocked = storyMailsFor(completedTaskKeys, flags);
  if (!activeTaskKey) return unlocked;
  const cutoff = CURRICULUM_ORDER.indexOf(activeTaskKey);
  if (cutoff === -1) return unlocked;
  return unlocked.filter((m) => {
    const i = CURRICULUM_ORDER.indexOf(m.unlockAfter);
    return i !== -1 && i < cutoff;
  });
}

export function storyFlagKeysForTasks(taskKeys: Iterable<TaskKey>): string[] {
  const keys: string[] = [];
  for (const task of taskKeys) {
    if (task === "calendar") keys.push(HUDDLE_TIME_FLAG);
    if (task === "timeclock") keys.push(TIMECLOCK_MAIL_FLAG);
  }
  return keys;
}
