"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { speakText } from "@/lib/read-aloud";
import type { Lang } from "@/lib/task-types";
import { parseAttempt } from "@/lib/lessons/attempts";
import { fill, LIBRARY_COPY } from "@/lib/lessons/copy";

/** Finished lesson keys, or null until known. The page renders "not done" until then, and without JavaScript. */
const DoneContext = createContext<ReadonlySet<string> | null>(null);
export const useLibraryDone = () => useContext(DoneContext);

function localDone(key: string, owner: string) {
  try {
    return (parseAttempt(JSON.parse(localStorage.getItem(`lesson-attempt:${key}:${owner}`) || "null"))?.attempts ?? 0) > 0;
  } catch {
    return false;
  }
}

/** Reads what lessons save (`useLessonSave`): the account's finishes, or this browser's for a guest. */
export function LibraryDoneProvider({ lessonKeys, children }: { lessonKeys: string[]; children: ReactNode }) {
  const [done, setDone] = useState<ReadonlySet<string> | null>(null);

  // Syncs with the server session and localStorage, both external.
  useEffect(() => {
    let live = true;
    (async () => {
      let owner = "guest";
      let server: string[] = [];
      try {
        const r = await fetch("/api/lessons", { cache: "no-store" });
        const data = r.ok ? await r.json() : null;
        if (data?.signedIn && typeof data.owner === "string") {
          owner = data.owner;
          server = Array.isArray(data.done) ? data.done : [];
        }
      } catch {
        /* Offline: show this browser's guest finishes. */
      }
      if (!live) return;
      // An account's unsent finishes wait in localStorage under its owner key.
      setDone(new Set([...server, ...lessonKeys.filter((k) => localDone(k, owner))]));
    })();
    return () => {
      live = false;
    };
  }, [lessonKeys]);

  return <DoneContext.Provider value={done}>{children}</DoneContext.Provider>;
}

/** "3 lessons", or once any are finished, "1 of 3 done", with a bar. */
export function TopicProgress({
  lang,
  lessonKeys,
  solid,
  deep,
  size,
}: {
  lang: Lang;
  lessonKeys: string[];
  solid: string;
  deep?: string;
  size: "tile" | "hero";
}) {
  const done = useLibraryDone();
  const n = lessonKeys.length;
  const d = done ? lessonKeys.filter((k) => done.has(k)).length : 0;
  const text = d
    ? fill(LIBRARY_COPY.progress[lang], { d, n })
    : n === 1
      ? LIBRARY_COPY.oneLesson[lang]
      : fill(LIBRARY_COPY.lessons[lang], { n });
  const bar = (
    <span
      className={`block overflow-hidden rounded-md bg-white ${size === "tile" ? "h-2.5 w-full" : "h-3 w-full max-w-60 flex-[0_1_240px]"}`}
      aria-hidden
    >
      <span className="block h-full rounded-md" style={{ width: `${n ? Math.round((d / n) * 100) : 0}%`, background: solid }} />
    </span>
  );
  if (size === "tile")
    return (
      <span className="mt-auto flex w-full flex-col gap-2">
        <span className="text-[18px] font-bold" style={{ color: deep }}>
          {text}
        </span>
        {bar}
      </span>
    );
  return (
    <div className="flex flex-wrap items-center gap-3.5">
      {bar}
      <span className="text-[19px] font-bold">{text}</span>
    </div>
  );
}

export function ListenButton({ lang, text, children }: { lang: Lang; text: string; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={() => speakText(text, lang)}
      className="flex min-h-13 cursor-pointer items-center gap-2 rounded-full border-2 border-white/50 bg-transparent px-5 text-[17px] font-bold text-white hover:bg-white/12"
    >
      {children}
    </button>
  );
}
