import type { TaskKey } from "@/lib/desktop-content";
import type { Lang, Localized } from "@/lib/task-types";
import type { LessonMode } from "./types";

export const CONFIDENCE_KEYS = ["mail-reply", "mail-attach", "files", "schedule", "calendar", "account-recovery", "spreadsheet", "coursework"] as const satisfies readonly TaskKey[];
export type ConfidenceKey = (typeof CONFIDENCE_KEYS)[number];
export const SCENARIOS = ["classroom", "try", "home"] as const;
export type LessonScenario = (typeof SCENARIOS)[number];
export const l = (en: string, es: string): Localized => ({ en, es });
export const CONFIDENCE_TITLE = l("Everyday digital confidence", "Confianza digital para cada día");
export const SCENARIO_LABELS = { classroom: l("Classroom practice", "Práctica en clase"), try: l("Try changed facts", "Probar con otros datos"), home: l("Home practice", "Práctica en casa") };
export function isConfidenceKey(key: string): key is ConfidenceKey { return (CONFIDENCE_KEYS as readonly string[]).includes(key); }
export function parseScenario(raw?: string): LessonScenario | null { return raw === undefined ? "classroom" : SCENARIOS.find(s => s === raw) ?? null; }
export function scenarioHref(key: TaskKey, scenario: LessonScenario, lang: Lang, mode: LessonMode, preview = false): string {
  const query = new URLSearchParams({ scenario, lang, mode });
  if (preview) query.set("preview", "1");
  return `/lessons/${key}?${query}`;
}
export type LessonSequence = {
  objective: Localized;
  evidence: Localized;
  model: Localized;
  google: Localized;
  scenarios: readonly LessonScenario[];
  timing: Localized;
  reflection: Localized;
  homePractice: Localized;
};
const common = {
  scenarios: SCENARIOS,
  timing: l("Model: 3 minutes. Practice: 8–10. Changed facts: 3–5. Reflect: 2. Split across sessions if needed; there is no timer.", "Modelo: 3 minutos. Práctica: 8–10. Otros datos: 3–5. Reflexión: 2. Divida entre sesiones si hace falta; no hay límite de tiempo."),
  reflection: l("What did you check? What would you try if something went wrong? You can point, speak, or write.", "¿Qué revisaste? ¿Qué intentarías si algo saliera mal? Puedes señalar, hablar o escribir."),
  homePractice: l("Open Home practice for a different example (about 5–10 minutes). Help stays available. Revisit the skill together several days later.", "Abre Práctica en casa para otro ejemplo (unos 5–10 minutos). La ayuda sigue disponible. Vuelvan a practicar juntos varios días después."),
};
export const CONFIDENCE_SEQUENCES: Record<ConfidenceKey, LessonSequence> = {
  "mail-reply": { ...common,
    objective: l("Reply to the question in an email.", "Responder la pregunta de un correo."),
    evidence: l("Checks who will receive the reply and includes the requested fact.", "Revisa quién recibirá la respuesta e incluye el dato solicitado."),
    model: l("Use a separate example: a teacher asks which room you need. Think aloud while checking the room number and recipient before sending.", "Use otro ejemplo: un docente pregunta qué aula necesita. Explique cómo revisa el número y el destinatario antes de enviar."),
    google: l("In Gmail, reply to your teacher's practice message: ‘Which room is our class in?’ Use the fictional room 12. Check the recipient and Sent folder.", "En Gmail, responda al mensaje de práctica de su docente: «¿En qué aula es la clase?». Use el aula ficticia 12. Revise el destinatario y Enviados.") },
  "mail-attach": { ...common,
    objective: l("Send the requested file as an attachment.", "Enviar el archivo solicitado como adjunto."),
    evidence: l("Checks the file version, removes a wrong attachment, and checks the sent result.", "Revisa la versión del archivo, quita un adjunto incorrecto y revisa el envío."),
    model: l("Show two sample files, Club-draft.pdf and Club-final.pdf. Attach the draft, notice the request says final, then remove and replace it.", "Muestre Club-draft.pdf y Club-final.pdf. Adjunte el borrador, note que se pidió la versión final, quítelo y reemplácelo."),
    google: l("The teacher supplies Club-draft.pdf and Club-final.pdf containing fictional club meeting details. Attach Club-final.pdf to a Gmail message to the teacher's designated practice address. Reopen the sent attachment.", "El docente proporciona Club-draft.pdf y Club-final.pdf con datos ficticios de una reunión. Adjunte Club-final.pdf en Gmail a la dirección de práctica del docente. Abra el adjunto enviado.") },
  files: { ...common,
    objective: l("Find, rename, and share a file with suitable access.", "Buscar, renombrar y compartir un archivo con el acceso adecuado."),
    evidence: l("Checks the document before renaming and chooses Viewer when the recipient only needs to read.", "Revisa el documento antes de renombrarlo y elige Lector cuando solo se necesita leer."),
    model: l("Use a fictional club agenda. Explain how a name identifies its purpose and date, and how Viewer differs from Editor.", "Use una agenda ficticia de un club. Explique cómo el nombre indica su propósito y fecha, y la diferencia entre Lector y Editor."),
    google: l("Make a practice Google Doc called Club notes. Rename it Club-November-notes. Share it with the designated teacher account as Viewer; reopen Share to verify access.", "Cree un documento de práctica llamado Club notes. Cámbiele el nombre a Club-November-notes. Compártalo con la cuenta del docente como Lector y vuelva a abrir Compartir para revisar el acceso.") },
  schedule: { ...common,
    objective: l("Read a schedule and find a time conflict.", "Leer un horario y encontrar un conflicto."),
    evidence: l("Compares the day and both time ranges before requesting a workable change.", "Compara el día y ambos intervalos de horas antes de pedir un cambio posible."),
    model: l("Show a sample Tuesday class from 10–12 and an appointment at 11. Compare an afternoon class before requesting a change.", "Muestre una clase de ejemplo el martes de 10 a 12 y una cita a las 11. Compare una clase por la tarde antes de pedir un cambio."),
    google: l("On a teacher-provided Google Calendar practice calendar, compare Tuesday class 10 AM–noon with an 11 AM appointment. In a practice Doc, record the conflict and propose the available 2–4 PM class.", "En un calendario de práctica de Google, compare una clase el martes de 10 a 12 con una cita a las 11. En un documento de práctica, anote el conflicto y proponga la clase disponible de 2 a 4 p. m.") },
  calendar: { ...common,
    objective: l("Propose a meeting time that fits the calendar.", "Proponer una hora de reunión que quepa en el calendario."),
    evidence: l("Checks the whole meeting duration and verifies the proposed day and time.", "Revisa la duración completa y verifica el día y la hora propuestos."),
    model: l("Model a 30-minute meeting overlapping lunch at noon. Find a full 30-minute opening at 1 PM and review before sending.", "Modele una reunión de 30 minutos durante el almuerzo al mediodía. Busque 30 minutos libres a la 1 p. m. y revise antes de enviar."),
    google: l("The teacher sends a fictional 30-minute club invitation during a practice lunch event. Propose 1 PM in Google Calendar if available in the school account, or reply to the designated teacher with that proposal. Verify the response.", "El docente envía una invitación ficticia de 30 minutos durante un almuerzo de práctica. Proponga la 1 p. m. en Google Calendar si la cuenta escolar lo permite, o responda al docente con esa propuesta. Revise la respuesta.") },
  "account-recovery": { ...common,
    objective: l("Use the current sign-in code from a text message.", "Usar el código actual de un mensaje de texto."),
    evidence: l("Distinguishes an older code from the current requested code and corrects an incorrect entry.", "Distingue un código anterior del actual solicitado y corrige un ingreso incorrecto."),
    model: l("On paper, show an old code 234567 and a new code 765432. Model checking the time before typing. Never use a student's real code.", "En papel, muestre el código anterior 234567 y el nuevo 765432. Modele cómo revisar la hora antes de escribir. Nunca use un código real del estudiante."),
    google: l("Keep this activity in the simulator. Discuss where the code appeared and why real passwords and verification codes are private. Do not request real account recovery or share real codes.", "Mantenga esta actividad en el simulador. Conversen sobre dónde apareció el código y por qué las contraseñas y los códigos reales son privados. No pida recuperar cuentas ni compartir códigos reales.") },
  spreadsheet: { ...common,
    objective: l("Enter values in the correct cells and check the total.", "Ingresar valores en las celdas correctas y revisar el total."),
    evidence: l("Matches each source row to its cell, corrects a value, and checks the total against the source.", "Relaciona cada fila con su celda, corrige un valor y revisa el total con la fuente."),
    model: l("Use a separate snack list: apples 4, bananas 6. Enter the values, deliberately put 6 in the wrong row, and demonstrate checking and correcting.", "Use otra lista: manzanas 4, bananas 6. Ingrese los valores, ponga 6 en la fila incorrecta y muestre cómo revisar y corregir."),
    google: l("Create a Google Sheet with Apples and Bananas in A2:A3. Enter fictional counts 4 and 6 in B2:B3. Put =SUM(B2:B3) in B4. Check the total is 10 and correct a deliberately changed value.", "Cree una hoja de Google con Manzanas y Bananas en A2:A3. Ingrese 4 y 6 en B2:B3. Escriba =SUM(B2:B3) en B4. Compruebe que el total es 10 y corrija un valor cambiado a propósito.") },
  coursework: { ...common,
    objective: l("Find a deadline and submit the requested document.", "Encontrar una fecha de entrega y entregar el documento solicitado."),
    evidence: l("Reads the assignment details, selects the completed document, and verifies submission status.", "Lee los detalles, selecciona el documento terminado y verifica el estado de entrega."),
    model: l("Show a sample reading-log assignment due November 6. Compare a draft with a completed file and model checking the submitted status.", "Muestre una tarea de lectura para el 6 de noviembre. Compare un borrador con un archivo terminado y revise el estado de entrega."),
    google: l("The teacher creates a practice Classroom assignment, or a designated Drive folder, due November 6. Submit a fictional completed reading log and check Turned in or the uploaded file. Classroom requires access provided by the school.", "El docente crea una tarea de práctica en Classroom o una carpeta de Drive para el 6 de noviembre. Entregue un registro ficticio de lectura terminado y revise Entregado o el archivo subido. Classroom requiere acceso escolar.") },
};
