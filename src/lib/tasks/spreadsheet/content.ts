import { mentionsAmount, parseMoney } from "@/lib/text-facts";
import { STORY_DAY_BY_LEVEL, mondayOf, monthDate, shortDate } from "@/lib/story-dates";
import type { EventIntroCopy, Lang, Lesson, Localized } from "@/lib/task-types";
import { openFileStep } from "../open-file-step";
import { fnName } from "../sheet-words";

export const EVENT_INTRO: Record<Lang, EventIntroCopy> = {
  en: {
    emoji: "📊",
    kicker: "Friday afternoon",
    headline: "This week's tips still need a total.",
    body: "Renata needs the number for payroll. Open the sheet, enter the slips, and send her the total.",
    cta: "Open Sheets",
  },
  es: {
    emoji: "📊",
    kicker: "Viernes por la tarde",
    headline: "Las propinas de esta semana todavía no tienen total.",
    body: "Renata necesita el número para la nómina. Abre la hoja, ingresa los recibos y envíale el total.",
    cta: "Abrir Sheets",
  },
};

export interface TipRow {
  key: string;
  /** As written in the sheet and on the slip. */
  day: string;
  /** The day in the learner's language, for a correction that names it. */
  dayName: Localized;
  given: number;
}

export const TIP_ROWS: TipRow[] = [
  { key: "mon", day: "Monday", dayName: { en: "Monday", es: "lunes" }, given: 42.5 },
  { key: "tue", day: "Tuesday", dayName: { en: "Tuesday", es: "martes" }, given: 38.0 },
  { key: "wed", day: "Wednesday", dayName: { en: "Wednesday", es: "miércoles" }, given: 51.25 },
  { key: "thu", day: "Thursday", dayName: { en: "Thursday", es: "jueves" }, given: 46.75 },
  { key: "fri", day: "Friday", dayName: { en: "Friday", es: "viernes" }, given: 63.0 },
];

/** The day as the sheet and the slip show it: "Monday" on the English screen, "Lunes" on the Spanish one. */
export function dayLabel(row: TipRow, lang: Lang): string {
  if (lang === "en") return row.day;
  return row.dayName.es.charAt(0).toUpperCase() + row.dayName.es.slice(1);
}

/** The sheet's column headings, in the screen's language like the rest of the data. */
export const SHEET_HEADERS: Record<Lang, { day: string; tips: string; total: string }> = {
  en: { day: "Day", tips: "Tips", total: "Total" },
  es: { day: "Día", tips: "Propinas", total: "Total" },
};

/** What the formula bar shows on the Total cell: =SUM(B2:B6), or =SUMA(B2:B6) in Spanish. */
export function totalFormula(lang: Lang, firstRow = 2, lastRow = 1 + TIP_ROWS.length): string {
  return `=${fnName("SUM", lang)}(B${firstRow}:B${lastRow})`;
}

/** Whether what the learner typed for a day is that day's slip amount. "$42.50", "42.5" and "42,50" all count. */
export function entryMatches(row: TipRow, typed: string): boolean {
  const n = parseMoney(typed);
  return n !== null && Math.abs(n - row.given) < 0.005;
}

/** The sum of every row - the sheet's total updates live as each cell is filled in. */
export const REAL_TOTAL = TIP_ROWS.reduce((sum, r) => sum + r.given, 0);

const money = (n: number) => `$${n.toFixed(2)}`;
export const REAL_TOTAL_LABEL = money(REAL_TOTAL);

export const SPREADSHEET_COPY: Record<Lang, {
  heading: string;
  helpBtn: string;
  langBtn: string;
  scenarioKicker: string;
  scenario: string;
  appName: string;
  sheetName: string;
  startNewHeading: string;
  blankLabel: string;
  templateBudget: string;
  templateSchedule: string;
  recentHeading: string;
  openedLabel: string;
  slipHeading: string;
  fillAllFirst: string;
  emailTotal: string;
  to: string;
  subjectLabel: string;
  subject: string;
  writeHere: string;
  startersLabel: string;
  send: string;
  discard: string;
  sentKicker: string;
  doneTitle: string;
  doneBody: string;
  badgeName: string;
  badgeWhere: string;
  tryAgain: string;
  backToDesk: string;
  lessonKicker: string;
  tipLabel: string;
  gotIt: string;
  askPerson: string;
}> = {
  en: {
    heading: "Sheets",
    helpBtn: "Help me with this step",
    langBtn: "Español",
    scenarioKicker: "Today's situation",
    scenario: "Renata asked you to enter this week's tip amounts into the shared tracking sheet, then email her the total so she can add it to this week's pay.",
    appName: "Sheets",
    sheetName: "Weekly Tip Tracker",
    startNewHeading: "Start a new spreadsheet",
    blankLabel: "Blank",
    templateBudget: "Budget",
    templateSchedule: "Schedule",
    recentHeading: "Recent spreadsheets",
    openedLabel: `Opened ${shortDate(mondayOf(STORY_DAY_BY_LEVEL.level6), "en")}`,
    slipHeading: "This week's tip slip",
    fillAllFirst: "Type the tips for all five days first.",
    emailTotal: "Email the total to Renata",
    to: "To",
    subjectLabel: "Subject",
    subject: "This week's tip total",
    writeHere: "Write your message here…",
    startersLabel: "Sentence starters",
    send: "Send",
    discard: "Back to the sheet",
    sentKicker: "Message sent",
    doneTitle: "You entered the numbers and sent the total.",
    doneBody: "You matched each amount to the right day. The sheet added them up. You sent that total to Renata. That is how a shared sheet should work.",
    badgeName: "Enter data and share a total",
    badgeWhere: "Counts toward: Office Ready · Food Service Ready",
    tryAgain: "Do it again",
    backToDesk: "Back to desktop",
    lessonKicker: "2-minute lesson",
    tipLabel: "Tip",
    gotIt: "Got it. Back to my task",
    askPerson: "Ask a person instead",
  },
  es: {
    heading: "Sheets",
    helpBtn: "Ayúdame con este paso",
    langBtn: "English",
    scenarioKicker: "La situación de hoy",
    scenario: "Renata te pidió ingresar las propinas de esta semana en la hoja compartida, y luego enviarle el total por correo para incluirlo en la nómina.",
    appName: "Sheets",
    sheetName: "Registro semanal de propinas",
    startNewHeading: "Iniciar una nueva hoja de cálculo",
    blankLabel: "En blanco",
    templateBudget: "Presupuesto",
    templateSchedule: "Horario",
    recentHeading: "Hojas de cálculo recientes",
    openedLabel: `Abierta el ${monthDate(mondayOf(STORY_DAY_BY_LEVEL.level6), "es")}`,
    slipHeading: "Tu papelito de propinas de esta semana",
    fillAllFirst: "Primero escribe las propinas de los cinco días.",
    emailTotal: "Enviar el total a Renata por correo",
    to: "Para",
    subjectLabel: "Asunto",
    subject: "El total de propinas de esta semana",
    writeHere: "Escribe tu mensaje aquí…",
    startersLabel: "Frases de ayuda",
    send: "Enviar",
    discard: "Volver a la hoja",
    sentKicker: "Mensaje enviado",
    doneTitle: "Ingresaste los números y enviaste el total.",
    doneBody: "Relacionaste cada cantidad con el día correcto, dejaste que la hoja los sumara, y le enviaste ese total a Renata. Así es como debe funcionar una hoja compartida.",
    badgeName: "Ingresar datos y compartir un total",
    badgeWhere: "Cuenta para: Oficina · Servicio de alimentos",
    tryAgain: "Hacerlo otra vez",
    backToDesk: "Volver al escritorio",
    lessonKicker: "Lección de 2 minutos",
    tipLabel: "Consejo",
    gotIt: "Entendido. Volver a mi tarea",
    askPerson: "Mejor preguntar a una persona",
  },
};

/** Names the day, and says what the slip shows, so the learner knows which box to fix. */
export function wrongEntryHint(row: TipRow, lang: Lang): string {
  const amount = money(row.given);
  return lang === "en"
    ? `Check ${row.dayName.en}. The slip says ${amount}.`
    : `Revisa el ${row.dayName.es}. El papel dice ${amount}.`;
}

/**
 * The email actually reports the sheet's real total, not just any number.
 * Lenient about formatting ($241.50, 241.5, 241) — matches any number in
 * the message within a cent of the real total.
 */
export function emailMentionsTotal(body: string): boolean { return mentionsAmount(body, REAL_TOTAL); }

export type TotalEmailProblem = "ok" | "empty" | "no-number" | "no-cents" | "wrong-number";

/**
 * What is wrong with the email, so the correction names that and nothing
 * else. "241" is the total without its cents, which is its own mistake; any
 * other number is not the sheet's total at all.
 */
export function totalEmailProblem(body: string): TotalEmailProblem {
  if (!body.trim()) return "empty";
  if (emailMentionsTotal(body)) return "ok";
  const numbers = body.match(/\d+(?:[.,]\d+)?/g) ?? [];
  if (numbers.length === 0) return "no-number";
  const whole = Math.floor(REAL_TOTAL);
  if (numbers.some((n) => Number(n) === whole || Number(n) === whole + 1)) return "no-cents";
  return "wrong-number";
}

export const TOTAL_EMAIL_HINT: Record<Exclude<TotalEmailProblem, "ok">, Localized> = {
  empty: {
    en: "Write a short message first. Even one sentence is fine.",
    es: "Primero escribe un mensaje corto. Una oración está bien.",
  },
  "no-number": {
    en: "Your message has no number. Write the total from the Total row of the sheet.",
    es: "Tu mensaje no tiene ningún número. Escribe el total de la fila Total de la hoja.",
  },
  "no-cents": {
    en: "Write the cents too. Copy the whole total from the Total row, with the numbers after the dot.",
    es: "Escribe también los centavos. Copia el total completo de la fila Total, con los números después del punto.",
  },
  "wrong-number": {
    en: "That number is not the total. Look at the Total row of the sheet and copy that number.",
    es: "Ese número no es el total. Mira la fila Total de la hoja y copia ese número.",
  },
};

/** Shown on the finish screen above the message the learner sent. */
export const SENT_LABELS: Record<Lang, { heading: string; total: string }> = {
  en: { heading: "What you sent", total: "Total on the sheet" },
  es: { heading: "Lo que enviaste", total: "Total en la hoja" },
};

export const STARTERS: Record<Lang, string[]> = {
  // Frames, not answers: the learner still reads the total off the sheet.
  en: [
    "Hi Renata, here's this week's tip total.",
    "The total from the sheet is $___.",
    "Let me know if you need anything else. Thank you.",
  ],
  es: [
    "Hola Renata, aquí está el total de propinas de esta semana.",
    "El total de la hoja es $___.",
    "Avísame si necesitas algo más. Gracias.",
  ],
};

export const LESSONS: Record<Lang, Lesson[]> = {
  en: [
    {
      t: "Entering numbers into a shared sheet",
      s: [
        "Match each amount to the right day. A shared sheet only helps if the numbers are right.",
        "Type carefully. A typo in a number is easy to miss later.",
        "Once everything's entered, the sheet adds it up for you automatically.",
      ],
      tip: "Take your time on the numbers. That is the part that matters here.",
    },
    {
      t: "Sharing a total by email",
      s: [
        "Say what the number is and what it's for, in one short sentence.",
        "You don't need to explain how you got it. Just the total is enough.",
        "Send it the same day you're asked, while the numbers are still fresh.",
      ],
      tip: "A short, clear message is easier for your lead to act on than a long one.",
    },
  ],
  es: [
    {
      t: "Ingresar números en una hoja compartida",
      s: [
        "Relaciona cada cantidad con el día al que pertenece. Una hoja compartida solo sirve si los números son correctos.",
        "Escribe con cuidado. Un error de tecleo en un número es fácil de pasar por alto después.",
        "Una vez que todo está ingresado, la hoja los suma automáticamente por ti.",
      ],
      tip: "Tómate tu tiempo con los números. Eso es lo que realmente importa aquí.",
    },
    {
      t: "Compartir un total por correo",
      s: [
        "Di cuál es el número y para qué es, en una oración corta.",
        "No necesitas explicar cómo lo obtuviste. El total es suficiente.",
        "Envíalo el mismo día que te lo pidan, mientras los números aún están frescos.",
      ],
      tip: "Un mensaje corto y claro es más fácil de usar para tu líder que uno largo.",
    },
  ],
};

/** The persistent "what to do right now" line, one per step of this job. */
export const RIGHT_NOW_LABEL: Localized = { en: "Right now", es: "Ahora mismo" };
export const RIGHT_NOW_STEPS: Localized[] = [
  openFileStep(SPREADSHEET_COPY, (c) => c.sheetName),
  {
    en: "Look at the paper slip. Type each day's tips in the Tips column.",
    es: "Mira el papelito. Escribe las propinas de cada día en la columna Propinas.",
  },
  {
    en: "The sheet added the total. Choose File → Email → Email collaborators.",
    es: "La hoja sumó el total. Elige Archivo → Correo electrónico → Enviar correo a colaboradores.",
  },
  {
    en: "Write Renata the total from the sheet. Then click Send.",
    es: "Escríbele a Renata el total de la hoja. Después haz clic en Enviar.",
  },
];
