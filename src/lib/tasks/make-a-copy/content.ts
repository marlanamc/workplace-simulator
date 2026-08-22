import type { ConfidenceOption, EventIntroCopy, Lang, Lesson } from "@/lib/task-types";
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
  confidenceQ: string;
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
    confidenceQ: "How do you feel about view only vs. can edit?",
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
    confidenceQ: "¿Cómo te sientes con solo ver frente a poder editar?",
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
      t: "View only means do not change their file",
      s: [
        "View only, read only, and Viewer are the same idea. You can look. You cannot type.",
        "File → Make a copy puts a new file in your Drive. The original stays safe.",
        "Do not ask for edit access on a template. Do not share the master as Can edit.",
      ],
      tip: "If a shared Doc or Sheet will not let you type, copy it. Do not fight the lock.",
    },
    {
      t: "Name the copy so people can find it",
      s: [
        `Use ${COPY_NAME}. A clear name is how the next person finds your week.`,
        "The copy is yours. You can type. The template still cannot.",
        "Docs uses the same File → Make a copy menu.",
      ],
      tip: "The name is a habit, not the whole skill. The skill is: do not overwrite their file.",
    },
  ],
  es: [
    {
      t: "Solo ver significa no cambiar su archivo",
      s: [
        "Solo ver, solo lectura y Lector son la misma idea. Puedes mirar. No puedes escribir.",
        "Archivo → Hacer una copia pone un archivo nuevo en tu Drive. El original se queda seguro.",
        "No pidas permiso de editar en una plantilla. No compartas el original como Puede editar.",
      ],
      tip: "Si un Doc o Sheet compartido no te deja escribir, cópialo. No pelees con el candado.",
    },
    {
      t: "Nombra la copia para que se pueda encontrar",
      s: [
        `Usa ${COPY_NAME}. Un nombre claro es cómo la siguiente persona encuentra tu semana.`,
        "La copia es tuya. Puedes escribir. La plantilla sigue sin poder.",
        "Docs usa el mismo menú Archivo → Hacer una copia.",
      ],
      tip: "El nombre es un hábito, no toda la destreza. La destreza es: no pisar su archivo.",
    },
  ],
};

export const CONFIDENCE_OPTIONS: Record<Lang, ConfidenceOption[]> = {
  en: [
    { label: "Still unsure", reply: "That's honest. Open the template again. Try to type. Then use File → Make a copy." },
    { label: "I could try", reply: "Good. Do it once more without Help. The lock is the point." },
    { label: "I can do this", reply: "You left Maria's file alone and worked in your copy. Use Next." },
  ],
  es: [
    { label: "Todavía dudo", reply: "Eso es honesto. Abre la plantilla otra vez. Intenta escribir. Luego usa Archivo → Hacer una copia." },
    { label: "Podría intentarlo", reply: "Bien. Hazlo otra vez sin Ayuda. El candado es el punto." },
    { label: "Puedo hacerlo", reply: "Dejaste el archivo de Maria en paz y trabajaste en tu copia. Usa Siguiente." },
  ],
};
