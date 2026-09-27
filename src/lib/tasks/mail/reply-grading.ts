/**
 * Pure checks for the Day One replies (the mail-reply lesson). Each returns a
 * reason rather than a boolean, so the Job Card's correction can name the part
 * that is missing instead of repeating the goal.
 *
 * The rule of thumb: honest beginner English (and Spanish) passes, and a "no"
 * only counts when it sits next to the thing it negates. "No problem, I can
 * come" is a yes; "I can't come" is not; "Yes, but I'll be 10 minutes late"
 * is not a yes to 10 AM either.
 */

export type StartTimeVerdict = "ok" | "empty" | "blank" | "declines" | "late" | "other-time" | "unclear";
export type BagVerdict = "ok" | "empty" | "blank" | "wrong-place" | "negated";

export function normalizeReply(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[’‘`]/g, "'")
    .replace(/[¡¿]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** A starter frame left unfilled: "I will put my bag ___." */
export function hasBlank(text: string): boolean {
  return /_{2,}/.test(text);
}

/**
 * Phrases with "no"/"not" in them that are yeses or reassurance. Swapped for
 * "ok" before any negation is looked for, so they can never sink a reply.
 */
const REASSURING =
  /\b(no problems?|no prob|no worries|not a problem|no need to worry|don'?t worry|do not worry|of course|no te preocupes|no se preocupe|no hay problema|sin problemas?|claro que si|can'?t wait|cannot wait|can not wait|(won'?t|will not|wouldn'?t|would not|not going to) miss it|no me lo pierdo|no faltare|(i )?(will not|won'?t|wo not|not going to) be late|not be late|not late|no voy a llegar tarde|no llegare tarde|no llego tarde|on time|a tiempo|puntual)\b/g;

function reassured(text: string): string {
  return normalizeReply(text).replace(REASSURING, " ok ").replace(/\s+/g, " ").trim();
}

const LATE =
  /\b(late|tarde|retras\w*|demor\w*|a little after|un poco despues)\b|\b\d+\s*(min|mins|minutes?|minutos?)\b(?!\s*(early|before|antes|temprano))/;

const DECLINES =
  /\b(can'?t|cannot|can not|won'?t|wont|will not|unable|not able|not going to|not coming|i'?m sick|no puedo|no podre|no voy a (poder|ir|estar)|no ire|no vengo|no estare|no llegare|imposible|(don'?t|do not) think)\b/;
/** A negation a few words before the verb it negates: "I will not come", "no voy". */
const NEGATED_ATTEND =
  /\b(not|no|never|nunca)\b(?: [\w']+){0,2} (come|coming|be there|make it|go|going|work|attend|ir|venir|voy|estar|llegar|asistir)\b/;
const UNCLEAR = /\b(not sure|maybe|perhaps|i think so|tal vez|quizas?|no se|no estoy segur[oa]|i don'?t know|depends|depende)\b/;

const YES =
  /\b(yes|yeah|yep|yup|ya|sure|ok|okay|confirm|confirmed|absolutely|certainly|definitely|great|perfect|sounds good|sounds great|got it|alright|all right|fine|will do|count me in|see you|i'?ll be there|i will be there|be there|be here|i can come|i can be there|i can make it|i'?ll come|i will come|i come|i'?m coming|i am coming|im coming|i will go|si|claro|vale|dale|listo|confirmo|confirmado|perfecto|entendido|de acuerdo|por supuesto|con gusto|esta bien|seguro|ahi estare|alli estare|estare|nos vemos|cuenta conmigo|voy|ire|llego|llegare|puedo ir|puedo estar|puedo llegar)\b/;

/** A clock time other than 10:00 ("at 11", "10:30 am", "a las 9"). */
function namesOtherTime(t: string): boolean {
  const times = [
    ...t.matchAll(/\b(?:at|by|around|a las|para las)\s*(\d{1,2})(?:[:.h](\d{2}))?\b/g),
    ...t.matchAll(/\b(\d{1,2})(?:[:.h](\d{2}))?\s*(?:am|pm|a\.? ?m\.?|p\.? ?m\.?)(?![a-z])/g),
  ];
  return times.some(([, h, m]) => Number(h) !== 10 || (m !== undefined && Number(m) !== 0));
}

/**
 * Maria: "Your shift tomorrow starts at 10 AM. Can you confirm you will be
 * here?" A yes in any honest form passes; a no, a late arrival, or a
 * different time does not.
 */
export function startTimeVerdict(response: string): StartTimeVerdict {
  if (!response.trim()) return "empty";
  if (hasBlank(response)) return "blank";
  const t = reassured(response);
  if (/^(no|nope|nah)\b/.test(t) || DECLINES.test(t) || NEGATED_ATTEND.test(t)) return "declines";
  if (LATE.test(t)) return "late";
  if (namesOtherTime(t)) return "other-time";
  if (UNCLEAR.test(t)) return "unclear";
  return YES.test(t) ? "ok" : "unclear";
}

const UNDER_COUNTER_EN = /\b(under|undr|below|beneath|underneath)\b.{0,35}\b(counter|conter|worktop)\b/;
const UNDER_COUNTER_ES = /\b(debajo|bajo)\b.{0,35}\b(mostrador|meson|barra|encimera)\b/;
const SHELF = /\b(shelf|shelves|shelve|estante|repisa)\b/;
/** "won't put it under", "no están debajo": a negation in the same clause, just before the place. */
const NEGATED_PLACE =
  /\b(not|no|never|won'?t|can'?t|cannot|don'?t|nunca|jamas)\b(?: [\w']+){0,3} (under|undr|below|beneath|underneath|on|debajo|bajo|en|shelf|estante|repisa)\b/;

/**
 * Darnell: "you can leave your bag on the shelf under the counter. Reply and
 * tell me where you will put it." Naming the shelf or "under the counter"
 * answers him; saying you will not put it there does not.
 */
export function bagVerdict(response: string): BagVerdict {
  if (!response.trim()) return "empty";
  if (hasBlank(response)) return "blank";
  const t = reassured(response);
  const place = UNDER_COUNTER_EN.test(t) || UNDER_COUNTER_ES.test(t) || SHELF.test(t);
  if (!place) return "wrong-place";
  if (NEGATED_PLACE.test(t)) return "negated";
  return "ok";
}
