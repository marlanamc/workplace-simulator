import { CAST } from '@/lib/cast';
import type { Lang, Localized } from '@/lib/task-types';

export const OPENING_IDS = ['welcome', 'start-time', 'cups'] as const;
export type OpeningMessageId = typeof OPENING_IDS[number];
export type OpeningReply = { messageId: OpeningMessageId; response: string; lang: Lang };
const copy = (en: string, es: string): Localized => ({ en, es });

export const OPENING_MESSAGES = [
  {
    id: 'welcome', sender: CAST.maria, time: '8:14 AM',
    subject: copy('Welcome to Harborside', 'Bienvenido a Harborside'),
    body: copy('Welcome to the team! Please reply to let me know you received this message.', '¡Bienvenido al equipo! Responde para avisarme que recibiste este mensaje.'),
    objective: copy('Reply to Maria with a short hello.', 'Responde a Maria con un saludo corto.'),
    starter: copy('Hi Maria, thank you!', '¡Hola Maria, gracias!'),
  },
  {
    id: 'start-time', sender: CAST.maria, time: '8:18 AM',
    subject: copy('Tomorrow at 10 AM', 'Mañana a las 10 a. m.'),
    body: copy('Your shift tomorrow, Wednesday, starts at 10 AM. Can you confirm you will be here?', 'Tu turno de mañana, miércoles, empieza a las 10 a. m. ¿Puedes confirmar que estarás aquí?'),
    objective: copy('Confirm to Maria that you will be here tomorrow at 10 AM.', 'Confirma a Maria que estarás aquí mañana a las 10 a. m.'),
    starter: copy('Yes, I will be there.', 'Sí, allí estaré.'),
  },
  {
    id: 'cups', sender: CAST.darnell, time: '8:22 AM',
    subject: copy('Clean cups', 'Tazas limpias'),
    body: copy('Hi! Where do we keep the clean cups?', '¡Hola! ¿Dónde guardamos las tazas limpias?'),
    objective: copy('Tell Darnell the clean cups are on the shelf under the counter.', 'Dile a Darnell que las tazas limpias están en el estante debajo del mostrador.'),
    starter: copy('They are on the shelf under the counter.', 'Están en el estante debajo del mostrador.'),
  },
] satisfies Array<{ id: OpeningMessageId; sender: typeof CAST.maria; time: string; subject: Localized; body: Localized; objective: Localized; starter: Localized }>;

export function nextOpeningIndex(replies: Pick<OpeningReply, 'messageId'>[]): number {
  const next = OPENING_IDS.findIndex(id => !replies.some(r => r.messageId === id));
  return next === -1 ? OPENING_IDS.length : next;
}

const normalized = (text: string) => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[’‘]/g, "'").trim();
/** Bounded content checks, not a grammar, spelling, or tone assessment. */
export function openingReplyAccepted(id: OpeningMessageId, response: string): boolean {
  const text = normalized(response);
  if (!text) return false;
  if (id === 'welcome') return true;
  if (id === 'start-time') {
    if (/\b(no|not|can't|cannot|won't|unable|never|nunca)\b/.test(text)) return false;
    return /\b(yes|yeah|yep|sure|ok|okay|confirmed|confirm|absolutely|certainly|si|claro|vale|confirmo|confirmado|perfecto|entendido)\b/.test(text)
      || /\b(i'll|i will|see you|be there|count me in|estare|alli estare|nos vemos|ahi estare|cuenta conmigo)\b/.test(text);
  }
  if (/\b(not|no|never|nunca)\b/.test(text)) return false;
  return /\b(under|below|beneath|underneath)\b.{0,35}\b(counter|worktop)\b/.test(text)
    || /\b(debajo|bajo)\b.{0,35}\b(mostrador|meson|barra|encimera)\b/.test(text);
}

export function openingInstruction(index: number, view: string, hasText: boolean, explicit: boolean): Localized {
  const message = OPENING_MESSAGES[index];
  if (index === 2 && !explicit) return message.objective;
  if (view === 'empty' || view === 'story') return copy(`Open ${message.sender.name}'s email: ${message.subject.en}.`, `Abre el correo de ${message.sender.name}: ${message.subject.es}.`);
  if (view === 'read') return copy(index === 0 || explicit ? 'Click Reply.' : 'Reply to Maria.', index === 0 || explicit ? 'Haz clic en Responder.' : 'Responde a Maria.');
  return hasText ? copy('Click Send.', 'Haz clic en Enviar.') : message.objective;
}
