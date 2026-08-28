# Testing

## Manual testing: the Studio time machine

`/studio` → **Time machine**: one click sets YOUR signed-in account's
progress to the start of any level (or fresh, or everything done), clears
the device-side story flags, and opens the learner desktop. One test
account can stand at any moment in the game — no pile of accounts. Combine
with: **Replay a level** (rewind one level, keeping the rest), an
**incognito window** (simulates a brand-new device: language, bigger text,
story flags reset), and throwaway sign-ups under class code `TEST` when you
truly need two learners at once.

## Automated: three layers, cheapest first

Run `npm run check` before any deploy — it's lint + typecheck + all unit
tests in a few seconds.

## 1. Content-integrity tests (the game's safety net)

`src/lib/__tests__/content-integrity.test.ts` — the most important suite in
the repo, and the one to extend every time content grows. This app's bugs
are rarely logic bugs; they're **wiring gaps**: a task added to a track but
missing its desktop button, an English-only string in Spanish mode, a level
pointing at a tab that doesn't exist. Every one of those is invisible in a
code review and fatal for a learner working alone.

The suite asserts, for every reachable task: TASK_INFO (both languages),
TASK_LOCATIONS, HANDOFF_CTA, SHIFT_MOMENT, BOOKMARK_LABEL, firstPersonSkill.
Plus: levels ↔ tracks ↔ acts stay consistent, and **no level exceeds 4
tasks** (the cognitive-load ceiling is now a failing test, not a hope).

The in-task `RIGHT_NOW_STEPS` / `RIGHT_NOW_LABEL` checks find their tasks by
globbing `src/lib/tasks/*/content.ts`, so a task added next month is covered
without editing this suite. (A guard test asserts the glob still matches
enough modules — an empty glob would otherwise pass vacuously.)

**When you add a task or level:** just run `npm test`. The failures list
exactly which wiring is missing.

## 2. Logic tests

- `progression.test.ts` — the game-loop invariant: a simulated learner
  follows the blue button from a fresh account and must visit every task
  exactly once with no dead ends. If "there is always a next job" ever
  breaks, this fails.
- `release-ladder.test.ts` — the help-fading ladder (climb, drop, 21-day decay).
- `task-forgiveness.test.ts` — pins down exactly how forgiving the Files
  rename is, that decoy sets always have exactly one target, and bilingual
  wrong-click hints.
- `task-grading.test.ts` — **every pure function that judges typed learner
  input**: the spreadsheet formula ranges, the "did the email explain the
  fix" check, the customer-reply safety check, and the meeting title/agenda
  rules. Each one pins both directions: real answers (in both languages,
  including phrasings the vocabulary wasn't seeded with) must be accepted,
  and the specific mistake the task teaches about must still be caught.
  A false rejection is the worst bug this app can ship — a learner working
  alone can't argue with a wrong "no" — so when in doubt, be lenient and
  say so in the test.
- `auth.test.ts` — the hand-rolled session cookie and PIN hashing: signature
  round-trip, tampered/forged/malformed tokens rejected, PINs salted so two
  learners choosing 1234 don't collide.

## 3. End-to-end (Playwright)

`e2e/first-session.spec.ts` drives a real browser through the real app:
sign-up → auto-opened tour → walkthrough clicks → level-up celebration →
Mail. Plus: choosing Español on the login page survives sign-in AND reload.

- One-time setup: `npx playwright install chromium`
- Run: `npm run test:e2e` (starts the dev server itself; needs
  `DATABASE_URL` in `.env`)
- Every run signs up a fresh learner under class code `TEST-E2E`, so it
  never touches real progress. Occasionally clear that class code's rows
  from the DB if you care about tidiness.
- On failure it saves a trace: `npx playwright show-trace <path>` replays
  the whole session frame by frame.

## What to test when adding a new task (the recipe)

1. Wire the content → `npm test` tells you what's missing (layer 1 is
   automatic).
2. If the task has its own pass/fail logic (a rename rule, a correct-option
   check), put that rule in the task's `content.ts` as a pure function and
   add a block to `task-grading.test.ts`. Write the accept cases first, and
   include at least one good answer phrased in words you did *not* put in the
   rule, plus its Spanish equivalent — that is the case that catches a
   too-narrow allowlist before a learner does.
3. Extend the e2e golden path only when a task joins the main Level 0–1
   flow. Add `data-testid` attributes for anything the test must click
   (see `bookmark-*` in `BrowserClient.tsx`) rather than matching on copy,
   so rewording never breaks tests.

## Rules that keep tests possible

- Shared logic takes `now` as a parameter (see `release-ladder.ts`) — never
  `Date.now()` inside the function.
- Task pass/fail rules live in `src/lib/tasks/*/content.ts` (pure, no
  React), not inside components.
- All learner-facing copy is `Localized` (`{ en, es }`) — the integrity
  suite enforces both halves are present.
