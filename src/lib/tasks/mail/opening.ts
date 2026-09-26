import { CAST } from '@/lib/cast';
import type { Lang, Localized } from '@/lib/task-types';

export const OPENING_IDS = ['welcome', 'start-time', 'cups'] as const;
export type OpeningMessageId = typeof OPENING_IDS[number];
export type OpeningReply = { messageId: OpeningMessageId; response: string; lang: Lang };
const copy = (en: string, es: string): Localized => ({ en, es });
const lines = (en: string[], es: string[]): Record<Lang, string[]> => ({ en, es });

export const FIRST_REPLY_GUIDANCE = copy(
  'Say hello, write your short reply, and finish with your name. Then click Send.',
  'Saluda, escribe una respuesta corta y termina con tu nombre. Luego haz clic en Enviar.',
);
export const FIRST_REPLY_EXAMPLE = copy(
  'Example (Ana is an example name):\n\nHi Maria,\nThank you for the welcome. See you tomorrow!\nAna',
  'Ejemplo (Ana es un nombre de ejemplo):\n\nHola Maria,\nGracias por la bienvenida. ¡Nos vemos mañana!\nAna',
);

export const OPENING_MESSAGES = [
  {
    id: 'welcome', sender: CAST.maria, time: '6:02 PM',
    subject: copy('Welcome to Harborside Cafe', 'Bienvenido a Harborside Cafe'),
    body: copy('Welcome to the team! Your first day is tomorrow. Please reply to let me know you received this message.', '¡Bienvenido al equipo! Tu primer día es mañana. Responde para avisarme que recibiste este mensaje.'),
    more: lines(
      ['The cafe is at 142 Main Street. Come in the side door and ask for me at the counter.', 'Please wear a black shirt, dark pants, and closed-toe shoes. We will give you an apron.'],
      ['El café está en 142 Main Street. Entra por la puerta del costado y pregunta por mí en el mostrador.', 'Por favor ponte una camisa negra, pantalón oscuro y zapatos cerrados. Nosotros te damos el delantal.'],
    ),
    objective: copy('Reply to Maria with a short hello.', 'Responde a Maria con un saludo corto.'),
    starter: copy('Hi Maria, thank you!', '¡Hola Maria, gracias!'),
  },
  {
    id: 'start-time', sender: CAST.maria, time: '6:09 PM',
    subject: copy('Tomorrow at 10 AM', 'Mañana a las 10 a. m.'),
    body: copy('Your shift tomorrow, Wednesday, starts at 10 AM. Can you confirm you will be here?', 'Tu turno de mañana, miércoles, empieza a las 10 a. m. ¿Puedes confirmar que estarás aquí?'),
    more: lines(
      ['Please bring a photo ID and your bank information. We will do your new-hire paperwork before your shift.'],
      ['Por favor trae una identificación con foto y los datos de tu banco. Vamos a llenar tus papeles de nuevo empleado antes del turno.'],
    ),
    objective: copy('Confirm to Maria that you will be here tomorrow at 10 AM.', 'Confirma a Maria que estarás aquí mañana a las 10 a. m.'),
    starter: copy('Yes, I will be there.', 'Sí, allí estaré.'),
  },
  {
    id: 'cups', sender: CAST.darnell, time: '6:15 PM',
    subject: copy('Where to put your bag', 'Dónde dejar tu bolsa'),
    body: copy('I work mornings too. Tomorrow you can leave your bag on the shelf under the counter. Reply and tell me where you will put it, so I know you saw this.', 'Yo también trabajo por la mañana. Mañana puedes dejar tu bolsa en el estante debajo del mostrador. Responde y dime dónde la vas a dejar, para saber que lo viste.'),
    more: lines(
      ['One more thing: the code for the staff bathroom is on the board by the back door.'],
      ['Otra cosa: el código del baño del personal está en la pizarra junto a la puerta de atrás.'],
    ),
    objective: copy('Tell Darnell you will put your bag on the shelf under the counter.', 'Dile a Darnell que dejarás tu bolsa en el estante debajo del mostrador.'),
    starter: copy('I will put it on the shelf under the counter.', 'La dejaré en el estante debajo del mostrador.'),
  },
] satisfies Array<{ id: OpeningMessageId; sender: typeof CAST.maria; time: string; subject: Localized; body: Localized; more: Record<Lang, string[]>; objective: Localized; starter: Localized }>;

/**
 * `body` is the one line the reply answers (it is also the inbox preview);
 * `more` is what a real first-day email carries around it.
 */
export function openingLines(message: (typeof OPENING_MESSAGES)[number], lang: Lang): string[] {
  return [message.body[lang], ...message.more[lang]];
}

export function nextOpeningIndex(replies: Pick<OpeningReply, 'messageId'>[]): number {
  const next = OPENING_IDS.findIndex(id => !replies.some(r => r.messageId === id));
  return next === -1 ? OPENING_IDS.length : next;
}

const normalized = (text: string) => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[’‘]/g, "'").trim();
/** Bounded content checks, not a grammar, spelling, or tone assessment. */
export function openingReplyAccepted(id: OpeningMessageId, response: string): boolean {
  // "No problem" and "not late" are yeses. Take them out before looking for a no.
  const text = normalized(response)
    .replace(/\b(no problem|no worries|not a problem|(will not|won't|not) be late|not late|no hay problema|sin problema|no voy a llegar tarde|no llegare tarde)\b/g, ' ok ')
    .trim();
  if (!text) return false;
  if (id === 'welcome') return true;
  if (id === 'start-time') {
    if (/\b(no|not|can't|cannot|won't|unable|never|nunca)\b/.test(text)) return false;
    return /\b(yes|yeah|yep|sure|ok|okay|confirmed|confirm|absolutely|certainly|si|claro|vale|confirmo|confirmado|perfecto|entendido)\b/.test(text)
      || /\b(i'll|i will|see you|be there|count me in|estare|alli estare|nos vemos|ahi estare|cuenta conmigo)\b/.test(text);
  }
  if (/\b(not|no|never|won't|can't|cannot|nunca)\b/.test(text)) return false;
  // Darnell named the shelf, so "on the shelf" answers him too.
  return /\b(under|undr|below|beneath|underneath)\b.{0,35}\b(counter|conter|worktop)\b/.test(text)
    || /\b(debajo|bajo)\b.{0,35}\b(mostrador|meson|barra|encimera)\b/.test(text)
    || /\b(shelf|shelves|estante|repisa)\b/.test(text);
}

export function openingInstruction(index: number, view: string, hasText: boolean, explicit: boolean): Localized {
  const message = OPENING_MESSAGES[index];
  // The third reply names only the goal, so the scaffolding comes down. It
  // still says which email to open: a list of emails is no place to guess.
  if (index === 2 && !explicit && view !== 'empty' && view !== 'story') return message.objective;
  if (view === 'empty' || view === 'story') return copy(`Open ${message.sender.name}'s email: ${message.subject.en}.`, `Abre el correo de ${message.sender.name}: ${message.subject.es}.`);
  if (view === 'read') return copy(index === 0 || explicit ? 'Click Reply.' : 'Reply to Maria.', index === 0 || explicit ? 'Haz clic en Responder.' : 'Responde a Maria.');
  if (index === 0 && view === 'compose') return FIRST_REPLY_GUIDANCE;
  return hasText ? copy('Click Send.', 'Haz clic en Enviar.') : message.objective;
}
