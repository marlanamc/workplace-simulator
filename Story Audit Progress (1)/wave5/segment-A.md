# Wave 5 re-audit: Segment A (sign-up through payday, no Studio)

## 1. Header

- **Segment:** A. From a brand-new sign-up at `/login` to the end of Day 6 (First Paycheck), then one look at the Act II intro. **Studio was never used.**
- **Sittings:** How this works (level0), The Night Before (level1), Day 2 The First Week (level2), Day 3 Clock-In Fix (level3), Day 4 Write to a Coworker (level3a), Day 5 The Sick Call (level3a2), Day 6 First Paycheck (level3a3).
- **Build:** production build at http://localhost:3300 (469078f). The repo was only read.
- **Accounts** (class code `E2E-AUDIT5`, PIN 1234):
  - `Audit5 A en 1`: **English, 1366×768**, played continuously from sign-up to the Act II intro. I resized it to 911×512 at key screens: the welcome, the arrival card, the Day 2 schedule, swap form and Maria's text, the Day 2 attach compose, the Day 4 compose, and the Day 6 stub and questions.
  - `Audit5 A es 2`: a second fresh sign-up, **Spanish, 911×512, keyboard where practical**. Played continuously from sign-up to the Act II intro. The second account was needed because each sitting can be played only once per learner, and Spanish/150% had to be seen on the real screens. The browser session was lost mid-Day 3 (the audit session paused), so I signed this learner back in on a fresh browser through "Add user" (same name, code and PIN) and continued.
  - `Audit5 A en 3`: a third fresh sign-up, **English, 911×512**, scripted quickly through level 0 and the Night Before only to re-test the Day 2 attach step at 150% (F-17). It stopped after Day 2's attachment.
- **Conditions checked**

| Sitting | EN 1366 | 911×512 | ES | Keyboard | Wrong try | Help | Reload |
|---|---|---|---|---|---|---|---|
| How this works | yes | yes (ES acct) | yes | yes (Tab counts) | yes (Start menu, wrong bookmark, wallpaper) | yes | yes |
| Night Before | yes | yes (ES acct) | yes | partial (focus after row/reply) | yes (HR email, "ok thank you darnell") | no (tour Help used instead) | yes (draft kept) |
| Day 2 | yes | yes (both accts) | yes | partial (swap by Enter; select needs mouse or type-ahead) | yes (Mon/Tue rows, empty submit, thu-early, fri, June answer, DRAFT file, send without file, "ok" text) | yes | yes, twice (text step, attach step) |
| Day 3 | yes | yes (ES acct) | yes | partial (arrival Enter) | yes (Shift notes tab, "Looks right", "clock is wrong", "shift good") | yes | partial (a fresh sign-in mid-task 2: card and step came back, typed note not kept) |
| Day 4 | yes | yes (both accts) | yes | no | yes ("yes we have", "ok gracias", stale Portal) | yes | yes (draft lost) |
| Day 5 | yes | yes (ES acct) | yes | no | yes ("hi maria i am sick", "i am sick. i cant come", "hola maria estoy enferma") | yes (EN, ES) | yes (ES: premise kept, draft lost) |
| Day 6 | yes | yes (both accts) | yes | no | yes ($720 twice, 40 hours, stray Mail visit) | yes (ES) | yes (progress lost) |

Gaps are listed plainly at the end of section 3 and updated as checks finish.

## 2. Per-sitting table

| Sitting | Original verdict | UI/UX now | Learning now | Clean Pass? | Key evidence |
|---|---|---|---|---|---|
| How this works (level0) | Friction | **friction** | none | No | Practice is now the main button and Skip is a text link (fixed). Still: at 911 the practice offer is hidden inside the card's own scroll area (`A-es-l0-intro-911.png`). A reload mid-tour restarts the tour. After "Mail", 18 Tabs to "I understand". The Help kicker still says "2-minute lesson". |
| The Night Before (level1) | Friction | **friction** | fair (one thin check, see F-15) | No | At 150% Maria's email is no longer covered (fixed, `A-es-l1-inbox-911.png`). New: on return after "Stop for today", the same stop card comes back with "Stop for today" as the big blue button and "Next time you sign in…" (`A-l2-arrival-after-signin.png`). |
| Day 2 (level2) | Blocks beginners | **broken** (Spanish text reply) + **blocks beginners at 911** (file picker after a wrong preview, F-17) | given away / unsupported at 911 | No | Maria's text rejects "Sí, el jueves" and tells the learner "Empieza con Sí o OK" (`A-es-l2-text-si-bug.png`, `manager-text.ts:26`). At 1366 the card covers the schedule's Wed–Sat day and time labels (`A-l2-start-1366.png`) and the "Which shift?" select (`A-l2-swapform-1366.png`). At 911 the phone calendar is off-screen and every row label is under the card (`A-es-l2-schedule-911.png`). A runaway card gutter grows the Portal page to over a million pixels tall (F-2). |
| Day 3 (level3) | Blocks beginners | **blocks beginners at 911**, friction at 1366 | given away at 911 (Show me answers the "does this look right?" question) | No | At 911, Show me on the shift note points at nothing, below the screen (`A-es-l3-note-911-showme.png`). Submit is under the card at most scroll positions, and the card changes corner as the page scrolls (F-2, F-5). At 1366, after typing, Show me moved the card over Submit (`A-l3-note-showme.png`). The clock-in note now needs a time ("clock is wrong" is corrected; fixed). |
| Day 4 (level3a) | Friction | **friction** | fair | No | The card no longer hands over "storage room"; it comes after a wrong try or from Help (fixed as recommended). Spanish "ok gracias" now gets "Darnell preguntó dónde están los delantales de más. Dile: en el almacén." (fixed). The Portal bookmark still shows Day 2's "Done. One more task for today." (`A-l3a-portal-stale.png`). A reload loses the draft. |
| Day 5 (level3a2) | Blocks beginners | **friction** | fair | No | "I am sick. I no come today." passes, and "i am sick. i cant come" gets a precise "Say when" correction (fixed). The shift is "at 7", matching the schedule (fixed). Still: the step line above the correction reads "Click Send." (`A-l3a2-wrong1.png`). Focus is not placed in the compose box. |
| Day 6 (level3a3) | Friction | **friction** | **given away** | No | The stub list shows "$571.32 net pay" before the stub is opened (`A-l3a3-start-1366.png`). The hours question states "six shifts of 8 hours". A reload restarts the stub. In Spanish the stub itself is all English ("Net pay") with no gloss, while the card says "pago neto" (F-21). Fixed: the stub circles are gone, Social Security/Medicare is $55.08, Downloads holds no College letter, and Mail no longer opens an Act II compose to Jordan. |

**Tally (7 sittings, worst verdict per sitting):** 0 Clean Pass · 1 broken (Day 2, which also blocks at 911) · 1 blocks beginners (Day 3) · 5 friction. Learning: 1 given away (Day 6), Day 2 and Day 3 given away at 911 only, the rest fair or none. The original tally was 4 friction and 3 block.

## 3. Findings

### F-1. Maria's text rejects an accented "Sí" and tells the learner to start with "Sí"
- **Sitting:** Day 2 (Wave 4 addition)
- **Severity:** broken
- **Kind:** UI/UX · grading fails the right thing (Spanish)
- **Route:** Dev
- **Evidence:** Observed. In Spanish I replied "Sí", then "Sí, el jueves", then "Sí jueves". Each got "Dile a Maria si el nuevo horario te funciona. Empieza con Sí o OK." (`img/A-es-l2-text-si-bug.png`). "si jueves" (no accent) passed. Code-verified in `src/lib/tasks/swap-request/manager-text.ts:26`: `YES = /\b(…|s[ií]|…|ah[ií] estar[eé]|…)\b/`. In JavaScript, `\b` does not treat `í` or `é` as word characters, so the closing `\b` after "sí" or "estaré" never matches at the end of a word. I ran a port of the regexes (`wave5/A/textgrade.mjs`). "Sí, ahí estaré el jueves" also returns `no-yes`. The unit test (`src/lib/__tests__/manager-text.test.ts:12,21`) passes only because its sentences also contain "bien" or "gracias". This check does not use the shared reader `src/lib/grading/meaning.ts`, which normalizes accents ("si", "ahi estare").
- **Other beginner cases from the same port (Code-verified, not all Observed):** "yes thurday" / "yes thrusday" (misspelled day) → "Say the day or the time too", although the day was said. "yes, Friday 10 AM" and "yes see you monday 10" → **pass** (the wrong day passes because "10" counts as a detail). "ok but i no can thursday" → pass (a beginner decline passes). "ok" / "yes" / "ok thank you maria" → a correct, specific correction. "yes thursday 2 ok" → pass (Observed on the EN account).
- **Steps:** Spanish learner → Day 2 → file the swap for Thu 2–10 → in the phone, type "Sí, el jueves" → Enviar.
- **Fix:** Grade the text reply with `yesNoAnswer()` from `meaning.ts` (accent-normalized), and require the detail to be Thursday or 2 PM rather than any "10".

### F-2. At 911×512 the Job Card's scroll gutter runs away, and Show me then points off-screen
- **Sittings:** Day 2 (swap form, schedule), Day 3 (shift note). Likely every Portal page at this size.
- **Severity:** blocks (Day 3 at 911). It is the root cause of several 911 findings below.
- **Kind:** UI/UX · layout feedback loop
- **Route:** Dev
- **Evidence:** Observed. On the Day 2 swap form at 911×512, the Portal's scroll area (`[data-app-window] .min-h-0.flex-1.overflow-y-auto.p-6`) had `--job-card-gutter` growing about 12,500 px per second. Samples: 359,989 → 372,469 → … → 1,024,861 px, and on the schedule tab 1,626,725 px. On the Day 3 shift note (ES account) it was 131,874 px. At 1366×768 the same area stayed at 810 px. Because the area is now taller than its clipping parent, the browser thinks the target is already visible. So on the Day 3 note, Show me drew "Este. Haz clic aquí." over the taskbar, pointing at nothing (`img/A-es-l3-note-911-showme.png`). After scrolling, its highlight drifted over the browser's address bar (`img/A-es-l3-note-911-wheel2.png`). Code-verified: `src/components/task/JobCard.tsx:117-135` (`updateScrollGutters`) sets the gutter to `r.bottom - card.top + EDGE`, measured from the element's own rect. `src/app/globals.css:353` applies it as `padding-bottom … !important`. When the gutter plus the top padding is taller than the parent (true at 512 px high with the card in a bottom corner), the padding forces the flex child taller. That raises `r.bottom`, the next pass adds more gutter, and the loop never ends.
- **Steps:** Play to Day 2 at 911×512 → Request a swap on Thursday → in devtools, watch the scroll area's `scrollHeight`.
- **Fix:** Measure the gutter against the clipping parent's rect (or cap it at the parent's height) and skip the update when the value only grows because of the last write.

### F-3. Day 2: the card covers the schedule it asks the learner to read
- **Sitting:** Day 2
- **Severity:** blocks at 911, friction at 1366
- **Kind:** UI/UX · card covers content · Learning · unsupported/given away
- **Route:** Dev
- **Evidence:** Observed. At 1366 on arrival, the card (bottom-left) covers the day and time of Wed, Thu, Fri and Sat. After the first wrong try it grows and also covers Tue. At that point it says "Look at Thursday, Aug 27…" while Thursday's label is under it (`img/A-l2-start-1366.png`, `img/A-l2-wrong2.png`). elementFromPoint on "Aug 27" returns the card. The card did not move, because the overlap logic moves it only for Show me targets and controls, not for content. At 911 the heading, tabs and every day/time are under the card, and the phone calendar is at y≈750–990, below the screen. Only the "Pedir un cambio" buttons are visible (`img/A-es-l2-schedule-911.png`). Collapsing the card still leaves Thursday and the phone off-screen (`img/A-es-l2-schedule-911-collapsed.png`). Show me points straight at Thursday's button, so the comparison the task teaches is skipped.
- **Steps:** Arrive on Day 2 at 911×512 → look for Thursday or the phone.
- **Fix:** Treat the schedule rows and the phone as "important content" for card placement, and at narrow widths put the phone beside or above the schedule instead of below it.

### F-4. Day 2 swap form: the card covers "Which shift?", and Show me points at Submit instead of the empty choice
- **Sitting:** Day 2
- **Severity:** friction
- **Kind:** UI/UX
- **Route:** Dev
- **Evidence:** Observed. At 1366 the card (bottom-left) covers the "Which shift?" select. The "could you work instead?" select and Submit are below the fold (`img/A-l2-swapform-1366.png`). The step says "Pick a shift you can work instead", but Show me highlights **Submit request** (`img/A-l2-swapform-showme.png`). Clicking it gives "Pick the shift you could work instead." Code-verified: `src/app/browser/SwapRequestTask.tsx:41` `const showMeId = view === "text" ? "text-reply" : "submit-button";`. At 911 the phone is off-screen at every scroll position where the select can be seen, and back again (`img/A-l2-911-st700.png`, `A-l2-911-st850.png`).
- **Fix:** Point Show me at the cover select until it has a value, then at Submit.

### F-5. Day 3 shift note: once text is typed the card never says "Submit", and Show me can cover Submit
- **Sitting:** Day 3
- **Severity:** friction at 1366; part of the Day 3 block at 911 (with F-2)
- **Kind:** UI/UX
- **Route:** Dev
- **Evidence:** Observed. At 1366 Submit sits at y≈740, below the window (`img/A-l3-note-1366.png`). After I typed "it was busy at 11", the card still read "Write a short shift summary…". Show me highlighted the already-filled box and moved the card to bottom-left, where elementFromPoint on Submit returns the card (`img/A-l3-note-showme.png`). At 911 in Spanish, Enviar was covered at scrollTop 500. It was clear only at 350–450, and the card switched corner between those positions.
- **Fix:** Add a "Click Submit" step once the box has text, and target Submit with Show me.

### F-6. On return after "Stop for today", the same stop card appears with Stop as the main button
- **Sittings:** Night Before → Day 2; applies to every `stoppingPoint` (Day 3→4, Day 6→Act II)
- **Severity:** friction
- **Kind:** UI/UX
- **Route:** Dev + Content
- **Evidence:** Observed. I pressed "Stop for today (your work is saved)", which signed me out, then signed in with the PIN. The card that came back was identical: "Maria noticed you… Next time you sign in, your schedule will be waiting." "Stop for today" is again the big blue button, and "See my schedule" is the quiet one (`img/A-l2-arrival-after-signin.png`). Focus is correctly on "See my schedule". A mouse user who presses the blue button signs out again. Code-verified: `src/components/LevelUpCelebration.tsx:121-138` always renders the stop-point layout.
- **Fix:** After a fresh sign-in, show the stop card as an arrival: continue first, and no "next time you sign in".

### F-7. Reloads still lose work outside the Night Before
- **Sittings:** Day 2 attach, Day 4, Day 6 (and level0)
- **Severity:** friction
- **Kind:** UI/UX
- **Route:** Dev
- **Evidence:** Observed. The Night Before draft survived a reload (fixed there). Day 2 attach: after answering the question, attaching the final PDF and typing "here is report", a reload returned to "What does she need? Pick one." with no attachment and no draft. Day 4: the draft to Darnell was gone after reload. Day 6: after answering net pay, a reload restarted at "Open your pay stub from the list". Level 0: a reload mid-tour returns to the welcome beat (by design in `pointer-practice.spec.ts`, but a cost).
- **Fix:** Keep in-task step and draft state in progress state, as the Night Before replies now do.

### F-8. Day 6 gives the net pay away before the stub is opened
- **Sitting:** Day 6
- **Severity:** friction
- **Kind:** Learning · given away
- **Route:** Dev + Content
- **Evidence:** Observed. The Pay Stubs list row reads "Barista · Aug 18 – Aug 28 · $571.32 net pay" (`img/A-l3a3-start-1366.png`). The first question is "What was the net pay on your stub?", with $571.32 as an option. The hours step says "Compare … six shifts of 8 hours" (`img/A-l3a3-q2.png`). The hours options still include "$720.00", but it now answers with a specific correction ("That's the gross pay in dollars, not a number of hours" / "Eso es el pago bruto en dólares, no un número de horas"), so it works as an intended distractor. The arrival still says "Two weeks in." for Aug 18–28 (11 days).
- **Fix:** Remove the net pay from the list row, and let the learner count the shifts (or state only "your time record") instead of giving "six shifts of 8 hours".

### F-9. The Portal bookmark on Day 4 shows Day 2's finished screen
- **Sitting:** Day 4
- **Severity:** friction
- **Kind:** UI/UX · stale state
- **Route:** Dev
- **Evidence:** Observed. On Day 4, clicking Portal shows "You noticed the conflict and asked for a swap. Done. One more task for today. [Next task]" (`img/A-l3a-portal-stale.png`). Day 4 has one task. "Next task" does return to the desktop with the right job. This is the original finding, unchanged.
- **Fix:** Show the Portal home when no Portal task is active.

### F-10. The step line above a correction still says "Click Send."
- **Sittings:** Day 3 (clock note), Day 5 (sick call)
- **Severity:** friction
- **Kind:** UI/UX · two instructions disagree
- **Route:** Dev
- **Evidence:** Observed. Day 5, after "hi maria i am sick": "Click Send. / Tell Maria you cannot work today's shift. For example: I can't come in today." (`img/A-l3a2-wrong1.png`). Day 3, after "hi maria. clock is wrong": "Click Send. / Tell Maria what time you got here…". This is the original finding, still present.
- **Fix:** When a correction is showing, make the step line the correction's goal, not "Click Send."

### F-11. Spanish mode shows English dates, labels and a status line
- **Sittings:** Day 2, Day 3 (Spanish account)
- **Severity:** friction
- **Kind:** UI/UX · mixed language
- **Route:** Content + Dev
- **Evidence:** Observed. The Spanish inbox shows "Yesterday", "Mon", "Aug 18" and "Aug 12" next to "Lun" (Day 2 inbox text dump). Code-verified: `src/lib/tasks/mail/content.ts:1071-1103` hard-codes `time: "Yesterday"`, `"Mon"`, `"Aug 18"`, `"Aug 12"`, while `story-calendar.ts:182` already localizes "Ayer". The Time Clock shows "16h 05m this week" (`img/A-es-l3-clock-911.png`; `src/lib/tasks/timeclock/content.ts:32`, English only). The file picker dates read "Jul 14", "Aug 1" (`img/A-es-l2-picker-911.png`). The tab says "Reloj checador" and the heading says "Reloj de tiempo" (`PortalPage.tsx:25` vs `timeclock/content.ts:115`). The Mail app header says "Mail" while the bookmark says "Correo".
- **Fix:** Route inbox filler times through `story-calendar` labels, and localize `weekHours` and the picker dates.

### F-12. Inbox dates are static: the same email is "Yesterday" on Wednesday and on Friday
- **Sittings:** Day 2 → Day 3
- **Severity:** friction (a wrong date is never polish)
- **Kind:** UI/UX · content consistency
- **Route:** Content
- **Evidence:** Observed. HR's "Your first payday" and IT's "Reminder: update your password" read "Yesterday" on Wed Aug 19 and again on Fri Aug 21. Harbor Dairy "7:41 AM" and Schedule "6:15 AM" show as today on both days. After Day 5, Fri Aug 21 appears as both "Fri" (HR) and "Aug 21" (Maria). IT's "Your password expires in 12 days" for a two-day-old account is still there (original finding). Code-verified at `mail/content.ts:1071-1079`.
- **Fix:** Give filler emails a story day and let `story-calendar` label them.

### F-13. Three different clocks on Day 2's phones and desktop
- **Sitting:** Day 2
- **Severity:** friction (wrong number)
- **Kind:** UI/UX · content
- **Route:** Dev
- **Evidence:** Observed. The desktop reads 9:57 AM, the phone calendar status bar reads 8:14 (`img/A-l2-start-1366.png`), and the Messages phone reads 4:12 (`img/A-l2-text-911-top.png`). Code-verified: `SwapRequestTask.tsx:287` `time="4:12"`, and `PhoneFrame.tsx:13` defaults to `"8:14"`. The original "two clocks" finding on Day 3 is fixed: the Time Clock and the desktop both read 8:15 AM.
- **Fix:** Pass the story clock to `PhoneFrame`.

### F-14. Keyboard: focus is lost after card actions, and the Job Card is far down the Tab order
- **Sittings:** How this works, Night Before, Day 2, Day 3, Day 5, Act II intro
- **Severity:** friction
- **Kind:** UI/UX · accessibility
- **Route:** Dev
- **Evidence:** Observed. After "Start looking around" (clicked after practice), focus went to the card's collapse button, so Enter would hide the card. On the Spanish account (no practice) it went to "Siguiente" correctly. After "Next" → "Click Mail", focus is on `BODY`, and it takes 13 Tabs to reach the Mail bookmark. After Mail opens, it takes 18 Tabs to reach "I understand" on the card. After "I understand" on the task-list beat, focus is `BODY`. Opening the Day 3 and Day 5 compose leaves focus on `BODY`, not the message box. The Act II intro leaves focus on `BODY`. Fixed: level-up cards take focus on the continue button, the Night Before reply box takes focus, and the next Night Before email row takes focus after "Next message".
- **Fix:** After each card action, move focus to the new card's primary button, or to the compose box when compose opens.

### F-15. The first reply is graded looser than the card's instruction
- **Sitting:** The Night Before
- **Severity:** polish/Learning note (not failing on its own)
- **Kind:** Learning · too thin
- **Route:** Content
- **Evidence:** Observed. The card says "Say hello, write your short reply, and finish with your name." "ok thank you. i come tomorrow" is saved. Code-verified: `src/lib/tasks/mail/opening.ts:104-106` accepts any non-empty text for `welcome`. This is intentional for a first email. "yes" also passes for "Can you confirm…?", which is fine.
- **Fix:** Either soften the card line ("A hello and your name is nice") or nudge once when there is no greeting.

### F-16. At 911 the optional pointer practice is hidden inside the card
- **Sitting:** How this works
- **Severity:** friction
- **Kind:** UI/UX
- **Route:** Dev
- **Evidence:** Observed. At 911×512 the welcome card shows "Empezar a mirar" and part of "Léelo en voz alta". "Practicar clics y desplazamiento" sits below the card's inner scroll (`min-h-0 overflow-y-auto p-5`, 298/218), with no cue (`img/A-es-l0-intro-911.png`). The learners at 150% text are the ones most likely to need the practice.
- **Fix:** Let the card grow to fit its three buttons on the welcome beat, or put practice above Read aloud.

### F-17. The Day 2 attach step at 911: after a wrong preview, the right file is under the card and only collapsing reaches it
- **Sitting:** Day 2
- **Severity:** blocks (at 911×512)
- **Kind:** UI/UX
- **Route:** Dev
- **Evidence:** Observed (ES, 911). After Reply, the card (bottom-right) covers the question and the first two answer buttons (`img/A-es-l2-attach-q-911.png`). Show me moves the card and points at the email text, which is good teaching. In the file picker, the card starts top-right with the list visible (`A-es-l2-picker-911.png`). After one file is clicked it moves bottom-left over rows 2–5 of the list (`A-es-l2-picker-preview-911.png`). **Re-tested on a third account (`Audit5 A en 3`, EN, 911):** I previewed `safety-report-july-DRAFT.pdf` and pressed Attach. The correction reads "That page says DRAFT… Choose the July report without DRAFT." `safety-report-july.pdf` is under the card (elementFromPoint returns the card; `img/A-en3-picker-draft-911.png`). Show me highlights the preview, not the file, and the card stays put (`img/A-en3-picker-draft-911-showme.png`). Cancel and re-opening the picker leaves the card bottom-left over the same row (`img/A-en3-picker-reopen-911.png`). Only collapsing the card reveals the row (`img/A-en3-picker-collapsed-911.png`), and nothing on screen says to collapse it. On the same account, a Playwright click on the right answer to "What does Maria need?" timed out for 30 s because "data-job-card subtree intercepts pointer events" (`img/A-en3-attach-q-911-intercepted.png`). Scrolling the email pane moved the card, so that step is friction, not a block.
- **Steps:** 911×512 → Day 2 task 2 → answer, Attach file → click the DRAFT file → Attach → try to pick the other July file.
- **Fix:** Treat the picker's file list as a no-cover zone, and point Show me at the correct file row after a wrong preview.

### F-18. Day 4's answer has no source in the world
- **Sitting:** Day 4
- **Severity:** polish (the original "given away" is fixed)
- **Kind:** Learning · note
- **Route:** Content
- **Evidence:** Observed. The card now says "Tell Darnell where the extra aprons are." "storage room" appears only after a wrong try ("Darnell asked where the extra aprons are. Tell him: the storage room.") or in Help and the writing chips. This follows the original recommendation. Nothing in the story (a note, a photo, Maria) says where the aprons are, so every learner either fails once or opens Help.
- **Fix (optional):** Put the answer in the world, for example a line in Maria's Day 3 "Your hours note" reply.

### F-19. Small content and wording notes
- **Severity:** polish unless marked
- **Evidence:** Observed.
  - The tour Help kicker reads "2-minute lesson" / "Lección de 2 minutos" on a four-line help (`src/lib/tasks/tour/content.ts:82,100`). This is a wrong label, so it is **friction**, not polish.
  - The welcome card kicker "Your first day" (level 0) is followed by "Your first shift is tomorrow". A wrong label, so **friction** (low).
  - The Day 3 arrival still says "Today is payday for the crew", while the learner's pay is Aug 28 (original finding, unchanged, `tracks-content.ts:512`).
  - After the Night Before, the Night Before threads ("Tomorrow at 10 AM", Darnell's bag email) are gone from the inbox; only the welcome remains.
  - The desktop clock jumps to the next day's time (9:40 AM) behind the Night Before's "Ready for tomorrow" card.
  - After a reload on Day 2's text step, the desktop card repeats the day's premise ("Your schedule is posted…"), not "Reply to Maria's text". "Open Portal" then lands on the right step with the draft kept.
  - Spanish: "Comete errores, vuelve a intentarlo y aprende." on the welcome reads as a calque; "Puedes equivocarte" is more natural.
  - HR's phone is "(617) 555-0114" and Maria's is "(555) 0142" (inconsistent formats).
  - Clicking the Shift notes tab on Day 3 before clocking in drops the card's "?" and Show me, and does not say "go back to Time Clock".

### F-20. The Spanish choice is kept per device, not per learner
- **Sittings:** all (seen at Day 3)
- **Severity:** friction
- **Kind:** UI/UX
- **Route:** Dev
- **Evidence:** Observed. `Audit5 A es 2` played in Spanish. After I signed in again on a fresh browser, the whole desktop and Job Card were in English ("Day 3 of 6 · Task 2 of 2 / Maria has to leave early…"). Code-verified: `src/lib/progress-context.tsx:52,260-262` stores the language in device storage (`DEVICE_KEY.lang`) only. In a classroom where Chromebooks are shared or reassigned, a Spanish-first learner lands in English and has to find the small "ES" on the shelf.
- **Fix:** Save the language on the learner record and use it on sign-in.

### F-21. In Spanish, the pay stub never shows the words the card asks for
- **Sitting:** Day 6
- **Severity:** friction
- **Kind:** UI/UX · mixed language (Learning note)
- **Route:** Dev + Content
- **Evidence:** Observed. The Spanish card says "Encuentra el pago neto en este recibo." The stub reads "EARNINGS STATEMENT… Gross pay… Net pay $571.32". The PDF reader chrome shows "Downloads" and "Page 1 / 1" under the Spanish title "Lector de PDF" (text dump from `img/A-es-l3a3-stub-911.png`). Code-verified: `src/components/task/PdfSheet.tsx:136,216` hard-codes "EARNINGS STATEMENT" and "Net pay", while `src/lib/tasks/paystub/content.ts:155` already has `netPay: "Pago neto"` for Spanish, unused by the sheet. An English stub can be a deliberate real-world choice, but then the card or Help needs the gloss ("Net pay = pago neto"). Help ("Pago bruto vs. pago neto") never names the English words. The stub list row also shows "Aug 18 – Aug 28" in Spanish mode.
- **Fix:** Either render the stub labels in Spanish, or keep English and add "(Net pay)" and "(Gross pay)" to the Spanish card line and Help.

### F-22. Opening Mail on Day 6 shows Day 5's finished screen with "Empezar mañana"
- **Sitting:** Day 6
- **Severity:** friction
- **Kind:** UI/UX · stale state (same family as F-9)
- **Route:** Dev
- **Evidence:** Observed (ES). On Day 6, clicking the Correo bookmark shows the Job Card "Mensaje enviado / Terminaste este día. / [Empezar mañana]" (`img/A-es-l3a3-mail-911.png`). "Start tomorrow" on payday Friday makes no sense. Pressing it returns to the desktop with the right Day 6 job. The inbox itself is right (Act I mail only, no Jordan compose).
- **Fix:** Same as F-9: when the app has no active task, show its home and a card line that points back to today's job.

### F-23. Drafts are lost on reload on Day 5 too, though the day's premise now survives
- **Sitting:** Day 5
- **Severity:** friction (part of F-7)
- **Evidence:** Observed (ES, 911). After a reload with "hola maria estoy enferma. no puedo ir hoy" typed, the desktop card kept the premise ("Te sientes mal y entras a las 7. Escríbele a Maria ya."), which fixes the original "arrival lost" finding. The compose box came back empty.

### F-24. Smaller Spanish notes
- **Severity:** polish
- **Evidence:** Observed. Help closes with "Entendido. Volver a mi tarea" on Days 5–6 but "Entiendo. Volver a mi tarea" in the tour. "Sat" and "Fri" appear in the Spanish inbox next to "Lun" and "21 ago" (part of F-11). "Ahora eres Shift Lead (líder de turno)" glosses the English title well. At 911 the Act II intro's "Comenzar el Acto II" is below the fold (y=595) and focus stays on the page body.

### F-25. The Day 2 runaway gutter is intermittent
- **Severity:** note on F-2
- **Evidence:** Observed. On the ES account's re-sign-in, the Day 3 note's scroll area measured 843 px (normal) right after opening. In the first session it was 131,874 px, and on the EN account's Day 2 it passed a million px. It appears once the card has settled in a bottom corner over the scroll area (after a Show me or a corner change), so a fresh load does not always show it. The EN3 account's Day 2 schedule had not grown in its first 3 s (value not recorded before the step moved on).

### What was not checked
- Keyboard-only completion of Days 4–6. Focus problems on Days 3 and 5 compose are noted in F-14.
- Reload mid-task on Day 3 task 1 (the Time Clock).
- The Studio gate (this segment never opens Studio, by design).
- 200% zoom. Real touch input.
- Read aloud audio (buttons present, not listened to).
- The welcome page at 150%: "Start my first day" is below the fold at 911 (y=578; `A-welcome-911.png`). The cut-off "Your first job" box is the only cue. Logged here as friction (low), outside the seven graded sittings.

## 4. Regressions

- **Runaway Job Card gutter at 911×512 (F-2).** The scroll gutter came in with PR #45. At 150% it now breaks Show me on the Day 3 shift note (the pointer aims below the screen) and makes the Portal page millions of pixels tall. The original audit had no working Show me problem at 150% on Day 3. It had a covered button.
- **Card corner flips while scrolling** (Day 2 swap form and Day 3 note at 911). The card moves between bottom-left and bottom-right as the page scrolls, sometimes onto the control the learner was about to click. This is new with the auto-placement.
- **Spanish reset to English on another device (F-20).** Not strictly new, but newly visible because resume now works well otherwise.
- **Stop card loop on return (F-6).** Renaming "Clock out" to "Stop for today" was right, but a returning learner now meets the stop card again with Stop as the primary button.

## 5. Checks of Wave 4 additions and earlier fixes

| Check | Result |
|---|---|
| **Day 2: Maria's text after the swap** | Works in English. Filing Thu 2–10 brings "Hi, it's Maria. I got your swap request. I moved you to Thursday, 2 PM to 10 PM…". "ok" gets "Say the day or the time too…". "yes thursday 2 ok" finishes. **Broken in Spanish** for "Sí…" (F-1). The detail check passes a wrong day with "10". |
| Day 2 text: reload | Works. After a reload the desktop card says "Next: Open Portal". Portal reopens on Shift Swap with the thread and the draft "yes thursday" kept (`A-l2-text-reload-portal-911.png`). |
| Day 2 text: 911 readability | Readable. The bubble text is legible and the reply box and Send are visible (`A-l2-text-911.png`). The phone's top (name, time) scrolls off, and the card sits beside the phone. |
| Job Card moving off controls | **Partial.** It moves for Show me targets and several controls (Clock In, Looks right, Maria's row). It does not move for content the learner must read (Day 2 schedule labels, Day 3 facts box, Day 6 stub labels at 911), and it can move *onto* Submit (F-3, F-5, F-17). Broken at 911 on Portal pages (F-2). |
| Route-aware mail | **Works for Days 2–6.** "Maria left a note" toasts matched real emails ("Your hours note", "Got it. Thank you", "Feel better. I've got the shift covered."). No Act II mail, no Jordan compose on Day 6, and no College letter in Downloads. The Day 6 Mail card is stale (F-22). |
| Studio gate | Not exercised. This segment never opened `/studio`. The login page no longer shows the staff "Work in progress" note (`A-login-1366.png`). |
| Writing checks accept beginner English | **Mostly.** Spanish Day 4 "ok gracias" is now corrected specifically, and "hola darnell, estan en el almacen" passes. Spanish Day 5 "hola maria estoy enferma" gets "Por ejemplo: Hoy no puedo ir.", and "…no puedo ir hoy" passes. "I am sick. I no come today." passes. "hi maria i come 7. clock say 8:15. sorry" passes. "hi maria. clock is wrong" and "i am sick. i cant come" get precise corrections. "it was busy at 11", "here is report" and "hi darnell. apron is in storage room" pass. Spanish: "si voy", "la dejo debajo del mostrador" and "hola maria llegue a las 7 pero el reloj dice 8:15" pass. **Not** in the new Wave 4 text check (F-1). |
| Story dates move forward | **Yes** for the scene: Mon Aug 17 → Wed 19 → Fri 21 → Sat 22 → Mon 24 → Fri 28. The shift note is dated Fri Aug 21, the sick day says "at 7", and no HR email arrives before its time. Filler inbox labels are static (F-12). |
| "Stop for today" wording (Day 3 and Day 6 bodies) | **Fixed.** Day 3 → 4: "…Stop for today. Your progress is saved. Next time you sign in, reply to Darnell." Day 6: "…Stop for today. Your progress is saved. Next time you sign in, you're a Shift Lead." The button reads "Stop for today (your work is saved)" and in Spanish "Terminar por hoy (tu trabajo está guardado)". |
| Practice / Skip on the on-ramp | **Fixed at 1366.** "Practice clicking and scrolling" is a full outlined button. Inside, "Open practice notice" is primary and "Skip practice" is a text link. One word ("notice") is used throughout. "Scroll down to find Ready." with a fade cue. The first tour button is "Next", and the tour ends "You found your way around." **At 911 the practice button is hidden** (F-16). |
| Keyboard focus into arrival cards | **Fixed.** Every level-up/arrival card took focus on its continue button, including after sign-in. Enter on it proceeds. The Act II intro does not (focus on `BODY`). |

## 6. Predicted items (not counted)

- A learner at 150% on Day 2 who does not scroll will press Show me on each step and never compare the schedule with the phone, which is the skill Day 2 teaches.
- Spanish learners will type "Sí" (with the accent, as the correction itself spells it) and be told to start with "Sí". That is likely to shake trust in the checker early in Act I.
- A returning learner who presses the big blue "Stop for today" on the returned card will think the app is broken ("it keeps logging me out").
- The runaway gutter may also cost battery and CPU on real Chromebooks, because layout runs continuously while the page is open at 150%.
