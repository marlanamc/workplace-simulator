import type { Lang, Lesson, Localized } from "@/lib/task-types";

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
export const WEEK_DAYS: { label: Localized; date: number }[] = [
  { label: { en: "Mon", es: "Lun" }, date: 24 },
  { label: { en: "Tue", es: "Mar" }, date: 25 },
  { label: { en: "Wed", es: "Mié" }, date: 26 },
  { label: { en: "Thu", es: "Jue" }, date: 27 },
  { label: { en: "Fri", es: "Vie" }, date: 28 },
  { label: { en: "Sat", es: "Sáb" }, date: 29 },
  { label: { en: "Sun", es: "Dom" }, date: 30 },
];

/** The one event the learner opens on the week strip (Thursday). */
export const CALENDAR_EVENT = {
  dayIndex: 3,
  time: { en: "6 AM", es: "6 AM" } as Localized,
  title: { en: "Morning open", es: "Apertura" } as Localized,
  detailWhen: { en: "Thu, Aug 27 · 6:00 – 10:00 AM", es: "Jue, 27 de ago · 6:00 – 10:00 AM" } as Localized,
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
    sheetBody: "Open the tally. Confirm the total — do not retype it.",
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
    sheetFileName: "Weekly sales — Aug 24",
    sheetHeader: "Week of Aug 24 — daily sales",
    dayCol: "Day",
    salesCol: "Sales",
    totalLabel: "Total",
    confirmTotal: `Yes — the total is $${PLANTED_WEEK_TOTAL.toLocaleString("en-US")}`,
    calAppName: "Calendar",
    calHeader: "This week",
    calNoted: "Noted — I'll mention this",
    calNoteCta: "Note it for the report",
    eventOpenLabel: "Open the event",
    docsFileName: "Weekly report — Aug 24",
    docsLabel: "Weekly summary",
    docsPlaceholder: "This week's total was… and coming up…",
    docsSave: "Save the summary",
    mailToValue: "Maria Delgado",
    mailSubjectValue: "Weekly report — week of Aug 24",
    toLabel: "To",
    subjectLabel: "Subject",
    mailLabel: "Your message",
    mailPlaceholder: "A line or two, with the summary below or attached…",
    attachmentName: "Weekly report — Aug 24",
    send: "Send",
    backHub: "Back to the report",
    needConfirm: "Confirm the total that's already there. Don't type a different number.",
    needNoted: "Open the calendar item and note it first.",
    needSummary: "Write a short paragraph. Put the week's number in it.",
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
    sheetBody: "Abre la tabla. Confirma el total — no lo vuelvas a escribir.",
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
    sheetFileName: "Ventas de la semana — 24 de ago",
    sheetHeader: "Semana del 24 de ago — ventas por día",
    dayCol: "Día",
    salesCol: "Ventas",
    totalLabel: "Total",
    confirmTotal: `Sí — el total es $${PLANTED_WEEK_TOTAL.toLocaleString("en-US")}`,
    calAppName: "Calendar",
    calHeader: "Esta semana",
    calNoted: "Anotado — lo voy a mencionar",
    calNoteCta: "Anotarlo para el reporte",
    eventOpenLabel: "Abrir el evento",
    docsFileName: "Reporte semanal — 24 de ago",
    docsLabel: "Resumen semanal",
    docsPlaceholder: "El total de esta semana fue… y lo que viene…",
    docsSave: "Guardar el resumen",
    mailToValue: "Maria Delgado",
    mailSubjectValue: "Reporte semanal — semana del 24 de ago",
    toLabel: "Para",
    subjectLabel: "Asunto",
    mailLabel: "Tu mensaje",
    mailPlaceholder: "Una o dos líneas, con el resumen abajo o adjunto…",
    attachmentName: "Reporte semanal — 24 de ago",
    send: "Enviar",
    backHub: "Volver al reporte",
    needConfirm: "Confirma el total que ya está ahí. No escribas otro número.",
    needNoted: "Abre el punto del calendario y anótalo primero.",
    needSummary: "Escribe un párrafo corto. Pon el número de la semana en él.",
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
    `This week's total was $${PLANTED_WEEK_TOTAL.toLocaleString("en-US")}, up from last week.`,
    "Coming up: next Thursday's morning open still needs someone.",
  ],
  es: [
    `El total de esta semana fue $${PLANTED_WEEK_TOTAL.toLocaleString("en-US")}, más que la semana pasada.`,
    "Lo que viene: la apertura del próximo jueves todavía necesita a alguien.",
  ],
};

export const MAIL_STARTERS: Record<Lang, string[]> = {
  en: ["Hi Maria, here is this week's report.", "Summary is below. Let me know if you want anything added."],
  es: ["Hola Maria, aquí está el reporte de esta semana.", "El resumen está abajo. Avísame si quieres que agregue algo."],
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
  { en: "Four apps, one packet. Do them in order.", es: "Cuatro apps, un paquete. Hazlas en orden." },
  { en: "Open Sheets. Check this week's total.", es: "Abre Sheets. Revisa el total de esta semana." },
  { en: "Open Calendar. Note what's coming up.", es: "Abre Calendar. Anota lo que viene." },
  { en: "Open Docs. Write a summary of both.", es: "Abre Docs. Escribe un resumen de las dos cosas." },
  { en: "Open Mail. Send the summary as one packet.", es: "Abre Mail. Envía el resumen como un solo paquete." },
];

export function summaryPullsBoth(text: string): boolean {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return words >= 12 && /\d/.test(text);
}

export interface OpsReportPacketInput {
  sheetTotalConfirmed: boolean;
  calendarNoted: boolean;
  summary: string;
  packetSent: boolean;
}

export function opsReportPacketPasses(input: OpsReportPacketInput): boolean {
  return (
    input.sheetTotalConfirmed &&
    input.calendarNoted &&
    summaryPullsBoth(input.summary) &&
    input.packetSent
  );
}
