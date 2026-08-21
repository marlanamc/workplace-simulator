import type { ConfidenceOption, EventIntroCopy, Lang, Lesson, Localized, PickableItem } from "@/lib/task-types";

export const EVENT_INTRO: Record<Lang, EventIntroCopy> = {
  en: {
    emoji: "📬",
    kicker: "Day 1, 8:14 AM",
    headline: "Your first message from your boss.",
    body: "You just got to Harborside Cafe for your very first shift. Maria Delgado, the cafe manager, already needs something from you. Let's see what she wants.",
    cta: "Open my inbox",
  },
  es: {
    emoji: "📬",
    kicker: "Día 1, 8:14 AM",
    headline: "Tu primer mensaje de tu jefa.",
    body: "Acabas de llegar a Harborside Cafe para tu primer turno. Maria Delgado, la gerente del café, ya necesita algo de ti. Vamos a ver qué quiere.",
    cta: "Abrir mi bandeja",
  },
};

export const MAIL_COPY: Record<Lang, {
  practiceBanner: string;
  inbox: string;
  starred: string;
  sent: string;
  drafts: string;
  searchPlaceholder: string;
  compose: string;
  emptyPane: string;
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
}> = {
  en: {
    practiceBanner: "Practice space. Nothing here is real.",
    inbox: "Inbox",
    starred: "Starred",
    sent: "Sent",
    drafts: "Drafts",
    searchPlaceholder: "Search mail",
    compose: "Compose",
    emptyPane: "Click an email on the left to open it.",
    helpBtn: "Help me with this step",
    langBtn: "Español",
    reply: "Reply",
    forward: "Forward",
    supervisor: "Your supervisor",
    emailSubject: "Need the July safety report today",
    to: "To",
    subjectLabel: "Subject",
    reSubject: "Re: Need the July safety report today",
    writeHere: "Write your message here…",
    startersLabel: "Sentence starters",
    send: "Send",
    attach: "Attach file",
    discard: "Discard",
    sentKicker: "Message sent",
    doneTitle: "You answered your supervisor.",
    doneBody: "Maria got your reply and the file. In a real job, most asks from a manager look like this. A short answer, with the file attached.",
    badgeName: "Reply with an attachment",
    badgeWhere: "Counts toward: Office Ready · Food Service Ready",
    confidenceQ: "How do you feel about doing this at work tomorrow?",
    tryAgain: "Do it again",
    backToDesk: "Back to desktop",
    lessonKicker: "2-minute lesson",
    tipLabel: "Tip",
    gotIt: "Got it. Back to my task",
    askPerson: "Ask a person instead",
    pickerTitle: "Choose a file to attach",
    downloads: "Downloads",
    cancel: "Cancel",
    open: "Open",
    colName: "Name",
    colDate: "Date modified",
  },
  es: {
    practiceBanner: "Espacio de práctica. Nada aquí es real.",
    inbox: "Recibidos",
    starred: "Destacados",
    sent: "Enviados",
    drafts: "Borradores",
    searchPlaceholder: "Buscar en el correo",
    compose: "Redactar",
    emptyPane: "Haz clic en un correo a la izquierda para abrirlo.",
    helpBtn: "Ayúdame con este paso",
    langBtn: "English",
    reply: "Responder",
    forward: "Reenviar",
    supervisor: "Tu supervisora",
    emailSubject: "Necesito el reporte de seguridad de julio hoy",
    to: "Para",
    subjectLabel: "Asunto",
    reSubject: "Re: Necesito el reporte de seguridad de julio hoy",
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
    gotIt: "Entendido. Volver a mi tarea",
    askPerson: "Mejor preguntar a una persona",
    pickerTitle: "Elige un archivo para adjuntar",
    downloads: "Descargas",
    cancel: "Cancelar",
    open: "Abrir",
    colName: "Nombre",
    colDate: "Fecha",
  },
};

export const BODY: Record<Lang, { plain: string[]; full: string[] }> = {
  en: {
    plain: [
      "Hi,",
      "Can you send me the July safety report today? Please attach the file to your reply.",
      "Thanks,",
      "Maria",
    ],
    full: [
      "Hi,",
      "Could you send me the July safety report today? I need to turn it in and I don't have a copy.",
      "Please attach the PDF to your reply so I can send it along.",
      "Thanks,",
      "Maria",
    ],
  },
  es: {
    plain: [
      "Hola,",
      "¿Me puedes enviar hoy el reporte de seguridad de julio? Por favor adjunta el archivo en tu respuesta.",
      "Gracias,",
      "Maria",
    ],
    full: [
      "Hola,",
      "¿Me puedes enviar hoy el reporte de seguridad de julio? Lo tengo que entregar y no tengo una copia.",
      "Por favor adjunta el PDF en tu respuesta para yo poder reenviarlo.",
      "Gracias,",
      "Maria",
    ],
  },
};

export const STARTERS: Record<Lang, string[]> = {
  en: ["Hi Maria, here is the July safety report.", "Yes, I can send it today.", "I attached the file to this email.", "Let me know if you need anything else."],
  es: ["Hola Maria, aquí está el reporte de seguridad de julio.", "Sí, puedo enviarlo hoy.", "Adjunté el archivo a este correo.", "Avísame si necesitas algo más."],
};

export const LESSONS: Record<Lang, Lesson[]> = {
  en: [
    { t: "Which email is mine?", s: ["A real inbox has lots of mail. Look at the name on the left of each row. That is who sent it.", "Bold rows are emails you haven't opened yet. There may be more than one.", "Click the row from Maria Delgado. She is your manager."], tip: "Clicking an email never sends anything. It's safe to open and look." },
    { t: "Reading a work email", s: ["Look for what the person is asking you to do.", "Look for when they need it.", "Here, Maria wants the July safety report today, attached to your reply."], tip: "You can read it twice. Nobody sees how long you take." },
    { t: "Reply vs. Forward", s: ["Reply sends your message back to the person who wrote to you.", "Forward sends their email to somebody else.", "Maria wrote to you, so click Reply."], tip: "If you're answering the person who emailed you, it's always Reply." },
    { t: "Attaching a file", s: ["Click Attach file under your message.", "A window opens showing your files. Downloaded files are usually in Downloads.", "Click the file name safety-report-july.pdf to attach it."], tip: "Once it attaches, you'll see the file name in a green box. That means it worked." },
    { t: "Before you press Send", s: ["Is there a message in the box?", "Is the file attached? Do you see the green box?", "Then click Send. You can't break anything here."], tip: "In real email you can't unsend after a minute, so a quick check is a good habit." },
  ],
  es: [
    { t: "¿Cuál correo es el mío?", s: ["Una bandeja real tiene mucho correo. Mira el nombre a la izquierda de cada fila. Esa persona lo envió.", "Las filas en negrita son correos que no has abierto. Puede haber más de uno.", "Haz clic en el de Maria Delgado. Ella es tu gerente."], tip: "Abrir un correo no envía nada. Es seguro mirarlo." },
    { t: "Leer un correo del trabajo", s: ["Busca qué te pide hacer la persona.", "Busca cuándo lo necesita.", "Aquí, Maria quiere el reporte de seguridad de julio hoy, adjunto en tu respuesta."], tip: "Puedes leerlo dos veces. Nadie ve cuánto tiempo tomas." },
    { t: "Responder o Reenviar", s: ["Responder envía tu mensaje a la persona que te escribió.", "Reenviar manda su correo a otra persona.", "Maria te escribió a ti, así que haz clic en Responder."], tip: "Si contestas a quien te escribió, siempre es Responder." },
    { t: "Adjuntar un archivo", s: ["Haz clic en Adjuntar archivo debajo de tu mensaje.", "Se abre una ventana con tus archivos. Lo descargado suele estar en Descargas.", "Haz clic en safety-report-july.pdf para adjuntarlo."], tip: "Cuando se adjunta, verás el nombre en una caja verde. Eso significa que funcionó." },
    { t: "Antes de enviar", s: ["¿Hay un mensaje en la caja?", "¿Está el archivo adjunto? ¿Ves la caja verde?", "Entonces haz clic en Enviar. Aquí no puedes romper nada."], tip: "En el correo real no se puede cancelar después de un minuto; revisar es buena costumbre." },
  ],
};

const wrongHint = (en: string, es: string): Localized => ({ en, es });

export const FILES: PickableItem[] = [
  { key: "photo-jobsite-0714.jpg", label: "photo-jobsite-0714.jpg", tagText: "JPG", tagColor: "#5f6368", columns: ["Jul 14"], isTarget: false,
    wrongHint: wrongHint("That's a photo, not the report. Look for the file with 'safety-report' in the name.", "Esa es una foto, no el reporte. Busca el archivo que dice 'safety-report'.") },
  { key: "safety-report-july.pdf", label: "safety-report-july.pdf", tagText: "PDF", tagColor: "#1e8e3e", columns: ["Aug 1"], isTarget: true, wrongHint: null },
  { key: "shift-swap-form.pdf", label: "shift-swap-form.pdf", tagText: "PDF", tagColor: "#1e8e3e", columns: ["Jul 22"], isTarget: false,
    wrongHint: wrongHint("Close, but that is the shift swap form. You need the safety report.", "Casi, pero ese es el formulario de cambio de turno. Necesitas el reporte de seguridad.") },
  { key: "safety-report-june.pdf", label: "safety-report-june.pdf", tagText: "PDF", tagColor: "#1e8e3e", columns: ["Jul 1"], isTarget: false,
    wrongHint: wrongHint("That one is June. Maria asked for July.", "Ese es de junio. Maria pidió el de julio.") },
];

export const EMAILS = [
  { key: "maria", from: "Maria Delgado", initials: "MD", color: "#1a73e8", time: "8:14 AM", isTarget: true, unread: true,
    subject: { en: "Need the July safety report today", es: "Necesito el reporte de seguridad de julio hoy" },
    preview: { en: "Hi, can you send me the July safety report today?", es: "Hola, ¿me puedes enviar hoy el reporte de seguridad de julio?" } },
  { key: "luis", from: "Luis Ortiz", initials: "LO", color: "#e37400", time: "7:41 AM", isTarget: false, unread: true,
    subject: { en: "Extra aprons?", es: "¿Delantales de más?" },
    preview: { en: "Do we still have extras in the back?", es: "¿Todavía hay extras atrás?" },
    wrongHint: wrongHint("Luis is a coworker, not your manager. Look for the email from Maria Delgado.", "Luis es un compañero, no tu gerente. Busca el correo de Maria Delgado.") },
  { key: "sched", from: "Harborside Schedule", initials: "HS", color: "#5f6368", time: "6:15 AM", isTarget: false, unread: true,
    subject: { en: "Your schedule for Aug 17–23", es: "Tu horario del 17–23 de ago" },
    preview: { en: "This week's shifts have been posted.", es: "Ya se publicaron los turnos de esta semana." },
    wrongHint: wrongHint("That's an automatic message about the schedule. Maria's email has her name on the left.", "Ese es un mensaje automático del horario. El correo de Maria tiene su nombre a la izquierda.") },
  { key: "hr", from: "Harborside HR", initials: "HR", color: "#9334e6", time: "Yesterday", isTarget: false,
    subject: { en: "Your paystub is ready", es: "Tu recibo de pago está listo" },
    preview: { en: "View your paystub in the portal.", es: "Ve tu recibo en el portal." },
    wrongHint: wrongHint("That's from HR about pay. Today's task is the email from Maria Delgado.", "Eso es de RR.HH. sobre el pago. La tarea de hoy es el correo de Maria Delgado.") },
  { key: "it", from: "IT Helpdesk", initials: "IT", color: "#3c4043", time: "Yesterday", isTarget: false,
    subject: { en: "Reminder: update your password", es: "Recordatorio: cambia tu contraseña" },
    preview: { en: "Your password expires in 12 days.", es: "Tu contraseña vence en 12 días." },
    wrongHint: wrongHint("That's from IT. You can skip it for now. Find Maria Delgado.", "Eso es de sistemas. Puedes ignorarlo por ahora. Busca a Maria Delgado.") },
  { key: "team", from: "Cafe Team", initials: "CT", color: "#1e8e3e", time: "Mon", isTarget: false,
    subject: { en: "Break room fridge cleaning", es: "Limpieza del refrigerador" },
    preview: { en: "Please remove your food by Friday.", es: "Saca tu comida antes del viernes." },
    wrongHint: wrongHint("That's a team note about the fridge, not from your manager.", "Eso es una nota del equipo sobre el refrigerador, no de tu gerente.") },
  { key: "vendor", from: "Bean & Leaf Roasters", initials: "BL", color: "#7b4f2a", time: "Aug 18", isTarget: false,
    subject: { en: "Friday delivery window changed", es: "Cambió la entrega del viernes" },
    preview: { en: "Trucks will arrive after 10 AM.", es: "Los camiones llegarán después de las 10 AM." },
    wrongHint: wrongHint("That is a vendor, not your manager. Look for Maria Delgado.", "Eso es un proveedor, no tu gerente. Busca a Maria Delgado.") },
  { key: "promo", from: "Uniform Outlet", initials: "UO", color: "#c5221f", time: "Aug 12", isTarget: false,
    subject: { en: "15% off fall uniforms", es: "15% de descuento en uniformes" },
    preview: { en: "Sale ends Sunday. Use code FALL15.", es: "La oferta termina el domingo. Usa el código FALL15." },
    wrongHint: wrongHint("That's an ad. Work inboxes are full of these. Look for Maria Delgado.", "Eso es un anuncio. Las bandejas de trabajo están llenas de estos. Busca a Maria Delgado.") },
];

export const CONFIDENCE_OPTIONS: Record<Lang, ConfidenceOption[]> = {
  en: [
    { label: "Still unsure", reply: "That's honest. Do the task one more time, or come on Wednesday and we can do it together." },
    { label: "I could try", reply: "Good. Try it again without Help. That is how it will feel at work." },
    { label: "I can do this", reply: "You just did it with no help on the last two steps. Move on to the next task on your desktop." },
  ],
  es: [
    { label: "Todavía dudo", reply: "Eso es honesto. Hazlo otra vez, o ven el miércoles y lo hacemos juntos." },
    { label: "Podría intentarlo", reply: "Bien. Inténtalo otra vez sin Ayuda. Así se siente en el trabajo." },
    { label: "Puedo hacerlo", reply: "Lo hiciste sin ayuda en los últimos dos pasos. Sigue con la siguiente tarea en tu escritorio." },
  ],
};
