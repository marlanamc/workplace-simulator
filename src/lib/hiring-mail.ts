import type { TaskKey } from './desktop-content';
import type { InboxRow } from './story-beats';
import type { Localized } from './task-types';
import { CAST, inboxSender } from './cast';
import { sentOnForTask } from './story-calendar';

export type HiringTask = 'interview-practice' | 'job-offer' | 'w4-form';
export type HiringMail = InboxRow & {
  task: HiringTask;
  action: { tab: string; label: Localized };
};

const messages: HiringMail[] = [
  {
    key: 'hiring-interview', task: 'interview-practice', unlockAfter: 'resume-build',
    ...inboxSender(CAST.anita), time: '8:30 AM', story: true, unread: true,
    subject: { en: 'Your interview: preparation notes', es: 'Tu entrevista: notas de preparación' },
    preview: { en: 'We would like to talk about the Office Administrator role.', es: 'Queremos hablar sobre el puesto de Office Administrator (administración de oficina).' },
    body: {
      en: ['Thank you for your application and résumé. We would like to interview you for the Office Administrator role.', 'Before we talk, prepare a few examples from your work and one question about the role. The attached practice document has four common questions. These notes are for you to use during the conversation.'],
      es: ['Gracias por tu solicitud y currículum. Queremos entrevistarte para el puesto de Office Administrator (administración de oficina).', 'Antes de hablar, prepara algunos ejemplos de tu trabajo y una pregunta sobre el puesto. El documento de práctica adjunto tiene cuatro preguntas comunes. Estas notas son para ti, para usarlas durante la conversación.'],
    },
    action: { tab: 'interview', label: { en: 'Open interview preparation', es: 'Abrir la preparación para la entrevista' } },
  },
  {
    key: 'hiring-offer', task: 'job-offer', unlockAfter: 'interview-practice',
    ...inboxSender(CAST.anita), time: '8:30 AM', story: true, unread: true,
    subject: { en: 'Your offer from Harborside HQ', es: 'Tu oferta de Harborside HQ' },
    preview: { en: 'The offer letter includes your role, pay and start date.', es: 'La carta incluye tu puesto, sueldo y fecha de inicio.' },
    body: {
      en: ['Thank you for meeting with me. We would like to offer you the Office Administrator role.', 'Your offer letter is below. It includes the role, pay and start date. Please review it before sending your acceptance.'],
      es: ['Gracias por reunirte conmigo. Queremos ofrecerte el puesto de Office Administrator.', 'Tu carta de oferta está abajo. Incluye el puesto, sueldo y fecha de inicio. Revísala antes de enviar tu aceptación.'],
    },
    action: { tab: 'offer', label: { en: 'View offer and reply', es: 'Ver la oferta y responder' } },
  },
  {
    key: 'hiring-paperwork', task: 'w4-form', unlockAfter: 'job-offer',
    ...inboxSender(CAST.anita), time: '8:30 AM', story: true, unread: true,
    subject: { en: 'Before your first day: paperwork practice', es: 'Antes de tu primer día: práctica de formularios' },
    preview: { en: 'Use Robin Avery’s fictional details in the practice forms.', es: 'Usa los datos ficticios de Robin Avery en los formularios de práctica.' },
    body: {
      en: ['Thank you for accepting the offer. Before your first day, HR sent an example set of new-hire forms.', 'The example is for Robin Avery, a practice worker. Practice on Robin\'s copy first. Use Robin\'s facts, not your own. The link opens three forms: the W-4, the I-9 Section 1, and direct deposit. At a real job, you fill out your own forms with your own facts.'],
      es: ['Gracias por aceptar la oferta. Antes de tu primer día, Recursos Humanos te envió un ejemplo de los formularios para personal nuevo.', 'El ejemplo es de Robin Avery, una persona de práctica. Practica primero con la copia de Robin. Usa los datos de Robin, no los tuyos. El enlace abre tres formularios: el W-4, la Sección 1 del I-9 y el depósito directo. En un trabajo real, llenas tus propios formularios con tus propios datos.'],
    },
    action: { tab: 'onboarding', label: { en: 'Open practice forms', es: 'Abrir los formularios de práctica' } },
  },
];

/** Incoming hiring mail follows the learner's actual next job, never another route.
 * Earned messages remain available as history; reading mail does not award credit. */
export function hiringMailsFor(next: TaskKey | null, completed: readonly TaskKey[]): HiringMail[] {
  return messages.filter(mail => mail.task === next || completed.includes(mail.task))
    .map(mail => ({ ...mail, sentOn: sentOnForTask(mail.task) }));
}

export function hiringMailForTask(task: TaskKey | null): HiringMail | undefined {
  return messages.find(mail => mail.task === task);
}

export function hiringMailForKey(key: string): HiringMail | undefined {
  return messages.find(mail => mail.key === key);
}
