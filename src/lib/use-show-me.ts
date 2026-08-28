"use client";

import { useCallback, useState } from "react";
import type { Localized } from "@/lib/task-types";

/**
 * The Job Card's "Show me" for one task.
 *
 * Pointing is the escape hatch for a learner who has read the card, believes
 * it, and still cannot find the thing it names. The card supplies the button;
 * a task supplies which control the current step is about, by marking it with
 * `data-showme="<id>"` and naming that id here.
 */
export function useShowMe() {
  const [targetId, setTargetId] = useState<string | null>(null);

  /** Press again on the same step to put the spotlight away. */
  const toggleFor = useCallback(
    (id: string) => setTargetId((current) => (current === id ? null : id)),
    [],
  );
  const clear = useCallback(() => setTargetId(null), []);

  return { targetId, toggleFor, clear };
}

/** What the spotlight bubble says. One phrasing everywhere, so it reads the same in every job. */
export const SHOW_ME_POINTER: Localized<string> = {
  en: "This one. Click it.",
  es: "Este. Haz clic aquí.",
};
