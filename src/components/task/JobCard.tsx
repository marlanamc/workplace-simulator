"use client";

import { useCallback, useRef, useState } from "react";
import { AlertCircle, Check, ChevronDown, ChevronUp, MapPin, Shrink, Volume2 } from "lucide-react";
import { useProgress } from "@/lib/progress-context";
import { useWindowManager } from "@/lib/window-manager";
import { useJobCard } from "@/lib/job-card-context";
import {
  INTRO_BEATS,
  LIST_INTRO,
  LIST_INTRO_FLAG,
  JOB_CARD_COPY,
  JOB_CARD_DONE_LINE,
  JOB_CARD_LINE,
  shouldShowListIntro,
} from "@/lib/job-card-content";
import {
  TASK_INFO,
  TASK_LOCATIONS,
  actForLevel,
  findTrackForTask,
  levelForTrack,
  nextTaskInTrack,
  taskKeysForLevel,
} from "@/lib/tracks-content";
import { BRIDGE_PATH_FLAG, needsBridgePicker, pathIsComplete } from "@/lib/bridge-path";
import type { TaskKey } from "@/lib/desktop-content";
import { HANDOFF_CTA } from "@/lib/story-beats";
import { dayLabel } from "@/lib/shift-spine";
import { SHELF_RESERVE } from "@/components/Shelf";
import { speakText } from "@/lib/read-aloud";

/** Four parking spots. The card can never end up half off-screen. */
type Corner = "bl" | "br" | "tl" | "tr";
const HOME: Corner = "bl";
const EDGE = 24;
/** 48px shelf + 24px of air, so the card never sits on the shelf. */
const BOTTOM = SHELF_RESERVE + EDGE;
const CARD_W = 420;

const TONE = { blue: "#0b57d0", green: "#1e8e3e" } as const;
type Tone = keyof typeof TONE;

interface Script {
  badge: string;
  kicker: string;
  line: string;
  tone: Tone;
  /** Index into the four progress bars; -1 hides them. */
  step: number;
  primaryLabel?: string;
  onPrimary?: () => void;
  /** Show the "Show me" + speaker row (only while mid-job, and only while
   *  the act still offers pointing). */
  help?: boolean;
  secondaryLabel?: string;
  onSecondary?: () => void;
  /** Two peer doors — both buttons use the same weight. */
  equalPair?: boolean;
  primaryTestId?: string;
  secondaryTestId?: string;
}

/**
 * The Job Card: the only thing in this product that tells a learner what to
 * do. It sits above the app windows on every screen, absorbs error coaching
 * (corrections render inside it, never as a floating toast), and replaces the
 * per-task finish screen with one green header and one button.
 *
 * Everything it says is derived — from `useProgress` (which job), from
 * `useWindowManager` (which surface is showing), and from whatever the
 * running task reported through `JobCardProvider`. It owns no job state of
 * its own; only its corner.
 */
export default function JobCard() {
  const { lang, completedTaskKeys, currentTrack, displayName, celebrateLevel, celebrateTrack, storyFlags, setStoryFlag, bridgePath } =
    useProgress();
  const { active, openApp, minimizeActive } = useWindowManager();
  const {
    step,
    finish,
    correction,
    clearCorrection,
    toggleShowMe,
    pressPrimary,
    pressHelp,
    help,
    introBeat,
    advanceIntro,
  } = useJobCard();

  const c = JOB_CARD_COPY[lang];
  const level = levelForTrack(currentTrack.key);
  const act = actForLevel(level)?.key ?? "act1";

  const [corner, setCorner] = useState<Corner>(HOME);
  const [collapsed, setCollapsed] = useState(false);
  const [heardVoice, setHeardVoice] = useState("");
  const [drag, setDrag] = useState<{ x: number; y: number } | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const nextTaskKey = nextTaskInTrack(currentTrack, completedTaskKeys);
  const levelTaskKeys = taskKeysForLevel(level, bridgePath);
  const doneInLevel = levelTaskKeys.filter((k) => completedTaskKeys.includes(k)).length;
  const jobNumber = Math.min(doneInLevel + 1, levelTaskKeys.length);

  // When the job changes: the card goes home, so a job always begins in the
  // same corner and the learner never has to hunt for it; and the job they
  // moved *off* is remembered. Completing a job advances `currentTrack`
  // immediately while the finish is reported a render later, so without this
  // the finish would talk about the day starting, not the one just ended.
  // Adjusted during render, the pattern this codebase already uses.
  const [jobShown, setJobShown] = useState(nextTaskKey);
  const [finishedTaskKey, setFinishedTaskKey] = useState<TaskKey | null>(null);
  if (jobShown !== nextTaskKey) {
    setFinishedTaskKey(jobShown);
    setJobShown(nextTaskKey);
    setCorner(HOME);
    setCollapsed(false);
  }

  const script = buildScript();
  // A new sentence or a correction is the card talking again — open it so
  // the learner cannot miss the line they just hid.
  const voice = `${script.line}\0${correction}\0${help?.lesson.t ?? ""}`;
  if (heardVoice !== voice) {
    setHeardVoice(voice);
    setCollapsed(false);
  }

  // ─── dragging ────────────────────────────────────────────────────────────
  const startDrag = useCallback((e: React.PointerEvent) => {
    if (e.button !== 0) return;
    const card = cardRef.current;
    if (!card) return;
    const box = card.getBoundingClientRect();
    const grabX = e.clientX - box.left;
    const grabY = e.clientY - box.top;
    const maxX = window.innerWidth - box.width;
    const maxY = window.innerHeight - box.height;
    const clamp = (v: number, hi: number) => Math.max(0, Math.min(hi, v));
    let last: { x: number; y: number } | null = null;

    const move = (ev: PointerEvent) => {
      last = { x: clamp(ev.clientX - grabX, maxX), y: clamp(ev.clientY - grabY, maxY) };
      setDrag(last);
    };
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      setDrag(null);
      // A tap on the collapsed bar (no drag) opens it again — same as the
      // chevron, so they do not have to hunt for a small button.
      if (!last) {
        setCollapsed((v) => (v ? false : v));
        return;
      }
      const cx = last.x + box.width / 2;
      const cy = last.y + box.height / 2;
      setCorner(
        ((cy < window.innerHeight / 2 ? "t" : "b") +
          (cx < window.innerWidth / 2 ? "l" : "r")) as Corner,
      );
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    e.preventDefault();
  }, []);

  const nudgeCorner = (e: React.KeyboardEvent) => {
    const set = (next: Corner) => {
      e.preventDefault();
      setCorner(next);
    };
    if (e.key === "ArrowLeft") set((corner[0] + "l") as Corner);
    else if (e.key === "ArrowRight") set((corner[0] + "r") as Corner);
    else if (e.key === "ArrowUp") set(("t" + corner[1]) as Corner);
    else if (e.key === "ArrowDown") set(("b" + corner[1]) as Corner);
  };

  // ─── the one instruction, derived from state ─────────────────────────────
  function buildScript(): Script {
    // First run: three beats, one sentence each. The last one has no
    // button — they advance by shrinking the card, which is the point.
    if (introBeat < INTRO_BEATS.length) {
      const beat = INTRO_BEATS[introBeat];
      const name = displayName.trim() || (lang === "en" ? "friend" : "amiga");
      return {
        badge: String(introBeat + 1),
        kicker: beat.kicker[lang],
        line: beat.line[lang].replace("{name}", name),
        tone: "blue",
        step: -1,
        primaryLabel: beat.tryCollapse ? undefined : beat.cta?.[lang],
        onPrimary: beat.tryCollapse ? undefined : advanceIntro,
      };
    }

    // Day One, once: point at the orange shelf pin. The walkthrough kept it
    // locked; this is the first sitting where the list of jobs is real.
    if (
      shouldShowListIntro({
        storyFlags,
        completedTaskKeys,
        levelKey: level.key,
        celebrating: false,
      })
    ) {
      return {
        badge: "1",
        kicker: LIST_INTRO.kicker[lang],
        line: LIST_INTRO.line[lang],
        tone: "blue",
        step: -1,
        primaryLabel: LIST_INTRO.cta[lang],
        onPrimary: () => setStoryFlag(LIST_INTRO_FLAG, "true"),
      };
    }

    // Finished a job. One green header, one button — no done screen, no
    // three-way choice, and the skill badge is banked silently.
    //
    // Only while the app is still on screen: task windows stay mounted when
    // minimized, so a finished-but-hidden job would otherwise keep the card
    // green after the learner is already back on the desktop for the next one.
    if (finish && active !== null) {
      const justFinished = finishedTaskKey;
      const finishedTrack = justFinished ? findTrackForTask(justFinished) : undefined;
      // The day the learner just finished, not the one they are moving into.
      const finishedLevelKeys = finishedTrack
        ? taskKeysForLevel(levelForTrack(finishedTrack.key), bridgePath)
        : levelTaskKeys;
      const remaining = finishedLevelKeys.filter((k) => !completedTaskKeys.includes(k)).length;
      const levelFinished = remaining === 0;
      const doneLine = justFinished ? JOB_CARD_DONE_LINE[justFinished]?.[lang] : undefined;
      return {
        badge: "✓",
        kicker: finish.kicker ?? c.doneKicker,
        tone: "green",
        step: 4,
        line:
          doneLine ??
          (levelFinished
            ? c.dayDoneLine
            : remaining === 1
              ? c.oneJobLeft
              : c.jobsLeft(remaining)),
        primaryLabel: levelFinished ? c.startTomorrow : c.nextJob,
        onPrimary: minimizeActive,
        secondaryLabel: finish.onTryAgain ? c.doItAgain : undefined,
        onSecondary: finish.onTryAgain,
      };
    }

    // "Day 3 of 5 · Task 2 of 3". The day comes first because it stays put
    // while the counter resets — without it, restarting at 1 every day looks
    // like the game losing its place. The task name lives in the body, not
    // here: the header is a tight bar and a third clause always truncates.
    // `jobOf` returns "" on a one-task day, so orientation is just the name.
    const kicker = nextTaskKey
      ? [dayLabel(level, lang), c.jobOf(jobNumber, levelTaskKeys.length)].filter(Boolean).join(" · ")
      : c.dayDoneKicker;
    const badge = nextTaskKey ? String(jobNumber) : "✓";

    // Nothing open: the card sets the job up and its button opens the thing
    // it names. This is what the desktop briefing used to do.
    if (active === null || !step) {
      if (!nextTaskKey) {
        const picker = needsBridgePicker(completedTaskKeys, storyFlags[BRIDGE_PATH_FLAG]);
        if (picker === "choose") {
          return {
            badge: "→",
            kicker: c.pickDoorKicker,
            line: c.pickDoorLine,
            tone: "blue",
            step: 0,
            primaryLabel: c.pickCollege,
            onPrimary: () => {
              setStoryFlag(BRIDGE_PATH_FLAG, "a");
              openApp("browser");
            },
            secondaryLabel: c.pickFrontDesk,
            onSecondary: () => {
              setStoryFlag(BRIDGE_PATH_FLAG, "b");
              openApp("browser");
            },
            equalPair: true,
          };
        }
        if (picker === "other") {
          const offerA = !pathIsComplete("a", completedTaskKeys);
          return {
            badge: "→",
            kicker: c.otherDoorKicker,
            line: c.otherDoorLine,
            tone: "blue",
            step: 4,
            primaryLabel: offerA ? c.tryCollege : c.tryFrontDesk,
            onPrimary: () => {
              setStoryFlag(BRIDGE_PATH_FLAG, offerA ? "a" : "b");
              openApp("browser");
            },
          };
        }
        return { badge: "✓", kicker: c.dayDoneKicker, line: c.allDoneLine, tone: "green", step: 4 };
      }
      const location = TASK_LOCATIONS[nextTaskKey];
      const desktopLine =
        JOB_CARD_LINE[nextTaskKey]?.[lang] ?? TASK_INFO[nextTaskKey].dispatch[lang];
      if (!location) {
        return { badge, kicker, line: c.comingSoonLine, tone: "blue", step: 0 };
      }
      const otherDoor =
        nextTaskKey === "office-drive"
          ? needsBridgePicker(completedTaskKeys, storyFlags[BRIDGE_PATH_FLAG])
          : null;
      const offerA = !pathIsComplete("a", completedTaskKeys);
      return {
        badge,
        kicker,
        line: desktopLine,
        tone: "blue",
        step: 0,
        primaryLabel: HANDOFF_CTA[nextTaskKey]?.[lang] ?? location.ctaLabel,
        onPrimary: () =>
          openApp(location.appKey, { tab: location.tab, section: location.section }),
        primaryTestId: nextTaskKey === "office-drive" ? "job-card-hq-start" : undefined,
        secondaryLabel: otherDoor === "other" ? (offerA ? c.tryCollege : c.tryFrontDesk) : undefined,
        onSecondary:
          otherDoor === "other"
            ? () => {
                setStoryFlag(BRIDGE_PATH_FLAG, offerA ? "a" : "b");
                openApp("browser");
              }
            : undefined,
        secondaryTestId: otherDoor === "other" ? "job-card-hq-other" : undefined,
      };
    }

    // Mid-job. Guidance loosens by act: Act I spells out every click, Act II
    // keeps the goal on screen but offers Show me only once it's needed, and
    // Act III says the title and gets out of the way.
    const helpOffered =
      act === "act1" ? step.canShowMe : act === "act2" ? step.canShowMe && Boolean(correction) : false;
    // Act I spells out the click. From Act II on the card states the goal and
    // lets the learner work out the clicks, which is the whole point of the
    // ladder: the scaffolding comes down as they stop needing it.
    const goalLine = nextTaskKey
      ? (JOB_CARD_LINE[nextTaskKey]?.[lang] ?? TASK_INFO[nextTaskKey].label[lang])
      : step.line[lang];
    const midLine = act === "act1" ? step.line[lang] : goalLine;

    return {
      badge,
      kicker,
      line: midLine,
      tone: "blue",
      help: helpOffered,
      // A step that advances from the card, not from a click in the app.
      primaryLabel: step.primaryLabel,
      onPrimary: step.primaryLabel ? pressPrimary : undefined,
      // Four bars for a job of any length: the task's own step count is
      // mapped onto them so the shape never changes between jobs.
      step: Math.min(3, Math.round((step.stepIndex / Math.max(1, step.stepCount - 1)) * 3)),
    };
  }

  const tone = TONE[script.tone];

  // A celebration owns the whole screen for a moment. The card stepping back
  // is the same rule as everywhere else: one voice at a time, and right now
  // the level screen is the one talking.
  if (celebrateLevel?.levelUp || celebrateTrack) return null;

  const position: React.CSSProperties = drag
    ? {
        left: drag.x,
        top: drag.y,
        boxShadow: "0 28px 64px rgba(0,0,0,0.42)",
        transform: "scale(1.01)",
      }
    : {
        [corner[1] === "l" ? "left" : "right"]: EDGE,
        [corner[0] === "t" ? "top" : "bottom"]: corner[0] === "t" ? EDGE : BOTTOM,
        transition: "left 0.22s ease-out, right 0.22s ease-out, top 0.22s ease-out, bottom 0.22s ease-out",
        boxShadow: "0 18px 48px rgba(0,0,0,0.34)",
      };

  return (
    <div
      ref={cardRef}
      data-job-card
      className="animate-card-pop fixed z-[72] overflow-hidden rounded-[24px] bg-white"
      style={{ width: CARD_W, maxWidth: "calc(100vw - 32px)", touchAction: "none", ...position }}
    >
      <div
        onPointerDown={startDrag}
        onKeyDown={nudgeCorner}
        tabIndex={0}
        role="button"
        aria-label={c.dragHint}
        title={c.dragHint}
        className="flex items-center gap-2.5 px-5 py-3 text-white"
        style={{ background: tone, cursor: drag ? "grabbing" : "grab" }}
      >
        <span
          className="flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full text-[14px] font-bold"
          style={{ background: "rgba(255,255,255,0.22)" }}
          aria-hidden
        >
          {script.badge === "✓" ? <Check size={15} strokeWidth={3} /> : script.badge}
        </span>
        <span className="min-w-0 flex-1 truncate text-[15px] font-medium">
          {help && !finish ? help.kicker : script.kicker}
        </span>
        {step?.canHelp && active !== null && !finish && introBeat >= INTRO_BEATS.length && (
          <button
            type="button"
            data-testid="job-card-help"
            aria-label={help ? c.hideHelp : c.help}
            aria-pressed={Boolean(help)}
            title={help ? c.hideHelp : c.help}
            onPointerDown={(e) => e.stopPropagation()}
            onClick={pressHelp}
            className={`flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-full text-[13px] font-bold${
              step?.pulseHelp && !help ? " animate-showme-pulse-compact" : ""
            }`}
            style={{
              background: help ? "#fff" : "rgba(255,255,255,0.18)",
              color: help ? tone : "#fff",
            }}
          >
            ?
          </button>
        )}
        {corner !== HOME && (
          <button
            type="button"
            onClick={() => setCorner(HOME)}
            aria-label={c.snapBack}
            title={c.snapBack}
            className="flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-full text-white"
            style={{ background: "rgba(255,255,255,0.18)" }}
          >
            <Shrink size={15} strokeWidth={2.25} aria-hidden />
          </button>
        )}
        <button
          type="button"
          data-testid="job-card-collapse"
          aria-expanded={!collapsed}
          aria-label={collapsed ? c.expand : c.collapse}
          title={collapsed ? c.expand : c.collapse}
          onPointerDown={(e) => e.stopPropagation()}
          onClick={() => {
            const shrinking = !collapsed;
            setCollapsed(shrinking);
            // Let them see it shrink, then the next line opens it again —
            // that is the whole lesson: hide it, and it comes back.
            if (shrinking && INTRO_BEATS[introBeat]?.tryCollapse) {
              window.setTimeout(advanceIntro, 550);
            }
          }}
          className={`flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-full text-white${
            INTRO_BEATS[introBeat]?.tryCollapse && !collapsed ? " animate-showme-pulse-compact" : ""
          }`}
          style={{ background: "rgba(255,255,255,0.18)" }}
        >
          {collapsed ? (
            <ChevronUp size={16} strokeWidth={2.5} aria-hidden />
          ) : (
            <ChevronDown size={16} strokeWidth={2.5} aria-hidden />
          )}
        </button>
        <span className="flex shrink-0 gap-[3px] opacity-75" aria-hidden>
          {[0, 1].map((col) => (
            <span key={col} className="flex flex-col gap-[3px]">
              {[0, 1, 2].map((row) => (
                <span key={row} className="h-[3px] w-[3px] rounded-full bg-white" />
              ))}
            </span>
          ))}
        </span>
      </div>

      {!collapsed && (
      <div className="p-5">
        {help && !finish ? (
          <>
            <p
              role="status"
              aria-live="polite"
              className="m-0 text-[22px] font-medium leading-[1.2] tracking-[-0.01em] text-[#202124]"
            >
              {help.lesson.t}
            </p>
            <ol className="mt-3.5 m-0 flex list-none flex-col gap-2 p-0">
              {help.lesson.s.map((text, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span
                    className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[13px] font-semibold text-white"
                    style={{ background: TONE.blue }}
                    aria-hidden
                  >
                    {i + 1}
                  </span>
                  <span className="text-[16px] font-medium leading-[1.35] text-[#3c4043]">{text}</span>
                </li>
              ))}
            </ol>
            <p className="mt-3.5 mb-0 rounded-[14px] bg-[#f1f3f4] px-3.5 py-3 text-[15px] leading-[1.35] text-[#3c4043]">
              <span className="font-semibold text-[#202124]">{help.tipLabel}: </span>
              {help.lesson.tip}
            </p>
            <button
              type="button"
              onClick={help.onClose}
              className="mt-[18px] flex min-h-[64px] w-full cursor-pointer items-center justify-center rounded-[16px] text-[20px] font-medium text-white"
              style={{ background: tone }}
            >
              {help.gotItLabel}
            </button>
          </>
        ) : (
          <>
        <p
          role="status"
          aria-live="polite"
          className="m-0 text-[27px] font-medium leading-[1.2] tracking-[-0.01em] text-[#202124]"
        >
          {script.line}
        </p>

        {correction && (
          <div
            role="status"
            aria-live="polite"
            className="mt-3.5 flex items-start gap-2.5 rounded-[14px]"
            style={{ background: "var(--warning-tint)", padding: "12px 14px" }}
          >
            <AlertCircle size={22} strokeWidth={2.25} className="shrink-0" style={{ color: "var(--warning)" }} aria-hidden />
            <p className="m-0 text-[17px] font-medium leading-[1.3]" style={{ color: "#8a5000" }}>
              {correction}
            </p>
          </div>
        )}

        {script.primaryLabel && (
          <button
            type="button"
            onClick={() => {
              clearCorrection();
              script.onPrimary?.();
            }}
            data-testid={script.equalPair ? "job-card-pick-a" : script.primaryTestId}
            className="mt-[18px] flex min-h-[64px] w-full cursor-pointer items-center justify-center gap-3 whitespace-nowrap rounded-[16px] text-[20px] font-medium text-white"
            style={{ background: tone }}
          >
            {script.primaryLabel}
          </button>
        )}

        {/* Only ever appears alongside Show me. A lone read-aloud button is
            clutter on a card whose whole job is one sentence. */}
        {script.help && (
          <div className="mt-3.5 flex gap-2.5">
            <button
              type="button"
              onClick={toggleShowMe}
              className="flex min-h-[56px] flex-1 cursor-pointer items-center justify-center gap-2.5 whitespace-nowrap rounded-[16px] text-[17px] font-medium"
              style={{
                border: `2px solid ${TONE.blue}`,
                background: step?.showMeActive ? TONE.blue : "#fff",
                color: step?.showMeActive ? "#fff" : TONE.blue,
              }}
            >
              <MapPin size={20} strokeWidth={2.25} aria-hidden />
              {step?.showMeActive ? c.hide : c.showMe}
            </button>
            <button
              type="button"
              onClick={() => speakText(script.line, lang)}
              aria-label={c.readAloud}
              title={c.readAloud}
              className="flex min-h-[56px] w-14 shrink-0 cursor-pointer items-center justify-center rounded-[16px] bg-white text-[#3c4043]"
              style={{ border: "2px solid var(--border)" }}
            >
              <Volume2 size={22} strokeWidth={2.25} aria-hidden />
            </button>
          </div>
        )}

        {script.secondaryLabel && (
          <button
            type="button"
            onClick={script.onSecondary}
            data-testid={script.equalPair ? "job-card-pick-b" : script.secondaryTestId}
            className={
              script.equalPair
                ? "mt-2.5 flex min-h-[64px] w-full cursor-pointer items-center justify-center rounded-[16px] text-[20px] font-medium text-white"
                : "mt-2.5 flex min-h-[44px] w-full cursor-pointer items-center justify-center rounded-[16px] text-[15px] font-medium"
            }
            style={script.equalPair ? { background: tone } : { color: "var(--text-secondary)" }}
          >
            {script.secondaryLabel}
          </button>
        )}

        {script.step >= 0 && (
          <div className="mt-4 flex items-center gap-1.5" aria-hidden>
            {[0, 1, 2, 3].map((i) => (
              <span
                key={i}
                className="h-2 flex-1 rounded-full"
                style={{
                  background:
                    script.step > i ? TONE.green : script.step === i ? tone : "#e8eaed",
                }}
              />
            ))}
          </div>
        )}
          </>
        )}
      </div>
      )}
    </div>
  );
}
