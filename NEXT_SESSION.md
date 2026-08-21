# Pick up here next time

## Where things stand

**The curriculum is fully written end to end** (24 levels, 7 acts — New
Hire → Shift Lead → Shift Supervisor → Assistant Manager → an optional
Bridge elective (college-prep or healthcare-admin) → Office Administrator →
Team Lead), grouped into `curriculum/act-1-new-hire/` through
`curriculum/act-7-team-lead/`, each containing its level-N-*/ folders. See
`curriculum/00-scope-and-sequence.md` for the full roadmap and design
rationale (async, 20-min/week, office-hours-and-Classroom-are-optional
throughout).

**In code, only Act I (Levels 1-2) and Level 3 are built.** Levels 4-24 are
curriculum-only — the task keys don't exist in `tracks-content.ts` yet.

**Act I just got a full "make it feel like a game" pass** — the user
wants the whole simulator to commit harder to the storyline, Oregon-Trail
style ("Oh no! A customer just slipped...") event framing, and real
celebratory moments, not just checkmarks. Built tonight, scoped to Act I
(Levels 1-2) as requested — the same pattern is ready to extend to Act II+
whenever that's next:

1. **Event intro cards** — every one of Act I's 6 tasks (`mail`,
   `schedule`, `timeclock`, `paystub`, `incident`, `handbook`) now opens on
   a dramatic scenario card (new `EventIntroCard` component,
   `src/components/task/EventIntroCard.tsx`) before the actual task UI —
   an emoji, a punchy headline, a body, and a CTA button. Copy lives in
   each task's `content.ts` as a new `EVENT_INTRO: Record<Lang, EventIntroCopy>`
   export (EN/ES). Each task component gained a new first `View` state,
   `"intro"`, shown only on a fresh attempt — an already-completed task
   still opens straight to its "done" card (last session's fix), and
   "Try Again" skips back to the task's normal starting view, not the
   intro, so the drama doesn't repeat on replay.
2. **A real level-up moment** — `Level` in `tracks-content.ts` gained an
   optional `levelUp: LevelUpCopy` field (emoji/kicker/title/body/cta).
   `level2` ("Settling In") has one: "🎉 You survived Day One!" —
   `level1`/`level3` don't yet (level1 has no prior level to level up
   from; level3's welcome copy is Act II's job to write). New
   `celebrateLevel` state + `dismissLevelCelebration` in
   `progress-context.tsx`: when a task completion finishes an entire
   level (not just a track) AND the next level has `levelUp` copy, a new
   full-screen `LevelUpCelebration` component (bigger than the existing
   per-track `TrackCelebration`) fires instead of the smaller per-track
   popup — only one modal shows per completion, level-up takes priority.
   Only levels with `levelUp` defined get this treatment; a level without
   it just falls through to the existing per-track celebration, so this
   scales cleanly as more levels get `levelUp` copy later.
3. **Confetti, everywhere something is earned** — new
   `src/components/task/Confetti.tsx`, a lightweight hand-rolled CSS
   confetti burst (no new dependency). Uses a *deterministic* pseudo-random
   seeded by index (`Math.sin`-based, not `Math.random()`) so server and
   client render identical markup — no hydration mismatch, no
   `setState`-in-effect lint violation either. Wired into `TaskDoneCard`
   (small burst), `TrackCelebration` (medium), and the new
   `LevelUpCelebration` (biggest). New CSS keyframes in `globals.css`:
   `confetti-fall` and `pop-in` (a bouncy scale-in used on badge icons/
   emoji across all three celebration surfaces).
4. **Small cleanup**: `Shelf.tsx` had its own local `isLevelComplete`
   closure duplicating logic — replaced with a new shared
   `isLevelComplete(level, completedTaskKeys)` export from
   `tracks-content.ts` (also used by the new level-up trigger logic). Also
   added `nextLevel(level)`.

`npm run build` and `npm run lint` both pass. **Not yet done:** a live
browser playtest — the Chrome extension was disconnected this session, so
this was verified by careful code review + build/lint only, not by
actually clicking through it. Worth doing before calling this fully done.

## What's next (pick one)

### Option A — Playtest tonight's Act I changes first

Before building more, actually click through Level 1 → Level 2 in a real
browser (reconnect the Chrome extension, or `npm run dev` and look
yourself) — confirm the event intro cards look right in both the
two-pane `MailClient` layout and the simpler `PortalPage`/`IncidentTask`/
`HandbookTask` layouts, and that the Day-One level-up modal actually fires
once, at the right moment, without double-popping alongside a track
celebration.

### Option B — Extend the same game-feel pass to Act II (Level 3)

Level 3 ("Shift Lead") currently has no `EVENT_INTRO` cards and no
`levelUp` welcome copy for entering it. Same pattern as tonight: add
`EVENT_INTRO` to `calendar`/`files`/`spreadsheet`'s `content.ts` files,
wire an `"intro"` view into `CalendarTask`/`FilesTask`/`SpreadsheetTask`,
and write `level3.levelUp` copy in `tracks-content.ts` (the "you're a
Shift Lead now" moment, currently the biggest gap since Level 2 → Level 3
is the actual in-story promotion).

### Option C — Build Act II's levels 4-5 in code

Lesson docs are written (`curriculum/act-2-shift-lead/level-4-reporting-in/`,
`.../level-5-covering-more-ground/`). Per those docs: `status-report`
(student authors `=SUM()` themselves off the Level 3 spreadsheet, cc's a
second recipient) and `triage` (two competing requests open at once).
Reuses `SpreadsheetTask.tsx`'s UI pattern and the `mail`/`files`
picker-modal pattern.

### Option D — Build a later act in code instead

Any later act's lesson docs are ready to build from too (see
`curriculum/act-N-.../`). Building out of order is fine for content;
`LEVELS` in `tracks-content.ts` needs every level up to whichever one you
build to exist (even as stubs), or `levelForTrack()`'s
fallback-to-last-level logic will misattribute tracks.

## Reminder for whichever you pick

Verification pattern that's worked so far: `npm run build` + `npm run
lint`, then ideally a real click-through (reconnect the Chrome extension,
or `npm run dev` on a free port — **3000 is often already taken**, check
`lsof -i :3000` first, use `PORT=3100` if so). For a deeper smoke test,
temporarily `npm install -D playwright@1.62.1` (+
`npx playwright install chromium`), drive the task end-to-end with a
throwaway script, screenshot each step, then clean up (`rm` the script,
`npm uninstall playwright`) before committing.

Also worth knowing:
- `TASK_LOCATIONS` in `tracks-content.ts` is a
  `Partial<Record<TaskKey, ...>>` — an unbuilt next task shows "More
  coming soon" instead of a dead button.
- `LEVELS` drives the wallpaper via `levelForTrack()`, tab-management via
  the `freeTabbing` flag, and now the level-up celebration via the
  `levelUp` field. A new level needs a home in some track's `trackKeys`
  and an entry in `LEVELS`, or things fall back to the last level.
- Random values in any client component must be deterministic (seeded by
  index/props) or generated after mount via an event handler — not
  `Math.random()` directly in render (hydration mismatch) and not
  `setState` synchronously inside a bare `useEffect` on mount (this
  repo's ESLint config treats that as an error, per `Confetti.tsx`'s
  approach).
