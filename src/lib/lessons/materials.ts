import type { TaskKey } from "@/lib/desktop-content";
import type { Localized } from "@/lib/task-types";

export type PracticeDocument = {
  title: Localized;
  source: Localized;
  paragraphs?: Localized[];
  table?: { columns: Localized[]; rows: Localized[][] };
};
export type PracticePack = {
  title: Localized;
  context: Localized;
  documents: PracticeDocument[];
  discuss: Localized[];
  evidence: Localized[];
  change: Localized;
};
const l = (en: string, es: string): Localized => ({ en, es });

/** New transfer situations, deliberately separate from the simulator's answer keys. */
export const PRACTICE_PACKS: Partial<Record<TaskKey, PracticePack>> = {
  "mail-reply": {
    title: l("A delivery time changed", "Cambió la hora de una entrega"),
    context: l("You work at Bay Street Market. Your supervisor needs a reply before arranging cover at the loading door.", "Trabajas en Bay Street Market. Tu supervisora necesita una respuesta antes de asignar a alguien a la puerta de carga."),
    documents: [
      {
        title: l("Delivery update", "Cambio en la entrega"),
        source: l("From: Elena Ruiz, supervisor · To: Receiving team · Tuesday, 9:10 AM", "De: Elena Ruiz, supervisora · Para: Equipo de recepción · Martes, 9:10 AM"),
        paragraphs: [l("The produce truck will arrive Wednesday at 10:30 AM instead of 8:00 AM. Can you meet the driver at the loading door? Please reply by 2:00 PM today so I can arrange cover if needed. —Elena", "El camión de frutas y verduras llegará el miércoles a las 10:30 AM en vez de las 8:00 AM. ¿Puedes recibir al conductor en la puerta de carga? Por favor responde hoy antes de las 2:00 PM para que pueda organizar cobertura si hace falta. —Elena")],
      },
      {
        title: l("Your Wednesday assignment", "Tu asignación del miércoles"),
        source: l("Bay Street Market · Published Tuesday, 8:00 AM", "Bay Street Market · Publicada el martes, 8:00 AM"),
        table: { columns: [l("Time", "Hora"), l("Assignment", "Asignación")], rows: [
          [l("8:00–10:00 AM", "8:00–10:00 AM"), l("Stock shelves", "Reponer estantes")],
          [l("10:00–11:00 AM", "10:00–11:00 AM"), l("Cover register 2; no replacement assigned", "Cubrir la caja 2; no hay reemplazo asignado")],
          [l("11:00 AM–noon", "11:00 AM–mediodía"), l("Receive deliveries", "Recibir entregas")],
        ] },
      },
    ],
    discuss: [l("What does Elena need to know? Draft a short reply using the time and the assignment that affect your answer.", "¿Qué necesita saber Elena? Redacten una respuesta corta con la hora y la asignación que afectan la respuesta."), l("Which time is the delivery time, and which is the reply deadline?", "¿Cuál es la hora de entrega y cuál es el plazo para responder?")],
    evidence: [l("The delivery is Wednesday at 10:30 AM; the reply is due Tuesday by 2:00 PM. The learner distinguishes these from the old 8:00 AM arrival.", "La entrega es el miércoles a las 10:30 AM; la respuesta vence el martes a las 2:00 PM. Se distinguen estas horas de la llegada anterior a las 8:00 AM."), l("A useful reply explains the register conflict and asks for cover or says they cannot receive the delivery unless cover is arranged. No particular greeting or exact wording is required.", "Una respuesta útil explica el conflicto con la caja y pide cobertura o dice que no puede recibir la entrega sin un reemplazo. No se exige un saludo ni palabras exactas.")],
    change: l("Elena assigns Luis to register 2 from 10:15 to 10:45 AM. Ask learners to revise their reply: now they can confirm the 10:30 delivery. What changed in the evidence?", "Elena asigna a Luis a la caja 2 de 10:15 a 10:45 AM. Pida que revisen su respuesta: ahora pueden confirmar la entrega de las 10:30. ¿Qué cambió en la evidencia?"),
  },
  "mail-attach": {
    title: l("The right inspection record", "El registro de inspección correcto"),
    context: l("You work in hotel housekeeping. A supervisor needs the completed inspection record for today's rooms.", "Trabajas en limpieza de un hotel. Una supervisora necesita el registro completo de inspección de las habitaciones de hoy."),
    documents: [
      { title: l("Inspection records for September 14", "Registros de inspección del 14 de septiembre"), source: l("From: Nia Patel, housekeeping supervisor · Monday, September 14, 1:20 PM", "De: Nia Patel, supervisora de limpieza · Lunes 14 de septiembre, 1:20 PM"), paragraphs: [l("Please reply with today's completed inspection record for floor 3. The office keeps the PDF copy. I only need the inspection record, not the guest list. —Nia", "Por favor responde con el registro completo de inspección de hoy del piso 3. La oficina guarda la copia en PDF. Solo necesito el registro de inspección, no la lista de huéspedes. —Nia")] },
      { title: l("Shared folder · Floor 3", "Carpeta compartida · Piso 3"), source: l("Harbor Hotel · Files available at 1:25 PM", "Harbor Hotel · Archivos disponibles a la 1:25 PM"), table: { columns: [l("Filename", "Nombre del archivo"), l("Preview", "Vista previa")], rows: [
        [l("Floor3_2026-09-14_DRAFT.pdf", "Piso3_2026-09-14_BORRADOR.pdf"), l("Rooms 301–310; two checks blank", "Habitaciones 301–310; faltan dos revisiones")],
        [l("Floor3_2026-09-11_COMPLETE.pdf", "Piso3_2026-09-11_COMPLETO.pdf"), l("All checks signed; September 11", "Todas las revisiones firmadas; 11 de septiembre")],
        [l("Floor3_2026-09-14_COMPLETE.pdf", "Piso3_2026-09-14_COMPLETO.pdf"), l("Rooms 301–310; all checks signed today", "Habitaciones 301–310; todas las revisiones firmadas hoy")],
        [l("GuestList_2026-09-14.xlsx", "Huespedes_2026-09-14.xlsx"), l("Guest names and room numbers", "Nombres de huéspedes y números de habitación")],
      ] } },
    ],
    discuss: [l("Which file belongs in the reply, and what two details rule out the other inspection records?", "¿Qué archivo corresponde a la respuesta y qué dos detalles descartan los otros registros?"), l("What would a short attachment message say? How could you check the attachment before sending?", "¿Qué diría un mensaje corto sobre el adjunto? ¿Cómo se podría revisar el adjunto antes de enviarlo?")],
    evidence: [l("The September 14 COMPLETE PDF matches the date, floor, finished status, and requested format. The guest list is unrelated to the request.", "El PDF COMPLETO del 14 de septiembre coincide con la fecha, el piso, el estado final y el formato solicitado. La lista de huéspedes no corresponde a la solicitud."), l("The learner checks the selected filename or opens its preview; choosing a file is different from sending the message.", "Se revisa el nombre seleccionado o se abre la vista previa; elegir un archivo es distinto de enviar el mensaje.")],
    change: l("The completed PDF is missing. Ask what to tell Nia. Accept asking where it is or reporting that only a draft is available; renaming the draft does not make the inspection complete.", "Falta el PDF completo. Pregunte qué se le puede decir a Nia. Acepte preguntar dónde está o avisar que solo hay un borrador; cambiarle el nombre no completa la inspección."),
  },
  calendar: {
    title: l("A room booking with a deadline", "Una reserva de sala con fecha límite"),
    context: l("You help coordinate training at a community center. The invitation needs enough detail for coworkers to arrive at the right place.", "Ayudas a coordinar la capacitación en un centro comunitario. La invitación necesita detalles suficientes para que el equipo llegue al lugar correcto."),
    documents: [
      { title: l("Training request", "Solicitud de capacitación"), source: l("From: Omar Chen, team coordinator · Monday, September 14", "De: Omar Chen, coordinador del equipo · Lunes 14 de septiembre"), paragraphs: [l("Our scanner training is Thursday, September 17, 2:00–2:30 PM, in Room B. Please send the invitation by Tuesday noon. The room needs 15 minutes of setup before the session. —Omar", "La capacitación del escáner es el jueves 17 de septiembre, de 2:00 a 2:30 PM, en la sala B. Por favor envía la invitación antes del mediodía del martes. La sala necesita 15 minutos de preparación antes de la sesión. —Omar")] },
      { title: l("Room B · Thursday, September 17", "Sala B · Jueves 17 de septiembre"), source: l("Community center · Room calendar · All times local", "Centro comunitario · Calendario de salas · Hora local"), table: { columns: [l("Time", "Hora"), l("Booking", "Reserva")], rows: [
        [l("1:00–1:30 PM", "1:00–1:30 PM"), l("Volunteer briefing", "Reunión de voluntarios")],
        [l("1:30–3:00 PM", "1:30–3:00 PM"), l("Available", "Disponible")],
        [l("3:00–4:00 PM", "3:00–4:00 PM"), l("Language class", "Clase de idiomas")],
      ] } },
    ],
    discuss: [l("What title, date, start time, end time, and location belong in the invitation? Does the room allow setup?", "¿Qué título, fecha, hora inicial, hora final y lugar corresponden a la invitación? ¿La sala permite la preparación?"), l("Why is Tuesday noon not the event time?", "¿Por qué el mediodía del martes no es la hora del evento?")],
    evidence: [l("Scanner training is September 17, 2:00–2:30 PM, Room B. Setup begins at 1:45 PM, within the available period. Tuesday noon is the deadline to send the invitation.", "La capacitación es el 17 de septiembre, de 2:00 a 2:30 PM, en la sala B. La preparación empieza a la 1:45 PM, dentro del período disponible. El mediodía del martes es el plazo para enviar la invitación.")],
    change: l("A new booking occupies Room B until 2:00 PM. The training itself still fits, but setup no longer does. Ask learners what they would check with Omar before sending or changing the invitation.", "Una nueva reserva ocupa la sala B hasta las 2:00 PM. La capacitación aún cabe, pero la preparación ya no. Pregunte qué confirmarían con Omar antes de enviar o cambiar la invitación."),
  },
  files: {
    title: l("A handoff the next shift can find", "Un archivo que el siguiente turno pueda encontrar"),
    context: l("You work at a warehouse. The evening team needs today's receiving log, and several files have similar names.", "Trabajas en un almacén. El equipo de la tarde necesita el registro de recepción de hoy y varios archivos tienen nombres parecidos."),
    documents: [
      { title: l("Team filing agreement", "Acuerdo del equipo para guardar archivos"), source: l("North Dock · Receiving desk · September 2026", "Muelle Norte · Recepción · Septiembre de 2026"), paragraphs: [l("Completed receiving logs are stored in Receiving / September. Names use Receiving_YYYY-MM-DD_Shift. The date is the delivery date, not the date someone uploads the file. Older logs stay in the folder.", "Los registros completos se guardan en Recepción / Septiembre. Los nombres usan Recepcion_AAAA-MM-DD_Turno. La fecha corresponde a la entrega, no al día en que se sube el archivo. Los registros anteriores permanecen en la carpeta.")] },
      { title: l("Downloads · September 14", "Descargas · 14 de septiembre"), source: l("Shared workstation · File previews", "Computadora compartida · Vistas previas"), table: { columns: [l("Filename", "Nombre del archivo"), l("Contents", "Contenido")], rows: [
        [l("scan (4).pdf", "escaneo (4).pdf"), l("September 14 · Morning shift · Completed receiving log", "14 de septiembre · Turno de mañana · Registro completo")],
        [l("scan (3).pdf", "escaneo (3).pdf"), l("September 13 · Evening shift · Completed receiving log", "13 de septiembre · Turno de tarde · Registro completo")],
        [l("Receiving_blank.pdf", "Recepcion_vacio.pdf"), l("Empty form", "Formulario vacío")],
      ] } },
    ],
    discuss: [l("Which file should the evening team receive? Suggest a name and a folder using the team's agreement.", "¿Qué archivo debe recibir el equipo de la tarde? Propongan un nombre y una carpeta según el acuerdo del equipo."), l("What would you do if the folder already had a file with that name?", "¿Qué harían si la carpeta ya tuviera un archivo con ese nombre?")],
    evidence: [l("The source is scan (4).pdf. Receiving_2026-09-14_Morning.pdf in Receiving / September follows the agreement. In Spanish, Recepcion_2026-09-14_Manana.pdf in Recepción / Septiembre is equivalent.", "La fuente es escaneo (4).pdf. Recepcion_2026-09-14_Manana.pdf en Recepción / Septiembre sigue el acuerdo. En inglés, Receiving_2026-09-14_Morning.pdf en Receiving / September es equivalente."), l("For a duplicate, compare the contents or ask which version is current before replacing anything; do not delete the older day's record just to tidy the folder.", "Si hay un duplicado, se compara el contenido o se pregunta cuál es la versión actual antes de reemplazarlo; no se borra el registro del día anterior solo para ordenar.")],
    change: l("The upload happens on September 15. Ask whether the filename date changes. It stays September 14 because that is the delivery date.", "El archivo se sube el 15 de septiembre. Pregunte si cambia la fecha del nombre. Sigue siendo el 14 porque esa es la fecha de entrega."),
  },
  spreadsheet: {
    title: l("Receipts behind the weekly total", "Los recibos detrás del total semanal"),
    context: l("You help an office coordinator check a small supply purchase. One piece of paper is a quote, not a purchase.", "Ayudas a una coordinadora de oficina a revisar una compra pequeña de suministros. Uno de los documentos es una cotización, no una compra."),
    documents: [
      { title: l("Purchase records", "Registros de compras"), source: l("Cedar Office · September 14–16 · Final amounts including any tax", "Oficina Cedar · 14–16 de septiembre · Importes finales con impuestos incluidos"), table: { columns: [l("Reference", "Referencia"), l("Item", "Artículo"), l("Status", "Estado"), l("Amount", "Importe")], rows: [
        [l("R-104", "R-104"), l("Copy paper", "Papel de copia"), l("Paid receipt", "Recibo pagado"), l("$24.50", "$24.50")],
        [l("R-105", "R-105"), l("Pens", "Bolígrafos"), l("Paid receipt", "Recibo pagado"), l("$8.75", "$8.75")],
        [l("Q-208", "Q-208"), l("Desk lamp", "Lámpara"), l("Quote only; not ordered", "Solo cotización; sin pedido"), l("$32.00", "$32.00")],
        [l("R-106", "R-106"), l("Folders", "Carpetas"), l("Paid receipt", "Recibo pagado"), l("$12.25", "$12.25")],
      ] } },
      { title: l("Supply sheet · Saved draft", "Hoja de suministros · Borrador guardado"), source: l("Prepared by: Sam · Wednesday, 4:00 PM", "Preparado por: Sam · Miércoles, 4:00 PM"), paragraphs: [l("Column B contains paid purchases: B2 paper $24.50; B3 pens $8.75; B4 folders $12.25. Cell B5 is labeled Total. Its current formula is =SUM(B2:B3), and it displays $33.25. The $32.00 lamp quote is kept in a separate notes tab.", "La columna B contiene compras pagadas: B2 papel $24.50; B3 bolígrafos $8.75; B4 carpetas $12.25. La celda B5 tiene la etiqueta Total. Su fórmula actual es =SUM(B2:B3) y muestra $33.25. La cotización de la lámpara de $32.00 se guarda en otra pestaña de notas.")] },
    ],
    discuss: [l("Does the displayed total include every paid purchase? Which rows belong in the formula?", "¿El total mostrado incluye todas las compras pagadas? ¿Qué filas corresponden a la fórmula?"), l("How would you explain the correction to Sam without including the quote as money spent?", "¿Cómo explicarían la corrección a Sam sin incluir la cotización como dinero gastado?")],
    evidence: [l("=SUM(B2:B4) includes all three paid purchases and produces $45.50. The original range omits the $12.25 folders. Equivalent formulas are acceptable if they include each paid amount once.", "=SUM(B2:B4) incluye las tres compras pagadas y produce $45.50. El rango original omite las carpetas de $12.25. Se aceptan fórmulas equivalentes que incluyan cada importe pagado una sola vez."), l("The $32.00 quote is excluded because it is not a paid purchase, not because of its position in the list.", "Se excluye la cotización de $32.00 porque no es una compra pagada, no por su posición en la lista.")],
    change: l("The lamp is purchased for $30.00 and its receipt is entered in B5; Total moves to B6. Ask for the new total and range: $75.50, =SUM(B2:B5).", "Se compra la lámpara por $30.00 y su recibo se ingresa en B5; el Total pasa a B6. Pregunte el nuevo total y rango: $75.50, =SUM(B2:B5)."),
  },
  "appointment-scheduling": {
    title: l("A visit that fits the whole window", "Una cita que cabe en todo el período"),
    context: l("You work at the front desk of a fictional community clinic. A caller has a limited time window and needs a full 30-minute appointment.", "Trabajas en la recepción de una clínica comunitaria ficticia. Una persona tiene disponibilidad limitada y necesita una cita completa de 30 minutos."),
    documents: [
      { title: l("Callback note", "Nota para devolver la llamada"), source: l("Caller: Alex Rivera · Tuesday, September 15 · Scheduling only", "Persona: Alex Rivera · Martes 15 de septiembre · Solo programación"), paragraphs: [l("Thursday, September 17 works for me. I can arrive at 10:00 AM at the earliest and must leave by 11:00 AM. I need a 30-minute visit. Please confirm the time with me before booking.", "Me sirve el jueves 17 de septiembre. Puedo llegar a las 10:00 AM como muy temprano y debo salir antes de las 11:00 AM. Necesito una cita de 30 minutos. Por favor confirma la hora conmigo antes de reservar.")] },
      { title: l("Thursday appointment book", "Agenda de citas del jueves"), source: l("Community clinic · September 17 · All times local", "Clínica comunitaria · 17 de septiembre · Hora local"), table: { columns: [l("Time", "Hora"), l("Status", "Estado")], rows: [
        [l("9:30–10:00 AM", "9:30–10:00 AM"), l("Available", "Disponible")],
        [l("10:00–10:30 AM", "10:00–10:30 AM"), l("Booked", "Reservado")],
        [l("10:30–11:00 AM", "10:30–11:00 AM"), l("Available", "Disponible")],
        [l("11:00–11:30 AM", "11:00–11:30 AM"), l("Available", "Disponible")],
      ] } },
    ],
    discuss: [l("Which available appointment fits both the arrival and departure limits? What would you confirm with Alex?", "¿Qué cita disponible respeta los límites de llegada y salida? ¿Qué confirmarían con Alex?"), l("Why is an empty space on the calendar not enough on its own?", "¿Por qué un espacio libre en el calendario no basta por sí solo?")],
    evidence: [l("September 17, 10:30–11:00 AM is available and fits the full visit. 9:30 is too early; 10:00 is booked; 11:00 ends too late. The learner confirms the proposed date and time before booking.", "El 17 de septiembre de 10:30 a 11:00 AM está disponible y permite la cita completa. Las 9:30 es muy temprano; las 10:00 está reservado; las 11:00 termina muy tarde. Se confirma la fecha y la hora propuestas antes de reservar.")],
    change: l("Alex now needs to leave at 10:45 AM. No listed slot fits a full 30 minutes. Ask what to do next: explain the mismatch and ask about another day or time rather than shortening the visit or double-booking.", "Alex ahora necesita salir a las 10:45 AM. Ningún espacio permite los 30 minutos completos. Pregunte qué hacer: explicar el problema y consultar otro día u horario, sin acortar la cita ni reservar encima de otra."),
  },
};
