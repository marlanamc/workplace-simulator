import { mentionsAmount } from "@/lib/text-facts";
import { looksLikeRealText, normalizeReply } from "@/lib/grading/meaning";
import type { Lang, Lesson, Localized, SubmissionContent } from "@/lib/task-types";
import { STORY_DAY_BY_LEVEL, WEEKDAY_SHORT, cardDate, mondayOf, monthDate, shortDate, storyDate } from "@/lib/story-dates";

/**
 * The report goes out on Thursday (level26). It reports last week's sales,
 * Monday to Saturday, all of which have happened, and flags next week's
 * Thursday open. Every date below comes from that sitting's day.
 */
const REPORT_DAY = STORY_DAY_BY_LEVEL.level26;
/** Monday of the week the sales sheet covers. */
export const REPORT_WEEK = mondayOf(REPORT_DAY) - 7;
/** Monday of the week the Calendar strip shows. */
const NEXT_WEEK = mondayOf(REPORT_DAY) + 7;
const WEEK_EN = shortDate(REPORT_WEEK, "en");
const WEEK_ES = monthDate(REPORT_WEEK, "es");

/**
 * Level 26 — Put It All Together. The biggest single lesson: every app, one
 * deliverable. A number from Sheets, a note from Calendar, a short write-up in
 * Docs, all sent as one packet through Mail.
 *
 * Nothing new to learn — the skill is putting familiar pieces together under
 * one deadline. Teacher-check: the app confirms the total was checked, the
 * calendar item was noted, the summary has a number in it, and the packet was
 * sent. It does not grade the writing.
 */

/** Planted from the week's tally. Learners confirm it; they do not invent it. */
export const PLANTED_WEEK_TOTAL = 4820;

export interface SheetRow {
  label: Localized;
  value: number;
}

export const SHEET_ROWS: SheetRow[] = [
  { label: { en: "Mon", es: "Lun" }, value: 610 },
  { label: { en: "Tue", es: "Mar" }, value: 705 },
  { label: { en: "Wed", es: "Mié" }, value: 690 },
  { label: { en: "Thu", es: "Jue" }, value: 840 },
  { label: { en: "Fri", es: "Vie" }, value: 975 },
  { label: { en: "Sat", es: "Sáb" }, value: 1000 },
];

export const CALENDAR_ITEM: Localized = {
  en: "Next Thursday: morning open has no one scheduled yet.",
  es: "El próximo jueves: la apertura de la mañana todavía no tiene a nadie.",
};

/** Mon–Sun labels for the compact Calendar week strip. */
export const WEEK_DAYS: { label: Localized; date: number; today: boolean }[] = Array.from({ length: 7 }, (_, i) => {
  const day = NEXT_WEEK + i;
  const dow = (i + 1) % 7;
  return {
    label: { en: WEEKDAY_SHORT.en[dow], es: WEEKDAY_SHORT.es[dow] },
    date: storyDate(day).getDate(),
    today: day === REPORT_DAY,
  };
});

/** The one event the learner opens on the week strip (Thursday). */
export const CALENDAR_EVENT = {
  dayIndex: 3,
  time: { en: "6 AM", es: "6 AM" } as Localized,
  title: { en: "Morning open", es: "Apertura" } as Localized,
  detailWhen: { en: `${cardDate(NEXT_WEEK + 3, "en")} · 6:00 – 10:00 AM`, es: `${cardDate(NEXT_WEEK + 3, "es")} · 6:00 – 10:00 AM` } as Localized,
  detailBody: {
    en: "No one is assigned to the morning open. Flag it in the weekly report.",
    es: "Nadie está asignado a la apertura de la mañana. Márcalo en el reporte semanal.",
  } as Localized,
};

export const OPS_COPY: Record<Lang, {
  appName: string;
  helpBtn: string;
  hubHeading: string;
  sheetTitle: string;
  sheetBody: string;
  sheetCta: string;
  calTitle: string;
  calBody: string;
  calCta: string;
  docsTitle: string;
  docsBody: string;
  docsCta: string;
  mailTitle: string;
  mailBody: string;
  mailCta: string;
  sheetFileName: string;
  sheetHeader: string;
  dayCol: string;
  salesCol: string;
  totalLabel: string;
  confirmTotal: string;
  calAppName: string;
  calHeader: string;
  calNoted: string;
  calNoteCta: string;
  eventOpenLabel: string;
  docsFileName: string;
  docsLabel: string;
  docsPlaceholder: string;
  docsSave: string;
  mailToValue: string;
  mailSubjectValue: string;
  toLabel: string;
  subjectLabel: string;
  mailLabel: string;
  mailPlaceholder: string;
  attachmentName: string;
  send: string;
  backHub: string;
  needConfirm: string;
  needNoted: string;
  needSummary: string;
  needSend: string;
  sentKicker: string;
  tryAgain: string;
  backToDesk: string;
  lessonKicker: string;
  tipLabel: string;
  gotIt: string;
}> = {
  en: {
    appName: "Report",
    helpBtn: "Help me with this step",
    hubHeading: "The weekly report",
    sheetTitle: "Check the week's total",
    sheetBody: "Open the tally. Confirm the total. Do not retype it.",
    sheetCta: "Open Sheets",
    calTitle: "Note what's coming up",
    calBody: "One thing on the calendar is worth flagging.",
    calCta: "Open Calendar",
    docsTitle: "Write the summary",
    docsBody: "One short paragraph: the number, and what's coming up.",
    docsCta: "Open Docs",
    mailTitle: "Send the packet",
    mailBody: "Send the summary to your manager as one email.",
    mailCta: "Open Mail",
    sheetFileName: `Weekly sales: ${WEEK_EN}`,
    sheetHeader: `Week of ${WEEK_EN}: daily sales`,
    dayCol: "Day",
    salesCol: "Sales",
    totalLabel: "Total",
    confirmTotal: `Yes, the total is $${PLANTED_WEEK_TOTAL.toLocaleString("en-US")}`,
    calAppName: "Calendar",
    calHeader: "Next week",
    calNoted: "Noted. I'll mention this",
    calNoteCta: "Note it for the report",
    eventOpenLabel: "Open the event",
    docsFileName: `Weekly report: ${WEEK_EN}`,
    docsLabel: "Weekly summary",
    docsPlaceholder: "Last week's total was… and coming up…",
    docsSave: "Save the summary",
    mailToValue: "Anita Raman",
    mailSubjectValue: `Weekly report: week of ${WEEK_EN}`,
    toLabel: "To",
    subjectLabel: "Subject",
    mailLabel: "Your message",
    mailPlaceholder: "A line or two, with the summary below or attached…",
    attachmentName: `Weekly report: ${WEEK_EN}`,
    send: "Send",
    backHub: "Back to the report",
    needConfirm: "Confirm the total that's already there. Don't type a different number.",
    needNoted: "Open the calendar item and note it first.",
    needSummary: "Report the sheet total and Thursday morning’s coverage gap. You can reopen both sources.",
    needSend: "Finish the other three parts, then send.",
    sentKicker: "Packet sent",
    tryAgain: "Do it again",
    backToDesk: "Back to desktop",
    lessonKicker: "2-minute lesson",
    tipLabel: "Tip",
    gotIt: "Got it. Back to my task",
  },
  es: {
    appName: "Reporte",
    helpBtn: "Ayúdame con este paso",
    hubHeading: "El reporte semanal",
    sheetTitle: "Revisa el total de la semana",
    sheetBody: "Abre la tabla. Confirma el total. No lo vuelvas a escribir.",
    sheetCta: "Abrir Sheets",
    calTitle: "Anota lo que viene",
    calBody: "Una cosa en el calendario vale la pena mencionar.",
    calCta: "Abrir Calendar",
    docsTitle: "Escribe el resumen",
    docsBody: "Un párrafo corto: el número, y lo que viene.",
    docsCta: "Abrir Docs",
    mailTitle: "Envía el paquete",
    mailBody: "Envía el resumen a tu gerente en un solo correo.",
    mailCta: "Abrir Mail",
    sheetFileName: `Ventas de la semana: ${WEEK_ES}`,
    sheetHeader: `Semana del ${WEEK_ES}: ventas por día`,
    dayCol: "Día",
    salesCol: "Ventas",
    totalLabel: "Total",
    confirmTotal: `Sí, el total es $${PLANTED_WEEK_TOTAL.toLocaleString("en-US")}`,
    calAppName: "Calendar",
    calHeader: "La próxima semana",
    calNoted: "Anotado. Lo voy a mencionar",
    calNoteCta: "Anotarlo para el reporte",
    eventOpenLabel: "Abrir el evento",
    docsFileName: `Reporte semanal: ${WEEK_ES}`,
    docsLabel: "Resumen semanal",
    docsPlaceholder: "El total de la semana pasada fue… y lo que viene…",
    docsSave: "Guardar el resumen",
    mailToValue: "Anita Raman",
    mailSubjectValue: `Reporte semanal: semana del ${WEEK_ES}`,
    toLabel: "Para",
    subjectLabel: "Asunto",
    mailLabel: "Tu mensaje",
    mailPlaceholder: "Una o dos líneas, con el resumen abajo o adjunto…",
    attachmentName: `Reporte semanal: ${WEEK_ES}`,
    send: "Enviar",
    backHub: "Volver al reporte",
    needConfirm: "Confirma el total que ya está ahí. No escribas otro número.",
    needNoted: "Abre el punto del calendario y anótalo primero.",
    needSummary: "Incluye el total y la falta de cobertura del jueves por la mañana. Puedes abrir ambas fuentes.",
    needSend: "Termina las otras tres partes, luego envía.",
    sentKicker: "Paquete enviado",
    tryAgain: "Hacerlo otra vez",
    backToDesk: "Volver al escritorio",
    lessonKicker: "Lección de 2 minutos",
    tipLabel: "Consejo",
    gotIt: "Entendido. Volver a mi tarea",
  },
};

export const SUMMARY_STARTERS: Record<Lang, string[]> = {
  en: [
    `Last week's total was $${PLANTED_WEEK_TOTAL.toLocaleString("en-US")}.`,
    "Coming up: next Thursday's morning open still needs someone.",
  ],
  es: [
    `El total de la semana pasada fue $${PLANTED_WEEK_TOTAL.toLocaleString("en-US")}.`,
    "Lo que viene: la apertura del próximo jueves todavía necesita a alguien.",
  ],
};

export const MAIL_STARTERS: Record<Lang, string[]> = {
  en: ["Hi Anita, here is the weekly report.", "Summary is below. Let me know if you want anything added."],
  es: ["Hola Anita, aquí está el reporte semanal.", "El resumen está abajo. Avísame si quieres que agregue algo."],
};

export const LESSONS: Record<Lang, Lesson[]> = {
  en: [
    {
      t: "Four apps, one packet",
      s: [
        "There is no new skill here. You have checked a total, read a calendar, written a short note, and sent an email before.",
        "The only new part is doing all four in a row and sending them as one thing, not four loose pieces.",
        "Do them in order: the number, then the calendar note, then the summary that pulls both together, then the email.",
      ],
      tip: "The summary is where the two facts meet. If it names the number and what's coming up, the packet is done.",
    },
  ],
  es: [
    {
      t: "Cuatro apps, un paquete",
      s: [
        "Aquí no hay ninguna habilidad nueva. Ya revisaste un total, leíste un calendario, escribiste una nota corta y enviaste un correo antes.",
        "Lo único nuevo es hacer las cuatro cosas seguidas y enviarlas como una sola, no como cuatro piezas sueltas.",
        "Hazlas en orden: el número, luego la nota del calendario, luego el resumen que junta las dos, luego el correo.",
      ],
      tip: "El resumen es donde se juntan los dos datos. Si nombra el número y lo que viene, el paquete está listo.",
    },
  ],
};

export const RIGHT_NOW_LABEL: Localized = { en: "Right now", es: "Ahora mismo" };
export const RIGHT_NOW_STEPS: Localized[] = [
  { en: "A total and a calendar commitment, combined in one packet.", es: "Un total y un compromiso del calendario, juntos en un paquete." },
  { en: "Open Sheets. Check the week's total.", es: "Abre Sheets. Revisa el total de la semana." },
  { en: "Open Calendar. Note what's coming up.", es: "Abre Calendar. Anota lo que viene." },
  { en: "Open Docs. Include the weekly total and Thursday's uncovered morning opening.", es: "Abre Docs. Incluye el total semanal y la apertura de la mañana del jueves sin cobertura." },
  { en: "Open Mail. Send the summary as one packet.", es: "Abre Mail. Envía el resumen como un solo paquete." },
];

/** Nobody there, in any beginner phrasing: "no person", "nobody", "is empty", "needs someone". */
const NOBODY =
  /\b(no one|noone|nobody|no person|no people|no worker|no staff|no body|nobody yet|empty|alone|vacant|vacan\w*|gap|missing|uncovered|unassigned|unstaffed|open spot|not covered|no cover\w*|need(s|ed)? (a |one |some ?one|some ?body|a person|people|staff|cover\w*|a worker|help|someone)|still need(s)?|nadie|sin (nadie|persona|personal|cobertura|gente|asignar)|vaci[ao]|falta\w*|no hay (nadie|personal|gente)|necesita\w* (a alguien|alguien|una persona|gente|personal|cobertura)|sin cubrir|no tiene a nadie)\b/;
/** "Everything is fine" while a shift is uncovered is a wrong report. */
const ALL_FINE = /\b(everything (is )?(fine|ok|okay|good|great)|all (is )?(fine|good|well|ok)|no problems?|nothing to report|todo (esta )?bien|sin problemas|ningun problema)\b/;

/**
 * Thursday's morning open, and that nobody is on it, in any beginner form:
 * "Thursday morning open no person", "Thursday open: no worker yet",
 * "la apertura del jueves necesita a alguien". A bare "need" without who
 * or what is not enough, and "Everything fine" is not a report of a gap.
 */
export function summaryNamesGap(text: string): boolean {
  const t = normalizeReply(text);
  if (ALL_FINE.test(t)) return false;
  return /\b(thurs\w*|thu|jueves|jue)\b/.test(t)
    && /\b(open\w*|morning|am|apertura|abrir|manana)\b|\b6(:00)?\s*(am|a\.?\s?m)/.test(t)
    && NOBODY.test(t);
}

/** Why the summary is not saved yet, or "ok". */
export type SummaryVerdict = "ok" | "empty" | "no-total" | "no-gap" | "all-fine";

export function summaryVerdict(text: string): SummaryVerdict {
  if (!text.trim()) return "empty";
  if (ALL_FINE.test(normalizeReply(text))) return "all-fine";
  if (!mentionsAmount(text, PLANTED_WEEK_TOTAL)) return "no-total";
  return summaryNamesGap(text) ? "ok" : "no-gap";
}

export function summaryPullsBoth(text: string): boolean {
  return summaryVerdict(text) === "ok";
}

/** The Job Card's correction for each verdict, in plain words (no "coverage gap"). */
export const SUMMARY_CORRECTIONS: Record<Exclude<SummaryVerdict, "ok">, Localized> = {
  empty: {
    en: "Write the total and who is missing on Thursday morning.",
    es: "Escribe el total y quién falta el jueves por la mañana.",
  },
  "no-total": {
    en: "Add this week's total from the sheet.",
    es: "Agrega el total de esta semana de la hoja.",
  },
  "no-gap": {
    en: "Say that nobody is working the Thursday morning open.",
    es: "Di que nadie trabaja en la apertura del jueves por la mañana.",
  },
  "all-fine": {
    en: "Not everything is fine. Nobody is working Thursday morning. Say that.",
    es: "No todo está bien. Nadie trabaja el jueves por la mañana. Dilo.",
  },
};

/** The packet email needs a line or two, not an empty body. */
export function packetMessageIsReady(message: string): boolean {
  return looksLikeRealText(message, 2);
}

export const NEED_MESSAGE: Localized = {
  en: "Write a line or two to Anita before you send.",
  es: "Escríbele una o dos líneas a Anita antes de enviar.",
};

export interface OpsReportPacketInput {
  sheetTotalConfirmed: boolean;
  calendarNoted: boolean;
  summary: string;
  /** The email body that carries the packet. */
  message: string;
  packetSent: boolean;
}

export function opsReportPacketPasses(input: OpsReportPacketInput): boolean {
  return (
    input.sheetTotalConfirmed &&
    input.calendarNoted &&
    summaryPullsBoth(input.summary) &&
    packetMessageIsReady(input.message) &&
    input.packetSent
  );
}

/** What the teacher sees for this submission: the written summary and the packet email. */
export function describeSubmission(
  input: { summary: string; message: string },
  lang: Lang,
): SubmissionContent {
  const c = OPS_COPY[lang];
  return {
    lang,
    fields: [
      { label: c.docsFileName, value: input.summary },
      { label: c.mailSubjectValue, value: input.message },
    ],
  };
}
