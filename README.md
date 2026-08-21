# Workplace Simulator

A practice sandbox where adult learners rehearse everyday workplace technology tasks —
reading a supervisor's email, replying, attaching a file — in a safe, simulated environment
with no real accounts or data.

Built as a Next.js app with a light, Chromebook-flavored interface: flat surfaces, a single
accent color, generous spacing, and one primary action visible at a time to keep cognitive
load low for busy adult learners.

## Structure

- `/login` — sign in with a first name, a 4-digit PIN, and a class code. No email or
  password; first-time use creates the profile.
- `/` — the simulated desktop: one focused "do this next" card plus a shelf of work apps.
  Server component (`page.tsx`) checks the session and loads real progress; `DesktopClient.tsx`
  is the interactive shell.
- `/mail` — the email task: inbox, read/reply/compose, a file picker, a 2-minute help lesson,
  and a confidence check-in at the end. Same server/client split (`page.tsx` /
  `MailClient.tsx`); completing the task calls the `completeTask` server action.
- `src/lib/auth.ts` — signed session cookie (HMAC, no external auth library) and PIN
  hashing (`scrypt`).
- `src/lib/db/` — Postgres (Neon, via Vercel Marketplace) accessed with Drizzle ORM:
  `schema.ts` (learners / task_completions / badges), `client.ts` (lazy connection),
  `queries.ts` (typed helpers).
- `src/app/actions.ts`, `src/app/login/actions.ts` — server actions for login/signup,
  logout, and recording a task completion.
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
vercel env pull --yes   # pulls DATABASE_URL, SESSION_SECRET, etc. into .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). To change the DB schema, edit
`src/lib/db/schema.ts` then run `npx dotenv -e .env.local -- npx drizzle-kit push`.

## Design notes

- Only one email task ("Answer your supervisor") is fully built out; the other desktop apps
  show a preview sheet with a "Coming soon" state, matching the intended full build.
- Language, "simple words," and "read aloud" toggles live in a single settings popover (mail
  task) instead of as separate always-visible buttons, to reduce visual clutter.
- Wrong actions (wrong email, Forward instead of Reply, wrong file) never break the task —
  they show a short coaching toast and let the learner keep trying.
- Accounts are intentionally low-friction for a shared classroom device: first name + a
  self-chosen 4-digit PIN + a class code from the instructor. No email, no password rules.
