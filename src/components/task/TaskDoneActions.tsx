"use client";

import { useEffect, useRef } from "react";
import { useJobCardOptional, useReporterId } from "@/lib/job-card-context";

/**
 * The finish is now one green Job Card header and one button, so there is no
 * three-way choice to render here any more. This reports the finish to the
 * card and renders nothing.
 *
 * "Do it again" survives as the card's quiet secondary; "back to desktop" is
 * what the card's own primary button already does.
 */
export default function TaskDoneActions({
  kicker,
  onTryAgain,
}: {
  /** Kept for call-site compatibility. */
  tryAgainLabel?: string;
  backToDeskLabel?: string;
  /** Short past-tense line for the card header, e.g. "Thank-you sent". */
  kicker?: string;
  onTryAgain: () => void;
}) {
  const card = useJobCardOptional();
  const id = useReporterId();
  const reportFinish = card?.reportFinish;

  // Tasks rebuild `onTryAgain` every render. Reporting through a ref keeps the
  // card pointed at the latest one without re-reporting the finish each time.
  const tryAgain = useRef(onTryAgain);
  useEffect(() => {
    tryAgain.current = onTryAgain;
  });

  useEffect(() => {
    if (!reportFinish) return;
    reportFinish({ id, kicker: kicker ?? "Done", onTryAgain: () => tryAgain.current() });
    return () => reportFinish(null, id);
  }, [reportFinish, id, kicker]);

  return null;
}
