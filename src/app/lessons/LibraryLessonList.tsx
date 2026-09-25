"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import { Check, Clock } from "lucide-react";
import type { Lang } from "@/lib/task-types";
import { fill, LIBRARY_COPY, TEACHER_COPY } from "@/lib/lessons/copy";
import { useLibraryDone } from "./LibraryDone";

export type LibraryRow = {
  lessonKey: string;
  title: string;
  minutes: number;
  href: string;
  previewHref?: string;
  /** Search results: the lesson's icon on its topic color. Topic lists show a numbered life ring instead. */
  icon?: ReactNode;
  solid?: string;
  chip?: { label: string; tint: string; deep: string };
};

/** Show the "Not done yet" filter once a topic is long enough to need it. */
const FILTER_AFTER = 6;

const RING =
  "conic-gradient(var(--harbor-ring-red) 0 12.5%, #fff 0 25%, var(--harbor-ring-red) 0 37.5%, #fff 0 50%, var(--harbor-ring-red) 0 62.5%, #fff 0 75%, var(--harbor-ring-red) 0 87.5%, #fff 0)";

function Badge({ row, number, done }: { row: LibraryRow; number: number; done: boolean }) {
  if (row.icon)
    return (
      <span
        className="flex size-16 shrink-0 items-center justify-center rounded-[18px] text-white"
        style={{ background: done ? "var(--harbor-success)" : row.solid }}
        aria-hidden
      >
        {done ? <Check size={30} strokeWidth={2.5} /> : row.icon}
      </span>
    );
  return (
    <span
      className="flex size-16 shrink-0 items-center justify-center rounded-full shadow-[0_0_0_2px_var(--harbor-sand)]"
      style={{ background: done ? "var(--harbor-success)" : RING }}
      aria-hidden
    >
      {done ? (
        <Check size={26} strokeWidth={3} className="text-white" />
      ) : (
        <span className="flex size-10 items-center justify-center rounded-full bg-white text-[21px] font-extrabold shadow-[0_0_0_2px_var(--harbor-sand)]">
          {number}
        </span>
      )}
    </span>
  );
}

function Row({ lang, row, number, done }: { lang: Lang; row: LibraryRow; number: number; done: boolean }) {
  const label = done ? LIBRARY_COPY.again[lang] : LIBRARY_COPY.start[lang];
  return (
    <li
      data-testid={`lesson-card-${row.lessonKey}`}
      className={`flex flex-wrap items-center gap-5 rounded-3xl px-[22px] py-[18px] ${
        done
          ? "bg-harbor-done-bg shadow-[0_0_0_2px_var(--harbor-done-ring)]"
          : "bg-white shadow-[0_0_0_2px_var(--harbor-sand),0_8px_22px_-14px_rgba(20,41,77,.35)]"
      }`}
    >
      <Badge row={row} number={number} done={done} />
      <div className="flex min-w-0 flex-[1_1_240px] flex-col gap-2">
        <h3 className="m-0 text-[22px] leading-tight font-extrabold text-pretty">{row.title}</h3>
        <p className="m-0 flex flex-wrap items-center gap-x-3 gap-y-2 text-[17px] text-harbor-muted">
          {row.chip && (
            <span className="rounded-full px-3.5 py-1 font-extrabold" style={{ background: row.chip.tint, color: row.chip.deep }}>
              {row.chip.label}
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <Clock size={18} aria-hidden />
            {fill(LIBRARY_COPY.minutes[lang], { n: row.minutes })}
          </span>
          {done && (
            <span className="rounded-full bg-harbor-success-tint px-3.5 py-1 font-extrabold text-harbor-success">
              ✓ {LIBRARY_COPY.done[lang]}
            </span>
          )}
        </p>
      </div>
      <div className="flex flex-col items-stretch gap-1">
        <Link
          href={row.href}
          aria-label={`${label}: ${row.title}`}
          className={`inline-flex min-h-15 min-w-[150px] items-center justify-center rounded-full px-[26px] text-[19px] font-extrabold no-underline ${
            done
              ? "border-2 border-harbor-navy bg-white text-harbor-navy hover:bg-[#e4ecf7]"
              : "bg-harbor-signal text-harbor-ink shadow-[0_4px_0_var(--harbor-signal-press)] hover:bg-harbor-signal-hover active:translate-y-1 active:shadow-none motion-reduce:active:translate-y-0"
          }`}
        >
          {label}
        </Link>
        {row.previewHref && (
          <Link
            href={row.previewHref}
            aria-label={`${TEACHER_COPY.previewLink[lang]}: ${row.title}`}
            className="flex min-h-11 items-center justify-center text-[15px] font-bold text-[#1d4f91] hover:text-harbor-ink"
          >
            {TEACHER_COPY.previewLink[lang]}
          </Link>
        )}
      </div>
    </li>
  );
}

/** Lesson rows with their done state. A topic list is numbered and, when long, filterable. */
export function LibraryLessonList({ lang, rows, numbered }: { lang: Lang; rows: LibraryRow[]; numbered: boolean }) {
  const done = useLibraryDone();
  const [filter, setFilter] = useState<"all" | "todo">("all");
  const filterable = numbered && rows.length > FILTER_AFTER && done !== null;
  const shown = rows
    .map((row, i) => ({ row, number: i + 1, isDone: done?.has(row.lessonKey) ?? false }))
    .filter((r) => !filterable || filter === "all" || !r.isDone);
  const List = numbered ? "ol" : "ul";

  const pill = (value: "all" | "todo", text: string) => (
    <button
      type="button"
      aria-pressed={filter === value}
      onClick={() => setFilter(value)}
      className={`min-h-13 cursor-pointer rounded-full border-2 px-[22px] text-[18px] font-extrabold ${
        filter === value ? "border-harbor-navy bg-harbor-navy text-white" : "border-harbor-sand-strong bg-white text-harbor-ink"
      }`}
    >
      {text}
    </button>
  );

  return (
    <>
      {filterable && (
        <div role="group" aria-label={LIBRARY_COPY.show[lang]} className="flex flex-wrap items-center gap-2.5">
          <span className="mr-1 text-[18px] font-bold">{LIBRARY_COPY.show[lang]}</span>
          {pill("all", LIBRARY_COPY.all[lang])}
          {pill("todo", LIBRARY_COPY.notDone[lang])}
        </div>
      )}
      {shown.length > 0 && (
        <List className="m-0 flex list-none flex-col gap-3.5 p-0">
          {shown.map(({ row, number, isDone }) => (
            <Row key={row.lessonKey} lang={lang} row={row} number={number} done={isDone} />
          ))}
        </List>
      )}
      {filterable && shown.length === 0 && (
        <p className="m-0 text-[22px] font-extrabold text-harbor-success">{LIBRARY_COPY.allDoneTopic[lang]}</p>
      )}
    </>
  );
}
