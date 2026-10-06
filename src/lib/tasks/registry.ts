import type { AppKey, TaskKey } from "@/lib/desktop-content";
import type { Localized } from "@/lib/task-types";
import type { LessonMeta } from "@/lib/lessons/types";
import { LESSON_EMAIL, LESSON_PASSWORD, RECOVERY_COPY } from "@/lib/tasks/account-recovery/content";
import { REAL_DOMAIN, RIGHT_NOW_STEPS as PHISHING_STEPS } from "@/lib/tasks/phishing-check/content";
import { JOB_SEEKER } from "@/lib/tasks/job-application/content";
import { FILES_WEEK, RENAME_TARGET } from "@/lib/tasks/files/content";
import {
  HUDDLE_DAY,
  SHIFT_TIMES,
  STORY_DAY_BY_LEVEL,
  cardDate,
  hourOnly,
  longDate,
  monthDate,
  shortDate,
  storyDate,
} from "@/lib/story-dates";

/** "7": the sick-day shift, as the Day 2 schedule showed it. */
const SICK_DAY_START = hourOnly(SHIFT_TIMES[STORY_DAY_BY_LEVEL.level3a2]);

/**
 * The task registry — one entry per task, one place to edit.
 *
 * Every per-task fact a screen needs (its label, the story beat it lands on,
 * the bookmark it opens, the "do this next" button copy, the named skill on
 * its badge) lives here. The older lookup tables — `TASK_INFO`,
 * `TASK_LOCATIONS`, `SKILLS`, `BOOKMARK_LABEL`, `HANDOFF_CTA`, `SHIFT_MOMENT`,
 * `JOB_CARD_LINE` — are now thin views derived from this record, so adding a
 * task means adding one `TASKS` entry, not touching six files that
 * `content-integrity.test.ts` then scolds you for missing.
 *
 * Keep this file data-only: no React, no imports from `tracks-content` (which
 * imports *this*). Types shared with the level spine (`TaskLocation`,
 * `PortalSection`) live here and are re-exported from `tracks-content`.
 */

/** Employee Portal sub-page. Schedule, Time Clock, and Pay Stubs share one Browser tab. */
export type PortalSection = "schedule" | "timeclock" | "paystubs" | "swap-request" | "shift-review";

export type TaskLocation = {
  appKey: AppKey;
  tab?: string;
  section?: PortalSection;
  ctaLabel: string;
};

export interface TaskDescriptor {
  key: TaskKey;
  /** False for tasks the app doesn't grade yet — shown as "not built yet," not "locked." */
  built: boolean;
  /**
   * True for keys kept only so a learner's historical DB row stays a valid
   * completion. No Level or Track routes here; the reachable-task checks in
   * `content-integrity.test.ts` skip them (they come from `TRACKS`).
   */
  retired?: boolean;
  /** Task name shown in menus, the desktop task list, and the Job Card header. */
  label: Localized;
  /** One-line dispatch for the desktop briefing — what just happened, not a tutorial. */
  dispatch: Localized;
  /**
   * The named skill shown on this task's own done-screen badge (see
   * `firstPersonSkill`). The Spanish half is an infinitive phrase so both
   * languages can be framed the same way ("I can …" / "Puedo …").
   */
  skill: Localized<string>;
  /** Bookmark-bar label for this task's home — matches BrowserClient's tab definitions. */
  bookmarkLabel: string;
  /**
   * Done-screen "Next" button copy, keyed by the task it opens. Act I names
   * the place; Act II+ names the bookmark, since finding it on the bar stays
   * the exercise.
   */
  handoffCta: Localized;
  /**
   * One line of clock time for the desktop briefing — the story, not the
   * skill. Time only ever moves forward: read top to bottom these are the
   * days of the learner's employment in order. `story-coherence.test.ts`
   * enforces the weekday ordering.
   */
  shiftMoment: Localized;
  /**
   * Where the task actually lives, so the desktop's "do this next" card can
   * open the right thing. Omit for a task that isn't built yet — the card
   * shows a "coming soon" state instead of a button. From Act II on the
   * `tab` is dropped so the Browser opens on a New Tab and finding the
   * bookmark stays the exercise.
   */
  location?: TaskLocation;
  /** Short Job Card instruction line (under six words). Falls back to `dispatch`. */
  jobCardLine?: Localized;
  /**
   * The Job Card's green finish line, only when it adds something the header kicker
   * (the task's own "Offer accepted" style line) does not already say.
   * Without it the card says how much of the day is left.
   */
  jobCardDoneLine?: Localized;
  /** Makes this task a standalone classroom lesson at `/lessons/<key>`. */
  lesson?: LessonMeta;
  /**
   * A deliberate reading pause after this task: once it completes, the Job
   * Card offers "Read reply" (opens here), then "Continue" — and holds the
   * next-job handoff and any celebration until Continue is pressed. See
   * `src/lib/read-pause.ts`. Story only; lessons skip this entirely.
   */
  readPause?: { appKey: AppKey; tab?: string; section?: PortalSection };
}

/**
 * What a job-search lesson learner has done, so "your experience" means
 * something on screen. The job-posting answer key (`REQUIREMENTS[].met`)
 * matches these lines one for one.
 */
const JOB_SEEKER_FACTS: LessonMeta["reference"] = [
  { label: { en: "Past jobs", es: "Empleos" }, value: { en: "Team Member, then Shift Lead", es: "Miembro del equipo, luego líder" } },
  { label: { en: "Talked with", es: "Habló con" }, value: { en: "Coworkers and managers", es: "Compañeros y gerentes" } },
  { label: { en: "Schedules", es: "Horarios" }, value: { en: "Fixed a schedule problem", es: "Arregló un problema del horario" } },
  { label: { en: "Computer", es: "Computadora" }, value: { en: "Email, calendars, spreadsheets", es: "Correo, calendarios, hojas de cálculo" } },
  { label: { en: "Numbers", es: "Números" }, value: { en: "Sent a spreadsheet total", es: "Envió el total de una hoja" } },
  { label: { en: "School", es: "Estudios" }, value: { en: "High school. No college degree.", es: "Secundaria. Sin título universitario." } },
];

/** What the application asks Sam to type: copied from the card, checked forgivingly. */
const APPLICATION_FACTS: LessonMeta["reference"] = [
  { label: { en: "Name", es: "Nombre" }, value: JOB_SEEKER.name },
  { label: { en: "Phone", es: "Teléfono" }, value: JOB_SEEKER.phone },
  { label: { en: "Email", es: "Correo" }, value: JOB_SEEKER.email },
  { label: { en: "Can start", es: "Puede empezar" }, value: { en: JOB_SEEKER.start, es: `${JOB_SEEKER.start} (${JOB_SEEKER.startSpoken.es})` } },
  { label: { en: "Wants", es: "Quiere" }, value: { en: "40 hours a week", es: "40 horas por semana" } },
];

/** The résumé's heading and school come from Sam; the jobs are on the page. */
const RESUME_FACTS: LessonMeta["reference"] = [
  { label: { en: "Name", es: "Nombre" }, value: JOB_SEEKER.name },
  { label: { en: "Past jobs", es: "Empleos" }, value: { en: "Team Member, then Shift Lead", es: "Miembro del equipo, luego líder" } },
  { label: { en: "Computer", es: "Computadora" }, value: { en: "Email, calendars, spreadsheets", es: "Correo, calendarios, hojas de cálculo" } },
  { label: { en: "School", es: "Estudios" }, value: JOB_SEEKER.school },
];

const browser = (ctaLabel: string, tab?: string, section?: PortalSection): TaskLocation => ({
  appKey: "browser",
  ...(tab ? { tab } : {}),
  ...(section ? { section } : {}),
  ctaLabel,
});

/** Where a reading pause's "Read reply" button sends the learner — Mail,
 *  where every one of these tasks' replies actually lands. */
const readMail = (): TaskDescriptor["readPause"] => ({ appKey: "browser", tab: "mail" });

export const TASKS: Record<TaskKey, TaskDescriptor> = {
  tour: {
    key: "tour",
    built: true,
    label: { en: "Learn how this computer works", es: "Aprende cómo funciona esta computadora" },
    dispatch: {
      en: "This is a practice computer. Let's see how it works.",
      es: "Esta es una computadora de práctica. Veamos cómo funciona.",
    },
    skill: { en: "Find Help, your shift list, and Next", es: "encontrar la Ayuda, mi lista de tareas y el botón Siguiente" },
    bookmarkLabel: "Welcome",
    handoffCta: { en: "Start looking around", es: "Empezar a mirar" },
    shiftMoment: { en: "Before the shift. Take a minute.", es: "Antes del turno. Tómate un minuto." },
    location: browser("Start looking around", "tour"),
    jobCardLine: { en: "Open the practice computer. Follow the instructions on this card.", es: "Abre la computadora de práctica. Sigue las instrucciones de esta tarjeta." },
  },

  // Retired: the old bundled Day-One task (find + reply + attach in one job).
  // Day One now asks for the three granular jobs below instead.
  mail: {
    key: "mail",
    built: true,
    retired: true,
    label: { en: "Answer your supervisor", es: "Contesta a tu supervisora" },
    dispatch: {
      en: "Maria already needs something. First shift, first email.",
      es: "Maria ya necesita algo. Primer turno, primer correo.",
    },
    skill: { en: "Reply with an attachment", es: "responder con un archivo adjunto" },
    bookmarkLabel: "Mail",
    handoffCta: { en: "Open Mail", es: "Abrir Correo" },
    shiftMoment: { en: "Tuesday, 8:14 AM. First shift.", es: "Martes, 8:14 AM. Primer turno." },
    location: browser("Open Mail", "mail"),
  },

  // Retired: split into mail-reply / mail-attach.
  "mail-read": {
    key: "mail-read",
    built: true,
    retired: true,
    label: { en: "Read your supervisor's email", es: "Lee el correo de tu supervisora" },
    dispatch: {
      en: "Maria already needs something. Find it and read it.",
      es: "Maria ya necesita algo. Encuéntralo y léelo.",
    },
    skill: { en: "Find and read a message from a manager", es: "encontrar y leer un mensaje de mi gerente" },
    bookmarkLabel: "Mail",
    handoffCta: { en: "Open Mail", es: "Abrir Correo" },
    shiftMoment: { en: "Tuesday, 8:14 AM. First shift.", es: "Martes, 8:14 AM. Primer turno." },
    location: browser("Open Mail", "mail"),
  },

  "mail-reply": {
    key: "mail-reply",
    built: true,
    label: { en: "Reply to three messages", es: "Responde a tres mensajes" },
    dispatch: {
      en: "Maria says welcome. Write her a short thank-you.",
      es: "Maria te da la bienvenida. Escríbele un agradecimiento corto.",
    },
    skill: { en: "Read and reply to short work emails", es: "leer y responder correos cortos de trabajo" },
    bookmarkLabel: "Mail",
    handoffCta: { en: "Open Mail", es: "Abrir Correo" },
    shiftMoment: {
      en: "Monday, 6:02 PM. Maria says welcome.",
      es: "Lunes, 6:02 PM. Maria te da la bienvenida.",
    },
    location: browser("Open Mail", "mail"),
    // The inbox shows one new email at a time, so the card never promises three at once.
    jobCardLine: { en: "Read the new email. Write a short reply. Then click Send.", es: "Lee el correo nuevo. Escribe una respuesta corta. Después haz clic en Enviar." },
    jobCardDoneLine: { en: "You replied to your new manager and coworker.", es: "Le respondiste a tu nueva gerente y a tu compañero." },
    lesson: {
      title: { en: "Reply to short work emails", es: "Responder correos cortos del trabajo" },
      summary: {
        en: "Read three short emails from a manager and a coworker, and write a reply to each one.",
        es: "Lee tres correos cortos de una gerente y un compañero, y responde a cada uno.",
      },
      skills: ["email"],
      minutes: 15,
      scene: {
        you: { en: "You got a new job at Harborside Cafe, a small cafe. Tomorrow is your first day.", es: "Conseguiste un trabajo nuevo en Harborside Cafe, un café pequeño. Mañana es tu primer día." },
        people: [
          {
            name: "Maria Delgado",
            role: { en: "Your manager", es: "Tu gerente" },
            who: { en: "She runs the cafe. She hired you, and she sends you work emails.", es: "Ella dirige el café. Te contrató y te manda correos del trabajo." },
          },
          {
            name: "Darnell Washington",
            role: { en: "Your coworker", es: "Tu compañero de trabajo" },
            who: { en: "He works the morning shift with you.", es: "Trabaja contigo en el turno de la mañana." },
          },
        ],
        need: {
          en: "3 short emails will come, one at a time: 2 from Maria and 1 from Darnell. Write a short answer to each one.",
          es: "Van a llegar 3 correos cortos, uno a la vez: 2 de Maria y 1 de Darnell. Escribe una respuesta corta a cada uno.",
        },
      },
      takeaway: {
        en: "Reply keeps your answer with the original email so the other person can follow the conversation. Say hello, answer the question, and sign your name.",
        es: "Responder mantiene tu respuesta junto al correo original para que la otra persona pueda seguir la conversación. Saluda, contesta la pregunta y firma con tu nombre.",
      },
      guide: {
        skills: [
          { en: "Open the right email in a full inbox", es: "Abrir el correo correcto en una bandeja llena" },
          { en: "Click Reply and write a short message", es: "Hacer clic en Responder y escribir un mensaje corto" },
          { en: "Start with a greeting and end with your name", es: "Empezar con un saludo y terminar con tu nombre" },
          { en: "Answer the question the email asks", es: "Contestar la pregunta que hace el correo" },
        ],
        prepare: [
          { en: "Ask who has an email account and who uses it every week.", es: "Pregunta quién tiene una cuenta de correo y quién la usa cada semana." },
          { en: "Write the parts of a reply on the board: hello, your message, your name.", es: "Escribe en la pizarra las partes de una respuesta: saludo, tu mensaje, tu nombre." },
        ],
        stickingPoints: [
          { en: "The inbox also has two older emails from IT and HR. Opening them is fine and nothing is marked wrong. Ask: who sent this email? What is the subject?", es: "La bandeja también tiene dos correos anteriores de sistemas y RR.HH. Abrirlos está bien y no se marca nada como error. Pregunta: ¿quién envió este correo? ¿Cuál es el asunto?" },
          { en: "Maria's emails carry real first-day details (the address, what to wear, what to bring). The reply only needs to answer the question.", es: "Los correos de Maria traen detalles reales del primer día (la dirección, qué ponerse, qué traer). La respuesta solo necesita contestar la pregunta." },
          { en: "The second email asks them to confirm 10 AM. Any honest yes passes (\"I can come\", \"Of course\", \"Sounds good\", \"No problem\"). A reply that says they can't come, will be late, or names another time gets a correction that says which. Ask: what does Maria want to know?", es: "El segundo correo pide confirmar las 10 a. m. Cualquier sí pasa (\"Puedo ir\", \"Claro\", \"No te preocupes\", \"Sin problema\"). Si la respuesta dice que no pueden, que van a llegar tarde o da otra hora, la corrección dice cuál es el problema. Pregunta: ¿qué quiere saber Maria?" },
          { en: "The third email is from Darnell. The reply must say the bag goes on the shelf or under the counter. Ask: where will you put your bag?", es: "El tercer correo es de Darnell. La respuesta debe decir que la bolsa va en el estante o debajo del mostrador. Pregunta: ¿dónde vas a dejar tu bolsa?" },
          { en: "\"Need help writing?\" offers a sentence with a blank (___) to fill in, not the answer. In On my own mode it appears only after a send is refused.", es: "\"¿Necesitas ayuda para escribir?\" ofrece una frase con un espacio (___) para completar, no la respuesta. En el modo Por mi cuenta aparece solo después de un envío rechazado." },
        ],
        followUp: [
          { en: "Who sends you emails or texts that need an answer? How fast do you answer?", es: "¿Quién te envía correos o mensajes que necesitan respuesta? ¿Qué tan rápido contestas?" },
          { en: "How do you tell your boss that you will be at work on time?", es: "¿Cómo le dices a tu jefe que vas a llegar al trabajo a tiempo?" },
        ],
        peerHelp: {
          en: "A partner can read the email out loud, but the learner writes and sends the reply.",
          es: "Un compañero puede leer el correo en voz alta, pero el estudiante escribe y envía la respuesta.",
        },
        atWork: [
          { setting: { en: "a hotel", es: "un hotel" }, example: { en: "Confirm your first shift and what uniform to wear.", es: "Confirmar tu primer turno y qué uniforme ponerte." } },
          { setting: { en: "a warehouse", es: "un almacén" }, example: { en: "Answer the staffing agency: yes, you can start Monday at 6 AM.", es: "Contestarle a la agencia: sí, puedes empezar el lunes a las 6 AM." } },
          { setting: { en: "a store", es: "una tienda" }, example: { en: "Tell a coworker you got the locker code.", es: "Decirle a un compañero que recibiste el código del casillero." } },
          { setting: { en: "home health care", es: "el cuidado de salud en casa" }, example: { en: "Confirm tomorrow's client visit time.", es: "Confirmar la hora de la visita de mañana con el cliente." } },
        ],
      },
    },
  },

  "mail-attach": {
    key: "mail-attach",
    built: true,
    label: { en: "Send your food handler certificate", es: "Envía tu certificado de manipulador de alimentos" },
    dispatch: {
      en: "Maria needs your food handler certificate. Read what she asks, then attach it.",
      es: "Maria necesita tu certificado de manipulador de alimentos. Lee qué pide y adjúntalo.",
    },
    skill: { en: "Send a reply with a file attached", es: "responder con un archivo adjunto" },
    bookmarkLabel: "Mail",
    handoffCta: { en: "Next: Send your certificate", es: "Siguiente: Envía tu certificado" },
    shiftMoment: { en: "Wednesday, 10:10 AM. She needs a file.", es: "Miércoles, 10:10 AM. Necesita un archivo." },
    location: browser("Open Mail", "mail"),
    jobCardLine: { en: "Read Maria’s email. Reply with the file she requests attached. Then click Send.", es: "Lee el correo de Maria. Responde con el archivo que pide como adjunto. Después haz clic en Enviar." },
    readPause: readMail(),
    lesson: {
      title: { en: "Attach a file to an email", es: "Adjuntar un archivo a un correo" },
      summary: {
        en: "Send an attachment, replace an outdated file, and ask for an approved copy when only a draft is available.",
        es: "Envía un adjunto, reemplaza un archivo viejo y pide una copia aprobada cuando solo hay un borrador.",
      },
      skills: ["email", "files"],
      minutes: 20,
      scene: {
        you: { en: "You are a new team member at Harborside Cafe. You started this week.", es: "Eres parte del equipo nuevo de Harborside Cafe. Empezaste esta semana." },
        people: [
          {
            name: "Maria Delgado",
            role: { en: "Your manager", es: "Tu gerente" },
            who: { en: "She runs the cafe and hired you. She sends you work emails.", es: "Ella dirige el café y te contrató. Te manda correos del trabajo." },
          },
        ],
        need: {
          en: "You just started at the cafe. Maria sent you an email. She needs your food handler certificate from your Downloads folder. There are several similar files there. Read her email to find out which one, then send it to her.",
          es: "Empezaste a trabajar en el café hace poco. Maria te envió un correo. Necesita tu certificado de manipulador de alimentos de tu carpeta Descargas. Ahí hay varios archivos parecidos. Lee su correo para saber cuál, y luego envíaselo.",
        },
      },
      takeaway: { en: "An attachment sends a file with your email; writing its name does not send it. Check the actual attachment before sending. If the required file is missing, ask for it.", es: "Un adjunto envía un archivo con tu correo; escribir su nombre no lo envía. Revisa el adjunto real antes de enviar. Si falta el archivo solicitado, pídelo." },
      guide: {
        skills: [
          { en: "Read an email to find what someone needs and when", es: "Leer un correo para saber qué necesita alguien y para cuándo" },
          { en: "Choose the right file from Downloads", es: "Elegir el archivo correcto en Descargas" },
          { en: "Attach a file to a reply", es: "Adjuntar un archivo a una respuesta" },
          { en: "Check that the file is attached before you send", es: "Revisar que el archivo esté adjunto antes de enviar" },
        ],
        prepare: [
          { en: "The computer lesson now includes the original task and two new situations. Completion requires all three. Follow-ups check source-based choices and a reviewed response; they do not assess independent free writing. Estimated time includes reading and retries.", es: "La lección incluye la tarea original y dos situaciones nuevas. Para terminar se requieren las tres. Las nuevas situaciones revisan elecciones basadas en documentos y una respuesta revisada; no evalúan escritura libre independiente. El tiempo estimado incluye lectura y reintentos." },
          { en: "Ask who has sent a photo or a document by email or text.", es: "Pregunta quién ya envió una foto o un documento por correo o por mensaje." },
          { en: "Explain that an attachment is a file that goes with the email.", es: "Explica que un archivo adjunto es un archivo que va con el correo." },
        ],
        stickingPoints: [
          { en: "The inbox has other real emails (a milk delivery, IT, HR). Opening them is fine and nothing is marked wrong. Ask: which email is about your certificate?", es: "La bandeja tiene otros correos reales (una entrega de leche, sistemas, RR.HH.). Abrirlos está bien y no se marca nada como error. Pregunta: ¿cuál correo habla de tu certificado?" },
          { en: "After Reply, a question asks what Maria needs. Her email tells the answers apart: the certificate, not the practice test, and today by 3 PM, not next week. Show me lights up her email, not the answer.", es: "Después de Responder, una pregunta dice qué necesita Maria. Su correo distingue las respuestas: el certificado, no el examen de práctica, y hoy antes de las 3 PM, no la próxima semana. Muéstrame ilumina su correo, no la respuesta." },
          { en: "The picker shows each file's first page. Some learners attach the practice test or the certificate from 2022 (double-clicking a file attaches it too). Ask: what does the title say? When does it expire?", es: "La ventana muestra la primera página de cada archivo. Algunos adjuntan el examen de práctica o el certificado de 2022 (hacer doble clic en un archivo también lo adjunta). Pregunta: ¿qué dice el título? ¿Cuándo vence?" },
          { en: "The certificate is in English, like most US workplace files. Spanish readers look for Certificate = certificado, Practice Test = examen de práctica, and Expires = vence.", es: "El certificado está en inglés, como la mayoría de los archivos de trabajo en EE. UU. Quienes leen en español buscan Certificate = certificado, Practice Test = examen de práctica y Expires = vence." },
          { en: "Some learners write a message and click Send with no file. Ask: do you see the file name in the green box?", es: "Algunos escriben el mensaje y hacen clic en Enviar sin el archivo. Pregunta: ¿ves el nombre del archivo en la caja verde?" },
        ],
        followUp: [
          { en: "When do you need to send a file in real life? A pay stub, an ID, a school form.", es: "¿Cuándo necesitas enviar un archivo en la vida real? Un recibo de pago, una identificación, un formulario de la escuela." },
          { en: "How can you check that a file is really attached before you send?", es: "¿Cómo puedes revisar que un archivo está adjunto antes de enviar?" },
        ],
        peerHelp: {
          en: "A partner can help read the file names, but the learner chooses the file and clicks Send.",
          es: "Un compañero puede ayudar a leer los nombres de los archivos, pero el estudiante elige el archivo y hace clic en Enviar.",
        },
        atWork: [
          { setting: { en: "a warehouse", es: "un almacén" }, example: { en: "Email the supervisor a photo of a damaged box.", es: "Enviarle al supervisor una foto de una caja dañada." } },
          { setting: { en: "a hotel", es: "un hotel" }, example: { en: "Send the finished room checklist, not last week's.", es: "Enviar la lista de cuartos terminada, no la de la semana pasada." } },
          { setting: { en: "home health care", es: "el cuidado de salud en casa" }, example: { en: "Attach the signed visit note for the right date.", es: "Adjuntar la nota de visita firmada de la fecha correcta." } },
          { setting: { en: "a school", es: "una escuela" }, example: { en: "Send your child's signed form back to the teacher.", es: "Devolverle a la maestra el formulario firmado de tu hijo." } },
        ],
      },
    },
  },

  schedule: {
    lesson: {
      title: { en: "Read a schedule and find a conflict", es: "Leer un horario y encontrar un conflicto" },
      summary: { en: "Compare a schedule with a personal appointment and request a workable change.", es: "Comparar un horario con una cita y solicitar un cambio posible." },
      skills: ["scheduling", "workplace-systems"], minutes: 15,
      scene: {
        you: { en: "You are a team member at Harborside Cafe. Your manager posts the work schedule each week.", es: "Eres parte del equipo de Harborside Cafe. Tu gerente publica el horario de trabajo cada semana." },
        people: [
          {
            name: "Maria Delgado",
            role: { en: "Your manager", es: "Tu gerente" },
            who: { en: "She runs the cafe and makes the schedule. You ask her when you need a different shift.", es: "Ella dirige el café y hace el horario. Le pides a ella cuando necesitas otro turno." },
          },
        ],
        need: { en: "One of your shifts is at the same time as a personal appointment. You need a shift you can work.", es: "Uno de tus turnos es a la misma hora que una cita personal. Necesitas un turno que sí puedas trabajar." },
      },
      takeaway: { en: "You practiced comparing the day and time before asking for a change.", es: "Practicaste comparar el día y la hora antes de pedir un cambio." },
      guide: {
        skills: [{ en: "Compare dates and time ranges in two sources.", es: "Comparar fechas y horas en dos fuentes." }],
        prepare: [{ en: "Use the optional pointer practice if needed. Choose support by computer experience, not English level.", es: "Use la práctica opcional del puntero si hace falta. Elija apoyo según la experiencia digital, no el nivel de inglés." }],
        stickingPoints: [{ en: "An overlapping shift can begin before an appointment. Compare the whole time range.", es: "Un turno que coincide puede empezar antes de la cita. Compare todo el intervalo." }],
        followUp: [{ en: "Try a different schedule and ask which source supports the change.", es: "Pruebe otro horario y pregunte qué fuente respalda el cambio." }],
        peerHelp: { en: "Ask your partner what they checked; let them control their own computer.", es: "Pregunte qué revisó su compañero; deje que controle su computadora." },
      },
    },
    jobCardLine: { en: "Compare your work schedule with your phone calendar. Select the shift at the same time as a personal appointment. Request a shift you can work instead.", es: "Compara tu horario de trabajo con el calendario de tu teléfono. Selecciona el turno a la misma hora que una cita personal. Solicita otro turno que puedas trabajar." },
    key: "schedule",
    built: true,
    label: { en: "Ask for a shift swap", es: "Pide un cambio de turno" },
    dispatch: {
      en: "Your schedule is posted. Check it against the calendar on your phone.",
      es: "Tu horario ya está publicado. Compáralo con el calendario de tu teléfono.",
    },
    skill: { en: "Find a shift conflict and ask for a swap", es: "encontrar un choque de horario y pedir un cambio" },
    bookmarkLabel: "Portal",
    handoffCta: { en: "Next: Open Portal", es: "Siguiente: Abrir Portal" },
    shiftMoment: {
      en: "Wednesday morning. Next week is posted.",
      es: "Miércoles por la mañana. Ya está la próxima semana.",
    },
    location: browser("Open Portal", "portal", "schedule"),
    readPause: readMail(),
  },

  // Retired: folded into `schedule` — finding the clash and asking for the
  // swap are one task now.
  "swap-request": {
    key: "swap-request",
    built: true,
    retired: true,
    label: { en: "Ask for a shift swap", es: "Pide un cambio de turno" },
    dispatch: {
      en: "Two shifts overlap. Somebody has to swap.",
      es: "Dos turnos chocan. Alguien tiene que cambiar.",
    },
    skill: { en: "Ask for a shift swap in writing", es: "pedir un cambio de turno por escrito" },
    bookmarkLabel: "Portal",
    handoffCta: { en: "Next: Ask for a swap", es: "Siguiente: Pide un cambio" },
    shiftMoment: {
      en: "Wednesday, 9:30 AM. Two shifts overlap.",
      es: "Miércoles, 9:30 AM. Dos turnos se cruzan.",
    },
    location: browser("Open Portal", "portal", "swap-request"),
  },

  timeclock: {
    jobCardLine: { en: "Clock in. Compare the recorded time with your arrival time of 7 AM. Email Maria both times.", es: "Marca tu entrada. Compara la hora registrada con tu hora de llegada, las 7 AM. Envía a Maria un correo con ambas horas." },
    key: "timeclock",
    built: true,
    label: { en: "Clock in for the day", es: "Marca tu entrada del día" },
    dispatch: {
      en: "You got here at 7. Clock in, then check the time.",
      es: "Llegaste a las 7. Marca tu entrada y revisa la hora.",
    },
    skill: { en: "Check my hours and speak up", es: "revisar mis horas y avisar cuando algo está mal" },
    bookmarkLabel: "Portal",
    handoffCta: { en: "Next: Clock in", es: "Siguiente: Marcar entrada" },
    shiftMoment: { en: "Friday, 8:15 AM.", es: "Viernes, 8:15 AM." },
    location: browser("Open Portal", "portal", "timeclock"),
    readPause: readMail(),
  },

  paystub: {
    key: "paystub",
    built: true,
    label: { en: "Read a pay stub", es: "Lee un talón de pago" },
    dispatch: {
      en: "Your first stub is here. Open it and check the numbers.",
      es: "Ya está tu primer recibo. Ábrelo y revisa los números.",
    },
    skill: { en: "Read a pay stub", es: "leer un talón de pago" },
    bookmarkLabel: "Portal",
    handoffCta: { en: "Next: Check my pay stub", es: "Siguiente: Revisar mi recibo" },
    shiftMoment: {
      en: "Friday, 5:40 PM. Your first payday.",
      es: "Viernes, 5:40 PM. Tu primer día de pago.",
    },
    location: browser("Open Portal", "portal", "paystubs"),
    jobCardLine: { en: "Read your pay stub and time record. Select the net pay and paid hours that match.", es: "Lee tu recibo de pago y tu registro de horas. Selecciona el pago neto (Net pay) y las horas pagadas (Regular hours) que coinciden." },
    readPause: readMail(),
  },

  "shift-review": {
    key: "shift-review",
    built: true,
    label: { en: "End-of-shift note", es: "Nota de fin de turno" },
    dispatch: {
      en: "Maria has to leave early. Write a short note about the shift for her to read.",
      es: "Maria tiene que irse temprano. Escríbele una nota corta del turno para que la lea.",
    },
    skill: { en: "Write a short end-of-shift summary", es: "escribir un resumen corto al final del turno" },
    bookmarkLabel: "Portal",
    handoffCta: { en: "Next: Write a shift note", es: "Siguiente: Escribir nota del turno" },
    shiftMoment: { en: "Friday, 6 PM. End of shift.", es: "Viernes, 6 PM. Fin de turno." },
    location: browser("Open Portal", "portal", "shift-review"),
    jobCardLine: { en: "Write Maria a short shift summary. Include what happened and when. Then click Submit.", es: "Escribe a Maria un resumen corto del turno. Incluye qué pasó y cuándo. Después haz clic en Enviar." },
  },

  "mail-etiquette": {
    jobCardLine: { en: "Reply to your coworker, Darnell. Tell him where the extra aprons are. Then click Send.", es: "Responde a tu compañero Darnell. Dile dónde están los delantales adicionales. Después haz clic en Enviar." },
    key: "mail-etiquette",
    built: true,
    label: { en: "Write to a coworker", es: "Escríbele a un compañero" },
    dispatch: {
      en: "Reply to your coworker, Darnell.",
      es: "Responde a tu compañero, Darnell.",
    },
    skill: { en: "Write a work email that gets straight to the point", es: "escribir un correo de trabajo que va al grano" },
    bookmarkLabel: "Mail",
    handoffCta: { en: "Next: Reply to Darnell", es: "Siguiente: Respóndele a Darnell" },
    shiftMoment: {
      en: "Saturday morning. Darnell asked about the aprons.",
      es: "Sábado por la mañana. Darnell preguntó por los delantales.",
    },
    location: browser("Open Mail", "mail"),
  },

  "call-out-sick": {
    jobCardLine: { en: "Write Maria an email. Tell her you cannot work today’s shift. Then click Send.", es: "Escribe un correo a Maria. Dile que no puedes trabajar el turno de hoy. Después haz clic en Enviar." },
    key: "call-out-sick",
    built: true,
    label: { en: "Tell Maria you can't come in", es: "Dile a Maria que no puedes ir" },
    dispatch: {
      en: `You're sick and you're on at ${SICK_DAY_START}. Write Maria now.`,
      es: `Te sientes mal y entras a las ${SICK_DAY_START}. Escríbele a Maria ya.`,
    },
    skill: { en: "Tell my manager I can't come in", es: "avisarle a mi gerente que no puedo ir" },
    bookmarkLabel: "Mail",
    handoffCta: { en: "Next: Tell Maria", es: "Siguiente: Avísale a Maria" },
    shiftMoment: { en: "Monday, 6:12 AM. You feel sick.", es: "Lunes, 6:12 AM. Te sientes mal." },
    location: browser("Open Mail", "mail"),
    readPause: readMail(),
    lesson: {
      title: { en: "Report an absence and follow up", es: "Avisar de una ausencia y dar seguimiento" },
      summary: { en: "Write an absence email, use a different workplace's contact rule, and follow up when nobody answers.", es: "Escribe un correo de ausencia, usa la regla de contacto de otro trabajo y da seguimiento cuando nadie contesta." },
      skills: ["email", "workplace-systems"],
      minutes: 20,
      scene: {
        you: { en: "You work at Harborside Cafe. Today you are sick.", es: "Trabajas en Harborside Cafe. Hoy te sientes mal." },
        people: [
          {
            name: "Maria Delgado",
            role: { en: "Your manager", es: "Tu gerente" },
            who: { en: "She runs the cafe and plans who works each shift. If you cannot come, she needs to know early.", es: "Ella dirige el café y decide quién trabaja en cada turno. Si no puedes ir, necesita saberlo con tiempo." },
          },
        ],
        need: { en: "It is Monday at 6:12 AM. You cannot work your 10:00 AM shift today. Maria needs to know. After this email, two hotel situations use a different contact rule.", es: "Es lunes a las 6:12 a. m. No puedes trabajar tu turno de las 10:00 a. m. de hoy. Maria necesita saberlo. Después de este correo, dos situaciones en un hotel usan otra regla de contacto." },
      },
      reference: [
        { label: { en: "Now", es: "Ahora" }, value: { en: "Monday, 6:12 AM", es: "Lunes, 6:12 a. m." } },
        { label: { en: "Your shift", es: "Tu turno" }, value: { en: "Today, 10:00 AM", es: "Hoy, 10:00 a. m." } },
      ],
      takeaway: { en: "Name the shift you will miss, use your workplace's contact rule, and follow up when nobody answers.", es: "Indica a qué turno faltarás, usa la regla de contacto de tu trabajo y da seguimiento cuando nadie contesta." },
      guide: {
        skills: [
          { en: "Write a clear message saying you cannot attend a shift", es: "Escribir un mensaje claro indicando que no puedes asistir a un turno" },
          { en: "Choose a contact method using a supplied workplace rule", es: "Elegir un medio de contacto usando la regla del trabajo" },
          { en: "Distinguish a sent message from a confirmed absence", es: "Distinguir un mensaje enviado de una ausencia confirmada" },
        ],
        prepare: [{ en: "Explain that the workplaces and contact rules are fictional. Learners do not need to share medical information or personal work experiences.", es: "Explica que los trabajos y las reglas son ficticios. No se necesitan datos médicos ni experiencias laborales personales." }],
        stickingPoints: [
          { en: "Feeling sick alone does not tell Maria whether the learner can attend. A short message such as I cannot work today is enough.", es: "Sentirse mal no le dice a Maria si la persona puede asistir. Basta un mensaje corto como No puedo trabajar hoy." },
          { en: "The hotel requires a call within two hours of a shift. Do not teach email as a universal absence rule.", es: "El hotel requiere una llamada si faltan menos de dos horas. No enseñes el correo como una regla universal para ausencias." },
          { en: "The last situation requires following up with the front desk. A voicemail does not establish approval.", es: "La última situación requiere avisar a recepción. Un mensaje de voz no demuestra aprobación." },
        ],
        followUp: [{ en: "Give a new fictional shift time and contact rule. Ask the learner to explain whom they would contact and why.", es: "Da otra hora de turno y regla ficticia. Pide que la persona explique a quién contactaría y por qué." }],
        peerHelp: { en: "A partner may read the rule aloud. The learner chooses the contact and message.", es: "Un compañero puede leer la regla en voz alta. El estudiante elige el contacto y el mensaje." },
      },
    },
  },

  "account-recovery": {
    key: "account-recovery",
    built: true,
    label: { en: "Get back into a locked account", es: "Recupera una cuenta bloqueada" },
    dispatch: {
      en: "You're signed out of your work account. Sign back in.",
      es: "Se cerró tu sesión en la cuenta del trabajo. Vuelve a entrar.",
    },
    skill: { en: "Get back into a locked account", es: "recuperar una cuenta bloqueada" },
    bookmarkLabel: "Sign In",
    handoffCta: { en: "Next: Sign back in", es: "Siguiente: Vuelve a entrar" },
    shiftMoment: {
      en: "Wednesday morning. You're signed out.",
      es: "Miércoles por la mañana. Cerraste sesión.",
    },
    jobCardLine: { en: "Sign in. Find the verification text from Google on your phone. Enter its code and click Verify.", es: "Inicia sesión. Busca el mensaje de verificación de Google en tu teléfono. Escribe el código y haz clic en Verificar." },
    location: browser("Open Sign In", "account-recovery"),
    lesson: {
      title: { en: "Sign in with a text code", es: "Iniciar sesión con un código de texto" },
      summary: {
        en: "Sign in to a work account, find the real code in your texts, and type it in.",
        es: "Inicia sesión en una cuenta de trabajo, busca el código correcto en tus mensajes y escríbelo.",
      },
      skills: ["accounts"],
      minutes: 5,
      takeaway: { en: RECOVERY_COPY.en.doneBody, es: RECOVERY_COPY.es.doneBody },
      scene: {
        you: { en: "You work at Harborside Cafe. Your work account signed you out.", es: "Trabajas en Harborside Cafe. Tu cuenta del trabajo cerró tu sesión." },
        people: [],
        need: {
          en: "Sign in again with the practice email and password. Then the account sends a code to your phone in a text message. Type that code to finish.",
          es: "Vuelve a entrar con el correo y la contraseña de práctica. Después, la cuenta te envía un código al teléfono en un mensaje de texto. Escribe ese código para terminar.",
        },
      },
      reference: [
        { label: { en: "Email", es: "Correo" }, value: LESSON_EMAIL },
        { label: { en: "Password", es: "Contraseña" }, value: LESSON_PASSWORD },
      ],
      guide: {
        skills: [
          { en: "Sign in with a username and password", es: "Iniciar sesión con usuario y contraseña" },
          { en: "Find a verification code in text messages", es: "Encontrar un código de verificación en los mensajes de texto" },
          { en: "Tell a real code apart from ads and other texts", es: "Distinguir el código real de los anuncios y otros mensajes" },
          { en: "Type a code exactly as it appears", es: "Escribir un código exactamente como aparece" },
        ],
        prepare: [
          { en: "Ask who has used a code from a text to sign in before.", es: "Pregunta quién ya usó un código de un mensaje de texto para iniciar sesión." },
          { en: "Explain that the code changes every time, so you cannot save it.", es: "Explica que el código cambia cada vez, así que no se puede guardar." },
        ],
        stickingPoints: [
          { en: "Two texts have a code and both say Google. Some learners pick the text that asks them to send a code back, or type its code. Ask: did you start this sign-in? Does this text ask you to share your code? A sender name alone does not prove a message is safe.", es: "Dos mensajes tienen un código y los dos dicen Google. Algunos eligen el mensaje que pide responder con un código, o escriben su código. Pregunta: ¿tú empezaste este inicio de sesión? ¿El mensaje te pide compartir tu código? El nombre del remitente por sí solo no demuestra que un mensaje sea seguro." },
          { en: "Sam, a coworker, asks for the code. Some learners want to help. Talk about why nobody should get your code, even a friend.", es: "Sam, un compañero, pide el código. Algunos quieren ayudar. Hablen de por qué nadie debe recibir tu código, ni un amigo." },
          { en: "Some learners type the whole message. The box only takes the 6 numbers.", es: "Algunos escriben todo el mensaje. La casilla solo acepta los 6 números." },
          { en: "Let the learner compare the email and password with the key information. If needed, prompt them to check the part after @ and capital letters.", es: "Deja que el estudiante compare el correo y la contraseña con la información clave. Si hace falta, pídele revisar la parte después de @ y las mayúsculas." },
        ],
        followUp: [
          { en: "Where do you get codes like this in real life? Your bank, your email, your school.", es: "¿Dónde recibes códigos así en la vida real? En el banco, el correo, la escuela." },
          { en: "Why should you never tell anyone your code?", es: "¿Por qué nunca debes decirle a nadie tu código?" },
        ],
        peerHelp: {
          en: "A partner can point at the screen, but the learner clicks and types.",
          es: "Un compañero puede señalar la pantalla, pero el estudiante hace clic y escribe.",
        },
      },
    },
  },

  "phishing-check": {
    key: "phishing-check",
    built: true,
    label: { en: "Spot a phishing email", es: "Identifica un correo de phishing" },
    dispatch: {
      en: "An email came in about your account. Read it before you do anything.",
      es: "Llegó un correo sobre tu cuenta. Léelo antes de hacer cualquier cosa.",
    },
    skill: { en: "Spot a phishing email", es: "identificar un correo de phishing" },
    bookmarkLabel: "Inbox",
    handoffCta: { en: "Next: Check your inbox", es: "Siguiente: Revisa tu bandeja de entrada" },
    shiftMoment: {
      en: "Wednesday, a little later. An email is waiting.",
      es: "Miércoles, un poco más tarde. Hay un correo esperando.",
    },
    jobCardLine: PHISHING_STEPS[0],
    location: browser("Open Inbox", "phishing-check"),
    lesson: {
      title: { en: "Spot a phishing email", es: "Identificar un correo de phishing" },
      summary: {
        en: "Open four emails, tell the fake one from the real ones, and report it.",
        es: "Abre cuatro correos, distingue el falso de los reales y repórtalo.",
      },
      skills: ["email"],
      minutes: 8,
      scene: {
        you: { en: "You are a shift lead at Harborside Cafe. A shift lead runs a shift and helps the manager.", es: "Eres Shift Lead en Harborside Cafe. Un Shift Lead dirige un turno y ayuda a la gerente." },
        people: [
          {
            name: "Renata Silva",
            role: { en: "Your manager", es: "Tu gerente" },
            who: { en: "She is the general manager of the cafe.", es: "Es la gerente general del café." },
          },
        ],
        need: {
          en: "Four emails are in your inbox. One is not really from Harborside: it asks you to verify your account right now and reply with your password. Find it and report it.",
          es: "Hay cuatro correos en tu bandeja de entrada. Uno no es realmente de Harborside: te pide verificar tu cuenta ahora mismo y responder con tu contraseña. Encuéntralo y repórtalo.",
        },
      },
      reference: [
        { label: { en: "Real company address", es: "Dirección real de la empresa" }, value: `@${REAL_DOMAIN}` },
        { label: { en: "Renata's email", es: "Correo de Renata" }, value: `renata.silva@${REAL_DOMAIN}` },
      ],
      takeaway: {
        en: "A phishing email asks you to act fast and copies a company's name, but its address is not the company's. Check the full address, and never reply with a password.",
        es: "Un correo de phishing te pide actuar rápido y copia el nombre de una empresa, pero su dirección no es la de la empresa. Revisa la dirección completa y nunca respondas con una contraseña.",
      },
      check: [
        {
          question: {
            en: "What was the biggest clue the \"Harborside IT Support\" email was fake?",
            es: "¿Cuál fue la pista más grande de que el correo de \"Harborside IT Support\" era falso?",
          },
          choices: [
            { text: { en: "Its address was not @harborsidecafe.com", es: "Su dirección no era @harborsidecafe.com" }, correct: true },
            { text: { en: "It had bad grammar", es: "Tenía mala gramática" }, correct: false },
            { text: { en: "It arrived in the morning", es: "Llegó en la mañana" }, correct: false },
            { text: { en: "It had a company name in it", es: "Tenía el nombre de una empresa" }, correct: false },
          ],
        },
        {
          question: {
            en: "An email asks you to reply with your password to \"verify\" your account. What should you do?",
            es: "Un correo te pide responder con tu contraseña para \"verificar\" tu cuenta. ¿Qué debes hacer?",
          },
          choices: [
            { text: { en: "Send it, then change the password later", es: "Enviarla y después cambiar la contraseña" }, correct: false },
            { text: { en: "Never send a password by email. Report it instead", es: "Nunca enviar una contraseña por correo. Reportarlo en su lugar" }, correct: true },
            { text: { en: "Reply and ask why they need it", es: "Responder y preguntar para qué la necesitan" }, correct: false },
          ],
        },
        {
          question: {
            en: "Which detail should make you more careful about an email?",
            es: "¿Qué detalle debería hacerte tener más cuidado con un correo?",
          },
          choices: [
            { text: { en: "It uses your first name", es: "Usa tu nombre" }, correct: false },
            { text: { en: "It has a company logo", es: "Tiene el logo de una empresa" }, correct: false },
            { text: { en: "It says your account will be locked today unless you act now", es: "Dice que tu cuenta se bloqueará hoy a menos que actúes ahora" }, correct: true },
          ],
        },
        {
          question: {
            en: "Harborside Payroll's email only told you something, with nothing to click and no urgent threat. That kind of email is usually...",
            es: "El correo de Harborside Payroll solo te informaba algo, sin nada que hacer clic y sin amenaza urgente. Ese tipo de correo normalmente es...",
          },
          choices: [
            { text: { en: "Safe. Most real work email is like this", es: "Seguro. La mayoría del correo real de trabajo es así" }, correct: true },
            { text: { en: "Still something to report", es: "Algo que igual se debe reportar" }, correct: false },
            { text: { en: "Suspicious because it came from a company address", es: "Sospechoso porque vino de una dirección de empresa" }, correct: false },
          ],
        },
      ],
      guide: {
        skills: [
          { en: "Read an email's full sender address, not just the display name", es: "Leer la dirección completa de quien envía un correo, no solo el nombre mostrado" },
          { en: "Notice urgent, fear-based language in an email", es: "Notar un lenguaje urgente que busca asustar en un correo" },
          { en: "Tell a real company email apart from a lookalike one", es: "Distinguir un correo real de una empresa de uno que se le parece" },
          { en: "Report a phishing email instead of replying to it", es: "Reportar un correo de phishing en vez de responderlo" },
        ],
        prepare: [
          { en: "Ask who has gotten a suspicious email or text before, at any job.", es: "Pregunta quién ha recibido un correo o mensaje sospechoso antes, en cualquier trabajo." },
          { en: "Explain that the company, the people, and the emails are all fictional.", es: "Explica que la empresa, las personas y los correos son ficticios." },
        ],
        stickingPoints: [
          { en: "The fake and real addresses look similar at a glance. Point at the part right after the @ sign in each one.", es: "Las direcciones falsa y real se parecen a primera vista. Señala la parte justo después del signo @ en cada una." },
          { en: "Some learners want to reply to ask a question. Clicking Reply on the fake email, or its Verify Now button, gets the same correction as typing in it: report it instead.", es: "Algunos quieren responder para hacer una pregunta. Hacer clic en Responder en el correo falso, o en su botón Verificar ahora, da la misma corrección que escribir en él: repórtalo en su lugar." },
          { en: "The three real emails are easy to dismiss too quickly. Let the learner open all four before deciding.", es: "Los tres correos reales se pueden descartar demasiado rápido. Deja que la persona abra los cuatro antes de decidir." },
        ],
        followUp: [
          { en: "What is different about the two addresses, Harborside's real one and the fake one?", es: "¿Qué es diferente entre las dos direcciones, la real de Harborside y la falsa?" },
          { en: "Why is reporting safer than replying to ask if an email is real?", es: "¿Por qué reportar es más seguro que responder para preguntar si un correo es real?" },
        ],
        peerHelp: {
          en: "A partner can read an address out loud letter by letter. The learner decides and clicks.",
          es: "Un compañero puede leer una dirección en voz alta, letra por letra. El estudiante decide y hace clic.",
        },
      },
    },
  },

  incident: {
    jobCardLine: { en: "Complete the incident report. Include what happened, when, where, whether anyone was hurt, and what you did. Then click Submit report.", es: "Completa el reporte del incidente. Incluye qué pasó, cuándo, dónde, si alguien se lastimó y qué hiciste. Después haz clic en Enviar reporte." },
    key: "incident",
    built: true,
    label: { en: "File an incident report", es: "Llena un reporte de incidente" },
    dispatch: {
      en: "Someone slipped. Write it up before you forget.",
      es: "Alguien se resbaló. Escríbelo antes de que se te olvide.",
    },
    skill: { en: "Write an incident report", es: "escribir un reporte de incidente" },
    bookmarkLabel: "Forms",
    handoffCta: { en: "Next: Open Forms", es: "Siguiente: Abrir Forms" },
    shiftMoment: { en: "Tuesday. The floor is busy.", es: "Martes. El café está lleno." },
    location: browser("Open Forms", "incident"),
  },

  handbook: {
    jobCardLine: { en: "Read the handbook. Find the rule for reporting an absence. Select the answer that matches the rule.", es: "Lee el manual. Busca la regla para avisar de una ausencia. Selecciona la respuesta que coincide con la regla." },
    key: "handbook",
    built: true,
    label: { en: "Look something up", es: "Busca una respuesta" },
    dispatch: {
      en: "They need an answer. The handbook is on your desk.",
      es: "Necesitan una respuesta. El manual está en tu escritorio.",
    },
    skill: { en: "Look something up when I feel rushed", es: "buscar información aunque tenga prisa" },
    bookmarkLabel: "Docs",
    handoffCta: { en: "Next: Open Docs", es: "Siguiente: Abrir Docs" },
    shiftMoment: { en: "Tuesday night.", es: "Martes por la noche." },
    location: browser("Open Docs", "handbook"),
  },

  calendar: {
    key: "calendar",
    built: true,
    label: { en: "Handle a meeting invite", es: "Maneja una invitación a reunión" },
    dispatch: {
      en: "Renata sent you a meeting invite. Check it against your work shifts.",
      es: "Renata te mandó una invitación a una reunión. Compárala con tus turnos.",
    },
    jobCardLine: { en: "Compare the meeting date with your work shifts. Answer the invitation. Send Renata a day and time when you work.", es: "Compara la fecha de la reunión con tus turnos. Responde a la invitación. Envía a Renata un día y una hora en que trabajas." },
    skill: { en: "Handle a meeting invite the right way", es: "responder bien a una invitación de reunión" },
    bookmarkLabel: "Calendar",
    handoffCta: {
      en: "Open Calendar from the bookmarks",
      es: "Abre Calendar en los marcadores",
    },
    shiftMoment: { en: "Next week. You are a lead now.", es: "La semana que viene. Ya eres líder." },
    location: browser("Open Calendar from the bookmarks"),
    lesson: {
      title: { en: "Answer a meeting invite with a new time", es: "Responder a una invitación con otro horario" },
      summary: {
        en: "A meeting invite came in. Check the day against your work shifts, then answer it.",
        es: "Llegó una invitación a una reunión. Compara el día con tus turnos y luego respóndela.",
      },
      skills: ["scheduling"],
      minutes: 10,
      scene: {
        you: { en: "You are a shift lead at Harborside Cafe. A shift lead runs a shift and helps the manager.", es: "Eres Shift Lead en Harborside Cafe. Un Shift Lead dirige un turno y ayuda a la gerente." },
        people: [
          {
            name: "Renata Silva",
            role: { en: "Your manager", es: "Tu gerente" },
            who: { en: "She is the general manager of the cafe. She plans the team meetings.", es: "Es la gerente general del café. Ella organiza las reuniones del equipo." },
          },
        ],
        need: {
          en: `Renata invited you to a meeting on ${longDate(HUDDLE_DAY, "en")}. Your work shifts are on the same calendar. The meeting must be on a day you work.`,
          es: `Renata te invitó a una reunión el ${longDate(HUDDLE_DAY, "es")}. Tus turnos están en el mismo calendario. La reunión tiene que ser un día que trabajas.`,
        },
      },
      takeaway: {
        en: "An invitation asks whether you can attend. Check your shifts before answering. Suggesting a new time starts a conversation; the new time still needs to be agreed on.",
        es: "Una invitación pregunta si puedes asistir. Revisa tus turnos antes de responder. Proponer otra hora inicia una conversación; todavía tienen que ponerse de acuerdo.",
      },
      reference: [
        { label: { en: "Meeting", es: "Reunión" }, value: { en: `${cardDate(HUDDLE_DAY, "en")}, 9:00 AM`, es: `${cardDate(HUDDLE_DAY, "es")}, 9:00 AM` } },
        { label: { en: "Your Thursday shift", es: "Tu turno del jueves" }, value: { en: `${cardDate(HUDDLE_DAY + 1, "en")}, 10 AM to 6 PM`, es: `${cardDate(HUDDLE_DAY + 1, "es")}, 10 AM a 6 PM` } },
      ],
      guide: {
        skills: [
          { en: "Open a meeting invite on a calendar", es: "Abrir una invitación a una reunión en un calendario" },
          { en: "Compare the meeting day with your work shifts", es: "Comparar el día de la reunión con tus turnos de trabajo" },
          { en: "Suggest a new time instead of saying yes", es: "Proponer otro horario en vez de decir que sí" },
          { en: "Write a short, polite message", es: "Escribir un mensaje corto y amable" },
        ],
        prepare: [
          { en: "Ask who uses a calendar on their phone or on paper.", es: "Pregunta quién usa un calendario en el teléfono o en papel." },
          { en: "Explain the ways to answer an invite: Yes, No, Maybe, or suggest a new time.", es: "Explica las formas de responder a una invitación: Sí, No, Quizá, o proponer otro horario." },
        ],
        stickingPoints: [
          { en: `The Job Card asks: do you work on ${monthDate(HUDDLE_DAY, "en")}? It does not give the answer. Some learners click Yes right away; the correction then says Wednesday has no green shift and names Propose a new time. Ask: is there a green shift on the ${storyDate(HUDDLE_DAY).getDate()}th?`, es: `La tarjeta de trabajo pregunta: ¿trabajas el ${monthDate(HUDDLE_DAY, "es")}? No da la respuesta. Algunos hacen clic en Sí enseguida; la corrección dice que el miércoles no tiene turno verde y nombra Proponer otro horario. Pregunta: ¿hay un turno verde el ${storyDate(HUDDLE_DAY).getDate()}?` },
          { en: "Some learners click one of their work shifts instead of the meeting. Ask them to find the event called Weekly Lead Huddle.", es: "Algunos hacen clic en uno de sus turnos en vez de la reunión. Pídeles buscar el evento que se llama Reunión semanal de líderes." },
          { en: "Some learners click No or Maybe. Renata still needs the meeting. Ask: what time can you suggest?", es: "Algunos hacen clic en No o Quizá. Renata todavía necesita la reunión. Pregunta: ¿qué horario puedes proponer?" },
          { en: "The message must name a day they work and a time in that shift. \"See you Wednesday\" gets \"Wednesday is your day off\"; \"I come Tuesday\" asks for a time; \"Monday at 5 PM\" names the Monday shift, 7 AM to 3 PM. The time buttons add only the words, like Thursday at 10 AM.", es: "El mensaje debe nombrar un día que trabajan y una hora dentro del turno. \"Nos vemos el miércoles\" recibe \"El miércoles es tu día libre\"; \"Voy el martes\" pide una hora; \"El lunes a las 5 PM\" nombra el turno del lunes, de 7 AM a 3 PM. Los botones de hora solo agregan las palabras, como el jueves a las 10 AM." },
          { en: "Need help writing? shows sentences with blanks (___). In On my own mode it appears only after a message is sent back.", es: "¿Necesitas ayuda para escribir? muestra oraciones con espacios (___). En el modo Por mi cuenta aparece solo después de que un mensaje no pasa." },
        ],
        followUp: [
          { en: "What do you do when an appointment is on the same day as work or school?", es: "¿Qué haces cuando una cita es el mismo día que el trabajo o la escuela?" },
          { en: "How do you tell someone that a time does not work for you?", es: "¿Cómo le dices a alguien que un horario no te funciona?" },
        ],
        peerHelp: {
          en: "A partner can help read the calendar, but the learner opens the invite and writes the message.",
          es: "Un compañero puede ayudar a leer el calendario, pero el estudiante abre la invitación y escribe el mensaje.",
        },
      },
    },
  },

  "upload-schedule": {
    key: "upload-schedule",
    built: true,
    label: { en: "Upload next week's schedule", es: "Sube el horario de la próxima semana" },
    dispatch: {
      en: "Renata emailed next week's schedule. Download it and upload it to the Schedules folder in Drive.",
      es: "Renata envió por correo el horario de la próxima semana. Descárgalo y súbelo a la carpeta Schedules en Drive.",
    },
    jobCardLine: {
      en: "Download next week's schedule from Renata's email. Upload it to the Schedules folder in Drive.",
      es: "Descarga el horario de la próxima semana del correo de Renata. Súbelo a la carpeta Schedules en Drive.",
    },
    skill: { en: "Download a file and upload it to the right folder", es: "descargar un archivo y subirlo a la carpeta correcta" },
    bookmarkLabel: "Mail",
    handoffCta: { en: "Open Mail from the bookmarks", es: "Abre Correo en los marcadores" },
    shiftMoment: {
      en: "Monday morning. Renata sent next week's schedule.",
      es: "Lunes por la mañana. Renata envió el horario de la próxima semana.",
    },
    location: browser("Open Mail from the bookmarks"),
  },

  files: {
    key: "files",
    built: true,
    label: { en: "Share a file the right way", es: "Comparte un archivo de la forma correcta" },
    dispatch: {
      en: "A new coworker starts today. Rename this week's schedule, then share it with them.",
      es: "Hoy empieza un compañero nuevo. Cambia el nombre del horario de esta semana y compártelo con esa persona.",
    },
    jobCardLine: { en: "Find this week’s schedule. Rename it and share it with the new coworker. Give permission to view the file without editing it.", es: "Busca el horario de esta semana. Cámbiale el nombre y compártelo con el compañero nuevo. Dale permiso para ver el archivo sin editarlo." },
    skill: { en: "Share a file with the right access", es: "compartir un archivo con el acceso correcto" },
    bookmarkLabel: "Drive",
    handoffCta: { en: "Open Drive from the bookmarks", es: "Abre Drive en los marcadores" },
    shiftMoment: {
      en: "Monday morning. Jordan starts today.",
      es: "Lunes por la mañana. Jordan empieza hoy.",
    },
    location: browser("Open Drive from the bookmarks"),
    lesson: {
      title: { en: "Rename and share a file", es: "Cambiar el nombre de un archivo y compartirlo" },
      summary: {
        en: "Find and share a file, choose an approved version in a new workplace, and repair a named coworker’s access.",
        es: "Busca y comparte un archivo, elige una versión aprobada en otro trabajo y corrige el acceso de una compañera.",
      },
      skills: ["files"],
      minutes: 20,
      scene: {
        you: { en: "You are a shift lead at Harborside Cafe. A shift lead runs a shift and helps the manager.", es: "Eres Shift Lead en Harborside Cafe. Un Shift Lead dirige un turno y ayuda a la gerente." },
        people: [
          {
            name: "Renata Silva",
            role: { en: "Your manager", es: "Tu gerente" },
            who: { en: "She is the general manager of the cafe. She keeps the cafe's files in a shared Drive.", es: "Es la gerente general del café. Guarda los archivos del café en un Drive compartido." },
          },
          {
            name: "Jordan Kim",
            role: { en: "New coworker", es: "Persona nueva en el equipo" },
            who: { en: "Jordan starts at the cafe today and needs to see the schedule.", es: "Jordan empieza hoy en el café y necesita ver el horario." },
          },
        ],
        need: {
          en: "Jordan needs this week's work schedule. It is a file in the cafe's shared Drive. Renata wants the file to have a clear name. Jordan can look at it but not change it.",
          es: "Jordan necesita el horario de trabajo de esta semana. Es un archivo en el Drive compartido del café. Renata quiere que el archivo tenga un nombre claro. Jordan lo puede ver, pero no cambiar.",
        },
      },
      takeaway: { en: "Sharing gives someone access to your file: view means read; edit means change. Check the version and the person, and give only the access needed for the work.", es: "Compartir da acceso a tu archivo: ver permite leer; editar permite cambiar. Revisa la versión y la persona, y da solo el acceso necesario para el trabajo." },
      reference: [
        { label: { en: "This week", es: "Esta semana" }, value: { en: `Week of ${shortDate(FILES_WEEK, "en")}`, es: `Semana del ${monthDate(FILES_WEEK, "es")}` } },
        { label: { en: "New file name", es: "Nombre nuevo" }, value: RENAME_TARGET },
      ],
      guide: {
        skills: [
          { en: "Open files to check what they are, and find the right one by reading the page", es: "Abrir archivos para ver qué son, y encontrar el correcto leyendo la página" },
          { en: "Rename a file with a set pattern", es: "Cambiar el nombre de un archivo con un formato dado" },
          { en: "Share a file with one person", es: "Compartir un archivo con una persona" },
          { en: "Choose view access instead of edit access", es: "Elegir acceso para ver en vez de acceso para editar" },
        ],
        prepare: [
          { en: "The computer lesson now includes the original task and two new situations. Completion requires all three. Follow-ups check source-based choices and a reviewed response; they do not assess independent free writing. Estimated time includes reading and retries.", es: "La lección incluye la tarea original y dos situaciones nuevas. Para terminar se requieren las tres. Las nuevas situaciones revisan elecciones basadas en documentos y una respuesta revisada; no evalúan escritura libre independiente. El tiempo estimado incluye lectura y reintentos." },
          { en: "Ask who has shared a photo or a file from their phone.", es: "Pregunta quién ya compartió una foto o un archivo desde su teléfono." },
          { en: "Explain the difference: view means look only, and edit means change.", es: "Explica la diferencia: ver es solo mirar, y editar es cambiar." },
        ],
        stickingPoints: [
          { en: "Every file opens to its page. Opening the wrong one is fine; the Job Card says to read the week and the name (not a draft, not a copy) and click Close. A correction comes only if they click Rename on the wrong file, and it clears when they open another one.", es: "Cada archivo se abre y muestra su página. Abrir el equivocado está bien; la tarjeta de trabajo dice que lean la semana y el nombre (ni borrador ni copia) y hagan clic en Cerrar. Solo hay corrección si hacen clic en Cambiar nombre en el archivo equivocado, y se borra cuando abren otro." },
          { en: `Search finds plain words too: ${shortDate(FILES_WEEK, "en").toLowerCase()}, schedule, draft, horario. Show me points at a schedule to open, not at the right file.`, es: `Buscar también encuentra palabras simples: ${shortDate(FILES_WEEK, "en").toLowerCase()}, schedule, draft, horario. Muéstrame señala un horario para abrir, no el archivo correcto.` },
          { en: "Some learners click into the rename box, so the old name stays. The correction says: Delete the old name first. Enter works like Continue.", es: "Algunos hacen clic dentro de la casilla y el nombre viejo se queda. La corrección dice: Borra el nombre viejo primero. Enter funciona igual que Continuar." },
          { en: `The schedule is in English. Spanish readers match Week of ${shortDate(FILES_WEEK, "en")} with the info card (semana del ${monthDate(FILES_WEEK, "es")}).`, es: `El horario está en inglés. Quienes leen en español comparan Week of ${shortDate(FILES_WEEK, "en")} con la tarjeta de información (semana del ${monthDate(FILES_WEEK, "es")}).` },
          { en: `Some learners type a different name. The name must be ${RENAME_TARGET}. Ask them to compare their name with the example, one word at a time.`, es: `Algunos escriben otro nombre. El nombre debe ser ${RENAME_TARGET}. Pídeles comparar su nombre con el ejemplo, palabra por palabra.` },
          { en: "Some learners choose Can edit. Ask: does Jordan need to change the schedule, or only look at it?", es: "Algunos eligen Puede editar. Pregunta: ¿Jordan necesita cambiar el horario, o solo mirarlo?" },
        ],
        followUp: [
          { en: "Who do you share files or photos with? Should they be able to change them?", es: "¿Con quién compartes archivos o fotos? ¿Deben poder cambiarlos?" },
          { en: "How do you name files on your phone or computer so you can find them later?", es: "¿Cómo nombras los archivos en tu teléfono o computadora para encontrarlos después?" },
        ],
        peerHelp: {
          en: "A partner can help read the week at the top of the page, but the learner types the name and clicks Share.",
          es: "Un compañero puede ayudar a leer la semana arriba de la página, pero el estudiante escribe el nombre y hace clic en Compartir.",
        },
        atWork: [
          { setting: { en: "a store", es: "una tienda" }, example: { en: "Share this week's floor plan with a new cashier, view only.", es: "Compartir el plano de esta semana con un cajero nuevo, solo para ver." } },
          { setting: { en: "a hotel", es: "un hotel" }, example: { en: "Find today's room assignment sheet, not yesterday's.", es: "Encontrar la lista de cuartos de hoy, no la de ayer." } },
          { setting: { en: "a cleaning company", es: "una empresa de limpieza" }, example: { en: "Rename the building checklist so the next crew can find it.", es: "Cambiarle el nombre a la lista del edificio para que el próximo equipo la encuentre." } },
          { setting: { en: "a school", es: "una escuela" }, example: { en: "Share a class photo folder with a parent who can only look.", es: "Compartir una carpeta de fotos de la clase con un padre que solo puede mirar." } },
        ],
      },
    },
  },

  "mail-send-link": {
    key: "mail-send-link",
    built: true,
    label: { en: "Send Jordan the link", es: "Envíale el enlace a Jordan" },
    dispatch: {
      en: "You shared the file. Now email Jordan the link.",
      es: "Compartiste el archivo. Ahora envíale el enlace a Jordan por correo.",
    },
    skill: { en: "Send a link to a file instead of a copy", es: "enviar el enlace de un archivo en vez de una copia" },
    bookmarkLabel: "Mail",
    handoffCta: { en: "Open Mail", es: "Abrir Correo" },
    shiftMoment: {
      en: "Monday, 10:15 AM. Jordan needs the schedule.",
      es: "Lunes, 10:15 AM. Jordan necesita el horario.",
    },
    location: browser("Open Mail", "mail"),
    // Jordan's first card. Names the role inline the way mail-etiquette does
    // for Darnell — no act intro introduces a peer, only managers.
    jobCardLine: { en: "Email the new lead, Jordan, the schedule link. Say what the link is for. Send the link without attaching a copy of the file.", es: "Envía al nuevo encargado, Jordan, un correo con el enlace al horario. Di para qué sirve el enlace. Envía el enlace sin adjuntar una copia del archivo." },
  },

  spreadsheet: {
    key: "spreadsheet",
    built: true,
    label: { en: "Enter data and share a total", es: "Escribe los números y envía el total" },
    dispatch: {
      en: "Type this week's tips. Then send Renata the total.",
      es: "Escribe las propinas de esta semana. Después envíale el total a Renata.",
    },
    jobCardLine: { en: "Enter each day’s tips from the paper slip into the sheet. Email Renata the total. Then click Send.", es: "Escribe en la hoja las propinas de cada día que aparecen en el papel. Escribe a Renata el total. Después haz clic en Enviar." },
    skill: { en: "Read and trust a spreadsheet total", es: "leer y confiar en el total de una hoja de cálculo" },
    bookmarkLabel: "Sheets",
    handoffCta: { en: "Open Sheets from the bookmarks", es: "Abre Sheets en los marcadores" },
    shiftMoment: {
      en: "Friday afternoon. Counts are due.",
      es: "Viernes por la tarde. Hay que entregar las cuentas.",
    },
    location: browser("Open Sheets from the bookmarks"),
    lesson: {
      title: { en: "Enter numbers and send the total", es: "Escribir números y enviar el total" },
      takeaway: {
        en: "Type each amount on its own day. The sheet adds them up, and you send the total it shows.",
        es: "Escribe cada cantidad en su día. La hoja las suma, y tú envías el total que muestra.",
      },
      summary: {
        en: "Type five days of tip amounts into a shared sheet, then email the manager the total.",
        es: "Escribe las propinas de cinco días en una hoja compartida y luego envía el total a la gerente por correo.",
      },
      skills: ["spreadsheets", "email"],
      minutes: 10,
      scene: {
        you: { en: "You are a server at Harborside Cafe.", es: "Atiendes mesas en Harborside Cafe." },
        people: [
          {
            name: "Renata Silva",
            role: { en: "Your manager", es: "Tu gerente" },
            who: { en: "She is the general manager of the cafe. She works out everyone's pay.", es: "Es la gerente general del café. Ella calcula el pago de todo el equipo." },
          },
        ],
        need: {
          en: "Every day, you write your tips on a small paper slip. Renata needs this week's tips in a spreadsheet, and the total in an email. She adds it to your pay.",
          es: "Cada día anotas tus propinas en un papelito. Renata necesita las propinas de esta semana en una hoja de cálculo, y el total en un correo. Ella lo suma a tu pago.",
        },
      },
      guide: {
        skills: [
          { en: "Open the right spreadsheet", es: "Abrir la hoja de cálculo correcta" },
          { en: "Type money amounts into cells", es: "Escribir cantidades de dinero en las celdas" },
          { en: "Let the sheet add the numbers", es: "Dejar que la hoja sume los números" },
          { en: "Send the total in a short email", es: "Enviar el total en un correo corto" },
        ],
        prepare: [
          { en: "Practice reading money amounts out loud, like 42.50 and 51.25.", es: "Practica leer cantidades de dinero en voz alta, como 42.50 y 51.25." },
          { en: "Explain that the sheet adds the numbers by itself when all the cells are filled.", es: "Explica que la hoja suma los números sola cuando todas las celdas están llenas." },
        ],
        stickingPoints: [
          { en: "Some learners type an amount on the wrong day, or leave out the numbers after the dot. Ask: which day is this line for? Read the amount to me.", es: "Algunos escriben una cantidad en el día equivocado, o no escriben los números después del punto. Pregunta: ¿de qué día es esta línea? Léeme la cantidad." },
          { en: "Some learners try to send the email before all five days are filled. Ask: are all five days done?", es: "Algunos quieren enviar el correo antes de llenar los cinco días. Pregunta: ¿ya llenaste los cinco días?" },
          { en: "Some learners write I sent it with no number. The email must say the total from the sheet. Ask: what is the total?", es: "Algunos escriben Ya lo envié sin el número. El correo debe decir el total de la hoja. Pregunta: ¿cuál es el total?" },
          { en: "The cursor starts in Monday's box. Enter or the down arrow moves to the next day, like a real sheet. The sheet stays visible while the learner writes the email.", es: "El cursor empieza en la casilla del lunes. Enter o la flecha hacia abajo pasan al día siguiente, como en una hoja real. La hoja sigue a la vista mientras el estudiante escribe el correo." },
        ],
        followUp: [
          { en: "Where do you keep track of money, like tips, bills, or shopping?", es: "¿Dónde anotas el dinero, como las propinas, las cuentas o las compras?" },
          { en: "When do you need to send a number to someone at work or at home?", es: "¿Cuándo necesitas enviar un número a alguien en el trabajo o en casa?" },
        ],
        peerHelp: {
          en: "A partner can read the slips out loud, but the learner types each number.",
          es: "Un compañero puede leer los recibos en voz alta, pero el estudiante escribe cada número.",
        },
      },
    },
  },

  "make-a-copy": {
    jobCardLine: { en: "Comment on the date in the template heading. Make and name your own copy. Enter text in the copy to check that you can edit it.", es: "Comenta sobre la fecha del encabezado de la plantilla. Crea tu propia copia y ponle nombre. Escribe en la copia para comprobar que puedes editarla." },
    key: "make-a-copy",
    built: true,
    label: { en: "Copy a view-only template", es: "Copia una plantilla de solo ver" },
    dispatch: {
      en: "The template is view only. Copy it before you type.",
      es: "La plantilla es de solo ver. Cópiala antes de escribir.",
    },
    skill: { en: "Copy a view-only file before I type", es: "copiar un archivo de solo lectura antes de escribir" },
    bookmarkLabel: "Sheets",
    handoffCta: { en: "Open Sheets from the bookmarks", es: "Abre Sheets en los marcadores" },
    shiftMoment: { en: "Monday. Renata shared a template.", es: "Lunes. Renata compartió una plantilla." },
    location: browser("Open Sheets from the bookmarks"),
  },

  "status-report": {
    jobCardLine: { en: "Calculate the ticket total with a formula. Email Renata the total and copy Jordan using Cc. Then click Send.", es: "Calcula el total de pedidos con una fórmula. Escribe a Renata el total y agrega a Jordan en Cc. Después haz clic en Enviar." },
    key: "status-report",
    built: true,
    label: { en: "Send a status report", es: "Envía un reporte de avance" },
    dispatch: {
      en: "Your copy is waiting. Write the total. Cc Jordan.",
      es: "Tu copia está lista. Escribe el total. Pon a Jordan en Cc.",
    },
    skill: { en: "Write a SUM and cc a co-lead", es: "escribir una SUMA y poner en copia a un colíder" },
    bookmarkLabel: "Sheets",
    handoffCta: { en: "Open Sheets from the bookmarks", es: "Abre Sheets en los marcadores" },
    shiftMoment: { en: "Monday, 11 AM. Your copy is ready.", es: "Lunes, 11 AM. Tu copia está lista." },
    location: browser("Open Sheets from the bookmarks"),
  },

  triage: {
    jobCardLine: { en: "Complete both requests in Today: respond to the meeting invitation and share the current allergen list with Sam. Choose either request to start.", es: "Completa las dos solicitudes en Today: responde a la invitación a la reunión y comparte la lista actual de alérgenos con Sam. Empieza por la que prefieras." },
    key: "triage",
    built: true,
    label: { en: "Handle two things at once", es: "Maneja dos cosas a la vez" },
    dispatch: {
      en: "Two things are already waiting. Drop neither.",
      es: "Dos cosas ya están esperando. No dejes caer ninguna.",
    },
    skill: { en: "Handle two requests at once", es: "atender dos peticiones a la vez" },
    bookmarkLabel: "Today",
    handoffCta: { en: "Open Today from the bookmarks", es: "Abre Today en los marcadores" },
    shiftMoment: {
      en: "Tuesday, 9:04 AM. Two things waiting.",
      es: "Martes, 9:04 AM. Dos cosas esperando.",
    },
    location: browser("Open Today from the bookmarks"),
  },

  "team-schedule": {
    jobCardLine: { en: "Fill Saturday’s closing shift. Choose someone who is available and has hours left to work. Send that person a message about the shift.", es: "Asigna el turno de cierre del sábado. Elige a alguien disponible que pueda trabajar más horas. Envía a esa persona un mensaje sobre el turno." },
    key: "team-schedule",
    built: true,
    label: { en: "Fill Saturday close", es: "Cubre el cierre del sábado" },
    dispatch: {
      en: "Saturday close has nobody on it. Pick someone with room.",
      es: "El cierre del sábado no tiene a nadie. Elige a alguien con espacio.",
    },
    skill: { en: "Build a crew schedule", es: "armar el horario del equipo" },
    bookmarkLabel: "Sheets",
    handoffCta: { en: "Open Sheets from the bookmarks", es: "Abre Sheets en los marcadores" },
    shiftMoment: {
      en: "Monday. You write the crew week now.",
      es: "Lunes. Ahora tú escribes la semana del equipo.",
    },
    location: browser("Open Sheets from the bookmarks"),
  },

  "formula-check": {
    key: "formula-check",
    built: true,
    label: { en: "Fix the hours formula", es: "Arregla la fórmula de horas" },
    dispatch: {
      en: "Check that the hours formula counts everyone. Then send Renata the total.",
      es: "Revisa que la fórmula de horas cuente a todos. Luego envíale el total a Renata.",
    },
    jobCardLine: { en: "Fix the formula to include everyone’s hours. Email Renata the new total and whose hours were missing. Then click Send.", es: "Corrige la fórmula para incluir las horas de todos. Escribe a Renata el nuevo total y de quién faltaban las horas. Después haz clic en Enviar." },
    skill: { en: "Fix a formula range", es: "corregir el rango de una fórmula" },
    bookmarkLabel: "Sheets",
    handoffCta: { en: "Open Sheets from the bookmarks", es: "Abre Sheets en los marcadores" },
    shiftMoment: {
      en: "Friday. Hours are due for payroll.",
      es: "Viernes. Hay que entregar las horas para la nómina.",
    },
    location: browser("Open Sheets from the bookmarks"),
    lesson: {
      title: { en: "Fix a total formula in a spreadsheet", es: "Corregir la fórmula de un total en una hoja de cálculo" },
      takeaway: {
        en: "A formula tells the sheet which numbers to add. It can add correctly and still leave someone out. Click the total and check which rows the formula includes.",
        es: "Una fórmula le indica a la hoja qué números sumar. Puede sumar bien y aun así dejar a alguien fuera. Haz clic en el total y revisa qué filas incluye la fórmula.",
      },
      summary: {
        en: "The hours total looks right, but the formula leaves out one person. Fix the formula and email the correct total.",
        es: "El total de horas parece correcto, pero la fórmula deja fuera a una persona. Corrige la fórmula y envía el total correcto por correo.",
      },
      skills: ["spreadsheets"],
      minutes: 12,
      scene: {
        you: { en: "You are a shift lead at Harborside Cafe. A shift lead runs a shift and helps the manager.", es: "Eres Shift Lead en Harborside Cafe. Un Shift Lead dirige un turno y ayuda a la gerente." },
        // No crew names here: finding who is missing is the lesson.
        people: [
          {
            name: "Renata Silva",
            role: { en: "Your manager", es: "Tu gerente" },
            who: { en: "She is the general manager of the cafe. She works out everyone's pay.", es: "Es la gerente general del café. Ella calcula el pago de todo el equipo." },
          },
        ],
        need: {
          en: "A spreadsheet adds up the hours your crew worked this week. Renata uses the total for pay. One person is missing from the total.",
          es: "Una hoja de cálculo suma las horas que trabajó tu equipo esta semana. Renata usa el total para los pagos. Falta una persona en el total.",
        },
      },
      guide: {
        skills: [
          { en: "Open the right spreadsheet from a list", es: "Abrir la hoja de cálculo correcta de una lista" },
          { en: "Click a cell to see its formula", es: "Hacer clic en una celda para ver su fórmula" },
          { en: "Read a range like H2:H6 and count the rows", es: "Leer un rango como H2:H6 y contar las filas" },
          { en: "Tell a manager the corrected number", es: "Decirle a una gerente el número corregido" },
        ],
        prepare: [
          { en: "Write a SUM formula on the board. Explain that H2:H6 means row 2 to row 6.", es: "Escribe una fórmula SUMA en la pizarra (en inglés es SUM; la hoja acepta las dos). Explica que H2:H6 quiere decir de la fila 2 a la fila 6." },
          { en: "Ask students to count the names on the sheet before they click anything.", es: "Pide a los estudiantes contar los nombres de la hoja antes de hacer clic." },
        ],
        stickingPoints: [
          { en: "The Job Card asks a question, not the answer: does every person have a green cell? The exact edit comes only after a wrong try. Ask: which rows are green? Is every name in those rows?", es: "La tarjeta hace una pregunta, no da la respuesta: ¿cada persona tiene una celda verde? El cambio exacto llega solo después de un intento equivocado. Pregunta: ¿qué filas están en verde? ¿Están todos los nombres en esas filas?" },
          { en: "Clicking the formula bar puts the cursor at the end, so typing H6 gives =SUM(H2:H5)H6. The sheet shows #ERROR! and the card names the keys: press Backspace, then type the rest.", es: "Al hacer clic en la barra de fórmulas, el cursor queda al final, y escribir H6 da =SUMA(H2:H5)H6. La hoja muestra #ERROR! y la tarjeta dice qué teclas usar: borrar (Backspace) y luego escribir el resto." },
          { en: "The email must give the new total and say a name was missing. Ask: what was wrong, and what is the right number?", es: "El correo debe dar el total nuevo y decir que faltaba un nombre. Pregunta: ¿qué estaba mal y cuál es el número correcto?" },
        ],
        followUp: [
          { en: "Have you found a mistake on a pay stub or a bill? What did you do?", es: "¿Encontraste alguna vez un error en un recibo de pago o una cuenta? ¿Qué hiciste?" },
          { en: "Why should you check a number before you send it to someone?", es: "¿Por qué debes revisar un número antes de enviarlo a alguien?" },
        ],
        peerHelp: {
          en: "A partner can help count the rows, but the learner changes the formula and writes the email.",
          es: "Un compañero puede ayudar a contar las filas, pero el estudiante cambia la fórmula y escribe el correo.",
        },
      },
    },
  },

  "team-meeting": {
    jobCardLine: { en: "Create a 15-minute meeting for next week. Choose a time when no one is working. Include a title and at least two agenda items. Send the invitation.", es: "Crea una reunión de 15 minutos para la próxima semana. Elige una hora en que nadie esté trabajando. Incluye un título y al menos dos puntos para tratar. Envía la invitación." },
    key: "team-meeting",
    built: true,
    label: { en: "Lead your first huddle", es: "Dirige tu primera reunión de equipo" },
    dispatch: {
      en: "The crew needs 15 minutes on next week's schedule.",
      es: "El equipo necesita 15 minutos para el horario de la próxima semana.",
    },
    skill: { en: "Create a meeting with an agenda", es: "crear una reunión con agenda" },
    bookmarkLabel: "Huddle",
    handoffCta: { en: "Open Huddle from the bookmarks", es: "Abre Huddle en los marcadores" },
    shiftMoment: {
      en: "Tuesday. You call the huddle now.",
      es: "Martes. Ahora tú llamas a la reunión.",
    },
    location: browser("Open Huddle from the bookmarks"),
  },

  "priority-call": {
    jobCardLine: { en: "Read the three requests. Choose which to do first and a reason supported by the information. Then complete all three requests.", es: "Lee las tres solicitudes. Elige cuál hacer primero y una razón basada en la información. Después completa las tres solicitudes." },
    key: "priority-call",
    built: true,
    label: { en: "Three things at once", es: "Tres cosas a la vez" },
    dispatch: {
      en: "Compare the three situations. Choose a priority and a supported reason.",
      es: "Compara las tres situaciones. Elige una prioridad y un motivo basado en los datos.",
    },
    skill: { en: "Handle three asks at once", es: "atender tres peticiones a la vez" },
    bookmarkLabel: "Floor",
    handoffCta: { en: "Open Floor from the bookmarks", es: "Abre Salón en los marcadores" },
    shiftMoment: {
      en: "Thursday, 3:40 PM. It's busy out on the floor.",
      es: "Jueves, 3:40 PM. Hay mucho movimiento en el local.",
    },
    location: browser("Open Floor from the bookmarks"),
  },

  "college-offer": {
    key: "college-offer",
    built: true,
    label: { en: "Choose a class and make it fit", es: "Elige una clase y haz que quepa" },
    dispatch: {
      en: "Harborside will pay for a class. Read the offer, then make it fit your week.",
      es: "Harborside pagará una clase. Lee la oferta y haz que quepa en tu semana.",
    },
    skill: { en: "Choose a class section and plan work around it", es: "elegir una sección de clase y organizar el trabajo alrededor" },
    bookmarkLabel: "Offer",
    handoffCta: { en: "Open Offer from the bookmarks", es: "Abre Oferta en los marcadores" },
    shiftMoment: {
      en: "Monday. The offer is in your inbox.",
      es: "Lunes. La oferta está en tu bandeja.",
    },
    location: browser("Open Offer from the bookmarks"),
    jobCardLine: { en: "Read the offer and choose a class section. Request a shift change from Renata and add the class to your calendar. Email HR to accept the offer and name your section.", es: "Lee la oferta y elige un grupo de clase. Pide a Renata un cambio de turno y agrega la clase a tu calendario. Envía un correo a Recursos Humanos para aceptar la oferta e indicar tu grupo." },
  },

  "budget-sheet": {
    key: "budget-sheet",
    built: true,
    label: { en: "Flag what is over budget", es: "Marca lo que se pasó del presupuesto" },
    dispatch: {
      en: "One category is over. Open the formula, then tell Renata.",
      es: "Una categoría se pasó. Abre la fórmula y avísale a Renata.",
    },
    skill: { en: "Read a budget IF and a chart", es: "leer un SI de presupuesto y una gráfica" },
    bookmarkLabel: "Sheets",
    handoffCta: { en: "Open Sheets from the bookmarks", es: "Abre Sheets en los marcadores" },
    shiftMoment: {
      en: "Wednesday. This week's budget is in.",
      es: "Miércoles. Ya está el presupuesto de esta semana.",
    },
    location: browser("Open Sheets from the bookmarks"),
    jobCardLine: { en: "Find the category that is over budget. Email Renata the category and the amount over budget. Then click Send.", es: "Busca la categoría que supera el presupuesto. Escribe a Renata la categoría y el monto que supera el presupuesto. Después haz clic en Enviar." },
    lesson: {
      title: { en: "Find what went over budget", es: "Encontrar qué se pasó del presupuesto" },
      takeaway: {
        en: "Over budget means Actual is bigger than Budget. To find how much, subtract: Actual minus Budget.",
        es: "Pasarse del presupuesto quiere decir que Real es más grande que Presupuesto. Para saber por cuánto, resta: Real menos Presupuesto.",
      },
      summary: {
        en: "Read an IF formula and a bar chart to find the category that went over budget, then tell the manager by how much.",
        es: "Lee una fórmula SI (IF en inglés) y un gráfico de barras para encontrar la categoría que se pasó del presupuesto, y dile a la gerente por cuánto.",
      },
      skills: ["spreadsheets"],
      minutes: 10,
      scene: {
        you: { en: "You are a shift lead at Harborside Cafe. A shift lead runs a shift and helps the manager.", es: "Eres Shift Lead en Harborside Cafe. Un Shift Lead dirige un turno y ayuda a la gerente." },
        people: [
          {
            name: "Renata Silva",
            role: { en: "Your manager", es: "Tu gerente" },
            who: { en: "She is the general manager of the cafe. She decides how much money the cafe spends.", es: "Es la gerente general del café. Ella decide cuánto dinero gasta el café." },
          },
        ],
        need: {
          en: "The cafe plans how much money to spend each week. That plan is the budget. This week's sheet has seven kinds of cost, with a note about each one. One went over the plan. Renata wants to know which one, and by how much.",
          es: "El café planea cuánto dinero gastar cada semana. Ese plan es el presupuesto. La hoja de esta semana tiene siete tipos de gasto, con una nota sobre cada uno. Uno se pasó del plan. Renata quiere saber cuál, y por cuánto.",
        },
      },
      guide: {
        skills: [
          { en: "Read the budget and actual columns", es: "Leer las columnas de presupuesto y real" },
          { en: "Read an IF formula that says over or under", es: "Leer una fórmula SI (IF en inglés) que dice sobre o bajo" },
          { en: "Match a table to a bar chart", es: "Relacionar una tabla con un gráfico de barras" },
          { en: "Write the category and the amount in an email", es: "Escribir la categoría y la cantidad en un correo" },
        ],
        prepare: [
          { en: "Explain budget, what we plan to spend, and actual, what we really spent.", es: "Explica presupuesto, lo que pensamos gastar, y real, lo que de verdad gastamos." },
          { en: "Write one example on the board: budget $100, actual $120, over by $20.", es: "Escribe un ejemplo en la pizarra: presupuesto $100, real $120, se pasó por $20." },
        ],
        stickingPoints: [
          { en: "No cell is colored red, and every chart bar is blue, so learners must compare Budget and Actual (or each bar with its dashed line). They must click the Status cell of the line that went over before the email opens. Ask: which line spent more than its budget?", es: "Ninguna celda está en rojo y todas las barras son azules, así que hay que comparar Presupuesto y Real (o cada barra con su línea punteada). Deben hacer clic en la celda de Estado de la línea que se pasó antes de que se abra el correo. Pregunta: ¿qué línea gastó más que su presupuesto?" },
          { en: "After that click, the Job Card says the formula in plain words. The sentence starters are frames with blanks; the learner fills in the category and the amount.", es: "Después de ese clic, la tarjeta explica la fórmula en palabras simples. Las frases de ayuda tienen espacios en blanco; el estudiante escribe la categoría y la cantidad." },
          { en: "Some learners name Labor but give no amount, or write $2,850. The amount over is $450. Ask: how much more than the budget did they spend?", es: "Algunos nombran Mano de obra pero no dan la cantidad, o escriben $2,850. Se pasó por $450. Pregunta: ¿cuánto más que el presupuesto gastaron?" },
          { en: "Two lines are close on purpose. Utilities is $2 under, and Repairs is exactly on budget, so its IF says under. Ask: is $300 bigger than $300?", es: "Dos líneas están cerca a propósito. Servicios está $2 abajo, y Reparaciones está justo en el presupuesto, así que su SI dice bajo. Pregunta: ¿$300 es más grande que $300?" },
          { en: "The Total row is over too, but it has no Status. Renata asked which kind of cost, so the answer is one line, not the total.", es: "La fila Total también se pasa, pero no tiene Estado. Renata preguntó qué tipo de gasto, así que la respuesta es una línea, no el total." },
        ],
        followUp: [
          { en: "Do you plan how much to spend each week or each month? What happens when you spend more?", es: "¿Planeas cuánto gastar cada semana o cada mes? ¿Qué pasa cuando gastas más?" },
          { en: "Who do you tell at home or at work when there is not enough money?", es: "¿A quién le dices en casa o en el trabajo cuando no alcanza el dinero?" },
        ],
        peerHelp: {
          en: "A partner can help compare the two columns, but the learner clicks the cells and writes the email.",
          es: "Un compañero puede ayudar a comparar las dos columnas, pero el estudiante hace clic en las celdas y escribe el correo.",
        },
        atWork: [
          { setting: { en: "a warehouse", es: "un almacén" }, example: { en: "Find which shift went over its planned overtime hours.", es: "Encontrar qué turno se pasó de las horas extra planeadas." } },
          { setting: { en: "home health care", es: "el cuidado de salud en casa" }, example: { en: "Check which week's mileage went over the limit.", es: "Revisar qué semana el millaje se pasó del límite." } },
          { setting: { en: "a store", es: "una tienda" }, example: { en: "Tell the manager which department lost more stock than planned.", es: "Decirle al gerente qué departamento perdió más mercancía de lo planeado." } },
          { setting: { en: "at home", es: "en casa" }, example: { en: "See which bill went over your monthly plan.", es: "Ver qué cuenta se pasó de tu plan del mes." } },
        ],
      },
    },
  },

  "reply-all": {
    key: "reply-all",
    built: true,
    label: { en: "Reply to the right people", es: "Responde a las personas correctas" },
    dispatch: {
      en: "HQ asked a question in a long thread. Answer it.",
      es: "HQ hizo una pregunta en un hilo largo. Respóndela.",
    },
    skill: { en: "Choose reply instead of reply-all", es: "elegir responder en vez de responder a todos" },
    bookmarkLabel: "Mail",
    handoffCta: { en: "Open Mail from the bookmarks", es: "Abre Correo en los marcadores" },
    shiftMoment: {
      en: "Friday. A long thread from HQ.",
      es: "Viernes. Un hilo largo de HQ.",
    },
    location: browser("Open Mail from the bookmarks"),
    jobCardLine: { en: "Read the email conversation. Edit the draft to answer the delivery question politely. Then send your reply to everyone in the conversation.", es: "Lee la conversación por correo. Edita el borrador para contestar la pregunta sobre la entrega con respeto. Después envía tu respuesta a todos en la conversación." },
  },

  enrollment: {
    key: "enrollment",
    built: true,
    label: { en: "Apply before the deadline", es: "Envía la solicitud antes de la fecha límite" },
    dispatch: {
      en: "The college portal has a deadline and a list. Find both. Then write.",
      es: "El portal de la universidad tiene una fecha y una lista. Encuentra las dos. Luego escribe.",
    },
    skill: { en: "Navigate a college portal under a deadline", es: "usar un portal universitario con fecha límite" },
    bookmarkLabel: "College",
    handoffCta: { en: "Open College from the bookmarks", es: "Abre Universidad en los marcadores" },
    shiftMoment: {
      en: "Monday. The application is open.",
      es: "Lunes. La solicitud está abierta.",
    },
    location: browser("Open College from the bookmarks"),
    jobCardLine: { en: "Find the application deadline and select the missing document. Write why you want to study at BHCC or in the program. Then submit the application.", es: "Busca la fecha límite de la solicitud y selecciona el documento que falta. Escribe por qué quieres estudiar en BHCC o en el programa. Después envía la solicitud." },
  },

  "appointment-scheduling": {
    key: "appointment-scheduling",
    built: true,
    label: { en: "Book the visit without a clash", es: "Agenda la cita sin un choque" },
    dispatch: {
      en: "A patient asked for a time that is already taken. Offer her a free time.",
      es: "Una paciente pidió una hora que ya está ocupada. Ofrécele una hora libre.",
    },
    skill: { en: "Book an appointment without double-booking", es: "agendar una cita sin encimarla con otra" },
    bookmarkLabel: "Front Desk",
    handoffCta: { en: "Open Front Desk from the bookmarks", es: "Abre Recepción en los marcadores" },
    shiftMoment: {
      en: "Monday. The morning list is in.",
      es: "Lunes. Ya está la lista de la mañana.",
    },
    location: browser("Open Front Desk from the bookmarks"),
    jobCardLine: { en: "Check why the requested appointment time is unavailable. Offer Maya an available time. Send her a confirmation with the new time.", es: "Revisa por qué la hora solicitada no está disponible. Ofrece a Maya una hora disponible. Envíale una confirmación con la nueva hora." },
    lesson: {
      title: { en: "Book an appointment at an open time", es: "Dar una cita en un horario libre" },
      summary: {
        en: "Book a visit, fit a whole appointment into a new calendar, and handle a change when no time works.",
        es: "Agenda una visita, busca espacio para una cita completa en otra agenda y responde a un cambio cuando ninguna hora sirve.",
      },
      takeaway: { en: "Check the whole visit against the calendar and the person’s availability. Ask for another time when none fits.", es: "Compara la visita completa con la agenda y la disponibilidad de la persona. Pide otra hora cuando ninguna sirva." },
      skills: ["scheduling", "workplace-systems"],
      minutes: 25,
      scene: {
        you: { en: "You work at the front desk of Harborside Health, a clinic.", es: "Trabajas en la recepción de Harborside Health, una clínica." },
        people: [
          {
            name: "Maya Ansari",
            role: { en: "A patient", es: "Una paciente" },
            who: { en: "She called the clinic to make an appointment. She wants a text back.", es: "Llamó a la clínica para hacer una cita. Quiere que le contesten con un mensaje de texto." },
          },
        ],
        need: {
          en: "Maya called while you were busy. A coworker wrote her phone message on a pink note. She wants an appointment today at 10:00. Check the schedule, find a time that is free, and text her back.",
          es: "Maya llamó mientras atendías otra cosa. Una compañera anotó su mensaje en una nota rosada. Quiere una cita hoy a las 10:00. Revisa la agenda, busca una hora libre y contéstale con un mensaje de texto.",
        },
      },
      guide: {
        skills: [
          { en: "Read an appointment schedule", es: "Leer una agenda de citas" },
          { en: "See when a time is already booked", es: "Ver cuándo una hora ya está ocupada" },
          { en: "Choose the open time instead", es: "Elegir la hora libre en su lugar" },
          { en: "Write a confirmation that says the new time", es: "Escribir una confirmación que dice la hora nueva" },
        ],
        prepare: [
          { en: "The computer lesson now includes the original task and two new situations. Completion requires all three. Follow-ups check source-based choices and a reviewed response; they do not assess independent free writing. Estimated time includes reading and retries.", es: "La lección incluye la tarea original y dos situaciones nuevas. Para terminar se requieren las tres. Las nuevas situaciones revisan elecciones basadas en documentos y una respuesta revisada; no evalúan escritura libre independiente. El tiempo estimado incluye lectura y reintentos." },
          { en: "Ask who has made an appointment by phone at a clinic or an office.", es: "Pregunta quién ya hizo una cita por teléfono en una clínica o una oficina." },
          { en: "Explain that Confirmed or Checked in means someone already has that time, and Open means it is free.", es: "Explica que Confirmada o Ya llegó quiere decir que alguien ya tiene esa hora, y Libre quiere decir que nadie la tiene." },
        ],
        stickingPoints: [
          { en: "Some learners click 10:00 because the patient asked for it. Ask: does someone already have that time?", es: "Algunos hacen clic en las 10:00 porque la paciente la pidió. Pregunta: ¿alguien ya tiene esa hora?" },
          { en: "12:30 has no patient name, but it says Blocked (a staff meeting). Some learners click it. Ask: what does the Status column say?", es: "Las 12:30 no tienen nombre de paciente, pero dicen Bloqueada (una reunión del personal). Algunos hacen clic ahí. Pregunta: ¿qué dice la columna Estado?" },
          { en: "The pink phone message note stays next to the schedule. It has Maya's phone number and date of birth, like a real message at a front desk. On a narrow or zoomed screen it sits above the schedule.", es: "La nota rosada del mensaje telefónico se queda junto a la agenda. Tiene el teléfono y la fecha de nacimiento de Maya, como un mensaje real en una recepción. En una pantalla angosta o con zoom, queda arriba de la agenda." },
          { en: "The list of reasons names Luis Moreno (9:30), Priya Shah (10:30) and the staff meeting (12:30). Only reading the 10:00 row finds Walter Nguyen. If a learner picks a neighbour, the card says where that name really is.", es: "La lista de razones nombra a Luis Moreno (9:30), Priya Shah (10:30) y la reunión del personal (12:30). Solo leyendo la fila de las 10:00 se encuentra a Walter Nguyen. Si alguien elige a un vecino, la tarjeta dice dónde está ese nombre de verdad." },
          { en: "Some learners write See you soon with no time, or only the number. The message must offer 11:30 in a short sentence (11:30, 1130, 11h30 and eleven thirty all count). A text that says 11:30 is taken is sent back.", es: "Algunos escriben Nos vemos sin la hora, o solo el número. El mensaje debe ofrecer las 11:30 en una oración corta (11:30, 1130, 11h30 y once y media cuentan). Un mensaje que dice que las 11:30 están ocupadas se regresa." },
          { en: "Need help writing? gives frames with a blank for the time (See you at ___.). The learner still has to find the time. In On my own mode the frames appear only after a first try is sent back.", es: "¿Necesitas ayuda para escribir? da frases con un espacio para la hora (Nos vemos a las ___.). El estudiante todavía tiene que encontrar la hora. En el modo Por mi cuenta, las frases aparecen solo después de que un primer intento se regresa." },
        ],
        followUp: [
          { en: "When you call to make an appointment, what do you ask? What do you write down?", es: "Cuando llamas para hacer una cita, ¿qué preguntas? ¿Qué anotas?" },
          { en: "What do you say when the time you want is not free?", es: "¿Qué dices cuando la hora que quieres no está libre?" },
        ],
        peerHelp: {
          en: "A partner can read the schedule out loud, but the learner picks the time and writes the message.",
          es: "Un compañero puede leer la agenda en voz alta, pero el estudiante elige la hora y escribe el mensaje.",
        },
        atWork: [
          { setting: { en: "a hotel", es: "un hotel" }, example: { en: "A guest wants a room that is taken. Offer one that is free.", es: "Un huésped quiere un cuarto ocupado. Ofrecerle uno libre." } },
          { setting: { en: "a salon or barbershop", es: "un salón o una barbería" }, example: { en: "Find an open time in the book and text the client.", es: "Buscar una hora libre en la agenda y mandarle un mensaje al cliente." } },
          { setting: { en: "an auto shop", es: "un taller mecánico" }, example: { en: "Move a car drop-off to a time the bay is free.", es: "Pasar la entrega de un carro a una hora en que haya espacio." } },
          { setting: { en: "home health care", es: "el cuidado de salud en casa" }, example: { en: "Tell a client the new visit time when yours is full.", es: "Decirle a un cliente la nueva hora de visita cuando la tuya está llena." } },
        ],
      },
    },
  },

  "financial-aid": {
    key: "financial-aid",
    built: true,
    label: { en: "Read the award letter", es: "Lee la carta de ayuda" },
    dispatch: {
      en: "The award letter is in the portal. Find the amount and the accept-by date.",
      es: "La carta de ayuda está en el portal. Encuentra el monto y la fecha para aceptar.",
    },
    skill: { en: "Find the amount and deadline on an award letter", es: "encontrar el monto y la fecha en una carta de ayuda financiera" },
    bookmarkLabel: "College",
    handoffCta: { en: "Open College from the bookmarks", es: "Abre Universidad en los marcadores" },
    shiftMoment: {
      en: "Wednesday. The award letter arrived.",
      es: "Miércoles. Llegó la carta de ayuda.",
    },
    location: browser("Open College from the bookmarks"),
    jobCardLine: { en: "Read the financial aid award letter. Select the award amount and the deadline to accept it.", es: "Lee la carta de ayuda financiera. Selecciona el monto de la ayuda y la fecha límite para aceptarla." },
  },

  "patient-intake": {
    key: "patient-intake",
    built: true,
    label: { en: "File the intake. Do not overshare.", es: "Archiva el ingreso. No compartas de más." },
    dispatch: {
      en: "A new patient form is in. File it. A coworker will ask to see it.",
      es: "Hay un formulario de un paciente nuevo. Archívalo. Un compañero va a pedir verlo.",
    },
    skill: { en: "Judge who may see a patient form", es: "decidir quién puede ver el formulario de un paciente" },
    bookmarkLabel: "Front Desk",
    handoffCta: { en: "Open Front Desk from the bookmarks", es: "Abre Recepción en los marcadores" },
    shiftMoment: {
      en: "Wednesday. A new patient just checked in.",
      es: "Miércoles. Un paciente nuevo acaba de llegar.",
    },
    location: browser("Open Front Desk from the bookmarks"),
    jobCardLine: { en: "Complete and file the intake form. Check the requests and verified assignment to choose who may receive the chart. Reply to Tomás without sharing private visit information.", es: "Completa y archiva el formulario de ingreso. Revisa las solicitudes y la asignación verificada para elegir quién puede recibir el expediente. Responde a Tomás sin compartir información privada de la visita." },
  },

  coursework: {
    key: "coursework",
    built: true,
    label: { en: "Submit the assignment on time", es: "Entrega la tarea a tiempo" },
    dispatch: {
      en: "Find the due date and how much time you have. Write a short answer. Then submit.",
      es: "Busca la fecha de entrega y cuánto tiempo tienes. Escribe una respuesta corta. Después entrégala.",
    },
    skill: { en: "Read a syllabus and submit on time", es: "leer un temario y entregar a tiempo" },
    bookmarkLabel: "Coursework",
    handoffCta: { en: "Open Coursework from the bookmarks", es: "Abre Curso en los marcadores" },
    shiftMoment: {
      en: "Thursday. Something is due tomorrow night.",
      es: "Jueves. Algo se entrega mañana en la noche.",
    },
    location: browser("Open Coursework from the bookmarks"),
    jobCardLine: { en: "Find the assignment deadline and the time remaining. Reply to Dana with an apology and one action you will take. Then click Submit assignment.", es: "Busca la fecha límite de la tarea y el tiempo que queda. Responde a Dana con una disculpa y una acción que vas a realizar. Después haz clic en Entregar tarea." },
    lesson: {
      title: { en: "Find a due date and submit an assignment", es: "Encontrar la fecha de entrega y entregar una tarea" },
      summary: {
        en: "Read a class assignment, find the due date, work out how much time is left, and write a short reply that says sorry and one thing you will do.",
        es: "Lee una tarea de clase, busca la fecha de entrega, calcula cuánto tiempo queda y escribe una respuesta corta que dice lo siento y una cosa que vas a hacer.",
      },
      takeaway: {
        en: "Check the due date, including the time. Typing your work does not turn it in: submitting sends it to your teacher. Look for a message confirming it was submitted.",
        es: "Revisa la fecha de entrega, incluida la hora. Escribir tu tarea no la entrega: al entregarla, se envía a tu maestra. Busca un mensaje que confirme la entrega.",
      },
      skills: ["workplace-systems"],
      minutes: 8,
      scene: {
        you: { en: "You take a writing class at Bunker Hill Community College.", es: "Tomas una clase de escritura en Bunker Hill Community College." },
        people: [
          {
            name: "Ms. Rivera",
            role: { en: "Your teacher", es: "Tu maestra" },
            who: { en: "She teaches your writing class. She posts the homework on the class website.", es: "Ella enseña tu clase de escritura. Publica la tarea en la página de la clase." },
          },
          {
            name: "Dana Price",
            role: { en: "A customer in the homework", es: "Una clienta de la tarea" },
            who: { en: "She is not a real person. The homework is a reply to her email.", es: "No es una persona real. La tarea es responder a su correo." },
          },
        ],
        need: {
          en: "Today is Thursday. Your homework is on the class website. Find when it is due and how much time you have. Then do the homework and turn it in.",
          es: "Hoy es jueves. Tu tarea está en la página de la clase. Busca cuándo se entrega y cuánto tiempo tienes. Después haz la tarea y entrégala.",
        },
      },
      guide: {
        skills: [
          { en: "Find the due date on an assignment", es: "Encontrar la fecha de entrega en una tarea" },
          { en: "Work out how much time is left from today", es: "Calcular cuánto tiempo queda desde hoy" },
          { en: "Write a short reply that says what you will do next", es: "Escribir una respuesta corta que dice qué vas a hacer" },
          { en: "Submit an assignment online", es: "Entregar una tarea en línea" },
        ],
        prepare: [
          { en: "Ask who has taken an online class or used a school website.", es: "Pregunta quién ya tomó una clase en línea o usó un sitio web de una escuela." },
          { en: "Explain that a due date has a day and a time, and late work is not accepted.", es: "Explica que la fecha de entrega tiene un día y una hora, y que no se acepta trabajo tarde." },
        ],
        stickingPoints: [
          { en: "The due-date list has four choices with different days and times (Friday 9:00 AM is not Friday 11:59 PM). Ask: what day and what time does it say after Due?", es: "La lista de fechas tiene cuatro opciones con días y horas distintos (viernes 9:00 AM no es viernes 11:59 PM). Pregunta: ¿qué día y qué hora dice después de Entrega?" },
          { en: "Today: Thursday is at the top of the page. Some learners choose tonight or one week for How much time do you have? Ask: today is Thursday, it is due Friday night, so when is that?", es: "Hoy: jueves está arriba en la página. Algunos eligen esta noche o una semana en ¿Cuánto tiempo tienes? Pregunta: hoy es jueves y se entrega el viernes en la noche, ¿cuándo es eso?" },
          { en: "The reply must say sorry and one thing they will do. Short is fine: Sorry. I fix it. passes. A reply with no sorry, or one that refuses (I will not fix it), is sent back with a card line that names the missing part.", es: "La respuesta debe decir que lo sienten y una cosa que van a hacer. Corta está bien: Lo siento. Lo arreglo. pasa. Una respuesta sin disculpa, o que se niega (no lo voy a arreglar), se regresa con una línea en la tarjeta que dice qué falta." },
          { en: "Need help writing? gives frames with blanks (I will ___.). A reply that still has ___ is sent back. In On my own mode the frames appear only after a first try is sent back.", es: "¿Necesitas ayuda para escribir? da frases con espacios (Voy a ___.). Una respuesta que todavía tiene ___ se regresa. En el modo Por mi cuenta, las frases aparecen solo después de que un primer intento se regresa." },
        ],
        followUp: [
          { en: "Where do you see due dates in your life? School, bills, forms for work.", es: "¿Dónde ves fechas de entrega en tu vida? La escuela, las cuentas, los formularios del trabajo." },
          { en: "What do you do when you know you will be late with something?", es: "¿Qué haces cuando sabes que vas a entregar algo tarde?" },
        ],
        peerHelp: {
          en: "A partner can read the assignment out loud, but the learner chooses the date and writes the reply.",
          es: "Un compañero puede leer la tarea en voz alta, pero el estudiante elige la fecha y escribe la respuesta.",
        },
      },
    },
  },

  "billing-sheet": {
    key: "billing-sheet",
    built: true,
    label: { en: "Flag the billing mismatch", es: "Marca el error de facturación" },
    dispatch: {
      en: "One visit code does not match its charge. Find it and tell the office.",
      es: "Un código de visita no coincide con el cargo. Encuéntralo y avisa a la oficina.",
    },
    skill: { en: "Match visit codes to charges", es: "emparejar códigos de visita con los cargos" },
    bookmarkLabel: "Sheets",
    handoffCta: { en: "Open Sheets from the bookmarks", es: "Abre Sheets en los marcadores" },
    shiftMoment: {
      en: "Thursday. Today's billing sheet is in.",
      es: "Jueves. Ya está la hoja de facturación.",
    },
    location: browser("Open Sheets from the bookmarks"),
    jobCardLine: { en: "Compare the charges with the service list. Select the row that does not match. Email Pat the row and the correct charge.", es: "Compara los cargos con la lista de servicios. Selecciona la fila que no coincide. Envía a Pat un correo con la fila y el cargo correcto." },
  },

  research: {
    key: "research",
    built: true,
    label: { en: "Cite a source that holds up", es: "Cita una fuente que se sostenga" },
    dispatch: {
      en: "Four results came back. Pick the one you would cite, and say why.",
      es: "Salieron cuatro resultados. Elige el que citarías, y di por qué.",
    },
    skill: { en: "Tell a credible source from an unreliable one", es: "distinguir una fuente confiable de una que no lo es" },
    bookmarkLabel: "Library",
    handoffCta: { en: "Open Library from the bookmarks", es: "Abre Biblioteca en los marcadores" },
    shiftMoment: {
      en: "Friday. You need one source.",
      es: "Viernes. Necesitas una fuente.",
    },
    location: browser("Open Library from the bookmarks"),
    jobCardLine: { en: "Read the search results. Choose a source to cite. Explain why you can trust it using information about the author or publication. Submit your choice and explanation.", es: "Lee los resultados de búsqueda. Elige una fuente para citar. Explica por qué es confiable con información sobre el autor o la publicación. Envía tu elección y tu explicación." },
  },

  "confidentiality-call": {
    key: "confidentiality-call",
    built: true,
    label: { en: "Do not confirm over the phone", es: "No confirmes por teléfono" },
    dispatch: {
      en: "Someone called claiming to be family. You cannot verify who they are.",
      es: "Alguien llamó diciendo ser familia. No puedes verificar quién es.",
    },
    skill: { en: "Decline a plausible request for private information", es: "rechazar una petición creíble de información privada" },
    bookmarkLabel: "Front Desk",
    handoffCta: { en: "Open Front Desk from the bookmarks", es: "Abre Recepción en los marcadores" },
    shiftMoment: {
      en: "Friday. The phone is ringing.",
      es: "Viernes. Está sonando el teléfono.",
    },
    location: browser("Open Front Desk from the bookmarks"),
    jobCardLine: { en: "Read the request about Maya. Write a reply that protects her private information. Then send it.", es: "Lee la solicitud sobre Maya. Escribe una respuesta que proteja su información privada. Después envíala." },
  },

  // ---- Act VI: Getting the Office Job (the hiring arc) ----

  "job-posting": {
    key: "job-posting",
    built: true,
    label: { en: "Read the HQ job posting", es: "Lee el anuncio del puesto en HQ" },
    dispatch: {
      en: "Anita shared an opening at HQ. Read it and check it against what you've done.",
      es: "Anita compartió una vacante en HQ. Léela y compárala con lo que has hecho.",
    },
    skill: { en: "Read a job posting and match it to my experience", es: "leer un anuncio de empleo y compararlo con mi experiencia" },
    bookmarkLabel: "Jobs",
    handoffCta: { en: "Open Jobs from the bookmarks", es: "Abre Empleos en los marcadores" },
    shiftMoment: {
      en: "Before HQ. An opening lands in your inbox.",
      es: "Antes de HQ. Llega una vacante a tu correo.",
    },
    location: browser("Open Jobs from the bookmarks"),
    jobCardLine: { en: "Read the job requirements. Select at least three that match the work history. Write one sentence explaining the match. Then click Apply for this job.", es: "Lee los requisitos del empleo. Selecciona al menos tres que coincidan con el historial de trabajo. Escribe una oración que explique la relación. Después haz clic en Postularme a este empleo." },
    jobCardDoneLine: { en: "You completed the job requirements check.", es: "Completaste la revisión de los requisitos del empleo." },
    lesson: {
      title: { en: "Compare a job posting", es: "Comparar un anuncio de empleo" },
      summary: {
        en: "Read a job posting, check the requirements you meet, and write one line about why you are a good fit.",
        es: "Lee un anuncio de empleo, marca los requisitos que cumples y escribe una línea sobre por qué eres una buena opción.",
      },
      skills: ["job-search"],
      minutes: 10,
      scene: {
        you: {
          en: "You are playing Sam Rivera, who worked at Harborside Cafe. These facts are Sam's.",
          es: "Haces el papel de Sam Rivera, que trabajó en Harborside Cafe. Estos datos son de Sam.",
        },
        people: [
          {
            name: "Anita Raman",
            role: { en: "Operations director", es: "Directora de operaciones" },
            who: { en: "She works at Harborside HQ, the company office. She sent Sam this job post.", es: "Trabaja en Harborside HQ, la oficina de la empresa. Le envió este anuncio de trabajo a Sam." },
          },
        ],
        need: {
          en: "Read the job post. Compare what the job asks for with Sam's experience on your info card.",
          es: "Lee el anuncio. Compara lo que pide el trabajo con la experiencia de Sam en tu tarjeta de información.",
        },
      },
      reference: JOB_SEEKER_FACTS,
      persona: JOB_SEEKER.name,
      takeaway: {
        en: "Most people who get hired do not match every line. If you match most of the list, apply.",
        es: "La mayoría de las personas contratadas no cumplen cada línea. Si cumples casi toda la lista, postúlate.",
      },
      guide: {
        skills: [
          { en: "Read the parts of a job posting: the role, the pay, the requirements", es: "Leer las partes de un anuncio de empleo: el puesto, el pago, los requisitos" },
          { en: "Match requirements to your own experience", es: "Comparar los requisitos con tu propia experiencia" },
          { en: "Know that you can apply without every requirement", es: "Saber que puedes postularte aunque no cumplas todos los requisitos" },
          { en: "Write one sentence about why you fit the job", es: "Escribir una oración sobre por qué eres buena opción para el trabajo" },
        ],
        prepare: [
          { en: "Ask who has looked at a job ad, online or on paper.", es: "Pregunta quién ya miró un anuncio de empleo, en línea o en papel." },
          { en: "Explain that most people who get hired do not meet every requirement in the posting.", es: "Explica que la mayoría de las personas contratadas no cumplen todos los requisitos del anuncio." },
        ],
        stickingPoints: [
          { en: "Learners play Sam Rivera, so the facts on the info card are Sam's, not theirs. Some check College degree. The card says Sam has none, and Apply waits until it is unchecked. Ask: does Sam have a degree? Does this job need it? (It says preferred.)", es: "Los estudiantes hacen el papel de Sam Rivera, así que los datos de la tarjeta son de Sam, no suyos. Algunos marcan el título universitario. La tarjeta dice que Sam no tiene, y Aplicar espera hasta que lo desmarquen. Pregunta: ¿Sam tiene título? ¿Este trabajo lo necesita? (Dice de preferencia.)" },
          { en: "Some learners check fewer than three boxes. Ask them to read each line and say what on the info card matches it.", es: "Algunos marcan menos de tres puntos. Pídeles leer cada línea y decir qué de la tarjeta de información coincide." },
          { en: "The fit line can be short (I led a team) but it must name something Sam did at work. Random letters or a starter with the blank left in are sent back. Ask: what is one thing Sam did that fits this job?", es: "La línea puede ser corta (Dirigí un equipo), pero debe nombrar algo que Sam hizo en el trabajo. Letras al azar o una frase con el espacio sin llenar se regresan. Pregunta: ¿qué hizo Sam que encaja con este trabajo?" },
        ],
        followUp: [
          { en: "What job do you want? What do postings for that job ask for?", es: "¿Qué trabajo quieres? ¿Qué piden los anuncios para ese trabajo?" },
          { en: "What skills from your past jobs or your home country can you list?", es: "¿Qué habilidades de tus trabajos anteriores o de tu país puedes anotar?" },
        ],
        peerHelp: {
          en: "A partner can talk about each requirement, but the learner checks the boxes and writes the line.",
          es: "Un compañero puede hablar de cada requisito, pero el estudiante marca los puntos y escribe la línea.",
        },
      },
    },
  },

  "job-application": {
    key: "job-application",
    built: true,
    label: { en: "Fill out the application", es: "Llena la solicitud" },
    dispatch: {
      en: "The application has a few sections. Fill each one, then submit.",
      es: "La solicitud tiene varias secciones. Llena cada una y envíala.",
    },
    skill: { en: "Fill out a job application", es: "llenar una solicitud de empleo" },
    bookmarkLabel: "Jobs",
    handoffCta: { en: "Open Jobs from the bookmarks", es: "Abre Empleos en los marcadores" },
    shiftMoment: {
      en: "Before HQ. The application is open.",
      es: "Antes de HQ. La solicitud está abierta.",
    },
    location: browser("Open Jobs from the bookmarks"),
    jobCardLine: { en: "Complete the application and choose an availability option. Write one or two sentences explaining why you want the job. Then click Submit application.", es: "Completa la solicitud y elige una opción de disponibilidad. Escribe una o dos oraciones que expliquen por qué quieres el empleo. Después haz clic en Enviar solicitud." },
    lesson: {
      title: { en: "Fill out a job application", es: "Llenar una solicitud de empleo" },
      summary: {
        en: "Fill out an online job application: check your work history, choose your availability, and write why you want the job.",
        es: "Llena una solicitud de empleo en línea: revisa tu historial de trabajo, elige tu disponibilidad y escribe por qué quieres el trabajo.",
      },
      skills: ["job-search", "forms"],
      minutes: 10,
      scene: {
        you: {
          en: "You are playing Sam Rivera, who worked at Harborside Cafe. These facts are Sam's.",
          es: "Haces el papel de Sam Rivera, que trabajó en Harborside Cafe. Estos datos son de Sam.",
        },
        people: [],
        need: {
          en: "Sam found a job at Harborside HQ. Fill out the online application for Sam. Copy Sam's contact facts from your info card.",
          es: "Sam encontró un trabajo en Harborside HQ. Llena la solicitud en línea por Sam. Copia los datos de contacto de Sam de tu tarjeta de información.",
        },
      },
      reference: APPLICATION_FACTS,
      persona: JOB_SEEKER.name,
      takeaway: {
        en: "The employer uses your phone and email to contact you. One wrong letter or number could mean a missed message. Check your contact details before submitting.",
        es: "La empresa usa tu teléfono y correo para contactarte. Una letra o un número incorrecto podría impedir que te llegue un mensaje. Revisa tus datos de contacto antes de enviar la solicitud.",
      },
      guide: {
        skills: [
          { en: "Read each section of an application", es: "Leer cada sección de una solicitud" },
          { en: "Type a name, phone number, email, and start date exactly", es: "Escribir un nombre, teléfono, correo y fecha para empezar sin errores" },
          { en: "Match availability to the job's hours", es: "Elegir la disponibilidad según las horas del trabajo" },
          { en: "Write one or two sentences about why you want the job", es: "Escribir una o dos oraciones sobre por qué quieres el trabajo" },
        ],
        prepare: [
          { en: "Ask who has filled out a job application, on paper or online.", es: "Pregunta quién ya llenó una solicitud de empleo, en papel o en línea." },
          { en: "Explain full time (about 40 hours a week) and part time. Tell students they are filling this out for a pretend job seeker, Sam Rivera.", es: "Explica tiempo completo (unas 40 horas por semana) y medio tiempo. Diles que llenan esto por una persona inventada que busca trabajo, Sam Rivera." },
        ],
        stickingPoints: [
          { en: "Learners play Sam Rivera and copy Sam's name, phone, email, and start date from the info card. Phone numbers pass with or without dashes and spaces; 11/16/2026 also passes as 11-16-2026. When a box is wrong, the card names it.", es: "Los estudiantes hacen el papel de Sam Rivera y copian el nombre, teléfono, correo y fecha para empezar de la tarjeta. El teléfono vale con o sin guiones y espacios; 11/16/2026 también vale como 11-16-2026. Si una casilla está mal, la tarjeta la nombra." },
          { en: "Some learners choose Part time. The job is full time (40 hours a week) and Sam wants 40 hours, so the card asks them to choose Full time. Ask: how many hours does the job have? How many does Sam want?", es: "Algunos eligen Medio tiempo. El trabajo es de tiempo completo (40 horas por semana) y Sam quiere 40 horas, así que la tarjeta pide elegir Tiempo completo. Pregunta: ¿cuántas horas tiene el trabajo? ¿Cuántas quiere Sam?" },
          { en: "Some learners write only I need a job. The answer needs one sentence with a reason (about five words). Ask: why do you want this job, and what are you good at?", es: "Algunos escriben solo Necesito un trabajo. La respuesta necesita una oración con una razón (unas cinco palabras). Pregunta: ¿por qué quieres este trabajo y qué haces bien?" },
        ],
        followUp: [
          { en: "What will you say when an application asks why you want the job?", es: "¿Qué vas a decir cuando una solicitud te pregunte por qué quieres el trabajo?" },
          { en: "What days and hours can you really work? Write them down.", es: "¿Qué días y horas puedes trabajar de verdad? Escríbelos." },
        ],
        peerHelp: {
          en: "A partner can talk about reasons for wanting the job, but the learner chooses and writes the answers.",
          es: "Un compañero puede hablar de razones para querer el trabajo, pero el estudiante elige y escribe las respuestas.",
        },
      },
    },
  },

  "resume-build": {
    key: "resume-build",
    built: true,
    label: { en: "Build your résumé", es: "Arma tu currículum" },
    dispatch: {
      en: "Turn your Harborside jobs into a one-page résumé: summary, roles, skills.",
      es: "Convierte tus trabajos en Harborside en un currículum de una página: resumen, puestos, habilidades.",
    },
    skill: { en: "Build a one-page résumé from my work history", es: "armar un currículum de una página con mi historial" },
    bookmarkLabel: "Résumé",
    handoffCta: { en: "Open Résumé from the bookmarks", es: "Abre Currículum en los marcadores" },
    shiftMoment: {
      en: "Before HQ. The application asked for a résumé.",
      es: "Antes de HQ. La solicitud pidió un currículum.",
    },
    location: browser("Open Résumé from the bookmarks"),
    jobCardLine: { en: "Write a short summary and one achievement for each job. Select at least three skills. Then click Save résumé.", es: "Escribe un resumen corto y un logro de cada empleo. Selecciona al menos tres habilidades. Después haz clic en Guardar currículum." },
    lesson: {
      title: { en: "Write a one-page résumé", es: "Escribir un currículum de una página" },
      summary: {
        en: "Write a short summary, add one accomplishment for each of two jobs, and choose your skills.",
        es: "Escribe un resumen corto, agrega un logro para cada uno de dos trabajos y elige tus habilidades.",
      },
      skills: ["job-search", "documents"],
      minutes: 15,
      scene: {
        you: {
          en: "You are playing Sam Rivera, who worked at Harborside Cafe. These facts are Sam's.",
          es: "Haces el papel de Sam Rivera, que trabajó en Harborside Cafe. Estos datos son de Sam.",
        },
        people: [],
        need: {
          en: "Make Sam's short résumé. A résumé is one page about your work: your jobs, what you did well, and your skills.",
          es: "Haz el currículum corto de Sam. Un currículum es una página sobre tu trabajo: tus empleos, lo que hiciste bien y tus habilidades.",
        },
      },
      reference: RESUME_FACTS,
      persona: JOB_SEEKER.name,
      takeaway: {
        en: "A first résumé is one page: contact, a short summary, one strong line for each job, and your skills.",
        es: "Un primer currículum es una página: contacto, un resumen corto, una línea fuerte para cada empleo y tus habilidades.",
      },
      guide: {
        skills: [
          { en: "Know the parts of a simple résumé", es: "Conocer las partes de un currículum sencillo" },
          { en: "Write a summary sentence about yourself", es: "Escribir una oración de resumen sobre ti" },
          { en: "Write one accomplishment that starts with an action word", es: "Escribir un logro que empieza con un verbo de acción" },
          { en: "Choose only the skills you really have", es: "Elegir solo las habilidades que de verdad tienes" },
        ],
        prepare: [
          { en: "Bring a simple one-page résumé to show the class.", es: "Trae un currículum sencillo de una página para mostrar a la clase." },
          { en: "Write action words on the board: ran, checked, trained, fixed.", es: "Escribe verbos de acción en la pizarra: manejé, revisé, capacité, arreglé." },
        ],
        stickingPoints: [
          { en: "Learners write as Sam Rivera. Sam's name, contact, and school head the page. The summary can be one short sentence (I am a shift lead at Harborside Cafe). Ask: what can Sam do well at work?", es: "Los estudiantes escriben como Sam Rivera. El nombre, contacto y estudios de Sam encabezan la página. El resumen puede ser una oración corta (Soy líder de turno en Harborside Cafe). Pregunta: ¿qué hace bien Sam en el trabajo?" },
          { en: "Each job needs its own line, at least three words (Trained new workers.). Copying a duty listed under the job is fine. The same line under both jobs is sent back. Ask: what did Sam do in this job that was different?", es: "Cada empleo necesita su propia línea, de al menos tres palabras (Entrené a trabajadores nuevos.). Copiar una tarea del empleo está bien. La misma línea en los dos empleos se regresa. Pregunta: ¿qué hizo Sam distinto en este empleo?" },
          { en: "Some learners check fewer than three skills. Ask: which of these have you practiced?", es: "Algunos marcan menos de tres habilidades. Pregunta: ¿cuáles de estas has practicado?" },
        ],
        followUp: [
          { en: "What jobs have you had, here or in another country? What did you do well?", es: "¿Qué trabajos has tenido, aquí o en otro país? ¿Qué hiciste bien?" },
          { en: "Who can read your résumé before you send it?", es: "¿Quién puede leer tu currículum antes de que lo envíes?" },
        ],
        peerHelp: {
          en: "A partner can suggest action words, but the learner writes the sentences and chooses the skills.",
          es: "Un compañero puede sugerir verbos de acción, pero el estudiante escribe las oraciones y elige las habilidades.",
        },
      },
    },
  },

  "interview-practice": {
    key: "interview-practice",
    built: true,
    label: { en: "Prepare for the interview", es: "Prepara la entrevista" },
    dispatch: {
      en: "Anita sent an interview invitation. Prepare four answers and a question of your own.",
      es: "Anita envió una invitación a una entrevista. Prepara cuatro respuestas y una pregunta tuya.",
    },
    skill: { en: "Answer common interview questions", es: "responder preguntas comunes de entrevista" },
    bookmarkLabel: "Interview",
    handoffCta: { en: "Open Mail", es: "Abrir Correo" },
    shiftMoment: {
      en: "Before HQ. The interview is scheduled.",
      es: "Antes de HQ. La entrevista está agendada.",
    },
    location: browser("Open Mail", "mail"),
    jobCardLine: { en: "Answer every interview question in a few sentences. Choose or write one question to ask the interviewer. Then click Save my preparation.", es: "Responde cada pregunta de la entrevista en unas oraciones. Elige o escribe una pregunta para la entrevistadora. Después haz clic en Guardar mi preparación." },
  },

  "job-offer": {
    key: "job-offer",
    built: true,
    label: { en: "Read and accept the offer", es: "Lee y acepta la oferta" },
    dispatch: {
      en: "The offer came from Anita. Find your start date, then reply that you accept.",
      es: "Llegó la oferta de Anita. Encuentra tu fecha de inicio y responde que aceptas.",
    },
    skill: { en: "Read an offer letter and accept it", es: "leer una carta de oferta y aceptarla" },
    bookmarkLabel: "Offer",
    handoffCta: { en: "Open Mail", es: "Abrir Correo" },
    shiftMoment: {
      en: "Before HQ. The offer is in your inbox.",
      es: "Antes de HQ. La oferta está en tu bandeja.",
    },
    location: browser("Open Mail", "mail"),
    jobCardLine: { en: "Read the offer letter and select the start date. Write a reply accepting the offer. Then send it.", es: "Lee la carta de oferta y selecciona la fecha de inicio. Escribe una respuesta para aceptar la oferta. Después envíala." },
  },

  "w4-form": {
    key: "w4-form",
    built: true,
    label: { en: "Fill out the W-4", es: "Llena el W-4" },
    dispatch: {
      en: "Practice the W-4, a new-hire tax form, for a pretend worker named Robin Avery.",
      es: "Practica el W-4, un formulario de impuestos para empleados nuevos, para una persona inventada, Robin Avery.",
    },
    skill: { en: "Fill out a W-4", es: "llenar un formulario W-4" },
    bookmarkLabel: "Onboarding",
    handoffCta: { en: "Open Mail", es: "Abrir Correo" },
    shiftMoment: {
      en: "Before HQ. HR sent the new-hire forms.",
      es: "Antes de HQ. RR. HH. envió los formularios.",
    },
    location: browser("Open Mail", "mail"),
    jobCardLine: { en: "Complete Robin’s W-4 using Robin’s facts. Choose the filing status and enter the total credits. Sign and date the form. Then click Submit W-4.", es: "Completa el W-4 de Robin con sus datos. Elige el estado civil tributario y escribe el total de créditos. Firma y fecha el formulario. Después haz clic en Enviar W-4." },
    lesson: {
      title: { en: "Fill out a W-4 tax form", es: "Llenar el formulario de impuestos W-4" },
      summary: {
        en: "Fill out a practice W-4 for a fictional new hire, then sign it and write the date.",
        es: "Llena un W-4 de práctica para una persona ficticia recién contratada, luego fírmalo y escribe la fecha.",
      },
      skills: ["forms"],
      minutes: 10,
      persona: "Robin Avery",
      scene: {
        you: {
          en: "You are practicing a new-hire tax form. You fill it out for a pretend person, not for you.",
          es: "Estás practicando un formulario de impuestos para empleados nuevos. Lo llenas para una persona inventada, no para ti.",
        },
        people: [
          {
            name: "Robin Avery",
            role: { en: "A pretend new worker", es: "Una persona recién contratada (inventada)" },
            who: { en: "Robin just got a job and needs to fill out a W-4 before the first paycheck.", es: "Robin acaba de conseguir trabajo y tiene que llenar un W-4 antes del primer pago." },
          },
        ],
        need: {
          en: "Fill out Robin's W-4. Read Robin's facts on your info card and choose what fits Robin. Then sign with Robin's name and write the date.",
          es: "Llena el W-4 de Robin. Lee los datos de Robin en tu tarjeta de información y elige lo que corresponde a Robin. Después firma con el nombre de Robin y escribe la fecha.",
        },
      },
      // Facts about Robin, not the answers: the learner decides the filing
      // status and credit amount from them.
      reference: [
        { label: { en: "Name", es: "Nombre" }, value: "Robin Avery" },
        { label: { en: "Married", es: "Casado/a" }, value: { en: "No", es: "No" } },
        { label: { en: "Children", es: "Hijos" }, value: { en: "None. Supports no one else.", es: "No tiene. No mantiene a nadie." } },
        { label: { en: "Other credits", es: "Otros créditos" }, value: { en: "None", es: "Ninguno" } },
        { label: { en: "Form date", es: "Fecha del formulario" }, value: { en: "10/01/2026", es: "10/01/2026 (1 de octubre)" } },
      ],
      takeaway: {
        en: "On your own W-4 at a real job, you choose what is true for you. You can change it later.",
        es: "En tu propio W-4 en un trabajo real, eliges lo que es verdad para ti. Lo puedes cambiar después.",
      },
      guide: {
        skills: [
          { en: "Know what a W-4 is for", es: "Saber para qué sirve un W-4" },
          { en: "Choose a filing status", es: "Elegir el estado civil para impuestos" },
          { en: "Enter the total credit amount", es: "Escribir el monto total de créditos" },
          { en: "Sign with a typed full name and write the date", es: "Firmar escribiendo el nombre completo y poner la fecha" },
        ],
        prepare: [
          { en: "Explain that a W-4 tells the job how much tax to take from each paycheck.", es: "Explica que el W-4 le dice al trabajo cuánto impuesto quitar de cada cheque." },
          { en: "Tell students the form is for a fictional person, Robin Avery. Robin is not married and has no children. Robin has no other credits. They use Robin’s filing status and $0 credit total, not their own information.", es: "Diles que el formulario es de una persona ficticia, Robin Avery. Robin no está casado/a y no tiene hijos. Robin no tiene otros créditos. Usan el estado civil de Robin y su total de créditos de $0, no su propia información." },
          { en: "Go over the three filing statuses in plain words: single, married filing jointly (a married couple), head of household (pays for a home for a child or family member).", es: "Repasa los tres estados civiles con palabras sencillas: soltero/a, casado/a declarando en conjunto (una pareja casada), cabeza de familia (paga una casa para un hijo o familiar)." },
        ],
        stickingPoints: [
          { en: "Some learners choose Head of household or Married. The card explains right away why that does not fit Robin. Ask: is Robin married? Does Robin pay for a home for a child?", es: "Algunos eligen Cabeza de familia o Casado/a. La tarjeta explica enseguida por qué no le corresponde a Robin. Pregunta: ¿Robin está casado/a? ¿Paga una casa para un hijo?" },
          { en: "Some learners type their own name as the signature. It must match the name on the form, Robin Avery. The empty box says Type the full name. Ask: whose form is this?", es: "Algunos escriben su propio nombre como firma. Debe ser igual al nombre del formulario, Robin Avery. La casilla vacía dice Escribe el nombre completo. Pregunta: ¿de quién es este formulario?" },
          { en: "The date is October 1, 2026, month first. 10/01/2026, 10/1/2026 and 10-01-2026 all pass. 01/10/2026 (day first) does not. Ask: which number is the month?", es: "La fecha es el 1 de octubre de 2026, con el mes primero. 10/01/2026, 10/1/2026 y 10-01-2026 son correctas. 01/10/2026 (el día primero) no. Pregunta: ¿cuál número es el mes?" },
          { en: "Step 3 is a dollar amount, not a head count. Robin has no dependent or other credits, so the total is $0; 0, $0.00 and zero are accepted.", es: "El Paso 3 es un monto en dólares, no un número de personas. Robin no tiene créditos por dependientes ni otros créditos, así que el total es $0; se aceptan 0, $0.00 y cero." },
        ],
        followUp: [
          { en: "What other forms might you fill out on your first day at a new job?", es: "¿Qué otros formularios podrías llenar tu primer día en un trabajo nuevo?" },
          { en: "Who can you ask for help with a tax form at work?", es: "¿A quién le puedes pedir ayuda con un formulario de impuestos en el trabajo?" },
        ],
        peerHelp: {
          en: "A partner can point to Robin's facts, but the learner decides and fills in each box.",
          es: "Un compañero puede señalar los datos de Robin, pero el estudiante decide y llena cada casilla.",
        },
      },
    },
  },

  "i9-section1": {
    key: "i9-section1",
    built: true,
    label: { en: "Fill out the I-9", es: "Llena el I-9" },
    dispatch: {
      en: "The I-9 Section 1. It says you're allowed to work in the U.S. Fill it in and sign.",
      es: "El I-9 Sección 1. Dice que tienes permiso para trabajar en EE. UU. Llénalo y firma.",
    },
    skill: { en: "Fill out I-9 Section 1", es: "llenar la Sección 1 del I-9" },
    bookmarkLabel: "Onboarding",
    handoffCta: { en: "Open Onboarding from the bookmarks", es: "Abre Documentos en los marcadores" },
    shiftMoment: {
      en: "Before HQ. Two forms to go.",
      es: "Antes de HQ. Faltan dos formularios.",
    },
    location: browser("Open Onboarding from the bookmarks"),
    jobCardLine: { en: "Complete Section 1 of the I-9 using the practice profile. Include the birth date, address, and work authorization status. Sign and date the form, then submit it.", es: "Completa la Sección 1 del I-9 con el perfil de práctica. Incluye la fecha de nacimiento, la dirección y el estado de autorización de trabajo. Firma y fecha el formulario; después envíalo." },
  },

  "direct-deposit": {
    key: "direct-deposit",
    built: true,
    label: { en: "Set up direct deposit", es: "Configura el depósito directo" },
    dispatch: {
      en: "Last form: direct deposit. You need your bank's routing number (9 digits) and your account number.",
      es: "Último formulario: depósito directo. Necesitas el número de ruta de tu banco (9 dígitos) y tu número de cuenta.",
    },
    skill: { en: "Set up direct deposit", es: "configurar el depósito directo" },
    bookmarkLabel: "Onboarding",
    handoffCta: { en: "Open Onboarding from the bookmarks", es: "Abre Documentos en los marcadores" },
    shiftMoment: {
      en: "Before HQ. Last form.",
      es: "Antes de HQ. Último formulario.",
    },
    location: browser("Open Onboarding from the bookmarks"),
    jobCardLine: { en: "Complete the direct deposit form using the practice bank details. Enter the bank name, routing number, account number, and account type. Then submit the form.", es: "Completa el formulario de depósito directo con los datos bancarios de práctica. Escribe el nombre del banco, el número de ruta, el número de cuenta y el tipo de cuenta. Después envía el formulario." },
    jobCardDoneLine: { en: "You completed the direct deposit form.", es: "Completaste el formulario de depósito directo." },
  },

  "office-drive": {
    key: "office-drive",
    built: true,
    label: { en: "Find the current file at HQ", es: "Encuentra el archivo actual en HQ" },
    dispatch: {
      en: "HQ Drive is nested. Search, then share the current version, view only.",
      es: "El Drive de HQ está anidado. Busca, luego comparte la versión actual, solo ver.",
    },
    skill: { en: "Search a nested drive for the right file version", es: "buscar en carpetas anidadas la versión correcta de un archivo" },
    bookmarkLabel: "Drive",
    handoffCta: { en: "Open Drive from the bookmarks", es: "Abre Drive en los marcadores" },
    shiftMoment: {
      en: "Tuesday at HQ. Chris needs the Q3 notes.",
      es: "Martes en HQ. Chris necesita las notas del T3.",
    },
    location: browser("Open Drive from the bookmarks"),
    jobCardLine: { en: "Find the current Q3 notes. Share the file with Chris with permission to view it without editing it.", es: "Busca las notas actuales del T3. Comparte el archivo con Chris con permiso para verlo sin editarlo." },
  },

  "multi-person-scheduling": {
    key: "multi-person-scheduling",
    built: true,
    label: { en: "Find a time that works for everyone", es: "Encuentra un horario que sirva para todos" },
    dispatch: {
      en: "Four calendars. One slot is open for all of them.",
      es: "Cuatro calendarios. Un hueco está libre para todos.",
    },
    skill: { en: "Find a meeting time across several calendars", es: "encontrar una hora de reunión entre varios calendarios" },
    bookmarkLabel: "Calendar",
    handoffCta: { en: "Open Calendar from the bookmarks", es: "Abre Calendar en los marcadores" },
    shiftMoment: {
      en: "Wednesday. Get everyone in one room.",
      es: "Miércoles. Junta a todos en una sala.",
    },
    location: browser("Open Calendar from the bookmarks"),
    jobCardLine: { en: "Compare everyone’s calendars. Select a time when everyone is available. Send the invitation to everyone.", es: "Compara los calendarios de todos. Selecciona una hora en que todos estén disponibles. Envía la invitación a todos." },
  },

  "video-call": {
    key: "video-call",
    built: true,
    label: { en: "Join the meeting you just booked", es: "Únete a la reunión que acabas de agendar" },
    dispatch: {
      en: "You are a few minutes late. Join muted. Ask in chat.",
      es: "Llegas unos minutos tarde. Entra en silencio. Pregunta en el chat.",
    },
    skill: { en: "Join a video meeting with workplace etiquette", es: "entrar a una videollamada con buenos modales de trabajo" },
    bookmarkLabel: "Zoom",
    handoffCta: { en: "Open Zoom from the bookmarks", es: "Abre Zoom en los marcadores" },
    shiftMoment: {
      en: "Wednesday. The meeting is starting.",
      es: "Miércoles. La reunión está empezando.",
    },
    location: browser("Open Zoom from the bookmarks"),
    jobCardLine: { en: "Join the meeting with your microphone muted. Turn on your camera. Send a chat message asking who will share the meeting notes. Keep your microphone muted.", es: "Entra a la reunión con el micrófono apagado. Enciende la cámara. Envía un mensaje en el chat para preguntar quién compartirá las notas de la reunión. Mantén el micrófono apagado." },
  },

  "expense-report": {
    key: "expense-report",
    built: true,
    label: { en: "Flag the expense with no receipt", es: "Marca el gasto sin recibo" },
    dispatch: {
      en: "Match the receipts. One row has none. Flag it before you send.",
      es: "Empareja los recibos. Una fila no tiene. Márcala antes de enviar.",
    },
    skill: { en: "Match receipts and notice a missing one", es: "emparejar recibos y notar cuál falta" },
    bookmarkLabel: "Sheets",
    handoffCta: { en: "Open Sheets from the bookmarks", es: "Abre Sheets en los marcadores" },
    shiftMoment: {
      en: "Thursday. The expense report is due.",
      es: "Jueves. Hay que entregar el informe de gastos.",
    },
    location: browser("Open Sheets from the bookmarks"),
    jobCardLine: { en: "Compare each expense with its receipt. Correct any amount that does not match and mark missing receipts. Enter the total for expenses with receipts. Then submit the report.", es: "Compara cada gasto con su recibo. Corrige los montos que no coincidan y marca los recibos que faltan. Escribe el total de los gastos con recibo. Después envía el reporte." },
    jobCardDoneLine: { en: "You submitted the expense report.", es: "Enviaste el reporte de gastos." },
  },

  "slide-deck": {
    key: "slide-deck",
    built: true,
    label: { en: "Present a three-slide deck", es: "Presenta un deck de tres diapositivas" },
    dispatch: {
      en: "Title, the expense total, one main point. Then present it.",
      es: "Título, el total de gastos, una idea. Luego preséntalo.",
    },
    skill: { en: "Build a short deck with a real number", es: "armar una presentación corta con un número real" },
    bookmarkLabel: "Slides",
    handoffCta: { en: "Open Slides from the bookmarks", es: "Abre Diapositivas en los marcadores" },
    shiftMoment: {
      en: "Friday. The team is waiting.",
      es: "Viernes. El equipo está esperando.",
    },
    location: browser("Open Slides from the bookmarks"),
    jobCardLine: { en: "Complete three slides: a title, the expense total, and a main point in a full sentence. Click Present. Then answer Chris’s question.", es: "Completa tres diapositivas: un título, el total de gastos y una idea principal en una oración completa. Haz clic en Presentar. Después contesta la pregunta de Chris." },
  },

  // ---- Act VII: Team Lead ----

  "meeting-minutes": {
    key: "meeting-minutes",
    built: true,
    label: { en: "Run the meeting start to finish", es: "Dirige la reunión de principio a fin" },
    dispatch: {
      en: "Agenda first, notes during, a follow-up with owners after.",
      es: "Agenda primero, notas durante, y un seguimiento con responsables después.",
    },
    skill: { en: "Run a meeting: agenda, notes, and a follow-up with owners", es: "dirigir una reunión: agenda, notas y seguimiento con responsables" },
    bookmarkLabel: "Meeting",
    handoffCta: { en: "Open Meeting from the bookmarks", es: "Abre Reunión en los marcadores" },
    shiftMoment: {
      en: "Monday. You run the room now.",
      es: "Lunes. Ahora tú diriges la sala.",
    },
    location: browser("Open Meeting from the bookmarks"),
    jobCardLine: { en: "Write an agenda with at least two items and take notes on the decisions. Select the final person responsible and day for each action. Send a follow-up with the actions, people, and dates.", es: "Escribe al menos dos puntos para tratar y toma notas de las decisiones. Selecciona el responsable y el día finales de cada acción. Envía un correo de seguimiento con las acciones, las personas y las fechas." },
  },

  "performance-review": {
    key: "performance-review",
    built: true,
    label: { en: "Write a fair review", es: "Escribe una evaluación justa" },
    dispatch: {
      en: "One real strength, one real area to grow. Honest and kind.",
      es: "Una fortaleza real, un área real para mejorar. Con honestidad y amabilidad.",
    },
    skill: { en: "Write a specific, constructive performance note", es: "escribir una nota de desempeño concreta y constructiva" },
    bookmarkLabel: "Review",
    handoffCta: { en: "Open Review from the bookmarks", es: "Abre Evaluación en los marcadores" },
    shiftMoment: {
      en: "Tuesday. A review is due.",
      es: "Martes. Hay una evaluación que entregar.",
    },
    location: browser("Open Forms from the bookmarks"),
    jobCardLine: { en: "Choose a fact from the profile and write a strength it supports. Write one area to improve and describe the improvement. Then click Submit the review.", es: "Elige un dato del perfil y escribe una fortaleza que ese dato demuestre. Escribe un área para mejorar y describe la mejora. Después haz clic en Enviar la evaluación." },
  },

  "ops-report-packet": {
    key: "ops-report-packet",
    built: true,
    label: { en: "Send the weekly report packet", es: "Envía el paquete del reporte semanal" },
    dispatch: {
      en: "A number, a calendar note, a summary. Sent as one packet.",
      es: "Un número, una nota del calendario, un resumen. Enviado como un solo paquete.",
    },
    skill: { en: "Combine a sheet number, a calendar note, and a summary into one packet", es: "juntar un número de hoja, una nota del calendario y un resumen en un solo paquete" },
    bookmarkLabel: "Report",
    handoffCta: { en: "Open Report from the bookmarks", es: "Abre Reporte en los marcadores" },
    shiftMoment: {
      en: "Thursday. The weekly report is due.",
      es: "Jueves. Hay que entregar el reporte semanal.",
    },
    location: browser("Open Report from the bookmarks"),
    jobCardLine: { en: "Check the weekly total in Sheets and the event in Calendar. Write a summary in Docs with the total, day, shift, and reason the event needs attention. Send the summary from Mail.", es: "Revisa el total semanal en Sheets y el evento en Calendar. Escribe en Docs un resumen con el total, el día, el turno y la razón por la que el evento necesita atención. Envía el resumen desde Correo." },
  },

  "portfolio-reflection": {
    key: "portfolio-reflection",
    built: true,
    label: { en: "Look back at the whole program", es: "Mira atrás en todo el programa" },
    dispatch: {
      en: "Every award, a few questions, and a summary that's yours to keep.",
      es: "Cada premio, unas preguntas, y un resumen que es tuyo para guardar.",
    },
    skill: { en: "Review everything I've learned and reflect on it", es: "repasar todo lo que aprendí y reflexionar sobre ello" },
    bookmarkLabel: "Recap",
    handoffCta: { en: "Open Recap from the bookmarks", es: "Abre Resumen en los marcadores" },
    shiftMoment: {
      en: "Friday. The last day of the program.",
      es: "Viernes. El último día del programa.",
    },
    location: browser("Open Recap from the bookmarks"),
    jobCardLine: { en: "Review your completed work. Answer all four reflection questions. Then click See my summary.", es: "Revisa el trabajo que completaste. Responde las cuatro preguntas de reflexión. Después haz clic en Ver mi resumen." },
  },
};

/** All task descriptors in registry order. */
export const TASK_LIST: TaskDescriptor[] = Object.values(TASKS);

/** Tasks configured with a reading pause (see `src/lib/read-pause.ts`). */
export const READ_PAUSE_TASK_KEYS: TaskKey[] = TASK_LIST.filter((t) => t.readPause).map((t) => t.key);

export function taskDescriptor(key: TaskKey): TaskDescriptor {
  return TASKS[key];
}
