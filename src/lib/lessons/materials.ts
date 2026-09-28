import type { TaskKey } from "@/lib/desktop-content";
import type { Localized } from "@/lib/task-types";

export type PracticeDocument = {
  title: Localized;
  source: Localized;
  paragraphs?: Localized[];
  /** A `null` cell prints empty, for the learner to fill in on paper. */
  table?: { columns: (Localized | null)[]; rows: (Localized | null)[][] };
};
/** One printed question, with room to answer. `lines` is how many blank lines to print (0 for a question answered on a document, like filling a grid). */
export type LearnerQuestion = { ask: Localized; lines: number };
export type PracticePack = {
  title: Localized;
  context: Localized;
  documents: PracticeDocument[];
  /** Prints with the documents: what the learner does, in plain words, with space to write. */
  learnerTask: LearnerQuestion[];
  discuss: Localized[];
  evidence: Localized[];
  change: Localized;
};
const l = (en: string, es: string): Localized => ({ en, es });
const blank = null;

/**
 * New transfer situations, deliberately separate from the simulator's answer keys.
 * Workplace file names stay in English in both languages, the way the lessons keep
 * them; the Spanish copy glosses the words a learner needs.
 */
export const PRACTICE_PACKS: Partial<Record<TaskKey, PracticePack>> = {
  "mail-reply": {
    title: l("A delivery time changed", "Cambió la hora de una entrega"),
    context: l("You work at Bay Street Market. Your supervisor, Elena, sent you an email. She needs an answer today.", "Trabajas en Bay Street Market. Tu supervisora, Elena, te mandó un correo. Necesita una respuesta hoy."),
    documents: [
      {
        title: l("Email: The truck is late", "Correo: El camión llega tarde"),
        source: l("From: Elena Ruiz, supervisor · To: you · Tuesday, 9:10 AM", "De: Elena Ruiz, supervisora · Para: ti · Martes, 9:10 AM"),
        paragraphs: [l("Hi. The fruit truck will come on Wednesday at 10:30 AM. It was 8:00 AM before. Can you meet the driver at the back door? Please answer me by 2:00 PM today. Thank you. —Elena", "Hola. El camión de fruta va a llegar el miércoles a las 10:30 AM. Antes era a las 8:00 AM. ¿Puedes recibir al conductor en la puerta de atrás? Por favor contéstame hoy antes de las 2:00 PM. Gracias. —Elena")],
      },
      {
        title: l("Your work on Wednesday", "Tu trabajo del miércoles"),
        source: l("Bay Street Market · Schedule", "Bay Street Market · Horario"),
        table: { columns: [l("Time", "Hora"), l("Your job", "Tu tarea")], rows: [
          [l("8:00–10:00 AM", "8:00–10:00 AM"), l("Put food on the shelves", "Poner comida en los estantes")],
          [l("10:00–11:00 AM", "10:00–11:00 AM"), l("Work at register 2 (no one else)", "Trabajar en la caja 2 (no hay nadie más)")],
          [l("11:00 AM–12:00 PM", "11:00 AM–12:00 PM"), l("Get deliveries", "Recibir entregas")],
        ] },
      },
    ],
    learnerTask: [
      { ask: l("What time is the truck coming now?", "¿A qué hora llega el camión ahora?"), lines: 1 },
      { ask: l("Look at your schedule. What are you doing at that time?", "Mira tu horario. ¿Qué haces a esa hora?"), lines: 1 },
      { ask: l("Write a short answer to Elena. Can you meet the driver?", "Escribe una respuesta corta a Elena. ¿Puedes recibir al conductor?"), lines: 3 },
    ],
    discuss: [l("What does Elena need to know? Which time is the truck, and which time is the deadline to answer?", "¿Qué necesita saber Elena? ¿Cuál es la hora del camión y cuál es la hora límite para contestar?"), l("Share replies. Did each one say why? Did it offer an idea, like asking for someone at the register?", "Compartan las respuestas. ¿Cada una dice por qué? ¿Ofrece una idea, como pedir a alguien para la caja?")],
    evidence: [l("The truck comes Wednesday at 10:30 AM; the answer is due Tuesday by 2:00 PM. The learner tells these apart from the old 8:00 AM time.", "El camión llega el miércoles a las 10:30 AM; la respuesta vence el martes a las 2:00 PM. Se distinguen estas horas de la hora anterior, las 8:00 AM."), l("A good reply says no (or not unless someone covers the register) and gives the reason: register 2 at 10:30. \"Sorry, I am at register 2 then\" is enough. No greeting or exact wording is required.", "Una buena respuesta dice que no (o que no, a menos que alguien cubra la caja) y da la razón: la caja 2 a las 10:30. \"Lo siento, a esa hora estoy en la caja 2\" es suficiente. No se exige saludo ni palabras exactas.")],
    change: l("Elena writes back: Luis will work at register 2 from 10:15 to 10:45 AM. Ask learners to change their reply. Now they can say yes. What changed?", "Elena contesta: Luis va a trabajar en la caja 2 de 10:15 a 10:45 AM. Pida que cambien su respuesta. Ahora pueden decir que sí. ¿Qué cambió?"),
  },
  "mail-attach": {
    title: l("The right inspection record", "El registro de inspección correcto"),
    context: l("You clean rooms at a hotel. Your supervisor, Nia, wants today's finished checklist for floor 3.", "Limpias habitaciones en un hotel. Tu supervisora, Nia, quiere la lista de revisión terminada de hoy del piso 3."),
    documents: [
      { title: l("Email: Floor 3 checklist", "Correo: Lista del piso 3"), source: l("From: Nia Patel, supervisor · Monday, September 14, 1:20 PM", "De: Nia Patel, supervisora · Lunes 14 de septiembre, 1:20 PM"), paragraphs: [l("Please send me today's finished checklist for floor 3. Send the PDF. I do not need the guest list. —Nia", "Por favor mándame la lista de revisión terminada de hoy del piso 3. Manda el PDF. No necesito la lista de huéspedes. —Nia")] },
      { title: l("Folder: Floor 3", "Carpeta: Floor 3 (Piso 3)"), source: l("Harbor Hotel · Shared folder", "Harbor Hotel · Carpeta compartida · DRAFT = borrador · COMPLETE = terminado · GuestList = lista de huéspedes"), table: { columns: [l("File name", "Nombre del archivo"), l("What is inside", "Qué tiene")], rows: [
        [l("Floor3_2026-09-14_DRAFT.pdf", "Floor3_2026-09-14_DRAFT.pdf"), l("Rooms 301–310. Two checks are empty.", "Habitaciones 301–310. Faltan dos revisiones.")],
        [l("Floor3_2026-09-11_COMPLETE.pdf", "Floor3_2026-09-11_COMPLETE.pdf"), l("All checks signed. September 11.", "Todas las revisiones firmadas. 11 de septiembre.")],
        [l("Floor3_2026-09-14_COMPLETE.pdf", "Floor3_2026-09-14_COMPLETE.pdf"), l("Rooms 301–310. All checks signed today.", "Habitaciones 301–310. Todas las revisiones firmadas hoy.")],
        [l("GuestList_2026-09-14.xlsx", "GuestList_2026-09-14.xlsx"), l("Guest names and room numbers.", "Nombres de huéspedes y números de habitación.")],
      ] } },
    ],
    learnerTask: [
      { ask: l("Circle the file Nia needs.", "Encierra en un círculo el archivo que necesita Nia."), lines: 0 },
      { ask: l("Why not the other PDFs? Write one reason for each.", "¿Por qué no los otros PDF? Escribe una razón para cada uno."), lines: 2 },
      { ask: l("Write a short message to send with the file.", "Escribe un mensaje corto para mandar con el archivo."), lines: 2 },
    ],
    discuss: [l("Which file belongs in the reply? What two details rule out the other checklists?", "¿Qué archivo va en la respuesta? ¿Qué dos detalles descartan las otras listas?"), l("How can you check the attachment before you click Send?", "¿Cómo puedes revisar el adjunto antes de hacer clic en Enviar?")],
    evidence: [l("Floor3_2026-09-14_COMPLETE.pdf matches the date, the floor, the finished status, and the PDF format. The September 14 DRAFT is not finished; the September 11 file is the wrong day; the guest list was not asked for.", "Floor3_2026-09-14_COMPLETE.pdf coincide con la fecha, el piso, el estado terminado y el formato PDF. El DRAFT del 14 de septiembre no está terminado; el archivo del 11 de septiembre es de otro día; la lista de huéspedes no se pidió."), l("The learner checks the file name or its preview after attaching. Choosing a file is not the same as sending the message.", "Se revisa el nombre del archivo o la vista previa después de adjuntarlo. Elegir un archivo no es lo mismo que mandar el mensaje.")],
    change: l("The COMPLETE file for September 14 is missing. Ask what to tell Nia. Accept asking where it is, or saying only a draft is ready. Renaming the draft does not finish the checklist.", "Falta el archivo COMPLETE del 14 de septiembre. Pregunte qué se le puede decir a Nia. Acepte preguntar dónde está o avisar que solo hay un borrador. Cambiarle el nombre al borrador no termina la lista."),
  },
  calendar: {
    title: l("A training at the wrong time", "Una capacitación a una hora que no puedes"),
    context: l("You work at a warehouse. Your coordinator, Omar, invited you to a short training. Check your shifts before you answer.", "Trabajas en un almacén. Tu coordinador, Omar, te invitó a una capacitación corta. Revisa tus turnos antes de contestar."),
    documents: [
      { title: l("Invitation: Scanner training", "Invitación: Capacitación del escáner"), source: l("From: Omar Chen, coordinator · Monday, September 14", "De: Omar Chen, coordinador · Lunes 14 de septiembre"), paragraphs: [l("Scanner training · Thursday, September 17 · 4:30–5:00 PM · Room B", "Capacitación del escáner · Jueves 17 de septiembre · 4:30–5:00 PM · Sala B"), l("Can't come? You can come to the same training on Friday at 1:00 PM or Monday at 8:00 AM. Tell me which one. —Omar", "¿No puedes venir? Puedes ir a la misma capacitación el viernes a la 1:00 PM o el lunes a las 8:00 AM. Dime cuál. —Omar")] },
      { title: l("Your shifts", "Tus turnos"), source: l("North Dock Warehouse · Week of September 14", "Almacén North Dock · Semana del 14 de septiembre"), table: { columns: [l("Day", "Día"), l("Shift", "Turno")], rows: [
        [l("Thursday, Sept. 17", "Jueves 17 de sept."), l("7:00 AM–3:00 PM", "7:00 AM–3:00 PM")],
        [l("Friday, Sept. 18", "Viernes 18 de sept."), l("11:00 AM–7:00 PM", "11:00 AM–7:00 PM")],
        [l("Saturday, Sept. 19", "Sábado 19 de sept."), l("Day off", "Día libre")],
        [l("Sunday, Sept. 20", "Domingo 20 de sept."), l("Day off", "Día libre")],
        [l("Monday, Sept. 21", "Lunes 21 de sept."), l("Day off", "Día libre")],
      ] } },
    ],
    learnerTask: [
      { ask: l("On Thursday, what time do you finish work? Can you go to the training at 4:30?", "El jueves, ¿a qué hora terminas de trabajar? ¿Puedes ir a la capacitación a las 4:30?"), lines: 1 },
      { ask: l("Omar gives two more times. Which one is during your shift?", "Omar da dos horas más. ¿Cuál es durante tu turno?"), lines: 1 },
      { ask: l("Write a short answer to Omar. Say no to Thursday and give the new time.", "Escribe una respuesta corta a Omar. Di que no al jueves y da la nueva hora."), lines: 3 },
    ],
    discuss: [l("Why is Thursday a problem? Where does 4:30 PM fall on the shift list?", "¿Por qué el jueves es un problema? ¿Dónde queda las 4:30 PM en la lista de turnos?"), l("Why is Monday not a good choice, even though it is free?", "¿Por qué el lunes no es buena opción, aunque está libre?")],
    evidence: [l("Thursday's shift ends at 3:00 PM, so 4:30 PM is after work. Friday at 1:00 PM is inside the 11:00 AM–7:00 PM shift. Monday is a day off.", "El turno del jueves termina a las 3:00 PM, así que las 4:30 PM es después del trabajo. El viernes a la 1:00 PM está dentro del turno de 11:00 AM a 7:00 PM. El lunes es día libre."), l("A good reply declines Thursday and names Friday at 1:00 PM. \"Sorry, I finish at 3 on Thursday. Can I come Friday at 1?\" is enough. Accept a learner who says they could stay late Thursday if they also ask Omar first.", "Una buena respuesta dice que no al jueves y nombra el viernes a la 1:00 PM. \"Lo siento, el jueves termino a las 3. ¿Puedo ir el viernes a la 1?\" es suficiente. Acepte a quien diga que podría quedarse tarde el jueves si también le pregunta a Omar primero.")],
    change: l("The manager moves the Friday shift to 3:00–11:00 PM. Now none of Omar's times is during a shift. Ask what to write. Accept asking Omar for another time, rather than going on a day off without asking.", "El gerente cambia el turno del viernes a 3:00–11:00 PM. Ahora ninguna de las horas de Omar es durante un turno. Pregunte qué escribirían. Acepte pedirle otra hora a Omar, en vez de ir en un día libre sin preguntar."),
  },
  files: {
    title: l("A file the next shift can find", "Un archivo que el siguiente turno pueda encontrar"),
    context: l("You work at a warehouse. The evening team needs today's receiving log. Some files have almost the same name.", "Trabajas en un almacén. El equipo de la tarde necesita el registro de recepción de hoy. Algunos archivos tienen nombres casi iguales."),
    documents: [
      { title: l("Team rules for files", "Reglas del equipo para los archivos"), source: l("North Dock · Receiving desk", "North Dock · Recepción · Receiving = recepción · Morning = mañana · Evening = tarde"), paragraphs: [l("1. Put finished receiving logs in the folder Receiving / September.", "1. Guarda los registros de recepción terminados en la carpeta Receiving / September."), l("2. Name them like this: Receiving_YEAR-MONTH-DAY_Shift.pdf. Use the day of the delivery, not the day you save the file.", "2. Ponles este nombre: Receiving_AÑO-MES-DÍA_Shift.pdf (Shift = turno, en inglés: Morning o Evening). Usa el día de la entrega, no el día en que guardas el archivo."), l("3. Share the file with the evening lead, Dana Brooks. Dana only needs to see it, not change it.", "3. Comparte el archivo con la persona a cargo de la tarde, Dana Brooks. Dana solo necesita verlo, no cambiarlo.")] },
      { title: l("Downloads folder · September 14", "Carpeta Downloads (Descargas) · 14 de septiembre"), source: l("Shared computer · File previews", "Computadora compartida · Vistas previas"), table: { columns: [l("File name", "Nombre del archivo"), l("What is inside", "Qué tiene")], rows: [
        [l("scan (4).pdf", "scan (4).pdf"), l("September 14 · Morning shift · Finished receiving log", "14 de septiembre · Turno de mañana · Registro terminado")],
        [l("scan (3).pdf", "scan (3).pdf"), l("September 13 · Evening shift · Finished receiving log", "13 de septiembre · Turno de tarde · Registro terminado")],
        [l("Receiving_blank.pdf", "Receiving_blank.pdf"), l("Empty form", "Formulario vacío")],
      ] } },
    ],
    learnerTask: [
      { ask: l("Which file is today's log? Circle it.", "¿Cuál archivo es el registro de hoy? Enciérralo en un círculo."), lines: 0 },
      { ask: l("Write its new name. Follow rule 2.", "Escribe su nuevo nombre. Sigue la regla 2."), lines: 1 },
      { ask: l("Which folder does it go in?", "¿En qué carpeta va?"), lines: 1 },
      { ask: l("Who do you share it with? Circle one: Viewer (can see) or Editor (can change).", "¿Con quién lo compartes? Encierra uno: Viewer (puede ver) o Editor (puede cambiar)."), lines: 1 },
    ],
    discuss: [l("How do you know scan (4).pdf is today's log, when the name does not say?", "¿Cómo saben que scan (4).pdf es el registro de hoy, si el nombre no lo dice?"), l("What would you do if the folder already had a file with that name?", "¿Qué harían si la carpeta ya tuviera un archivo con ese nombre?")],
    evidence: [l("The source is scan (4).pdf. Receiving_2026-09-14_Morning.pdf in Receiving / September follows the rules in both languages; the name stays in English. Dana Brooks gets Viewer access.", "La fuente es scan (4).pdf. Receiving_2026-09-14_Morning.pdf en Receiving / September sigue las reglas en los dos idiomas; el nombre queda en inglés. Dana Brooks recibe acceso de Viewer (lector)."), l("If a file with that name exists, compare the two or ask which is current before replacing anything. Do not delete an older day's log to tidy the folder.", "Si ya existe un archivo con ese nombre, se comparan los dos o se pregunta cuál es el actual antes de reemplazar nada. No se borra el registro de otro día solo para ordenar la carpeta.")],
    change: l("You save the file on September 15. Ask whether the date in the name changes. It stays September 14, because that is the delivery date.", "Guardas el archivo el 15 de septiembre. Pregunte si cambia la fecha del nombre. Sigue siendo el 14 de septiembre, porque es la fecha de la entrega."),
  },
  spreadsheet: {
    title: l("Boxes from the paper log", "Cajas del registro en papel"),
    context: l("You work at a food bank. This week's box count is on a paper log. Your supervisor, Grace, needs the total.", "Trabajas en un banco de comida. El conteo de cajas de esta semana está en un registro de papel. Tu supervisora, Grace, necesita el total."),
    documents: [
      { title: l("Paper log: Boxes packed", "Registro de papel: Cajas empacadas"), source: l("Eastside Food Bank · Week of September 14 · Written by the packing team", "Banco de comida Eastside · Semana del 14 de septiembre · Lo escribió el equipo de empaque"), table: { columns: [l("Day", "Día"), l("Boxes", "Cajas")], rows: [
        [l("Monday", "Lunes"), l("34", "34")],
        [l("Tuesday", "Martes"), l("41", "41")],
        [l("Wednesday", "Miércoles"), l("28 (crossed out) → 38", "28 (tachado) → 38")],
        [l("Thursday", "Jueves"), l("45", "45")],
        [l("Friday", "Viernes"), l("52", "52")],
      ] } },
      { title: l("Spreadsheet: Boxes", "Hoja de cálculo: Cajas"), source: l("Copy each number into column B.", "Copia cada número en la columna B."), table: { columns: [null, l("A", "A"), l("B", "B")], rows: [
        [l("1", "1"), l("Day", "Día"), l("Boxes", "Cajas")],
        [l("2", "2"), l("Monday", "Lunes"), blank],
        [l("3", "3"), l("Tuesday", "Martes"), blank],
        [l("4", "4"), l("Wednesday", "Miércoles"), blank],
        [l("5", "5"), l("Thursday", "Jueves"), blank],
        [l("6", "6"), l("Friday", "Viernes"), blank],
        [l("7", "7"), l("Total", "Total"), blank],
      ] } },
    ],
    learnerTask: [
      { ask: l("Copy the boxes for each day into the spreadsheet, column B.", "Copia las cajas de cada día en la hoja de cálculo, columna B."), lines: 0 },
      { ask: l("Add them. Write the total in B7.", "Súmalas. Escribe el total en B7."), lines: 0 },
      { ask: l("Write one sentence to Grace with the total.", "Escribe una oración a Grace con el total."), lines: 2 },
    ],
    discuss: [l("Which number is right for Wednesday? How do you know?", "¿Qué número es el correcto para el miércoles? ¿Cómo lo saben?"), l("Check your total a second way, for example by adding from the bottom up.", "Revisen el total de otra forma, por ejemplo sumando de abajo hacia arriba.")],
    evidence: [l("The crossed-out 28 is replaced by 38. B2–B6 hold 34, 41, 38, 45, 52; the total is 210. Using 28 gives 200.", "El 28 tachado se reemplaza por 38. B2–B6 tienen 34, 41, 38, 45, 52; el total es 210. Con el 28 da 200."), l("The sentence to Grace names the total (\"This week we packed 210 boxes\"). A number alone is fine for a first answer.", "La oración a Grace dice el total (\"Esta semana empacamos 210 cajas\"). Solo el número también sirve como primera respuesta.")],
    change: l("The packing team finds 6 more boxes from Friday. Ask for the new Friday number and total: 58 and 216. Which cells change?", "El equipo encuentra 6 cajas más del viernes. Pregunte el nuevo número del viernes y el nuevo total: 58 y 216. ¿Qué celdas cambian?"),
  },
  "formula-check": {
    title: l("Receipts behind the total", "Los recibos detrás del total"),
    context: l("You help at an office. Sam made a spreadsheet of what the office paid for supplies. Check the total.", "Ayudas en una oficina. Sam hizo una hoja de cálculo con lo que pagó la oficina por materiales. Revisa el total."),
    documents: [
      { title: l("Receipts and papers", "Recibos y papeles"), source: l("Cedar Office · September 14–16", "Oficina Cedar · 14–16 de septiembre"), table: { columns: [l("Paper", "Papel"), l("Item", "Artículo"), l("What it says", "Qué dice"), l("Amount", "Cantidad")], rows: [
        [l("R-104", "R-104"), l("Copy paper", "Papel de copia"), l("Paid", "Pagado"), l("$24.50", "$24.50")],
        [l("R-105", "R-105"), l("Pens", "Bolígrafos"), l("Paid", "Pagado"), l("$8.75", "$8.75")],
        [l("Q-208", "Q-208"), l("Desk lamp", "Lámpara"), l("Price only. Not bought.", "Solo el precio. No se compró."), l("$32.00", "$32.00")],
        [l("R-106", "R-106"), l("Folders", "Carpetas"), l("Paid", "Pagado"), l("$12.25", "$12.25")],
      ] } },
      { title: l("Sam's spreadsheet", "La hoja de cálculo de Sam"), source: l("Saved Wednesday, 4:00 PM · Cell B5 is selected", "Guardada el miércoles, 4:00 PM · La celda B5 está seleccionada"), paragraphs: [l("B5 formula: =SUM(B2:B3)", "Fórmula de B5: =SUMA(B2:B3)")], table: { columns: [null, l("A", "A"), l("B", "B")], rows: [
        [l("1", "1"), l("Item", "Artículo"), l("Paid", "Pagado")],
        [l("2", "2"), l("Copy paper", "Papel de copia"), l("$24.50", "$24.50")],
        [l("3", "3"), l("Pens", "Bolígrafos"), l("$8.75", "$8.75")],
        [l("4", "4"), l("Folders", "Carpetas"), l("$12.25", "$12.25")],
        [l("5", "5"), l("Total", "Total"), l("$33.25", "$33.25")],
      ] } },
    ],
    learnerTask: [
      { ask: l("Look at the formula in B5. Which rows does it add?", "Mira la fórmula de B5. ¿Qué filas suma?"), lines: 1 },
      { ask: l("Is every paid item in the total? Write the formula that is right.", "¿Está cada cosa pagada en el total? Escribe la fórmula correcta."), lines: 1 },
      { ask: l("What is the right total?", "¿Cuál es el total correcto?"), lines: 1 },
    ],
    discuss: [l("Which row does the formula leave out? How can you tell from B2:B3?", "¿Qué fila deja fuera la fórmula? ¿Cómo se sabe con B2:B3?"), l("Should the lamp be in the total? What on the paper tells you?", "¿La lámpara debe estar en el total? ¿Qué dice el papel?")],
    evidence: [l("B2:B3 adds only rows 2 and 3, so the folders in row 4 are left out. =SUM(B2:B4) (=SUMA in Spanish Sheets) gives $45.50. Any formula that adds each paid item once is fine.", "B2:B3 suma solo las filas 2 y 3, así que las carpetas de la fila 4 quedan fuera. =SUMA(B2:B4) (=SUM en la versión en inglés) da $45.50. Cualquier fórmula que sume cada cosa pagada una vez está bien."), l("The $32.00 lamp stays out because it was not bought (Q-208 is only a price), not because of where it is in the list.", "La lámpara de $32.00 queda fuera porque no se compró (Q-208 es solo un precio), no por su lugar en la lista.")],
    change: l("The office buys the lamp for $30.00. Sam puts it in row 5, and Total moves to row 6. Ask for the new total and formula: $75.50, =SUM(B2:B5).", "La oficina compra la lámpara por $30.00. Sam la pone en la fila 5 y el Total pasa a la fila 6. Pregunte el nuevo total y la fórmula: $75.50, =SUMA(B2:B5)."),
  },
  "appointment-scheduling": {
    title: l("A visit that fits the caller's time", "Una cita que cabe en el horario de quien llama"),
    context: l("You work at the front desk of a clinic. A caller left a message. Find a 30-minute appointment that fits their time.", "Trabajas en la recepción de una clínica. Una persona dejó un mensaje. Busca una cita de 30 minutos que quepa en su horario."),
    documents: [
      { title: l("Phone message", "Mensaje de teléfono"), source: l("Caller: Alex Rivera · Tuesday, September 15", "Persona: Alex Rivera · Martes 15 de septiembre"), paragraphs: [l("I can come on Thursday, September 17. I can come at 10:00 AM or later. I have to leave at 11:00 AM. I need 30 minutes. Please call me before you book it.", "Puedo ir el jueves 17 de septiembre. Puedo llegar a las 10:00 AM o más tarde. Tengo que irme a las 11:00 AM. Necesito 30 minutos. Por favor llámame antes de reservar.")] },
      { title: l("Thursday appointments", "Citas del jueves"), source: l("Clinic · September 17", "Clínica · 17 de septiembre"), table: { columns: [l("Time", "Hora"), l("Status", "Estado")], rows: [
        [l("9:30–10:00 AM", "9:30–10:00 AM"), l("Open", "Libre")],
        [l("10:00–10:30 AM", "10:00–10:30 AM"), l("Booked", "Reservado")],
        [l("10:30–11:00 AM", "10:30–11:00 AM"), l("Open", "Libre")],
        [l("11:00–11:30 AM", "11:00–11:30 AM"), l("Open", "Libre")],
      ] } },
    ],
    learnerTask: [
      { ask: l("Alex can come from ___ to ___.", "Alex puede ir de ___ a ___."), lines: 0 },
      { ask: l("Circle the one open time that fits.", "Encierra en un círculo la hora libre que cabe."), lines: 0 },
      { ask: l("What do you say when you call Alex back?", "¿Qué le dices a Alex cuando le llamas?"), lines: 2 },
    ],
    discuss: [l("Why not 9:30? Why not 11:00? Both are open.", "¿Por qué no a las 9:30? ¿Por qué no a las 11:00? Las dos están libres."), l("Why is an open time on the schedule not enough on its own?", "¿Por qué una hora libre en la agenda no basta por sí sola?")],
    evidence: [l("September 17, 10:30–11:00 AM is open and fits the whole visit. 9:30 is too early; 10:00 is booked; 11:00 ends after Alex leaves. The learner offers the time to Alex before booking.", "El 17 de septiembre de 10:30 a 11:00 AM está libre y cabe la cita completa. Las 9:30 es muy temprano; las 10:00 está reservado; las 11:00 termina después de que Alex se va. Se le ofrece la hora a Alex antes de reservar.")],
    change: l("Alex now has to leave at 10:45 AM. No open time gives a full 30 minutes. Ask what to do: tell Alex, and ask about another day or time. Do not make the visit shorter or book over someone.", "Ahora Alex tiene que irse a las 10:45 AM. Ninguna hora libre da los 30 minutos completos. Pregunte qué hacer: avisarle a Alex y preguntar por otro día u hora. No se acorta la cita ni se reserva encima de otra persona."),
  },
};
