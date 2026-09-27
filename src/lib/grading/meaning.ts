/**
 * Shared, negation-aware reading of what a learner typed. Every writing check
 * in the story builds on these, so a phrase that counts in one task counts in
 * all of them.
 *
 * Two rules run through all of it:
 * - Honest beginner English (and Spanish) passes: "I no come today", "i cant
 *   go", "can not", "6th of October", "he is ok".
 * - A word only counts when it is not negated in its own clause. "I did not
 *   clean" is not cleaning, "I do not accept" is not a yes, and "I am not
 *   sure" is not an answer.
 *
 * Everything here is pure, so each task's pass/fail rule stays a pure
 * function in its own `content.ts`. It grew out of the Day One reply checks
 * (`tasks/mail/reply-grading.ts`, which now builds on it) and shares its
 * keyboard-mash rule with the hiring lessons (`grading-jobs.ts`).
 */

import { isMashWord } from "@/lib/grading-jobs";

/** Lowercase, accents off, curly quotes straight, ¿¡ gone, spaces squeezed. */
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

/** Normalized, with reassuring phrases turned into "ok". */
export function reassured(text: string): string {
  return normalizeReply(text).replace(REASSURING, " ok ").replace(/\s+/g, " ").trim();
}

// ── Words ───────────────────────────────────────────────────────────────

/** Word tokens (letters, digits, apostrophes) of the normalized text. */
export function words(text: string): string[] {
  return normalizeReply(text).match(/[a-z0-9ñ']+/g) ?? [];
}

export function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

const ONE_LETTER_WORDS = new Set(["i", "a", "y", "o", "e", "u"]);

/** "asdf", "jjjj", "qwe": a token nobody means as a word. Numbers are words here. */
function isMash(token: string): boolean {
  if (/^\d+$/.test(token)) return false;
  const w = token.replace(/'/g, "");
  // A short acronym has no vowel ("BHCC", "EKG" is fine already), so a
  // 4-letter vowel-less token is only mash if it is a keyboard run or a held
  // key. Adding a vowel lets the shared rule check just those two.
  if (w.length <= 4 && !/[aeiouy]/.test(w)) return isMashWord(`${w}a`);
  return isMashWord(w);
}

/** A token that reads as a word: not mash, and not a stray single letter. */
function isRealWord(token: string): boolean {
  if (/^\d+$/.test(token)) return true;
  if (token.length === 1) return ONE_LETTER_WORDS.has(token);
  return !isMash(token);
}

/** The same phrase over and over: "money money money", "I am good I am good". */
function isRepetitive(tokens: string[]): boolean {
  const n = tokens.length;
  if (n < 4) return false;
  const counts = new Map<string, number>();
  for (const t of tokens) counts.set(t, (counts.get(t) ?? 0) + 1);
  if (Math.max(...counts.values()) * 2 > n) return true;
  for (let k = 1; k * 2 <= n; k++) {
    if (tokens.every((t, i) => i < k || t === tokens[i - k])) return true;
  }
  return false;
}

/** How many tokens read as real words. */
export function realWordCount(text: string): number {
  return words(text).filter(isRealWord).length;
}

/**
 * Is this written to be read, rather than keyboard mash or one word on repeat?
 * Lenient on spelling and grammar: it only looks at the shape of the words.
 */
export function looksLikeRealText(text: string, minWords = 1): boolean {
  const tokens = words(text);
  const real = tokens.filter(isRealWord);
  if (real.length < minWords) return false;
  if (isRepetitive(tokens)) return false;
  return real.length * 3 >= tokens.length * 2;
}

// ── Negation ────────────────────────────────────────────────────────────

const NEGATORS = new Set([
  "not", "no", "never", "dont", "don't", "didnt", "didn't", "doesnt", "doesn't",
  "cant", "can't", "cannot", "wont", "won't", "isnt", "isn't", "wasnt", "wasn't",
  "arent", "aren't", "werent", "weren't", "havent", "haven't", "hasnt", "hasn't",
  "hadnt", "hadn't", "couldnt", "couldn't", "wouldnt", "wouldn't", "shouldnt", "shouldn't",
  "nobody", "noone", "nothing", "neither", "nor", "without",
  "nunca", "jamas", "nadie", "nada", "ni", "tampoco", "sin", "ningun", "ninguno", "ninguna",
]);

/**
 * Split into clauses: sentences, lines, and "…, but …" / "…, pero …". A "no"
 * in one clause never reaches a word in the next.
 */
export function clauses(text: string): string[] {
  return normalizeReply(text)
    .split(/[.!?;\n]+|,?\s+\b(?:but|pero|however|sin embargo)\b/)
    .map((c) => c.trim())
    .filter(Boolean);
}

/**
 * Is the word at `index` negated by something in the few words before it, in
 * the same clause? A "no," with a comma is an answer ("No, he is fine"), not
 * a negation, so it does not count.
 */
export function negatedAt(clause: string, index: number, window = 3): boolean {
  const before = clause.slice(0, index).split(/\s+/).filter(Boolean).slice(-window);
  return before.some((w) => NEGATORS.has(w));
}

function matchesIn(clause: string, re: RegExp): RegExpExecArray[] {
  const flags = re.flags.includes("g") ? re.flags : `${re.flags}g`;
  return [...clause.matchAll(new RegExp(re.source, flags))];
}

/** The pattern appears somewhere NOT negated: "I cleaned", "he is ok". */
export function affirms(text: string, re: RegExp, window = 3): boolean {
  return clauses(text).some((c) => matchesIn(c, re).some((m) => !negatedAt(c, m.index ?? 0, window)));
}

/** The pattern appears somewhere negated: "I did not clean", "nobody was hurt". */
export function denies(text: string, re: RegExp, window = 3): boolean {
  return clauses(text).some((c) => matchesIn(c, re).some((m) => negatedAt(c, m.index ?? 0, window)));
}

// ── Coming in, or not ───────────────────────────────────────────────────

/** Words that turn a sentence into "no": can't, won't, no puedo. */
export const DECLINES =
  /\b(can'?t|cant|cannot|can not|won'?t|wont|will not|unable|not able|not going to|not coming|i'?m sick|no puedo|no podre|no voy a (poder|ir|estar)|no ire|no vengo|no estare|no llegare|imposible|(don'?t|do not) think)\b/;

const ATTEND_VERBS =
  "come|coming|came|go|going|work|working|make it|be there|be in|be at work|attend|ir|venir|vengo|voy|estar|estare|llegar|llego|asistir|trabajar|trabajo";

/** A negation a few words before the verb it negates: "I will not come", "I no come", "no voy". */
export const NEGATED_ATTEND = new RegExp(
  `\\b(not|no|never|nunca|can'?t|cant|cannot|don'?t|dont|won'?t|wont)\\b(?: [\\w']+){0,2} (${ATTEND_VERBS})\\b`,
);

const ABSENCE =
  /\b(unable to (come|work|make it|be there)|won'?t be able|will not be able|not able to (come|work|make it)|(call(ing)?|calling) (out|in sick)|stay(ing)? (at )?home|take (the day|today) off|(i'?ll|i will|i'?m|i am) (be )?absent|no podre|no voy a poder|no voy a (ir|trabajar|venir)|no ire|no vengo|no estare|voy a faltar|falto hoy|estare ausente|quedarme en casa|me quedo en casa)\b/;

/** "I can't today", "no puedo hoy". */
const CANT_TODAY = /\b(can'?t|cant|cannot|can not|no puedo)( [\w']+)? (today|hoy)\b/;

/**
 * Says the learner will not come in, in any beginner form: can't / cant /
 * can not / cannot / won't / don't / no, before come / go / work / be there,
 * and the Spanish equivalents.
 */
export function saysCannotAttend(text: string): boolean {
  const t = reassured(text);
  return NEGATED_ATTEND.test(t) || ABSENCE.test(t) || CANT_TODAY.test(t);
}

// ── Yes, no, or not sure ────────────────────────────────────────────────

export const UNCLEAR =
  /\b(not sure|unsure|maybe|perhaps|i think so|tal vez|quizas?|a lo mejor|no se(?! puede)|no lo se|no estoy segur[oa]|i don'?t know|i do not know|dont know|depends|depende|think about it|let me think|lo pienso|lo voy a pensar|pensarlo)\b/;

export const YES =
  /\b(yes|yeah|yep|yup|ya|sure|ok|okay|confirm|confirmed|absolutely|certainly|definitely|great|perfect|sounds good|sounds great|got it|alright|all right|fine|will do|count me in|see you|i'?ll be there|i will be there|be there|be here|i can come|i can be there|i can make it|i'?ll come|i will come|i come|i'?m coming|i am coming|im coming|i will go|si|claro|vale|dale|listo|confirmo|confirmado|perfecto|entendido|de acuerdo|por supuesto|con gusto|esta bien|seguro|ahi estare|alli estare|estare|nos vemos|cuenta conmigo|voy|ire|llego|llegare|puedo ir|puedo estar|puedo llegar)\b/;

/** Yes to a request: "we can", "that works", "podemos". */
const CAN_DO = /\b(we can|i can|can do|that works|works for (us|me)|it works|podemos|puedo|se puede|funciona|no hay problema)\b/;

/** No to a request: "we can't", "no podemos", a bare "no". */
const CANT_DO =
  /\b(we can'?t|we cant|we cannot|we can not|i can'?t|i cant|i cannot|i can not|can'?t do|won'?t work|will not work|doesn'?t work|does not work|not possible|no es posible|no podemos|no puedo|no se puede|imposible|no funciona|too early|muy temprano|demasiado temprano)\b/;

export type YesNo = "yes" | "no" | "unsure" | "none";

/** A yes-or-no answer to a request, with "not sure" kept apart from both. */
export function yesNoAnswer(text: string): YesNo {
  if (!text.trim()) return "none";
  const t = reassured(text);
  if (UNCLEAR.test(t)) return "unsure";
  if (/^(no|nope|nah)\b/.test(t) || /(^|[,.!] ?)(no|nope)[,.!]/.test(t) || CANT_DO.test(t)) return "no";
  if (YES.test(t) || CAN_DO.test(t)) return "yes";
  return "none";
}

// ── Accept or decline an offer ──────────────────────────────────────────

/** What a "not" must sit next to for a reply to decline: "I do not accept", "no voy a tomar la clase". */
const ACCEPT_WORDS = /\b(accept\w*|acept\w*|take (it|this|the (class|job|offer|role|position))|tomar(la|lo)?|la tomo|lo tomo|want (it|the (class|job|offer|role|position)))\b/;
const DECLINE_WORDS =
  /\b(declin\w*|turn (it |this )?down|pass on|no thanks?|no,? thank you|no gracias|rechaz\w*|no me interesa|not interested)\b/;
const ACCEPT_PHRASES =
  /\b(accept\w*|acepto|aceptar|aceptamos|acepta|i'?ll take|i will take|i take|voy a tomar|lo tomo|la tomo|count me in|i'?m in|i am in|glad to|happy to|me encantaria|con gusto|see you|nos vemos|i come|i will come|i'?ll come|i will start|i'?ll start|empiezo|empezare|voy a empezar|alli estare|ahi estare)\b/;

export type Acceptance = "accepts" | "declines" | "unsure" | "none";

/**
 * Accept or decline an offer in any honest form. "yes ok thank you" accepts;
 * "I do not accept the class" declines, however many times it says "accept".
 */
export function acceptance(text: string): Acceptance {
  if (!text.trim()) return "none";
  const t = reassured(text);
  if (DECLINE_WORDS.test(t) || denies(t, ACCEPT_WORDS) || /^(no|nope|nah)\b/.test(t)) return "declines";
  if (UNCLEAR.test(t)) return "unsure";
  if (affirms(t, ACCEPT_PHRASES) || YES.test(t)) return "accepts";
  return "none";
}

// ── Questions ───────────────────────────────────────────────────────────

const QUESTION_START =
  /^(what|when|where|who|whom|whose|why|how|which|can|could|do|does|did|is|are|was|will|would|should|shall|may|might|have|has|am|que|cuando|donde|quien|quienes|por que|como|cual|cuales|cuanto|cuantos|puedo|podemos|puede|pueden|hay|tengo|tenemos|debo|debemos)\b/;
const ASKS = /\b(question|i want to ask|i'?d like to ask|i wonder|wondering|pregunta|quiero preguntar|quisiera preguntar)\b/;

/** A real question, not "hi": a question mark or a question word, and a few words. */
export function isQuestion(text: string): boolean {
  const t = normalizeReply(text);
  if (!looksLikeRealText(t, 2)) return false;
  if (t.includes("?")) return true;
  if (ASKS.test(t)) return true;
  return QUESTION_START.test(t) && realWordCount(t) >= 3;
}

// ── Dates and times ─────────────────────────────────────────────────────

const MONTHS: [RegExp, number][] = [
  [/^(january|jan|enero|ene)$/, 1],
  [/^(february|feb|febrero)$/, 2],
  [/^(march|mar|marzo)$/, 3],
  [/^(april|apr|abril|abr)$/, 4],
  [/^(may|mayo)$/, 5],
  [/^(june|jun|junio)$/, 6],
  [/^(july|jul|julio)$/, 7],
  [/^(august|aug|agosto|ago)$/, 8],
  [/^(september|sept|sep|septiembre|setiembre|set)$/, 9],
  [/^(october|oct|octubre)$/, 10],
  [/^(november|nov|noviembre)$/, 11],
  [/^(december|dec|diciembre|dic)$/, 12],
];

const DAY_WORDS: Record<string, number> = {
  first: 1, second: 2, third: 3, fourth: 4, fifth: 5, sixth: 6, seventh: 7, eighth: 8, ninth: 9, tenth: 10,
  one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
  primero: 1, uno: 1, dos: 2, tres: 3, cuatro: 4, cinco: 5, seis: 6, siete: 7, ocho: 8, nueve: 9, diez: 10,
};

const MONTH_WORD = `(?:${MONTHS.map(([re]) => re.source.slice(2, -2)).join("|")})\\.?`;
const DAY_TOKEN = `(\\d{1,2})(?:st|nd|rd|th|o)?|(${Object.keys(DAY_WORDS).join("|")})`;

function monthNumber(word: string): number | null {
  const w = word.replace(/\.$/, "");
  return MONTHS.find(([re]) => re.test(w))?.[1] ?? null;
}

function dayNumber(digits: string | undefined, word: string | undefined): number | null {
  if (digits) {
    const n = Number(digits);
    return n >= 1 && n <= 31 ? n : null;
  }
  return word ? (DAY_WORDS[word] ?? null) : null;
}

export type MonthDay = { month: number; day: number };

/**
 * Every calendar date written with a month name, in any common order:
 * "October 6", "Oct. 6th", "october the 6th", "6th of October", "6 de octubre".
 */
export function namedDates(text: string): MonthDay[] {
  const t = normalizeReply(text);
  const found: MonthDay[] = [];
  const monthFirst = new RegExp(`\\b(${MONTH_WORD})\\s+(?:the\\s+)?(?:${DAY_TOKEN})\\b`, "g");
  for (const m of t.matchAll(monthFirst)) {
    const month = monthNumber(m[1]);
    const day = dayNumber(m[2], m[3]);
    if (month && day) found.push({ month, day });
  }
  const dayFirst = new RegExp(`\\b(?:the\\s+)?(?:${DAY_TOKEN})\\s+(?:of\\s+|de\\s+)?(${MONTH_WORD})(?![a-z])`, "g");
  for (const m of t.matchAll(dayFirst)) {
    const month = monthNumber(m[3]);
    const day = dayNumber(m[1], m[2]);
    if (month && day) found.push({ month, day });
  }
  return found;
}

/** "10/6", "10-06", "6/10/2026": month and day either way round. */
function numericDateMatches(t: string, { month, day }: MonthDay): boolean {
  return [...t.matchAll(/(?<![\d/.-])(\d{1,2})[/-](\d{1,2})(?:[/-]\d{2,4})?(?![\d/-])/g)].some(([, a, b]) => {
    const x = Number(a);
    const y = Number(b);
    return (x === month && y === day) || (x === day && y === month);
  });
}

/** Names this date in any common form, ordinal or day-first included. */
export function mentionsDate(text: string, date: MonthDay): boolean {
  const t = normalizeReply(text);
  return namedDates(t).some((d) => d.month === date.month && d.day === date.day) || numericDateMatches(t, date);
}

/** Names a different date in the same month: "October 9" when the letter says October 6. */
export function mentionsOtherDayOfMonth(text: string, date: MonthDay): boolean {
  return namedDates(text).some((d) => d.month === date.month && d.day !== date.day);
}

const HOUR_WORDS: Record<number, string> = {
  1: "one|una", 2: "two|dos", 3: "three|tres", 4: "four|cuatro", 5: "five|cinco", 6: "six|seis",
  7: "seven|siete", 8: "eight|ocho", 9: "nine|nueve", 10: "ten|diez", 11: "eleven|once", 12: "twelve|doce",
};

/**
 * Names this clock time: "7", "7:00", "7am", "7 a.m.", "07.00", "seven",
 * "las siete". For a time on the hour, a bare hour counts; "7:30" does not.
 */
export function mentionsTime(text: string, hour: number, minute = 0): boolean {
  const t = normalizeReply(text);
  const mm = String(minute).padStart(2, "0");
  const digits =
    minute === 0
      ? new RegExp(`(?<![\\d:.$])0?${hour}(?:\\s*[:.h]\\s*00)?(?![\\d])(?!\\s*[:.]\\s*\\d)(?!\\s*(?:min|minute|minuto|hour|hora|dollar|dolar|%))`)
      : new RegExp(`(?<![\\d:.$])0?${hour}\\s*[:.h ]\\s*${mm}(?!\\d)`);
  if (digits.test(t)) return true;
  if (minute !== 0) return false;
  const word = HOUR_WORDS[hour];
  return Boolean(word) && new RegExp(`\\b(${word})\\b(?!\\s*(?:min|minute|minuto|hour|hora|dollar|dolar|people|person|persona))`).test(t);
}
