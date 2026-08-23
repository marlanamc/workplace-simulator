import { useCallback, useState } from "react";
import { useProgress } from "@/lib/progress-context";
import { useNudge, type NudgeMessage } from "@/lib/use-nudge";

/**
 * One hook a task calls per skill: the persistent rung (from ProgressContext,
 * decided by real completions over time), the session's wrong-click count,
 * and the Show-me highlight target. The rung feeds the "no help" badge and
 * the rung-4 bridge-out moment; it never punishes — it only loosens.
 */
export function useSkillGuidance(skillKey: string) {
  const { getRung, recordSkillRun } = useProgress();
  const { nudge, say } = useNudge();
  const rung = getRung(skillKey);

  const [wrongCount, setWrongCount] = useState(0);
  const [showMeTargetId, setShowMeTargetId] = useState<string | null>(null);

  const recordWrong = useCallback(
    (message?: NudgeMessage) => {
      if (message) say(message);
      setWrongCount((n) => n + 1);
    },
    [say],
  );

  const recordClean = useCallback(() => {
    setWrongCount(0);
    setShowMeTargetId(null);
    recordSkillRun(skillKey, { clean: true });
  }, [skillKey, recordSkillRun]);

  const recordMissed = useCallback(() => {
    setWrongCount(0);
    recordSkillRun(skillKey, { clean: false });
  }, [skillKey, recordSkillRun]);

  return {
    rung,
    nudge,
    say,
    recordWrong,
    recordClean,
    recordMissed,
    wrongCount,
    showMeTargetId,
    setShowMeTarget: setShowMeTargetId,
  };
}
