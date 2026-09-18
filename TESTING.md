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

### The e2e database (set up once)

The suite needs a database of its own, and CI applies the schema to it before
every run. This is not optional tidiness — it is the fix for a real outage of
the suite. The `role` column was added to `schema.ts` on 2026-09-05 and never
pushed to the e2e database; the first full CI run of the browser suite failed
**all 30 tests** on `column "role" does not exist`, months later, because
`findLearner` selects every column the schema declares. There are no migration
artifacts in this repo, so a database only has what someone last pushed to it.

One-time setup:

1. In Neon, create a database named **`workplace_e2e`** (a new branch is fine,
   but the *database* name is what matters). Do not reuse the production
   database, and do not keep Neon's default `neondb` name — the workflow
   refuses to run unless the name contains `e2e` or `test`, because the step
   that applies the schema can drop columns.
2. Add two repository secrets under **Settings → Secrets and variables →
   Actions**:
   - `E2E_DATABASE_URL` — the connection string for that database.
   - `E2E_SESSION_SECRET` — any random string. Generate one with
     `node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"`.
3. That is all. `.github/workflows/e2e.yml` runs `drizzle-kit push` against it
   before the tests, so the database can never drift behind the branch again.

The workflow deliberately does **not** read `secrets.DATABASE_URL`. Since it
applies schema changes, a separate secret makes pointing it at production a
deliberate act rather than a typo.

To run the suite locally against that same database:
`DATABASE_URL="<E2E_DATABASE_URL>" SESSION_SECRET=anything npm run test:e2e`,
or put both in `.env.local` (see `.env.example`) and run `npm run db:push`
first.

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

## First-release regression coverage

`course-routes.test.ts` exercises each selected route, switching, boundaries, and absence of skipped-task credit. `release-redesign.test.ts` covers English/Spanish objective facts and plausible rejections. `writing-actions.test.ts` checks authenticated learner-only retrieval and failure propagation. Browser tests cover the route chooser across reload, direct office presets, portfolio restoration and copying, and a failed writing save followed by reload and retry.

The Playwright config loads local Next environment files for its database-backed teacher tests. Use the configured test cohort; never point tests at learners' accounts. Generated browser reports are ignored by lint.

Automated tests do not demonstrate learner transfer. Track the remaining observed bilingual opening and route sessions in [curriculum/launch-pilot.md](curriculum/launch-pilot.md).


The remaining-issues batch adds `decision-practice.test.ts` and `decision-practice.spec.ts`: requester authorization choices, multiple supported priorities, required review evidence, restoration of older/newer draft layouts, and identical clipboard/download summaries with denied-clipboard recovery. Browser tests also preserve previously earned review completion when no new evidence field was saved. Actual learner transfer and the full manual core coverage register remain separate, open pilot requirements.

`meeting-recovery.spec.ts` exercises EN/ES transcript access beside notes and follow-up, Help return, labeled field access, keyboard activation of transcript/return controls, in-session draft retention across alternate view order, and wrong-action recovery for the structured action list. It does not establish complete keyboard accessibility or draft restoration across reload.

`route-resume.spec.ts` earns the first office task through the UI, switches through all directions and pause with reloads in EN/ES, and checks the exact persisted completion set for that fresh test learner. It verifies return to the next office task and keyboard-selected requirement states; Studio supplies only the core setup. It does not substitute for completing every route or observing learner understanding.

`absence-writing.test.ts` covers short EN/ES absence replies, smart apostrophes, whitespace, and rejection of messages missing absence/shift context. `absence-writing.spec.ts` checks sickness-only rejection, retained text, Job Card recovery, and successful short replies in both languages. These authored cases do not establish unrestricted language understanding.

`coworker-location.test.ts` covers short EN/ES storage-location replies and unrelated/wrong-location rejections. `coworker-location.spec.ts` checks Job Card correction, retained text, and successful concise replies. Location-term recognition does not establish complete semantic or tone assessment.
