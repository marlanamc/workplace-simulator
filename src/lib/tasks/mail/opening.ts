import { CAST } from '@/lib/cast';
import type { Lang, Localized } from '@/lib/task-types';
import { bagVerdict, hasBlank, startTimeVerdict, type BagVerdict, type StartTimeVerdict } from '@/lib/tasks/mail/reply-grading';

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
    frame: copy('Hi Maria, thank you!', '¡Hola Maria, gracias!'),
  },
  {
    id: 'start-time', sender: CAST.maria, time: '6:09 PM',
    subject: copy('Tomorrow at 10 AM', 'Mañana a las 10 a. m.'),
    body: copy('Your shift tomorrow starts at 10 AM. Can you confirm you will be here?', 'Tu turno de mañana empieza a las 10 a. m. ¿Puedes confirmar que estarás aquí?'),
    more: lines(
      ['Please bring a photo ID and your bank information. We will do your new-hire paperwork before your shift.'],
      ['Por favor trae una identificación con foto y los datos de tu banco. Vamos a llenar tus papeles de nuevo empleado antes del turno.'],
    ),
    objective: copy('Confirm to Maria that you will be here tomorrow at 10 AM.', 'Confirma a Maria que estarás aquí mañana a las 10 a. m.'),
    starter: copy('Yes, I will be there.', 'Sí, allí estaré.'),
    frame: copy('Hi Maria, I ___ be there at 10 AM.', 'Hola Maria, ___ allí a las 10 a. m.'),
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
    frame: copy('Hi Darnell, I will put my bag ___.', 'Hola Darnell, voy a dejar mi bolsa ___.'),
  },
] satisfies Array<{ id: OpeningMessageId; sender: typeof CAST.maria; time: string; subject: Localized; body: Localized; more: Record<Lang, string[]>; objective: Localized; starter: Localized; frame: Localized }>;

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

/**
 * Why a reply was not accepted, or "ok". Bounded content checks, not a
 * grammar, spelling, or tone assessment; the rules live in reply-grading.ts.
 */
export type OpeningVerdict = 'ok' | 'empty' | 'blank' | Exclude<StartTimeVerdict, 'ok' | 'empty' | 'blank'> | Exclude<BagVerdict, 'ok' | 'empty' | 'blank'>;
export function openingReplyVerdict(id: OpeningMessageId, response: string): OpeningVerdict {
  if (id === 'start-time') return startTimeVerdict(response);
  if (id === 'cups') return bagVerdict(response);
  if (!response.trim()) return 'empty';
  return hasBlank(response) ? 'blank' : 'ok';
}
export function openingReplyAccepted(id: OpeningMessageId, response: string): boolean {
  return openingReplyVerdict(id, response) === 'ok';
}

/** The Job Card correction for each rejected reply: it names what is missing. */
export const OPENING_CORRECTIONS: Record<Exclude<OpeningVerdict, 'ok'>, Localized> = {
  empty: copy('Write a short reply in the box first.', 'Primero escribe una respuesta corta en la caja.'),
  blank: copy('Fill in the blank (___) with your own words.', 'Completa el espacio (___) con tus propias palabras.'),
  declines: copy(
    "Your reply says you can't come. In this practice, you can come. Tell Maria yes: you will be there at 10 AM.",
    'Tu respuesta dice que no puedes ir. En esta práctica, sí puedes ir. Dile a Maria que sí: vas a estar ahí a las 10 a. m.',
  ),
  late: copy(
    'Your reply says you will be late. Maria asked about 10 AM. Tell her you will be there at 10.',
    'Tu respuesta dice que vas a llegar tarde. Maria preguntó por las 10 a. m. Dile que vas a estar ahí a las 10.',
  ),
  'other-time': copy('Maria said 10 AM. Check the time in your reply.', 'Maria dijo 10 a. m. Revisa la hora en tu respuesta.'),
  unclear: copy(
    'Maria asked a yes-or-no question: will you be here at 10 AM? Answer it. You can start with Yes.',
    'Maria hizo una pregunta de sí o no: ¿vas a estar ahí a las 10 a. m.? Contéstala. Puedes empezar con Sí.',
  ),
  'wrong-place': copy(
    'Darnell asked where you will put your bag. Read his email again and name the place.',
    'Darnell preguntó dónde vas a dejar tu bolsa. Lee su correo otra vez y di el lugar.',
  ),
  negated: copy(
    'Your reply says you will not put it there. Tell Darnell where you will put your bag.',
    'Tu respuesta dice que no la vas a dejar ahí. Dile a Darnell dónde vas a dejar tu bolsa.',
  ),
};

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
