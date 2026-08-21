# Workplace Simulator

A practice sandbox where adult learners rehearse everyday workplace technology tasks —
reading a supervisor's email, replying, attaching a file — in a safe, simulated environment
with no real accounts or data.

Built as a Next.js app with a light, Chromebook-flavored interface: flat surfaces, a single
accent color, generous spacing, and one primary action visible at a time to keep cognitive
load low for busy adult learners.

## Structure

- `/` — the simulated desktop: one focused "do this next" card plus a shelf of work apps.
- `/mail` — the email task: inbox, read/reply/compose, a file picker, a 2-minute help lesson,
  and a confidence check-in at the end.
- `src/lib/desktop-content.ts` — desktop-only bilingual copy and app definitions (`APP_DEFS`,
  `APP_COPY`, `DESKTOP_COPY`, `RECENT_ITEMS`).
- `src/lib/tasks/<task>/content.ts` — one file per task (starting with `mail/`) holding that
  task's copy, lessons, coach steps, and pickable items.
- `src/lib/task-types.ts` — shared shapes (`Lesson`, `ConfidenceOption`, `PickableItem`) every
  task's content implements, so new tasks don't redefine them.
- `src/components/task/` — task-agnostic UI reused across tasks: `HelpDrawer`,
  `ConfidenceCheck`, `CoachBanner`, `SettingsPopover`, `ProgressBar`, `PickerModal`,
  `NudgeToast`.
- `src/lib/use-nudge.ts` — the "show a coaching toast for a few seconds" hook behind
  `NudgeToast`.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Design notes

- Only one email task ("Answer your supervisor") is fully built out; the other desktop apps
  show a preview sheet with a "Coming soon" state, matching the intended full build.
- Language, "simple words," and "read aloud" toggles live in a single settings popover (mail
  task) instead of as separate always-visible buttons, to reduce visual clutter.
- Wrong actions (wrong email, Forward instead of Reply, wrong file) never break the task —
  they show a short coaching toast and let the learner keep trying.
# workplace-simulator
