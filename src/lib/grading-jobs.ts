/**
 * Small, generic checks for the hiring lessons' free text and form boxes
 * (job-posting, job-application, resume-build, w4-form). Pure functions, so
 * each task's content.ts can build its pass/fail rule on them and the tests
 * can pin them without React.
 *
 * The aim is the audit's: accept short, honest beginner English or Spanish
 * ("I led team", "Trained new workers.") and refuse text that is not words at
 * all ("asdf asdf asdf asdf"), a starter frame whose blank was never filled,
 * or a box copied wrong.
 */

/** Words made of letters (any accent), with inner apostrophes kept: "I'm", "don't". */
export function wordsOf(text: string): string[] {
  return text.match(/\p{L}+(?:['’]\p{L}+)*/gu) ?? [];
}

// Letter runs that come from sliding a finger along a keyboard row. Common
// English and Spanish words almost never contain them. The busy middle of
// the top row is left out on purpose: "answer" has "wer", "crew" has "rew",
// "point" has "poi".
const ROW_RUNS = [
  "asd", "sdf", "dfg", "fgh", "ghj", "hjk", "jkl", "lkj", "kjh", "fds", "dsa",
  "qwe", "wqe", "zxc", "xcv", "cvb", "vbn", "bnm", "mnb", "uyt", "ytr",
];

/** One token that no one types on purpose: a keyboard row, no vowel, a held key. */
export function isMashWord(word: string): boolean {
  const w = word.toLowerCase().normalize("NFD").replace(/\p{M}/gu, "");
  if (w.length < 3) return false;
  if (ROW_RUNS.some((run) => w.includes(run))) return true;
  if (/(.)\1\1/.test(w)) return true;
  if (w.length >= 4 && !/[aeiouy]/.test(w)) return true;
  if (/[^aeiouy]{6,}/.test(w)) return true;
  return false;
}

/**
 * True when the text reads as random typing rather than words: any token that
 * looks mashed, or one word said over and over ("work work work work").
 */
export function looksLikeKeyboardMash(text: string): boolean {
  const words = wordsOf(text);
  if (words.length === 0) return false;
  if (words.some(isMashWord)) return true;
  const distinct = new Set(words.map((w) => w.toLowerCase()));
  return words.length >= 3 && distinct.size === 1;
}

/** Still holds a starter's blank ("I am good at ___."). */
export function hasBlank(text: string): boolean {
  return /_{2,}|…|\.\.\./.test(text);
}

/** How many real words the learner wrote (mashed tokens do not count). */
export function realWordCount(text: string): number {
  return wordsOf(text).filter((w) => !isMashWord(w)).length;
}

/** Lower case, no accents, single spaces, no end punctuation. For comparing two answers. */
export function plain(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** A name typed with any case, extra spaces, or a trailing period. */
export function sameName(typed: string, expected: string): boolean {
  return plain(typed) !== "" && plain(typed) === plain(expected);
}

/**
 * A phone number typed any common way: (617) 555-0142, 617-555-0142,
 * 617 555 0142, 6175550142, +1 617 555 0142.
 */
export function samePhone(typed: string, expected: string): boolean {
  const digits = (v: string) => v.replace(/\D/g, "").replace(/^1(?=\d{10}$)/, "");
  return digits(typed).length > 0 && digits(typed) === digits(expected);
}

/** An email typed with capitals or stray spaces ("Sam.Rivera @mail.com"). */
export function sameEmail(typed: string, expected: string): boolean {
  const norm = (v: string) => v.toLowerCase().replace(/\s+/g, "");
  return norm(typed) !== "" && norm(typed) === norm(expected);
}

/**
 * A count box read the way a person means it: "0", " 2 ", "none", "zero",
 * "cero", "ninguno". Null when it is not a count at all.
 */
export function readCount(typed: string): number | null {
  const v = plain(typed);
  if (/^\d+$/.test(v)) return Number(v);
  if (/^(none|zero|no|nobody|no one|cero|ninguno|ninguna|nada|nadie|no hay|no tiene)$/.test(v)) return 0;
  const words: Record<string, number> = { one: 1, two: 2, three: 3, uno: 1, una: 1, dos: 2, tres: 3 };
  return v in words ? words[v] : null;
}
