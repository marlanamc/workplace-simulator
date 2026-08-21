import { useEffect, useRef, useState } from "react";

/** Shows a short-lived coaching toast, auto-dismissed after `durationMs`. */
export function useNudge(durationMs = 5000) {
  const [nudge, setNudge] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const say = (msg: string) => {
    setNudge(msg);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setNudge(""), durationMs);
  };

  return { nudge, say };
}
