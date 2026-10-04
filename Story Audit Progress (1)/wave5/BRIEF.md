# Wave 5 re-audit: shared auditor brief

You are one of six auditors re-running the Story Mode Audit of the Workplace Simulator, a simulated Chromebook desktop that teaches adult ESOL beginners (English and Spanish) workplace computer skills. The original audit on 2026-09-27 graded 42 "sittings", one per story day. Since then, Waves 1–4 fixed 19 findings and added new practice. Your job is to grade what is on screen **now**, honestly, with evidence. Do not assume a fix works because a PR says so.

## Hard rules
- **Read-only on code.** Do not edit, create or delete anything under the repo (`/Users/marlanacreed/Downloads/Projects/Workplace-simulator`) except reading it. No git commands that change anything. No `npm run build`, and do not start or stop servers.
- The app is already running as a production build at **http://localhost:3300**. Use only that.
- Write your scripts, screenshots and report **only** under `/private/tmp/claude-501/-Users-marlanacreed-Downloads-Projects-Workplace-simulator/95301299-f0d1-494d-9afb-e73b344274ef/scratchpad/wave5/`. Screenshots go in `wave5/img/` with your segment letter as a prefix, for example `A-day2-911-text.png`.
- Sign up fresh learners under class code **`E2E-AUDIT5`**, PIN `1234`, and a name like `Audit5 A en 1`. That code can use Studio.
- The database is shared. Never touch any other learner, and never use the teacher account.

## How to drive the app
- Use Playwright from Node. Scripts are `.mjs` files in your folder that import `import { chromium } from "/Users/marlanacreed/Downloads/Projects/Workplace-simulator/node_modules/@playwright/test/index.mjs";`. Run them with `node file.mjs`. Headless is fine.
- Copy these patterns from the repo's e2e specs (read them):
  - `e2e/interactive.ts` (`waitForInteractive`, `clickIntoPage`)
  - `e2e/studio-arrival.ts` (arrival card: `[data-celebration-continue]`)
  - `e2e/first-session.spec.ts` (signup, Day 1–3)
  - `e2e/act-intro.spec.ts` (`act-intro-continue`)
  - `e2e/day12-handoff.spec.ts`, `e2e/upload-schedule.spec.ts`, `e2e/offline-recovery.spec.ts`, `e2e/closed-window-recovery.spec.ts`, `e2e/voicemail-message.spec.ts`, `e2e/story-hiring-mail.spec.ts`, `e2e/act-vii-team-lead.spec.ts`
- Signup: go to `/login`, click "Add user", fill placeholder "Jordan" with the name, placeholder "HARBOR-24" with the class code, and the first `input[placeholder="••••"]` with 1234. Click "Add", then `welcome-continue`.
- Studio: `/studio` has buttons "Start of Day N: Title" (Act V has "· College" and "· Front desk" variants). Use Studio **only once**, to reach the start of your segment. Then play forward through every day and act boundary with no further jumps. That continuity is what this audit tests.
- The Job Card is `[data-job-card]`. It is the only surface allowed to tell the learner what to do.
- **Viewports:** 1366×768 is 100%. **911×512 stands in for 150%** (the original audit's convention). Grade at both and keep the worse result.
- **Spanish:** the language toggle is in the Job Card, the shelf's Quick Settings ("Me" button → Language), or on arrival cards.

## Replay conditions, per sitting
Play continuously from your segment's start. For each sitting:
1. Play it through in **English at 1366×768**, as a beginner would: read the Job Card, click what it says, try one **plausible wrong action**, and use **short beginner English** in any writing (for example "yes thursday 2 ok").
2. Open **Help** (the `?` on the Job Card) once and come back.
3. **Reload** once mid-task and check that work and position come back.
4. Check the key screens at **911×512**. Can every needed control be seen and reached with the Job Card up, without dragging or collapsing it?
5. Check **keyboard**: can the main path be done with Tab, Enter and Space? Note focus problems.
6. Check **Spanish** on at least the key screens: is everything in Spanish (or intentionally English with a gloss)? Any mixed language, calques, or a wrong gender?

You may use a second learner account for a Spanish or 911 pass through the same segment if continuity demands it. Say so in your report.

## Grading standard (agreed 28 Sep; apply it exactly)
- **One severity rule:** if the only way past an obstacle is something the screen does not tell the learner (dragging or collapsing the Job Card, zooming, scrolling with no cue, reloading, a shortcut), it **blocks beginners**, even if you found the workaround.
- **Two verdicts per sitting:**
  - **UI/UX:** `clean` / `friction` / `blocks beginners` / `broken`.
    - `friction` means unintended cost in time or understanding that a beginner gets past without outside help.
    - `broken` means the task cannot be completed, or grading passes or fails the wrong thing.
  - **Learning challenge:** `fair` / `given away` / `too thin` / `unfair` / `unsupported` / `none`. This covers intentional pedagogical friction: is the thinking the task asks for fair and supported?
- **Clean Pass** requires all of: 0 broken, 0 blocking, 0 unintended UI/UX friction under all replay conditions, and a fair learning challenge (or none).
- **Polish** costs no time or understanding. Log it, but it does not fail a sitting. A wrong number, name, date, instruction or label is **never** polish.
- **Predicted** items (guesses about real learners, not observed) are listed separately and never counted.
- Every finding needs **evidence**: a screenshot path, the exact on-screen text, and a code path with line number where you checked it. Tag each one `Observed` or `Code-verified`. Say what you did not check.

## Output
Write `wave5/segment-<LETTER>.md` with:
1. **Header:** segment, sittings covered, accounts used, and conditions actually checked (EN/ES, 100/911, keyboard, wrong try, Help, reload), with any gaps stated plainly.
2. **Per-sitting table:** `Sitting | Original verdict | UI/UX now | Learning now | Clean Pass? | Key evidence`.
3. **Findings**, one block each:
   - title
   - sitting(s)
   - severity (`broken` / `blocks` / `friction` / `polish`)
   - kind (UI/UX or Learning + subtype)
   - route (`Dev` or `Content`)
   - evidence
   - steps to reproduce
   - a suggested fix in one line
4. **Regressions:** anything that worked in the original audit but is worse now.
5. **Checks of Wave 4 additions** in your segment. Name each one and whether it works as intended.
6. **Predicted items** (not counted).

Be exhaustive; length is fine. Include every finding, including small ones. Your final message back should be a 10-line summary: tally, worst findings, and the path of your report file.
