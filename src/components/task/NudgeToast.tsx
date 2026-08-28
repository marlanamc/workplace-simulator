"use client";

import { useEffect } from "react";
import type { NudgeMessage } from "@/lib/use-nudge";
import { useJobCardOptional } from "@/lib/job-card-context";

/**
 * No longer a toast. Corrections belong inside the Job Card so there is only
 * ever one place to look — a floating toast next to a card that already
 * speaks is exactly the second voice this design removes.
 *
 * Tasks keep calling `recordWrong()` the way they always have; this routes
 * what they say into the card's correction block and renders nothing.
 */
export default function NudgeToast({
  text,
}: {
  text: NudgeMessage;
  /** Kept for call-site compatibility; the card owns dismissal now - a
   *  correction clears when the learner advances, or after 5s. */
  bottom?: number;
  onDismiss?: () => void;
}) {
  const card = useJobCardOptional();
  const correct = card?.correct;
  // The body carries the actual coaching ("Darnell is a coworker. Look for
  // Maria Delgado."); the title is the "Not that one." framing the card's
  // warning styling already supplies.
  const message = typeof text === "string" ? text : [text.body, text.title].find(Boolean) ?? "";

  useEffect(() => {
    if (!correct || !message) return;
    correct(message);
  }, [correct, message]);

  return null;
}
