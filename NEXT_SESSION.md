# Pick up here next time

## Where things stand

**A full curriculum redesign was scoped tonight**, planned out in
`~/.claude/plans/before-we-continue-to-mellow-dawn.md` (also worth copying
into the repo if you want it version-controlled). Short version: the arc
grows from today's 2 levels to a ~26-level, ~7-act progression (New Hire →
Shift Lead → Shift Supervisor → Assistant Manager → an optional
college-prep/healthcare-admin elective → Office Administrator → Team Lead
capstone), explicitly designed around **20-minute, once-a-week, fully async
sessions** — office hours and Google Classroom stay optional, never gating.
Read the plan file for the full rationale (grounded in Northstar Digital
Literacy, CASAS, WIOA/IET-bridge-program precedent, cognitive load theory,
etc.) and the level-by-level table.

**Progress against that plan's build order tonight:**

1. ✅ **Reshuffled Act I into 2 levels.** `LEVELS` in `tracks-content.ts` is
   now 3 levels, not 2:
   - `level1` — "New Hire, Day One" (`starter` track: `mail` only)
   - `level2` — "Settling In" (`schedules` + `judgment` tracks: `schedule`,
     `timeclock`, `paystub`, `incident`, `handbook`)
   - `level3` — "Shift Lead" (`growing` track: `calendar`, `files`,
     `spreadsheet` — this is the old "Level 2")
   - `Level.freeTabbing` (new, optional field) replaces the old hardcoded
     `isLevel2`/`"level2"` string checks in `BrowserClient.tsx` — only
     `level3` has it `true` today, but this now scales cleanly as more
     levels get added instead of assuming exactly two.
2. ✅ **Partially built the environment-reset gap** (see below) —
   NOT the full fix, but the highest-leverage piece of it.
3. ⬜ **Not started:** Act II's new levels 4-5 ("Reporting In" — student
   authors `=SUM()` + cc's a second recipient; "Covering More Ground" — two
   competing requests at once).

### What "environment reset" means now, and what's actually fixed

The old gap: once a learner finished a task and moved on, revisiting that
task's app (e.g. reopening Hmail after already replying to Maria) reset the
component's local view state back to the raw, ungraded scenario — Maria's
email looked unread and pending forever, no matter how many levels later you
opened it.

**Fixed tonight:** every task component (`MailClient`, `ScheduleTask`,
`TimeclockTask`, `PaystubTask`, `IncidentTask`, `HandbookTask`,
`CalendarTask`, `FilesTask`, `SpreadsheetTask`) now initializes its `view`
state from `completedTaskKeys` (via `useProgress()`) instead of always
starting at the raw scenario — e.g.
`useState<View>(completedTaskKeys.includes("mail") ? "done" : "empty")`.
Revisiting an already-completed task now lands directly on its "done"
summary card, not the live pending scenario. "Try Again" still works if a
learner wants to redo it.

**Still NOT fixed** (deliberately deferred — this is real content-authoring
work, not a code fix): the underlying *content* itself
(`src/lib/tasks/*/content.ts`) is still one static scenario per task, not
level-keyed. So the actual email text / schedule rows / pay stub numbers
never change to reflect "you're a Shift Supervisor now, not a New Hire" —
only whether the task *looks* freshly-pending vs. already-handled. Making
the content itself level-aware is bigger surgery (see the survey findings:
each `content.ts` is a flat static export, no level parameter anywhere) and
should happen naturally as Acts III+ get built with genuinely new scenarios
per level rather than reused ones.

Everything currently on `main`'s working tree (not yet committed as of
writing this) — `git status` before continuing.

## What's next (pick one)

### Option A — Continue the plan's build order: Act II levels 4-5

Per the plan file: "Reporting In" (new task — student authors `=SUM()`
themselves off the Level 3 spreadsheet, cc's a second recipient, introduces
cc/bcc) and "Covering More Ground" (two competing requests open at once —
first "divided attention" level). Reuses `SpreadsheetTask.tsx`'s UI pattern
and the `mail`/`files` picker-modal pattern. This is the natural next step.

### Option B — Start drafting Act III (Shift Supervisor, levels 6-9) content

Per the plan's table: scheduling *for others*, formula debugging (not just
verification), a *created* (not just accepted) meeting, and a
triage-under-ambiguity capstone level. Needs its own lesson-doc pass in
`curriculum/level-3-.../` (following the existing template) before
implementation, same as Level 1/2 originally did.

### Option C — Realism & accessibility pass (lower priority, do last)

Vary distractor names/content; keyboard-nav and screen-reader pass;
color-contrast check (WCAG AA); responsive check at tablet/Chromebook scale.

## Reminder for whichever you pick

Verification pattern that's worked for every task so far: `npm run build` +
`npm run lint`, then temporarily `npm install -D playwright@1.62.1` (+
`npx playwright install chromium` if needed), run `npm run start` on a free
port (**port 3000 is often already taken by another local project** — check
`lsof -i :3000` first, use `PORT=3100` if so), drive the task end-to-end with a
throwaway smoke-test script, screenshot each step, then clean up (`rm` the
script, `npm uninstall playwright`) before committing.

Also worth knowing:
- `TASK_LOCATIONS` in `src/lib/tracks-content.ts` is a
  `Partial<Record<TaskKey, ...>>` — an unbuilt next task in the current
  track correctly shows a "More coming soon" card on the desktop instead of
  a dead button.
- `LEVELS` (also in `tracks-content.ts`) maps track keys → level, and
  drives the wallpaper via `levelForTrack()`. If a new track ever gets
  added, it needs a home in `LEVELS.trackKeys` or the wallpaper helper falls
  back to the last level. As of tonight it also carries the optional
  `freeTabbing` flag `BrowserClient.tsx` reads instead of a hardcoded level
  key — keep using that flag (not a new hardcoded string) for any future
  level that should unlock free tab management.
