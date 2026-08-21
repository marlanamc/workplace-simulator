# Workplace Simulator

A practice sandbox where adult learners rehearse everyday workplace technology — reading a
supervisor's email, checking a schedule, reading a pay stub, looking something up in the
handbook — in a safe, simulated environment with no real accounts or data.

Built as a Next.js app with a light, Chromebook-flavored interface: flat surfaces, a single
accent color, generous spacing, and a persistent shelf/launcher — like the real work
Chromebook a learner would actually use, since most workplace tools live inside one browser
rather than as separate desktop apps.

## Structure

Everything runs as **windows managed client-side on one page**, like a real desktop —
not separate route navigations — so an app can be minimized and restored with its state
intact, and the shelf can show a "running" indicator for open apps.

- `/login` — sign in with a first name, a 4-digit PIN, and a class code. No email or
  password; first-time use creates the profile.
- `/` — the only real screen after login. Server component (`page.tsx`) checks the session
  and loads real progress; `DesktopClient.tsx` renders the desktop (wallpaper + "do this
  next" card) and hosts `WindowManagerProvider` (`src/lib/window-manager.tsx`), which tracks
  which apps are open/minimized/active. `/browser`, `/pdf-reader`, and `/mail` are just
  redirect shims to `/` for any old links — the real content lives in the components below,
  rendered as windows.
- **Browser** (`src/app/browser/BrowserClient.tsx`) — the main workspace. Real tab strip,
  address bar, and bookmarks bar; hosts:
  - **WorkMail** tab (`src/app/mail/MailClient.tsx`) — the email task: inbox,
    read/reply/compose, a file picker, a help lesson, and a confidence check-in. Completing
    it calls the `completeTask` server action.
  - **Employee Portal** tab (`PortalPage.tsx`) — schedule, time clock, and pay stubs.
    Currently read-only/explorable, not yet wired to graded completions.
  - **Handbook** tab (`HandbookPage.tsx`) — searchable reference articles.
- **PDF Reader** (`src/app/pdf-reader/PdfReaderClient.tsx`) — a real second app (not a
  browser tab, since PDFs open natively): a Downloads-style file list plus a document
  viewer, seeded with a couple of sample PDFs (`src/lib/pdf-content.ts`).
- `src/components/WindowControls.tsx` — the minimize/maximize/close trio in each app
  window's top-right. Minimize and close call into the window manager; maximize is a
  decorative nudge (there's no windowed/restore-size concept here, only full-screen).
- `src/components/Shelf.tsx` — the persistent bottom shelf/taskbar (app icons with a
  running-app dot, launcher with search, the ChromeOS-style account tray with
  sign-out/language/brightness), rendered once by `DesktopClient` and always on top.
  Clicking a pinned shelf icon opens the app if closed, minimizes it if it's the active
  window, or restores/focuses it otherwise — real taskbar behavior.
- `src/lib/auth.ts` — signed session cookie (HMAC, no external auth library) and PIN
  hashing (`scrypt`).
- `src/lib/db/` — Postgres (Neon, via Vercel Marketplace) accessed with Drizzle ORM:
  `schema.ts` (learners / task_completions / badges), `client.ts` (lazy connection),
  `queries.ts` (typed helpers).
- `src/app/actions.ts`, `src/app/login/actions.ts` — server actions for login/signup,
  logout, and recording a task completion.
- `src/lib/desktop-content.ts` — desktop app definitions (`APP_DEFS`: Browser, PDF Reader)
  and `TASK_KEYS` — the underlying curriculum tasks used for progress, independent of how
  many desktop app icons exist (several tasks live as browser tabs, not separate apps).
- `src/lib/tasks/<task>/content.ts` — one file per graded task (starting with `mail/`)
  holding that task's copy, lessons, coach steps, and pickable items.
- `src/lib/task-types.ts` — shared shapes (`Lesson`, `ConfidenceOption`, `PickableItem`) every
  task's content implements, so new tasks don't redefine them.
- `src/components/task/` — task-agnostic UI reused across tasks: `HelpDrawer`,
  `ConfidenceCheck`, `CoachBanner`, `SettingsPopover`, `ProgressBar`, `PickerModal`,
  `NudgeToast`.
- `src/lib/use-nudge.ts` / `src/lib/use-click-outside.ts` — small shared hooks (coaching
  toast auto-dismiss; closing a popover on an outside click).

## Getting started

```bash
npm install
vercel env pull --yes   # pulls DATABASE_URL, SESSION_SECRET, etc. into .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). To change the DB schema, edit
`src/lib/db/schema.ts` then run `npx dotenv -e .env.local -- npx drizzle-kit push`.

## Design notes

- Only the email task ("Answer your supervisor") is graded/wired to persistence right now.
  Employee Portal, Handbook, and PDF Reader are built out to be real and explorable, but not
  yet tied to badges/completions — that's the next layer to add, once the shell itself feels
  solid.
- Wrong actions (wrong email, Forward instead of Reply, wrong file) never break the task —
  they show a short coaching toast and let the learner keep trying.
- Accounts are intentionally low-friction for a shared classroom device: first name + a
  self-chosen 4-digit PIN + a class code from the instructor. No email, no password rules.
- The Shelf's own popovers (account tray, launcher) close on outside-click via
  `useClickOutside`, not an invisible full-screen backdrop — a backdrop nested inside the
  shelf's own stacking context ends up covering the shelf's own buttons.
