"use client";

import { useState } from "react";
import type { Lang } from "@/lib/task-types";

const CHIP =
  "min-h-[32px] rounded-full border border-[#dadce0] px-3 text-[12px] text-[#0b57d0] hover:bg-[#f2f6fc] cursor-pointer";

/** Sentence starters stay one click away so the compose box looks like the real app. */
export default function NeedAStart({
  lang,
  starters,
  onPick,
  chipClassName = CHIP,
}: {
  lang: Lang;
  starters: string[];
  onPick: (starter: string) => void;
  chipClassName?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="min-h-[32px] text-[12px] text-[#5f6368] underline decoration-[#dadce0] underline-offset-4 hover:text-[#0b57d0] cursor-pointer"
      >
        {lang === "en" ? "Need a start?" : "¿Necesitas una frase?"}
      </button>
      {open
        ? starters.map((s, i) => (
            <button key={i} type="button" onClick={() => onPick(s)} className={chipClassName}>
              {s}
            </button>
          ))
        : null}
    </div>
  );
}
