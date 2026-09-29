import type { TaskKey } from "@/lib/desktop-content";

/**
 * Where a mail job had got to, so a reload or a trip to another bookmark
 * brings the learner back to the same screen with the same words (Wave 5
 * F-7, F-23: Day 2's attachment, Day 4's reply to Darnell and Day 5's sick
 * call all came back empty).
 *
 * One draft per learner and per mail job, on this device, like the other
 * task drafts (`use-task-draft.ts`). The Night Before keeps its own draft
 * (`ws-opening-draft`), and a lesson keeps nothing.
 */
export interface MailDraft {
  view: MailDraftView;
  step: number;
  body: string;
  attached: boolean;
  confirmPick: string | null;
  replyAudience: "dana" | "all" | null;
}

/** The screens worth coming back to. The inbox, a story email and the done
 *  screen are not: those open the way they always do. */
export type MailDraftView = "read" | "confirm" | "compose";
const VIEWS: readonly string[] = ["read", "confirm", "compose"];

export function mailDraftKey(learnerId: string, task: TaskKey): string {
  return `ws-task-draft:${learnerId}:${task}:mail`;
}

/** A saved draft, or null when there is none or it does not have the right
 *  shape (an old build, a hand-edited key). A bad draft never blocks Mail. */
export function readMailDraft(raw: string | null): MailDraft | null {
  if (!raw) return null;
  try {
    const d = JSON.parse(raw);
    if (!d || typeof d !== "object") return null;
    if (!VIEWS.includes(d.view)) return null;
    if (typeof d.step !== "number" || !Number.isFinite(d.step) || d.step < 0 || d.step > 4) return null;
    if (typeof d.body !== "string" || typeof d.attached !== "boolean") return null;
    if (d.confirmPick !== null && typeof d.confirmPick !== "string") return null;
    if (d.replyAudience !== null && d.replyAudience !== "dana" && d.replyAudience !== "all") return null;
    return {
      view: d.view,
      step: d.step,
      body: d.body,
      attached: d.attached,
      confirmPick: d.confirmPick,
      replyAudience: d.replyAudience,
    };
  } catch {
    return null;
  }
}

/** What to save for the screen the learner is on, or null to leave the
 *  saved draft as it is: stepping back to the inbox or into a story email
 *  keeps the reply they had started. Mail drops the draft when the job is
 *  done. */
export function mailDraftFor(state: {
  view: string;
  step: number;
  body: string;
  attached: boolean;
  confirmPick: string | null;
  replyAudience: "dana" | "all" | null;
}): MailDraft | null {
  if (!VIEWS.includes(state.view)) return null;
  return {
    view: state.view as MailDraftView,
    step: Math.max(0, Math.min(4, state.step)),
    body: state.body,
    attached: state.attached,
    confirmPick: state.confirmPick,
    replyAudience: state.replyAudience,
  };
}
