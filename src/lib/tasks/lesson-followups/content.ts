import type { TaskKey } from "@/lib/desktop-content";
import type { Localized } from "@/lib/task-types";

const l = (en: string, es: string): Localized => ({ en, es });
export type PracticeOption = { id: string; label: Localized; correction?: Localized };
export type PracticeField = { id: string; label: Localized; options: PracticeOption[]; answer: string; initial?: string };
export type PracticeRound = {
  id: string;
  title: Localized;
  goal: Localized;
  guidance: Localized;
  sources: { title: Localized; lines: Localized[] }[];
  fields: PracticeField[];
  action: Localized;
  help: Localized;
};
const option = (id: string, en: string, es: string, hintEn?: string, hintEs?: string): PracticeOption => ({
  id, label: l(en, es), ...(hintEn && hintEs ? { correction: l(hintEn, hintEs) } : {}),
});

/** New facts for transfer practice. These never replace Story's answer keys. */
export const FOLLOWUP_ROUNDS: Partial<Record<TaskKey, PracticeRound[]>> = {
  "appointment-scheduling": [
    {
      id: "appointment-duration", title: l("Tuesday · Elena's appointment", "Martes · La cita de Elena"),
      goal: { en: "Read Elena’s message and the calendar. Select a start and end time for her whole visit. Click Review, check the details, then click Save and confirm.", es: "Lee el mensaje de Elena y la agenda. Selecciona la hora de inicio y fin de su visita completa. Haz clic en Revisar, comprueba los datos y después haz clic en Guardar y confirmar." },
      guidance: { en: "Read Elena’s message and the calendar. Select a start and end time for her whole visit. Click Review, check the details, then click Save and confirm.", es: "Lee el mensaje de Elena y la agenda. Selecciona la hora de inicio y fin de su visita completa. Haz clic en Revisar, comprueba los datos y después haz clic en Guardar y confirmar." },
      sources: [
        { title: l("Phone message · Elena Ortiz", "Mensaje telefónico · Elena Ortiz"), lines: [l("Tuesday, September 8. I can arrive at 2:00 PM. I must leave by 3:00 PM. My visit takes 30 minutes.", "Martes 8 de septiembre. Puedo llegar a las 2:00 p. m. Debo salir antes de las 3:00 p. m. Mi visita dura 30 minutos.")] },
        { title: l("Tuesday calendar", "Agenda del martes"), lines: [l("2:00–2:15 PM · Open", "2:00–2:15 p. m. · Libre"), l("2:15–2:30 PM · Staff meeting", "2:15–2:30 p. m. · Reunión del personal"), l("2:30–3:00 PM · Open", "2:30–3:00 p. m. · Libre"), l("3:00–3:30 PM · Open", "3:00–3:30 p. m. · Libre")] },
      ],
      fields: [
        { id: "start", label: l("Start time", "Hora de inicio"), answer: "230", options: [option("200", "2:00 PM", "2:00 p. m.", "Only 15 minutes are free at 2:00. Elena needs 30 minutes.", "Solo hay 15 minutos libres a las 2:00. Elena necesita 30 minutos."), option("230", "2:30 PM", "2:30 p. m."), option("300", "3:00 PM", "3:00 p. m.", "Elena must leave by 3:00. Compare her available hours with the calendar.", "Elena debe salir antes de las 3:00. Compara sus horas disponibles con la agenda.")] },
        { id: "end", label: l("End time", "Hora de finalización"), answer: "300", options: [option("245", "2:45 PM", "2:45 p. m.", "A visit from 2:30 to 2:45 is only 15 minutes.", "Una visita de 2:30 a 2:45 dura solo 15 minutos."), option("330", "3:30 PM", "3:30 p. m.", "Elena cannot stay after 3:00.", "Elena no puede quedarse después de las 3:00."), option("300", "3:00 PM", "3:00 p. m.")] },
      ], action: l("Save and confirm", "Guardar y confirmar"), help: l("A free start time is not enough. The whole visit must fit before the next booking and before the patient has to leave.", "No basta con que el inicio esté libre. La visita completa debe caber antes de la próxima reserva y antes de que la paciente deba salir."),
    },
    {
      id: "appointment-no-slot", title: l("Wednesday · Elena requests a change", "Miércoles · Elena pide un cambio"),
      goal: { en: "Read Elena’s new message and Wednesday’s calendar. Choose what to do with Tuesday’s appointment and what to tell Elena. Click Review, check the details, then click Update and send.", es: "Lee el nuevo mensaje de Elena y la agenda del miércoles. Elige qué hacer con la cita del martes y qué decirle a Elena. Haz clic en Revisar, comprueba los datos y después haz clic en Actualizar y enviar." },
      guidance: { en: "Read Elena’s new message and Wednesday’s calendar. Choose what to do with Tuesday’s appointment and what to tell Elena. Click Review, check the details, then click Update and send.", es: "Lee el nuevo mensaje de Elena y la agenda del miércoles. Elige qué hacer con la cita del martes y qué decirle a Elena. Haz clic en Revisar, comprueba los datos y después haz clic en Actualizar y enviar." },
      sources: [
        { title: l("New message · Elena Ortiz", "Nuevo mensaje · Elena Ortiz"), lines: [l("I cannot come Tuesday. Please cancel that visit. Can I come Wednesday between 9:00 and 10:00 AM? I still need 30 minutes.", "No puedo ir el martes. Cancelen esa cita, por favor. ¿Puedo ir el miércoles entre las 9:00 y las 10:00 a. m.? Todavía necesito 30 minutos.")] },
        { title: l("Wednesday calendar", "Agenda del miércoles"), lines: [l("9:00–9:45 AM · Booked", "9:00–9:45 a. m. · Reservado"), l("9:45–10:00 AM · Open", "9:45–10:00 a. m. · Libre"), l("10:00–10:30 AM · Open", "10:00–10:30 a. m. · Libre")] },
      ], fields: [
        { id: "existing", label: l("Tuesday appointment", "Cita del martes"), answer: "cancel", options: [option("keep", "Keep it booked", "Mantenerla reservada", "Elena explicitly asked to cancel Tuesday's visit.", "Elena pidió cancelar la cita del martes."), option("cancel", "Cancel as requested", "Cancelar como pidió")] },
        { id: "reply", label: l("Message to Elena", "Mensaje para Elena"), answer: "ask", options: [option("945", "Tuesday is canceled. You are booked Wednesday at 9:45 AM.", "El martes está cancelado. Tiene cita el miércoles a las 9:45 a. m.", "That visit would end at 10:15, after Elena's available hours.", "Esa visita terminaría a las 10:15, después de las horas disponibles de Elena."), option("ask", "Tuesday is canceled. No 30-minute time fits. What other day or time works for you?", "El martes está cancelado. No hay 30 minutos disponibles en ese horario. ¿Qué otro día u hora le sirve?"), option("10", "Tuesday is canceled. You are booked Wednesday at 10:00 AM.", "El martes está cancelado. Tiene cita el miércoles a las 10:00 a. m.", "An open time is not necessarily a time Elena can attend. She is only available before 10:00.", "Una hora libre no siempre le sirve a Elena. Solo está disponible antes de las 10:00.")] },
      ], action: l("Update and send", "Actualizar y enviar"), help: l("When no whole visit fits, ask for another day or time. Do not invent availability. Handle an explicit cancellation separately.", "Cuando la visita completa no cabe, pregunta por otro día u hora. No inventes disponibilidad. Atiende por separado una cancelación explícita."),
    },
  ],
  files: [
    {
      id: "files-current", title: l("Harbor Hotel · Room checklist", "Hotel Harbor · Lista de habitaciones"),
      goal: { en: "Read Luis’s request and the file details. Choose the file and access he needs. Click Review, check the details, then click Share.", es: "Lee la solicitud de Luis y los detalles de los archivos. Elige el archivo y el acceso que necesita. Haz clic en Revisar, comprueba los datos y después haz clic en Compartir." },
      guidance: { en: "Read Luis’s request and the file details. Choose the file and access he needs. Click Review, check the details, then click Share.", es: "Lee la solicitud de Luis y los detalles de los archivos. Elige el archivo y el acceso que necesita. Haz clic en Revisar, comprueba los datos y después haz clic en Compartir." },
      sources: [
        { title: l("Message · Luis, housekeeping lead", "Mensaje · Luis, encargado de limpieza"), lines: [l("Please share the approved September room checklist. I only need to read it. The October draft is still being reviewed.", "Comparte la lista aprobada de habitaciones de septiembre. Solo necesito leerla. El borrador de octubre sigue en revisión.")] },
        { title: l("Shared folder · File details", "Carpeta compartida · Detalles"), lines: [l("Rooms-Aug.pdf · Approved · August", "Rooms-Aug.pdf · Aprobado · Agosto"), l("Rooms-Sep.pdf · Approved · September", "Rooms-Sep.pdf · Aprobado · Septiembre"), l("Rooms-Oct-draft.pdf · Draft · October", "Rooms-Oct-draft.pdf · Borrador · Octubre")] },
      ], fields: [
        { id: "file", label: l("File", "Archivo"), answer: "sep", options: [option("oct", "Rooms-Oct-draft.pdf", "Rooms-Oct-draft.pdf", "The newer file is a draft. Luis requested the approved September version.", "El archivo más nuevo es un borrador. Luis pidió la versión aprobada de septiembre."), option("aug", "Rooms-Aug.pdf", "Rooms-Aug.pdf", "This approved file is for August. Check the requested month.", "Este archivo aprobado es de agosto. Revisa el mes solicitado."), option("sep", "Rooms-Sep.pdf", "Rooms-Sep.pdf")] },
        { id: "access", label: l("Luis's access", "Acceso de Luis"), answer: "view", options: [option("edit", "Editor", "Editor", "Luis only needs to read. Editing access would also let him change the checklist.", "Luis solo necesita leer. El acceso de edición también le permitiría cambiar la lista."), option("view", "Viewer", "Lector")] },
      ], action: l("Share", "Compartir"), help: l("Check the month and approval status inside the file details. Give the person the access their work requires.", "Revisa el mes y la aprobación en los detalles del archivo. Da a la persona el acceso que necesita para su trabajo."),
    },
    {
      id: "files-access", title: l("Harbor Hotel · Access request", "Hotel Harbor · Solicitud de acceso"),
      goal: { en: "Read the manager’s message and access request. Choose the person and permission. Click Review, check the details, then click Save access.", es: "Lee el mensaje de la gerente y la solicitud de acceso. Elige la persona y el permiso. Haz clic en Revisar, comprueba los datos y después haz clic en Guardar acceso." },
      guidance: { en: "Read the manager’s message and access request. Choose the person and permission. Click Review, check the details, then click Save access.", es: "Lee el mensaje de la gerente y la solicitud de acceso. Elige la persona y el permiso. Haz clic en Revisar, comprueba los datos y después haz clic en Guardar acceso." },
      sources: [
        { title: l("Message · Hotel manager", "Mensaje · Gerente del hotel"), lines: [l("Priya on our team needs to correct room numbers in Rooms-Sep.pdf. Her work account is priya@harbor.example. Keep this file restricted to named staff.", "Priya, de nuestro equipo, necesita corregir números de habitaciones en Rooms-Sep.pdf. Su cuenta de trabajo es priya@harbor.example. Mantén el archivo restringido al personal indicado.")] },
        { title: l("Access request · Rooms-Sep.pdf", "Solicitud de acceso · Rooms-Sep.pdf"), lines: [l("Priya: I opened the link with my work account. It says I need access.", "Priya: Abrí el enlace con mi cuenta de trabajo. Dice que necesito acceso."), l("Current access: Restricted · Luis: Viewer", "Acceso actual: Restringido · Luis: Lector")] },
      ], fields: [
        { id: "person", label: l("New access for", "Nuevo acceso para"), answer: "priya", options: [option("anyone", "Anyone with the link", "Cualquier persona con el enlace", "The manager asked to keep access restricted to named staff.", "La gerente pidió mantener el acceso restringido al personal indicado."), option("priya", "priya@harbor.example", "priya@harbor.example"), option("luis", "Luis", "Luis", "Luis already has access. Priya is the person who cannot open the file.", "Luis ya tiene acceso. Priya es quien no puede abrir el archivo.")] },
        { id: "access", label: l("Permission", "Permiso"), answer: "edit", options: [option("view", "Viewer", "Lector", "Priya is authorized to correct room numbers. Viewer access will not let her make changes.", "Priya tiene autorización para corregir números de habitaciones. El acceso de lectura no le permite hacer cambios."), option("edit", "Editor", "Editor")] },
      ], action: l("Save access", "Guardar acceso"), help: l("A link does not grant access by itself. Match the named account and the permission to the authorized work. Viewer is not always the right choice.", "Un enlace no da acceso por sí solo. Comprueba la cuenta indicada y el permiso necesario para el trabajo autorizado. Lector no siempre es la opción correcta."),
    },
  ],
  "mail-attach": [
    {
      id: "attachment-replace", title: l("WorkMail · Revised stock count", "WorkMail · Conteo de existencias corregido"),
      goal: { en: "Read Nia’s request and the file details. Replace the old attachment and choose a reply. Click Review, check the details, then click Send reply.", es: "Lee la solicitud de Nia y los detalles de los archivos. Reemplaza el adjunto viejo y elige una respuesta. Haz clic en Revisar, comprueba los datos y después haz clic en Enviar respuesta." },
      guidance: { en: "Read Nia’s request and the file details. Replace the old attachment and choose a reply. Click Review, check the details, then click Send reply.", es: "Lee la solicitud de Nia y los detalles de los archivos. Reemplaza el adjunto viejo y elige una respuesta. Haz clic en Revisar, comprueba los datos y después haz clic en Enviar respuesta." },
      sources: [
        { title: l("From · Nia, stockroom lead", "De · Nia, encargada del almacén"), lines: [l("The August count in your draft is out of date. Please replace it with the approved September count. Send only one file.", "El conteo de agosto de tu borrador está desactualizado. Reemplázalo con el conteo aprobado de septiembre. Envía solo un archivo.")] },
        { title: l("Files · Stock counts", "Archivos · Conteos"), lines: [l("Stock-Aug.pdf · August · Approved", "Stock-Aug.pdf · Agosto · Aprobado"), l("Stock-Sep-draft.pdf · September · Not approved", "Stock-Sep-draft.pdf · Septiembre · Sin aprobar"), l("Stock-Sep.pdf · September · Approved", "Stock-Sep.pdf · Septiembre · Aprobado")] },
      ], fields: [
        { id: "attachment", label: l("Attachment", "Adjunto"), initial: "aug", answer: "sep", options: [option("aug", "Stock-Aug.pdf", "Stock-Aug.pdf", "August is still attached. Remove it and attach the approved September file.", "Agosto sigue adjunto. Quítalo y adjunta el archivo aprobado de septiembre."), option("draft", "Stock-Sep-draft.pdf", "Stock-Sep-draft.pdf", "This September file has not been approved. Compare its status with the other September file.", "Este archivo de septiembre no está aprobado. Compara su estado con el otro archivo de septiembre."), option("sep", "Stock-Sep.pdf", "Stock-Sep.pdf")] },
        { id: "message", label: l("Reply to Nia", "Respuesta para Nia"), answer: "replaced", options: [option("both", "I attached both months so you can choose.", "Adjunté ambos meses para que elijas.", "Nia requested one current file. Your message should describe the replacement you actually attached.", "Nia pidió un archivo vigente. Tu mensaje debe describir el reemplazo que adjuntaste."), option("replaced", "I replaced the August file with the approved September count.", "Reemplacé el archivo de agosto con el conteo aprobado de septiembre.")] },
      ], action: l("Send reply", "Enviar respuesta"), help: l("An email draft can still contain the old attachment. Check the actual attachment as well as the message before sending.", "Un borrador de correo puede conservar el adjunto viejo. Revisa el adjunto real y el mensaje antes de enviar."),
    },
    {
      id: "attachment-missing", title: l("WorkMail · Missing approved file", "WorkMail · Falta el archivo aprobado"),
      goal: { en: "Read Omar’s request and check the files. Choose whether to attach a file and what to tell Omar. Click Review, check the details, then click Send reply.", es: "Lee la solicitud de Omar y revisa los archivos. Elige si vas a adjuntar un archivo y qué decirle a Omar. Haz clic en Revisar, comprueba los datos y después haz clic en Enviar respuesta." },
      guidance: { en: "Read Omar’s request and check the files. Choose whether to attach a file and what to tell Omar. Click Review, check the details, then click Send reply.", es: "Lee la solicitud de Omar y revisa los archivos. Elige si vas a adjuntar un archivo y qué decirle a Omar. Haz clic en Revisar, comprueba los datos y después haz clic en Enviar respuesta." },
      sources: [
        { title: l("From · Omar, supervisor", "De · Omar, supervisor"), lines: [l("Please send the approved October inspection report. Do not send a draft. If it is missing, ask me for the approved copy.", "Envía el informe aprobado de inspección de octubre. No envíes un borrador. Si falta, pídeme la copia aprobada.")] },
        { title: l("Folder · Inspection reports", "Carpeta · Informes de inspección"), lines: [l("Inspection-Sep.pdf · Approved · September", "Inspection-Sep.pdf · Aprobado · Septiembre"), l("Inspection-Oct-draft.pdf · Draft · October", "Inspection-Oct-draft.pdf · Borrador · Octubre")] },
      ], fields: [
        { id: "attachment", label: l("Attachment", "Adjunto"), answer: "none", options: [option("none", "No attachment", "Sin adjunto"), option("sep", "Inspection-Sep.pdf", "Inspection-Sep.pdf", "This is approved, but it is for September. Omar asked for October.", "Está aprobado, pero es de septiembre. Omar pidió octubre."), option("draft", "Inspection-Oct-draft.pdf", "Inspection-Oct-draft.pdf", "Omar said not to send a draft. The approved October file is missing.", "Omar dijo que no enviaras un borrador. Falta el archivo aprobado de octubre.")] },
        { id: "message", label: l("Reply to Omar", "Respuesta para Omar"), answer: "ask", options: [option("attached", "The approved October report is attached.", "Adjunto el informe aprobado de octubre.", "There is no approved October report in the folder. Do not say you attached it.", "No hay un informe aprobado de octubre en la carpeta. No digas que lo adjuntaste."), option("ask", "I found only the October draft. Can you send me the approved copy?", "Solo encontré el borrador de octubre. ¿Puedes enviarme la copia aprobada?"), option("later", "I will send it later today.", "Lo enviaré más tarde hoy.", "You do not have the approved copy yet. Ask Omar for it instead of promising a delivery time.", "Todavía no tienes la copia aprobada. Pídesela a Omar en vez de prometer una hora de entrega.")] },
      ], action: l("Send reply", "Enviar respuesta"), help: l("Sometimes the correct response has no attachment. Explain what is missing and ask the person who can supply it.", "A veces la respuesta correcta no lleva adjunto. Explica qué falta y pídeselo a quien puede proporcionarlo."),
    },
  ],
  "call-out-sick": [
    {
      id: "absence-policy", title: l("Harbor Hotel · Today's shift", "Hotel Harbor · Turno de hoy"),
      goal: { en: "Read the shift note and hotel contact rule. Choose whom to contact and what to say. Click Review, check the details, then click Place simulated call.", es: "Lee la nota del turno y la regla de contacto del hotel. Elige a quién contactar y qué decir. Haz clic en Revisar, comprueba los datos y después haz clic en Hacer llamada simulada." },
      guidance: { en: "Read the shift note and hotel contact rule. Choose whom to contact and what to say. Click Review, check the details, then click Place simulated call.", es: "Lee la nota del turno y la regla de contacto del hotel. Elige a quién contactar y qué decir. Haz clic en Revisar, comprueba los datos y después haz clic en Hacer llamada simulada." },
      sources: [
        { title: l("Your shift note", "Tu nota del turno"), lines: [l("It is 8:10 AM on Friday. Your shift starts today at 9:00 AM. You are sick and cannot work today.", "Son las 8:10 a. m. del viernes. Tu turno comienza hoy a las 9:00 a. m. Te sientes mal y no puedes trabajar hoy.")] },
        { title: l("Hotel contact rule", "Regla de contacto del hotel"), lines: [l("If your shift starts in less than two hours, call the duty manager. Otherwise, email the duty manager. The team chat is not an absence report.", "Si faltan menos de dos horas para tu turno, llama a la gerente de guardia. Si falta más tiempo, envíale un correo. El chat del equipo no cuenta como aviso de ausencia."), l("Duty manager today: Rosa. State the shift you will miss. Medical details are not required.", "Gerente de guardia hoy: Rosa. Indica a qué turno faltarás. No se requieren detalles médicos.")] },
      ], fields: [
        { id: "contact", label: l("Contact", "Contacto"), answer: "call", options: [option("email", "Email Rosa", "Enviar un correo a Rosa", "There are only 50 minutes before the shift. This hotel's rule calls for a phone call.", "Solo faltan 50 minutos para el turno. La regla de este hotel requiere una llamada."), option("chat", "Post in the team chat", "Publicar en el chat del equipo", "The team chat does not count as an absence report under this rule.", "El chat del equipo no cuenta como aviso de ausencia según esta regla."), option("call", "Call Rosa", "Llamar a Rosa")] },
        { id: "message", label: l("Call message", "Mensaje de la llamada"), answer: "shift", options: [option("sick", "Hi Rosa, I feel sick.", "Hola Rosa, me siento mal.", "Rosa still needs to know you cannot work and which shift you will miss.", "Rosa todavía necesita saber que no puedes trabajar y a qué turno faltarás."), option("shift", "Hi Rosa, I am sick and cannot work my 9:00 AM shift today.", "Hola Rosa, estoy enfermo/a y no puedo trabajar mi turno de las 9:00 a. m. de hoy."), option("tomorrow", "Hi Rosa, I cannot work tomorrow's 9:00 AM shift.", "Hola Rosa, no puedo trabajar el turno de mañana a las 9:00 a. m.", "Your note is about today's shift, not tomorrow's.", "Tu nota es sobre el turno de hoy, no el de mañana.")] },
      ], action: l("Place simulated call", "Hacer llamada simulada"), help: l("Workplaces have different contact rules. Use the rule in this scenario, name the affected shift, and state whether you can attend.", "Los lugares de trabajo tienen distintas reglas de contacto. Usa la regla de esta situación, indica el turno afectado y si puedes asistir."),
    },
    {
      id: "absence-no-answer", title: l("Harbor Hotel · No answer", "Hotel Harbor · Sin respuesta"),
      goal: { en: "Read the call log and follow-up rule. Choose the next contact and message. Click Review, check the details, then click Place simulated call.", es: "Lee el registro de llamadas y la regla de seguimiento. Elige el próximo contacto y el mensaje. Haz clic en Revisar, comprueba los datos y después haz clic en Hacer llamada simulada." },
      guidance: { en: "Read the call log and follow-up rule. Choose the next contact and message. Click Review, check the details, then click Place simulated call.", es: "Lee el registro de llamadas y la regla de seguimiento. Elige el próximo contacto y el mensaje. Haz clic en Revisar, comprueba los datos y después haz clic en Hacer llamada simulada." },
      sources: [
        { title: l("Call log · Friday, 8:12 AM", "Registro de llamadas · Viernes, 8:12 a. m."), lines: [l("Rosa · No answer. You left a voicemail: I cannot work my 9:00 AM shift today.", "Rosa · Sin respuesta. Dejaste un mensaje: No puedo trabajar mi turno de las 9:00 a. m. de hoy.")] },
        { title: l("Hotel follow-up rule", "Regla de seguimiento del hotel"), lines: [l("If the duty manager does not answer, leave a voicemail and call the front desk. Ask the front desk to notify the duty manager. A voicemail is not a confirmation.", "Si la gerente de guardia no contesta, deja un mensaje y llama a recepción. Pide que avisen a la gerente de guardia. Un mensaje de voz no es una confirmación.")] },
      ], fields: [
        { id: "contact", label: l("Next contact", "Próximo contacto"), answer: "desk", options: [option("wait", "Wait until tomorrow", "Esperar hasta mañana", "Your shift starts today at 9:00. The rule gives a next contact when Rosa does not answer.", "Tu turno comienza hoy a las 9:00. La regla indica a quién contactar cuando Rosa no contesta."), option("desk", "Call the front desk", "Llamar a recepción"), option("coworker", "Message a coworker only", "Escribir solo a un compañero", "A coworker message does not follow the hotel's follow-up rule.", "Un mensaje a un compañero no cumple la regla de seguimiento del hotel.")] },
        { id: "message", label: l("Handoff message", "Mensaje de aviso"), answer: "pending", options: [option("approved", "Rosa approved my absence for today.", "Rosa aprobó mi ausencia de hoy.", "Rosa has not answered. Do not claim she approved or confirmed anything.", "Rosa no ha contestado. No digas que aprobó o confirmó nada."), option("pending", "I left Rosa a voicemail. I cannot work at 9:00 today. Please notify her.", "Le dejé un mensaje a Rosa. No puedo trabajar hoy a las 9:00. Por favor, avísenle.")] },
      ], action: l("Place simulated call", "Hacer llamada simulada"), help: l("Separate what you did from what someone confirmed. A sent message or voicemail does not mean the person has read or heard it.", "Distingue lo que hiciste de lo que alguien confirmó. Enviar un mensaje o dejar un mensaje de voz no significa que la persona lo haya leído o escuchado."),
    },
  ],
};

/** Checks the bounded workplace decisions, not reading speed or writing quality. */
export function practiceProblem(round: PracticeRound, answers: Record<string, string>): Localized | null {
  for (const field of round.fields) {
    const selected = field.options.find((o) => o.id === answers[field.id]);
    if (!selected) return l(`Choose ${field.label.en.toLowerCase()} before continuing.`, `Elige una opción para «${field.label.es}» antes de continuar.`);
    if (selected.id !== field.answer) return selected.correction ?? l("Compare your choice with the source material.", "Compara tu elección con los documentos.");
  }
  return null;
}
