"use client";

import { useCallback, useRef, useState } from "react";
import { AlertCircle, Check, ChevronDown, ChevronUp, Mail, MapPin, Shrink, Volume2 } from "lucide-react";
import { useProgress } from "@/lib/progress-context";
import { useWindowManager } from "@/lib/window-manager";
import { useJobCard, type JobCardStep } from "@/lib/job-card-context";
import {
  INTRO_BEATS,
  CARD_PRACTICE,
  LIST_INTRO,
  LIST_INTRO_FLAG,
  JOB_CARD_COPY,
  JOB_CARD_DONE_LINE,
  JOB_CARD_LINE,
  shouldShowListIntro,
} from "@/lib/job-card-content";
import {
  coreComplete,
  courseComplete,
  TASK_INFO,
  TASK_LOCATIONS,
  actForLevel,
  findTrackForTask,
  levelForTrack,
  nextTaskInTrack,
  taskKeysForLevel,
} from "@/lib/tracks-content";
import { COURSE_ROUTES, COURSE_ROUTE_LABELS } from "@/lib/course-route";
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
  routeChoices?: boolean;
  /** A quieter second line under `line` (when needed). */
  hint?: string;
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
  const { lang, completedTaskKeys, currentTrack, displayName, celebrateLevel, celebrateTrack, storyFlags, setStoryFlag, bridgePath, courseRoute, chooseCourseRoute, routeSaving, saveError, saving, retrySave } =
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
    practice,
    setPractice,
  } = useJobCard();

  const c = JOB_CARD_COPY[lang];
  const pc = CARD_PRACTICE;
  const taskSave = active !== null && step?.priority === "save";
  const busy = Boolean(saving || routeSaving || saveError || taskSave);
  const practicing = practice.stage !== "inactive";
  const showPractice = practicing && !busy;
  const visibleHelp = !practicing && !busy ? help : null;
  const visibleCorrection = practicing || busy ? "" : correction;
  const level = levelForTrack(currentTrack.key);
  const act = actForLevel(level)?.key ?? "act1";

  const [choosingRoute, setChoosingRoute] = useState(false);
  const [corner, setCorner] = useState<Corner>(HOME);
  const [collapsed, setCollapsed] = useState(false);
  const [heardVoice, setHeardVoice] = useState("");
  const [drag, setDrag] = useState<{ x: number; y: number } | null>(null);
  const [optionsOpen, setOptionsOpen] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);
  const optionsRef = useRef<HTMLButtonElement>(null);
  const practiceReturn = useRef<{ corner: Corner; focus: HTMLElement | null }>({ corner: HOME, focus: null });

  function startOrientation() {
    advanceIntro();
    openApp("browser", { tab: "tour" });
  }
  function startPractice() {
    if (practicing || busy) return;
    practiceReturn.current = {
      corner,
      focus: document.activeElement instanceof HTMLElement ? document.activeElement : null,
    };
    setOptionsOpen(false);
    setCollapsed(false);
    setPractice({ stage: "click", origin: introBeat < INTRO_BEATS.length ? "onboarding" : "task" });
    requestAnimationFrame(() => cardRef.current?.querySelector<HTMLElement>('[data-practice-focus]')?.focus());
  }
  function exitPractice() {
    setOptionsOpen(false);
    setPractice({ ...practice, stage: "inactive" });
    setCorner(practiceReturn.current.corner);
    setCollapsed(false);
    if (practice.origin === "onboarding") startOrientation();
    requestAnimationFrame(() => {
      const previous = practiceReturn.current.focus;
      if (practice.origin === "task" && previous?.isConnected) previous.focus();
      else optionsRef.current?.focus();
    });
  }

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
  /** Last mid-job line for the current curriculum task — survives tab switches
   *  inside the browser (Portal → Mail) so Mail can't blank the card. */
  const [heldStep, setHeldStep] = useState<JobCardStep | null>(null);
  if (jobShown !== nextTaskKey) {
    setFinishedTaskKey(jobShown);
    setJobShown(nextTaskKey);
    setHeldStep(null);
    setCorner(HOME);
    setCollapsed(false);
  }

  // Ignore reports from a different job (Mail already queued for tomorrow
  // while today is still shift notes). Keep the last matching line while the
  // learner pokes around other tabs of the same window.
  const liveStep =
    step && (!step.taskKey || step.taskKey === nextTaskKey) ? step : null;
  if (liveStep) {
    const same =
      heldStep &&
      heldStep.line.en === liveStep.line.en &&
      heldStep.stepIndex === liveStep.stepIndex &&
      heldStep.canShowMe === liveStep.canShowMe &&
      heldStep.canHelp === liveStep.canHelp &&
      heldStep.primaryLabel === liveStep.primaryLabel &&
      heldStep.priority === liveStep.priority;
    if (!same) setHeldStep(liveStep);
  }
  const effectiveStep =
    liveStep ?? (active !== null && heldStep ? heldStep : null);

  const script = buildScript();
  // What the speaker button reads: the instruction, plus the hint and the
  // correction when they are up, because those are the words a learner who
  // needs the audio is most likely stuck on.
  const spokenLine = [script.line, script.hint, visibleCorrection].filter(Boolean).join(". ");
  // A new sentence or a correction is the card talking again — open it so
  // the learner cannot miss the line they just hid.
  const voice = `${script.line}\0${visibleCorrection}\0${visibleHelp?.lesson.t ?? ""}`;
  if (heardVoice !== voice) {
    setHeardVoice(voice);
    setCollapsed(false);
  }

  const moveToCorner = useCallback((next: Corner) => setCorner(next), [setCorner]);

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
      moveToCorner(
        ((cy < window.innerHeight / 2 ? "t" : "b") +
          (cx < window.innerWidth / 2 ? "l" : "r")) as Corner,
      );
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    e.preventDefault();
  }, [moveToCorner]);

  const nudgeCorner = (e: React.KeyboardEvent) => {
    if (e.target !== e.currentTarget) return;
    const set = (next: Corner) => {
      e.preventDefault();
      moveToCorner(next);
    };
    if (e.key === "ArrowLeft") set((corner[0] + "l") as Corner);
    else if (e.key === "ArrowRight") set((corner[0] + "r") as Corner);
    else if (e.key === "ArrowUp") set(("t" + corner[1]) as Corner);
    else if (e.key === "ArrowDown") set(("b" + corner[1]) as Corner);
  };

  // ─── the one instruction, derived from state ─────────────────────────────
  function buildScript(): Script {
    if (saving || routeSaving || saveError) return {
      badge: saveError ? "!" : "…", kicker: lang === "en" ? "Your progress" : "Tu progreso",
      line: saveError ? (lang === "en" ? "Your work has not finished saving. Keep this tab open and retry." : "Tu trabajo no terminó de guardarse. Mantén esta pestaña abierta y vuelve a intentar.")
        : (lang === "en" ? "Saving your work…" : "Guardando tu trabajo…"),
      tone: "blue", step: -1,
      primaryLabel: saveError ? (lang === "en" ? "Retry save" : "Intentar guardar de nuevo") : undefined,
      onPrimary: retrySave,
    };
    if (taskSave && step) return {
      badge: "!", kicker: lang === "en" ? "Your progress" : "Tu progreso",
      line: step.line[lang], tone: "blue", step: -1,
      primaryLabel: step.primaryLabel, onPrimary: pressPrimary,
    };
    if (showPractice) return {
      badge: "✉", kicker: pc.label[lang],
      line: pc[practice.stage === "inactive" ? "click" : practice.stage][lang],
      tone: "blue", step: -1,
    };
    if (introBeat < INTRO_BEATS.length) {
      const beat = INTRO_BEATS[introBeat];
      const name = displayName.trim() || (lang === "en" ? "friend" : "amiga");
      return {
        badge: "1", kicker: beat.kicker[lang],
        line: beat.line[lang].replace("{name}", name),
        tone: "blue", step: -1,
        primaryLabel: beat.cta?.[lang], onPrimary: startOrientation,
        secondaryLabel: pc.title[lang],
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

    if (active === null && courseRoute === 'pause' && !choosingRoute && coreComplete(completedTaskKeys)) return {
      badge: '✓', kicker: lang === 'en' ? 'Core course complete' : 'Curso básico terminado',
      line: lang === 'en' ? 'You can stop here. Your skills and progress are saved.' : 'Puedes terminar aquí. Tus habilidades y tu progreso están guardados.',
      tone: 'green', step: -1,
      primaryLabel: lang === 'en' ? 'Explore another direction' : 'Explorar otro camino', onPrimary: () => setChoosingRoute(true),
    };
    if (coreComplete(completedTaskKeys) && (choosingRoute || (active === null && courseComplete(completedTaskKeys, courseRoute)))) {
      return {
        badge: "✓", kicker: lang === "en" ? "Your next direction" : "Tu próximo camino",
        line: lang === "en" ? "You have finished this part. Choose another direction, or stop here with the skills you earned."
          : "Terminaste esta parte. Elige otro camino o termina aquí con las habilidades que ganaste.",
        tone: "green", step: -1, routeChoices: true,
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
    if (active === null || !effectiveStep) {
      if (!nextTaskKey) {
        return { badge: "✓", kicker: c.dayDoneKicker, line: c.allDoneLine, tone: "green", step: 4 };
      }
      const location = TASK_LOCATIONS[nextTaskKey];
      const desktopLine =
        JOB_CARD_LINE[nextTaskKey]?.[lang] ?? TASK_INFO[nextTaskKey].dispatch[lang];
      if (!location) {
        return { badge, kicker, line: c.comingSoonLine, tone: "blue", step: 0 };
      }
      return {
        badge,
        kicker,
        line: desktopLine,
        tone: "blue",
        step: 0,
        primaryLabel: HANDOFF_CTA[nextTaskKey]?.[lang] ?? location.ctaLabel,
        onPrimary: () =>
          openApp(location.appKey, { tab: location.tab, section: location.section }),

      };
    }

    // Mid-job. Guidance loosens by act: Act I spells out every click, Act II
    // keeps the goal on screen but offers Show me only once it's needed, and
    // Act III says the title and gets out of the way.
    // Show me only while the owning task is still mounted (liveStep) — a held
    // line from another browser tab has no spotlight target to light.
    const helpOffered =
      liveStep && act === "act1"
        ? liveStep.canShowMe
        : liveStep && act === "act2"
          ? liveStep.canShowMe && Boolean(correction)
          : false;
    // Act I spells out the click. From Act II on the card states the goal and
    // lets the learner work out the clicks, which is the whole point of the
    // ladder: the scaffolding comes down as they stop needing it.
    const goalLine = nextTaskKey
      ? (JOB_CARD_LINE[nextTaskKey]?.[lang] ?? TASK_INFO[nextTaskKey].label[lang])
      : effectiveStep.line[lang];
    const midLine = act === "act1" ? effectiveStep.line[lang] : goalLine;

    return {
      badge,
      kicker,
      line: midLine,
      tone: "blue",
      help: Boolean(helpOffered),
      // A step that advances from the card, not from a click in the app.
      primaryLabel: liveStep?.primaryLabel,
      onPrimary: liveStep?.primaryLabel ? pressPrimary : undefined,
      // Four bars for a job of any length: the task's own step count is
      // mapped onto them so the shape never changes between jobs.
      step: Math.min(3, Math.round((effectiveStep.stepIndex / Math.max(1, effectiveStep.stepCount - 1)) * 3)),
    };
  }

  const tone = TONE[script.tone];

  // A celebration owns the whole screen for a moment. The card stepping back
  // is the same rule as everywhere else: one voice at a time, and right now
  // the level screen is the one talking.
  if ((celebrateLevel?.levelUp || celebrateTrack) && !saving && !saveError) return null;

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
      data-corner={corner}
      data-practice={practice.stage}
      onKeyDown={(e) => {
        if (e.key === "Escape" && optionsOpen) {
          e.stopPropagation();
          setOptionsOpen(false);
          optionsRef.current?.focus();
        }
      }}
      className="animate-card-pop fixed z-[72] flex flex-col overflow-hidden rounded-[24px] bg-white"
      style={{ width: CARD_W, maxWidth: "calc(100vw - 48px)", maxHeight: `calc(100dvh - ${BOTTOM + EDGE}px)`, ...position }}
    >
      <div
        ref={handleRef}
        data-testid="job-card-drag-handle"
        onPointerDown={startDrag}
        onKeyDown={nudgeCorner}
        tabIndex={0}
        role="button"
        aria-label={c.dragHint}
        title={c.dragHint}
        className="flex shrink-0 items-center gap-2.5 px-5 py-2 text-white"
        style={{ background: tone, cursor: drag ? "grabbing" : "grab", touchAction: "none" }}
      >
        <span
          className="flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full text-[14px] font-bold"
          style={{ background: "rgba(255,255,255,0.22)" }}
          aria-hidden
        >
          {script.badge === "✓" ? <Check size={15} strokeWidth={3} /> : script.badge}
        </span>
        <span className="min-w-0 flex-1 truncate text-[15px] font-medium">
          {visibleHelp && !finish ? visibleHelp.kicker : script.kicker}
        </span>
        {!practicing && !busy && liveStep?.canHelp && active !== null && !finish && introBeat >= INTRO_BEATS.length && (
          <button
            type="button"
            data-testid="job-card-help"
            aria-label={help ? c.hideHelp : c.help}
            aria-pressed={Boolean(help)}
            title={help ? c.hideHelp : c.help}
            onPointerDown={(e) => e.stopPropagation()}
            onClick={pressHelp}
            className={`flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center rounded-full text-[13px] font-bold${
              liveStep?.pulseHelp && !help ? " animate-showme-pulse-compact" : ""
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
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => setCorner(HOME)}
            aria-label={c.snapBack}
            title={c.snapBack}
            className="flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center rounded-full text-white"
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
          onClick={() => setCollapsed(!collapsed)}
          className="flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center rounded-full text-white"
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

      <button ref={optionsRef} type="button" aria-expanded={optionsOpen && !busy}
        aria-controls="job-card-options" data-testid="job-card-options"
        className="min-h-12 shrink-0 border-b border-[#dadce0] px-5 text-left font-medium text-[#0b57d0]"
        onClick={() => setOptionsOpen(!optionsOpen)}>
        {pc.options[lang]}
      </button>
      {optionsOpen && !busy && (
        <div id="job-card-options" className="min-h-0 overflow-y-auto p-3" aria-label={pc.options[lang]}>
          <div className="grid grid-cols-2 gap-2">
            {(Object.keys(pc.corners) as Corner[]).map((spot) => (
              <button key={spot} type="button" aria-pressed={corner === spot}
                className="min-h-12 rounded-lg border border-[#dadce0] px-2 text-[#202124] aria-pressed:bg-[#e8f0fe]"
                onClick={() => moveToCorner(spot)}>{pc.corners[spot][lang]}</button>
            ))}
          </div>
          <button type="button" className="mt-2 min-h-12 w-full rounded-lg border px-2 text-[#202124]"
            onClick={() => { setCollapsed(!collapsed); setOptionsOpen(false); optionsRef.current?.focus(); }}>
            {collapsed ? pc.show[lang] : pc.hide[lang]}
          </button>
          <button type="button" disabled={practicing || busy} className="mt-2 min-h-12 w-full rounded-lg border px-2 text-[#202124] disabled:opacity-50"
            onClick={startPractice}>{pc.title[lang]}</button>
        </div>
      )}
      {!collapsed && (!optionsOpen || busy) && (
      <div className="min-h-0 overflow-y-auto p-5">
        {showPractice ? (
          <>
            <p role="status" className="m-0 text-[22px] font-medium leading-tight text-[#202124]">{script.line}</p>
            {practice.stage === "click" && (
              <div className="mt-3 rounded-xl bg-[#f1f3f4] p-3">
                <button data-practice-focus type="button" className="flex min-h-16 w-full items-center justify-center gap-3 rounded-xl border-2 border-[#0b57d0] bg-white px-3 text-[#0b57d0]"
                  onClick={() => {
                    setPractice({ ...practice, stage: "scroll" });
                    requestAnimationFrame(() => cardRef.current?.querySelector<HTMLElement>('[data-practice-notice]')?.focus());
                  }}>
                  <Mail aria-hidden size={28} />{pc.envelope[lang]}
                </button>
              </div>
            )}
            {practice.stage === "scroll" && (
              <div data-practice-notice tabIndex={0} role="region" aria-label={pc.notice[lang]}
                className="mt-3 h-36 overflow-y-auto overscroll-contain rounded-xl bg-[#f1f3f4] p-3 text-[#202124]" style={{ touchAction: "pan-y" }}>
                <p className="font-semibold">{pc.notice[lang]}</p>
                {pc.paragraphs.map((line, index) => <p key={index} className="my-6">{line[lang]}</p>)}
                <button type="button" className="min-h-12 w-full rounded-xl bg-[#0b57d0] px-3 text-white"
                  onClick={() => {
                    setPractice({ ...practice, stage: "complete" });
                    requestAnimationFrame(() => cardRef.current?.querySelector<HTMLElement>('[data-practice-exit]')?.focus());
                  }}>{pc.ready[lang]}</button>
              </div>
            )}
            <button type="button" data-testid="job-card-read-aloud" className="mt-3 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border text-[#3c4043]"
              onClick={() => speakText(script.line, lang)}><Volume2 aria-hidden size={22} />{c.readAloud}</button>
          </>
        ) : visibleHelp && !finish ? (

          <>
            <p
              role="status"
              aria-live="polite"
              className="m-0 text-[22px] font-medium leading-[1.2] tracking-[-0.01em] text-[#202124]"
            >
              {visibleHelp.lesson.t}
            </p>
            <ol className="mt-3.5 m-0 flex list-none flex-col gap-2 p-0">
              {visibleHelp.lesson.s.map((text, i) => (
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
              <span className="font-semibold text-[#202124]">{visibleHelp.tipLabel}: </span>
              {visibleHelp.lesson.tip}
            </p>
            <button
              type="button"
              onClick={visibleHelp.onClose}
              className="job-card-primary mt-[18px] flex min-h-[64px] w-full cursor-pointer items-center justify-center rounded-[16px] text-[20px] font-medium text-white"
              style={{ background: tone }}
            >
              {visibleHelp.gotItLabel}
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

        {script.hint && (
          <p role="status" aria-live="polite" className="mt-2 mb-0 text-[17px] leading-[1.35] text-[#5f6368]">
            {script.hint}
          </p>
        )}

        {visibleCorrection && (
          <div
            role="status"
            aria-live="polite"
            className="mt-3.5 flex items-start gap-2.5 rounded-[14px]"
            style={{ background: "var(--warning-tint)", padding: "12px 14px" }}
          >
            <AlertCircle size={22} strokeWidth={2.25} className="shrink-0" style={{ color: "var(--warning)" }} aria-hidden />
            <p className="m-0 text-[17px] font-medium leading-[1.3]" style={{ color: "#8a5000" }}>
              {visibleCorrection}
            </p>
          </div>
        )}

        {script.routeChoices && (
          <div className="mt-3 grid gap-2">
            {COURSE_ROUTES.map((route) => (
              <button key={route} type="button" data-testid={`course-route-${route}`}
                disabled={routeSaving}
                className="min-h-11 rounded-xl border border-[#dadce0] px-3 py-2 text-left text-[15px] font-medium hover:bg-[#e8f0fe] disabled:opacity-50"
                onClick={async () => { await chooseCourseRoute(route); setChoosingRoute(false); }}>
                {COURSE_ROUTE_LABELS[route][lang]}
              </button>
            ))}
          </div>
        )}
        {active === null && coreComplete(completedTaskKeys) && !script.routeChoices && !saving && !saveError && (
          <button type="button" className="mt-2 min-h-11 text-[14px] text-[#0b57d0]" onClick={() => setChoosingRoute(true)}>
            {lang === "en" ? "Change direction" : "Cambiar de camino"}
          </button>
        )}
        {script.primaryLabel && (
          <button
            type="button"
            onClick={() => {
              clearCorrection();
              script.onPrimary?.();
            }}
            data-testid={script.equalPair ? "job-card-pick-a" : script.primaryTestId}
            className="job-card-primary mt-[18px] flex min-h-[64px] w-full cursor-pointer items-center justify-center gap-3 whitespace-nowrap rounded-[16px] text-[20px] font-medium text-white"
            style={{ background: tone }}
          >
            {script.primaryLabel}
          </button>
        )}

        {/* Read-aloud used to live inside the Show-me row, which meant it was
            on screen only mid-task in Act I — gone from the intro beats, every
            desktop briefing, every correction and every finish card, i.e. most
            of what a learner who can barely read has to get through. It reads
            whatever the card is currently saying, correction included. */}
        <div className="mt-3.5 flex gap-2.5">
          {script.help && (
            <button
              type="button"
              onClick={toggleShowMe}
              className="flex min-h-[56px] flex-1 cursor-pointer items-center justify-center gap-2.5 whitespace-nowrap rounded-[16px] text-[17px] font-medium"
              style={{
                border: `2px solid ${TONE.blue}`,
                background: liveStep?.showMeActive ? TONE.blue : "#fff",
                color: liveStep?.showMeActive ? "#fff" : TONE.blue,
              }}
            >
              <MapPin size={20} strokeWidth={2.25} aria-hidden />
              {liveStep?.showMeActive ? c.hide : c.showMe}
            </button>
          )}
          <button
            type="button"
            data-testid="job-card-read-aloud"
            onClick={() => speakText(spokenLine, lang)}
            aria-label={c.readAloud}
            title={c.readAloud}
            className={`flex min-h-[56px] cursor-pointer items-center justify-center gap-2.5 rounded-[16px] bg-white text-[17px] font-medium text-[#3c4043] ${
              script.help ? "w-14 shrink-0" : "flex-1"
            }`}
            style={{ border: "2px solid var(--border)" }}
          >
            <Volume2 size={22} strokeWidth={2.25} aria-hidden />
            {!script.help && c.readAloud}
          </button>
        </div>

        {script.secondaryLabel && (
          <button
            type="button"
            onClick={() => { if (introBeat < INTRO_BEATS.length) startPractice(); else script.onSecondary?.(); }}
            data-testid={script.equalPair ? "job-card-pick-b" : script.secondaryTestId}
            className={
              script.equalPair
                ? "job-card-primary mt-2.5 flex min-h-[64px] w-full cursor-pointer items-center justify-center rounded-[16px] text-[20px] font-medium text-white"
                : "mt-2.5 flex min-h-[48px] w-full cursor-pointer items-center justify-center rounded-[16px] text-[15px] font-medium"
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
      {showPractice && (
        <div className="shrink-0 border-t border-[#dadce0] bg-white p-2">
          <button type="button" data-practice-exit className="min-h-12 w-full rounded-xl bg-[#0b57d0] px-3 font-medium text-white" onClick={exitPractice}>
            {practice.stage === "complete" ? (practice.origin === "onboarding" ? INTRO_BEATS[0].cta?.[lang] : pc.back[lang]) : pc.skip[lang]}
          </button>
        </div>
      )}
    </div>
  );
}
