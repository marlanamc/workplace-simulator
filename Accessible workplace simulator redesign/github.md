repo: marlanamc/workplace-simulator
branch: main

## Last sync
date: 2026-08-23T02:02:30Z

### Updated in this project
- Recreated today's learner-facing screens from source: desktop, Browser + Mail, Objectives panel, Help drawer, task-done card.
- Designed a low-literacy async learner path: persistent "Right now" bar, one-card session start, 3-button shelf, done/handoff screen, "My job" panel.
- Added a per-skill release ladder (4 rungs) so guidance fades as a skill is mastered, not as levels advance.
- Reviewed rewards for adult learners, plus a curriculum critique and a per-act color/time-of-day system (read from curriculum-catalog.ts).

## Screen map
| Project screen | Repo files |
| --- | --- |
| Current App Recreated · desktop | src/app/DesktopClient.tsx, src/components/ShiftBriefing.tsx, src/components/LiveClock.tsx, src/components/DesktopWallpaper.tsx, src/components/Shelf.tsx, src/lib/shift-spine.ts, src/lib/story-beats.ts |
| Current App Recreated · Browser + Mail | src/app/browser/BrowserClient.tsx, src/app/mail/MailClient.tsx, src/lib/tasks/mail/content.ts, src/components/task/TaskDispatchStrip.tsx, src/components/task/AppHeaderTools.tsx, src/components/WindowControls.tsx, src/lib/icons.tsx |
| Current App Recreated · Objectives panel | src/components/ObjectivesPanel.tsx, src/lib/tracks-content.ts |
| Current App Recreated · Help drawer + done card | src/components/task/HelpDrawer.tsx, src/components/task/TaskDoneCard.tsx, src/components/task/TaskDoneActions.tsx, src/components/task/ConfidenceCheck.tsx |
| Learner Path Redesign | derived from all of the above + src/app/globals.css (tokens), src/lib/desktop-content.ts (copy) |
| Learner Path Redesign · curriculum + act colors | src/lib/curriculum-catalog.ts, src/lib/tracks-content.ts, src/lib/skills.ts, src/lib/story-beats.ts |
