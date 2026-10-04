# Wave 5 re-audit: Segment D (College route, Act V path A, through its ending)

**Status: final.** The session was interrupted once (driver restarted); all checks listed below were completed after the resume on the same build.

## 1. Header

- **Segment:** College route. Act V intro, Day 21 Getting Ready (level16, enrollment), Day 22 The Paperwork (level17, financial-aid), Day 23 Staying On Top of It (level18, coursework), Day 24 Finding a Real Answer (level19, research), the College ending, Marcus's closing note, and `/summary`.
- **Build:** production build at http://localhost:3300 (469078f).
- **Accounts:** `Audit5 D en 1` (class E2E-AUDIT5, PIN 1234). One Studio jump ("Start of Day 21: Getting Ready · College"), then played continuously through the ending. Second account `Audit5 D es 2` (same class): its own single Studio jump to the same start, then played continuously in **Spanish at 911×512** through the ending and the route chooser. It was used for the 911 and Spanish passes and for pressing the false "Start tomorrow" (F1) without breaking the main account's continuity.
- **Driver:** Playwright headless Chromium, `wave5/D/driver.mjs` + `wave5/D/run.sh`. Screenshots `wave5/img/D-*`.

Conditions actually checked (both accounts):

| Sitting | EN 1366 | Wrong try | Help (?) | Reload | 911×512 | Keyboard | Spanish |
|---|---|---|---|---|---|---|---|
| Act V intro | yes | n/a | n/a | no | yes (2nd acct) | no | yes |
| Day 21 | yes | yes (wrong bookmark, wrong date, wrong file, nonsense and short statements) | yes | yes | yes (2nd acct) | yes | yes (portal, starters, beginner Spanish statement) |
| Day 22 | yes | yes (both wrong amounts, both wrong dates) | yes | yes | yes | yes (date answer by Tab+Enter) | yes (arrival, desktop, portal, PDF) |
| Day 23 | yes | yes (wrong day, wrong time, one-word reply) | yes | yes | yes (2nd acct) | yes (selects by type-ahead; see note) | yes (task, starters, beginner Spanish reply) |
| Day 24 | yes | yes (sponsored result, weak reason) | yes (EN and ES) | yes | yes (2nd acct) | yes (Tab, Space, type, Enter) | yes |
| Ending + /summary | yes | n/a | n/a | no | yes (ending card, awards, chooser, summary) | no | yes |

Not checked: reload at the ending or on /summary; Print (only the button's presence); a keyboard-only pass of the ending card and chooser; real clipboard (headless has none); Help on Day 23 and 24 at 911.

Keyboard note: on a focused `<select>`, ArrowDown did not change the value in headless Chromium on macOS (that platform opens a popup); type-ahead ("Friday, 11") did. ChromeOS changes the value with arrows, so I do not count this as a finding.

## 2. Per-sitting table

| Sitting | Original verdict | UI/UX now | Learning now | Clean Pass? | Key evidence |
|---|---|---|---|---|---|
| Day 21 Getting Ready | Friction | **blocks beginners** (911: card covers the deadline choices at every scroll position) | fair | No | D-es2-d21-portal-es-911.png, D-d21-wrong-portal.png, D-d21-wrongfile.png |
| Day 22 The Paperwork | Friction | **blocks beginners** (911: card covers "Open award letter"; page cannot scroll) | fair, with unsupported hints (F6) | No | D-d22-portal-911.png, D-d22-check1-911.png |
| Day 23 Staying On Top of It | Friction | friction (false "That's today done" from Mail; reload loses work) | fair | No | D-d23-mail.png, D-d23-after-reload.png, D-es2-d23-es-911.png (911 OK) |
| Day 24 Finding a Real Answer | Blocks beginners | **blocks beginners** (911: results readable only in a ~15 px band under the card) | fair (correction now says what to write) | No | D-es2-d24-911.png, D-d24-weak.png |
| College ending + summary | Friction | friction (F10 card loses its buttons with Mail open; 3:55 PM note) | n/a | No | D-d24-route-end-card.png, D-d24-marcus-note.png, D-d-summary-1366.png |

Tally: 5 of 5 not clean; 3 blocks (all at 911×512), 2 friction; 0 broken. Every 1366×768 grade on its own would be friction.

## 3. Findings

### F1. Opening an earlier task's bookmark or Mail flips the Job Card to a false "Done" state with a live "Next task" / "Start tomorrow" button
- **Sittings:** Day 21 (Portal bookmark), Day 23 (Mail bookmark), and after the ending (Mail).
- **Severity:** friction. Tested on the second account: "Empezar mañana" from Mail on Day 23 only closes the windows and returns to the unstarted Day 23 card (`D-es2-d23-after-start-tomorrow.png`); it does not skip or complete the day. The Spanish card reads "Mensaje enviado / Terminaste este día. / Empezar mañana" (`D-es2-d23-mail-es-911.png`).
- **Kind:** UI/UX, wrong instruction on the Job Card.
- **Route:** Dev.
- **Evidence (Observed):**
  - Day 21, before starting the College task, I clicked the **Portal** bookmark as a plausible wrong try. The portal shows an old Act I shift-swap page, and the Job Card turns green: "You noticed the conflict and asked for a swap. / **Done. One more task for today.** / [Next task] / Do it again", with all 4 bars green. `D-d21-wrong-portal.png`. "Next task" closed the browser and restored "Find the deadline. Then apply." `D-d21-wrong-portal-next.png`.
  - Day 23, before starting coursework, I opened **Mail**. The reading pane shows "MESSAGE SENT" from an old mail task, and the card says "Message sent / **That's today done.** / [Start tomorrow] / Do it again", all bars green. `D-d23-mail.png`. The Day 23 task had not been started.
  - After the College ending, Mail again put "Message sent" in the card header over the route-finished line.
- **Why it matters:** the Job Card is the only instruction voice. Here it tells the learner the day is finished when it is not, and offers a big green button to move on.
- **Steps:** Studio "Start of Day 21 · College" → Act V intro → Open College → click Portal bookmark. Or on Day 23 open Mail from the bookmarks.
- **Fix:** a done-state report from a task that is not in the current sitting must not drive the card; show the current sitting's goal instead.

### F2. At 911×512 the Job Card covers the College pages' controls on Days 21, 22 and 24; nothing on screen says how to get past
- **Sittings:** Day 21, Day 22, Day 24 (Day 23 is fine: the card moves to the top right there).
- **Day 21 (Observed, 2nd account, Spanish):** the card covers the heading, the "Fecha límite" line and the correct choice "6 de noviembre de 2026". Scrolling in 40 px steps, the button is under the card at every position until it scrolls off the top (`CARD@356,…,CARD@196,-@156…`). `D-es2-d21-portal-es-911.png`. Playwright's forced clicks landed on the card, not the date.
- **Day 24 (Observed):** every result's kind label ("PATROCINADO", "FORO", "BASE DE DATOS"), its source line and the start of its title are covered except in one ~15 px band between the card's bottom (y≈440) and the window bottom (y≈455); each control was uncovered at exactly one of 30 scroll positions. `D-es2-d24-911.png`.
- **Day 22:**
- **Severity:** blocks.
- **Kind:** UI/UX, covering.
- **Route:** Dev.
- **Evidence (Observed):** at 911×512 the card (bottom-left, expanded) covers the "Financial aid" heading and the only button, "Open award letter". `elementFromPoint` at the button's centre hits the card; the portal does not scroll (mouse wheel changes nothing). `D-d22-portal-911.png`. After collapsing the card to get through, on the amount question the card covers the question "What is the award amount?" and the labels of $1,200 and $2,400. `D-d22-check1-911.png`. Playwright's click was refused: "`<p … data-card-line>Find the amount and the date.</p>` from `<div data-corner="bl" data-job-card>` subtree intercepts pointer events".
- **Code-verified:** `src/app/browser/CollegePortalTask.tsx` renders the aid home as a centred `max-w-[640px]` box with no gutter for the card. The card's auto-move (PR #45) only moves away from a Show me target, and the College portal registers no Show me.
- **Steps:** 911×512 window → Day 22 → Open College from the bookmarks → College.
- **Code-verified:** `CollegePortalTask.tsx` and `LibrarySearchTask.tsx` centre their content (`max-w-[640px]`, `max-w-[680px]`) with no reserved gutter; `CourseworkTask.tsx` has a right column and the card goes there.
- **Fix:** give the College portal and library pages the same card gutter as other task windows, or let the card move away from the page's primary button.

### F3. Day 21: the Job Card still cuts the file names ("…zation record.pdf") at 100%
- **Sitting:** Day 21.
- **Severity:** friction.
- **Kind:** UI/UX, covering.
- **Route:** Dev.
- **Evidence (Observed):** at 1366×768, after "Choose file", the picker's three files show as "…zation record.pdf", "…chedule.pdf", "…ion receipt.pdf"; the card also covers the start of "Immunization record", "Official transcript" and "Photo ID" in the checklist. `D-d21-college-1366.png`, `D-d21-wrongfile.png`. Same as the original finding. The row label "Immunization record" is readable once the page scrolls, so a beginner can match it.
- **Fix:** same gutter as F2.

### F4. Reload loses all in-task work on Days 21, 22, 23 and 24
- **Sittings:** all four.
- **Severity:** friction.
- **Kind:** UI/UX, recovery.
- **Route:** Dev.
- **Evidence (Observed):** after a reload the learner is back on the right day with the right card ("Open College from the bookmarks"), but the browser is closed and the task restarts. Day 21: the chosen deadline and a typed statement were gone (`D-d21-after-reload-portal.png`). Day 22: back at "Open award letter" after already answering the amount. Day 23: both dropdowns back to "Choose…" and the reply "sorry dana. i make new latte" gone (`D-d23-after-reload.png`). Day 24: the reason text gone.
- **Code-verified:** `CollegePortalTask.tsx` and `LibrarySearchTask.tsx` keep everything in `useState`; they do not use `src/lib/use-task-draft.ts`, which 14 other tasks use (for example `CollegeOfferTask.tsx`, `SwapRequestTask.tsx`). `src/app/browser/CourseworkTask.tsx:64-75` is the same (all `useState`).
- **Fix:** keep the statement, reply and reason in `useTaskDraft`, and the step answers too.

### F5. Day 21: "One required document is missing." stays after the document is Ready
- **Sitting:** Day 21.
- **Severity:** friction (a wrong label is never polish).
- **Kind:** UI/UX, wrong label.
- **Route:** Dev.
- **Evidence:** Observed: after choosing Immunization record.pdf the row says "Ready" and the note above still says "One required document is missing." (text dump in my run log). Code-verified: `src/app/browser/CollegePortalTask.tsx:137` renders `<p>{c.missingNote}</p>` unconditionally inside the Required documents box.
- **Fix:** hide the note, or change it to "All documents are ready.", when `docReady`.

### F6. Day 22: the award hints still refer to things the letter does not contain
- **Sitting:** Day 22.
- **Severity:** friction.
- **Kind:** Learning, unsupported hint.
- **Route:** Content.
- **Evidence:** Observed: choosing $1,200 gives "Look at the award total, not a payment."; $4,800 gives "That is twice the letter." `D-d22-wrong-amount.png`. The letter has one line, "Federal Pell Grant $2,400.00", and no payments (`D-d22-letter-es.png`). Help says "Open the PDF. Do not guess from the portal card." and "A portal summary can be wrong", but the portal shows no summary or amount. Code-verified: `src/lib/tasks/financial-aid/content.ts:15,17,117,121`. Same as the original finding; unchanged.
- **Fix:** "That is half. Look at the Amount column." / "That is too much. Look at the Amount column."; drop the portal-card lines from Help or show a portal card.

### F7. Day 22: the learner still never accepts the award, and Pell still has an accept-by date
- **Sitting:** Day 22.
- **Severity:** friction.
- **Kind:** Learning, realism.
- **Route:** Content.
- **Evidence (Observed):** the letter reads "You must accept or decline by the date below. After that date the offer may be given to another student." and "Federal Pell Grant $2,400.00 / Accept by: December 4, 2026". The task ends at "You read the letter" with no accept step. The school is named "Bunker Hill Community College", with addresses `portal.bhcc.edu/apply`, `classroom.bhcc.edu`, `library.bhcc.edu/search` and `mbell@bhcc.edu`, and no "practice" marker on the portal (the research source does say "(practice source)"). Also, the aid page's address is still `portal.bhcc.edu/apply`.
- **Fix:** relabel the award as a school grant or loan, or keep Pell and drop the accept-by; add an Accept button; mark the portal "Practice portal".

### F8. Day 22 opens in the PDF Reader with an English Downloads list and an undated file
- **Sitting:** Day 22.
- **Severity:** polish (no time cost) / wrong date format.
- **Kind:** UI/UX, Spanish and consistency.
- **Route:** Dev.
- **Evidence (Observed):** Downloads now lists safety-report-july.pdf (Aug 1, 2026), paystub-aug-18-28.pdf (Aug 28, 2026), bhcc-award-letter-spring-2027.pdf (Nov 17, 2026), sched_91426.pdf (**Sep 11**, no year) and sched_92126.pdf (Sep 14, 2026). In Spanish the list header "Downloads", "Page 1 / 1" and the letter are English. `D-d22-letter-es.png`. The Act I–III practice files are in the list; they do not get in the way here.

### F9. Spanish: English left in the browser chrome and portal, and a gender mismatch on Day 24
- **Sittings:** all.
- **Severity:** friction.
- **Kind:** UI/UX, Spanish.
- **Route:** Content + Dev.
- **Evidence (Observed):** in Spanish the browser shows "New Tab", "Search Google or type a URL", and the bookmarks "Calendar" and "Forms" next to "Bienvenida", "Correo", "Universidad", "Iniciar sesión" (`D-d22-start-es.png`). The portal header says "Student portal" (`D-d22-portal-es.png`). Day 24: the label "Por qué este" (masculine) sits over starters "Puedo confiar en ella porque" and "La escribieron" (feminine), and the placeholder says "confiar en él" (`D-d24-starters-es.png`; `src/lib/tasks/research/content.ts:89-90,110-111`). Awards dialog in Spanish keeps "II · Shift Lead", "III · Shift Supervisor", "IV · Assistant Manager", "VI · Office Administrator", "VII · Team Lead" next to "I · Personal nuevo" and "V · Puente" (`D-es2-end-911.png`); `tracks-content.ts:1157-1158` sets these role names to English on purpose, but I and V are translated, so the list is mixed. The award line "distinguir una fuente confiable de una que no lo es" is a lowercase fragment. Day 23 in Spanish: "Entrega Viernes, 11:59 PM" and "Jueves" capitalised mid-line; the arrival card calls the syllabus "programa" while the summary says "temario". Day 21 Spanish starter "Aplico para seguir trabajando…" is a calque (`src/lib/tasks/enrollment/content.ts:94`); "Solicito" or "Me inscribo" is the Spanish.
- **Fix:** localize New Tab, the search placeholder, Calendar and Forms (or gloss them), "Student portal"; make Day 24 one gender ("Por qué esta fuente"); change "Aplico".

### F10. After the ending, opening Mail turns the card into "You finished everything." with no buttons
- **Sitting:** College ending.
- **Severity:** friction.
- **Kind:** UI/UX, Job Card.
- **Route:** Dev.
- **Evidence (Observed):** after "Route finished … See my summary", I opened Mail and Marcus's closing note. The card changed to "Day finished / **You finished everything.** / Read this out loud", with no See my summary and no Change direction. `D-d24-marcus-note.png`. Closing the browser window brings the buttons back (`D-d24-after-close-mail.png`); nothing tells the learner to do that. This is the original Day 24 finding, now at the route end instead of before "Start tomorrow". "Everything" is also wrong: only one route of four is finished.
- **Fix:** keep the route-finished card (with See my summary) while any window is open.

### F11. Times and day counts that do not agree
- **Sittings:** Days 22–24, ending.
- **Severity:** friction (wrong numbers).
- **Kind:** UI/UX, consistency.
- **Route:** Dev + Content.
- **Evidence (Observed):**
  - Marcus's Day 24 note is stamped **3:55 PM** while the clock says 9:01 AM (`D-d24-marcus-note.png`; Code-verified `src/lib/story-beats.ts:664`, `time: "3:55 PM"`; the Day 23 note is fixed at "6:40 PM" at :624).
  - The clock runs on from the last sitting (Day 22 opens at 9:01 AM), and at the route end it went from 9:03 back to 9:01 (`D-d24-route-end-card.png`).
  - The ambient mail (IT Helpdesk "8:02 AM", Bean & Leaf "Yesterday", Cafe Team "Mon") is identical on Sep 28, Nov 18, Feb 11 and Mar 5.
  - Mail dates mix formats: "Feb 11" next to "11/18/26".
  - The inbox count reads 17 in the sidebar and 20 in the list header (`D-d23-mail.png`).
  - The taskbar says "Day 24: Finding a Real Answer" while the card says "16 days of work in all" (the learner skipped Acts III–IV). This may be deliberate, but the two numbers sit on one screen.
- **Fix:** stamp route notes at or before the clock; one date format; one inbox count.

### F12. Day 21: the nonsense check is fixed, but a 3-word honest statement is rejected with a correction that does not say why
- **Sitting:** Day 21.
- **Severity:** friction.
- **Kind:** Learning, writing check.
- **Route:** Content.
- **Evidence:** Observed: "asdf college asdf asdf asdf" is now rejected (fixed). "i like study" is rejected with "Say why you want to study here, in your own words. One honest reason is enough.", which it arguably is. "i want study english for better job" passes. Code-verified: `statementShowsInterest` needs `looksLikeRealText(body, 4)` (`src/lib/tasks/enrollment/content.ts:137-139`).
- **Fix:** when the text is short, say "Write a little more: why do you want to study?".

### F13. Day 24: the beginner reason is still rejected, but the correction now says what to write
- **Sitting:** Day 24.
- **Severity:** friction (was blocks).
- **Kind:** Learning, writing check.
- **Route:** Content.
- **Evidence:** Observed: "it look true and serious" gets "Say it is from a database, or that it was reviewed, or that it names its authors, not just that you like it." (`D-d24-weak.png`). "it from library database" passes. The source now shows "L. Chen and R. Morales · Workplace Communication Review (practice source), 2024 · Peer reviewed" (no "No sources" wording anywhere). "not just that you like it" answers something the learner did not say. "That one does not hold up" (wrong source) is an idiom above A2.
- **Fix:** "Say one fact: who wrote it, or where it is from."

### F15. Act V intro at 911×512: "Start Act V" is below the fold with no scroll cue
- **Sitting:** Act V intro (entry to Day 21).
- **Severity:** blocks (by the agreed rule: scrolling with no cue).
- **Kind:** UI/UX, covering/fold.
- **Route:** Dev.
- **Evidence (Observed, 2nd account):** at 911×512 the page ends at the skills box; the "Comenzar el Acto V" button's bottom is at y=727 on a 512 px viewport, and nothing shows that the page continues. `D-es2-intro-es-911.png`. The page does scroll (Playwright's click scrolled it into view).
- **Note:** this is the shared act-intro shell, so other segments' act boundaries are likely affected the same way.
- **Fix:** pin the continue button to the bottom of the viewport on short screens.

### F16. Awards dialog does not close with Escape and covers the Job Card's button
- **Sitting:** Day 24 → ending.
- **Severity:** polish (the ✕ is visible).
- **Evidence (Observed):** after "See award"/"Ver premio", Escape leaves the dialog open, and the card's "Back to my desk" cannot be clicked until ✕ is pressed (Playwright: "`<div class="fixed inset-x-0 top-0 z-[75] …">` intercepts pointer events"). `D-d24-card-end.png`, `D-es2-end-911.png`.
- **Fix:** close on Escape and on outside click.

### F14. Small items (polish)
- Day 21: after choosing a file with the keyboard, focus drops to `<body>` (Observed, run log).
- Day 21: the Help text says "Portals bury the date", an idiom.
- Day 21: pressing Submit goes straight to the Day 22 arrival card; the "Application sent" confirmation is only seen behind the modal (`D-d21-done.png`).
- Day 24: the "Marcus left a note" toast covers the database result's title for a few seconds (`D-d24-library-1366.png`).
- Day 24: the card covers "FORUM" and "LIBRARY DATABASE" labels until the list is scrolled (`D-d24-library-1366.png`).
- Summary: "I can write a SUM and cc a co-lead." is jargon for a keepsake.

## 4. Checks of the re-check list

| Item | Result |
|---|---|
| College dates follow BHCC Spring 2027, only forward | Code-verified: `COLLEGE_STORY_DAY_BY_LEVEL` (`src/lib/story-dates.ts:115-120`) = Mon Sep 28 2026, Wed Nov 18 2026, Thu Feb 11 2027, Fri Mar 5 2027. Observed: arrival copy "It is November now", "It is February", "It is March"; the classroom says "Today: Thursday" (Feb 11, 2027 is a Thursday); Marcus's mail is dated 9/28/26, 11/18/26, Feb 11, and today. Works. There is no visible calendar date on the desktop or in Quick Settings, so a learner only sees the date through mail. |
| Award-letter accept-by date and wording | "Accept by: December 4, 2026", after the letter (Nov 17/18) and before registration and the Jan 19 start. Consistent. Realism concerns remain (F7). |
| College ending no longer says "Monday, Anita needs you at HQ" | Fixed. Marcus's note: "That finishes your college practice. Your work is saved." `D-d24-marcus-note.png`. |
| Research source metadata | Fixed: authors, journal "(practice source)", year and "Peer reviewed" are shown; reason naming them passes. |
| Award-letter return button | Works: in the PDF the card shows "Back to Browser" / "Volver al navegador" and returns to the question (`D-d22-letter-es.png`). |
| Spanish starter chips | Fixed: Day 21, 23 and 24 starters are all Spanish (Day 21 keeps the program name "Business Essentials"; F9 lists the calque and the Day 24 gender mismatch). Beginner Spanish passes: "yo quiero estudiar ingles para trabajo mejor", "perdon dana. yo hago latte nuevo", "es de la base de datos de biblioteca". |
| Route chooser after the ending | Works: "Preparación universitaria (opcional) ✓ Terminado", the other routes with day counts and managers, and "Terminar aquí por ahora / Guarda tu resumen de habilidades" (`D-es2-chooser-es-911.png`). Code-noted, not played: choosing Office after College moves the story date from Fri Mar 5, 2027 back to Thu Sep 24, 2026 (`story-dates.ts:76` level19h1 = 55); `story-dates.test.ts:66-80` walks each route on its own, so a route taken after another route is not covered by the test. |
| Summary at the ending | Works: "See my summary" on the card, `/summary` with name, class code, date, program, "Simulated workplace practice, not employment history.", first-person skills under plain headings, in English and Spanish; download gives `workplace-practice-summary.txt`. Copy shows "Clipboard access is unavailable. Use Download summary (.txt) to keep a text copy." in headless. |

## 5. Regressions
None confirmed against the original report. Days 21, 22 and 24 now grade as blocks at 911×512 where the original graded Days 21 and 22 as friction; the original auditors may not have checked those pages at 911. F1 (false "Done" card from an earlier task's page) was not in the original Segment D report; I cannot tell whether it is new or was not tried.

## 6. Wave 4 additions in this segment
Wave 4 added nothing on this route. The Act I–III practice files show up in the PDF Reader's Downloads on Day 22 (F8) and do not interfere.

## 7. Predicted items (not counted)
- A learner who presses "Start tomorrow" from Mail on Day 23 (F1) may believe the day is over and stop.
- At the end, a learner who reads Marcus's note first may leave on "You finished everything." and never see the summary (F10).

