# Everyday digital confidence: classroom pilot

Status: implementation available for review; **learner observations and independent-home readiness remain pending**. This collection does not establish effectiveness, mastery, or independent transfer.

## Entry points

- `/lessons/confidence`: ordered, unlocked collection of eight existing tasks.
- `/lessons/confidence?teacher=1`: teaching sequences and observation sheet.
- `/lessons/confidence?teacher=1&lesson=mail-attach`: individual printable learner sheet; teacher notes are omitted when printed.
- `/lessons/confidence?sheet=observation&teacher=1`: printable teacher observation form, separate from learner sheets.
- Lesson links accept `scenario=classroom|try|home`, `lang=en|es`, and `mode=guided|independent`. Teacher preview adds `preview=1` and saves nothing. Invalid or unsupported alternate scenarios return 404.

Eight tasks: mail-reply, mail-attach, files, schedule, calendar, account-recovery, spreadsheet, coursework. Schedule now has public lesson metadata. Existing lesson URLs open classroom practice. The original classroom workflows (including existing follow-up rounds) are retained; the changed-facts and home examples are directly accessible without replaying them. Split longer classroom activities across sessions.

## Lesson routine

1. Model a separate example for about 3 minutes, explaining how you check and recover.
2. Allow 8–10 minutes of supported practice. Optional pointer/scroll practice is under More practice in the Job Card.
3. Use Try changed facts for a fresh example, about 3–5 minutes.
4. Reflect for about 2 minutes: what did you check, and what would you try if something went wrong? Accept speaking, pointing, or writing.
5. After the home-readiness observation, share Home practice (5–10 minutes). Help remains available. Revisit with a fresh example several days later; use the optional Google activity to observe transfer beyond the simulator.

These are planning estimates, never time limits. Choose computer support independently of language proficiency. Both English and Spanish are available, but not all ESOL students speak Spanish; oral clarification and teacher language support may still be needed.

## Google practice

The per-lesson sheet includes a concrete teacher-facilitated Google activity with fictional source facts. Use school-approved accounts and teacher-designated recipients. Teachers provide the two named practice files for the attachment activity; their content can be short fictional club details, one draft and one final. No Google account integration or automatic sending is implemented. Classroom access depends on the school account; the assignment guide provides a Drive-folder alternative. All password/code practice remains inside the simulator.

## Technical behavior

Scenario facts and bounded checks are in `src/lib/tasks/confidence/content.ts`. The fresh-scenario workspace reuses the shared PickerModal, PhoneTexts, SheetsFrame/ReadOnlyGrid, SentEmailRecap, HelpDrawer, and Job Card reporting controls. Students type replies, preview/attach/remove files, rename/share, propose times, edit cells, and submit. Sheet cells are selected in the shared grid and edited in its labeled cell editor. These are simplified simulated workflows, not full Google products.

Wrong attempts retain drafts and report through the Job Card. Review shows the student's result; final confirmation displays a sent/shared/submitted status. The student checks that result before recording one practice finish. Restart resets scenario state; switching scenarios remounts the runner and preserves current language/support. Shared preview links and sign-in return links retain the scenario. Task-based completion counts remain compatible with old records; they do not distinguish scenario success or demonstrate mastery. There is no database migration.

Email checks recognize the requested fact, not general meaning, writing quality, tone, or grammar. Teacher observation remains necessary. No scores or confidence ratings are stored. Self-reported confidence is recorded separately on the printable observation sheet.

## Pilot and release gate

Week 1: observe 4–6 adults trying email reply and attachments, including different computer experience and English/Spanish coverage. Record participant codes only. Note starting help, valid/wrong attempts, help access, recovery, result checking, and confidence before/after. Revise recurring blockers before extending the pattern.

Week 2: sample all eight with learners; use fresh facts and the optional Google activity. Record what was directly observed and assistance provided, not inferred proficiency. Teacher-led support remains the default for unobserved activities.

Final week: freeze feature additions, repair and recheck blockers, review printouts and actual Chromebook zoom, keyboard, and read-aloud behavior. Small samples supply qualitative findings, not effectiveness percentages.

| Lesson | EN observation | ES observation | Google transfer check | Home readiness |
| --- | --- | --- | --- | --- |
| Reply | Pending | Pending | Pending | Pending |
| Attachment | Pending | Pending | Pending | Pending |
| Files | Pending | Pending | Pending | Pending |
| Schedule | Pending | Pending | Pending | Pending |
| Calendar | Pending | Pending | Pending | Pending |
| Account code | Pending | Pending | Simulator only | Pending |
| Spreadsheet | Pending | Pending | Pending | Pending |
| Assignment | Pending | Pending | Pending | Pending |

Release a lesson for unsupervised home use only after learners can understand the goal, access help, recover, and finish without recurring unresolved blockers. Software checks alone do not close this gate.
