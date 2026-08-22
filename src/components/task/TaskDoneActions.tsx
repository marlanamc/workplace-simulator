"use client";

import { DESKTOP_COPY } from "@/lib/desktop-content";
import { HANDOFF_CTA } from "@/lib/story-beats";
import { TASK_INFO, levelForTrack, nextHandoff } from "@/lib/tracks-content";
import { sittingTitle } from "@/lib/shift-spine";
import { useProgress } from "@/lib/progress-context";
import { useWindowManager } from "@/lib/window-manager";

const PRIMARY =
  "inline-flex min-h-[46px] items-center rounded-full bg-[var(--accent)] px-5 text-[15px] font-medium text-white hover:bg-[var(--accent-hover)] cursor-pointer";
const SECONDARY =
  "inline-flex min-h-[46px] items-center rounded-full border border-[var(--border)] px-5 text-[15px] font-medium text-[var(--text-primary)] hover:bg-[var(--surface-muted)] cursor-pointer";

/** Primary = next task. Try again and back-to-desktop stay as quieter options. */
export default function TaskDoneActions({
  tryAgainLabel,
  backToDeskLabel,
  onTryAgain,
}: {
  tryAgainLabel: string;
  backToDeskLabel: string;
  onTryAgain: () => void;
}) {
  const { completedTaskKeys, lang, celebrateLevel, currentTrack } = useProgress();
  const { openApp, minimizeActive } = useWindowManager();
  const handoff = celebrateLevel ? null : nextHandoff(completedTaskKeys);
  const nextLabel = handoff
    ? (HANDOFF_CTA[handoff.taskKey][lang] ?? DESKTOP_COPY[lang].nextLabel)
    : null;
  const sittingLine = handoff
    ? `${sittingTitle(levelForTrack(currentTrack.key))} · ${TASK_INFO[handoff.taskKey].label}`
    : null;

  return (
    <div>
      {sittingLine ? (
        <p className="mb-3 text-[14px] leading-snug text-[var(--text-secondary)]">{sittingLine}</p>
      ) : null}
    <div className="flex flex-wrap gap-2">
      {handoff && nextLabel ? (
        <button
          type="button"
          onClick={() =>
            openApp(handoff.location.appKey, {
              tab: handoff.location.tab,
              section: handoff.location.section,
            })
          }
          className={PRIMARY}
        >
          {nextLabel}
        </button>
      ) : null}
      <button type="button" onClick={onTryAgain} className={handoff ? SECONDARY : PRIMARY}>
        {tryAgainLabel}
      </button>
      <button type="button" onClick={minimizeActive} className={SECONDARY}>
        {backToDeskLabel}
      </button>
    </div>
    </div>
  );
}
