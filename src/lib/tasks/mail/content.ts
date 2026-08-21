import type { ConfidenceOption, Lang, Lesson, Localized, PickableItem } from "@/lib/task-types";

export const MAIL_COPY: Record<Lang, {
  practiceBanner: string;
  inbox: string;
  compose: string;
  emptyPane: string;
  taskTitle: string;
  taskGoal: string;
  helpBtn: string;
  langBtn: string;
  reply: string;
  forward: string;
  supervisor: string;
  emailSubject: string;
  to: string;
  subjectLabel: string;
  reSubject: string;
  writeHere: string;
  startersLabel: string;
  send: string;
  attach: string;
  discard: string;
  sentKicker: string;
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
  pickerTitle: string;
  downloads: string;
  cancel: string;
  open: string;
  colName: string;
  colDate: string;
  steps: string[];
}> = {
  en: {
    practiceBanner: "Practice space — nothing here is real",
    inbox: "Inbox",
    compose: "Compose",
    emptyPane: "Click an email on the left to open it.",
    taskTitle: "Answer your supervisor",
    taskGoal: "Maria needs last month's safety report. Read her email, reply, and send the file.",
    helpBtn: "Help me with this step",
    langBtn: "Español",
    reply: "Reply",
    forward: "Forward",
    supervisor: "Your supervisor",
    emailSubject: "Safety report for July — need today",
    to: "To",
    subjectLabel: "Subject",
    reSubject: "Re: Safety report for July",
    writeHere: "Write your message here…",
    startersLabel: "Sentence starters",
    send: "Send",
    attach: "Attach file",
    discard: "Discard",
    sentKicker: "Message sent",
    doneTitle: "You answered your supervisor.",
    doneBody: "Maria got your reply and the file. In a real job, this is how most requests from a manager are handled — a short answer with the file attached.",
    badgeName: "Reply with an attachment",
    badgeWhere: "Counts toward: Office Ready · Food Service Ready",
    confidenceQ: "How do you feel about doing this at work tomorrow?",
    tryAgain: "Do it again",
    backToDesk: "Back to desktop",
    lessonKicker: "2-minute lesson",
    tipLabel: "Tip",
    gotIt: "Got it — back to my task",
    askPerson: "Ask a person instead",
    pickerTitle: "Choose a file to attach",
    downloads: "Downloads",
    cancel: "Cancel",
    open: "Open",
    colName: "Name",
    colDate: "Date modified",
    steps: ["Open Maria's email", "Read what she's asking for", "Click Reply", "Attach the safety report", "Send your reply"],
  },
  es: {
    practiceBanner: "Espacio de práctica — nada aquí es real",
    inbox: "Bandeja",
    compose: "Redactar",
    emptyPane: "Haz clic en un correo a la izquierda para abrirlo.",
    taskTitle: "Responde a tu supervisora",
    taskGoal: "Maria necesita el reporte de seguridad del mes pasado. Lee su correo, responde y envía el archivo.",
    helpBtn: "Ayúdame con este paso",
    langBtn: "English",
    reply: "Responder",
    forward: "Reenviar",
    supervisor: "Tu supervisora",
    emailSubject: "Reporte de seguridad de julio — para hoy",
    to: "Para",
    subjectLabel: "Asunto",
    reSubject: "Re: Reporte de seguridad de julio",
    writeHere: "Escribe tu mensaje aquí…",
    startersLabel: "Frases de ayuda",
    send: "Enviar",
    attach: "Adjuntar archivo",
    discard: "Descartar",
    sentKicker: "Mensaje enviado",
    doneTitle: "Respondiste a tu supervisora.",
    doneBody: "Maria recibió tu respuesta y el archivo. En un trabajo real, así se responde a la mayoría de las peticiones de un jefe: una respuesta corta con el archivo adjunto.",
    badgeName: "Responder con un archivo adjunto",
    badgeWhere: "Cuenta para: Oficina · Servicio de alimentos",
    confidenceQ: "¿Cómo te sientes de hacer esto mañana en el trabajo?",
    tryAgain: "Hacerlo otra vez",
    backToDesk: "Volver al escritorio",
    lessonKicker: "Lección de 2 minutos",
    tipLabel: "Consejo",
    gotIt: "Entendido — volver a mi tarea",
    askPerson: "Mejor preguntar a una persona",
    pickerTitle: "Elige un archivo para adjuntar",
    downloads: "Descargas",
    cancel: "Cancelar",
    open: "Abrir",
    colName: "Nombre",
    colDate: "Fecha",
    steps: ["Abre el correo de Maria", "Lee lo que ella pide", "Haz clic en Responder", "Adjunta el reporte de seguridad", "Envía tu respuesta"],
  },
};

export const BODY: Record<Lang, { plain: string[]; full: string[] }> = {
  en: {
    plain: ["Hi,", "Please send me the safety report for July.", "Send it today. Attach the file to your email.", "Thank you.", "Maria"],
    full: ["Good morning,", "Could you send me the July safety report before the end of the day? Corporate is asking for it and I don't have a copy.", "Please attach the PDF to your reply so I can forward it directly.", "Thanks so much,", "Maria Delgado · Cafe Manager"],
  },
  es: {
    plain: ["Hola,", "Por favor envíame el reporte de seguridad de julio.", "Envíalo hoy. Adjunta el archivo a tu correo.", "Gracias.", "Maria"],
    full: ["Buenos días,", "¿Puedes enviarme el reporte de seguridad de julio antes del final del día? La oficina central lo está pidiendo y no tengo una copia.", "Por favor adjunta el PDF a tu respuesta para poder reenviarlo directamente.", "Muchas gracias,", "Maria Delgado · Gerente del café"],
  },
};

export const STARTERS: Record<Lang, string[]> = {
  en: ["Hi Maria, here is the July safety report.", "Yes, I can send it today.", "I attached the file to this email.", "Let me know if you need anything else."],
  es: ["Hola Maria, aquí está el reporte de seguridad de julio.", "Sí, puedo enviarlo hoy.", "Adjunté el archivo a este correo.", "Avísame si necesitas algo más."],
};

export const LESSONS: Record<Lang, Lesson[]> = {
  en: [
    { t: "Which email is mine?", s: ["Look at the name on the left of each row — that's who sent it.", "Bold rows are emails you haven't opened yet.", "Click the row from Maria Delgado — she's your manager."], tip: "Clicking an email never sends anything. It's safe to open and look." },
    { t: "Reading a work email", s: ["Look for what the person is asking you to DO.", "Look for WHEN they need it.", "Here: send the July safety report, today."], tip: "You can read it twice. Nobody sees how long you take." },
    { t: "Reply vs. Forward", s: ["Reply sends your message back to the person who wrote to you.", "Forward sends their email to somebody else.", "Maria wrote to you, so click Reply."], tip: "If you're answering the person who emailed you, it's always Reply." },
    { t: "Attaching a file", s: ["Click Attach file under your message.", "A window opens showing your files. Downloaded files are usually in Downloads.", "Click the file name — safety-report-july.pdf — to attach it."], tip: "Once it attaches, you'll see the file name in a green box. That means it worked." },
    { t: "Before you press Send", s: ["Is there a message in the box?", "Is the file attached — do you see the green box?", "Then click Send. You can't break anything here."], tip: "In real email you can't unsend after a minute, so a quick check is a good habit." },
  ],
  es: [
    { t: "¿Cuál correo es el mío?", s: ["Mira el nombre a la izquierda de cada fila — esa persona lo envió.", "Las filas en negrita son correos que no has abierto.", "Haz clic en el de Maria Delgado — ella es tu gerente."], tip: "Abrir un correo no envía nada. Es seguro mirarlo." },
    { t: "Leer un correo del trabajo", s: ["Busca qué te pide HACER la persona.", "Busca CUÁNDO lo necesita.", "Aquí: enviar el reporte de seguridad de julio, hoy."], tip: "Puedes leerlo dos veces. Nadie ve cuánto tiempo tomas." },
    { t: "Responder o Reenviar", s: ["Responder envía tu mensaje a la persona que te escribió.", "Reenviar manda su correo a otra persona.", "Maria te escribió a ti, así que haz clic en Responder."], tip: "Si contestas a quien te escribió, siempre es Responder." },
    { t: "Adjuntar un archivo", s: ["Haz clic en Adjuntar archivo debajo de tu mensaje.", "Se abre una ventana con tus archivos. Lo descargado suele estar en Descargas.", "Haz clic en safety-report-july.pdf para adjuntarlo."], tip: "Cuando se adjunta, verás el nombre en una caja verde. Eso significa que funcionó." },
    { t: "Antes de enviar", s: ["¿Hay un mensaje en la caja?", "¿Está el archivo adjunto — ves la caja verde?", "Entonces haz clic en Enviar. Aquí no puedes romper nada."], tip: "En el correo real no se puede cancelar después de un minuto; revisar es buena costumbre." },
  ],
};

export const COACH: Record<Lang, string[]> = {
  en: ["Click the email from Maria Delgado.", "Read her message, then click Reply.", "Type a short answer, or tap a sentence starter below.", "Click Attach file and choose the safety report.", "Everything's ready. Click Send."],
  es: ["Haz clic en el correo de Maria Delgado.", "Lee su mensaje y haz clic en Responder.", "Escribe una respuesta corta, o toca una frase de ayuda.", "Haz clic en Adjuntar archivo y elige el reporte.", "Todo está listo. Haz clic en Enviar."],
};

const wrongHint = (en: string, es: string): Localized => ({ en, es });

export const FILES: PickableItem[] = [
  { key: "photo-jobsite-0714.jpg", label: "photo-jobsite-0714.jpg", tagText: "JPG", tagColor: "#5f6368", columns: ["Jul 14"], isTarget: false,
    wrongHint: wrongHint("That's a photo, not the report. Look for the file with 'safety-report' in the name.", "Esa es una foto, no el reporte. Busca el archivo que dice 'safety-report'.") },
  { key: "safety-report-july.pdf", label: "safety-report-july.pdf", tagText: "PDF", tagColor: "#1e8e3e", columns: ["Aug 1"], isTarget: true, wrongHint: null },
  { key: "shift-swap-form.pdf", label: "shift-swap-form.pdf", tagText: "PDF", tagColor: "#1e8e3e", columns: ["Jul 22"], isTarget: false,
    wrongHint: wrongHint("Close — but that's the shift swap form. You need the safety report.", "Casi — ese es el formulario de cambio de turno. Necesitas el reporte de seguridad.") },
  { key: "safety-report-june.pdf", label: "safety-report-june.pdf", tagText: "PDF", tagColor: "#1e8e3e", columns: ["Jul 1"], isTarget: false,
    wrongHint: wrongHint("That one is June. Maria asked for July.", "Ese es de junio. Maria pidió el de julio.") },
];

export const EMAILS = [
  { key: "maria", from: "Maria Delgado", initials: "MD", color: "#1a73e8", time: "8:14 AM", isTarget: true,
    subject: { en: "Safety report for July — need today", es: "Reporte de seguridad de julio — para hoy" },
    preview: { en: "Hi, can you send me the July safety…", es: "Hola, ¿puedes enviarme el reporte…" } },
  { key: "hr", from: "Harborside HR", initials: "HR", color: "#5f6368", time: "Mon", isTarget: false,
    subject: { en: "Your paystub is ready", es: "Tu recibo de pago está listo" },
    preview: { en: "View your paystub in the portal.", es: "Ve tu recibo en el portal." } },
  { key: "team", from: "Cafe Team", initials: "CT", color: "#1e8e3e", time: "Mon", isTarget: false,
    subject: { en: "Break room fridge cleaning", es: "Limpieza del refrigerador" },
    preview: { en: "Please remove your food by Friday.", es: "Saca tu comida antes del viernes." } },
];

export const CONFIDENCE_OPTIONS: Record<Lang, ConfidenceOption[]> = {
  en: [
    { label: "Still unsure", reply: "That's honest — do the task once more, or bring it to Wednesday drop-in and we'll do it together." },
    { label: "I could try", reply: "Good. Try it again without guided mode — that's how it will feel at work." },
    { label: "I can do this", reply: "You just did it with no help on the last two steps. Move on to the next task on your desktop." },
  ],
  es: [
    { label: "Todavía dudo", reply: "Eso es honesto — hazlo otra vez, o ven el miércoles y lo hacemos juntos." },
    { label: "Podría intentarlo", reply: "Bien. Inténtalo otra vez sin el modo guiado — así se siente en el trabajo." },
    { label: "Puedo hacerlo", reply: "Lo hiciste sin ayuda en los últimos dos pasos. Sigue con la siguiente tarea en tu escritorio." },
  ],
};
