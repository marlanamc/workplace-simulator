export type Lang = "en" | "es";

export type Localized<T = string> = Record<Lang, T>;

/** A single help-drawer micro-lesson: a title, a few short steps, and one tip. */
export interface Lesson {
  t: string;
  s: string[];
  tip: string;
}

/** The dramatic "here's what's happening" event card shown before a task starts. */
export interface EventIntroCopy {
  emoji: string;
  kicker: string;
  headline: string;
  body: string;
  cta: string;
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
