import type { Lang, Localized } from "@/lib/task-types";

export const MEETING_ID = "847 220 1963";

export const PARTICIPANTS = [
  { key: "maria", name: "Maria Delgado", initials: "MD", color: "#1a73e8" },
  { key: "jordan", name: "Jordan Kim", initials: "JK", color: "#0f9d58" },
  { key: "dana", name: "Dana Ortiz", initials: "DO", color: "#7248b9" },
] as const;

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
  leave: string;
  you: string;
  chatPlaceholder: string;
  send: string;
  latePrompt: string;
  lateHint: string;
  previewDone: string;
  previewBody: string;
}> = {
  en: {
    appName: "Zoom",
    meetingTitle: "Cafe leads — Friday huddle",
    joinKicker: "You are a few minutes late. Join muted.",
    nameLabel: "Your name",
    meetingIdLabel: "Meeting ID",
    join: "Join",
    mutedHint: "Mic starts off. Stay muted until you talk.",
    mute: "Mute",
    unmute: "Unmute",
    cameraOn: "Start video",
    cameraOff: "Stop video",
    chat: "Chat",
    leave: "Leave",
    you: "You",
    chatPlaceholder: "Ask in chat instead of interrupting…",
    send: "Send",
    latePrompt: "You arrived late. Everyone is already talking.",
    lateHint: "Stay muted. Ask your question in chat.",
    previewDone: "That's the meeting habit.",
    previewBody: "You joined muted, tried the camera, and asked in chat instead of talking over people. Act VI will grade this as a real job.",
  },
  es: {
    appName: "Zoom",
    meetingTitle: "Líderes del café — reunión del viernes",
    joinKicker: "Llegas unos minutos tarde. Entra con el micrófono apagado.",
    nameLabel: "Tu nombre",
    meetingIdLabel: "ID de la reunión",
    join: "Unirse",
    mutedHint: "El micrófono empieza apagado. Quédate en silencio hasta que hables.",
    mute: "Silenciar",
    unmute: "Activar micrófono",
    cameraOn: "Iniciar video",
    cameraOff: "Detener video",
    chat: "Chat",
    leave: "Salir",
    you: "Tú",
    chatPlaceholder: "Pregunta en el chat en vez de interrumpir…",
    send: "Enviar",
    latePrompt: "Llegaste tarde. Todos ya están hablando.",
    lateHint: "Quédate en silencio. Haz tu pregunta en el chat.",
    previewDone: "Ese es el hábito de la reunión.",
    previewBody: "Entraste en silencio, probaste la cámara y preguntaste en el chat en vez de hablar encima de otros. El Acto VI calificará esto como un trabajo real.",
  },
};

export const RIGHT_NOW_LABEL: Localized = { en: "Right now", es: "Ahora mismo" };
export const RIGHT_NOW_STEPS: Localized[] = [
  {
    en: "Join the meeting. Your mic starts muted.",
    es: "Únete a la reunión. El micrófono empieza apagado.",
  },
  {
    en: "Try mute and camera. Ask your question in chat.",
    es: "Prueba silencio y cámara. Haz tu pregunta en el chat.",
  },
];
