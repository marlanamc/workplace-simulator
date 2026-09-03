import type { Lang, Lesson, Localized } from "@/lib/task-types";

export const MEETING_ID = "847 220 1963";

export const PARTICIPANTS = [
  { key: "maria", name: "Maria Delgado", initials: "MD", color: "#1a73e8" },
  { key: "jordan", name: "Jordan Kim", initials: "JK", color: "#0f9d58" },
  { key: "dana", name: "Dana Ortiz", initials: "DO", color: "#7248b9" },
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
  lateHint: string;
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
    meetingTitle: "HQ check-in — Wednesday",
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
    lateHint: "Keep your mic off. Turn the camera on and off. Type your question in the chat.",
    unmuteHint: "Keep your mic off. Type your question in the chat instead of talking while others talk.",
    sentKicker: "You joined well",
    tryAgain: "Do it again",
    backToDesk: "Back to desktop",
    lessonKicker: "2-minute lesson",
    tipLabel: "Tip",
    gotIt: "Got it. Back to my task",
  },
  es: {
    appName: "Zoom",
    meetingTitle: "Check-in de HQ — miércoles",
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
    lateHint: "Deja el micrófono apagado. Prende y apaga la cámara. Escribe tu pregunta en el chat.",
    unmuteHint: "Deja el micrófono apagado. Escribe tu pregunta en el chat en lugar de hablar mientras otros hablan.",
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
        "Join with your mic off. If you talk while someone else is talking, the task starts over.",
        "Turn the camera on and off so you know where the buttons are. When you have a question, type it in the chat instead of saying it out loud.",
      ],
      tip: "If you turn your mic on, you start over. When you come in late, you type your question in the chat instead of speaking up.",
    },
  ],
  es: [
    {
      t: "Entra con el micrófono apagado",
      s: [
        "Entra con el micrófono apagado. Si hablas mientras otra persona habla, la tarea empieza de nuevo.",
        "Prende y apaga la cámara para saber dónde están los botones. Cuando tengas una pregunta, escríbela en el chat en lugar de decirla en voz alta.",
      ],
      tip: "Si prendes el micrófono, empiezas de nuevo. Cuando llegas tarde, escribes tu pregunta en el chat en lugar de hablar.",
    },
  ],
};

export const RIGHT_NOW_LABEL: Localized = { en: "Right now", es: "Ahora mismo" };
export const RIGHT_NOW_STEPS: Localized[] = [
  {
    en: "Join the meeting. Your mic starts muted.",
    es: "Únete a la reunión. El micrófono empieza apagado.",
  },
  {
    en: "Try the camera. Ask your question in chat.",
    es: "Prueba la cámara. Haz tu pregunta en el chat.",
  },
];
