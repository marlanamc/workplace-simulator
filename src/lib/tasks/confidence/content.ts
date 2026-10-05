import { OPENING_MESSAGES, OPENING_CORRECTIONS, openingReplyVerdict } from "@/lib/tasks/mail/opening";
import { mentionsAmount } from "@/lib/text-facts";
import { practiceEmailMatches } from "@/lib/tasks/account-recovery/content";
import type { Localized } from "@/lib/task-types";
import type { LessonPerson } from "@/lib/lessons/types";
import { l, type ConfidenceKey, type LessonScenario } from "@/lib/lessons/confidence";

export type PracticeFile = { key: string; name: string; detail: Localized };
export type ConfidenceScenario = {
  title: Localized;
  request: Localized;
  guidance: Localized;
  help: Localized;
  sources: { title: Localized; text: Localized }[];
  recipient?: string;
  files?: PracticeFile[];
  expected: Record<string, string>;
  /** Only the requested bounded fact is assessed, never general writing quality. */
  replyPattern?: RegExp;
  correction: Localized;
  rows?: { label: Localized; value: number }[];
  scheduleDisplay?: { date: Localized; slots: { label: Localized; time: Localized }[] };
  dates?: { value: string; label: Localized }[];
  times?: string[];
  /**
   * Who you are and who the scenario names, for the intro and Key
   * information. Classroom practice falls back to the lesson's own scene.
   */
  you?: Localized;
  people?: LessonPerson[];
};
const source = (title: Localized, text: Localized) => ({ title, text });
const file = (key: string, name: string, en: string, es: string): PracticeFile => ({ key, name, detail: l(en, es) });

/** Fixed, fictional scenarios. Answer facts and checks live together, outside React. */
export const CONFIDENCE_SCENARIOS: Record<ConfidenceKey, Record<"try" | "home", ConfidenceScenario>> = {
  "mail-reply": {
    try: {
      title: l("Library class · new room", "Clase de biblioteca · aula nueva"),
      request: l("Ana asks which room the computer class moved to. Reply with the room in the notice.", "Ana pregunta a qué aula se cambió la clase de computación. Responde con el aula del aviso."),
      guidance: l("Read the notice. Open Reply, type the new room, check Ana is the recipient, and send.", "Lee el aviso. Abre Responder, escribe el aula nueva, revisa que Ana sea la destinataria y envía."),
      help: l("Reply keeps the sender as the recipient. The old room is no longer correct. A short answer with the current room is enough.", "Responder mantiene al remitente como destinatario. El aula anterior ya no es correcta. Basta una respuesta corta con el aula actual."),
      sources: [source(l("Class notice", "Aviso de clase"), l("Computer class has moved from room 14 to room 28.", "La clase de computación se cambió del aula 14 al aula 28."))],
      recipient: "ana@example.test", expected: {}, replyPattern: /\b28\b/,
      correction: l("Check the new room in the notice. Include that room in your reply; keep the rest of your draft.", "Revisa el aula nueva en el aviso. Inclúyela en tu respuesta; conserva el resto del borrador."),
    },
    home: {
      title: l("Community garden · supplies", "Huerto comunitario · materiales"),
      request: l("Lee asks how many watering cans to bring. Reply using the supplies note.", "Lee pregunta cuántas regaderas traer. Responde usando la nota de materiales."),
      guidance: l("Read the supplies note. Reply to Lee with the number still needed. Check and send.", "Lee la nota. Responde a Lee con la cantidad que todavía falta. Revisa y envía."),
      help: l("The requested number is what is still missing, not the total for the group. You can reply with a short phrase.", "La cantidad solicitada es la que falta, no el total del grupo. Puedes responder con una frase corta."),
      sources: [source(l("Supplies note", "Nota de materiales"), l("We need 5 watering cans. There are 2 at the garden. Please bring 3 more.", "Necesitamos 5 regaderas. Hay 2 en el huerto. Trae 3 más, por favor."))],
      recipient: "lee@example.test", expected: {}, replyPattern: /\b(3|three|tres)\b/i,
      correction: l("Lee asks how many to bring. Check the number still missing in the note.", "Lee pregunta cuántas traer. Revisa en la nota cuántas faltan."),
    },
  },
  "mail-attach": {
    try: {
      title: l("School trip · signed form", "Excursión · formulario firmado"),
      request: l("Send the signed trip form to Ana. The blank form is not ready to send.", "Envía el formulario firmado de la excursión a Ana. El formulario en blanco no está listo."),
      guidance: l("Open Reply. Use Attach to inspect the files. Attach the signed form, check the recipient, and send.", "Abre Responder. Usa Adjuntar para revisar los archivos. Adjunta el firmado, revisa el destinatario y envía."),
      help: l("Open each file preview to check whether it is signed. Remove a wrong attachment before replacing it.", "Abre la vista previa para comprobar si está firmado. Quita un adjunto incorrecto antes de reemplazarlo."),
      sources: [], recipient: "ana@example.test", expected: { file: "signed" },
      files: [file("blank", "Trip-form.pdf", "School trip · November 12. Signature: blank.", "Excursión · 12 de noviembre. Firma: en blanco."), file("signed", "Trip-form-signed.pdf", "School trip · November 12. Signed by the fictional parent Alex Rivera.", "Excursión · 12 de noviembre. Firmado por Alex Rivera, familiar ficticio.")],
      correction: l("Ana needs the signed form. Compare the file preview with the request; remove the wrong attachment and attach the signed one.", "Ana necesita el formulario firmado. Compara la vista previa con la solicitud; quita el adjunto incorrecto y adjunta el firmado."),
    },
    home: {
      title: l("Club meeting · approved agenda", "Reunión del club · agenda aprobada"),
      request: l("Send Lee the approved November agenda. The December draft is not approved.", "Envía a Lee la agenda aprobada de noviembre. El borrador de diciembre no está aprobado."),
      guidance: l("Reply to Lee. Open Attach, compare the month and approval in each preview, attach the requested agenda, and send.", "Responde a Lee. Abre Adjuntar, compara el mes y la aprobación en cada vista previa, adjunta la agenda solicitada y envía."),
      help: l("A newer file is not always the requested file. Check both the month and approval status.", "El archivo más nuevo no siempre es el solicitado. Revisa el mes y el estado de aprobación."),
      sources: [], recipient: "lee@example.test", expected: { file: "approved" },
      files: [file("draft", "Agenda-December.pdf", "December agenda · DRAFT · still under review.", "Agenda de diciembre · DRAFT = borrador · en revisión."), file("approved", "Agenda-November.pdf", "November agenda · APPROVED · meeting at 4 PM.", "Agenda de noviembre · APPROVED = aprobada · reunión a las 4 p. m.")],
      correction: l("Check the requested month and approval status. Remove a different file before attaching the approved November agenda.", "Revisa el mes solicitado y la aprobación. Quita otro archivo antes de adjuntar la agenda aprobada de noviembre."),
    },
  },
  files: {
    try: {
      title: l("Garden club · November list", "Club del huerto · lista de noviembre"),
      request: l("Find the November garden list. Rename it Garden-November.pdf and share it with Lee, who only needs to read it.", "Busca la lista del huerto de noviembre. Ponle Garden-November.pdf y compártela con Lee, que solo necesita leerla."),
      guidance: l("Open a file and check its month. Rename the November file Garden-November.pdf. Open Share, enter Lee’s email address and an access level, then save.", "Abre un archivo y revisa su mes. Cambia el nombre del archivo de noviembre a Garden-November.pdf. Abre Compartir, ingresa el correo de Lee y un nivel de acceso, y guarda."),
      help: l("File previews show the month. A useful file name identifies the contents. Viewer lets someone read without changing the document.", "Las vistas previas muestran el mes. Un nombre útil identifica el contenido. Lector permite leer sin cambiar el documento."),
      sources: [], recipient: "lee@example.test", expected: { file: "nov", name: "Garden-November.pdf", permission: "view" },
      files: [file("oct", "List-10.pdf", "Garden club · October list.", "Club del huerto · lista de octubre."), file("nov", "List-11.pdf", "Garden club · November list.", "Club del huerto · lista de noviembre.")],
      correction: l("Compare the month, new name, and access with Lee's request. Lee only needs to read.", "Compara el mes, el nombre nuevo y el acceso con la solicitud de Lee. Lee solo necesita leer."),
    },
    home: {
      title: l("Class project · reading notes", "Proyecto de clase · notas de lectura"),
      request: l("Share the final reading notes with Ana. Rename them Class-reading-final. Ana will correct the notes and needs editing access.", "Comparte las notas finales de lectura con Ana. Ponles Class-reading-final. Ana las corregirá y necesita acceso de edición."),
      guidance: l("Preview the notes and select the final version. Rename it Class-reading-final. Open Share and give Ana the access she needs to correct it.", "Revisa las notas y selecciona la versión final. Ponle Class-reading-final. Abre Compartir y dale a Ana el acceso para corregirla."),
      help: l("Here the recipient needs to change the file. Choose access based on the request, not the choice from the last practice.", "Aquí la destinataria necesita cambiar el archivo. Elige el acceso según la solicitud, no según la práctica anterior."),
      sources: [], recipient: "ana@example.test", expected: { file: "final", name: "Class-reading-final", permission: "edit" },
      files: [file("final", "Notes-v2", "Google Docs · Reading notes · FINAL · ready for Ana's corrections.", "Google Docs · Notas de lectura · FINAL · listas para las correcciones de Ana."), file("draft", "Notes-v1", "Reading notes · DRAFT · incomplete.", "Notas de lectura · DRAFT = borrador · incompletas.")],
      correction: l("Check the final version and requested name. Ana needs to change the notes, so reading-only access will not be enough.", "Revisa la versión final y el nombre solicitado. Ana necesita cambiar las notas; el acceso de solo lectura no basta."),
    },
  },
  schedule: {
    try: {
      title: l("Tuesday · class and appointment", "Martes · clase y cita"),
      request: l("Compare your Tuesday class with your appointment. Request the class time you can attend in full.", "Compara tu clase del martes con tu cita. Solicita una clase a la que puedas asistir completa."),
      guidance: l("Read both schedules. Select Tuesday and a class time that does not overlap the appointment. Review and send the change request.", "Lee ambos horarios. Selecciona el martes y una clase que no coincida con la cita. Revisa y envía la solicitud."),
      help: l("Both the start and end of class must fit. The appointment runs until noon.", "Deben caber el inicio y el final de la clase. La cita termina al mediodía."),
      sources: [source(l("Class schedule", "Horario de clases"), l("Tuesday, November 10: current class 10 AM–noon. Other class: 2–4 PM.", "Martes 10 de noviembre: clase actual de 10 a. m. a 12. Otra clase: de 2 a 4 p. m.")), source(l("Personal calendar", "Calendario personal"), l("Tuesday, November 10: appointment 11 AM–noon.", "Martes 10 de noviembre: cita de 11 a. m. a 12."))],
      scheduleDisplay: { date: l("Tuesday, November 10, 2026", "Martes 10 de noviembre de 2026"), slots: [{ label: l("Current class", "Clase actual"), time: l("10 AM–noon", "10 a. m.–12 p. m.") }, { label: l("Other class", "Otra clase"), time: l("2–4 PM", "2–4 p. m.") }] },
      expected: { date: "2026-11-10", time: "14:00" }, dates: [{ value: "2026-11-10", label: l("Tuesday, November 10", "Martes 10 de noviembre") }, { value: "2026-11-11", label: l("Wednesday, November 11", "Miércoles 11 de noviembre") }], times: ["10:00", "14:00"],
      correction: l("Check the day and the appointment's end. The requested class must fit without overlap.", "Revisa el día y el final de la cita. La clase solicitada debe caber sin coincidir."),
    },
    home: {
      title: l("Saturday · volunteer shift", "Sábado · turno de voluntariado"),
      request: l("Your bus arrives at 10 AM. Request a Saturday volunteer shift you can attend from its start.", "Tu autobús llega a las 10 a. m. Solicita un turno de voluntariado del sábado al que puedas llegar desde el inicio."),
      guidance: l("Compare the bus arrival and the posted shifts. Select Saturday and a shift that starts after you arrive. Review and send.", "Compara la llegada del autobús y los turnos. Selecciona el sábado y un turno que empiece después de llegar. Revisa y envía."),
      help: l("A shift that has already begun when you arrive is not a full shift you can attend.", "Un turno que ya empezó cuando llegas no es un turno al que puedas asistir completo."),
      sources: [source(l("Volunteer schedule", "Horario de voluntariado"), l("Saturday, November 14: current shift 9–11 AM. Other shift: 11 AM–1 PM.", "Sábado 14 de noviembre: turno actual de 9 a 11 a. m. Otro turno: de 11 a. m. a 1 p. m.")), source(l("Bus timetable", "Horario del autobús"), l("Arrival Saturday, November 14: 10 AM.", "Llegada el sábado 14 de noviembre: 10 a. m."))],
      scheduleDisplay: { date: l("Saturday, November 14, 2026", "Sábado 14 de noviembre de 2026"), slots: [{ label: l("Current shift", "Turno actual"), time: l("9–11 AM", "9–11 a. m.") }, { label: l("Other shift", "Otro turno"), time: l("11 AM–1 PM", "11 a. m.–1 p. m.") }] },
      expected: { date: "2026-11-14", time: "11:00" }, dates: [{ value: "2026-11-13", label: l("Friday, November 13", "Viernes 13 de noviembre") }, { value: "2026-11-14", label: l("Saturday, November 14", "Sábado 14 de noviembre") }], times: ["09:00", "11:00"],
      correction: l("Compare the shift's start with the bus arrival and check Saturday's date.", "Compara el inicio del turno con la llegada del autobús y revisa la fecha del sábado."),
    },
  },
  calendar: {
    try: {
      title: l("Study group · 30-minute meeting", "Grupo de estudio · reunión de 30 minutos"),
      request: l("Ana invited you on Tuesday at 2 PM. You have class then. Propose a free 30-minute time on Tuesday.", "Ana te invitó el martes a las 2 p. m. Tienes clase a esa hora. Propón 30 minutos libres el martes."),
      guidance: l("Open the invitation. Compare the calendar, choose Propose new time, enter the day and time, then review and send.", "Abre la invitación. Compara el calendario, elige Proponer otra hora, ingresa el día y la hora, revisa y envía."),
      help: l("The whole 30-minute meeting must fit. A 15-minute gap is too short.", "Debe caber toda la reunión de 30 minutos. Un espacio de 15 minutos no basta."),
      sources: [source(l("Tuesday, November 10 · calendar", "Martes 10 de noviembre · calendario"), l("2–3 PM: class. 3–3:15 PM: free. 3:15–4 PM: appointment. 4–4:30 PM: free.", "2–3 p. m.: clase. 3–3:15: libre. 3:15–4: cita. 4–4:30: libre."))],
      recipient: "ana@example.test", expected: { date: "2026-11-10", time: "16:00" }, dates: [{ value: "2026-11-10", label: l("Tuesday, November 10", "Martes 10 de noviembre") }, { value: "2026-11-11", label: l("Wednesday, November 11", "Miércoles 11 de noviembre") }], times: ["14:00", "15:00", "16:00"],
      correction: l("Compare the whole 30 minutes with Tuesday's calendar. Keep your proposal and adjust the day or time.", "Compara los 30 minutos completos con el calendario del martes. Conserva tu propuesta y ajusta el día o la hora."),
    },
    home: {
      title: l("Club planning · one-hour meeting", "Planificación del club · reunión de una hora"),
      request: l("Lee invited you Friday at 9 AM. Propose another time on Friday when you have a full hour free.", "Lee te invitó el viernes a las 9 a. m. Propón otra hora el viernes cuando tengas una hora completa libre."),
      guidance: l("Open the invitation and compare Friday's events. Propose a new day/time using a full one-hour opening. Review and send.", "Abre la invitación y compara los eventos del viernes. Propón una hora con un espacio completo de una hora. Revisa y envía."),
      help: l("This meeting is longer than the last one. Check its duration before reusing a familiar time.", "Esta reunión es más larga que la anterior. Revisa la duración antes de reutilizar una hora conocida."),
      sources: [source(l("Friday, November 13 · calendar", "Viernes 13 de noviembre · calendario"), l("9–10 AM: appointment. 10–10:30 AM: free. 10:30–noon: class. Noon–1 PM: free.", "9–10 a. m.: cita. 10–10:30: libre. 10:30–12: clase. 12–1 p. m.: libre."))],
      recipient: "lee@example.test", expected: { date: "2026-11-13", time: "12:00" }, dates: [{ value: "2026-11-12", label: l("Thursday, November 12", "Jueves 12 de noviembre") }, { value: "2026-11-13", label: l("Friday, November 13", "Viernes 13 de noviembre") }], times: ["09:00", "10:00", "12:00"],
      correction: l("The meeting needs 60 minutes. Check Friday's date and find an opening long enough for the whole meeting.", "La reunión necesita 60 minutos. Revisa la fecha del viernes y busca un espacio para toda la reunión."),
    },
  },
  "account-recovery": {
    try: {
      title: l("Class account · current code", "Cuenta de clase · código actual"),
      request: l("Sign in to the fictional class account with the newest code you requested.", "Entra en la cuenta ficticia de clase con el código más reciente que solicitaste."),
      guidance: l("Enter the practice email and password from the key information. Read the two text messages, open the newest one, and enter its code.", "Ingresa el correo y la contraseña de práctica de la información clave. Lee los dos mensajes, abre el más reciente e ingresa su código."),
      help: l("A new code replaces the older one. Compare the message times. These are fictional practice credentials.", "Un código nuevo reemplaza al anterior. Compara las horas. Son datos ficticios de práctica."),
      sources: [source(l("Class sign-in · 10:02 AM", "Acceso a clase · 10:02 a. m."), l("Your code is 481926.", "Tu código es 481926.")), source(l("Class sign-in · 9:58 AM", "Acceso a clase · 9:58 a. m."), l("Your code is 193847.", "Tu código es 193847."))],
      expected: { email: "student@class.example.test", password: "Class!26", code: "481926", text: "0" }, correction: l("Check the practice password and the newest message. An older code will not work. You can edit your entry.", "Revisa la contraseña de práctica y el mensaje más reciente. Un código anterior no funciona. Puedes editar lo escrito."),
    },
    home: {
      title: l("Library account · replacement code", "Cuenta de biblioteca · código nuevo"),
      request: l("You requested a replacement code for the fictional library account. Sign in using that code.", "Solicitaste otro código para la cuenta ficticia de biblioteca. Entra usando ese código."),
      guidance: l("Enter the practice email and password from the key information. Compare the message times, open the latest message, and enter its code.", "Ingresa el correo y la contraseña de práctica de la información clave. Compara las horas, abre el mensaje más reciente e ingresa su código."),
      help: l("The newest message is not always first in the list. Check the times before copying the six digits.", "El mensaje más reciente no siempre aparece primero. Revisa las horas antes de copiar los seis dígitos."),
      sources: [source(l("Library sign-in · 4:10 PM", "Acceso a biblioteca · 4:10 p. m."), l("Your code is 562901.", "Tu código es 562901.")), source(l("Library sign-in · 4:12 PM", "Acceso a biblioteca · 4:12 p. m."), l("Your new code is 730184.", "Tu código nuevo es 730184."))],
      expected: { email: "reader@library.example.test", password: "Books!26", code: "730184", text: "1" }, correction: l("Use the replacement code from the latest message, not the first message in the list. Keep your entry and correct it.", "Usa el código nuevo del mensaje más reciente, no del primero en la lista. Conserva lo escrito y corrígelo."),
    },
  },
  spreadsheet: {
    try: {
      title: l("Class supplies · counts", "Materiales de clase · cantidades"),
      request: l("Enter the delivered supplies in the sheet and send the checked total to Ana.", "Ingresa los materiales entregados en la hoja y envía el total revisado a Ana."),
      guidance: l("Compare each delivery row with the sheet. Select B2 and B3 and type their values. Check the total, then send it.", "Compara cada fila de entrega con la hoja. Selecciona B2 y B3 e ingresa sus valores. Revisa el total y envíalo."),
      help: l("Match the item name before entering its number. The total updates from the two cells. An incorrect total may come from one wrong cell.", "Compara el nombre del artículo antes de ingresar su cantidad. El total usa las dos celdas. Un total incorrecto puede venir de una celda incorrecta."),
      sources: [source(l("Delivery receipt", "Recibo de entrega"), l("Notebooks: 12. Folders: 8. Total items: 20.", "Cuadernos: 12. Carpetas: 8. Total: 20 artículos."))],
      rows: [{ label: l("Notebooks", "Cuadernos"), value: 12 }, { label: l("Folders", "Carpetas"), value: 8 }], recipient: "ana@example.test", expected: { B2: "12", B3: "8", total: "20" },
      correction: l("Check each row against the receipt, then check the total you are sending. Keep and correct your entries.", "Revisa cada fila con el recibo y después el total que envías. Conserva y corrige tus valores."),
    },
    home: {
      title: l("Garden supplies · delivered items", "Materiales del huerto · artículos entregados"),
      request: l("Record delivered items only and send Lee the total. Do not count items still on order.", "Registra solo lo entregado y envía el total a Lee. No cuentes los artículos pendientes."),
      guidance: l("Read the receipt. Enter delivered pots in B2 and gloves in B3. Compare the total with the delivered items and send it.", "Lee el recibo. Ingresa las macetas entregadas en B2 y los guantes en B3. Compara el total con lo entregado y envíalo."),
      help: l("Ordered is not the same as delivered. Use the delivered column, even when a larger number appears nearby.", "Pedido no es lo mismo que entregado. Usa lo entregado, aunque aparezca una cantidad mayor cerca."),
      sources: [source(l("Order and delivery receipt", "Pedido y recibo de entrega"), l("Pots: ordered 15, delivered 9. Gloves: ordered 10, delivered 7. The remaining items arrive later.", "Macetas: 15 pedidas, 9 entregadas. Guantes: 10 pedidos, 7 entregados. Lo demás llega después."))],
      rows: [{ label: l("Pots", "Macetas"), value: 9 }, { label: l("Gloves", "Guantes"), value: 7 }], recipient: "lee@example.test", expected: { B2: "9", B3: "7", total: "16" },
      correction: l("Compare each cell with delivered quantities, not ordered quantities. Check the total after correcting the cells.", "Compara cada celda con lo entregado, no con lo pedido. Revisa el total después de corregir."),
    },
  },
  coursework: {
    try: {
      title: l("Reading class · weekly log", "Clase de lectura · registro semanal"),
      request: l("Find the reading log deadline and submit the completed November log.", "Busca la fecha de entrega del registro de lectura y entrega el registro completo de noviembre."),
      guidance: l("Read the assignment details. Find the deadline in the assignment. Use Add or create → Google Drive to preview and select the completed log, then turn it in and check the status.", "Lee los detalles. Busca la fecha de entrega en la tarea. Usa Agregar o crear → Google Drive para revisar y seleccionar el registro completo. Entrégalo y revisa el estado."),
      help: l("The assignment deadline is different from the next class date. Adding a file creates a draft; Turn in submits it.", "La fecha de entrega no es la fecha de la próxima clase. Agregar un archivo crea un borrador; Entregar lo envía."),
      sources: [source(l("Assignment details", "Detalles de la tarea"), l("November reading log. Due November 12, 2026. Next class: November 13. Submit the completed log.", "Registro de lectura de noviembre. Entrega: 12 de noviembre de 2026. Próxima clase: 13 de noviembre. Entrega el registro completo."))],
      expected: { deadline: "2026-11-12", file: "complete" }, files: [file("draft", "Reading-log-draft.pdf", "November log · 2 of 4 entries completed.", "Registro de noviembre · 2 de 4 entradas completas."), file("complete", "Reading-log-complete.pdf", "November log · all 4 entries completed.", "Registro de noviembre · las 4 entradas completas.")],
      correction: l("Check the due date in the assignment and the completed entries in the file preview. You can remove and replace the file before submitting.", "Revisa la fecha de entrega y las entradas completas en la vista previa. Puedes quitar y reemplazar el archivo antes de entregar."),
    },
    home: {
      title: l("Computer class · revised assignment", "Clase de computación · tarea revisada"),
      request: l("Use the updated deadline and submit the revised computer-class notes.", "Usa la fecha actualizada y entrega las notas revisadas de computación."),
      guidance: l("Read the teacher's update and the original assignment. Find the current deadline. Add the revised file, turn it in, and check the status.", "Lee la actualización del docente y la tarea original. Busca la fecha actual. Agrega el archivo revisado, entrégalo y revisa el estado."),
      help: l("A dated teacher update can change a deadline. Check which document is newer and whether your file includes the revision.", "Una actualización del docente puede cambiar una fecha. Revisa cuál documento es más reciente y si el archivo incluye la revisión."),
      sources: [source(l("Original assignment · November 9", "Tarea original · 9 de noviembre"), l("Computer-class notes due November 16, 2026.", "Notas de computación para el 16 de noviembre de 2026.")), source(l("Teacher update · November 13", "Actualización del docente · 13 de noviembre"), l("New deadline: November 18, 2026. Add the section about saving a file and submit your revised notes.", "Nueva fecha: 18 de noviembre de 2026. Agrega la sección sobre guardar archivos y entrega las notas revisadas."))],
      expected: { deadline: "2026-11-18", file: "revised" }, files: [file("revised", "Computer-notes-v2.pdf", "Revised notes · includes Saving a file.", "Notas revisadas · incluyen Guardar un archivo."), file("old", "Computer-notes-v1.pdf", "Original notes · keyboard and mouse only.", "Notas originales · solo teclado y ratón.")],
      correction: l("Compare the teacher's update with the deadline and preview your file for the added section. Keep your draft and revise it.", "Compara la actualización con la fecha y busca la sección agregada en la vista previa. Conserva y corrige tu borrador."),
    },
  },
};

export function confidenceProblem(s: ConfidenceScenario, values: Record<string, string>): Localized | null {
  for (const [key, expected] of Object.entries(s.expected)) {
    const value = (values[key] ?? "").trim();
    if (key === "email") {
      if (!practiceEmailMatches(value, expected)) return s.correction;
    } else if (key === "name") {
      if (value.toLowerCase().replace(/\.pdf$/i, "").replace(/[ _]+/g, "-") !== expected.toLowerCase().replace(/\.pdf$/i, "")) return s.correction;
    } else if (/^B\d$/.test(key) || key === "total") {
      if (!value || !/^\d+(?:[.,]\d+)?$/.test(value) || Number(value.replace(",", ".")) !== Number(expected)) return s.correction;
    } else if (value !== expected) return s.correction;
  }
  if (s.recipient && values.recipient?.trim().toLowerCase() !== s.recipient) return l("Check the recipient against the request.", "Revisa el destinatario con la solicitud.");
  if (s.replyPattern && !s.replyPattern.test(values.body ?? "")) return s.correction;
  return null;
}

/** Checks a snapshot after an app action; never prevents the app action itself. */
export function assessPractice(key:ConfidenceKey, scenario:LessonScenario, s:ConfidenceScenario, values:Record<string,string>, message=0) {
  if (key==='mail-reply' && scenario==='classroom') {
    if (values.recipient?.trim().toLowerCase()!==s.recipient) return l('Check the recipient against the received message.','Compara el destinatario con el mensaje recibido.');
    const verdict = openingReplyVerdict(OPENING_MESSAGES[message].id, values.body ?? '');
    return verdict === 'ok' ? null : OPENING_CORRECTIONS[verdict];
  }
  if (key==='files' && (values.scope!=='restricted' || values.recipients!==s.recipient)) return l('Check who has access. Keep General access Restricted, remove unintended people, and give the requested person the right role.','Revisa quién tiene acceso. Mantén el acceso general Restringido, quita a las personas incorrectas y asigna el permiso solicitado.');
  if (key==='spreadsheet' && !mentionsAmount(values.body??'', Number(s.expected.total))) return l('Compare the total in the sent email with the sheet. Send a corrected follow-up if needed.','Compara el total del correo enviado con la hoja. Envía una corrección si hace falta.');
  if (key==='calendar') {
    const duration=scenario==='home'?60:30;
    const minutes=(s:string)=>{const [h,m]=s.split(':').map(Number);return h*60+m;};
    if (minutes(values.end??'')-minutes(values.time??'')!==duration) return l(`The meeting needs ${duration} minutes. Check both its start and end.`,`La reunión necesita ${duration} minutos. Revisa el inicio y el final.`);
  }
  const checked={...values};
  // Deadlines are source facts, not student-editable submission fields.
  if(key==='coursework') checked.deadline=s.expected.deadline;
  if(key==='spreadsheet') checked.total=s.expected.total; // The actual email is checked above; rows are checked below.
  const expected={...s.expected};
  if(key==='calendar'&&scenario==='classroom'&&values.time==='14:00') expected.time='14:00';
  return confidenceProblem({...s,expected},checked);
}

export function scenarioPasswordMatches(s: ConfidenceScenario, value: string) { return value.trim() === s.expected.password; }
export function scenarioCodeResult(s: ConfidenceScenario, value: string): 'empty' | 'ok' | 'wrong' {
  return !value.trim() ? 'empty' : value.trim() === s.expected.code ? 'ok' : 'wrong';
}
