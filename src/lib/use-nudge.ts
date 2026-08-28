import { useCallback, useEffect, useRef, useState } from "react";
import type { LucideIcon } from "lucide-react";

/** A richer coaching card (mockup's "Not that one. That is Send." style) — title required, body/icon optional. */
export interface NudgeCard {
  title: string;
  body?: string;
  icon?: LucideIcon;
}

/** What `say()` accepts: the existing plain-string toasts, or a structured card. */
export type NudgeMessage = string | NudgeCard;

/**
 * Shows a short-lived coaching toast (plain string or a structured card).
 * Auto-dismisses after `durationMs`; learners can also dismiss early (X / click anywhere).
 * Default is still generous — the audience reads carefully, sometimes in a second language.
 */
export function useNudge(durationMs = 6000) {
  const [nudge, setNudge] = useState<NudgeMessage>("");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const dismiss = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
    setNudge("");
  }, []);

  const say = useCallback(
    (msg: NudgeMessage) => {
      setNudge(msg);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setNudge(""), durationMs);
    },
    [durationMs],
  );

  return { nudge, say, dismiss };
}
