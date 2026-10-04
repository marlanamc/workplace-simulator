# Wave 5 re-audit: Segment B (Shift Lead, up to the route choice)

**Status: complete** (with the gaps listed below). **Tally for 8 rows (7 sittings + route choice): 0 clean · 6 friction · 2 blocks beginners · 0 broken.** Learning: 1 unfair (Day 13), 2 given away (Days 9, 12), 1 unsupported (Day 10).

## 1. Header

- **Segment:** B. Act II, Shift Lead, Days 7–13 (level3b → level8), plus the Act II ending and the route choice.
- **Build:** production build at http://localhost:3300 (main 469078f).
- **Account:** `Audit5 B en 1`, class code E2E-AUDIT5, PIN 1234. Studio was used **once**, for "Start of Day 7: When Something Happens". After that the account played forward continuously with no further jumps. Directly after the jump I loaded `/` once, so the Studio strip ("Studio jump. Same locks…", 36 px, fixed at the top) was gone. Every 911×512 measurement below is taken without the strip, which is how a learner sees the screen. The first few Day 7 shots (`B-day7-incident-911*.png`) still show the strip; see the note in finding B-2.
- **Driver:** Playwright (headless Chromium), from a long-running driver script in `wave5/B/`. For 911×512 the viewport was resized in place. On Day 10, paste used Meta+V because headless Chromium runs on macOS. A Chromebook uses Ctrl+V, and so do learners.
- **Conditions actually checked, per sitting**

| Sitting | EN 1366 | Wrong try | Help | Reload | 911×512 | Keyboard | Spanish |
|---|---|---|---|---|---|---|---|
| Act II intro | ✓ | n/a | n/a | n/a | ✓ | ✓ (Tab order) | ✓ |
| Day 7 incident | ✓ | ✓ (empty, false facts, missing injury; ES "no le pasó nada") | ✓ | ✓ | ✓ | – | ✓ |
| Day 7 handbook + Wi-Fi | ✓ | ✓ (Reload while offline; "30 minutes") | ✓ | ✓ (Wi-Fi state kept) | ✓ | ✓ (answer by Tab+Enter) | ✓ |
| Day 8 | ✓ | ✓ (wrong password; scam code) | ✓ (ES) | ✓ | ✓ | ✓ (password + Enter) | ✓ |
| Day 9 | ✓ | ✓ (Mail first; "No"; Wednesday; Monday 8 PM; "thursday 11") | – | ✓ | ✓ | ✓ (Tab to Send) | arrival only |
| Day 10 upload | ✓ | ✓ (upload before download; outside Schedules; this week's file) | ✓ | ✓ | ✓ | ✓ (picker by keyboard) | arrival only |
| Day 10 rename/share | ✓ | ✓ (renamed the _copy; near-miss name; Can edit) | – | – | – | – | – |
| Day 10 send link | ✓ | ✓ (no link; "I did not attach it") | ✓ | ✓ | ✓ | – | ✓ |
| Day 11 | ✓ | ✓ (Mail first; wrong Friday; message with no number) | ✓ | ✓ | ✓ | ✓ (Tab to Send) | ✓ |
| Day 12 copy + comment | ✓ | ✓ (copy before comment; comment off C1; "ok"; wrong copy name) | ✓ | ✓ | – | – | ✓ |
| Day 12 status + Undo | ✓ | ✓ (deleted the wrong cell; typed 61; no Cc) | – | ✓ | ✓ | – | ✓ |
| Day 13 | ✓ | ✓ (Thu 4 PM; Fri 2 PM; No; Drive before close; Minimize instead of X; Editor) | ✓ | ✓ (while closed) + sign-in in a new browser | ✓ (close ask, share, finale) | – | ✓ (close ask, finale) |
| Act II finale + route choice | ✓ | ✓ (opened every preview, then Back; opened Mail) | n/a | ✓ | ✓ | ✓ (focus loss, B-23) | ✓ |

Session note: partway through Day 13 the driver's browser was lost. I signed the same learner back in from a fresh browser context (same name, class code and PIN). That is exactly what a learner on a different Chromebook does, and it surfaced B-21. No Studio jump was used.

Gaps: Spanish was not checked on the Day 9 task screen or the Day 10 upload and rename screens. On Day 12 the Undo path used the toolbar arrow, not Ctrl+Z; the e2e test covers Ctrl+Z. Keyboard was not checked on the Day 7 incident or on Day 12. "Do it again" was never pressed.

## 2. Per-sitting table

| Sitting | Original verdict | UI/UX now | Learning now | Clean Pass? | Key evidence |
|---|---|---|---|---|---|
| Day 7: When Something Happens | Friction | friction | fair | No | B-1 draft lost on reload; B-2 911 Submit crowded; B-3 ES "no le pasó nada" rejected; B-19 "They need an answer" |
| Day 8: Locked Out | Friction → Blocks (card) | friction (minor) | fair | No (minor) | Password is checked now and not covered by the card; B-20 no on-page error |
| Day 9: The Calendar | Friction | friction | given away | No | B-4 Mail shows "That's today done"; B-5 Renata confirms a time the learner never proposed; B-6 day-off line and full-sentence chips; B-7 "thursday 11" rejected |
| Day 10: Shared Files | Friction | **blocks beginners** (911) | unsupported (paste) | No | B-8 compose fully under the card at 911, Show me points at the shelf; B-9 Help shows the wrong lesson; B-10 card over Continue after a wrong name (1366); B-11 Jordan's role shifts |
| Day 11: The Numbers | Friction → Blocks (card) | **blocks beginners** (1366) | fair | No | B-12 card still covers the tip slip Tue–Fri at 100% |
| Day 12: Reporting In | Blocks beginners | friction | given away (partly) | No | B-13 no "type in your copy" step; B-14 wrong-cell Delete accepted, false feedback; loop #7 fixed |
| Day 13: Covering More Ground | Friction | friction | **unfair** | No | B-15 correct answer is the learner's day off, against Day 9's rule (and Help says so); B-21 half-done hub lost on another device; B-22 share labels under the card at 911; B-16 "en el piso" |
| Act II ending / route choice | Friction | friction | none | No | Finale card, route previews, confirmation, 2-column layout at 911 all work (`B-act2-finale-1366.png`, `B-route-chooser-911.png`); B-23 keyboard focus lost after opening a preview; B-4 Mail replaces the chooser with a stale finish |

**Tally:** 0 clean · 6 friction · 2 blocks beginners · 0 broken, against the original under the unified standard: 0 clean · 5 friction (Days 7, 9, 10, 13, route choice) · 3 blocks (Days 8, 11, 12). Days 8 and 12 improved from blocks to friction. Day 10 got worse at 150% because of the new compose layout (B-8). Day 11 is unchanged.

## 3. Findings

### B-1 Draft text is lost on reload in several Act II writing tasks
- **Sittings:** Day 7 (incident), Day 9 (propose-a-time message), Day 10 (Jordan email), Day 11 (typed tips).
- **Severity:** friction. **Kind:** UI/UX, progression. **Route:** Dev.
- **Evidence:** Observed. I typed "he is ok, i mop the floor", reloaded, and on reopening Forms the textarea was empty. The same happened to the Day 9 draft "sorry i no work wed. thursday 11 ok", the Day 10 message "hi jordan. here is the schedule https://…", and the Day 11 values for Monday and Tuesday. Code-verified: `src/app/browser/IncidentTask.tsx:44` uses plain `useState("")`. `useTaskDraft` (`src/lib/use-task-draft.ts`) is used only by StatusReport, MakeACopy, Triage and a few others, and not by Incident, Calendar, Mail compose or Spreadsheet. Day 12's Undo stage and comment thread do survive a reload.
- **Steps:** type in any of the boxes above → reload the page → reopen the task.
- **Fix:** route these fields through `useTaskDraft`, the way StatusReportTask already does.

### B-2 At 911×512 the Job Card sits over the incident form's scenario and Submit
- **Sitting:** Day 7. **Severity:** friction. **Kind:** UI/UX, card covers. **Route:** Dev.
- **Evidence:** Observed, `B-day7-incident-911.png` and `B-day7-incident-911-submit-covered.png` (with the Studio strip), and `B-day7-incident-911-submit-visible.png` (without it). The card (x 24–364, y 230–440) covers the left third of the scenario paragraph ("A customer slipped…Nobody was hurt…Renata, your manager…") and "What happened". Without the strip, Submit report shows above the card at exactly two scroll positions. The card does not move away, because placement ignores reading material (`src/components/task/JobCard.tsx:84-93`, where LESSER_CONTROLS covers controls only). A learner can get past by scrolling, so this is friction and not a block.
- **Fix:** give the incident form's bottom a gutter, or count Submit and the scenario paragraph as `data-card-avoid`.

### B-3 The Spanish incident check rejects the honest "no le pasó nada"
- **Sitting:** Day 7 (ES). **Severity:** friction. **Kind:** Learning, grading too strict. **Route:** Content.
- **Evidence:** Observed. "el cliente se cayo. no le paso nada" got "Di si el cliente se lastimó. Por ejemplo: Está bien." Code-verified: `src/lib/tasks/incident/content.ts`, where the `FINE` regex has "bien" but no "nada", "no le pasó nada", "no se lastimó" (that last one is covered only by `denies(HURT)`) or "no tiene nada".
- **Fix:** add "(no le pasó|no tiene) nada" to FINE.

### B-4 Opening Mail on an unfinished day turns the Job Card green with "That's today done. Start tomorrow"
- **Sittings:** Day 9 and Day 11, and at the route choice (observed). At the route choice, opening Mail replaced the chooser with "Message sent | You finished the core course: 12 days of work. | Back to my desk"; Back to my desk brought the chooser back (`B-route-chooser-mail-1366.png`).
- **Severity:** friction (wrong instruction from the only instruction voice; the learner gets past it). **Kind:** UI/UX, the one rule. **Route:** Dev.
- **Evidence:** Observed, `B-day9-mail-wrong-1366.png`. On Day 9, before the calendar task was done, clicking the Mail bookmark showed "MESSAGE SENT", and the card went green: "Message sent | That's today done. | Start tomorrow | Do it again". At the same time the Calendar bookmark was still spotlighted. Pressing Start tomorrow only minimizes the window, and the card goes back to the Day 9 line (`B-day9-after-start-tomorrow-1366.png`). Day 11 did the same. Code-verified: `src/app/mail/MailClient.tsx:1262` renders `<TaskDoneActions>` for the last *finished* mail job (from `activeMailTaskFor`, `src/lib/mail-active-task.ts`) even when `ownsJobCard` (line 187) is false. The card's finish branch (`JobCard.tsx:~613-657`) then computes `levelFinished` from that old job's level and says "That's today done." "Do it again" was not pressed. It might restart a finished Act I job.
- **Steps:** on Day 9 or Day 11, open Mail before doing the day's task.
- **Fix:** render TaskDoneActions only when `ownsJobCard`. Otherwise show the inbox with no finish report.

### B-5 Renata's reply confirms "Thursday at 10 AM" whatever the learner proposed
- **Sittings:** Day 9 → Day 10 inbox. **Severity:** friction (a wrong time is never polish). **Kind:** UI/UX, story. **Route:** Dev + Content.
- **Evidence:** Observed, `B-day10-renata-10am-reply-1366.png`. I proposed "sorry i no work wed. thursday at 11 ok?", and the check accepted it. Renata's email says "Thursday at 10 AM works. See you at the huddle." Code-verified: `src/lib/story-beats.ts:71-110`. `extractHuddleTime` returns only "10am" or "2pm", while `checkHuddleReply` (`src/lib/tasks/calendar/content.ts:419`) accepts any work day and any in-shift time, for example "Monday at 9" or "Friday 3 PM".
- **Fix:** store the day and hour the check found, and build Renata's line from them. Or have her say "That time works."

### B-6 Day 9 states the answer before the learner checks
- **Sitting:** Day 9. **Severity:** n/a. **Kind:** Learning, given away. **Route:** Content + Dev.
- **Evidence:** Observed, `B-day9-event-1366.png`. The invite shows "You're not scheduled to work this day." in red as soon as it opens, while the card asks the learner to "Check the meeting day against your work shifts." In the propose box, the chips "Thu 10:00 AM" and "Thu 2:00 PM" insert a complete sentence ("Could we do Thursday at 10 AM instead?"), so one click and Send passes. Code-verified: `src/app/browser/CalendarTask.tsx:512` (scheduleNote always shown in Story) and `:586` (`slot.starter` inserted outside lessons). This contradicts the comment above STARTERS in `calendar/content.ts` ("one click plus Send must not pass").
- **Fix:** show the red line only after a wrong answer. In Story, make the chips insert the time words only, as the lesson path already does.

### B-7 "thursday 11" is rejected as having no time
- **Sitting:** Day 9. **Severity:** friction (the correction gets the learner past). **Kind:** Learning, grading strict. **Route:** Content.
- **Evidence:** Observed: "Good day. Now add a time, like "Thursday at 11 AM"." Code-verified: `calendar/content.ts` `timeMention` ignores a bare number unless it follows "at", "a las" or similar.
- **Fix:** accept a bare 7–12 or 1–6 right after a day name as a time.

### B-8 At 911×512 the Day 10 email to Jordan is hidden under the card, and Show me points at the shelf
- **Sitting:** Day 10 (mail-send-link). **Severity:** **blocks beginners**. **Kind:** UI/UX, card covers. **Route:** Dev.
- **Evidence:** Observed, `B-day10-sendlink-911.png`, `B-day10-sendlink-911-aftercopy.png` and `B-day10-sendlink-911-showme.png`. The card (x 547–887, y 206–440) covers the whole compose pane: To, Subject, link box and message box. Only the top edge of "Copy link" shows below it. After the correction "Link copied. Paste it into your message.", the card grows and covers the same area. Show me draws its "Click it." ring on the shelf at the bottom right, because the textarea is scrolled out of view and is not scrolled into view first. The pane scrolls, and the card then moves (`B-day10-sendlink-911-mid.png`), but only if the wheel is used over a 15 px strip under the card. Nothing on screen says to do that.
- **Steps:** Day 10, task 3, at 911×512 → open Mail.
- **Fix:** have Show me call `scrollIntoView` on its target before drawing. Count the compose textarea and Send as `data-showme` targets so the card parks top-left.

### B-9 The Day 10 "send the link" Help shows the Day 2 attachment lesson
- **Sitting:** Day 10. **Severity:** friction (wrong instruction). **Kind:** Learning, unsupported. **Route:** Content.
- **Evidence:** Observed. Help reads "Attaching a file | Click Attach file under your message… Look for July 2026 at the top and no DRAFT stamp. Then click Attach." Code-verified: `src/app/mail/MailClient.tsx:356`. `COMPOSE_LESSONS` (`src/lib/tasks/mail/content.ts:1329`) has entries only for mail-etiquette and call-out-sick, so mail-send-link falls back to `LESSONS[lang][lessonIdx]`. Nothing anywhere says *how* to paste (Ctrl+V or right-click → Paste). The correction only says "Paste it into your message."
- **Fix:** add a COMPOSE_LESSONS["mail-send-link"] entry: "Click Copy link. Click in your message. Press Ctrl+V to paste."

### B-10 After a wrong file name, the Job Card grows over Continue in Rename (at 100%)
- **Sitting:** Day 10 (files). **Severity:** friction. **Kind:** UI/UX, card covers. **Route:** Dev.
- **Evidence:** Observed, `B-day10-rename-continue-covered-1366.png`. After "schedule week sep 14" → Continue, the card turns into the correction and moves to the bottom-right (x 922–1342). It covers Continue (x 875–979), and only "Con" stays visible. It stays like that after the name is corrected. Playwright's click failed with "data-job-card subtree intercepts pointer events". Clicking the visible "Con" sliver works (`B-day10-after-sliver-click-1366.png`).
- **Fix:** count the Rename dialog's buttons as targets, or keep the card in its corner when a correction grows it.

### B-11 Jordan's role changes three times in four days
- **Sittings:** Day 10 and Day 12. **Severity:** friction (wrong label). **Kind:** UI/UX, story, who is who. **Route:** Content.
- **Evidence:** Observed. Day 10 arrival: "Jordan starts today". Day 10 task 2: "share it with the new coworker". Day 10 task 3: "Email the new lead, Jordan, the schedule link." (`src/lib/tasks/registry.ts:791`). Day 12 correction: "Click Cc and add Jordan. A co-lead needs this number too." The crew schedule lists Jordan Kim as crew, 2–10.
- **Fix:** pick one ("Jordan, the new shift lead" or "the new team member") and use it everywhere.

### B-12 Day 11: at 100% the card still covers the tip slip and the Wednesday–Friday cells
- **Sitting:** Day 11. **Severity:** **blocks beginners**. **Kind:** UI/UX, card covers. **Route:** Dev.
- **Evidence:** Observed, `B-day11-tracker-1366.png` and `B-day11-b3-focus-1366.png`. When the tracker opens at 1366×768, the card (x 24–444, y 433–696) covers the slip's Tuesday to Friday lines and cells B4–B6. With the Tuesday cell selected, the slip's "$38.00" is under the card. The card only moves to the right once focus reaches B4 by Enter (`B-day11-after-two-1366.png`). A mouse learner who clicks B3 cannot read Tuesday's amount without dragging or collapsing the card. This was the original re-graded block (#2). PR #45's placement counts controls and Show me targets only (`JobCard.tsx:84-93`), so the slip, which is reading material, is not protected.
- **Fix:** mark the tip slip `data-card-avoid`, or place the slip to the right of the grid.

### B-13 Day 12: after the copy is made, the card never says "type in it"
- **Sitting:** Day 12, task 1. **Severity:** friction. **Kind:** UI/UX, hidden completion step. **Route:** Content.
- **Evidence:** Observed, `B-day12-copy-made-1366.png`. After naming the copy, the card shows only "Copy a view-only template", and nothing happens until the learner types in a cell. The step "Type in your copy to check that you can edit it." exists (`src/lib/tasks/make-a-copy/content.ts:203`). The card doesn't show it because Act II shows only the goal (`JobCard.tsx:726-732`). Help says "The copy is yours, so you can type in it" but not that typing is required.
- **Fix:** pass that step as `goal`, so it reaches the card in Act II.

### B-14 Day 12 Undo practice: deleting the wrong cell counts, and the feedback then says the numbers are right
- **Sitting:** Day 12, task 2. **Severity:** friction (wrong feedback). **Kind:** UI/UX, grading. **Route:** Dev.
- **Evidence:** Observed, `B-day12-deleted-1366.png`. The card asks "Click Friday's number (B6) and press Delete". I deleted Thursday instead (B5). The card moved on to "Bring the number back with Undo". Clicking Friday then gave "The ticket numbers are right. Click the Total cell (B7)" while Thursday was blank. After Undo the status line read "Friday's number is back." when it was Thursday's. Code-verified: `src/lib/tasks/status-report/undo.ts:26-29`, where `afterDelete` accepts any selected row and ignores `UNDO_TARGET`, and `StatusReportTask.tsx:258`, where CELLS_ARE_SET is said whenever the stage is not "delete".
- **Fix:** accept a Delete only on `UNDO_TARGET`. For another cell, say "That is Thursday. Friday is B6."

### B-15 Day 13: the only accepted huddle time is on the learner's day off, against Day 9's rule
- **Sitting:** Day 13. **Severity:** n/a. **Kind:** Learning, **unfair**. **Route:** Content.
- **Evidence:** Observed, `B-day13-calendar-1366.png` and `B-day13-wrong-1366.png`. The screen says: "You close Thursday 4–10. … Your shifts: Thursday 4–10; Friday off. Renata's calendar: Friday 9–11 AM available; 1–3 PM supplier meeting." Options: Thu 4:00 PM, Fri 10:00 AM, Fri 2:00 PM. Only Fri 10 AM passes (`src/lib/tasks/triage/content.ts:13-15`), and Thu 4 PM gets "The full 20 minutes must be free for both people." On Day 9 the same learner was corrected with "Wednesday is your day off. Name a day you work." So a careful learner who applies Day 9's rule picks Thursday during their shift and is told they are wrong. The three options are an improvement over the original single option, which is fixed. The Thursday date now matches the calendar (4–10 on Sep 24), which is also fixed.
- **Fix:** make Thursday 4 PM clash with Renata (for example, her delivery at 4), and give a work-day slot that is free. Or have the card say why a Friday meeting is fine ("Renata will pay you for the 20 minutes").

### B-16 Spanish: "en el piso" is still on the Day 13 close request
- **Sitting:** Day 13 (ES). **Severity:** friction (a calque the original audit flagged, #15). **Kind:** UI/UX, Spanish. **Route:** Content.
- **Evidence:** Observed: "Renata te necesita en el piso un minuto." Code-verified: `src/lib/tasks/triage/close-window.ts:40`.
- **Fix:** "Renata te necesita en el salón / atendiendo un minuto."

### B-17 Spanish mixed language on Day 12 and in the handbook
- **Sittings:** Days 7 and 12. **Severity:** polish/friction. **Kind:** UI/UX, Spanish. **Route:** Content.
- **Evidence:** Observed. In the Day 12 template's menu bar, "Archivo" and "Comentar" are Spanish while "Edit | View | Insert" stay English. The template column says "Pedidos", but the learner's copy says "Tickets". C1 shows "Week of Sep 14" inside an otherwise Spanish sheet. The card line "Copia una plantilla de solo ver" reads awkwardly; "de solo lectura" is the natural form. The Day 7 handbook body stays in English in Spanish mode, with no gloss (this may be intentional).
- **Fix:** localize the menu labels and the sheet header, and keep one word for tickets.

### B-18 Small date and label slips
- **Severity:** friction for the wrong date; the rest are polish. **Route:** Content.
- The next-week schedule (sched_92126, "Week of Sep 21–27") says "Posted by Renata Silva… · Sep 11", the same as this week's file, although it arrived Sep 14. This is a wrong date on the very file the learner is told to tell apart by its date. Observed in the picker preview.
- The Day 9 arrival emoji 📅 renders as "JUL 17" (`B-day8-done-1366.png`). It is a platform glyph. Polish.
- The New Tab page shows a stray grey caption with the day title ("The Calendar", "Reporting In"), for example `B-day9-start-1366.png`. Polish.
- The story clock goes back a minute on reload (2:26 → 2:25 PM, 3:31 → 3:30 PM). Polish.
- Day 13's Today list still reads "Thursday 4:00 PM" after the learner proposed Friday 10 AM. Polish.
- The Day 10 Drive list shows the learner's own upload, sched_92126.pdf, with owner "Renata Silva". Polish.

### B-19 Day 7 handbook card line: "They need an answer"
- **Severity:** polish/friction (carried over from the original). The desktop line "They need an answer. The handbook is on your desk." never says who "they" are. It is Renata. Observed.

### B-20 Day 8: a wrong password shows no error on the page
- **Severity:** polish. The Job Card corrects it ("Use the practice password Harbor2026, with a capital H"), but the Google-style page shows no "Wrong password" line, as a real sign-in would. Observed, `B-day8-wrongpw-1366.png`.


### B-21 Day 13's half-done work is kept only on the device, and the card says "Your work is saved"
- **Sitting:** Day 13. **Severity:** friction. **Kind:** UI/UX, progression. **Route:** Dev.
- **Evidence:** Observed, `B-day13-hub-after-signin-1366.png`. I proposed Fri 10 AM (the huddle showed ✓, "Open items 1") and closed the browser as asked, then signed back in from a fresh browser context. Today showed **both** items open again ("Open items 2", red dot on the huddle), and the close request played a second time. The card had just said "Your work is saved." Code-verified: `src/lib/use-task-draft.ts` stores drafts in localStorage per learner ("Unsaved story work stays on this device"). In a classroom, learners regularly switch Chromebooks.
- **Fix:** save the triage sub-steps in server progress, as story flags already are, or soften the line to "Your work is saved on this computer."

### B-22 At 911×512 the Day 13 share dialog's labels and Share sit under the card
- **Sitting:** Day 13. **Severity:** friction. **Kind:** UI/UX, card covers. **Route:** Dev.
- **Evidence:** Observed, `B-day13-share-911.png` and `B-day13-share-911-mid.png`. The card (x 24–364) covers the file name "allergen-list-sep-21.pdf" and the left half of both option bars, where the words "Viewer" and "Editor" are. After scrolling, "Viewer" shows above the card, but then Share is under it. Share can be clicked at only two scroll positions (probe: `CARD@429…CARD@269, OK@229, OK@189`).
- **Fix:** count the share dialog's option bars and Share as targets, so the card parks top-right.

### B-23 Keyboard: opening a route preview drops focus to the desktop
- **Sitting:** route choice. **Severity:** friction. **Kind:** UI/UX, focus. **Route:** Dev.
- **Evidence:** Observed. Tab order through the chooser is right: Hide → the five choices → Read aloud. Pressing Enter on "Stay and lead" shows the preview, but `document.activeElement` becomes the desktop name note ("9:06 AM Audit5 B en 1 SHIFT…"), outside the card. A keyboard user has to Tab back in to reach "Choose this direction".
- **Fix:** after the preview renders, focus its heading or "Choose this direction".

### B-24 Day 13 Help repeats the contradiction in B-15
- **Severity:** part of B-15 (Learning, unfair). Help item 2 reads "The meeting is like the lead huddle: do not accept a time when you are working." The Day 9 huddle taught the opposite ("Name a day you work"). Observed.

## 4. Regressions
- Day 10 at 911×512: the new compose layout (a link box plus Copy link above the message) puts the whole compose pane under the card (B-8). The original Day 10 had no such block.
- Otherwise none. B-12 (Day 11) is not a regression but a fix that did not land for this screen: the original block is unchanged at 1366.

## 5. Checks of Wave 4 additions
- **Day 7 Wi-Fi off → Quick Settings → Reload:** **works.** The offline page appears with "Practice Wi-Fi. Your real computer is still connected." A wrong try (Reload) gives "Still no internet. The Wi-Fi is off. Click the clock in the corner of the screen and turn on Wi-Fi." with Show me, which rings the clock and tray. The Wi-Fi state survives a full reload. The toolbar Reload loads the handbook. It is in Spanish, and the tile is reachable at 911. Small issues: after Wi-Fi is turned on, the card does not acknowledge it, and closing Help or pressing Show me clears the correction line.
- **Day 10 download → upload into Schedules:** **works.** Uploading before downloading, uploading outside Schedules, and choosing this week's file are each corrected clearly, and nothing resets. The download survives a reload, and the picker works by keyboard. The pilot question (911): the card, parked top-right, **does** cover the preview's "Week of Sep 21 – 27" line (`B-day10-picker-preview-911.png`). The wrong-file correction then quotes that hidden line ("That page says Week of Sep 14"). The Date column (Sep 14 vs Sep 11) still lets a learner choose, so this is friction at 911. See also B-18, the Posted date.
- **Day 12 comment on C1 → Renata fixes → copy; Delete Friday → Undo:** the comment flow **works** and survives a reload (`B-day12-comment-reply-1366.png`, "Good catch, thank you. It is the week of Sep 14. I fixed the template."). Undo via the toolbar arrow **works**, but the delete step accepts the wrong cell (B-14). Ctrl+Z was not exercised by me; the e2e test covers it.
- **Day 13 close the browser → reopen Today:** **works on the same device**, but not across a sign-in on another browser (B-21). Drive-before-close gives "First close the browser, like Renata asked." The closed state survives a reload. Reopening from the shelf and then Today shows "Your work is still here." and the huddle still ticked. Minimize instead of X drops the close request from the desktop card ("Open Today from the bookmarks"), but reopening brings it back.

## 6. Predicted (not counted)
- At 911 the Act II intro's Start button is below the fold behind a cut-off card. Most learners will scroll, but some may wait.
- Learners who have never pasted will be stuck at "Paste it into your message" on Day 10 (see B-9).
- A careful learner on Day 13 applies Day 9's rule and loses confidence when it is marked wrong (B-15).

## 7. Original findings re-checked (Segment B)
- Act II intro "never says what happened to Maria": still true. Polish.
- Day 7 "Your shift lead needs a report" / "Jordan" handbook comment: **fixed** ("Renata, your manager"; the comment is addressed to the learner). Report with false facts: **fixed** ("Check the facts. Nobody was hurt."). "he is ok, i mop the floor and say sorry" passes. Prefilled time vs clock: **fixed** (2:15 PM vs a 2:25 PM clock). "They need an answer": still there (B-19).
- Day 8 any password works: **fixed**. Card over the password field: **fixed** (card parks top-left). Confetti on "You're locked out": **fixed** (the confetti now plays on the Day 9 arrival, after the success).
- Day 9 "today" jumping back: **fixed** (Thu Sep 10). Arrival vs day off: **fixed** ("A meeting invite for next week").
- Day 10 "Jordan starts today" on the sick day: **fixed** (Monday Sep 14). No link to send: **fixed** (Copy link; a URL is required; "I did not attach it" is rejected with a clear correction). Jordan's reply dated Aug 21: not seen.
- Day 11 card covers the slip and cells: **not fixed at 100%** (B-12).
- Day 12 loop (#7): **fixed**. "#ERROR?" for 61: **fixed** (shows 61, then "Right number. Now let the sheet add it"). =SUM given away: reduced to a "=SUM(" placeholder in the formula bar, shown before any try. "Tickets" is never explained: still true.
- Day 13 one time on offer: **fixed** (three options). "You close Thursday 2–10" vs calendar: **fixed** (4–10 in both). Mid-task reload resets the hub: **fixed on the same device** (B-21 across devices). The answer being stated on the page ("the master must stay unchanged") is still there. Given away.
- Act II has no end moment: **fixed** (Act II finale card, `B-act2-finale-1366.png`).
- Route chooser (#9): **fixed**. Each route shows story days, place and manager; a preview and "Choose this direction" confirmation; "Choose a direction" (not "another"); Stop here is visible at 911 in two columns; the choice survives a reload. New: B-23 and B-4.
