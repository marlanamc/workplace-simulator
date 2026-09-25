import type { Localized } from "@/lib/task-types";
export type Mode = "guided" | "independent";
/** Every saved draft carries these; the rest is the activity's own answers. */
export type BaseDraft = { version: number; stage: string; mode: Mode };
export type { TeacherGuide } from "@/lib/lessons/types";
import type { TeacherGuide } from "@/lib/lessons/types";
/** What the library, login redirect, and API need — no stage typing. */
export type ActivityMeta = {
  id: string;
  version: number;
  eyebrow: Localized;
  title: Localized;
  summary: Localized;
  minutes: Localized;
  guide: TeacherGuide;
  parseDraft(value: unknown): BaseDraft | null;
};
export type PracticeActivity<D extends BaseDraft> = Omit<
  ActivityMeta,
  "parseDraft"
> & {
  /** In order; the last stage is the confirmation. */
  stages: readonly D["stage"][];
  blank(mode?: Mode): D;
  parseDraft(value: unknown): D | null;
  instructions: Record<D["stage"], Localized>;
  help: Record<D["stage"], Localized>;
  goal: Localized;
  /** The fictional details a learner copies from; values in English stay English. */
  details: { label: Localized; value: string | Localized }[];
};
export const MODES: readonly Mode[] = ["guided", "independent"];
