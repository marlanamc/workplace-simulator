import type { Lang } from "@/lib/task-types";
import type { TaskKey } from "@/lib/desktop-content";
import { TASK_INFO } from "@/lib/tracks-content";
import { SHIFT_MOMENT } from "@/lib/story-beats";

/**
 * The same story line ShiftBriefing shows on the bare desktop
 * (SHIFT_MOMENT + TASK_INFO.dispatch), but inside the task window - so it
 * doesn't vanish the moment a learner opens the thing they're briefed on.
 * A plain row in the browser chrome, not a floating overlay, so it can
 * never cover a task's own header, Help button, or CTA. Takes a plain
 * string (the browser's active tab key can be a non-task tab like "portal"
 * or "newtab-N") and simply renders nothing for keys with no TASK_INFO entry.
 */
export default function TaskDispatchStrip({ taskKey, lang }: { taskKey: string; lang: Lang }) {
  const info = TASK_INFO[taskKey as TaskKey];
  if (!info) return null;
  const moment = SHIFT_MOMENT[taskKey as TaskKey]?.[lang];

  return (
    <div className="border-b border-[#dadce0] bg-[#f8f9fa] px-4 py-2">
      {moment && <p className="text-[12px] text-[#5f6368]">{moment}</p>}
      <p className="text-[13px] font-medium leading-snug text-[#3c4043]">{info.dispatch}</p>
    </div>
  );
}
