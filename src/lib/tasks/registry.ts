import type { AppKey, TaskKey } from "@/lib/desktop-content";
import type { Localized } from "@/lib/task-types";
import type { LessonMeta } from "@/lib/lessons/types";
import { LESSON_PASSWORD } from "@/lib/tasks/account-recovery/content";

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
  /** The Job Card's green finish line. Falls back to the generic done copy. */
  jobCardDoneLine?: Localized;
  /** Makes this task a standalone classroom lesson at `/lessons/<key>`. */
  lesson?: LessonMeta;
}

/**
 * What a job-search lesson learner has done, so "your experience" means
 * something on screen. The job-posting answer key (`REQUIREMENTS[].met`)
 * matches these lines one for one.
 */
const JOB_SEEKER_FACTS: LessonMeta["reference"] = [
  { label: { en: "Past jobs", es: "Empleos anteriores" }, value: { en: "Harborside Cafe: Team Member, then Shift Lead", es: "Harborside Cafe: miembro del equipo, después líder de turno" } },
  { label: { en: "You talked with", es: "Hablaste con" }, value: { en: "Coworkers and managers, by email and in person", es: "Compañeros y gerentes, por correo y en persona" } },
  { label: { en: "Schedules", es: "Horarios" }, value: { en: "You read the schedule and fixed a problem in it", es: "Leíste el horario y arreglaste un problema" } },
  { label: { en: "Computer tools", es: "Herramientas" }, value: { en: "Email, calendars, spreadsheets", es: "Correo, calendarios, hojas de cálculo" } },
  { label: { en: "Numbers", es: "Números" }, value: { en: "You typed tips in a spreadsheet and sent the total", es: "Escribiste propinas en una hoja de cálculo y enviaste el total" } },
  { label: { en: "School", es: "Estudios" }, value: { en: "High school. No college degree.", es: "Secundaria. Sin título universitario." } },
];

const browser = (ctaLabel: string, tab?: string, section?: PortalSection): TaskLocation => ({
  appKey: "browser",
  ...(tab ? { tab } : {}),
  ...(section ? { section } : {}),
  ctaLabel,
});

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
    jobCardLine: { en: "Look around this computer.", es: "Conoce esta computadora." },
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
    handoffCta: { en: "Open Mail", es: "Abrir correo" },
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
    handoffCta: { en: "Open Mail", es: "Abrir correo" },
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
    handoffCta: { en: "Open Mail", es: "Abrir correo" },
    shiftMoment: {
      en: "Tuesday, 8:14 AM. Maria says welcome.",
      es: "Martes, 8:14 AM. Maria te da la bienvenida.",
    },
    location: browser("Open Mail", "mail"),
    jobCardLine: { en: "Maria said welcome. Write her back.", es: "Maria te dio la bienvenida. Contéstale." },
    jobCardDoneLine: { en: "Three replies sent. Day one is complete.", es: "Tres respuestas enviadas. Completaste el primer día." },
    lesson: {
      title: { en: "Reply to short work emails", es: "Responder correos cortos del trabajo" },
      summary: {
        en: "Read three short emails from a manager and a coworker, and write a reply to each one.",
        es: "Lee tres correos cortos de una gerente y un compañero, y responde a cada uno.",
      },
      skills: ["email"],
      minutes: 15,
      scene: {
        you: { en: "Today is your first day at Harborside Cafe.", es: "Hoy es tu primer día en Harborside Cafe." },
        people: [
          { name: "Maria Delgado", role: { en: "Your manager", es: "Tu gerente" } },
          { name: "Darnell Washington", role: { en: "A coworker. He works mornings too.", es: "Un compañero. También trabaja en las mañanas." } },
        ],
        need: {
          en: "You have 3 short emails, 2 from Maria and 1 from Darnell. Write a short answer to each one.",
          es: "Tienes 3 correos cortos, 2 de Maria y 1 de Darnell. Escribe una respuesta corta a cada uno.",
        },
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
          { en: "Some learners open an email from a vendor first. Ask: who sent this email? Is it Maria?", es: "Algunos abren primero el correo de un proveedor. Pregunta: ¿quién envió este correo? ¿Es Maria?" },
          { en: "The second email asks them to confirm 10 AM. A reply with no or can't does not pass. Ask: what does Maria want to know?", es: "El segundo correo pide confirmar las 10 a. m. Una respuesta con no o no puedo no se acepta. Pregunta: ¿qué quiere saber Maria?" },
          { en: "The third email is from Darnell. The reply must say the bag goes on the shelf under the counter. Ask: where will you put your bag?", es: "El tercer correo es de Darnell. La respuesta debe decir que la bolsa va en el estante debajo del mostrador. Pregunta: ¿dónde vas a dejar tu bolsa?" },
        ],
        followUp: [
          { en: "Who sends you emails or texts that need an answer? How fast do you answer?", es: "¿Quién te envía correos o mensajes que necesitan respuesta? ¿Qué tan rápido contestas?" },
          { en: "How do you tell your boss that you will be at work on time?", es: "¿Cómo le dices a tu jefe que vas a llegar al trabajo a tiempo?" },
        ],
        peerHelp: {
          en: "A partner can read the email out loud, but the learner writes and sends the reply.",
          es: "Un compañero puede leer el correo en voz alta, pero el estudiante escribe y envía la respuesta.",
        },
      },
    },
  },

  "mail-attach": {
    key: "mail-attach",
    built: true,
    label: { en: "Send the report with the file", es: "Envía el reporte con el archivo" },
    dispatch: {
      en: "Maria needs the July safety report. Read what she asks, then attach it.",
      es: "Maria necesita el reporte de julio. Lee qué pide y adjúntalo.",
    },
    skill: { en: "Send a reply with a file attached", es: "responder con un archivo adjunto" },
    bookmarkLabel: "Mail",
    handoffCta: { en: "Next: Send the report", es: "Siguiente: Envía el reporte" },
    shiftMoment: { en: "Wednesday, 10:10 AM. She needs a file.", es: "Miércoles, 10:10 AM. Necesita un archivo." },
    location: browser("Open Mail", "mail"),
    jobCardLine: { en: "Maria needs the July safety report.", es: "Maria necesita el reporte de julio." },
    jobCardDoneLine: { en: "Sent, with the file.", es: "Enviado, con el archivo." },
    lesson: {
      title: { en: "Attach a file to an email", es: "Adjuntar un archivo a un correo" },
      summary: {
        en: "Read what the manager needs, then reply with the right PDF file attached.",
        es: "Lee lo que necesita la gerente y luego responde con el archivo PDF correcto adjunto.",
      },
      skills: ["email", "files"],
      minutes: 10,
      scene: {
        you: { en: "You work at Harborside Cafe.", es: "Trabajas en Harborside Cafe." },
        people: [{ name: "Maria Delgado", role: { en: "Your manager", es: "Tu gerente" } }],
        need: {
          en: "Maria sent you an email. She needs a report. The report is a file on your computer. You will send it to her in an email.",
          es: "Maria te envió un correo. Necesita un informe. El informe es un archivo en tu computadora. Se lo vas a enviar en un correo.",
        },
      },
      guide: {
        skills: [
          { en: "Read an email to find what someone needs and when", es: "Leer un correo para saber qué necesita alguien y para cuándo" },
          { en: "Choose the right file from Downloads", es: "Elegir el archivo correcto en Descargas" },
          { en: "Attach a file to a reply", es: "Adjuntar un archivo a una respuesta" },
          { en: "Check that the file is attached before you send", es: "Revisar que el archivo esté adjunto antes de enviar" },
        ],
        prepare: [
          { en: "Ask who has sent a photo or a document by email or text.", es: "Pregunta quién ya envió una foto o un documento por correo o por mensaje." },
          { en: "Explain that an attachment is a file that goes with the email.", es: "Explica que un archivo adjunto es un archivo que va con el correo." },
        ],
        stickingPoints: [
          { en: "Some learners open Maria's older welcome email. Ask: which email is about the safety report?", es: "Algunos abren el correo de bienvenida anterior de Maria. Pregunta: ¿cuál correo habla del reporte de seguridad?" },
          { en: "Some learners pick the June report or the shift swap form. Ask: what month did Maria ask for?", es: "Algunos eligen el reporte de junio o el formulario de cambio de turno. Pregunta: ¿qué mes pidió Maria?" },
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
      },
    },
  },

  schedule: {
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
    key: "timeclock",
    built: true,
    label: { en: "Clock in for the day", es: "Marca tu entrada del día" },
    dispatch: {
      en: "You got here at 7. Clock in, then check the time.",
      es: "Llegaste a las 7. Marca tu entrada y revisa la hora.",
    },
    skill: { en: "Check your hours and speak up", es: "revisar mis horas y avisar cuando algo está mal" },
    bookmarkLabel: "Portal",
    handoffCta: { en: "Next: Clock in", es: "Siguiente: Marcar entrada" },
    shiftMoment: { en: "Friday, 8:15 AM.", es: "Viernes, 8:15 AM." },
    location: browser("Open Portal", "portal", "timeclock"),
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
    jobCardLine: {
      en: "Your first stub is here. Open it and check net pay and hours.",
      es: "Ya está tu primer recibo. Ábrelo y revisa el pago neto y las horas.",
    },
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
    jobCardLine: {
      en: "Maria has to leave early. Write a short note about the shift for her to read.",
      es: "Maria tiene que irse temprano. Escríbele una nota corta del turno para que la lea.",
    },
  },

  "mail-etiquette": {
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
    key: "call-out-sick",
    built: true,
    label: { en: "Tell Maria you can't come in", es: "Dile a Maria que no puedes ir" },
    dispatch: {
      en: "You're sick and you're on at 10. Write Maria now.",
      es: "Estás enfermo y entras a las 10. Escríbele a Maria ya.",
    },
    skill: { en: "Tell my manager I can't come in", es: "avisarle a mi gerente que no puedo ir" },
    bookmarkLabel: "Mail",
    handoffCta: { en: "Next: Tell Maria", es: "Siguiente: Avísale a Maria" },
    shiftMoment: { en: "Monday, 6:12 AM. You feel sick.", es: "Lunes, 6:12 AM. Te sientes mal." },
    location: browser("Open Mail", "mail"),
  },

  "account-recovery": {
    key: "account-recovery",
    built: true,
    label: { en: "Get back into a locked account", es: "Recupera una cuenta bloqueada" },
    dispatch: {
      en: "You're signed out. Get back in before your shift.",
      es: "Tu sesión se cerró. Vuelve a entrar antes de tu turno.",
    },
    skill: { en: "Get back into a locked account", es: "recuperar una cuenta bloqueada" },
    bookmarkLabel: "Sign In",
    handoffCta: { en: "Next: Sign back in", es: "Siguiente: Vuelve a entrar" },
    shiftMoment: {
      en: "Wednesday morning. You're signed out.",
      es: "Miércoles por la mañana. Cerraste sesión.",
    },
    jobCardLine: {
      en: "Sign back in. Use the code from your phone.",
      es: "Vuelve a entrar. Usa el código de tu teléfono.",
    },
    location: browser("Open Sign In", "account-recovery"),
    lesson: {
      title: { en: "Sign in with a text code", es: "Iniciar sesión con un código de texto" },
      summary: {
        en: "Sign in to a work account, find the real code in your texts, and type it in.",
        es: "Inicia sesión en una cuenta de trabajo, busca el código correcto en tus mensajes y escríbelo.",
      },
      skills: ["accounts"],
      minutes: 5,
      scene: {
        you: { en: "You work at Harborside Cafe. Your work account signed you out.", es: "Trabajas en Harborside Cafe. Tu cuenta del trabajo cerró tu sesión." },
        people: [],
        need: {
          en: "Sign in again with your password. Then the account sends a code to your phone in a text message. Type that code to finish.",
          es: "Vuelve a entrar con tu contraseña. Después, la cuenta te envía un código al teléfono en un mensaje de texto. Escribe ese código para terminar.",
        },
      },
      reference: [
        { label: { en: "Email", es: "Correo" }, value: "you@harborsidecafe.com" },
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
          { en: "Some learners pick the ad or the coworker's text. Ask: who sent this text?", es: "Algunos eligen el anuncio o el mensaje del compañero. Pregunta: ¿quién envió este mensaje?" },
          { en: "Some learners type the whole message. The box only takes the 6 numbers.", es: "Algunos escriben todo el mensaje. La casilla solo acepta los 6 números." },
          { en: "The password is on the info card, and capital letters count. Point to the big H.", es: "La contraseña está en la tarjeta de información, y las mayúsculas cuentan. Señala la H mayúscula." },
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

  incident: {
    key: "incident",
    built: true,
    label: { en: "File an incident report", es: "Llena un reporte de incidente" },
    dispatch: {
      en: "Someone slipped. Write it up before you forget.",
      es: "Alguien se resbaló. Escríbelo antes de que se te olvide.",
    },
    skill: { en: "Write an incident report", es: "escribir un reporte de incidente" },
    bookmarkLabel: "Forms",
    handoffCta: { en: "Next: Open Forms", es: "Siguiente: Abrir Formularios" },
    shiftMoment: { en: "Tuesday. The floor is busy.", es: "Martes. El piso está lleno." },
    location: browser("Open Forms", "incident"),
  },

  handbook: {
    key: "handbook",
    built: true,
    label: { en: "Look something up", es: "Busca una respuesta" },
    dispatch: {
      en: "They need an answer. The handbook is on your desk.",
      es: "Necesitan una respuesta. El manual está en tu escritorio.",
    },
    skill: { en: "Look something up when you feel rushed", es: "buscar información aunque tenga prisa" },
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
      en: "The meeting is at the same time as your shift. Pick a time that works.",
      es: "La reunión es a la misma hora que tu turno. Elige una hora que funcione.",
    },
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
        en: "A meeting is on a day you do not work. Check your shifts, then reply with a better time.",
        es: "Una reunión es un día que no trabajas. Revisa tus turnos y responde con un horario mejor.",
      },
      skills: ["scheduling"],
      minutes: 10,
      scene: {
        you: { en: "You are a shift lead at Harborside Cafe.", es: "Eres líder de turno en Harborside Cafe." },
        people: [{ name: "Renata Silva", role: { en: "Your manager", es: "Tu gerente" } }],
        need: {
          en: "Renata invited you to a meeting on Wednesday, August 26. You do not work that day. Ask her for a different time.",
          es: "Renata te invitó a una reunión el miércoles 26 de agosto. Ese día no trabajas. Pídele otro horario.",
        },
      },
      reference: [
        { label: { en: "Meeting", es: "Reunión" }, value: { en: "Wed, Aug 26, 9:00 AM", es: "Miér., 26 de agosto, 9:00 AM" } },
        { label: { en: "Your next shift", es: "Tu próximo turno" }, value: { en: "Thu, Aug 27, 10 AM to 6 PM", es: "Jue., 27 de agosto, 10 AM a 6 PM" } },
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
          { en: "Some learners click Yes right away. Ask: do you work on Wednesday, August 26?", es: "Algunos hacen clic en Sí enseguida. Pregunta: ¿trabajas el miércoles 26 de agosto?" },
          { en: "Some learners click one of their work shifts instead of the meeting. Ask them to find the event called Weekly Lead Huddle.", es: "Algunos hacen clic en uno de sus turnos en vez de la reunión. Pídeles buscar el evento que se llama Weekly Lead Huddle." },
          { en: "Some learners click No or Maybe. Renata still needs the meeting. Ask: what time can you suggest?", es: "Algunos hacen clic en No o Quizá. Renata todavía necesita la reunión. Pregunta: ¿qué horario puedes proponer?" },
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

  files: {
    key: "files",
    built: true,
    label: { en: "Share a file the right way", es: "Comparte un archivo de la forma correcta" },
    dispatch: {
      en: "They need the file. Share the file, not the whole folder.",
      es: "Necesitan el archivo. Comparte el archivo, no toda la carpeta.",
    },
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
        en: "Find this week's schedule in Drive, rename it, and share it with a new coworker who can only view it.",
        es: "Busca el horario de esta semana en Drive, cámbiale el nombre y compártelo con un compañero nuevo que solo lo puede ver.",
      },
      skills: ["files"],
      minutes: 10,
      scene: {
        you: { en: "You are a shift lead at Harborside Cafe.", es: "Eres líder de turno en Harborside Cafe." },
        people: [
          { name: "Renata Silva", role: { en: "Your manager", es: "Tu gerente" } },
          { name: "Jordan Kim", role: { en: "New coworker. Starts today.", es: "Compañero nuevo. Empieza hoy." } },
        ],
        need: {
          en: "Jordan needs this week's work schedule. It is a file in the cafe's shared Drive. Renata wants the file to have a clear name. Jordan can look at it but not change it.",
          es: "Jordan necesita el horario de trabajo de esta semana. Es un archivo en el Drive compartido del café. Renata quiere que el archivo tenga un nombre claro. Jordan lo puede ver, pero no cambiar.",
        },
      },
      reference: [
        { label: { en: "This week", es: "Esta semana" }, value: { en: "Week of Aug 24", es: "Semana del 24 de agosto" } },
        { label: { en: "New file name", es: "Nombre nuevo" }, value: "schedule-week-of-aug-24" },
      ],
      guide: {
        skills: [
          { en: "Find the right file by its date", es: "Encontrar el archivo correcto por su fecha" },
          { en: "Rename a file with a set pattern", es: "Cambiar el nombre de un archivo con un formato dado" },
          { en: "Share a file with one person", es: "Compartir un archivo con una persona" },
          { en: "Choose view access instead of edit access", es: "Elegir acceso para ver en vez de acceso para editar" },
        ],
        prepare: [
          { en: "Ask who has shared a photo or a file from their phone.", es: "Pregunta quién ya compartió una foto o un archivo desde su teléfono." },
          { en: "Explain the difference: view means look only, and edit means change.", es: "Explica la diferencia: ver es solo mirar, y editar es cambiar." },
        ],
        stickingPoints: [
          { en: "Some learners click last week's schedule. Ask: what date is on this file? What date is this week?", es: "Algunos hacen clic en el horario de la semana pasada. Pregunta: ¿qué fecha tiene este archivo? ¿Qué fecha es esta semana?" },
          { en: "Some learners type a different name. The name must be schedule-week-of-aug-24. Ask them to compare their name with the example, one word at a time.", es: "Algunos escriben otro nombre. El nombre debe ser schedule-week-of-aug-24. Pídeles comparar su nombre con el ejemplo, palabra por palabra." },
          { en: "Some learners choose Can edit. Ask: does Jordan need to change the schedule, or only look at it?", es: "Algunos eligen Puede editar. Pregunta: ¿Jordan necesita cambiar el horario, o solo mirarlo?" },
        ],
        followUp: [
          { en: "Who do you share files or photos with? Should they be able to change them?", es: "¿Con quién compartes archivos o fotos? ¿Deben poder cambiarlos?" },
          { en: "How do you name files on your phone or computer so you can find them later?", es: "¿Cómo nombras los archivos en tu teléfono o computadora para encontrarlos después?" },
        ],
        peerHelp: {
          en: "A partner can help find the date column, but the learner types the name and clicks Share.",
          es: "Un compañero puede ayudar a encontrar la columna de la fecha, pero el estudiante escribe el nombre y hace clic en Compartir.",
        },
      },
    },
  },

  "mail-send-link": {
    key: "mail-send-link",
    built: true,
    label: { en: "Send Jordan the link", es: "Envíale el enlace a Jordan" },
    dispatch: {
      en: "You shared the file. Now email Jordan the link, not an attached copy.",
      es: "Compartiste el archivo. Ahora envíale el enlace a Jordan por correo, no una copia adjunta.",
    },
    skill: { en: "Send a link to a file instead of a copy", es: "enviar el enlace de un archivo en vez de una copia" },
    bookmarkLabel: "Mail",
    handoffCta: { en: "Open Mail", es: "Abrir correo" },
    shiftMoment: {
      en: "Monday, 10:15 AM. Jordan needs the schedule.",
      es: "Lunes, 10:15 AM. Jordan necesita el horario.",
    },
    location: browser("Open Mail", "mail"),
    // Jordan's first card. Names the role inline the way mail-etiquette does
    // for Darnell — no act intro introduces a peer, only managers.
    jobCardLine: {
      en: "Email the new lead, Jordan, the schedule link.",
      es: "Envíale el enlace del horario a Jordan, el nuevo líder.",
    },
  },

  spreadsheet: {
    key: "spreadsheet",
    built: true,
    label: { en: "Enter data and share a total", es: "Escribe los números y envía el total" },
    dispatch: {
      en: "Type this week's tips. Then send Renata the total.",
      es: "Escribe las propinas de esta semana. Después envíale el total a Renata.",
    },
    jobCardLine: {
      en: "Type this week's tips. Then send Renata the total.",
      es: "Escribe las propinas de esta semana. Después envíale el total a Renata.",
    },
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
      summary: {
        en: "Type five days of tip amounts into a shared sheet, then email the manager the total.",
        es: "Escribe las propinas de cinco días en una hoja compartida y luego envía el total a la gerente por correo.",
      },
      skills: ["spreadsheets", "email"],
      minutes: 10,
      scene: {
        you: { en: "You are a server at Harborside Cafe.", es: "Atiendes mesas en Harborside Cafe." },
        people: [{ name: "Renata Silva", role: { en: "Your manager", es: "Tu gerente" } }],
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
          { en: "Some learners type an amount on the wrong day, or leave out the numbers after the dot. Ask: which day is this slip for? Read the amount to me.", es: "Algunos escriben una cantidad en el día equivocado, o no escriben los números después del punto. Pregunta: ¿de qué día es este recibo? Léeme la cantidad." },
          { en: "Some learners try to send the email before all five days are filled. Ask: are all five days done?", es: "Algunos quieren enviar el correo antes de llenar los cinco días. Pregunta: ¿ya llenaste los cinco días?" },
          { en: "Some learners write I sent it with no number. The email must say the total from the sheet. Ask: what is the total?", es: "Algunos escriben Ya lo envié sin el número. El correo debe decir el total de la hoja. Pregunta: ¿cuál es el total?" },
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
    key: "make-a-copy",
    built: true,
    label: { en: "Copy a view-only template", es: "Copia una plantilla de solo ver" },
    dispatch: {
      en: "The template is view only. Copy it before you type.",
      es: "La plantilla es de solo ver. Cópiala antes de escribir.",
    },
    skill: { en: "Copy a view-only file before you type", es: "copiar un archivo de solo lectura antes de escribir" },
    bookmarkLabel: "Sheets",
    handoffCta: { en: "Open Sheets from the bookmarks", es: "Abre Sheets en los marcadores" },
    shiftMoment: { en: "Monday. Renata shared a template.", es: "Lunes. Renata compartió una plantilla." },
    location: browser("Open Sheets from the bookmarks"),
  },

  "status-report": {
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
      en: "The hours total looks fine. The formula does not.",
      es: "El total de horas se ve bien. La fórmula no.",
    },
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
      summary: {
        en: "The hours total looks right, but the formula leaves out one person. Fix the formula and email the correct total.",
        es: "El total de horas parece correcto, pero la fórmula deja fuera a una persona. Corrige la fórmula y envía el total correcto por correo.",
      },
      skills: ["spreadsheets"],
      minutes: 12,
      scene: {
        you: { en: "You are a shift lead at Harborside Cafe.", es: "Eres líder de turno en Harborside Cafe." },
        people: [
          { name: "Renata Silva", role: { en: "Your manager", es: "Tu gerente" } },
          { name: "Casey Brooks", role: { en: "Works on your crew", es: "Trabaja en tu equipo" } },
        ],
        need: {
          en: "A spreadsheet adds up the hours your crew worked this week. Renata uses the total for pay. The formula forgot one person.",
          es: "Una hoja de cálculo suma las horas que trabajó tu equipo esta semana. Renata usa el total para los pagos. A la fórmula le falta una persona.",
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
          { en: "Write a SUM formula on the board. Explain that H2:H6 means row 2 to row 6.", es: "Escribe una fórmula SUM en la pizarra. Explica que H2:H6 quiere decir de la fila 2 a la fila 6." },
          { en: "Ask students to count the names on the sheet before they click anything.", es: "Pide a los estudiantes contar los nombres de la hoja antes de hacer clic." },
        ],
        stickingPoints: [
          { en: "Many learners trust the total and do not open the formula. Ask: which rows does the formula add? Is every name in those rows?", es: "Muchos confían en el total y no abren la fórmula. Pregunta: ¿qué filas suma la fórmula? ¿Están todos los nombres en esas filas?" },
          { en: "Some learners fix SUM but not AVERAGE. Both need H2:H6. Ask: did you check the other formula too?", es: "Algunos corrigen SUM pero no AVERAGE. Las dos necesitan H2:H6. Pregunta: ¿revisaste también la otra fórmula?" },
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
    key: "priority-call",
    built: true,
    label: { en: "Three things at once", es: "Tres cosas a la vez" },
    dispatch: {
      en: "Compare the three situations. Choose a priority and a supported reason.",
      es: "Compara las tres situaciones. Elige una prioridad y un motivo basado en los datos.",
    },
    skill: { en: "Handle three asks at once", es: "atender tres peticiones a la vez" },
    bookmarkLabel: "Floor",
    handoffCta: { en: "Open Floor from the bookmarks", es: "Abre Floor en los marcadores" },
    shiftMoment: {
      en: "Thursday, 3:40 PM. It's busy out on the floor.",
      es: "Jueves, 3:40 PM. Hay mucho movimiento en el local.",
    },
    location: browser("Open Floor from the bookmarks"),
  },

  "college-offer": {
    key: "college-offer",
    built: true,
    label: { en: "Read and accept the offer", es: "Lee y acepta la oferta" },
    dispatch: {
      en: "Harborside will pay for a class. Read the offer, then make it fit your week.",
      es: "Harborside pagará una clase. Lee la oferta y haz que quepa en tu semana.",
    },
    skill: { en: "Accept an offer and put it on a full calendar", es: "aceptar una oferta y acomodarla en un calendario lleno" },
    bookmarkLabel: "Offer",
    handoffCta: { en: "Open Offer from the bookmarks", es: "Abre Oferta en los marcadores" },
    shiftMoment: {
      en: "Monday. The offer is in your inbox.",
      es: "Lunes. La oferta está en tu bandeja.",
    },
    location: browser("Open Offer from the bookmarks"),
    jobCardLine: { en: "Read the offer. Then make it fit.", es: "Lee la oferta. Luego haz que quepa." },
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
    jobCardLine: { en: "Find what is over budget.", es: "Encuentra qué se pasó del presupuesto." },
    lesson: {
      title: { en: "Find what went over budget", es: "Encontrar qué se pasó del presupuesto" },
      summary: {
        en: "Read an IF formula and a bar chart to find the category that went over budget, then tell the manager by how much.",
        es: "Lee una fórmula IF y un gráfico de barras para encontrar la categoría que se pasó del presupuesto, y dile a la gerente por cuánto.",
      },
      skills: ["spreadsheets"],
      minutes: 10,
      scene: {
        you: { en: "You are a shift lead at Harborside Cafe.", es: "Eres líder de turno en Harborside Cafe." },
        people: [{ name: "Renata Silva", role: { en: "Your manager", es: "Tu gerente" } }],
        need: {
          en: "The cafe plans how much money to spend each week. That plan is the budget. One kind of cost went over the plan. Renata wants to know which one, and by how much.",
          es: "El café planea cuánto dinero gastar cada semana. Ese plan es el presupuesto. Un tipo de gasto se pasó del plan. Renata quiere saber cuál, y por cuánto.",
        },
      },
      guide: {
        skills: [
          { en: "Read the budget and actual columns", es: "Leer las columnas de presupuesto y real" },
          { en: "Read an IF formula that says over or under", es: "Leer una fórmula IF que dice sobre o bajo" },
          { en: "Match a table to a bar chart", es: "Relacionar una tabla con un gráfico de barras" },
          { en: "Write the category and the amount in an email", es: "Escribir la categoría y la cantidad en un correo" },
        ],
        prepare: [
          { en: "Explain budget, what we plan to spend, and actual, what we really spent.", es: "Explica presupuesto, lo que pensamos gastar, y real, lo que de verdad gastamos." },
          { en: "Write one example on the board: budget $100, actual $120, over by $20.", es: "Escribe un ejemplo en la pizarra: presupuesto $100, real $120, se pasó por $20." },
        ],
        stickingPoints: [
          { en: "Some learners try to write the email before they open the formula. They must click the status cell that says over first. Ask: which cell says over?", es: "Algunos quieren escribir el correo antes de abrir la fórmula. Primero deben hacer clic en la celda de estado que dice sobre. Pregunta: ¿qué celda dice sobre?" },
          { en: "Some learners name Labor but give no amount, or write $2,850. The amount over is $450. Ask: how much more than the budget did they spend?", es: "Algunos nombran Mano de obra pero no dan la cantidad, o escriben $2,850. Se pasó por $450. Pregunta: ¿cuánto más que el presupuesto gastaron?" },
        ],
        followUp: [
          { en: "Do you plan how much to spend each week or each month? What happens when you spend more?", es: "¿Planeas cuánto gastar cada semana o cada mes? ¿Qué pasa cuando gastas más?" },
          { en: "Who do you tell at home or at work when there is not enough money?", es: "¿A quién le dices en casa o en el trabajo cuando no alcanza el dinero?" },
        ],
        peerHelp: {
          en: "A partner can help compare the two columns, but the learner clicks the cells and writes the email.",
          es: "Un compañero puede ayudar a comparar las dos columnas, pero el estudiante hace clic en las celdas y escribe el correo.",
        },
      },
    },
  },

  "reply-all": {
    key: "reply-all",
    built: true,
    label: { en: "Reply to the right people", es: "Responde a las personas correctas" },
    dispatch: {
      en: "HQ asked a question. Not everyone on the thread needs your answer.",
      es: "HQ hizo una pregunta. No todos en el hilo necesitan tu respuesta.",
    },
    skill: { en: "Choose reply instead of reply-all", es: "elegir responder en vez de responder a todos" },
    bookmarkLabel: "Mail",
    handoffCta: { en: "Open Mail from the bookmarks", es: "Abre Correo en los marcadores" },
    shiftMoment: {
      en: "Friday. A long thread from HQ.",
      es: "Viernes. Un hilo largo de HQ.",
    },
    location: browser("Open Mail from the bookmarks"),
    jobCardLine: { en: "Reply to who asked. Not everyone.", es: "Responde a quien preguntó. No a todos." },
  },

  enrollment: {
    key: "enrollment",
    built: true,
    label: { en: "Apply before the deadline", es: "Aplica antes de la fecha" },
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
    jobCardLine: { en: "Find the deadline. Then apply.", es: "Encuentra la fecha. Luego aplica." },
  },

  "appointment-scheduling": {
    key: "appointment-scheduling",
    built: true,
    label: { en: "Book the visit without a clash", es: "Agenda la cita sin un choque" },
    dispatch: {
      en: "A patient asked for a time that is already taken. Offer the open slot.",
      es: "Un paciente pidió una hora que ya está ocupada. Ofrece el hueco libre.",
    },
    skill: { en: "Book an appointment without double-booking", es: "agendar una cita sin encimarla con otra" },
    bookmarkLabel: "Front Desk",
    handoffCta: { en: "Open Front Desk from the bookmarks", es: "Abre Recepción en los marcadores" },
    shiftMoment: {
      en: "Monday. The morning list is in.",
      es: "Lunes. Ya está la lista de la mañana.",
    },
    location: browser("Open Front Desk from the bookmarks"),
    jobCardLine: { en: "Spot the clash. Offer the open slot.", es: "Mira el choque. Ofrece el hueco." },
    lesson: {
      title: { en: "Book an appointment at an open time", es: "Dar una cita en un horario libre" },
      summary: {
        en: "A patient wants a time that is already taken. Find the open time, choose it, and send a confirmation.",
        es: "Una paciente quiere una hora que ya está ocupada. Busca la hora libre, elígela y envía una confirmación.",
      },
      skills: ["scheduling", "workplace-systems"],
      minutes: 8,
      scene: {
        you: { en: "You work at the front desk of Harborside Health, a clinic.", es: "Trabajas en la recepción de Harborside Health, una clínica." },
        people: [{ name: "Maya Ansari", role: { en: "A patient. She called the clinic.", es: "Una paciente. Llamó a la clínica." } }],
        need: {
          en: "Maya wants an appointment today at 10:00. Someone already has 10:00. Find a time that is free and tell her.",
          es: "Maya quiere una cita hoy a las 10:00. Otra persona ya tiene las 10:00. Busca una hora libre y díselo.",
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
          { en: "Ask who has made an appointment by phone at a clinic or an office.", es: "Pregunta quién ya hizo una cita por teléfono en una clínica o una oficina." },
          { en: "Explain that booked means someone already has that time, and open means it is free.", es: "Explica que ocupada quiere decir que alguien ya tiene esa hora, y libre quiere decir que nadie la tiene." },
        ],
        stickingPoints: [
          { en: "Some learners click 10:00 because the patient asked for it. Ask: does someone already have that time?", es: "Algunos hacen clic en las 10:00 porque la paciente la pidió. Pregunta: ¿alguien ya tiene esa hora?" },
          { en: "In the list of reasons, some learners pick that the clinic is closed. Ask them to look at the 10:00 row again and read what it says.", es: "En la lista de razones, algunos eligen que la clínica está cerrada. Pídeles mirar otra vez la fila de las 10:00 y leer lo que dice." },
          { en: "Some learners write See you soon with no time. The message must say 11:30. Ask: what time should Maya come in?", es: "Algunos escriben Nos vemos sin la hora. El mensaje debe decir 11:30. Pregunta: ¿a qué hora debe venir Maya?" },
        ],
        followUp: [
          { en: "When you call to make an appointment, what do you ask? What do you write down?", es: "Cuando llamas para hacer una cita, ¿qué preguntas? ¿Qué anotas?" },
          { en: "What do you say when the time you want is not free?", es: "¿Qué dices cuando la hora que quieres no está libre?" },
        ],
        peerHelp: {
          en: "A partner can read the schedule out loud, but the learner picks the time and writes the message.",
          es: "Un compañero puede leer la agenda en voz alta, pero el estudiante elige la hora y escribe el mensaje.",
        },
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
    jobCardLine: { en: "Find the amount and the date.", es: "Encuentra el monto y la fecha." },
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
    jobCardLine: { en: "File it. Choose the verified recipient, then reply to Sam.", es: "Archívalo. Elige al destinatario verificado y responde a Sam." },
  },

  coursework: {
    key: "coursework",
    built: true,
    label: { en: "Submit the assignment on time", es: "Entrega la tarea a tiempo" },
    dispatch: {
      en: "The syllabus has a due date. Read it. Write a short answer. Submit.",
      es: "El temario tiene una fecha. Léelo. Escribe una respuesta corta. Entrégala.",
    },
    skill: { en: "Read a syllabus and submit on time", es: "leer un temario y entregar a tiempo" },
    bookmarkLabel: "Coursework",
    handoffCta: { en: "Open Coursework from the bookmarks", es: "Abre Curso en los marcadores" },
    shiftMoment: {
      en: "Thursday. Something is due tonight.",
      es: "Jueves. Algo se entrega esta noche.",
    },
    location: browser("Open Coursework from the bookmarks"),
    jobCardLine: { en: "Read the due date. Then submit.", es: "Lee la fecha. Luego entrega." },
    lesson: {
      title: { en: "Find a due date and submit an assignment", es: "Encontrar la fecha de entrega y entregar una tarea" },
      summary: {
        en: "Read a class syllabus, choose the right due date, and write a short reply to a customer complaint.",
        es: "Lee el temario de una clase, elige la fecha de entrega correcta y escribe una respuesta corta a la queja de un cliente.",
      },
      skills: ["workplace-systems"],
      minutes: 8,
      scene: {
        you: { en: "You take a writing class at Bunker Hill Community College.", es: "Tomas una clase de escritura en Bunker Hill Community College." },
        people: [],
        need: {
          en: "You have homework this week. Find the day it is due. Then write your answer and turn it in.",
          es: "Tienes una tarea esta semana. Busca el día de entrega. Después escribe tu respuesta y entrégala.",
        },
      },
      guide: {
        skills: [
          { en: "Find the due date on a syllabus", es: "Encontrar la fecha de entrega en un temario" },
          { en: "Choose the right date from a list", es: "Elegir la fecha correcta de una lista" },
          { en: "Write a short reply that says what you will do next", es: "Escribir una respuesta corta que dice qué vas a hacer" },
          { en: "Submit an assignment online", es: "Entregar una tarea en línea" },
        ],
        prepare: [
          { en: "Ask who has taken an online class or used a school website.", es: "Pregunta quién ya tomó una clase en línea o usó un sitio web de una escuela." },
          { en: "Explain that a due date has a day and a time, and late work is not accepted.", es: "Explica que la fecha de entrega tiene un día y una hora, y que no se acepta trabajo tarde." },
        ],
        stickingPoints: [
          { en: "Some learners pick Thursday or Saturday from the list. Ask: what day does the syllabus say?", es: "Algunos eligen jueves o sábado en la lista. Pregunta: ¿qué día dice el temario?" },
          { en: "Some learners write only OK or Thank you. The reply must say what they will do next. Ask: what will you do about the complaint?", es: "Algunos escriben solo OK o Gracias. La respuesta debe decir qué van a hacer. Pregunta: ¿qué vas a hacer con la queja?" },
        ],
        followUp: [
          { en: "Where do you see due dates in your life? School, bills, forms for work.", es: "¿Dónde ves fechas de entrega en tu vida? La escuela, las cuentas, los formularios del trabajo." },
          { en: "What do you do when you know you will be late with something?", es: "¿Qué haces cuando sabes que vas a entregar algo tarde?" },
        ],
        peerHelp: {
          en: "A partner can read the syllabus out loud, but the learner chooses the date and writes the reply.",
          es: "Un compañero puede leer el temario en voz alta, pero el estudiante elige la fecha y escribe la respuesta.",
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
    jobCardLine: { en: "Find the charge that does not match.", es: "Encuentra el cargo que no cuadra." },
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
    jobCardLine: { en: "Pick the source you would cite.", es: "Elige la fuente que citarías." },
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
    jobCardLine: { en: "Stay polite. Do not confirm.", es: "Sé amable. No confirmes." },
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
    jobCardLine: { en: "Read the posting. Do you fit?", es: "Lee el anuncio. ¿Encajas?" },
    jobCardDoneLine: { en: "You fit. Next: the application.", es: "Encajas. Sigue: la solicitud." },
    lesson: {
      title: { en: "Compare a job posting to your experience", es: "Comparar un anuncio de empleo con tu experiencia" },
      summary: {
        en: "Read a job posting, check the requirements you meet, and write one line about why you are a good fit.",
        es: "Lee un anuncio de empleo, marca los requisitos que cumples y escribe una línea sobre por qué eres una buena opción.",
      },
      skills: ["job-search"],
      minutes: 10,
      scene: {
        you: { en: "You are looking for a new job. You worked at Harborside Cafe.", es: "Estás buscando un trabajo nuevo. Trabajaste en Harborside Cafe." },
        people: [{ name: "Anita Raman", role: { en: "Director at Harborside HQ. She sent you the job post.", es: "Directora en Harborside HQ. Te envió el anuncio." } }],
        need: {
          en: "Read the job post. Compare what the job asks for with your experience on your info card.",
          es: "Lee el anuncio. Compara lo que pide el trabajo con tu experiencia en tu tarjeta de información.",
        },
      },
      reference: JOB_SEEKER_FACTS,
      guide: {
        skills: [
          { en: "Read the parts of a job posting: the role, the pay, the requirements", es: "Leer las partes de un anuncio de empleo: el puesto, el pago, los requisitos" },
          { en: "Match requirements to your own experience", es: "Comparar los requisitos con tu propia experiencia" },
          { en: "Know that you can apply without every requirement", es: "Saber que puedes aplicar aunque no cumplas todos los requisitos" },
          { en: "Write one sentence about why you fit the job", es: "Escribir una oración sobre por qué eres buena opción para el trabajo" },
        ],
        prepare: [
          { en: "Ask who has looked at a job ad, online or on paper.", es: "Pregunta quién ya miró un anuncio de empleo, en línea o en papel." },
          { en: "Explain that most people who get hired do not meet every requirement in the posting.", es: "Explica que la mayoría de las personas contratadas no cumplen todos los requisitos del anuncio." },
        ],
        stickingPoints: [
          { en: "Some learners check the Bachelor's degree box. This job does not need one. Ask: do you have a degree? Does this job need it?", es: "Algunos marcan el título universitario. Este trabajo no lo necesita. Pregunta: ¿tienes un título? ¿Este trabajo lo necesita?" },
          { en: "Some learners check fewer than three boxes. Ask them to read each line and say what they did in the simulator that matches it.", es: "Algunos marcan menos de tres puntos. Pídeles leer cada línea y decir qué hicieron en el simulador que coincide." },
          { en: "The fit line needs at least four words. Ask: what is one thing you did that fits this job?", es: "La línea necesita al menos cuatro palabras. Pregunta: ¿qué es algo que hiciste que encaja con este trabajo?" },
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
    jobCardLine: { en: "Fill each section. Then submit.", es: "Llena cada sección. Luego envía." },
    jobCardDoneLine: { en: "Application sent.", es: "Solicitud enviada." },
    lesson: {
      title: { en: "Fill out a job application", es: "Llenar una solicitud de empleo" },
      summary: {
        en: "Fill out an online job application: check your work history, choose your availability, and write why you want the job.",
        es: "Llena una solicitud de empleo en línea: revisa tu historial de trabajo, elige tu disponibilidad y escribe por qué quieres el trabajo.",
      },
      skills: ["job-search", "forms"],
      minutes: 10,
      scene: {
        you: { en: "You are looking for a new job. You worked at Harborside Cafe.", es: "Estás buscando un trabajo nuevo. Trabajaste en Harborside Cafe." },
        people: [],
        need: {
          en: "You found a job you like. Fill out the online application.",
          es: "Encontraste un trabajo que te gusta. Llena la solicitud en línea.",
        },
      },
      reference: JOB_SEEKER_FACTS,
      guide: {
        skills: [
          { en: "Read each section of an application", es: "Leer cada sección de una solicitud" },
          { en: "Check work history that is already filled in", es: "Revisar el historial de trabajo que ya está lleno" },
          { en: "Choose full time, part time, or either one", es: "Elegir tiempo completo, medio tiempo o cualquiera de los dos" },
          { en: "Write two or three sentences about why you want the job", es: "Escribir dos o tres oraciones sobre por qué quieres el trabajo" },
        ],
        prepare: [
          { en: "Ask who has filled out a job application, on paper or online.", es: "Pregunta quién ya llenó una solicitud de empleo, en papel o en línea." },
          { en: "Explain full time and part time, and ask students which one they want.", es: "Explica tiempo completo y medio tiempo, y pregunta a los estudiantes cuál quieren." },
        ],
        stickingPoints: [
          { en: "Some learners click submit before they choose their availability. Ask: can you work full time, part time, or both?", es: "Algunos hacen clic en Enviar solicitud antes de elegir su disponibilidad. Pregunta: ¿puedes trabajar tiempo completo, medio tiempo o los dos?" },
          { en: "Some learners write only I need a job. The answer needs at least six words. Ask: what do you like about this job, and what can you bring to it?", es: "Algunos escriben solo Necesito un trabajo. La respuesta necesita al menos seis palabras. Pregunta: ¿qué te gusta de este trabajo y qué puedes aportar?" },
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
    jobCardLine: { en: "Summary, two roles, your skills.", es: "Resumen, dos puestos, tus habilidades." },
    jobCardDoneLine: { en: "Résumé saved.", es: "Currículum guardado." },
    lesson: {
      title: { en: "Write a one-page résumé", es: "Escribir un currículum de una página" },
      summary: {
        en: "Write a short summary, add one accomplishment for each of two jobs, and choose your skills.",
        es: "Escribe un resumen corto, agrega un logro para cada uno de dos trabajos y elige tus habilidades.",
      },
      skills: ["job-search", "documents"],
      minutes: 15,
      scene: {
        you: { en: "You are looking for a new job. You worked at Harborside Cafe.", es: "Estás buscando un trabajo nuevo. Trabajaste en Harborside Cafe." },
        people: [],
        need: {
          en: "Make a short résumé. A résumé is one page about your work: your jobs, what you did well, and your skills.",
          es: "Haz un currículum corto. Un currículum es una página sobre tu trabajo: tus empleos, lo que hiciste bien y tus habilidades.",
        },
      },
      reference: JOB_SEEKER_FACTS,
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
          { en: "Some learners write only a few words in the summary. It needs at least six words. Ask: what can you do well at work?", es: "Algunos escriben pocas palabras en el resumen. Necesita al menos seis palabras. Pregunta: ¿qué haces bien en el trabajo?" },
          { en: "Some learners fill in only one accomplishment. Each of the two jobs needs one, with at least four words. Ask: what did you do well in this job?", es: "Algunos llenan solo un logro. Cada uno de los dos trabajos necesita uno, con al menos cuatro palabras. Pregunta: ¿qué hiciste bien en este trabajo?" },
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
    label: { en: "Do the interview", es: "Haz la entrevista" },
    dispatch: {
      en: "Anita has four questions. Answer each one, then ask one of your own.",
      es: "Anita tiene cuatro preguntas. Responde cada una, luego haz una tuya.",
    },
    skill: { en: "Answer common interview questions", es: "responder preguntas comunes de entrevista" },
    bookmarkLabel: "Interview",
    handoffCta: { en: "Open Interview from the bookmarks", es: "Abre Entrevista en los marcadores" },
    shiftMoment: {
      en: "Before HQ. The interview is scheduled.",
      es: "Antes de HQ. La entrevista está agendada.",
    },
    location: browser("Open Interview from the bookmarks"),
    jobCardLine: { en: "Answer each question. Then ask one.", es: "Responde cada pregunta. Luego haz una." },
    jobCardDoneLine: { en: "Interview done.", es: "Entrevista terminada." },
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
    handoffCta: { en: "Open Offer from the bookmarks", es: "Abre Oferta en los marcadores" },
    shiftMoment: {
      en: "Before HQ. The offer is in your inbox.",
      es: "Antes de HQ. La oferta está en tu bandeja.",
    },
    location: browser("Open Offer from the bookmarks"),
    jobCardLine: { en: "Find the start date. Then accept.", es: "Encuentra la fecha de inicio. Luego acepta." },
    jobCardDoneLine: { en: "Offer accepted.", es: "Oferta aceptada." },
  },

  "w4-form": {
    key: "w4-form",
    built: true,
    label: { en: "Fill out the W-4", es: "Llena el W-4" },
    dispatch: {
      en: "First new-hire form: the W-4. It sets your tax withholding. Pick a status, sign, date.",
      es: "Primer formulario de nuevo empleado: el W-4. Fija tu retención de impuestos. Elige un estado, firma, fecha.",
    },
    skill: { en: "Fill out a W-4", es: "llenar un formulario W-4" },
    bookmarkLabel: "Onboarding",
    handoffCta: { en: "Open Onboarding from the bookmarks", es: "Abre Documentos en los marcadores" },
    shiftMoment: {
      en: "Before HQ. HR sent the new-hire forms.",
      es: "Antes de HQ. RR. HH. envió los formularios.",
    },
    location: browser("Open Onboarding from the bookmarks"),
    jobCardLine: { en: "W-4: status, sign, date.", es: "W-4: estado, firma, fecha." },
    jobCardDoneLine: { en: "W-4 submitted.", es: "W-4 enviado." },
    lesson: {
      title: { en: "Fill out a W-4 tax form", es: "Llenar el formulario de impuestos W-4" },
      summary: {
        en: "Fill out a practice W-4 for a fictional new hire, then sign it and write the date.",
        es: "Llena un W-4 de práctica para una persona ficticia recién contratada, luego fírmalo y escribe la fecha.",
      },
      skills: ["forms"],
      minutes: 10,
      scene: {
        you: {
          en: "You are practicing a new-hire tax form. You fill it out for a pretend person, not for you.",
          es: "Estás practicando un formulario de impuestos para empleados nuevos. Lo llenas para una persona inventada, no para ti.",
        },
        people: [{ name: "Robin Avery", role: { en: "A pretend new worker", es: "Un empleado nuevo inventado" } }],
        need: {
          en: "Fill out Robin's W-4. Copy Robin's facts from your info card. Then sign with Robin's name and write the date.",
          es: "Llena el W-4 de Robin. Copia los datos de Robin de tu tarjeta de información. Después firma con el nombre de Robin y escribe la fecha.",
        },
      },
      reference: [
        { label: { en: "Name", es: "Nombre" }, value: "Robin Avery" },
        { label: { en: "Filing status", es: "Estado civil" }, value: { en: "Single", es: "Soltero/a" } },
        { label: { en: "Dependents (children)", es: "Dependientes (hijos)" }, value: "0" },
        { label: { en: "Today's date", es: "Fecha de hoy" }, value: "10/01/2026" },
      ],
      guide: {
        skills: [
          { en: "Know what a W-4 is for", es: "Saber para qué sirve un W-4" },
          { en: "Choose a filing status", es: "Elegir el estado civil para impuestos" },
          { en: "Enter the number of dependents", es: "Escribir el número de dependientes" },
          { en: "Sign with a typed full name and write the date", es: "Firmar escribiendo el nombre completo y poner la fecha" },
        ],
        prepare: [
          { en: "Explain that a W-4 tells the job how much tax to take from each paycheck.", es: "Explica que el W-4 le dice al trabajo cuánto impuesto quitar de cada cheque." },
          { en: "Tell students the form is for a fictional person, Robin Avery. They copy the details from the box at the top, not their own information.", es: "Diles que el formulario es de una persona ficticia, Robin Avery. Copian los datos del cuadro de arriba, no sus propios datos." },
        ],
        stickingPoints: [
          { en: "Some learners type their own name as the signature. It must match the name on the form, Robin Avery. Ask: whose form is this?", es: "Algunos escriben su propio nombre como firma. Debe ser igual al nombre del formulario, Robin Avery. Pregunta: ¿de quién es este formulario?" },
          { en: "Some learners write the date in a different way. It must be 10/01/2026, as in the details box. Ask them to copy it exactly.", es: "Algunos escriben la fecha de otra forma. Debe ser 10/01/2026, como en el cuadro de datos. Pídeles copiarla exactamente." },
          { en: "Some learners leave dependents empty. If there are none, the answer is 0. Ask: does Robin have children or other people to support?", es: "Algunos dejan vacíos los dependientes. Si no hay, la respuesta es 0. Pregunta: ¿Robin tiene hijos u otras personas que mantiene?" },
        ],
        followUp: [
          { en: "What other forms might you fill out on your first day at a new job?", es: "¿Qué otros formularios podrías llenar tu primer día en un trabajo nuevo?" },
          { en: "Who can you ask for help with a tax form at work?", es: "¿A quién le puedes pedir ayuda con un formulario de impuestos en el trabajo?" },
        ],
        peerHelp: {
          en: "A partner can point to the details box, but the learner fills in each box.",
          es: "Un compañero puede señalar el cuadro de datos, pero el estudiante llena cada casilla.",
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
    jobCardLine: { en: "I-9: name, birth date, status, sign.", es: "I-9: nombre, fecha de nacimiento, estado, firma." },
    jobCardDoneLine: { en: "I-9 submitted.", es: "I-9 enviado." },
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
    jobCardLine: { en: "Routing number is 9 digits.", es: "El número de ruta tiene 9 dígitos." },
    jobCardDoneLine: { en: "Direct deposit set up. You're ready for day one.", es: "Depósito directo listo. Estás listo para el primer día." },
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
      en: "Monday at HQ. Chris needs the Q3 notes.",
      es: "Lunes en HQ. Chris necesita las notas del T3.",
    },
    location: browser("Open Drive from the bookmarks"),
    jobCardLine: { en: "Find the current file. Then share it.", es: "Encuentra el archivo actual. Luego compártelo." },
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
    jobCardLine: { en: "Find the slot open for everyone.", es: "Encuentra el hueco libre para todos." },
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
    jobCardLine: { en: "Join muted. Ask in chat.", es: "Entra en silencio. Pregunta en el chat." },
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
    jobCardLine: { en: "Match the receipts. Flag what is missing.", es: "Empareja los recibos. Marca lo que falta." },
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
    jobCardLine: { en: "Three slides. Then present.", es: "Tres diapositivas. Luego presenta." },
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
    jobCardLine: { en: "Agenda, notes, follow-up.", es: "Agenda, notas, seguimiento." },
    jobCardDoneLine: { en: "The follow-up is sent.", es: "El seguimiento está enviado." },
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
    jobCardLine: { en: "Choose a profile fact. Write one strength and one area to grow.", es: "Elige un dato del perfil. Escribe una fortaleza y un área para mejorar." },
    jobCardDoneLine: { en: "The review is submitted.", es: "La evaluación está enviada." },
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
    jobCardLine: { en: "Four apps. One packet.", es: "Cuatro apps. Un paquete." },
    jobCardDoneLine: { en: "The packet is sent.", es: "El paquete está enviado." },
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
    jobCardLine: { en: "Look back. Then write it down.", es: "Mira atrás. Luego escríbelo." },
    jobCardDoneLine: { en: "Your summary is ready.", es: "Tu resumen está listo." },
  },
};

/** All task descriptors in registry order. */
export const TASK_LIST: TaskDescriptor[] = Object.values(TASKS);

export function taskDescriptor(key: TaskKey): TaskDescriptor {
  return TASKS[key];
}
