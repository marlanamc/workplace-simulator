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

import { DECLINES, NEGATED_ATTEND, UNCLEAR, YES, hasBlank, normalizeReply, reassured } from "@/lib/grading/meaning";

export { hasBlank, normalizeReply };

export type StartTimeVerdict = "ok" | "empty" | "blank" | "declines" | "late" | "other-time" | "unclear";
export type BagVerdict = "ok" | "empty" | "blank" | "wrong-place" | "negated";

const LATE =
  /\b(late|tarde|retras\w*|demor\w*|a little after|un poco despues)\b|\b\d+\s*(min|mins|minutes?|minutos?)\b(?!\s*(early|before|antes|temprano))/;

/** A clock time other than 10:00 ("at 11", "10:30 am", "a las 9"). */
function namesOtherTime(t: string): boolean {
  const times = [
    ...t.matchAll(/\b(?:at|by|around|a las|para las)\s*(\d{1,2})(?:[:.h](\d{2}))?\b/g),
    ...t.matchAll(/\b(\d{1,2})(?:[:.h](\d{2}))?\s*(?:am|pm|a\.? ?m\.?|p\.? ?m\.?)(?![a-z])/g),
  ];
  return times.some(([, h, m]) => Number(h) !== 10 || (m !== undefined && Number(m) !== 0));
}

/** "10 pm", "10:00 p.m.": the right hour, the wrong half of the day. */
const EXPLICIT_PM = /\b\d{1,2}(?:[:.h]\d{2})?\s*p\.? ?m\.?(?![a-z])/i;

/**
 * 10 AM, named without a "yes" word ("10 AM", "Tomorrow at 10"): itself an
 * answer to "what time will you be here", not a sentence that needs a yes on
 * top of it. Only the AM form counts here — a bare "10 pm" is caught by
 * `EXPLICIT_PM` first.
 */
function namesTenAM(t: string): boolean {
  const times = [
    ...t.matchAll(/\b(?:at|by|around|a las|para las)\s*(\d{1,2})(?:[:.h](\d{2}))?\b/gi),
    ...t.matchAll(/\b(\d{1,2})(?:[:.h](\d{2}))?\s*(?:am|a\.? ?m\.?)(?![a-z])/gi),
  ];
  return times.some(([, h, m]) => Number(h) === 10 && (m === undefined || Number(m) === 0));
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
  // "No estoy segura" starts with "no" but is not a no: it gets the "answer
  // yes or no" correction, not "your reply says you can't come".
  if (UNCLEAR.test(t) && !DECLINES.test(t)) return "unclear";
  if (/^(no|nope|nah)\b/.test(t) || DECLINES.test(t) || NEGATED_ATTEND.test(t)) return "declines";
  if (LATE.test(t)) return "late";
  if (namesOtherTime(t)) return "other-time";
  if (EXPLICIT_PM.test(t)) return "other-time";
  if (UNCLEAR.test(t)) return "unclear";
  if (namesTenAM(t)) return "ok";
  return YES.test(t) ? "ok" : "unclear";
}

const UNDER_COUNTER_EN = /\b(under|undr|below|beneath|underneath)\b.{0,35}\b(counter|conter|worktop)\b/;
const UNDER_COUNTER_ES = /\b(debajo|bajo)\b.{0,35}\b(mostrador|meson|barra|encimera)\b/;
const SHELF = /\b(shelf|shelves|shelve|estante|repisa)\b/;
/** "won't put it under", "no están debajo": a negation in the same clause, just before the place. */
// Up to four words between: Spanish puts more there ("no la voy a dejar debajo").
const NEGATED_PLACE =
  /\b(not|no|never|won'?t|can'?t|cannot|don'?t|nunca|jamas)\b(?: [\w']+){0,4} (under|undr|below|beneath|underneath|on|debajo|bajo|en|shelf|estante|repisa)\b/;

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
