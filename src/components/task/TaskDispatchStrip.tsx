import type { Lang } from "@/lib/task-types";
import type { TaskKey } from "@/lib/desktop-content";
import { TASK_INFO } from "@/lib/tracks-content";

/**
 * Tasks that render their own RightNowBar (a per-step instruction inside the
 * window). For those, this strip stays silent — one instruction voice per
 * screen, never two competing rows of "what to do."
 */
const SELF_INSTRUCTING_TASKS = new Set<string>(["mail", "files", "tour"]);

/**
 * The same story line ShiftBriefing shows on the bare desktop
 * (SHIFT_MOMENT + TASK_INFO.dispatch), but inside the task window - so it
 * doesn't vanish the moment a learner opens the thing they're briefed on.
 * A plain row in the browser chrome, not a floating overlay, so it can
 * never cover a task's own header, Help button, or CTA. Takes a plain
 * string (the browser's active tab key can be a non-task tab like "portal"
 * or "newtab-N") and simply renders nothing for keys with no TASK_INFO entry
 * or for tasks that carry their own step-by-step bar.
 */
export default function TaskDispatchStrip({ taskKey, lang }: { taskKey: string; lang: Lang }) {
  if (SELF_INSTRUCTING_TASKS.has(taskKey)) return null;
  const info = TASK_INFO[taskKey as TaskKey];
  if (!info) return null;

  return (
    <div className="border-b border-[#dadce0] bg-[#f8f9fa] px-4 py-2">
      <p className="text-[14px] font-medium leading-snug text-[#3c4043]">{info.dispatch[lang]}</p>
    </div>
  );
}
