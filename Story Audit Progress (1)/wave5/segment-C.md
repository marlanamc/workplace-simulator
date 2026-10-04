# Wave 5 re-audit · Segment C · Stay and lead (Acts III–IV)

## 1. Header

- **Segment:** C, Stay and lead. Covers Day 14 to Day 20, the "Start Act IV" boundary, the route ending (summary and keepsake), and the "Change direction" option afterward.
- **Build:** production 469078f at http://localhost:3300. The server restarted once partway through; the account resumed where it had stopped.
- **Accounts:**
  - `Audit5 C en 1` (E2E-AUDIT5 / 1234). This is the main continuous run. Studio was used **once** ("Start of Day 14: Scheduling the Team"), and it landed on the Act III intro as expected. From there it played Day 14 → Day 20 → ending → Change direction → Front desk (first screen only) with no further Studio jumps. The server restart forced one sign-out and sign-in on Day 16.
  - `Audit5 C es 2` (E2E-AUDIT5 / 1234). A second account for a Spanish + 911×512 pass. It used Studio once, to "First Team Meeting" (Day 16), then played forward. This pass covered Days 16 and 17, the Act IV boundary, and the Day 18 hub and schedule, all in Spanish at 911.
- **Conditions actually checked**

| Sitting | EN 1366 | ES | 911×512 | Keyboard | Wrong try | Help | Reload |
|---|---|---|---|---|---|---|---|
| Act III intro | ✓ | ✓ | ✓ | ✓ | – | – | – |
| Day 14 | ✓ | ✓ (voicemail, gloss, corrections, sent) | ✓ (voicemail, form, sheet) | ✓ (form Tab/Enter; 18 Tabs to email) | ✓ ×6 | ✓ | ✓ ×2 |
| Day 15 | ✓ | arrival only | arrival only | ✗ | ✓ ×3 (formula ×2, Mail) | ✓ | ✓ |
| Day 16 | ✓ | ✓ (2nd acct) | ✓ (2nd acct) | ✓ (Save via Tab/Enter) | ✓ ×3 | ✓ | ✓ (also sign-out/in) |
| Day 17 | ✓ | ✓ prompt/hub (2nd acct) | ✓ prompt (2nd acct) | partial (Send via Tab) | ✓ ×4 | ✗ | ✗ |
| Act IV boundary | ✓ | ✓ (2nd acct, played across) | ✓ (2nd acct, played across) | ✓ (Tab/Enter on Start) | – | – | – |
| Day 18 | ✓ | ✓ hub + schedule (2nd acct) | ✓ hub + schedule (2nd acct) | partial (Send via Tab) | ✓ ×7 | ✗ | ✗ |
| Day 19 | ✓ | arrival ✗ | ✗ | partial | ✓ ×1 | ✓ | ✗ |
| Day 20 | ✓ | arrival ✓ | ✗ | ✓ (Send via Tab) | ✓ ×4 | ✓ | ✓ (arrival + mid-compose) |
| Ending / summary | ✓ | ✗ | ✓ (summary) | ✗ | – | – | – |
| Change direction | ✓ | ✗ | ✗ | ✗ | ✓ (click finished route) | – | – |

**Gaps, stated plainly:** Day 19 and Day 20 were not checked at 911 or in Spanish (only their arrival cards in Spanish). Day 18 had no Help or reload check, and its Spanish check covered only the hub and the class schedule. Day 15 had no keyboard check. Day 17 had no Help or reload check. The second account's Spanish/911 pass played across the Act IV boundary and stopped on the Day 18 schedule. Screen readers were not tested, and neither was 200%.

## 2. Per-sitting table

| Sitting | Original verdict | UI/UX now | Learning now | Clean Pass? | Key evidence |
|---|---|---|---|---|---|
| Day 14 Scheduling the Team (level9) | Friction (confirm) | **blocks beginners** (at 911 the "Email the person you added" button is fully under the card at every scroll position); at 1366, friction (the card covers the Name column; a stale correction; the pick is lost on reload) | fair | No | C-d14-sheet-911-scrolled.png, C-d14-sheet-911-picked (hit test = JOBCARD), C-d14-sheet-alex-wrong.png, C-d14-sheet-jordan.png |
| Day 15 Weekly Numbers (level10) | Friction (confirm) | friction (the card covers the row numbers that Help tells you to read; opening Mail makes the Job Card say "Message sent. Done."; the formula fix is lost on reload or window close) | fair | No | C-d15-sheet-1366.png, C-d15-mail-wrong.png, C-d15-help.png |
| Day 16 First Team Meeting (level11) | Blocks beginners | **blocks beginners** (at 1366 the Docs **Save** is fully under the card and it does not move; at 911 the crew names, the time choices and Calendar **Guardar** are under the card at every scroll position) | fair (a truly free time now exists; a one-line agenda and the title "meeting" pass) | No | C-d16-docs-save-covered.png, C-es911-d16-cal.png, C-es911-d16-cal-bottom.png |
| Day 17 Under Pressure (level12) | Blocks beginners | **blocks beginners** at 911 (the prompt text sits under the card); friction at 1366 (Mail Send is 41 px under the card; the crew data contradicts Day 16) | fair (A2 prompt now; the answer is no longer stated) | No | C-es911-d17-open.png, C-es911-d17-open-later (overlap), C-d17-sheet.png, C-d16-cal-1366.png |
| Day 18 An Offer (level13) | Broken on entry | **blocks beginners** at 911 (once the section rows scroll into view, the card jumps left over the Days/Time columns; C28); friction at 1366 (a same-name "Calendar" bookmark opens a finished task, and the card says "Message sent. Done."; the offer email is timed after the desktop clock) | fair (a real three-section problem; nothing points out the clash) | No | C-d18-calendar.png, C-d18-cal-inapp.png, C-d18-sec01.png |
| Day 19 The Budget (level14) | Friction → Blocks | friction (the card covers the Labor row at 1366; the numbers come back in a correction after one try, and the Email path is now File → Email, clear of the card) | fair, with a slight giveaway (the Status column reads "over") | No | C-d19-sheet.png, C-d19-help.png |
| Day 20 Reply-All (level15) | Friction | friction (Help shows "Attaching a file"; the compose draft is lost on reload) | **unfair** in one respect: Dana says "I only need a yes or no" and "yes ok" is rejected | No | C-d20-help-wrong.png, C-d20-reply-wrong.png |
| Ending & route change | (Friction) | **broken continuity**: after Stay and lead, choosing Front desk moves the story calendar back from Oct 16 to Sep 28, and every Act III–IV email disappears from the inbox | – | No | C-route-hc-mail.png |

**Tally (7 sittings):** 0 clean · 3 friction · 4 blocks beginners · 0 broken. The route-change date regression is logged separately below (it is not a sitting). Original baseline: 4 friction · 2 block · 1 broken.

## 3. Findings

### C1. At 911, Day 14's "Email the person you added" is always under the Job Card
- **Sitting:** Day 14
- **Severity:** blocks
- **Kind:** UI/UX · card overlap
- **Route:** Dev
- **Evidence:** Observed. At 911×512, after scrolling the sheet pane to its end, the button's box is {x:24,y:396,w:227,h:44}. The card's box is {x:24,y:230,w:340,h:210}. `elementFromPoint` at the button's centre returns the Job Card. Screenshots: C-d14-sheet-911-scrolled.png and C-d14-sheet-911-bottom.png. Code-verified: the button has no `data-showme` or `data-card-avoid` (`src/app/browser/TeamScheduleTask.tsx:462-468`), so `chooseCorner` treats it only as a "lesser" control (`src/components/task/JobCard.tsx:84-93,380-383`). The card also covers the Name column, so the crew names cannot be seen.
- **Steps:** Day 14 at 911 → send the phone message → open Crew Week → scroll down → pick Jordan's Sat → look for the Email button.
- **Fix:** Add `data-showme="email"` (or `data-card-avoid`) to the Email button and to the Sat dropdowns, so the card parks away from them.

### C2. At 1366, Day 16's Docs "Save" is fully under the Job Card, and the card does not move
- **Sitting:** Day 16
- **Severity:** blocks
- **Kind:** UI/UX · card overlap (original #2, not fixed here)
- **Route:** Dev
- **Evidence:** Observed. The Save box is {x:363,y:539,w:78,h:40}. The card sits at bl {x:24,y:466,w:420,h:230}. It stayed there after 2 s and after a click elsewhere. A Playwright click reports that the Job Card "subtree intercepts pointer events". Screenshot: C-d16-docs-save-covered.png. "Need help writing?" is also mostly covered. Tab from the textarea reaches Save (2 Tabs) and Enter works. That is a workaround the screen does not show.
- **Steps:** Day 16 → Huddle → Open Docs → type an agenda → try to click Save.
- **Fix:** Mark the Docs Save (and the hub's "Send the invite") as `data-showme` or `data-card-avoid`, or reserve a bottom-left gutter in this view.

### C3. At 911 on Day 16, the crew names, the time choices and "Guardar" are under the card at every scroll position
- **Sitting:** Day 16 (Spanish, second account)
- **Severity:** blocks
- **Kind:** UI/UX · card overlap
- **Route:** Dev
- **Evidence:** Observed. C-es911-d16-cal.png shows the card covering every name in "Turnos del equipo esta semana". At the end of the scroll (C-es911-d16-cal-bottom.png), Guardar is at y=176, under the app header. Before that, the hit test at its centre returned JOBCARD. "Mié 3:00 PM" was also covered in C-es911-d16-cal-s2.png.
- **Steps:** Day 16 at 911 → Huddle → Abrir Calendar → try to read the names, pick a time and save.
- **Fix:** At short heights, park the card top-right in this view, or stack the table beside the form.

### C4. At 911 on Day 17, the question text is under the Job Card
- **Sitting:** Day 17 (Spanish, second account)
- **Severity:** blocks
- **Kind:** UI/UX · card overlap
- **Route:** Dev
- **Evidence:** Observed. The paragraph "Jueves, 3:40 PM. Dana está esperando ahora…" has box {x:195,y:306,w:520,h:68}. The card sits at {x:24,y:230,w:340,h:210}, so the start of every line is hidden. It was still covered after 4 s. Screenshot: C-es911-d17-open.png. The toast "Renata dejó una nota" also covers the priority dropdown for a few seconds.
- **Steps:** Day 17 at 911 → Salón.
- **Fix:** Tag the prompt as `data-card-avoid`, or let the card move top-right when the page is narrow.

### C5. Opening a finished task's app makes the Job Card say "Message sent. Done. One more task for today."
- **Sittings:** Day 15 (Mail bookmark), Day 18 ("Calendar" bookmark), and Front desk Day 21 after the route change (Mail)
- **Severity:** friction (the card states something false)
- **Kind:** UI/UX · wrong instruction
- **Route:** Dev
- **Evidence:** Observed.
  - Day 15, after fixing the formula but before emailing Renata, a click on the Mail bookmark (the plausible way to "email Renata") gives the card: "Message sent | Done. One more task for today. | Next task". Screenshot: C-d15-mail-wrong.png. Pressing "Next task" closed the browser and **threw away the formula fix**; the total was back to 138.
  - Day 18: the task has in-app tabs named "Mail" and "Calendar", the same names as the bookmarks. The Calendar *bookmark* opens Day 9's finished calendar task with the same false card. Screenshot: C-d18-calendar.png.
  - Code-verified: `activeMailTaskFor` falls back to "the last one done, which Mail shows as finished" (`src/lib/mail-active-task.ts:26-38`). The done view reports a finish to the card (`src/components/task/JobCard.tsx:630-660`, the `oneJobLeft` line).
- **Steps:** Day 15 → fix =SUM(H2:H6) → click the Mail bookmark.
- **Fix:** When a window opens a task that is already done and is not today's task, report nothing to the card (browse-only) instead of a finish state.

### C6. The Day 20 Help ("?") shows "Attaching a file" instead of help for Reply vs Reply all
- **Sitting:** Day 20
- **Severity:** friction
- **Kind:** Learning · unsupported / wrong content
- **Route:** Dev + Content
- **Evidence:** Observed. After two wrong tries, Help shows "2-minute lesson | Attaching a file | Click Attach file under your message… Look for July 2026 at the top and no DRAFT stamp." Screenshot: C-d20-help-wrong.png. Code-verified: `COMPOSE_LESSONS` has no `reply-all` entry (`src/lib/tasks/mail/content.ts:1329+`, only mail-etiquette and call-out-sick). So `MailClient.tsx:356` falls back to `LESSONS[lang][Math.min(step,4)]`, and step 3 is "Attaching a file" (`mail/content.ts:991`).
- **Steps:** Day 20 → open Dana's thread → Reply → send "I am not sure" twice → press "?".
- **Fix:** Add a `COMPOSE_LESSONS["reply-all"]` lesson ("Who asked you? Reply goes to one person; Reply all goes to everyone.").

### C7. Day 20: Dana asks for "a yes or no", but "yes ok" is rejected
- **Sitting:** Day 20
- **Severity:** friction
- **Kind:** Learning · unfair (the check contradicts the prompt)
- **Route:** Content
- **Evidence:** Observed. Dana's message ends "I only need a yes or no from you. Not a group vote." The reply "yes ok" gets "Say it in a full sentence. Name the Friday delivery." "yes we can take it friday 6am" passes. Screenshot: C-d20-thread.png.
- **Steps:** Day 20 → Reply → "yes ok" → Send.
- **Fix:** Accept a clear yes/no, or change Dana's line to "Please reply yes or no, and say which delivery."

### C8. Choosing another route after Stay and lead moves the story backward and empties the inbox
- **Sitting:** Ending → Change direction → Front desk
- **Severity:** broken (continuity; dates must only move forward)
- **Kind:** UI/UX · dates/continuity
- **Route:** Dev + Content
- **Evidence:** Observed. Stay and lead ends on Fri Oct 16 (the Dana thread, Renata's "You sent it to Dana" at 5:12 PM). After Change direction → Healthcare / front desk → Choose, the Front desk Day 21 inbox shows Jordan's "Saturday close" (Day 14, Sep 28) as *today*, 11:40 AM, and Renata's Sep 22 email as "Tue". **Every Act III–IV email is gone**: the Oct 2, Oct 6, Oct 8, Oct 12 and Oct 14 Renata emails and the Dana thread. The shelf reads "Front Desk · Harborside Health · Day 21". Screenshot: C-route-hc-mail.png. Code-verified: `STORY_DAY_BY_LEVEL` has level15 at 77 (Oct 16) and level16 at 59 (Sep 28), plus level19h1 at 55 (Sep 24) for Office (`src/lib/story-dates.ts:62-80`). The comment there assumes "a learner only walks one of them", but the chooser offers the other routes after an ending.
- **Steps:** Finish Day 20 → Back to my desk → Change direction → Healthcare / front desk → Choose this direction → Start Act V → Mail.
- **Fix:** Offset a second route's dates to start after the last finished day (or keep the earlier route's mail visible), and add a test that walks lead → front desk / office / college.

### C9. The Day 16 and Day 17 crew schedules contradict each other for the same Thursday
- **Sittings:** Day 16, Day 17
- **Severity:** friction
- **Kind:** UI/UX · contradictory data (inside a judgment task)
- **Route:** Content
- **Evidence:** Observed.
  - Day 16's "Crew shifts this week" gives Thu: Sam **Off**, Casey **8–4** (C-d16-cal-1366.png).
  - Day 17, Thursday Oct 8 of that same week, gives Sam "**Working 8 AM–4 PM**" and Casey "**Requested off**" (C-d17-sheet.png).
  - The learner's own huddle (Thu Oct 8, 4:15 PM, agenda "Huddle agenda: Oct 8") is the same afternoon as Day 17's "4 PM shift has nobody" and "Renata's 5 PM huddle". Day 17 never mentions it.
  - Code-verified: `src/lib/tasks/team-meeting/content.ts:7` (HUDDLE_THURSDAY) and `src/lib/story-dates.ts:64-65` (level11 Oct 6, level12 Oct 8).
- **Fix:** Derive both tables from one crew week (`crew-week.ts`), and either move the Day 16 huddle or mention it on Day 17.

### C10. Day 15: the card covers the row numbers that Help tells you to read
- **Sitting:** Day 15
- **Severity:** friction
- **Kind:** UI/UX · card overlap
- **Route:** Dev
- **Evidence:** Observed. At 1366 the card covers columns A–E and the row numbers for rows 3–8, plus most of Renata's note (C-d15-sheet-1366.png). Help says "Look at the row numbers on the left" (C-d15-help.png). A learner can still get past: the green highlight, the H7 name box and the corrections are enough.
- **Fix:** Tag the grid's row header or column A as `data-card-avoid` so the card parks right.

### C11. Day 14: the card covers the Name column at 1366, and the correction goes stale
- **Sitting:** Day 14
- **Severity:** friction
- **Kind:** UI/UX
- **Route:** Dev
- **Evidence:** Observed.
  - The names in rows 3–6 are hidden when the sheet opens. After a correction the card grows and hides all names (C-d14-sheet-alex-wrong.png).
  - After picking Riley (wrong) and then Jordan (right), the card still says "Riley would go over 40 hours…" (C-d14-sheet-jordan.png). Code-verified: `assignCover` only calls `say` for a wrong pick and never dismisses on a right one (`TeamScheduleTask.tsx:~140-150`).
  - The overtime correction still says "A lead does not push someone into overtime", though the learner is a Shift Supervisor.
- **Fix:** Call `dismiss()` on a correct pick; tag the Name column; say "A supervisor".

### C12. Work lost on reload or window close (Days 14, 15, 20)
- **Severity:** friction
- **Kind:** UI/UX · recovery
- **Route:** Dev
- **Evidence:** Observed.
  - Day 14: the Saturday pick is lost on reload (`coverKey` is plain `useState`, `TeamScheduleTask.tsx:89`). The phone message *is* kept.
  - Day 15: the fixed formula is lost on reload and after "Next task" closes the window.
  - Day 20: the reply draft "yes we can take it" is gone after a reload.
  - Day 16 and Day 18 hubs *do* keep their progress on reload.
- **Fix:** Use `useTaskDraft` for the Day 14 pick, the Day 15 formula and the Day 20 reply body.

### C13. Day 14 phone message: "First pass on Casey's voicemail" reads as a noun phrase
- **Sitting:** Day 14
- **Severity:** friction
- **Kind:** UI/UX · instruction wording
- **Route:** Content
- **Evidence:** Observed. The card says "First pass on Casey's voicemail. Write Renata the phone message." The Spanish is "Primero pasa el mensaje de voz de Casey…", a calque. Code: `src/lib/tasks/team-schedule/voicemail.ts:67-70`.
- **Fix:** "First, write Renata the phone message about Casey's voicemail." / "Primero escríbele a Renata el recado de Casey."

### C14. Day 14 Help does not cover the new voicemail step
- **Sitting:** Day 14
- **Severity:** friction
- **Kind:** Learning · unsupported
- **Route:** Content
- **Evidence:** Observed. While the voicemail step is active, Help shows only "Fill a gap without overloading someone" (the schedule lesson). Screenshot: C-d14-vm-help.png.
- **Fix:** Add a phone-message lesson (who, why, number; read the transcript) that shows while `!messageSent`.

### C15. After the message is sent at 911, the file to open is off-screen with only a title on the card
- **Sitting:** Day 14
- **Severity:** friction
- **Kind:** UI/UX
- **Route:** Dev
- **Evidence:** Observed. After sending at 911, the pane stays scrolled. The card, at bottom-left, covers the templates, and "Hojas de cálculo recientes" peeks out under it. The card says only "Cubre el cierre del sábado", with no Show me button (Act III hides it). Screenshot: C-d14-sent-911-es-top.png. A scroll brings the file into view (C-d14-sent-911-es-down.png).
- **Fix:** Scroll the pane to the top (or to the file) when the message is sent.

### C16. Day 14 at 1366: the voicemail header is under the card, and the form sits below the fold
- **Severity:** friction
- **Evidence:** Observed. The card covers the phone's "Voicemail" heading and half of "Casey Brooks" (C-d14-voicemail-1366.png). The transcript is visible. The form needs a scroll, cued by a half-visible field. At 911 the transcript and form cannot be on screen together (C-d14-vm-911-es-scroll3.png).
- **Fix:** Place the form beside the phone on wide screens.

### C17. Day 16 Help tip still says "File → Make a copy", but this Docs has no File menu
- **Severity:** friction (a wrong instruction is never polish)
- **Kind:** Learning · unsupported
- **Route:** Content
- **Evidence:** Observed (C-d16-help.png). Help also says "Same conflict skill. New side of it.", which is abstract.
- **Fix:** Remove the tip, and write "Check who is working at that time."

### C18. Day 16 hub: "Send the invite with the agenda" is partly under the card at 1366
- **Severity:** friction
- **Evidence:** Observed. The button is at x 387–636 and the card reaches x=444, so the label reads "…the invite with the agenda" (C-d16-open-1366.png). It can still be clicked on its visible part.

### C19. Day 17 Mail Send is partly under the card at 1366
- **Severity:** friction
- **Evidence:** Observed. Send is at {x:403,w:74}; the card reaches x=444. A Playwright click was intercepted; Tab + Enter worked.

### C20. Day 19: at 1366 the card covers the Labor row, so "by how much" cannot be read
- **Severity:** friction (it would block, but after one try the correction supplies both numbers: "Compare actual spending ($2,850) with the budget ($2,400)")
- **Kind:** UI/UX
- **Evidence:** Observed. The Labor row box is {y:462,h:26}; the card top is at 466 (C-d19-sheet.png). Opening Help moves the card top-right and shows the sheet (C-d19-help.png), which is incidental. The Email path (File → Email → Email collaborators) and Send are clear of the card. The original "Email button covered" is fixed.
- **Fix:** Tag the table as `data-card-avoid` so the card parks right, where the space is empty.

### C21. Times out of order on the desktop clock
- **Sittings:** Days 15, 18, 20, route change
- **Severity:** friction (a wrong time is never polish)
- **Route:** Dev
- **Evidence:** Observed.
  - Day 18's HR offer is stamped 9:04 AM while the desktop says 8:45 AM.
  - Day 20: Renata's reply is stamped 5:12 PM while the clock reads 10:11 AM.
  - Front desk Day 21: Jordan's email is stamped 11:40 AM at 9:00 AM.
  - Day 15: the clock went 1:31 PM → 1:30 PM after a reload.
- **Fix:** Clamp message times to the story clock, or set the clock from the latest message.

### C22. The Act IV intro still says "This is the last stop if the cafe is where you want to stay"
- **Severity:** polish-plus / friction
- **Kind:** copy voice (transit idiom)
- **Route:** Content
- **Evidence:** Observed. The Spanish is "Esta es la última parada…". Screenshot: C-actIV-intro-es.png. This is original finding text, unchanged.
- **Fix:** "Choose this if you want to keep working at the cafe."

### C23. The Spanish Act IV title breaks the job-title decision
- **Severity:** friction
- **Kind:** Spanish consistency
- **Route:** Content
- **Evidence:** Observed. The owner decision is that "job titles stay in English in Spanish mode, with a Spanish gloss at first mention". Act III does this ("Ahora eres Shift Supervisor (supervisión de turnos)"). Act IV says "Ahora eres **asistente de gerencia**" and the level-up says "¡Ahora eres asistente de gerencia!" (`src/lib/tracks-content.ts` level13 levelUp).
- **Fix:** "Ahora eres Assistant Manager (asistente de gerencia)".

### C24. Kicker phrasing the copy-voice rules avoid is still present
- **Severity:** polish
- **Evidence:** Observed / Code-verified in `tracks-content.ts` level10 and level14: "Trust, then check" / "Confía, luego revisa" (Day 15), and "The numbers have a story" (Day 19). Day 17's desktop line reads "Choose a priority and a supported reason" / "un motivo basado en los datos", which is abstract for A2.

### C25. The award is still called "Reply-All"
- **Severity:** polish
- **Evidence:** Observed (C-d20-done.png): "Reply-All · Award unlocked". Its subtitle, "Choose reply instead of reply-all", is right.

### C26. The ending summary leaves out the Wave 4 phone-message skill and has no Act IV heading
- **Severity:** polish
- **Evidence:** Observed. summary.txt and C-ending-summary.png have no line about taking a phone message. The Act IV skills (class section, budget IF, reply vs reply-all) are listed under "Supervising a team". The summary otherwise works: name, class, date, "not employment history", Copy, Download (.txt saved) and Print.

### C27. Small items
- **Accessibility, polish:** the Day 14 Sat dropdowns and the Day 18 event selects have no accessible names.
- **Polish:** Day 17's Spanish hub says "Un cliente recibió…" for Dana. English is neutral; "Una clienta" fits better.
- **Friction, keyboard:** it still takes 18 Tabs to get from Jordan's Sat dropdown to "Email the person you added" (Day 14).
- **Realism, polish:** the call-back number "(555) 0137" is not a real phone-number shape. A US number is 7 or 10 digits, and learners should practise a full number such as (555) 555-0137.
- **Friction, missed moment:** Day 17 ends straight into the Act IV intro, with no finish card or Act III moment. Day 19 also goes straight to the Day 20 arrival.

### C28. At 911 on Day 18, the card covers the section Days and Time as soon as the rows are visible
- **Sitting:** Day 18 (Spanish, second account)
- **Severity:** blocks
- **Kind:** UI/UX · card overlap
- **Route:** Dev
- **Evidence:** Observed. With the rows off-screen, the card sits top-right (C-es911-d18-schedule.png). With every scroll step that brings the rows up, the card moves to the left corner (card x=24) and covers "Mar 5:00–7:45 PM" (overlap true at y 430, 370, 310 and 250; C-es911-d18-sched-step1..4.png, C-es911-d18-schedule-scrolled.png). The only columns left visible are Lugar, Lugares libres and Elegir, so the learner cannot compare section times with shifts. It chooses the corner that avoids the Elegir buttons (`JobCard.tsx:380-383`).
- **Fix:** Also treat the schedule's Days/Time cells as `data-card-avoid`, or collapse the card automatically when every corner hides a needed cell.

### C29. At 911 on Day 17, the hub links and the cover-sheet names are under the card
- **Sitting:** Day 17 (Spanish, second account)
- **Severity:** blocks (adds to C4)
- **Evidence:** Observed. "Abrir la hoja" is under the card (C-es911-d17-sheet.png; a forced click did nothing, and keyboard focus + Enter on the whole hub card worked). On the cover sheet, the card covers Name, Hours and the Thursday column for every row (C-es911-d17-sheet2.png).

## 4. Regressions

- **C8** is new in effect. The original audit's route-change bug was that "Stay and lead" did nothing. Now the finished route is correctly disabled and marked ✓ Finished, but choosing another route rolls the calendar back to Sep 28 and hides every Act III–IV email. The old build had no forward calendar, so this rollback could not happen before.
- **C5** (a false "Message sent. Done." card) was not in the original Segment C notes. It is a side effect of the route-aware Mail fix (#1): the fallback "last one done" now owns the card.
- **C6** (Day 20 Help shows "Attaching a file") was not reported originally.

No other sitting is worse than before.

## 5. Checks of Wave 4 additions and earlier fixes

| Item | Result |
|---|---|
| **Day 14 voicemail → phone message** (Wave 4) | **Works, with friction.** The schedule waits for the message ("First pass on Casey's voicemail…"). Per-field corrections fire in order and are specific: caller ("Who called? Write the caller's name…"), reason ("…Saturday off"), call-back ("Check the call-back number… 555, 0137"). Beginner English passes ("she want saturday free"), and so does Spanish ("quiere el sábado libre", "555-0137"). The transcript is always shown. The Spanish gloss appears in ES mode ("En español: Casey Brooks pidió el sábado libre…"). The reload keeps the draft fields and the sent state. At 911 it can be reached, but the transcript and form cannot be seen together. It can be done by keyboard (Tab through three fields, Enter on Send). Issues: C13, C14, C15, C16, C26, and the number shape in C27. Renata never acknowledges the message in Mail (not a defect). |
| Act IV boundary, Job Card after "Start Act IV" (#3) | **Fixed**, in both languages. EN at 1366: "Day 1 of 3 · Read the offer. Then make it fit.", and the shelf reads "Day 18: An Offer" (C-actIV-after-start.png). ES at 911, played across from Day 17 with Tab/Enter: "Día 1 de 3 · Lee la oferta. Luego haz que quepa." (C-es911-actIV-after.png). The New Tab page stays English ("Search Google or type a URL"), which is polish. |
| College-offer redesign (owner decision) | **Works as intended.** It has three sections: 01 clashes twice, 03 is full with a waitlist, 02 clashes once. Choosing 02 gets no hint. Sending the shift request to HR gets a correction; a request without a time gets a correction; the good request gets Renata's approval and an updated calendar. The event step catches the Jan 18 holiday. HR: "I do not accept" is rejected, "yes ok thank you" is asked for the section, and "section 01" gets the wrong-section correction. |
| HQ → Team Lead pacing and dates (owner decision) | Not in this segment's play path. Code shows Act VII at Apr 2027 (`story-dates.ts:88-91`). |
| Dates only move forward | **Within the route: yes.** Day 14 Mon Sep 28, Day 15 Oct 2, Day 16 Oct 6 (agenda "Oct 8"), Day 17 Thu Oct 8, Day 18 Oct 12 (spring term Jan 19 2027), Day 19 "week of Oct 12", Day 20 Oct 16. The inbox dates are ordered. **Across a route change: no** (C8). Clock times: see C21. |
| Day 14 overtime logic (keep hard) | Kept. "Alex already has 40 hours", 46 in red, Riley over 40; the Saturday pick carries to Day 15 (Jordan 30) and Day 17 (Jordan 30). Jordan's 30 → 24 reset is fixed. |
| Day 16 judgment fix (#12) | Thu 4:15 PM is really free now; the Wed hint names the right people. But see C9. |
| Day 17 A2 rewrite (#12) | Done: "Thursday, 3:40 PM. Dana is waiting now… Which do you do first? Why?" It no longer states the answer. "ok sorry" passes by design (`priority-call/content.ts:309`), and "I will tell the barista…" is no longer accused of a free drink. |
| Day 20 "I am not sure" (#5) | Fixed. It gets "Dana needs a clear yes or no." Reply-all is caught at once: "Dana asked you, not the whole thread. Click Reply." |
| Dana Ortiz's email arriving early | Fixed. It is not in the Day 15 inbox and appears on Day 20. |
| The chooser offering "Stay and lead" again | Fixed. The option is disabled and marked "✓ Finished". |
| Ending keepsake (#6) | Works: "Route finished · You finished the 'Stay and lead' route: 19 days of work in all", See my summary, Copy/Download/Print; the .txt downloaded. It opens behind an Awards overlay that must be closed first (✕; Escape did not close it). |

## 6. Predicted items (not counted)

- A learner who took the BHCC class offer and then picks Front desk hears nothing more about the class. The Act V clinic intro says only "Renata shared your name" (C-route-hc-start.png). This was observed for the first screen only.
- The voicemail's Play uses the browser's speech. On a Chromebook with no voices installed, Play may do nothing, but the transcript covers it.
- Day 15's File → Email path is not named anywhere in Act III (by design, since support fades). Learners who did not master it on Days 11–12 will probably try the Mail bookmark first and hit C5.
- "8–4" shift labels with no AM/PM (Day 16 table) may confuse some learners when they judge Thu 4:15 PM.
