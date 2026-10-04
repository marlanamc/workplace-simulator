import type { EventIntroCopy, Lang, Lesson, Localized } from "@/lib/task-types";
import { mentionsAmount } from "@/lib/text-facts";
import { CORRECT_WEEK_TOTAL, CREW_WEEK_SHEET, SHORT_WEEK_TOTAL } from "../crew-week";
import { openFileStep } from "../open-file-step";
import { fnName, fnPattern } from "../sheet-words";

export const EVENT_INTRO: Record<Lang, EventIntroCopy> = {
  en: {
    emoji: "🧮",
    kicker: "Friday. Hours are due.",
    headline: "The total looks fine, but the formula is not.",
    body: "Renata runs payroll from this sheet. Check that the Hours total counts everyone on the crew.",
    cta: "Open the sheet",
  },
  es: {
    emoji: "🧮",
    kicker: "Viernes. Hay que entregar las horas.",
    headline: "El total se ve bien, pero la fórmula no.",
    body: "Renata hace la nómina con esta hoja. Revisa que el total de Horas cuente a todo el equipo.",
    cta: "Abrir la hoja",
  },
};

export const WRONG_SUM_FORMULA = "=SUM(H2:H5)";
export const RIGHT_SUM_FORMULA = "=SUM(H2:H6)";
export const AVERAGE_FORMULA = "=AVERAGE(H2:H6)";

/** The formulas as this screen's language shows them (=SUMA, =PROMEDIO in Spanish). */
export const wrongSumFormula = (lang: Lang) => `=${fnName("SUM", lang)}(H2:H5)`;
export const rightSumFormula = (lang: Lang) => `=${fnName("SUM", lang)}(H2:H6)`;
export const averageFormula = (lang: Lang) => `=${fnName("AVERAGE", lang)}(H2:H6)`;

/** "Off" in the crew sheet's Saturday cell, in the screen's language. */
export const OFF_LABEL: Localized = { en: "Off", es: "Libre" };

export const FORMULA_CHECK_COPY: Record<Lang, {
  helpBtn: string;
  appName: string;
  sheetName: string;
  startNewHeading: string;
  blankLabel: string;
  templateBudget: string;
  templateSchedule: string;
  recentHeading: string;
  openedLabel: string;
  noteHeading: string;
  noteBody: string;
  hoursHeader: string;
  nameHeader: string;
  totalLabel: string;
  averageLabel: string;
  emailCta: string;
  fixFirst: string;
  to: string;
  subjectLabel: string;
  subject: string;
  writeHere: string;
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
    helpBtn: "Help me with this step",
    appName: "Sheets",
    sheetName: CREW_WEEK_SHEET.en,
    startNewHeading: "Start a new spreadsheet",
    blankLabel: "Blank",
    templateBudget: "Budget",
    templateSchedule: "Schedule",
    recentHeading: "Recent spreadsheets",
    openedLabel: "Opened today",
    noteHeading: "Renata's note",
    noteBody: "Please check the Hours total before I do payroll. Does the formula count everyone on the crew?",
    hoursHeader: "Hours",
    nameHeader: "Name",
    totalLabel: "Total",
    averageLabel: "Average",
    emailCta: "Email Renata the corrected total",
    fixFirst: "The total still stops before row 6. Casey is in row 6. Change H5 to H6.",
    to: "To",
    subjectLabel: "Subject",
    subject: "Corrected week hours",
    writeHere: "Write your message here…",
    send: "Send",
    discard: "Back to the sheet",
    sentKicker: "Message sent",
    doneTitle: "You fixed the range, not just the number.",
    doneBody: "The total looked fine, but the formula was skipping Casey. You opened it, fixed the rows, and sent Renata the real total.",
    badgeName: "Fix a formula range",
    badgeWhere: "Counts toward: Shift Supervisor",
    tryAgain: "Do it again",
    backToDesk: "Back to desktop",
    lessonKicker: "2-minute lesson",
    tipLabel: "Tip",
    gotIt: "Got it. Back to my task",
    askPerson: "Ask a person instead",
  },
  es: {
    helpBtn: "Ayúdame con este paso",
    appName: "Sheets",
    sheetName: CREW_WEEK_SHEET.es,
    startNewHeading: "Iniciar una nueva hoja de cálculo",
    blankLabel: "En blanco",
    templateBudget: "Presupuesto",
    templateSchedule: "Horario",
    recentHeading: "Hojas de cálculo recientes",
    openedLabel: "Abierta hoy",
    noteHeading: "Nota de Renata",
    noteBody: "Por favor revisa el total de Horas antes de hacer la nómina. ¿La fórmula cuenta a todo el equipo?",
    hoursHeader: "Horas",
    nameHeader: "Nombre",
    totalLabel: "Total",
    averageLabel: "Promedio",
    emailCta: "Enviar a Renata el total corregido",
    fixFirst: "El total todavía se detiene antes de la fila 6. Casey está en la fila 6. Cambia H5 por H6.",
    to: "Para",
    subjectLabel: "Asunto",
    subject: "Horas de la semana corregidas",
    writeHere: "Escribe tu mensaje aquí…",
    send: "Enviar",
    discard: "Volver a la hoja",
    sentKicker: "Mensaje enviado",
    doneTitle: "Arreglaste el rango, no solo el número.",
    doneBody: "El total se veía bien, pero la fórmula estaba dejando fuera a Casey. La abriste, corregiste las filas y le enviaste a Renata el total real.",
    badgeName: "Corregir el rango de una fórmula",
    badgeWhere: "Cuenta para: Shift Supervisor",
    tryAgain: "Hacerlo otra vez",
    backToDesk: "Volver al escritorio",
    lessonKicker: "Lección de 2 minutos",
    tipLabel: "Consejo",
    gotIt: "Entendido. Volver a mi tarea",
    askPerson: "Mejor preguntar a una persona",
  },
};

export const EMPTY_EMAIL_HINT: Record<Lang, string> = {
  en: "Write a short message first. Even one sentence is fine.",
  es: "Primero escribe un mensaje corto. Una oración está bien.",
};

export const WRONG_EMAIL_HINT: Record<Lang, string> = {
  en: "Tell Renata the new total from the sheet, and that one person was missing.",
  es: "Dile a Renata el total nuevo de la hoja, y que faltaba una persona.",
};

export const STARTERS: Record<Lang, string[]> = {
  // Frames, not answers: the learner reads the total and the name off the sheet.
  en: [
    "Hi Renata, the new hours total is ___.",
    "The formula was missing ___. I fixed it.",
    "Thank you.",
  ],
  es: [
    "Hola Renata, el total nuevo de horas es ___.",
    "A la fórmula le faltaba ___. Ya la corregí.",
    "Gracias.",
  ],
};

export const LESSONS: Record<Lang, Lesson[]> = {
  en: [
    {
      t: "Read the formula, not just the number",
      s: [
        "Click the total. The formula bar at the top shows the formula, like =SUM(H2:H5).",
        "H2:H5 means: add column H, from row 2 to row 5. Look at the row numbers on the left.",
        "The green cells are the rows the formula adds. If a person has no green cell, change the row numbers in the formula.",
      ],
      tip: "A total can look right and still leave someone out. Look at the formula, not only the number.",
    },
    {
      t: "Tell your lead what was wrong",
      s: [
        "Send the corrected total. Say what the formula was missing.",
        "You do not need a long explanation. One clear sentence is enough.",
        "Fix it first, then write. Do not send a number you have not checked.",
      ],
      tip: "Naming the missed person helps your lead trust the new number.",
    },
  ],
  es: [
    {
      t: "Lee la fórmula, no solo el número",
      s: [
        "Haz clic en el total. La barra de fórmulas, arriba, muestra la fórmula, como =SUMA(H2:H5). SUMA es SUM en inglés, y la hoja acepta las dos.",
        "H2:H5 quiere decir: suma la columna H, de la fila 2 a la fila 5. Mira los números de fila a la izquierda.",
        "Las celdas verdes son las filas que suma la fórmula. Si una persona no tiene celda verde, cambia los números de fila en la fórmula.",
      ],
      tip: "Un total puede verse bien y aun así dejar a alguien fuera. Mira la fórmula, no solo el número.",
    },
    {
      t: "Dile a tu líder qué estaba mal",
      s: [
        "Envía el total corregido. Di qué le faltaba a la fórmula.",
        "No necesitas una explicación larga. Con una oración clara es suficiente.",
        "Corrígelo primero, luego escribe. No envíes un número que no hayas revisado.",
      ],
      tip: "Nombrar a la persona que faltaba ayuda a tu líder a confiar en el número nuevo.",
    },
  ],
};


const FIRST_CREW_ROW = 2;
const LAST_CREW_ROW = 6;

/**
 * The rows a formula adds, however the learner wrote it: a range
 * (=SUM(H2:H6), backwards or spaced out) or one cell at a time
 * (=H2+H3+H4+H5+H6). Null when it is not a formula this sheet reads.
 */
function rowsOf(formula: string, fn: "sum" | "average"): number[] | null {
  const t = formula.trim();
  // SUM or SUMA, AVERAGE or PROMEDIO: both languages' names work.
  const name = fnPattern(fn === "sum" ? "SUM" : "AVERAGE");
  const range = t.match(new RegExp(`^=\\s*${name}\\s*\\(\\s*H\\s*(\\d+)\\s*:\\s*H\\s*(\\d+)\\s*\\)\\s*$`, "i"));
  if (range) {
    const a = Number(range[1]);
    const b = Number(range[2]);
    const rows: number[] = [];
    for (let r = Math.min(a, b); r <= Math.max(a, b); r++) rows.push(r);
    return rows;
  }
  if (fn === "sum" && /^=\s*H\s*\d+(\s*\+\s*H\s*\d+)*\s*$/i.test(t)) {
    return [...new Set((t.match(/\d+/g) ?? []).map(Number))].sort((x, y) => x - y);
  }
  return null;
}

/** Accept SUM/AVERAGE formulas that add every crew row (2 through 6) and nothing else. */
export function rangeCoversCrew(formula: string, fn: "sum" | "average"): boolean {
  const rows = rowsOf(formula, fn);
  if (!rows) return false;
  return rows.length === LAST_CREW_ROW - FIRST_CREW_ROW + 1 && rows[0] === FIRST_CREW_ROW && rows[rows.length - 1] === LAST_CREW_ROW;
}

/** Whether a formula is an AVERAGE (or PROMEDIO), for the sheet's live value. */
export function isAverage(formula: string): boolean {
  return new RegExp(fnPattern("AVERAGE"), "i").test(formula);
}

/** The rows a formula spans, low to high, for the sheet's highlight and its live value. */
export function parseRange(formula: string): { start: number; end: number } | null {
  const rows = rowsOf(formula, isAverage(formula) ? "average" : "sum");
  if (!rows || rows.length === 0) return null;
  const start = rows[0];
  const end = rows[rows.length - 1];
  // A one-cell-at-a-time list with a gap is not one range; the sheet cannot shade it.
  if (rows.length !== end - start + 1) return null;
  return { start, end };
}

export type FormulaProblem = "ok" | "no-equals" | "unreadable" | "missing-last" | "missing-first" | "too-far";

/** What is wrong with a SUM, so the correction can say exactly that. */
export function sumProblem(formula: string): FormulaProblem {
  if (rangeCoversCrew(formula, "sum")) return "ok";
  const t = formula.trim();
  if (!t.startsWith("=")) return "no-equals";
  const rows = rowsOf(t, "sum");
  if (!rows) return "unreadable";
  if (rows[rows.length - 1] > LAST_CREW_ROW) return "too-far";
  if (rows[0] > FIRST_CREW_ROW) return "missing-first";
  return "missing-last";
}

/**
 * The keys that turn what is in the formula bar into the right formula, for
 * a learner whose typing landed in the wrong place (clicking the bar puts the
 * caret at the end, so "H6" becomes =SUM(H2:H5)H6). Counts from the end:
 * how many Backspaces back to where the two agree, then what to type.
 */
export function keysToFix(formula: string, lang: Lang): { backspaces: number; type: string } {
  // Answer in the formula's own language when it names one, so the keys match what is on screen.
  const useLang: Lang = /suma/i.test(formula) ? "es" : /sum/i.test(formula) ? "en" : lang;
  const target = rightSumFormula(useLang);
  let p = 0;
  while (p < formula.length && p < target.length && formula[p].toUpperCase() === target[p].toUpperCase()) p++;
  return { backspaces: formula.length - p, type: target.slice(p) };
}

function keysSentence(formula: string, lang: Lang): string {
  const { backspaces, type } = keysToFix(formula, lang);
  if (lang === "en") {
    if (backspaces === 0) return `Click at the end of the formula and type ${type}`;
    return `Click at the end of the formula. Press Backspace ${backspaces} ${backspaces === 1 ? "time" : "times"}, then type ${type}`;
  }
  if (backspaces === 0) return `Haz clic al final de la fórmula y escribe ${type}`;
  return `Haz clic al final de la fórmula. Presiona la tecla de borrar (Backspace) ${backspaces} ${backspaces === 1 ? "vez" : "veces"} y luego escribe ${type}`;
}

/**
 * The Job Card's correction for a SUM that is not right yet. The first miss
 * on the classic bug gets a looking question, so the learner still finds the
 * missing person; the exact edit comes only after another wrong try.
 * `tries` counts wrong checks so far, including this one.
 */
export function sumCorrection(formula: string, lang: Lang, tries: number): string | null {
  const problem = sumProblem(formula);
  const right = rightSumFormula(lang);
  const en = lang === "en";
  switch (problem) {
    case "ok":
      return null;
    case "no-equals":
      return en ? `A formula starts with =. Type it like this: ${right}` : `Una fórmula empieza con =. Escríbela así: ${right}`;
    case "unreadable":
      return en
        ? `The sheet cannot read ${formula.trim() || "an empty box"}. ${keysSentence(formula, lang)}.`
        : `La hoja no puede leer ${formula.trim() || "una casilla vacía"}. ${keysSentence(formula, lang)}.`;
    case "missing-last":
      if (tries <= 1) {
        return en
          ? "Not yet. The green cells are the rows the total adds. Look at each name. Does every person have a green cell?"
          : "Todavía no. Las celdas verdes son las filas que suma el total. Mira cada nombre. ¿Cada persona tiene una celda verde?";
      }
      return en
        ? `Row 6 is not green, so its hours are not in the total. The last row in the formula must be 6. ${keysSentence(formula, lang)}.`
        : `La fila 6 no está en verde, así que sus horas no están en el total. La última fila de la fórmula debe ser 6. ${keysSentence(formula, lang)}.`;
    case "missing-first":
      return en
        ? `The total starts too late. Row 2 is not green. Start at H2: ${right}`
        : `El total empieza muy tarde. La fila 2 no está en verde. Empieza en H2: ${right}`;
    case "too-far":
      return en ? `Row 7 is the total itself. Stop at row 6: ${right}` : `La fila 7 es el total. Detente en la fila 6: ${right}`;
  }
}

/** Kept for callers that want one line per problem; the task itself uses `sumCorrection`. */
export const SUM_PROBLEM_HINT: Record<Exclude<FormulaProblem, "ok">, Localized> = {
  "no-equals": { en: sumCorrection("SUM(H2:H6)", "en", 1)!, es: sumCorrection("SUMA(H2:H6)", "es", 1)! },
  unreadable: { en: sumCorrection("=SUM(H2 H6)", "en", 1)!, es: sumCorrection("=SUMA(H2 H6)", "es", 1)! },
  "missing-last": { en: sumCorrection(WRONG_SUM_FORMULA, "en", 2)!, es: sumCorrection("=SUMA(H2:H5)", "es", 2)! },
  "missing-first": { en: sumCorrection("=SUM(H3:H6)", "en", 1)!, es: sumCorrection("=SUMA(H3:H6)", "es", 1)! },
  "too-far": { en: sumCorrection("=SUM(H2:H7)", "en", 1)!, es: sumCorrection("=SUMA(H2:H7)", "es", 1)! },
};

export const AVERAGE_HINT: Record<Lang, string> = {
  en: `The Average row must include every name too. Set it to ${averageFormula("en")}`,
  es: `La fila Promedio también debe incluir todos los nombres. Ponla así: ${averageFormula("es")}`,
};

export type FixEmailProblem = "ok" | "empty" | "no-total" | "old-total" | "no-reason";

/**
 * What the email says about the problem. A name, "missing", "was not in the
 * total", "forgot", "one person", "row 6", or "I fixed the formula" all
 * count. The word "sum" alone does not ("the sum is 166" says nothing was wrong).
 */
const SAYS_WHAT_WAS_WRONG = new RegExp(
  [
    "casey", "brooks",
    "missing", "\\bmiss(ed)?\\b", "left (\\w+ )?out", "leave (\\w+ )?out", "leaving (\\w+ )?out",
    "not in(cluded)?\\b", "(was|were|is|are)n'?t in(cluded)?\\b", "(is|are) (now )?in(cluded in)? the total",
    "(did ?n[o']?t|does ?n[o']?t|did not|does not) (count|include|add|have)", "forg[oe]t", "skip", "exclud", "omit",
    "\\b(one|a|1) (person|name|worker|employee|row)\\b", "\\bsome(one|body)\\b",
    "(includes|counts|has|adds) (every(one|body)|all)", "every(one|body) is in",
    "row 6", "\\bh ?6\\b", "last row", "(fix|fixed|correct|corrected|changed?)\\b.{0,20}\\b(formula|range)",
    // Spanish
    "falt", "no (estaba|está|esta|estaban|inclu|cont|sum)", "olvid", "dej\\w* (a \\w+ )?(a)?fuera", "exclu", "omit",
    "\\b(una|1) persona\\b", "\\bun nombre\\b", "alguien",
    "(incluye|cuenta|suma) a todos", "todos (los nombres|están|estan)",
    "fila 6", "[uú]ltima fila", "(correg|arregl|cambi)\\w*.{0,20}(f[oó]rmula|rango)",
  ].join("|"),
  "i",
);

export function fixEmailProblem(body: string): FixEmailProblem {
  const t = body.trim();
  if (!t) return "empty";
  if (!mentionsAmount(t, CORRECT_WEEK_TOTAL)) {
    return mentionsAmount(t, SHORT_WEEK_TOTAL) ? "old-total" : "no-total";
  }
  return SAYS_WHAT_WAS_WRONG.test(t) ? "ok" : "no-reason";
}

export const FIX_EMAIL_HINT: Record<Exclude<FixEmailProblem, "ok">, Localized> = {
  empty: {
    en: "Write a short message first. Even one sentence is fine.",
    es: "Primero escribe un mensaje corto. Una oración está bien.",
  },
  "no-total": {
    en: "Write the new total. It is in the Total row, in the Hours column.",
    es: "Escribe el total nuevo. Está en la fila Total, en la columna Horas.",
  },
  "old-total": {
    en: "That is the old total, from before your fix. Look at the Total row in the Hours column now.",
    es: "Ese es el total viejo, de antes de tu corrección. Mira ahora la fila Total en la columna Horas.",
  },
  "no-reason": {
    en: "You have the total. Now say what was wrong: who was missing from the total?",
    es: "Ya tienes el total. Ahora di qué estaba mal: ¿quién faltaba en el total?",
  },
};

export function emailMentionsFix(body: string): boolean {
  return fixEmailProblem(body) === "ok";
}

/** Shown on the finish screen above the message the learner sent. */
export const SENT_LABELS: Record<Lang, { heading: string; formula: string }> = {
  en: { heading: "What you sent", formula: "The formula now" },
  es: { heading: "Lo que enviaste", formula: "La fórmula ahora" },
};

/** The persistent "what to do right now" line, one per step of this job. */
export const RIGHT_NOW_LABEL: Localized = { en: "Right now", es: "Ahora mismo" };
export const RIGHT_NOW_STEPS: Localized[] = [
  openFileStep(FORMULA_CHECK_COPY, (c) => c.sheetName),
  // A looking question, not the answer: the exact edit only comes as a
  // correction after a wrong try (see sumCorrection).
  { en: "Check whether the formula includes everyone’s hours. Edit the formula to include any missing hours.", es: "Revisa si la fórmula incluye las horas de todos. Edita la fórmula para incluir las horas que faltan." },
  { en: "Email Renata about the corrected total.", es: "Escribe a Renata sobre el total corregido." },
  { en: "Tell Renata the new total and whose hours were missing. Then click Send.", es: "Escribe a Renata el nuevo total y de quién faltaban las horas. Después haz clic en Enviar." },
];
