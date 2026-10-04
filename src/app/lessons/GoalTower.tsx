"use client";

import { Check } from "lucide-react";
import type { TaskKey } from "@/lib/desktop-content";
import { TASK_ICONS } from "@/lib/icons";
import { fill, LIBRARY_COPY } from "@/lib/lessons/copy";
import { TOPIC_COLORS, type TopicColors } from "@/lib/lessons/skills";
import type { Lang } from "@/lib/task-types";
import { useLibraryDone } from "./LibraryDone";

export type TowerPiece = { taskKey: TaskKey; label: string; colors: TopicColors };

const W = 280;
const H = 64;
const GAP = 4;
const KNOB = 13;

/** One piece: a slot cut into the top unless it is first, a tab below unless it is last. */
function piecePath(slot: boolean, tab: boolean) {
  const cx = W / 2, k = KNOB * 2.1;
  const top = slot ? `M0 0 H${cx - KNOB} C${cx - k} ${k}, ${cx + k} ${k}, ${cx + KNOB} 0 H${W}` : `M0 0 H${W}`;
  const bottom = tab ? `H${cx + KNOB} C${cx + k} ${H + k}, ${cx - k} ${H + k}, ${cx - KNOB} ${H} H0 Z` : `H0 Z`;
  return `${top} V${H} ${bottom}`;
}

/**
 * A goal's lessons as a stack of puzzle pieces, one per lesson. Finished pieces fill with their
 * topic color, the first unfinished one is outlined, the rest are dashed. Decorative: the text
 * alternative is the sr-only line.
 */
export function GoalTower({ lang, pieces }: { lang: Lang; pieces: TowerPiece[] }) {
  const done = useLibraryDone();
  const isDone = (p: TowerPiece) => done?.has(p.taskKey) ?? false;
  const next = pieces.findIndex((p) => !isDone(p));
  const d = pieces.filter(isDone).length;
  const progress = d ? fill(LIBRARY_COPY.progress[lang], { d, n: pieces.length }) : fill(LIBRARY_COPY.lessons[lang], { n: pieces.length });
  const height = pieces.length * (H + GAP) - GAP + 24;

  return (
    <>
      <span className="sr-only">{`${progress}: ${pieces.map((p) => p.label).join(", ")}`}</span>
      <svg viewBox={`-2 -2 ${W + 4} ${height}`} className="block h-auto w-full" aria-hidden>
        {pieces.map((p, i) => {
          const Icon = TASK_ICONS[p.taskKey];
          const state = isDone(p) ? "done" : i === next ? "next" : "todo";
          const on = p.colors === TOPIC_COLORS.yellow ? "#14294d" : "#ffffff";
          const fg = state === "done" ? on : p.colors.deep;
          return (
            <g key={p.taskKey} transform={`translate(0 ${i * (H + GAP)})`} data-piece={state}>
              <path
                d={piecePath(i > 0, i < pieces.length - 1)}
                fill={state === "done" ? p.colors.solid : state === "next" ? p.colors.tint : "#ffffff"}
                stroke={state === "todo" ? "#b9c1d0" : p.colors.solid}
                strokeWidth={state === "next" ? 3 : 2}
                strokeDasharray={state === "todo" ? "6 5" : undefined}
                strokeLinejoin="round"
              />
              <Icon x={18} y={H / 2 - 10} size={28} color={fg} strokeWidth={2.2} />
              <text x={60} y={H / 2 + 11} fontSize={19} fontWeight={700} fill={fg}>
                {p.label}
              </text>
              {state === "done" && (
                <>
                  <circle cx={W - 30} cy={H / 2 + 4} r={12} fill="#ffffff" />
                  <Check x={W - 38} y={H / 2 - 4} size={16} color="#14294d" strokeWidth={3.2} />
                </>
              )}
            </g>
          );
        })}
      </svg>
    </>
  );
}
