# Workplace Simulator

A practice sandbox where adult learners rehearse everyday workplace technology — reading a
supervisor's email, checking a schedule, reading a pay stub, looking something up in the
handbook — in a safe, simulated environment with no real accounts or data.

Built as a Next.js app with a light, Chromebook-flavored interface: flat surfaces, a single
accent color, generous spacing, and a persistent shelf/launcher — like the real work
Chromebook a learner would actually use, since most workplace tools live inside one browser
rather than as separate desktop apps.

## First-release implementation (September 2026)

Acts I–II are the shared core. The Job Card then offers **Stay and lead** (III–IV), **Healthcare/front desk** (V Path B), **Office/admin** (VI–VII), **College preparation** (V Path A), or **Stop here for now**. Direction is saved to the signed-in learner and can be changed at the desktop without erasing progress. Skipped tasks receive no credit. Route endings offer other directions as choices.

The runtime contains **37 levels and 51 active tasks**; older folder numbers are editorial labels. `LEVELS` in `src/lib/tracks-content.ts` is authoritative. There are no new levels in this release. Studio can start after Act II or at a later level and seeds only that route’s prerequisites. Studio progress is simulated test setup, not learner assessment.

Saved writing is retrieved for the authenticated learner. Portfolio reflections restore after reload; the copied summary uses the selected language and describes simulated practice. Application examples carry into résumé and interview drafts for editing. Suggested work history is limited to completed simulated roles. Submission failures keep a retryable payload on the learner’s device and report through the Job Card; success is shown only after persistence succeeds. Teacher review remains optional.

Revised practice includes choosing an enrollment document, finding a syllabus deadline, identifying an appointment conflict, accepting the stated offer/start date, transferring fictional reference details into simplified forms, finding the receipted expense total and answering a coworker question, recording a changed meeting assignment, and reporting the correct sheet total and calendar commitment. Multi-person scheduling retains its comparison calendar. Video-call learners can recover by muting again.

Completion demonstrates the bounded decision and tool actions in the scenario. It does not certify employment readiness, independent transfer, legal-form competence, or writing quality. Human learner testing remains required; see [launch pilot protocol](curriculum/launch-pilot.md).

The remaining-issues implementation adds a verified chart-recipient choice, supported priority/reason choices, and a profile-evidence selection for performance reviews. Decisions are saved alongside writing; older submissions and earned completions remain valid. Review drafts can be reopened for revision. Portfolio copy and UTF-8 text download share one formatter, with clipboard failure recovery in the Job Card. See [the remaining-issues plan](curriculum/remaining-issues-plan.md) for the still-open learner checks.

## The one rule

**The Job Card is the only thing that tells a learner what to do.** Everything else — the
desktop, the browser, every task app — stays quiet and realistic. Before this rule the
product had six competing instruction surfaces; for an adult with low digital literacy that
was six voices to sort through. If you are adding a feature and it wants to tell the learner
what to do next, it reports to the Job Card instead of drawing its own banner.

See [`src/lib/job-card-context.tsx`](src/lib/job-card-context.tsx) — its header comment is the
contract. Tasks *report* (the step they're on, a wrong click, the finish); the card decides
what the learner reads.

## Getting started

```bash
npm install
vercel env pull --yes   # pulls DATABASE_URL, SESSION_SECRET, etc. into .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). To change the DB schema, edit
`src/lib/db/schema.ts` then run `npx dotenv -e .env.local -- npx drizzle-kit push`.

Run `npm run check` (lint + typecheck + unit tests, a few seconds) before any deploy.
See [TESTING.md](TESTING.md) for the full testing story, including the `/studio` time machine.

## How the screen is put together

Everything runs as **windows managed client-side on one page**, like a real desktop —
not separate route navigations — so an app can be minimized and restored with its state
intact, and the shelf can show a "running" indicator for open apps.

- `/login` — sign in with a first name, a 4-digit PIN, and a class code. No email or
  password; first-time use creates the profile.
- `/` — the only real screen after login. The server component (`page.tsx`) checks the
  session and loads real progress; `DesktopClient.tsx` renders the desktop and hosts the
  providers. `/browser`, `/pdf-reader`, and `/mail` are redirect shims to `/` for old links.
- `/studio` — instructor/dev tools, including the time machine (see TESTING.md).
- `/certificate/[learnerId]` — the printable certificate.

### Apps

- **Browser** (`src/app/browser/BrowserClient.tsx`) — the main workspace, with a real tab
  strip, address bar, and bookmarks bar. Most tasks are tabs here: WorkMail
  (`src/app/mail/MailClient.tsx`), Employee Portal, Handbook, Calendar, Files, Sheets, and
  the rest. Each task's UI is its own `*Task.tsx` in `src/app/browser/`.
- **PDF Reader** (`src/app/pdf-reader/PdfReaderClient.tsx`) — a real second app, since PDFs
  open natively rather than as a tab.
- `src/components/Shelf.tsx` — the persistent bottom shelf: app pins with a running dot, a
  launcher with search, and the account tray (sign-out, language, brightness). Clicking a
  pin opens / minimizes / restores, like a real taskbar.

## Where things live

| Path | What it holds |
| --- | --- |
| `src/lib/tracks-content.ts` | `LEVELS`, `TRACKS`, `ACTS`, `TASK_INFO` — the spine of the game. |
| `src/lib/desktop-content.ts` | `APP_DEFS` and `TASK_KEYS` (the task union used for progress). |
| `src/lib/tasks/<task>/content.ts` | One file per task: its copy, lessons, pickable items, and pass/fail rules. Pure, no React. |
| `src/lib/job-card-context.tsx` | The single instruction voice's state source. |
| `src/lib/progress-context.tsx` | `useProgress()` — completions, points, language, celebrations. |
| `src/lib/window-manager.tsx` | Which apps are open / minimized / active. |
| `src/lib/db/` | Neon Postgres via Drizzle: `schema.ts`, `client.ts`, `queries.ts`. |
| `src/lib/auth.ts` | Signed session cookie (HMAC) and `scrypt` PIN hashing. No auth library. |
| `src/components/task/` | Task-agnostic UI reused everywhere: `JobCard`, `HelpDrawer`, `PickerModal`, `ShowMeHighlight`. |
| `curriculum/` | Curriculum guidance for 37 runtime levels across 7 acts; older folder numbers are editorial. |

## Content and progress

Learners move through **levels**, grouped into **acts**, each level a small group of tasks
that unlock according to the shared core and selected route. All 37 runtime levels and
51 active tasks are wired in `tracks-content.ts` (Acts I–VII, including both Act V paths). See
[`curriculum/00-scope-and-sequence.md`](curriculum/00-scope-and-sequence.md) for the roadmap.

- `progress-context.tsx` holds `completedTaskKeys` client-side and seeds from the server —
  because windows never navigate away from `/`, server-fetched progress would otherwise go
  stale for the whole session. Call `markComplete(taskKey, badgeKey?)` rather than the
  `completeTask` server action directly, so the desktop, shelf, and Job Card all update.
- A level with `levelUp` copy fires the full-screen `LevelUpCelebration`; otherwise a
  completed track falls through to the smaller `TrackCelebration`. Only one modal per
  completion, level-up wins.

## Design notes

- **No task is a dead end.** Wrong actions (wrong email, Forward instead of Reply, wrong
  file) never fail a learner — they produce a short correction through the Job Card and let
  them keep trying. `task-forgiveness.test.ts` pins this down.
- **All learner-facing copy is `Localized` (`{ en, es }`).** The content-integrity suite
  fails the build if one half is missing — an English string in Spanish mode is invisible in
  review and fatal for a learner working alone.
- **No level exceeds 4 tasks.** The cognitive-load ceiling is a failing test, not a hope.
- Accounts are intentionally low-friction for a shared classroom device: first name +
  self-chosen 4-digit PIN + class code. No email, no password rules.
- Shared logic takes `now` as a parameter (see `release-ladder.ts`) rather than calling
  `Date.now()` internally, so it stays testable.
