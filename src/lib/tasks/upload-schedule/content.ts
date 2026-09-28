import type { Lang, Lesson, Localized, PickableItem } from "@/lib/task-types";
import type { PdfDocument } from "@/lib/pdf-content";
import type { InboxRow } from "@/lib/story-beats";
import { PDF_DOCUMENTS } from "@/lib/pdf-content";
import { CAST, inboxSender } from "@/lib/cast";
import { FILES_WEEK, FILE_PAGES, NEXT_WEEK, schedName } from "@/lib/tasks/files/content";
import { STORY_DAY_BY_LEVEL, monthDate, shortDate, storyYear } from "@/lib/story-dates";

/**
 * Day 10's first job (Wave 4, file confidence): download next week's crew
 * schedule from Renata's email, then upload it to the Schedules folder in
 * Drive. Next week's file on purpose: in the `files` task that follows, the
 * learner must pick THIS week's schedule, and the file they just uploaded is
 * one of the look-alikes.
 *
 * The evidence is the uploaded file's identity and the folder it went to,
 * never a typed name. See curriculum/design/story-transfer-practice.md.
 */

/** "Sep 21" / "21 de septiembre". */
const NEXT = { en: shortDate(NEXT_WEEK, "en"), es: monthDate(NEXT_WEEK, "es") };
const THIS = { en: shortDate(FILES_WEEK, "en"), es: monthDate(FILES_WEEK, "es") };

/** The attachment: next week's schedule, "sched_92126.pdf". */
export const NEXT_SCHEDULE_NAME = schedName(NEXT_WEEK);
export const NEXT_SCHEDULE_SIZE = "84 KB";
/** Where a download lands, and the folder the file must go to. */
export const UPLOAD_FOLDER = "Schedules";

/**
 * The download is a story flag, not a draft: Mail sets it and Drive and the
 * PDF app read it, and a lesson keeps story flags in shared memory.
 */
export { SCHEDULE_DOWNLOADED_FLAG } from "@/lib/story-beats";

/** The downloaded file, as the PDF app's Downloads list and the picker show it. */
export const NEXT_SCHEDULE_DOC: PdfDocument = {
  ...FILE_PAGES["sched-sept"].doc,
  id: "download-next-schedule",
  name: NEXT_SCHEDULE_NAME,
  date: `${shortDate(FILES_WEEK, "en")}, ${storyYear(FILES_WEEK)}`,
} as PdfDocument;

/** Renata's Monday email. It starts the job, like the hiring mail in Act VI. */
export const SCHEDULE_MAIL: InboxRow = {
  key: "renata-next-schedule",
  ...inboxSender(CAST.renata),
  time: "7:32 AM",
  sentOn: STORY_DAY_BY_LEVEL.level5,
  story: true,
  unread: true,
  unlockAfter: "calendar",
  subject: { en: "Next week's schedule", es: "Horario de la próxima semana" },
  preview: {
    en: "Please put it in the Schedules folder.",
    es: "Por favor ponlo en la carpeta Schedules.",
  },
  body: {
    en: [
      `Next week's schedule is ready. It is attached. It is the week of ${NEXT.en}.`,
      "Please download it and upload it to the Schedules folder in Drive, so the crew can see it.",
      "After that, Jordan needs this week's schedule. More on that soon.",
    ],
    es: [
      `El horario de la próxima semana está listo. Está adjunto. Es la semana del ${NEXT.es}.`,
      "Por favor descárgalo y súbelo a la carpeta Schedules en Drive, para que el equipo lo pueda ver.",
      "Después, Jordan necesita el horario de esta semana. Te escribo pronto sobre eso.",
    ],
  },
};

/** The single in-window instruction voice (RightNowBar), one step at a time. */
export const RIGHT_NOW_LABEL: Localized = { en: "Right now", es: "Ahora mismo" };
export const RIGHT_NOW_STEPS: Localized[] = [
  {
    en: "Open Renata's email: Next week's schedule.",
    es: "Abre el correo de Renata: Horario de la próxima semana.",
  },
  {
    en: "Click Download on the attached schedule.",
    es: "Haz clic en Descargar en el horario adjunto.",
  },
  {
    en: "Open Drive. Then open the Schedules folder.",
    es: "Abre Drive. Después abre la carpeta Schedules.",
  },
  {
    en: "Click New. Then click File upload.",
    es: "Haz clic en Nuevo. Después haz clic en Subir archivo.",
  },
  {
    en: `Choose next week's schedule, Week of ${NEXT.en}. Then click Upload.`,
    es: `Elige el horario de la próxima semana, Week of ${NEXT.en} (semana del ${NEXT.es}). Después haz clic en Subir.`,
  },
];

/** Act II states the goal, not the clicks. */
export const GOAL: Localized = {
  en: "Download next week's schedule from Renata's email. Upload it to the Schedules folder in Drive.",
  es: "Descarga el horario de la próxima semana del correo de Renata. Súbelo a la carpeta Schedules en Drive.",
};

// --- The upload check --------------------------------------------------------

/** The files in Downloads the upload picker lists. The target only once downloaded. */
export const PICKER_TARGET_KEY = "download-next-schedule";
const THIS_WEEK_KEY = "download-this-schedule";

/** This week's schedule, downloaded earlier to check your own shifts. */
export const THIS_SCHEDULE_DOC: PdfDocument = {
  ...FILE_PAGES["sched-aug24"].doc,
  id: THIS_WEEK_KEY,
} as PdfDocument;

const PAYSTUB = PDF_DOCUMENTS.find((d) => d.id === "paystub-first")!;
const SAFETY = PDF_DOCUMENTS.find((d) => d.id === "safety-report-july")!;

/** The page behind each picker row, so the learner can tell them apart by reading. */
export const PICKER_PAGES: Record<string, PdfDocument> = {
  [PICKER_TARGET_KEY]: NEXT_SCHEDULE_DOC,
  [THIS_WEEK_KEY]: THIS_SCHEDULE_DOC,
  [PAYSTUB.id]: PAYSTUB,
  [SAFETY.id]: SAFETY,
};

export function downloadsFor(downloaded: boolean): PickableItem[] {
  const target: PickableItem = {
    key: PICKER_TARGET_KEY,
    label: NEXT_SCHEDULE_NAME,
    columns: [shortDate(FILES_WEEK, "en")],
    isTarget: true,
  };
  const rest: PickableItem[] = [
    {
      key: THIS_WEEK_KEY,
      label: THIS_SCHEDULE_DOC.name,
      columns: [shortDate(FILES_WEEK - 3, "en")],
      isTarget: false,
      wrongHint: {
        en: `That page says Week of ${THIS.en}. That is this week. Renata sent next week's schedule, Week of ${NEXT.en}.`,
        es: `Esa página dice Week of ${THIS.en}. Es esta semana. Renata envió el horario de la próxima semana, Week of ${NEXT.en} (semana del ${NEXT.es}).`,
      },
    },
    {
      key: PAYSTUB.id,
      label: PAYSTUB.name,
      columns: ["Aug 28"],
      isTarget: false,
      wrongHint: {
        en: "That is your pay stub, not a schedule. Choose next week's schedule.",
        es: "Ese es tu talón de pago, no un horario. Elige el horario de la próxima semana.",
      },
    },
    {
      key: SAFETY.id,
      label: SAFETY.name,
      columns: ["Aug 1"],
      isTarget: false,
      wrongHint: {
        en: "That is a safety report, not a schedule. Choose next week's schedule.",
        es: "Ese es un informe de seguridad, no un horario. Elige el horario de la próxima semana.",
      },
    },
  ];
  return downloaded ? [target, ...rest] : rest;
}

export type UploadProblem = "not-downloaded" | "wrong-folder" | "wrong-file";

/**
 * What is wrong with an upload, or null when the right file went to the
 * right folder. `folder` is the Drive folder open when Upload was chosen
 * (null for Drive's top level).
 */
export function uploadProblem(
  pickedKey: string | null,
  folder: string | null,
  downloaded: boolean,
): UploadProblem | null {
  if (folder !== UPLOAD_FOLDER) return "wrong-folder";
  if (pickedKey === PICKER_TARGET_KEY) return downloaded ? null : "not-downloaded";
  if (!downloaded) return "not-downloaded";
  return "wrong-file";
}

/**
 * Before the picker opens: a file uploads into the folder that is open, so
 * the folder is checked first. A missing download is not checked here: the
 * picker opens on Downloads, and the learner can see the file is not there.
 */
export function uploadStartProblem(folder: string | null): UploadProblem | null {
  return folder === UPLOAD_FOLDER ? null : "wrong-folder";
}

/** One factual correction for each problem. None of them resets a step. */
export function uploadCorrection(problem: UploadProblem, folder: string | null): Localized {
  if (problem === "not-downloaded") {
    return {
      en: "Next week's schedule is not in Downloads yet. Open Renata's email and click Download first.",
      es: "El horario de la próxima semana todavía no está en Descargas. Abre el correo de Renata y primero haz clic en Descargar.",
    };
  }
  if (problem === "wrong-folder") {
    const here = folder ?? "Drive";
    return {
      en: `You are in ${here}. Renata wants the file in Schedules. Open the Schedules folder, then upload.`,
      es: `Estás en ${here}. Renata quiere el archivo en Schedules. Abre la carpeta Schedules y después sube el archivo.`,
    };
  }
  return {
    en: `Read the week at the top of the page. Renata sent next week's schedule, Week of ${NEXT.en}.`,
    es: `Lee la semana arriba de la página. Renata envió el horario de la próxima semana, Week of ${NEXT.en} (semana del ${NEXT.es}).`,
  };
}

// --- Copy ------------------------------------------------------------------

export const UPLOAD_COPY: Record<Lang, {
  download: string;
  downloaded: string;
  openDrive: string;
  attachmentLabel: string;
  fileUpload: string;
  newFolder: string;
  newFolderNote: string;
  pickerTitle: string;
  downloads: string;
  colName: string;
  colDate: string;
  pickerEmpty: string;
  upload: string;
  cancel: string;
  uploadedStatus: string;
  doneKicker: string;
  doneTitle: string;
  doneBody: string;
  badgeName: string;
  badgeWhere: string;
  tryAgain: string;
  backToDesk: string;
  lessonKicker: string;
  tipLabel: string;
  gotIt: string;
}> = {
  en: {
    download: "Download",
    downloaded: "Saved to Downloads",
    openDrive: "Open Drive",
    attachmentLabel: "Attachment",
    fileUpload: "File upload",
    newFolder: "New folder",
    newFolderNote: "Renata did not ask for a new folder. The Schedules folder is already there.",
    pickerTitle: "Choose a file to upload",
    downloads: "Downloads",
    colName: "Name",
    colDate: "Date",
    pickerEmpty: "Click a file to see it here.",
    upload: "Upload",
    cancel: "Cancel",
    uploadedStatus: "1 upload complete",
    doneKicker: "Uploaded",
    doneTitle: "You downloaded next week's schedule and uploaded it to the Schedules folder.",
    doneBody: "The crew can find it in Drive now. You chose the file by reading the week on the page, not only the name.",
    badgeName: "Download a file and upload it to the right folder",
    badgeWhere: "Counts toward: Office Ready · Food Service Ready",
    tryAgain: "Do it again",
    backToDesk: "Back to desktop",
    lessonKicker: "2-minute lesson",
    tipLabel: "Tip",
    gotIt: "Got it. Back to my task",
  },
  es: {
    download: "Descargar",
    downloaded: "Guardado en Descargas",
    openDrive: "Abrir Drive",
    attachmentLabel: "Adjunto",
    fileUpload: "Subir archivo",
    newFolder: "Carpeta nueva",
    newFolderNote: "Renata no pidió una carpeta nueva. La carpeta Schedules ya existe.",
    pickerTitle: "Elige un archivo para subir",
    downloads: "Descargas",
    colName: "Nombre",
    colDate: "Fecha",
    pickerEmpty: "Haz clic en un archivo para verlo aquí.",
    upload: "Subir",
    cancel: "Cancelar",
    uploadedStatus: "1 archivo subido",
    doneKicker: "Subido",
    doneTitle: "Descargaste el horario de la próxima semana y lo subiste a la carpeta Schedules.",
    doneBody: "Ahora el equipo lo puede encontrar en Drive. Elegiste el archivo leyendo la semana en la página, no solo el nombre.",
    badgeName: "Descargar un archivo y subirlo a la carpeta correcta",
    badgeWhere: "Cuenta para: Oficina · Servicio de alimentos",
    tryAgain: "Hacerlo otra vez",
    backToDesk: "Volver al escritorio",
    lessonKicker: "Lección de 2 minutos",
    tipLabel: "Consejo",
    gotIt: "Entendido. Volver a mi tarea",
  },
};

export const LESSONS: Record<Lang, Lesson[]> = {
  en: [
    {
      t: "Download and upload",
      s: [
        "Download saves a copy of a file on your computer. It goes to the Downloads folder.",
        "Upload sends a file from your computer to a website, like Drive.",
        "In Drive, open the folder first. Then click New and File upload. The file goes to the folder you are in.",
      ],
      tip: "Two files can have almost the same name. Open the file and read the page before you upload it.",
    },
  ],
  es: [
    {
      t: "Descargar y subir",
      s: [
        "Descargar guarda una copia del archivo en tu computadora. Va a la carpeta Descargas.",
        "Subir envía un archivo de tu computadora a un sitio web, como Drive.",
        "En Drive, primero abre la carpeta. Después haz clic en Nuevo y Subir archivo. El archivo va a la carpeta donde estás.",
      ],
      tip: "Dos archivos pueden tener casi el mismo nombre. Abre el archivo y lee la página antes de subirlo.",
    },
  ],
};
