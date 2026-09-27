"use client";

import { useState } from "react";
import type { Lang } from "@/lib/task-types";
import { useLesson } from "@/lib/lesson-context";

const CHIP =
  "min-h-[32px] rounded-full border border-[#dadce0] px-3 text-[12px] text-[#0b57d0] hover:bg-[#f2f6fc] cursor-pointer";
const CHIP_MULTILINE =
  "min-h-[32px] rounded-lg border border-[#dadce0] px-3 py-1.5 text-left text-[12px] leading-snug whitespace-pre-line text-[#0b57d0] hover:bg-[#f2f6fc] cursor-pointer";

/** Sentence starters stay one click away so the compose box looks like the real app. */
export default function NeedAStart({
  lang,
  starters,
  onPick,
  chipClassName = CHIP,
  missed,
}: {
  lang: Lang;
  starters: string[];
  onPick: (starter: string) => void;
  chipClassName?: string;
  /**
   * Whether the learner has already had a send rejected. A task that passes
   * it gets the lesson rule: "On my own" keeps the starters out of sight
   * until the first miss, so the first try is the learner's own words.
   * Story mode, Guided lessons, and tasks that omit it are unchanged.
   */
  missed?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const lesson = useLesson();
  if (lesson?.mode === "independent" && missed === false) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="min-h-[32px] text-[12px] text-[#5f6368] underline decoration-[#dadce0] underline-offset-4 hover:text-[#0b57d0] cursor-pointer"
      >
        {lang === "en" ? "Need help writing?" : "¿Necesitas ayuda para escribir?"}
      </button>
      {open
        ? starters.map((s, i) => (
            <button
              key={i}
              type="button"
              onClick={() => onPick(s)}
              className={s.includes("\n") && chipClassName === CHIP ? CHIP_MULTILINE : chipClassName}
            >
              {s}
            </button>
          ))
        : null}
    </div>
  );
}
