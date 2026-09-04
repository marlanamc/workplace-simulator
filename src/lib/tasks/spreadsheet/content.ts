import type { EventIntroCopy, Lang, Lesson, Localized } from "@/lib/task-types";

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
  day: string;
  given: number;
}

export const TIP_ROWS: TipRow[] = [
  { key: "mon", day: "Monday", given: 42.5 },
  { key: "tue", day: "Tuesday", given: 38.0 },
  { key: "wed", day: "Wednesday", given: 51.25 },
  { key: "thu", day: "Thursday", given: 46.75 },
  { key: "fri", day: "Friday", given: 63.0 },
];

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
    openedLabel: "Opened Aug 21",
    slipHeading: "This week's tip slips",
    fillAllFirst: "Fill in all five days first.",
    emailTotal: "Email the total to Renata",
    to: "To",
    subjectLabel: "Subject",
    subject: "This week's tip total",
    writeHere: "Write your message here…",
    startersLabel: "Sentence starters",
    send: "Send",
    discard: "Discard",
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
    openedLabel: "Abierta el 21 de agosto",
    slipHeading: "Los recibos de propinas de esta semana",
    fillAllFirst: "Primero completa los cinco días.",
    emailTotal: "Enviar el total a Renata por correo",
    to: "Para",
    subjectLabel: "Asunto",
    subject: "El total de propinas de esta semana",
    writeHere: "Escribe tu mensaje aquí…",
    startersLabel: "Frases de ayuda",
    send: "Enviar",
    discard: "Descartar",
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

export const WRONG_ENTRY_HINT: Record<Lang, string> = {
  en: "That doesn't match the slip for that day. Check the amount again.",
  es: "Eso no coincide con el recibo de ese día. Revisa la cantidad de nuevo.",
};

export const STARTERS: Record<Lang, string[]> = {
  en: [
    "Hi Renata, here's this week's tip total.",
    `The sheet's total comes to ${REAL_TOTAL_LABEL}.`,
    "Let me know if you need anything else. Thank you.",
  ],
  es: [
    "Hola Renata, aquí está el total de propinas de esta semana.",
    `El total de la hoja es ${REAL_TOTAL_LABEL}.`,
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
  {
    en: "Open this week's tips sheet.",
    es: "Abre la hoja de propinas de esta semana.",
  },
  {
    en: "Enter each slip, then read the total.",
    es: "Ingresa cada recibo y luego lee el total.",
  },
  {
    en: "Email Renata the total.",
    es: "Envíale el total a Renata por correo.",
  },
];
