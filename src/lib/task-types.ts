export type Lang = "en" | "es";

export type Localized<T = string> = Record<Lang, T>;

/** A single help-drawer micro-lesson: a title, a few short steps, and one tip. */
export interface Lesson {
  t: string;
  s: string[];
  tip: string;
}

/** One option in an end-of-task confidence check-in, with the coach's reply if picked. */
export interface ConfidenceOption {
  label: string;
  reply: string;
}

/** One row in a generic "pick the right item from a list" modal (files, calendar slots, etc.). */
export interface PickableItem {
  key: string;
  label: string;
  tagText?: string;
  tagColor?: string;
  /** Extra right-aligned columns, e.g. a date. */
  columns?: string[];
  isTarget: boolean;
  wrongHint?: Localized | null;
}
