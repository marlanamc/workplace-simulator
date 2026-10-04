import { isQuestion } from "@/lib/grading/meaning";
import type { Lang, Lesson, Localized } from "@/lib/task-types";

export const MEETING_ID = "847 220 1963";

export const PARTICIPANTS = [
  { key: "anita", name: "Anita Raman", initials: "AR", color: "#8430ce" },
  { key: "jordan", name: "Jordan Kim", initials: "JK", color: "#0f9d58" },
  { key: "chris", name: "Chris Okafor", initials: "CO", color: "#e8710a" },
] as const;

export interface VideoCallState {
  joinedMuted: boolean;
  toggledCamera: boolean;
  sentChat: boolean;
  unmuted: boolean;
}

export function videoCallPasses(state: VideoCallState): boolean {
  return state.joinedMuted && state.toggledCamera && state.sentChat && !state.unmuted;
}

/**
 * The chat step asks for a question. "hi" is a hello, not a question; "when
 * is the report due?", "can I get the slides" and "I have a question about
 * Friday" all ask something. Only a message that asks counts as `sentChat`.
 */
export function chatAsksQuestion(line: string): boolean {
  return isQuestion(line);
}

export const CHAT_NEEDS_QUESTION: Localized = {
  en: "Now type your question in the chat. A question asks something, like: When is…? Can I…?",
  es: "Ahora escribe tu pregunta en el chat. Una pregunta pide algo, por ejemplo: ¿Cuándo es…? ¿Puedo…?",
};

export const VIDEO_CALL_COPY: Record<Lang, {
  appName: string;
  meetingTitle: string;
  joinKicker: string;
  nameLabel: string;
  meetingIdLabel: string;
  join: string;
  mutedHint: string;
  mute: string;
  unmute: string;
  cameraOn: string;
  cameraOff: string;
  chat: string;
  participants: string;
  leave: string;
  you: string;
  chatPlaceholder: string;
  send: string;
  latePrompt: string;
  unmuteHint: string;
  sentKicker: string;
  tryAgain: string;
  backToDesk: string;
  lessonKicker: string;
  tipLabel: string;
  gotIt: string;
}> = {
  en: {
    appName: "Zoom",
    meetingTitle: "HQ check-in: Wednesday",
    joinKicker: "You are a few minutes late. Join with your mic off.",
    nameLabel: "Your name",
    meetingIdLabel: "Meeting ID",
    join: "Join",
    mutedHint: "Your mic starts off. Leave it off until it is your turn to talk.",
    mute: "Mute",
    unmute: "Unmute",
    cameraOn: "Start video",
    cameraOff: "Stop video",
    chat: "Chat",
    participants: "Participants",
    leave: "Leave",
    you: "You",
    chatPlaceholder: "Type your question in the chat…",
    send: "Send",
    latePrompt: "You came in late. Everyone is already talking.",
    unmuteHint: "Mute your mic again, then continue in chat. Your work is still here.",
    sentKicker: "You joined well",
    tryAgain: "Do it again",
    backToDesk: "Back to desktop",
    lessonKicker: "2-minute lesson",
    tipLabel: "Tip",
    gotIt: "Got it. Back to my task",
  },
  es: {
    appName: "Zoom",
    meetingTitle: "Check-in de HQ: miércoles",
    joinKicker: "Llegas unos minutos tarde. Entra con el micrófono apagado.",
    nameLabel: "Tu nombre",
    meetingIdLabel: "ID de la reunión",
    join: "Unirse",
    mutedHint: "Tu micrófono empieza apagado. Déjalo apagado hasta que sea tu turno de hablar.",
    mute: "Silenciar",
    unmute: "Activar micrófono",
    cameraOn: "Iniciar video",
    cameraOff: "Detener video",
    chat: "Chat",
    participants: "Participantes",
    leave: "Salir",
    you: "Tú",
    chatPlaceholder: "Escribe tu pregunta en el chat…",
    send: "Enviar",
    latePrompt: "Llegaste tarde. Todos ya están hablando.",
    unmuteHint: "Apaga el micrófono otra vez y continúa en el chat. Tu trabajo sigue aquí.",
    sentKicker: "Entraste bien",
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
      t: "Join with your mic off",
      s: [
        "Join with your mic off. If you turn it on accidentally, mute again and continue.",
        "Use Start video to turn on your camera. When you have a question, type it in the chat instead of saying it out loud.",
      ],
      tip: "If you turn your mic on, mute it again and continue. When you come in late, you type your question in the chat instead of speaking up.",
    },
  ],
  es: [
    {
      t: "Entra con el micrófono apagado",
      s: [
        "Entra con el micrófono apagado. Si lo prendes por accidente, apágalo y continúa.",
        "Usa Iniciar video para encender la cámara. Cuando tengas una pregunta, escríbela en el chat en lugar de decirla en voz alta.",
      ],
      tip: "Si prendes el micrófono, apágalo otra vez y continúa. Cuando llegas tarde, escribes tu pregunta en el chat en lugar de hablar.",
    },
  ],
};

export const RIGHT_NOW_LABEL: Localized = { en: "Right now", es: "Ahora mismo" };
export const RIGHT_NOW_STEPS: Localized[] = [
  { en: "Join the meeting with your microphone muted.", es: "Entra a la reunión con el micrófono apagado." },
  { en: "Turn on your camera. Send a chat message asking who will share the meeting notes. Keep your microphone muted.", es: "Enciende la cámara. Envía un mensaje en el chat para preguntar quién compartirá las notas de la reunión. Mantén el micrófono apagado." },
];
