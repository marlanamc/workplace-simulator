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
  sheetHeader: string;
  totalLabel: string;
  confirmTotal: string;
  calHeader: string;
  calNoted: string;
  docsLabel: string;
  docsPlaceholder: string;
  docsSave: string;
  mailTo: string;
  mailSubject: string;
  mailLabel: string;
  mailPlaceholder: string;
  send: string;
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
    sheetHeader: "Week of Aug 24 — daily sales",
    totalLabel: "Week total",
    confirmTotal: `Yes — the total is $${PLANTED_WEEK_TOTAL.toLocaleString("en-US")}`,
    calHeader: "This week",
    calNoted: "Noted — I'll mention this",
    docsLabel: "Weekly summary",
    docsPlaceholder: "This week's total was… and coming up…",
    docsSave: "Save the summary",
    mailTo: "To: Maria Delgado",
    mailSubject: "Subject: Weekly report — week of Aug 24",
    mailLabel: "Your message",
    mailPlaceholder: "A line or two, with the summary below or attached…",
    send: "Send",
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
    sheetHeader: "Semana del 24 de ago — ventas por día",
    totalLabel: "Total de la semana",
    confirmTotal: `Sí — el total es $${PLANTED_WEEK_TOTAL.toLocaleString("en-US")}`,
    calHeader: "Esta semana",
    calNoted: "Anotado — lo voy a mencionar",
    docsLabel: "Resumen semanal",
    docsPlaceholder: "El total de esta semana fue… y lo que viene…",
    docsSave: "Guardar el resumen",
    mailTo: "Para: Maria Delgado",
    mailSubject: "Asunto: Reporte semanal — semana del 24 de ago",
    mailLabel: "Tu mensaje",
    mailPlaceholder: "Una o dos líneas, con el resumen abajo o adjunto…",
    send: "Enviar",
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
