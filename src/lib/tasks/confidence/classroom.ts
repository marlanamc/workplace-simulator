import { l, type ConfidenceKey, type LessonScenario } from '@/lib/lessons/confidence';
import { CONFIDENCE_SCENARIOS, type ConfidenceScenario } from './content';
import { OPENING_MESSAGES } from '@/lib/tasks/mail/opening';
import { TIP_ROWS, REAL_TOTAL } from '@/lib/tasks/spreadsheet/content';
import { FILES, RENAME_TARGET } from '@/lib/tasks/files/content';

const source = (en: string, es: string, textEn: string, textEs: string) => ({ title: l(en, es), text: l(textEn, textEs) });
const file = (key: string, name: string, en: string, es: string) => ({ key, name, detail: l(en, es) });
const base = (key: ConfidenceKey) => CONFIDENCE_SCENARIOS[key].try;
/** Lesson-only adapters. Story retains its existing narrative and grading. */
export const CLASSROOM_SCENARIOS: Partial<Record<ConfidenceKey, ConfidenceScenario>> = {
  'mail-attach': {
    ...base('mail-attach'), title: l('Food handler certificate', 'Certificado de manipulador de alimentos'),
    request: l('Please reply with your current food handler certificate attached.', 'Responde con tu certificado vigente de manipulador de alimentos adjunto.'),
    recipient: 'maria.delgado@harborsidecafe.com',
    files: [file('current', 'food-handler-certificate.pdf', 'Food handler certificate. Issued August 12, 2026. Expires August 12, 2029.', 'Certificado de manipulador de alimentos. Emitido el 12 de agosto de 2026. Vence el 12 de agosto de 2029.'), file('expired', 'food-handler-certificate-2022.pdf', 'Food handler certificate. Expires June 3, 2025.', 'Certificado de manipulador de alimentos. Vence el 3 de junio de 2025.'), file('practice', 'food-handler-practice-test.pdf', 'Practice test: sample questions.', 'Examen de práctica: preguntas de ejemplo.')],
    expected: { file: 'current' },
    correction: l('Compare the attachment with the requested certificate and its expiration date. Send a corrected reply if needed.', 'Compara el adjunto con el certificado solicitado y su fecha de vencimiento. Envía otra respuesta si hace falta.'),
  },
  files: {
    ...base('files'), title: l('Weekly schedule', 'Horario semanal'),
    request: l(`Find this week's schedule, ${FILES.find(f => f.isTarget)!.name}. Rename it ${RENAME_TARGET}.pdf and share it only with jordan.kim@harborsidecafe.com as Viewer.`, `Busca el horario de esta semana, ${FILES.find(f => f.isTarget)!.name}. Ponle ${RENAME_TARGET}.pdf y compártelo solo con jordan.kim@harborsidecafe.com como Lector.`),
    recipient: 'jordan.kim@harborsidecafe.com',
    files: FILES.map(f => file(f.key, f.name, `${f.folder} · ${f.date} · ${f.name}`, `${f.folder === 'Schedules' ? 'Horarios' : f.folder === 'Forms' ? 'Formularios' : 'Documentos'} · ${f.date} · ${f.name}`)),
    expected: { file: FILES.find(f => f.isTarget)!.key, name: `${RENAME_TARGET}.pdf`, permission: 'view' },
    correction: l('Compare the file, name, recipient and access with the request. Update sharing or rename the file if needed.', 'Compara el archivo, el nombre, el destinatario y el acceso con la solicitud. Ajusta el acceso o el nombre si hace falta.'),
  },
  spreadsheet: {
    ...base('spreadsheet'), title: l('Weekly tips', 'Propinas semanales'),
    request: l('Enter the tip slips and email Renata the total.', 'Ingresa los recibos de propinas y envía el total por correo a Renata.'),
    sources: TIP_ROWS.map(r => source(r.day, r.dayName.es, `$${r.given.toFixed(2)}`, `$${r.given.toFixed(2)}`)),
    rows: TIP_ROWS.map(r => ({ label: l(r.day, r.dayName.es), value: r.given })), recipient: 'renata.silva@harborsidecafe.com',
    expected: { ...Object.fromEntries(TIP_ROWS.map((r,i) => [`B${i+2}`, String(r.given)])), total: String(REAL_TOTAL) },
    correction: l('Compare every row with its slip and the total in your email with the sheet. Correct the sheet and send a follow-up if needed.', 'Compara cada fila con su recibo y el total del correo con la hoja. Corrige la hoja y envía otro correo si hace falta.'),
  },
  coursework: {
    ...base('coursework'), title: l('Work email assignment', 'Tarea de correo del trabajo'),
    request: l('Read the assignment deadline and turn in your completed work-email document.', 'Lee la fecha de entrega y entrega el documento completo de correo del trabajo.'),
    sources: [source('Assignment', 'Tarea', 'Due Friday, October 9, 2026 at 11:59 PM. Submit Work-email-complete.pdf. The draft is unfinished.', 'Entrega: viernes 9 de octubre de 2026 a las 11:59 p. m. Entrega Work-email-complete.pdf. El borrador está incompleto.')],
    expected: { deadline: '2026-10-09', file: 'complete' },
    files: [file('draft','Work-email-draft.pdf','Draft: no reply to the manager.','Borrador: falta la respuesta a la gerente.'),file('complete','Work-email-complete.pdf','Complete: includes the reply to the manager.','Completo: incluye la respuesta a la gerente.')],
  },
  calendar: {
    ...base('calendar'), title: l('Weekly Lead Huddle', 'Reunión semanal de líderes'),
    request: l('Renata invited you Wednesday at 9 AM, your day off. Propose 30 minutes during your Thursday shift.', 'Renata te invitó el miércoles a las 9 a. m., tu día libre. Propón 30 minutos durante tu turno del jueves.'),
    sources: [source('Work schedule', 'Horario de trabajo','Wednesday, September 2, 2026: off. Thursday, September 3, 2026: working 9 AM–5 PM. Free at 10 AM and 2 PM.','Miércoles 2 de septiembre de 2026: libre. Jueves 3 de septiembre de 2026: trabajas de 9 a. m. a 5 p. m. Disponible a las 10 a. m. y 2 p. m.')],
    recipient:'renata.silva@harborsidecafe.com', expected:{ date:'2026-09-03', time:'10:00' },
    correction:l('Compare your proposal with the Thursday shift. Send a new proposal for 10 AM or 2 PM, for 30 minutes. The organizer still needs to accept it.','Compara la propuesta con el turno del jueves. Envía otra propuesta a las 10 a. m. o 2 p. m., por 30 minutos. Falta que la persona organizadora la acepte.'),
  },
  schedule: {
    ...base('schedule'), title:l('Work schedule', 'Horario de trabajo'),
    request:l('Your Thursday morning shift overlaps your appointment. Request the later Thursday shift.','Tu turno del jueves por la mañana coincide con tu cita. Solicita el turno del jueves por la tarde.'),
    sources:[source('Posted shifts','Turnos publicados','Thursday, August 27, 2026: 7 AM–3 PM. Alternative: 3–11 PM.','Jueves 27 de agosto de 2026: 7 a. m.–3 p. m. Alternativa: 3–11 p. m.'),source('Personal calendar','Calendario personal','Thursday, August 27, 2026: appointment at 11 AM.','Jueves 27 de agosto de 2026: cita a las 11 a. m.')],
    expected:{date:'2026-08-27',time:'15:00'},
  },
};
export function practiceScenario(key: ConfidenceKey, scenario: LessonScenario, message = 0): ConfidenceScenario {
  if (scenario !== 'classroom') return CONFIDENCE_SCENARIOS[key][scenario];
  if (key === 'mail-reply') {
    const m = OPENING_MESSAGES[message];
    return { ...base(key), title:m.subject, request:m.body, recipient:m.sender.email, sources:[], expected:{}, replyPattern:undefined, guidance:m.objective, help:m.frame,
      correction:l('Read the sender’s question and send a corrected reply.', 'Lee la pregunta del remitente y envía una respuesta corregida.') };
  }
  const result = CLASSROOM_SCENARIOS[key] ?? base(key);
  return { ...result, guidance: result.request, help: result.correction }; 
}
