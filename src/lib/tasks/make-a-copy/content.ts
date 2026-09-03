import type { EventIntroCopy, Lang, Lesson, Localized } from "@/lib/task-types";
import { COPY_NAME } from "../status-sheet";

export const EVENT_INTRO: Record<Lang, EventIntroCopy> = {
  en: {
    emoji: "📄",
    kicker: "Monday. Maria shared a file.",
    headline: "The status template is view only.",
    body: "You can look. You cannot type. Make your own copy so you do not change Maria's master.",
    cta: "Open the template",
  },
  es: {
    emoji: "📄",
    kicker: "Lunes. Maria compartió un archivo.",
    headline: "La plantilla de estado es solo para ver.",
    body: "Puedes mirar. No puedes escribir. Haz tu propia copia para no cambiar el original de Maria.",
    cta: "Abrir la plantilla",
  },
};

export const MAKE_COPY_COPY: Record<Lang, {
  helpBtn: string;
  appName: string;
  templateName: string;
  copyName: string;
  viewOnly: string;
  startNewHeading: string;
  blankLabel: string;
  templateBudget: string;
  templateSchedule: string;
  recentHeading: string;
  openedLabel: string;
  fileMenu: string;
  makeCopy: string;
  share: string;
  download: string;
  print: string;
  copyTitle: string;
  nameLabel: string;
  nameHint: string;
  makeCopyCta: string;
  cancel: string;
  typeHint: string;
  typedKicker: string;
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
    templateName: "Weekly Status Template",
    copyName: COPY_NAME,
    viewOnly: "View only",
    startNewHeading: "Start a new spreadsheet",
    blankLabel: "Blank",
    templateBudget: "Budget",
    templateSchedule: "Schedule",
    recentHeading: "Shared with you",
    openedLabel: "Maria Delgado · View only",
    fileMenu: "File",
    makeCopy: "Make a copy",
    share: "Share",
    download: "Download",
    print: "Print",
    copyTitle: "Copy document",
    nameLabel: "Name",
    nameHint: `Name it ${COPY_NAME} so people can find it later.`,
    makeCopyCta: "Make a copy",
    cancel: "Cancel",
    typeHint: "This is your copy. Type in a cell to make sure you can edit it.",
    typedKicker: "You have your own copy",
    doneTitle: "You copied the template. You did not change Maria's file.",
    doneBody: "View only means look, not type. File → Make a copy is how you work without overwriting the master. Docs uses the same menu.",
    badgeName: "Make a copy of a view-only file",
    badgeWhere: "Counts toward: Office Ready",
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
    templateName: "Plantilla de estado semanal",
    copyName: COPY_NAME,
    viewOnly: "Solo ver",
    startNewHeading: "Iniciar una nueva hoja de cálculo",
    blankLabel: "En blanco",
    templateBudget: "Presupuesto",
    templateSchedule: "Horario",
    recentHeading: "Compartido contigo",
    openedLabel: "Maria Delgado · Solo ver",
    fileMenu: "Archivo",
    makeCopy: "Hacer una copia",
    share: "Compartir",
    download: "Descargar",
    print: "Imprimir",
    copyTitle: "Copiar documento",
    nameLabel: "Nombre",
    nameHint: `Nómbralo ${COPY_NAME} para que se pueda encontrar después.`,
    makeCopyCta: "Hacer una copia",
    cancel: "Cancelar",
    typeHint: "Esta es tu copia. Escribe en una celda para comprobar que puedes editar.",
    typedKicker: "Ya tienes tu propia copia",
    doneTitle: "Copiaste la plantilla. No cambiaste el archivo de Maria.",
    doneBody: "Solo ver significa mirar, no escribir. Archivo → Hacer una copia es cómo trabajas sin pisar el original. Docs usa el mismo menú.",
    badgeName: "Hacer una copia de un archivo de solo ver",
    badgeWhere: "Cuenta para: Oficina",
    tryAgain: "Hacerlo otra vez",
    backToDesk: "Volver al escritorio",
    lessonKicker: "Lección de 2 minutos",
    tipLabel: "Consejo",
    gotIt: "Entendido. Volver a mi tarea",
    askPerson: "Mejor preguntar a una persona",
  },
};

export const HINTS: Record<string, Record<Lang, string>> = {
  typeTemplate: {
    en: "This is Maria's template. Make a copy so you don't change the original.",
    es: "Esta es la plantilla de Maria. Haz una copia para no cambiar el original.",
  },
  share: {
    en: "That would let people change the master. Make your own copy instead.",
    es: "Eso dejaría que otros cambien el original. Mejor haz tu propia copia.",
  },
  download: {
    en: "Download saves a file to this computer. Make a copy keeps a Google Sheet you can still share.",
    es: "Descargar guarda un archivo en esta computadora. Hacer una copia deja una hoja de Google que aún puedes compartir.",
  },
  name: {
    en: `Name the copy ${COPY_NAME}. Same kind of name as the schedule file.`,
    es: `Nombra la copia ${COPY_NAME}. El mismo tipo de nombre que el archivo del horario.`,
  },
};

export const LESSONS: Record<Lang, Lesson[]> = {
  en: [
    {
      t: "View only means you cannot change their file",
      s: [
        "View only, read only, and Viewer all mean the same thing. You can look at the file, but you cannot type in it.",
        "File → Make a copy puts a new file in your own Drive. The original stays safe.",
        "Do not ask for edit access on a template. Do not share the original file with Can edit.",
      ],
      tip: "If a shared Doc or Sheet will not let you type, make your own copy instead of trying to unlock it.",
    },
    {
      t: "Name the copy so people can find it",
      s: [
        `Use ${COPY_NAME}. A clear name is how the next person will find this week's sheet.`,
        "The copy is yours, so you can type in it. The template still cannot be changed.",
        "In Docs, you use the same File → Make a copy menu.",
      ],
      tip: "The name is a good habit, but the real point is this: do not overwrite someone else's file.",
    },
  ],
  es: [
    {
      t: "Solo ver significa que no puedes cambiar su archivo",
      s: [
        "Solo ver, solo lectura y Lector significan lo mismo. Puedes mirar el archivo, pero no puedes escribir en él.",
        "Archivo → Hacer una copia pone un archivo nuevo en tu propio Drive. El original se queda seguro.",
        "No pidas permiso de editar en una plantilla. No compartas el archivo original con Puede editar.",
      ],
      tip: "Si un Doc o Sheet compartido no te deja escribir, haz tu propia copia en vez de tratar de desbloquearlo.",
    },
    {
      t: "Nómbrala para que la gente la pueda encontrar",
      s: [
        `Usa ${COPY_NAME}. Un nombre claro es como la siguiente persona va a encontrar la hoja de esta semana.`,
        "La copia es tuya, así que puedes escribir en ella. La plantilla sigue sin poder cambiarse.",
        "En Docs, usas el mismo menú Archivo → Hacer una copia.",
      ],
      tip: "El nombre es una buena costumbre, pero el punto de verdad es este: no sobrescribas el archivo de otra persona.",
    },
  ],
};

/** The persistent "what to do right now" line, one per step of this job. */
export const RIGHT_NOW_LABEL: Localized = { en: "Right now", es: "Ahora mismo" };
export const RIGHT_NOW_STEPS: Localized[] = [
  {
    en: "Open the status template Maria shared.",
    es: "Abre la plantilla de estado que Maria compartió.",
  },
  {
    en: "It is view only. Make your own copy.",
    es: "Es solo para ver. Haz tu propia copia.",
  },
  {
    en: "Name your copy so you can find it later.",
    es: "Ponle nombre a tu copia para encontrarla después.",
  },
];
