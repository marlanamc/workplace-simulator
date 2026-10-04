import type { TaskKey } from "@/lib/desktop-content";
import type { Localized } from "@/lib/task-types";

/** Optional explanations in the Job Card, separate from the next action. */
export const LESSON_WHY: Partial<Record<TaskKey, Localized>> = {
  schedule: { en: "A posted schedule can overlap your own plans. Compare the whole time range before asking for a change.", es: "Un horario publicado puede coincidir con tus planes. Compara todo el intervalo antes de pedir un cambio." },
  "account-recovery": {
    en: "Google can check your password and your phone. Your password is something you know; your phone is something you have. This is two-factor authentication, or 2-Step Verification. It helps protect your account if someone steals your password. Keep your code private.",
    es: "Google puede comprobar tu contraseña y tu teléfono. Tu contraseña es algo que sabes; tu teléfono es algo que tienes. Esto se llama autenticación de dos factores, o verificación en dos pasos. Ayuda a proteger tu cuenta si alguien roba tu contraseña. No compartas tu código.",
  },
  "mail-reply": {
    en: "Reply keeps your answer with the original email so the other person can follow the conversation.",
    es: "Responder mantiene tu respuesta junto al correo original para que la otra persona pueda seguir la conversación.",
  },
  "mail-attach": {
    en: "An attachment is a file sent with your email. Writing the file’s name in your message does not send the file—you need to attach it.",
    es: "Un adjunto es un archivo que se envía con tu correo. Escribir su nombre en el mensaje no envía el archivo: necesitas adjuntarlo.",
  },
  files: {
    en: "Sharing gives someone access to your file. View lets them read it. Edit lets them change it. Give them only the access they need for their work.",
    es: "Compartir le da a alguien acceso a tu archivo. Ver le permite leerlo. Editar le permite cambiarlo. Dale solo el acceso que necesita para su trabajo.",
  },
  calendar: {
    en: "An invitation asks whether you can attend. Suggesting another time tells the organizer what works for you. The new time still needs to be agreed on.",
    es: "Una invitación pregunta si puedes asistir. Proponer otra hora le dice a quien organiza cuándo puedes. Todavía tienen que ponerse de acuerdo.",
  },
  "formula-check": {
    en: "A formula tells the spreadsheet which numbers to add. It can add those numbers correctly and still miss a person if their row is left out.",
    es: "Una fórmula le indica a la hoja qué números sumar. Puede sumarlos bien y aun así dejar a una persona fuera si su fila no está incluida.",
  },
  coursework: {
    en: "Typing your work is one step. Submitting sends it to your teacher. Look for a message confirming that your work was submitted.",
    es: "Escribir tu tarea es un paso. Al entregarla, se envía a tu maestra. Busca un mensaje que confirme la entrega.",
  },
  "job-application": {
    en: "The employer uses your email address and phone number to contact you. One wrong letter or number could mean you miss their message.",
    es: "La empresa usa tu correo y teléfono para contactarte. Una letra o un número incorrecto podría impedir que te llegue su mensaje.",
  },
};
