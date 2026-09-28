"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, ArrowLeft, Check, ChevronDown, ChevronUp, IdCard, Mail, MapPin, Shrink, Volume2 } from "lucide-react";
import { useProgress } from "@/lib/progress-context";
import { useWindowManager } from "@/lib/window-manager";
import { useJobCard, type JobCardStep } from "@/lib/job-card-context";
import { useLesson } from "@/lib/lesson-context";
import { LESSON_COPY, MENTIONS_INFO_CARD } from "@/lib/lessons/copy";
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
  courseLevels,
  TASK_INFO,
  TASK_LOCATIONS,
  actForLevel,
  findTrackForTask,
  levelForTrack,
  nextTaskInTrack,
  taskKeysForLevel,
} from "@/lib/tracks-content";
import {
  COURSE_ROUTES,
  COURSE_ROUTE_LABELS,
  COURSE_ROUTE_DESCRIPTIONS,
  COURSE_ROUTE_TAGS,
  ROUTE_CHOOSER_LINES,
  ROUTE_HELP_COPY,
  changeDirectionPlacement,
  routeChoiceState,
  routeChooserMode,
  type CourseRoute,
} from "@/lib/course-route";
import { ENDING_COPY, SUMMARY_COPY, workdaysFinished } from "@/lib/portfolio-summary";
import type { TaskKey } from "@/lib/desktop-content";
import { HANDOFF_CTA } from "@/lib/story-beats";
import { dayLabel } from "@/lib/shift-spine";
import { SHELF_RESERVE } from "@/components/Shelf";
import { speakText } from "@/lib/read-aloud";
import { DEVICE_KEY, storage } from "@/lib/storage";
import {
  HOME_CORNER as HOME,
  chooseCorner,
  cornerBox,
  cornerNearest,
  isCorner,
  nudgedCorner,
  type Box,
  type Corner,
} from "@/lib/job-card-placement";

/** Four parking spots (see `job-card-placement.ts`). The card can never end
 *  up half off-screen. */
export const EDGE = 24;
/** 48px shelf + 24px of air, so the card never sits on the shelf. */
const BOTTOM = SHELF_RESERVE + EDGE;
export const CARD_W = 420;

const TONE = { blue: "#0b57d0", green: "#1e8e3e" } as const;
type Tone = keyof typeof TONE;

/** The corner this device's learner last moved the card to. */
function readStoredCorner(): Corner {
  const stored = storage.getString(DEVICE_KEY.jobCardCorner);
  return isCorner(stored) ? stored : HOME;
}

/**
 * Everything else a learner might press in the open window. Not every
 * task's buttons carry a Show me id (a slide deck's Next slide does not), so
 * when the card has to move it takes the corner that hides the fewest of
 * these. `data-card-avoid` (the bookmarks, Minimize and Close) weighs more:
 * the card moves off those even from the learner's own corner.
 */
const LESSER_CONTROLS = [
  "[data-app-window] button",
  "[data-app-window] a[href]",
  "[data-app-window] input:not([type=hidden])",
  "[data-app-window] select",
  "[data-app-window] textarea",
  "[data-app-window] [role=button]",
].join(", ");

/** Every element matching `selector` that a learner can see right now,
 *  outside the card: Show me targets, or the window controls. */
function visibleTargets(card: HTMLElement, selector: string): Box[] {
  const boxes: Box[] = [];
  document.querySelectorAll<HTMLElement>(selector).forEach((el) => {
    if (card.contains(el)) return;
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) return;
    if (typeof el.checkVisibility === "function" && !el.checkVisibility({ visibilityProperty: true })) return;
    boxes.push({ left: r.left, top: r.top, width: r.width, height: r.height });
  });
  return boxes;
}

/**
 * A card parked at the bottom sits over the end of whatever page scrolls
 * under it. Give that page a gutter as tall as the part of it the card
 * covers, so its last control can always be scrolled up clear of the card.
 * Only page-sized scroll areas get one: a small list box inside a form does
 * not need to grow by a card's height.
 */
function updateScrollGutters(card: Box | null) {
  document
    .querySelectorAll<HTMLElement>("[data-app-window] .overflow-y-auto, [data-app-window] .overflow-auto")
    .forEach((el) => {
      const r = el.getBoundingClientRect();
      const under =
        card !== null &&
        r.height >= window.innerHeight * 0.4 &&
        el.scrollHeight > el.clientHeight + 1 &&
        r.left < card.left + card.width &&
        card.left < r.right &&
        card.top < r.bottom;
      const gutter = under ? `${Math.ceil(r.bottom - card.top + EDGE)}px` : "";
      if (el.style.getPropertyValue("--job-card-gutter") !== gutter) {
        if (gutter) el.style.setProperty("--job-card-gutter", gutter);
        else el.style.removeProperty("--job-card-gutter");
      }
      if (el.hasAttribute("data-card-gutter") !== under) el.toggleAttribute("data-card-gutter", under);
    });
}

const noSubscribe = () => () => {};


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
  const lesson = useLesson();
  const router = useRouter();
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
  // A lesson picks its own support: Guided talks like Act I (every click,
  // plus Show me), On my own like Act III (the goal, then out of the way).
  const act = lesson
    ? (lesson.mode === "guided" ? "act1" : "act3")
    : (actForLevel(level)?.key ?? "act1");

  const [choosingRoute, setChoosingRoute] = useState(false);
  const [previewRoute, setPreviewRoute] = useState<CourseRoute | null>(null);
  // Mid-direction, "Change direction" waits inside this Help panel on the
  // desktop card instead of sitting above the day's main button.
  const [routeHelpOpen, setRouteHelpOpen] = useState(false);
  const routeFinished = courseComplete(completedTaskKeys, courseRoute);
  const chooserMode = routeChooserMode(courseRoute, routeFinished);
  const directionPlacement = changeDirectionPlacement(courseRoute, routeFinished);
  const closeChooser = () => { setPreviewRoute(null); setChoosingRoute(false); };
  // The learner's own corner: what they chose this session, else what this
  // device remembers, read through isClient so hydration stays clean. A
  // lesson keeps its own left column (LESSON_RAIL_CLASS), so it neither reads
  // nor writes the Story corner.
  const isClient = useSyncExternalStore(noSubscribe, () => true, () => false);
  const [cornerChoice, setCornerChoice] = useState<Corner | null>(null);
  const preferred = cornerChoice ?? (isClient && !lesson ? readStoredCorner() : HOME);
  // Where the card really parks: `preferred`, unless that would cover a Show
  // me target (measured from the page, below). Keyed by the preference it was
  // worked out from, so a new choice never shows a stale answer.
  const [parked, setParked] = useState<{ from: Corner; corner: Corner } | null>(null);
  // The moment the learner last moved the card by hand. For the rest of that
  // step the card stays exactly where they put it, even over a button:
  // fighting a learner's drag would be worse than covering something they
  // can see they covered.
  const [heldAt, setHeldAt] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState(false);
  const [heardVoice, setHeardVoice] = useState("");
  const [drag, setDrag] = useState<{ x: number; y: number } | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);
  const collapseRef = useRef<HTMLButtonElement>(null);

  function startOrientation() {
    advanceIntro();
    openApp("browser", { tab: "tour" });
  }
  function startPractice() {
    if (practicing || busy) return;
    setCollapsed(false);
    setPractice({ stage: "click" });
    requestAnimationFrame(() => cardRef.current?.querySelector<HTMLElement>('[data-practice-focus]')?.focus());
  }
  function exitPractice() {
    setPractice({ stage: "inactive" });
    setCollapsed(false);
    startOrientation();
    requestAnimationFrame(() => collapseRef.current?.focus());
  }

  const nextTaskKey = lesson ? lesson.taskKey : nextTaskInTrack(currentTrack, completedTaskKeys);
  const levelTaskKeys = taskKeysForLevel(level, bridgePath);
  const doneInLevel = levelTaskKeys.filter((k) => completedTaskKeys.includes(k)).length;
  const jobNumber = Math.min(doneInLevel + 1, levelTaskKeys.length);

  // When the job changes: the card opens again, and the job they moved
  // *off* is remembered. The corner stays the learner's: a card they moved
  // out of the way stays out of the way. Completing a job advances `currentTrack`
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
      heldStep.goal?.en === liveStep.goal?.en &&
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
  // A new sentence is the card talking again — open it so the learner cannot
  // miss the line they just hid. A correction does not: it is usually raised
  // by a click next to the button they need, and a card that springs open
  // over that button hides the fix. A folded card says the correction in its
  // header instead (below).
  const voice = `${script.line}\0${visibleHelp?.lesson.t ?? ""}`;
  if (heardVoice !== voice) {
    setHeardVoice(voice);
    setCollapsed(false);
  }
  const headerCorrection = collapsed && !(visibleHelp && !finish) ? visibleCorrection : "";

  // A new instruction starts at its first line, even if Help or Show me
  // scrolled the previous card to a lower control.
  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = 0;
  }, [voice]);

  // A celebration owns the whole screen for a moment. The card stepping back
  // is the same rule as everywhere else: one voice at a time, and right now
  // the level screen is the one talking.
  const celebrating = Boolean((celebrateLevel?.levelUp || celebrateTrack) && !saving && !saveError);

  // ─── the corner ──────────────────────────────────────────────────────────
  // One step of one job, in one window. A hand move holds for this long.
  const moment = `${nextTaskKey}|${active}|${effectiveStep?.id ?? ""}:${effectiveStep?.stepIndex ?? ""}`;
  const held = heldAt === moment;
  // A lesson docks the card in its own rail or bottom panel (lesson-rail-card
  // in globals.css) and the window makes room for it, so it never parks.
  const inLesson = Boolean(lesson);
  const corner: Corner = inLesson
    ? HOME
    : held
      ? preferred
      : parked?.from === preferred
        ? parked.corner
        : preferred;

  function moveToCorner(next: Corner) {
    setCornerChoice(next);
    setHeldAt(moment);
    if (!lesson) storage.setString(DEVICE_KEY.jobCardCorner, next);
  }
  function snapHome() {
    setCornerChoice(HOME);
    setHeldAt(null);
    if (!lesson) storage.remove(DEVICE_KEY.jobCardCorner);
  }

  // Keep the card off the controls the learner has to press. The page is the
  // external system here: what is under the card depends on the task's own
  // layout, the scroll position and the window size, so it is measured, not
  // derived. It re-measures when any of those change, a frame at a time.
  const dragging = drag !== null;
  useEffect(() => {
    if (dragging || celebrating || inLesson) return;
    const card = cardRef.current;
    if (!card) return;
    let frame = 0;
    const measure = () => {
      frame = 0;
      const box = card.getBoundingClientRect();
      const size = { width: box.width, height: box.height };
      const viewport = { width: window.innerWidth, height: window.innerHeight };
      const insets = { edge: EDGE, bottom: BOTTOM };
      const next = held
        ? preferred
        : chooseCorner({
            preferred,
            card: size,
            viewport,
            insets,
            targets: visibleTargets(card, "[data-showme]"),
            avoid: visibleTargets(card, "[data-card-avoid]"),
            lesser: visibleTargets(card, LESSER_CONTROLS),
          });
      setParked((prev) => (prev?.from === preferred && prev.corner === next ? prev : { from: preferred, corner: next }));
      updateScrollGutters(next[0] === "b" ? cornerBox(next, size, viewport, insets) : null);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    schedule();
    const pageChanges = new MutationObserver(schedule);
    pageChanges.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["class", "style", "hidden", "open"],
    });
    const cardSize = new ResizeObserver(schedule);
    cardSize.observe(card);
    window.addEventListener("resize", schedule);
    window.addEventListener("scroll", schedule, true);
    return () => {
      cancelAnimationFrame(frame);
      pageChanges.disconnect();
      cardSize.disconnect();
      window.removeEventListener("resize", schedule);
      window.removeEventListener("scroll", schedule, true);
      updateScrollGutters(null);
    };
  }, [dragging, celebrating, inLesson, held, preferred]);

  // After a hand-off (a celebration or an act's first screen closing, a task
  // window closing on the finished job) the control that had focus is gone
  // and focus falls to the page. Put it on the card's one button, so a
  // keyboard learner is one key away from the next job, not eleven Tabs.
  // Only when focus really is lost: never take it from something they chose.
  useEffect(() => {
    if (celebrating) return;
    const frame = requestAnimationFrame(() => {
      const current = document.activeElement;
      if (current && current !== document.body) return;
      cardRef.current?.querySelector<HTMLElement>(".job-card-primary")?.focus({ preventScroll: true });
    });
    return () => cancelAnimationFrame(frame);
  }, [celebrating, nextTaskKey, active]);

  // ─── dragging ────────────────────────────────────────────────────────────
  function startDrag(e: React.PointerEvent) {
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
      moveToCorner(
        cornerNearest(
          { x: last.x + box.width / 2, y: last.y + box.height / 2 },
          { width: window.innerWidth, height: window.innerHeight },
        ),
      );
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    e.preventDefault();
  }

  const nudgeCorner = (e: React.KeyboardEvent) => {
    if (e.target !== e.currentTarget) return;
    const next = nudgedCorner(corner, e.key);
    if (!next) return;
    e.preventDefault();
    moveToCorner(next);
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

    // A lesson is one task. It finishes on its own card, with the two ways
    // out a classroom needs, and never counts down the jobs left in a day.
    if (lesson && (completedTaskKeys.includes(lesson.taskKey) || (finish && active !== null && lesson.practiceRound == null))) {
      return {
        badge: "✓",
        kicker: lesson.title[lang],
        tone: "green",
        step: 4,
        // Story done lines point at the next day ("Next: the application"),
        // which a lesson does not have. The lesson's own takeaway says what
        // the learner can now do instead.
        line: LESSON_COPY.doneLine[lang],
        hint: [
          lesson.takeaway?.[lang],
          lesson.save.status === "guest"
            ? LESSON_COPY.savedHere[lang]
            : lesson.save.status === "saving"
              ? LESSON_COPY.saving[lang]
              : lesson.save.status === "saved"
                ? LESSON_COPY.savedAccount[lang]
                : lesson.save.status === "error"
                  ? LESSON_COPY.notSaved[lang]
                  : undefined,
        ].filter(Boolean).join(" "),
        // Leaving is the common next step in a classroom, so it is the big
        // button; practicing again is offered quietly under it.
        primaryLabel: LESSON_COPY.backToLessons[lang],
        onPrimary: lesson.onFinish,
        primaryTestId: "lesson-back",
        secondaryLabel: LESSON_COPY.practiceAgain[lang],
        onSecondary: lesson.onRestart,
        secondaryTestId: "lesson-practice-again",
      };
    }

    // The end of the course, or of a route: say what they finished, and
    // offer the summary they can keep. Another direction stays one quiet
    // "Change direction" link away (below the line).
    const seeSummary = {
      primaryLabel: SUMMARY_COPY.seeSummary[lang],
      onPrimary: () => router.push(`/summary?lang=${lang}`),
      primaryTestId: "see-summary",
      hint: ENDING_COPY.summaryHint[lang],
    };
    if (!lesson && active === null && courseRoute === 'pause' && !choosingRoute && coreComplete(completedTaskKeys)) {
      const days = workdaysFinished(completedTaskKeys);
      const beyondCore = COURSE_ROUTES.some((r) => r !== 'pause' && courseComplete(completedTaskKeys, r));
      return {
        badge: '✓',
        kicker: beyondCore
          ? (lang === 'en' ? 'Finished for now' : 'Terminado por ahora')
          : (lang === 'en' ? 'Core course complete' : 'Curso básico terminado'),
        line: beyondCore
          ? ENDING_COPY.stopLine(days, lang)
          : `${ENDING_COPY.coreLine(days, lang)} ${lang === 'en' ? 'Your progress is saved.' : 'Tu progreso está guardado.'}`,
        tone: 'green', step: -1,
        ...seeSummary,
      };
    }
    if (!lesson && active === null && !choosingRoute && courseRoute && courseRoute !== 'pause' && coreComplete(completedTaskKeys) && courseComplete(completedTaskKeys, courseRoute)) {
      return {
        badge: '✓', kicker: ENDING_COPY.routeKicker[lang],
        line: ENDING_COPY.routeLine(courseRoute, workdaysFinished(completedTaskKeys), lang),
        tone: 'green', step: -1,
        ...seeSummary,
      };
    }
    if (!lesson && coreComplete(completedTaskKeys) && (choosingRoute || (active === null && courseComplete(completedTaskKeys, courseRoute)))) {
      return {
        badge: "✓", kicker: lang === "en" ? "Your next direction" : "Tu próximo camino",
        line: ROUTE_CHOOSER_LINES[chooserMode][lang],
        tone: "green", step: -1, routeChoices: true,
      };
    }
    if (routeHelpOpen && !lesson && active === null && directionPlacement === 'help' && coreComplete(completedTaskKeys) && courseRoute) {
      return {
        badge: "?", kicker: ROUTE_HELP_COPY.kicker[lang],
        line: `${ROUTE_HELP_COPY.current(courseRoute)[lang]} ${ROUTE_HELP_COPY.line[lang]}`,
        tone: "blue", step: -1,
        primaryLabel: ROUTE_HELP_COPY.change[lang],
        onPrimary: () => { setRouteHelpOpen(false); setChoosingRoute(true); },
        primaryTestId: "change-direction",
        secondaryLabel: ROUTE_HELP_COPY.back[lang],
        onSecondary: () => setRouteHelpOpen(false),
      };
    }
    // Finished a job. One green header, one button — no done screen, no
    // three-way choice, and the skill badge is banked silently.
    //
    // Only while the app is still on screen: task windows stay mounted when
    // minimized, so a finished-but-hidden job would otherwise keep the card
    // green after the learner is already back on the desktop for the next one.
    if (finish && active !== null && lesson?.practiceRound == null) {
      const justFinished = finishedTaskKey;
      const finishedTrack = justFinished ? findTrackForTask(justFinished) : undefined;
      // The day the learner just finished, not the one they are moving into.
      const finishedLevel = finishedTrack ? levelForTrack(finishedTrack.key) : level;
      const finishedLevelKeys = finishedTrack
        ? taskKeysForLevel(finishedLevel, bridgePath)
        : levelTaskKeys;
      const remaining = finishedLevelKeys.filter((k) => !completedTaskKeys.includes(k)).length;
      const levelFinished = remaining === 0;
      // The last day of the core, or of the chosen route: there is no
      // tomorrow to start, so the card says what they finished instead.
      const endRoute = courseRoute === 'pause' ? null : courseRoute;
      const endLevels = courseLevels(endRoute);
      const endsRoute = !lesson && levelFinished
        && endLevels[endLevels.length - 1]?.key === finishedLevel.key
        && courseComplete(completedTaskKeys, endRoute);
      const endLine = endsRoute
        ? (endRoute
          ? ENDING_COPY.routeLine(endRoute, workdaysFinished(completedTaskKeys), lang)
          : ENDING_COPY.coreLine(workdaysFinished(completedTaskKeys), lang))
        : undefined;
      const doneLine = justFinished ? JOB_CARD_DONE_LINE[justFinished]?.[lang] : undefined;
      return {
        badge: "✓",
        kicker: finish.kicker ?? c.doneKicker,
        tone: "green",
        step: 4,
        line:
          endLine ??
          doneLine ??
          (levelFinished
            ? c.dayDoneLine
            : remaining === 1
              ? c.oneJobLeft
              : c.jobsLeft(remaining)),
        primaryLabel: endsRoute ? SUMMARY_COPY.backToDesk[lang] : levelFinished ? c.startTomorrow : c.nextJob,
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
    const kicker = lesson
      ? lesson.title[lang]
      : nextTaskKey
      ? [dayLabel(level, lang), c.jobOf(jobNumber, levelTaskKeys.length)].filter(Boolean).join(" · ")
      : c.dayDoneKicker;
    const badge = lesson ? String((effectiveStep?.stepIndex ?? 0) + 1) : nextTaskKey ? String(jobNumber) : "✓";

    // Nothing open: the card sets the job up and its button opens the thing
    // it names. This is what the desktop briefing used to do.
    if (active === null || !effectiveStep) {
      if (!nextTaskKey) {
        return { badge: "✓", kicker: c.dayDoneKicker, line: c.allDoneLine, tone: "green", step: 4 };
      }
      const location = TASK_LOCATIONS[nextTaskKey];
      const desktopLine =
        JOB_CARD_LINE[nextTaskKey]?.[lang] ?? TASK_INFO[nextTaskKey].dispatch[lang];
      if (lesson) {
        return {
          badge,
          kicker,
          line: desktopLine,
          tone: "blue",
          step: 0,
          primaryLabel: LESSON_COPY.openTask[lang],
          onPrimary: () =>
            openApp(location?.appKey ?? "browser", { tab: lesson.tabs[0], section: location?.section }),
        };
      }
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
    const goalLine = effectiveStep.goal?.[lang] ?? (nextTaskKey
      ? (JOB_CARD_LINE[nextTaskKey]?.[lang] ?? TASK_INFO[nextTaskKey].label[lang])
      : effectiveStep.line[lang]);
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
      // Floor, not round: step 2 of 3 lights bar 2, never bar 3.
      step: Math.min(3, Math.floor((effectiveStep.stepIndex * 4) / Math.max(1, effectiveStep.stepCount))),
    };
  }

  const tone = TONE[script.tone];

  if (celebrating) return null;

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
      // In a lesson the card has its own column, so it can sit above a picker's
      // backdrop without covering the picker: a correction for a wrong file
      // stays readable instead of dimmed behind the overlay.
      // Lessons reserve a rail or bottom panel for this card at every size.
      // The route chooser only shows on the desktop (no task under it), so it
      // skips the short-screen size cap and keeps all five choices in view.
      className={`${script.routeChoices && active === null ? "" : "job-card-compact "}${lesson ? "lesson-rail-card " : ""}animate-card-pop fixed ${lesson ? "z-[82]" : "z-[72]"} flex flex-col overflow-hidden rounded-[24px] bg-white`}
      style={{ width: CARD_W, maxWidth: "calc(100vw - 48px)", maxHeight: `calc(100dvh - ${BOTTOM + EDGE}px)`, ...position }}
    >
      <div
        ref={handleRef}
        data-testid="job-card-drag-handle"
        onPointerDown={lesson ? undefined : startDrag}
        onKeyDown={lesson ? undefined : nudgeCorner}
        tabIndex={lesson ? undefined : 0}
        role={lesson ? undefined : "button"}
        aria-label={lesson ? undefined : c.dragHint}
        title={lesson ? undefined : c.dragHint}
        className="flex shrink-0 items-center gap-2.5 px-5 py-2 text-white"
        style={{ background: tone, cursor: lesson ? "default" : drag ? "grabbing" : "grab", touchAction: "none" }}
      >
        <span
          className="flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full text-[14px] font-bold"
          style={{ background: "rgba(255,255,255,0.22)" }}
          aria-hidden
        >
          {headerCorrection ? (
            <AlertCircle size={16} strokeWidth={2.5} />
          ) : script.badge === "✓" ? (
            <Check size={15} strokeWidth={3} />
          ) : (
            script.badge
          )}
        </span>
        {/* Two lines before it cuts off: a lesson's name is the only thing
            telling the learner which lesson this is. Folded, a correction
            takes this line, so it is heard without the card opening over
            the button the learner needs. */}
        {headerCorrection ? (
          <span
            role="status"
            aria-live="polite"
            data-card-header-correction
            className="line-clamp-2 min-w-0 flex-1 text-[15px] leading-tight font-medium"
          >
            {headerCorrection}
          </span>
        ) : (
          <span className="line-clamp-2 min-w-0 flex-1 text-[15px] leading-tight font-medium">
            {visibleHelp && !finish ? visibleHelp.kicker : script.kicker}
          </span>
        )}
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
        {!lesson && !practicing && !busy && active === null && !choosingRoute && directionPlacement === "help"
          && coreComplete(completedTaskKeys) && introBeat >= INTRO_BEATS.length && (
          <button
            type="button"
            data-testid="job-card-route-help"
            aria-label={routeHelpOpen ? ROUTE_HELP_COPY.close[lang] : ROUTE_HELP_COPY.open[lang]}
            aria-pressed={routeHelpOpen}
            title={routeHelpOpen ? ROUTE_HELP_COPY.close[lang] : ROUTE_HELP_COPY.open[lang]}
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => setRouteHelpOpen((v) => !v)}
            className="flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center rounded-full text-[13px] font-bold"
            style={{
              background: routeHelpOpen ? "#fff" : "rgba(255,255,255,0.18)",
              color: routeHelpOpen ? tone : "#fff",
            }}
          >
            ?
          </button>
        )}
        {preferred !== HOME && (
          <button
            type="button"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={snapHome}
            aria-label={c.snapBack}
            title={c.snapBack}
            className="flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center rounded-full text-white"
            style={{ background: "rgba(255,255,255,0.18)" }}
          >
            <Shrink size={15} strokeWidth={2.25} aria-hidden />
          </button>
        )}
        <button
          ref={collapseRef}
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
        <span className={`${lesson ? "hidden" : "flex"} shrink-0 gap-[3px] opacity-75`} aria-hidden>
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
      <div ref={bodyRef} className="min-h-0 overflow-y-auto p-5">
        {showPractice ? (
          <>
            <p role="status" className="m-0 text-[22px] font-medium leading-tight text-[#202124]">{script.line}</p>
            {practice.stage === "click" && (
              <div className="mt-3 rounded-xl bg-[#f1f3f4] p-3">
                <button data-practice-focus type="button" className="flex min-h-16 w-full items-center justify-center gap-3 rounded-xl border-2 border-[#0b57d0] bg-[#0b57d0] px-3 text-white"
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
                className="mt-3 h-36 overflow-y-auto overscroll-contain rounded-xl bg-[#f1f3f4] p-3 text-[#202124]" style={{ touchAction: "pan-y", scrollbarGutter: "stable" }}>
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
            <p className="mt-3.5 mb-0 whitespace-pre-line rounded-[14px] bg-[#f1f3f4] px-3.5 py-3 text-[15px] leading-[1.35] text-[#3c4043]">
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
          data-card-line
          className={`m-0 ${script.routeChoices ? "text-[20px]" : "text-[27px]"} font-medium leading-[1.2] tracking-[-0.01em] text-[#202124]`}
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

        {script.routeChoices && (previewRoute ? (
          <div className="mt-3 grid gap-2">
            <p className="m-0 font-semibold">{COURSE_ROUTE_LABELS[previewRoute][lang]}</p>
            <p className="m-0 text-[15px] leading-relaxed">{COURSE_ROUTE_DESCRIPTIONS[previewRoute][lang]}</p>
            {previewRoute !== "pause" && <p className="m-0 text-[14px] text-[#5f6368]">{ROUTE_HELP_COPY.storyDays[lang]}</p>}
            <button type="button" data-testid="course-route-confirm" disabled={routeSaving}
              className="job-card-primary min-h-11 bg-[#0b57d0] px-3 py-2 font-semibold text-white"
              onClick={async () => { await chooseCourseRoute(previewRoute); closeChooser(); }}>
              {(previewRoute === "pause" ? ROUTE_HELP_COPY.confirmPause : ROUTE_HELP_COPY.confirm)[lang]}
            </button>
            <button type="button" disabled={routeSaving} className="min-h-11 text-[#0b57d0]" onClick={() => setPreviewRoute(null)}>
              {ROUTE_HELP_COPY.backToChoices[lang]}
            </button>
          </div>
        ) : (
          // Two columns, short tags: all five options stay visible on a
          // Chromebook at 150% zoom (911x512) without scrolling the card.
          <div className="mt-3 grid grid-cols-2 gap-2">
            {COURSE_ROUTES.map((route) => {
              const state = routeChoiceState(route, courseRoute, route !== "pause" && courseComplete(completedTaskKeys, route));
              const wide = route === "pause" && !choosingRoute;
              return (
                <button key={route} type="button" data-testid={`course-route-${route}`}
                  disabled={routeSaving || state !== "open"}
                  aria-describedby={`course-route-tag-${route}`}
                  className={`${wide ? "col-span-2 " : ""}min-h-11 rounded-xl border border-[#dadce0] px-3 py-2 text-left text-[15px] font-medium leading-tight hover:bg-[#e8f0fe] disabled:opacity-50`}
                  onClick={() => setPreviewRoute(route)}>
                  {COURSE_ROUTE_LABELS[route][lang]}
                  <span id={`course-route-tag-${route}`} className="mt-1 block text-[13px] font-normal leading-snug text-[#5f6368]">
                    {state === "finished" ? ROUTE_HELP_COPY.finished[lang]
                      : state === "current" ? ROUTE_HELP_COPY.inProgress[lang]
                      : COURSE_ROUTE_TAGS[route][lang]}
                  </span>
                </button>
              );
            })}
            {choosingRoute && (
              <button type="button" className="min-h-11 rounded-xl px-3 text-[15px] text-[#0b57d0]" onClick={closeChooser}>
                {(chooserMode === "change" ? ROUTE_HELP_COPY.keep : ROUTE_HELP_COPY.notNow)[lang]}
              </button>
            )}
          </div>
        ))}
        {/* A lesson needs no account. Signing in (to carry this finish to a
            teacher) is a quiet link for a guest, so it never reads as a step
            the lesson requires; only a failed save gets a real button. */}
        {lesson && script.tone === "green" && lesson.save.status === "guest" && (
          <button
            type="button"
            data-testid="lesson-sign-in"
            onClick={() => lesson.save.signIn(lang)}
            className="mt-1 min-h-10 cursor-pointer text-[15px] font-medium text-[#0b57d0] underline underline-offset-4"
          >
            {LESSON_COPY.signInToSave[lang]}
          </button>
        )}
        {lesson && script.tone === "green" && lesson.save.status === "error" && (
          <button
            type="button"
            data-testid="lesson-retry-save"
            onClick={() => lesson.save.retry()}
            className="mt-3 flex min-h-12 w-full cursor-pointer items-center justify-center rounded-[16px] border-2 text-[17px] font-medium"
            style={{ borderColor: TONE.blue, color: TONE.blue, background: "#fff" }}
          >
            {LESSON_COPY.tryAgain[lang]}
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
        {/* After a direction ends (or at Stop here), another one is a quiet
            link under the main button. Mid-direction it lives in Help. */}
        {!lesson && active === null && directionPlacement === "link" && coreComplete(completedTaskKeys) && !script.routeChoices && !saving && !saveError && (
          <button type="button" className="mt-2 min-h-11 w-full text-[15px] text-[#0b57d0]" onClick={() => setChoosingRoute(true)}>
            {ROUTE_HELP_COPY.change[lang]}
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
            style={
              script.equalPair
                ? { background: tone }
                : introBeat < INTRO_BEATS.length
                  // The practice offer is the one secondary that beginners
                  // most need, so it gets an outline instead of grey text.
                  ? { color: "var(--text-primary)", border: "2px solid var(--border)" }
                  : { color: "var(--text-secondary)" }
            }
          >
            {script.secondaryLabel}
          </button>
        )}

        {/* A lesson's one setting: how much the card spells out. It lives on
            the card because the card is what it changes, but as one quiet
            link offering the other level, so it reads as an option and never
            competes with the step above it. */}
        {lesson && script.tone !== "green" && (() => {
          const other = lesson.mode === "guided" ? "independent" : "guided";
          const hintLabel = LESSON_COPY[other === "independent" ? "fewerHints" : "moreHints"][lang];
          // Narrow screens have no docked info card, so the card offers it.
          // It glows when the step or correction sends the learner there.
          const pointedAt = MENTIONS_INFO_CARD.test(`${script.line} ${visibleCorrection}`);
          const quiet =
            "flex min-h-10 cursor-pointer items-center gap-1.5 rounded-full px-3 text-[14px] font-medium text-[#5f6368] underline-offset-4 hover:text-[#1f1f1f] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0b57d0]";
          return (
            <div className="mt-2 flex flex-wrap items-center justify-center gap-x-2">
              {/* The way out of a lesson, so a learner in the wrong one
                  never needs the browser's Back button. */}
              <button
                type="button"
                data-testid="lesson-leave"
                onClick={() => lesson.onFinish(lang)}
                aria-label={LESSON_COPY.leaveLabel[lang]}
                className={quiet}
              >
                <ArrowLeft size={16} aria-hidden />
                {LESSON_COPY.leave[lang]}
              </button>
              <button
                type="button"
                data-testid="lesson-info-open"
                aria-expanded={lesson.infoOpen}
                onClick={() => lesson.setInfoOpen(!lesson.infoOpen)}
                className={`${quiet} lesson-info-control xl:hidden ${pointedAt && !lesson.infoOpen ? "animate-showme-pulse-compact text-[#5b3a1e]" : ""}`}
              >
                <IdCard size={16} aria-hidden />
                {LESSON_COPY.infoOpen[lang]}
              </button>
              <button
                type="button"
                data-testid={`lesson-mode-${other}`}
                onClick={() => lesson.setMode(other)}
                aria-label={`${LESSON_COPY.supportLabel[lang]}: ${LESSON_COPY[lesson.mode][lang]}. ${hintLabel}`}
                className={quiet}
              >
                {hintLabel}
              </button>
            </div>
          );
        })()}

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
          <button type="button" data-practice-exit className={`min-h-12 w-full rounded-xl px-3 font-medium ${practice.stage === "complete" ? "bg-[#0b57d0] text-white" : "text-[#5f6368] underline hover:bg-[#f1f3f4]"}`} onClick={exitPractice}>
            {practice.stage === "complete" ? INTRO_BEATS[0].cta?.[lang] : pc.skip[lang]}
          </button>
        </div>
      )}
    </div>
  );
}
