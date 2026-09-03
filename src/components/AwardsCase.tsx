"use client";

import { useMemo, useState } from "react";
import { ACTS, LEVELS, TRACKS, type Track } from "@/lib/tracks-content";
import { SKILLS } from "@/lib/skills";
import { useProgress } from "@/lib/progress-context";
import { SHELF_RESERVE } from "@/components/Shelf";
import type { Localized } from "@/lib/task-types";

const COPY: Localized<{
  title: string;
  empty: string;
  unlocked: (earned: number, total: number) => string;
  keepGoing: string;
  shelfOf: (earned: number, total: number) => string;
  college: string;
  frontDesk: string;
}> = {
  en: {
    title: "Awards",
    empty: "Finish a track to unlock your first trophy.",
    unlocked: (earned, total) => `${earned} of ${total} unlocked`,
    keepGoing: "Keep going. This one unlocks when you finish every task in the track.",
    shelfOf: (earned, total) => `${earned}/${total}`,
    college: "College",
    frontDesk: "Front desk",
  },
  es: {
    title: "Premios",
    empty: "Termina un tramo para desbloquear tu primer trofeo.",
    unlocked: (earned, total) => `${earned} de ${total} desbloqueados`,
    keepGoing: "Sigue. Este se desbloquea cuando termines cada trabajo del tramo.",
    shelfOf: (earned, total) => `${earned}/${total}`,
    college: "Universidad",
    frontDesk: "Recepción",
  },
};

const ACT_SHELF: Record<string, Localized<string>> = {
  act1: { en: "New Hire", es: "Nuevo ingreso" },
  act2: { en: "Shift Lead", es: "Líder de turno" },
  act3: { en: "Shift Supervisor", es: "Supervisor" },
  act4: { en: "Assistant Manager", es: "Gerente asistente" },
  act5: { en: "Bridge", es: "Puente" },
  act6: { en: "Office Administrator", es: "Administración" },
  act7: { en: "Team Lead", es: "Líder de equipo" },
};

type ShelfRow = { label?: string; tracks: Track[] };

function actNumeral(title: string): string {
  return title.match(/^Act ([IVX]+)/)?.[1] ?? title;
}

function pathTrackKeys(side: "a" | "b"): string[] {
  return LEVELS.flatMap((level) => (level.pathTracks ? [level.pathTracks[side]] : []));
}

function shelvesFromActs(lang: "en" | "es"): { key: string; numeral: string; name: string; rows: ShelfRow[] }[] {
  const aKeys = new Set(pathTrackKeys("a"));
  const bKeys = new Set(pathTrackKeys("b"));
  const c = COPY[lang];

  return ACTS.map((act) => {
    const keys: string[] = [];
    for (const levelKey of act.levelKeys) {
      const level = LEVELS.find((l) => l.key === levelKey);
      if (!level) continue;
      for (const trackKey of level.trackKeys) {
        if (!keys.includes(trackKey)) keys.push(trackKey);
      }
    }
    const tracks = keys
      .map((key) => TRACKS.find((track) => track.key === key))
      .filter((track): track is Track => Boolean(track));

    const rows: ShelfRow[] =
      act.key === "act5"
        ? [
            { label: c.college, tracks: tracks.filter((track) => aKeys.has(track.key)) },
            { label: c.frontDesk, tracks: tracks.filter((track) => bKeys.has(track.key)) },
          ].filter((row) => row.tracks.length > 0)
        : [{ tracks }];

    return {
      key: act.key,
      numeral: actNumeral(act.title),
      name: ACT_SHELF[act.key]?.[lang] ?? act.title,
      rows,
    };
  }).filter((shelf) => shelf.rows.some((row) => row.tracks.length > 0));
}

function TrophyButton({
  track,
  unlocked,
  selected,
  onSelect,
}: {
  track: Track;
  unlocked: boolean;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      role="option"
      aria-selected={selected}
      aria-label={track.title}
      onClick={onSelect}
      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-[22px] leading-none cursor-pointer ${
        selected ? "bg-white/16 ring-2 ring-[#8ec0ff]" : "hover:bg-white/8"
      }`}
    >
      <span className={unlocked ? "" : "opacity-25 grayscale"} aria-hidden>
        {track.awardEmoji}
      </span>
    </button>
  );
}

export default function AwardsCase({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { certificateTrackKeys, lang } = useProgress();
  const earned = useMemo(() => new Set(certificateTrackKeys), [certificateTrackKeys]);
  const shelves = useMemo(() => shelvesFromActs(lang), [lang]);
  const fallbackKey = certificateTrackKeys[certificateTrackKeys.length - 1] ?? TRACKS[0].key;
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const activeKey = selectedKey ?? fallbackKey;
  const c = COPY[lang];

  if (!open) return null;

  const selected = TRACKS.find((t) => t.key === activeKey) ?? TRACKS[0];
  const selectedEarned = earned.has(selected.key);
  const earnedCount = TRACKS.filter((t) => earned.has(t.key)).length;

  return (
    <>
      <div
        aria-hidden
        onClick={() => onOpenChange(false)}
        className="fixed inset-x-0 top-0 z-[74] bg-black/50"
        style={{ bottom: SHELF_RESERVE }}
      />
      <div
        className="fixed inset-x-0 top-0 z-[75] flex items-start justify-center px-3 pt-6 pb-3"
        style={{ bottom: SHELF_RESERVE }}
        onClick={() => onOpenChange(false)}
      >
        <div
          role="dialog"
          aria-labelledby="awards-case-title"
          className="mb-auto flex max-h-full w-full max-w-[480px] flex-col overflow-hidden rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.45)] animate-fade-up"
          style={{ background: "#1c1410", color: "#f3e6d4" }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex shrink-0 items-start justify-between px-5 pt-5 pb-3">
            <div>
              <h2 id="awards-case-title" className="text-[22px] font-medium leading-tight text-white">
                {c.title}
              </h2>
              <p className="mt-1 text-[13px] text-[#d4b896]">
                {earnedCount === 0 ? c.empty : c.unlocked(earnedCount, TRACKS.length)}
              </p>
            </div>
            <button
              onClick={() => onOpenChange(false)}
              aria-label="Close"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[16px] text-[#d4b896] hover:bg-white/10 cursor-pointer"
            >
              ✕
            </button>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-3">
            <div className="flex flex-col gap-3 rounded-xl px-3 py-3" style={{ background: "#241810" }}>
              {shelves.map((shelf) => {
                const shelfTracks = shelf.rows.flatMap((row) => row.tracks);
                const shelfEarned = shelfTracks.filter((track) => earned.has(track.key)).length;
                return (
                  <section key={shelf.key} aria-label={`${shelf.numeral} ${shelf.name}`}>
                    <div className="mb-1.5 flex items-baseline justify-between gap-2">
                      <p className="min-w-0 truncate text-[11px] font-medium tracking-wide">
                        <span className="text-[#c9a227]">{shelf.numeral}</span>
                        <span className="text-[#d4b896]"> · {shelf.name}</span>
                      </p>
                      <p className="shrink-0 text-[11px] tabular-nums text-[#d4b896]/70">
                        {c.shelfOf(shelfEarned, shelfTracks.length)}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2">
                      {shelf.rows.map((row, index) => (
                        <div key={row.label ?? String(index)} className="flex items-center gap-2">
                          {row.label ? (
                            <p className="w-[4.75rem] shrink-0 text-[10px] font-medium leading-tight text-[#d4b896]/80">
                              {row.label}
                            </p>
                          ) : null}
                          <div
                            role="listbox"
                            aria-label={row.label ?? shelf.name}
                            className="flex min-w-0 flex-wrap items-center gap-1 border-b-2 border-[#c9a227] pb-1.5"
                          >
                            {row.tracks.map((track) => (
                              <TrophyButton
                                key={track.key}
                                track={track}
                                unlocked={earned.has(track.key)}
                                selected={activeKey === track.key}
                                onSelect={() => setSelectedKey(track.key)}
                              />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                );
              })}
            </div>
          </div>

          <div className="shrink-0 border-t border-white/8 px-5 py-4">
            <div className="flex items-start gap-3">
              <span
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/8 text-[26px] leading-none ${
                  selectedEarned ? "" : "opacity-35 grayscale"
                }`}
                aria-hidden
              >
                {selected.awardEmoji}
              </span>
              <div className="min-w-0">
                <h3 className="text-[17px] font-medium text-white">{selected.title}</h3>
                <p className="mt-0.5 text-[13px] leading-relaxed text-[#d4b896]">{selected.subtitle}</p>
              </div>
            </div>
            {selectedEarned ? (
              <ul className="mt-3 flex flex-col gap-1.5">
                {selected.taskKeys.map((taskKey) => (
                  <li key={taskKey} className="flex items-start gap-2 text-[13px] leading-snug text-[#f3e6d4]">
                    <span className="mt-0.5 text-[#c9a227]" aria-hidden>
                      ★
                    </span>
                    {SKILLS[taskKey]}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-[13px] leading-relaxed text-white/45">{c.keepGoing}</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
