# Wave 5 re-audit: Segment F (Act VI Office hiring + HQ, Act VII Team Lead, Office ending)

_Status: COMPLETE. Sections 1–6 are the graded report; section 7 is the chronological running log with every observation behind them._

## 1. Header
- **Segment:** F. Studio used once ("Start of Day 25: Applying"), then played forward without further jumps through Days 25–37, the Act VI → VII boundary, the Office ending, `/summary`, and the route chooser (I chose "Stay and lead" once, to test the dates).
- **Build:** http://localhost:3300 (469078f). Code read at 469078f with `git show 469078f:<path>` (files unchanged on main were read directly).
- **Account:** one learner, `Audit5 F en 1` (E2E-AUDIT5 / 1234), played the whole segment. 911×512 checks were done by resizing the same page, so continuity was never broken. No second account.
- **Interruptions:** two permission-check outages stopped the tool runs (not the app). The driver was restarted once and the learner signed back in from `/login` (progress came back from the database). One accidental browser Back (mine) signed the page out on Day 32; I signed back in from the user tile. Neither is counted as a product finding, except that signing out lost the half-filled I-9 (noted, not graded).
- **Driver:** `wave5/F/driver.mjs` (Playwright, headless, port 9566) + `wave5/F/r.mjs`. Screenshots: `wave5/img/F-*.png` (155 files).

### Conditions checked per sitting
| Sitting | EN 1366 | 911×512 | Wrong try | Help | Reload | Keyboard | Spanish |
|---|---|---|---|---|---|---|---|
| Day 25 Applying | yes | act intro only | yes | yes | yes | yes | no |
| Day 26 Résumé | yes | yes | yes | yes (ES) | yes | yes | yes |
| Day 27 Interview | yes | mail only | yes | yes | yes | no | no |
| Day 28 Offer | yes | yes | yes | yes | yes | no | no |
| Day 29 Paperwork | yes | yes | yes | yes | yes | no | DD form only |
| Day 30 HQ | yes | yes | yes | yes | no | yes (share) | no |
| Day 31 Room | yes | yes | yes | yes | yes | yes (grid) | grid only |
| Day 32 Expense | yes | yes | yes | yes | yes | no | yes |
| Day 33 Slides | yes | yes | yes | yes | yes | yes | yes |
| Act VII boundary | yes | yes | n/a | n/a | n/a | focus only | no |
| Day 34 Meeting | yes | email only | yes | no | yes | no | no |
| Day 35 Review | yes | no | yes | no | no | no | no |
| Day 36 Packet | yes | yes | yes | yes | yes | no | mail view |
| Day 37 + ending | yes | /summary | yes | no | yes | Escape on awards | /summary |

Not checked in this segment: the personalized award letter (College route, Act IV/V; not on the Office route), the budget "Actual minus Budget" line (Act III/IV budget sheet; not on this route), and Spanish on Days 25, 27, 28, 30, 34, 35.

## 2. Per-sitting table

| Sitting | Original verdict | UI/UX now | Learning now | Clean Pass? | Key evidence |
|---|---|---|---|---|---|
| Day 25: Applying | Friction | friction (Studio → act intro 911 below fold; false green "Done" from Mail/Portal; the application calls the learner "Sam"; reload drops the posting) | fair (degree note tells the answer after a wrong tick) | No | F-d25-wrong-portal-1366, F-d25-app-1366-full, F-d25-posting-after-reload |
| Day 26: Your Résumé | Friction → Blocks | friction (Spanish title/month inconsistencies; card over Preview only) | fair | No | F-d26-save-911, F-d26-save-1366-end, F-d26-resume-es-911 |
| Day 27: The Interview | Friction | friction (card never points at the button inside the email; 911 card over inbox senders) | fair (prep only; no interview is played) | No | F-d27-mail-body-911, F-d27-done |
| Day 28: The Offer | Friction | friction ("Your offer letter is below" but it is behind a button; reload loses the reply) | fair | No | F-d28-offer-1366, F-d28-send-911 |
| Day 29: New-Hire Paperwork | Friction | **blocks beginners** at 911 (Submit I-9 label never visible); friction at 1366 | **unsupported** (I-9 and direct-deposit mistakes get only "Compare the form with Robin's facts") | No | F-d29-i9-911-submit-covered, F-d29-i9-submit-1366, F-d29-w4-911-st600 |
| Day 30: Welcome to HQ | Friction | friction (false "Start tomorrow" from Mail; runaway scroll gutter at 911; done screen shows café file and Jordan) | fair | No | F-d30-wrong-mail, F-d30-done-911, F-d30-share-911-wheel |
| Day 31: Get Everyone in the Room | Friction → Blocks | friction (card over Zoom controls at both sizes; "a few minutes late" at 10:01 AM for a 2 PM meeting) | fair | No | F-d31-cal-911-invite, F-d31-chat-911, F-d31-zoom-1366 |
| Day 32: The Expense Report | Friction (confirm at 150%) | friction (at 911 the Flag column is under the card, but the needed button is reachable by scrolling; card never says receipts are in Drive) | fair (redesigned; real matching and a real typo) | No | F-d32-sheet-911, F-d32-wheel-911-3, F-d32-exp-1366 |
| Day 33: Presenting to the Team | Friction → Blocks | friction ("Answer Chris" still half under the card at 1366; at 911 question and dropdown under the card until scrolled) | fair, thin (3-option dropdown) | No | F-d33-present-1366, F-d33-911-wheel2 |
| Day 34: Run the Meeting | Friction | friction (false Done from Calendar/Mail; agenda topics only in "Need help writing?"; stale correction over Send at 911) | fair | No | F-d34-wrong-cal, F-d34-email-911-send |
| Day 35: The Review | Friction | clean in what I checked (only 1366 + wrong try) | fair, thin (growth line needs only a lateness word) | Not graded fully (conditions skipped) | F-d35-review-1366 |
| Day 36: Put It All Together | Blocks beginners | **blocks beginners** (weekly-total box, "Done here" and Back fully under the card at 1366 and 911; card never moves); reload loses finished parts | fair | No | F-d36-sheets-1366-wait, F-d36-sheets-911, F-d36-hub-after-reload |
| Day 37: Where You've Been + ending | Friction | friction (card loses "See my summary" when Mail is opened, and a no-button card after Maria's email; route change sends the story back to Sep 2026 and Shift Supervisor) | fair | No | F-d37-mail-after-ending, F-d37-maria-open, F-d37-route-lead-chosen, F-d37-summary-page-full |

**Tally:** 13 sittings. 0 Clean Pass. 0 broken. 2 blocks beginners (Day 29 at 911, Day 36). 10 friction. 1 not fully graded (Day 35 had only the 1366 pass and one wrong try; nothing wrong seen). Learning: 1 unsupported (Day 29), the rest fair (two thin: Days 33, 35).

Improvements confirmed since the original: Day 26 (Save no longer covered, drafts kept, no "Simulator"), Day 31 slots, Day 32 redesign (and not blocking at 911), Day 33 reload and "$188", Day 34 checks and reload, Day 36 corrections, Day 37 short answers and a named, dated `/summary`, "Start Act VII" now shows the Job Card.

## 3. Findings

### F1. The Job Card only moves off buttons that carry a Show me id, so it still sits on finishing buttons
- **Sittings:** Day 36 (weekly total box, "Done here", "← Back to the report"), Day 29 (Submit I-9), Day 31 (Zoom "Unmute", "Start video", chat box), Day 33 ("Answer Chris" at 1366), Day 34 (Send at 911, with a correction showing).
- **Severity:** blocks (Day 36 at both sizes; Day 29 at 911); friction elsewhere.
- **Kind:** UI/UX, card covers controls.
- **Route:** Dev.
- **Evidence (Observed):** Day 36 at 1366, card x24–444 y466–696 covers the "Weekly total ($)" input and "Done here" (x24, y≈520–600); it did not move after 2.5 s or a wheel, and the window does not scroll (`F-d36-sheets-1366.png`, `F-d36-sheets-1366-wait.png`); same at 911 (`F-d36-sheets-911.png`). I had to press "Hide the rest of this card" to finish (`F-d36-sheets-collapsed.png`). Day 29 at 911: scanning the I-9 pane every 20 px, at every position where "Submit I-9" is inside the pane the card covers its left-aligned label; only an unlabelled purple bar shows (`F-d29-i9-911-submit-covered.png`); at 1366 it reads "…it I-9" (`F-d29-i9-submit-1366.png`). Day 33 at 1366: only "er Chris" of "Answer Chris" shows (`F-d33-present-1366.png`). Day 31 at 911: only the word "video" of "Start video" shows (`F-d31-chat-911.png`).
- **Code-verified:** `src/lib/job-card-placement.ts:108` returns the home corner when it covers no `[data-showme]` target and no `[data-card-avoid]` control, without ever counting the `lesser` controls (`src/components/task/JobCard.tsx:87-94`, `:376-383`). In the DOM on Day 36 the only show-me targets were `my-job` and `shelf-status` on the shelf.
- **Steps:** play to Day 36, Open Report, Open Sheets at 1366 or 911.
- **Fix:** count `lesser` controls in the home-corner check too (move when the home corner hides any control in the app window), or add `data-showme` to every task's primary button.

### F2. Opening an earlier app flips the Job Card to a false green "Done" (and after the ending, drops "See my summary")
- **Sittings:** Day 25 (Mail, Portal, Calendar), Day 30 (Mail: "Start tomorrow"), Day 34 (Calendar, Mail), ending (Mail, Calendar), and again on the new route after the chooser.
- **Severity:** friction.
- **Kind:** UI/UX, wrong instruction on the Job Card.
- **Route:** Dev.
- **Evidence (Observed):** Day 25 before any work: Mail → "Message sent | Done. 2 tasks left. | Next task | Do it again"; Portal → "You noticed the conflict and asked for a swap. | Done. 2 tasks left." (`F-d25-wrong-mail-1366.png`, `F-d25-wrong-portal-1366.png`). Day 30: Mail → "Message sent | Direct deposit set up. You're ready for day one. | Start tomorrow" (`F-d30-wrong-mail.png`). Day 34: Calendar shows "calendar.harborsidecafe.com … MESSAGE SENT" and the card "Done. One more task for today." (`F-d34-wrong-cal.png`). After the ending: Mail → "Message sent | You finished the "Office" route… | Back to my desk | Do it again" with no "See my summary" / "Change direction" (`F-d37-mail-after-ending.png`); opening Maria's closing email → "Day finished | You finished everything." with no button at all (`F-d37-maria-open.png`). "Next task" / "Back to my desk" only restore the real card; nothing is skipped.
- **Code:** matches Segment B's reading, `src/app/mail/MailClient.tsx:1262` renders `TaskDoneActions` for the last finished mail job even when it does not own the card.
- **Steps:** on any day, open Mail or Calendar before doing the day's task.
- **Fix:** render the finish report only when the app owns the current job; otherwise leave the card alone.

### F3. The I-9 and direct deposit still give only "Compare the form with Robin's facts"
- **Sittings:** Day 29.
- **Severity:** friction (UI/UX); learning **unsupported**.
- **Kind:** Learning, unsupported correction.
- **Route:** Dev + Content.
- **Evidence (Observed):** I-9 DOB "12/04/1990" (day-first) → "Compare the form with Robin's facts."; status "A lawful permanent resident" → the same line; direct deposit with routing and account swapped → the same; "Savings" for "checking" → the same. The W-4 now names each box ("Check the Date box… 10/01/2026 (month/day/year: October 1)"), so the fix reached the W-4 only. The original finding was the I-9 birth date.
- **Code-verified:** `src/lib/tasks/onboarding-paperwork/content.ts:353-366` `W4_FIELD_HINT` covers status, dependents, date; `:447-450` `REFERENCE_HINT` is the only I-9/DD correction; `firstMismatch()` (`:347`) already knows which field is wrong but no per-field I-9/DD copy exists.
- **Steps:** Day 29, I-9, type 12/04/1990 and submit.
- **Fix:** add named hints for dob ("month/day/year: April 12"), address, work status, routing/account ("routing is 9 digits, account is 10"), account type.

### F4. Runaway Job Card scroll gutter in Drive at 911
- **Sittings:** Day 30, Day 32 (Drive).
- **Severity:** friction.
- **Kind:** UI/UX, layout.
- **Route:** Dev.
- **Evidence (Observed):** Drive list pane padding-bottom 62,353 px → 70,656 px in 3 s with no input → 74,842 px after one wheel; Day 32 already 2,674 px. The scrollbar thumb vanishes and a wheel flings the list far past its content.
- **Code-verified:** `src/components/task/JobCard.tsx:117-136` sets `--job-card-gutter` from `r.bottom - card.top` of a `flex-1` pane that grows with its own padding; the MutationObserver on `style` (`:391-396`) re-runs it every frame.
- **Steps:** 911×512, Day 30, open Drive with the card at a bottom corner.
- **Fix:** measure the pane without its gutter (or from its parent's box), and do not observe the gutter's own style write.

### F5. Story learner is called "Sam" on the application
- **Sittings:** Day 25.
- **Severity:** friction (a wrong name is never polish).
- **Kind:** UI/UX, wrong name in a correction.
- **Route:** Content.
- **Evidence (Observed):** the why box arrives pre-filled with the posting line "i fix the schedule at cafe"; submitting gives "Say why Sam wants this job, or what Sam is good at. For example: "I want this job because ___."" (`F-d25-app-1366-full.png`). Code-verified: `src/lib/tasks/job-application/content.ts:87` (en) and `:124` (es) hard-code "Sam"; `whyProblem()` (`:204`) returns "noReason" because `REASON_WORDS` (`:192`) has neither "fix" nor "schedule". So the line the posting just accepted is rejected one screen later.
- **Steps:** Day 25, write "i fix the schedule at cafe" on the posting, apply, submit the application.
- **Fix:** use the lesson copy only in lessons ("Say why you want this job…" in Story); add work verbs (fix, make, train, schedule) to `REASON_WORDS`.

### F6. Route change after the Office ending sends the story back six months and demotes the learner
- **Sittings:** ending / route chooser.
- **Severity:** friction.
- **Kind:** UI/UX, story dates and role.
- **Route:** Dev + Content.
- **Evidence (Observed):** "Change direction" → "Stay and lead" → Act III intro "You're a Shift Supervisor now"; desk "SHIFT SUPERVISOR · Harborside Cafe · Day 14: Scheduling the Team"; inbox back to September 2026 with every HQ and Anita email gone (`F-d37-route-lead-chosen.png`, `F-d37-route-lead-mail.png`). Code-verified: `src/lib/story-dates.ts:62-91` (level9 Sep 28, 2026; level27 Apr 16, 2027); `storyToday()` (`src/lib/story-calendar.ts:51`) uses the level's own fixed day with no route-order offset; the comment at `:74-77` ("no route ever goes backwards") holds only within one route.
- **Steps:** finish Day 37, open the card's "Change direction", choose "Stay and lead".
- **Fix:** after an ending, frame the other routes as flashbacks/"another path" (or offset their dates after the finished route), and keep the earned title on the desk.

### F7. Reload loses in-task work on several days
- **Sittings:** Day 25 (posting checks and fit line), Day 28 (reply and chosen date), Day 29 (every W-4 field), Day 36 (finished Sheets and Calendar parts of the packet).
- **Severity:** friction.
- **Kind:** UI/UX, state.
- **Route:** Dev.
- **Evidence (Observed):** Day 36 hub went from "2 left" back to "4" and the weekly total box was empty after a reload (`F-d36-hub-after-reload.png`); Day 25 all boxes unticked (`F-d25-posting-after-reload.png`). Days 26, 27, 32, 33, 34 now keep their drafts (fixed).
- **Fix:** persist these drafts the way the résumé, interview, slides and meeting notes now do.

### F8. Act-intro "Start" is below the fold at 911
- **Sittings:** Act VI intro (y=670), Act VII intro (y=685), both on a 512-high viewport; focus on BODY.
- **Severity:** friction (the cut-off box edge is the only cue).
- **Kind:** UI/UX, layout. **Route:** Dev.
- **Evidence (Observed):** `F-d25-actintro-911.png`, `F-d34-actintro-911.png`.
- **Fix:** pin the Start button in a sticky footer, or focus it on load.

### F9. Day 36 closing arrival puts "Stop for today" as the big blue button
- **Sittings:** Day 36 → 37.
- **Severity:** friction (low).
- **Kind:** UI/UX, button order. **Route:** Dev/Content.
- **Evidence (Observed):** "THE WHOLE WAY HERE / Look at everything you can do now." Primary: "Stop for today (your work is saved)"; secondary text link: "Open Recap from the bookmarks" (`F-d36-done-911.png`). Every other arrival leads with the keep-going button; a learner who presses the big button signs out before the last day.
- **Fix:** make "Open Recap" primary, as on every other day.

### F10. Wrong times and wrong files on HQ days
- **Day 31:** the invite was for 2:00 PM, yet Zoom says "You are a few minutes late. Join with your mic off." while the clock reads 10:01 AM (`F-d31-zoom-1366.png`). Code-verified: `storyClockFor()` (`src/lib/story-calendar.ts:98-103`) uses the level's start clock unless the task's `shiftMoment` names a time. Severity friction. Fix: give the video-call task a "2:00 PM" shift moment.
- **Day 30:** after sharing the Q3 notes, the Drive done screen is the café's: "drive.harborsidecafe.com … schedule-week-of-sep-14.pdf · Shared with Jordan Kim · Viewer" (`F-d30-done-911.png`). Severity friction (wrong file and person). Fix: show the HQ share result.
- Severity for both: friction. Route: Dev.

### F11. The card does not say where things are, only Help does
- **Day 32:** "Match the receipts. Flag what is missing." never says the receipts are in Drive; only Help ("Open Drive to see the receipts") and the second wrong total do. Friction.
- **Day 27:** after the email is open, the card still says "Read Anita's email…" and never points to "Open interview preparation" inside it. Friction (low).
- **Day 28:** Anita's email says "Your offer letter is below." It is behind "View offer and reply". Friction (low).
- **Day 34:** the agenda topics are only in "Need help writing?"; the card stays "Agenda, notes, follow-up." for the whole hub. Friction (low).
- Route: Content. Fix: one line on the card per step ("Receipts are in Drive → Receipts").

### F12. Direct-deposit leftovers from the original audit
- **Day 29.** Card headline "Routing number is 9 digits." is a fact, not a task; placeholders "Bay State Bank", "011000015", "000123456789" look like real values. Friction (low). Route: Content. Fix: "Enter Robin's bank details. Then submit." and placeholders like "9 digits".

### F13. At 911 the card hides reading material while the learner needs it
- **Day 29 W-4:** at the Signature/Date scroll position the card hides "Robin's facts / Robin Avery · Not married…" and the Signature label (`F-d29-w4-911-st600.png`). **Day 33:** on entering Present, "Chris: Why is the dinner expense…" and the dropdown label are under the card (`F-d33-present-911.png`); reachable by scrolling. **Day 31 at 1366:** chat placeholder "Type your question in the chat…" hidden. Friction. Route: Dev (same root as F1).

### F14. Spanish inconsistencies in the hiring arc
- **Day 26:** "Shift Lead" stays English with no gloss on the résumé, but "Team Member / New Hire" becomes "Miembro del equipo / Personal nuevo" (`F-d26-resume-es-911.png`; `job-application/content.ts:171,415`). Month names capitalised mid-phrase: "Septiembre de 2026 – Presente". **Day 29:** title case "Autorización de Depósito Directo". **Day 32:** "Marcar falta" (calque; "Falta el recibo"). **All days:** bookmarks bar mixes "Correo, Empleos, Currículum" with "Calendar, Drive, Docs, Forms, Portal". The act intros and hiring mail do gloss correctly ("Office Administrator (administración de oficina)", "Team Lead (líder de equipo)", `act-intro-content.ts:149,169`). Friction (low) for the mixed titles; polish for capitalisation. Route: Content.

### F15. Smaller items
- Day 25: ticking the degree box gives "Your cafe work does not include a college degree… Leave that box empty." (tells the answer; Help already teaches "preferred"). Learning note, not graded.
- Day 31: Enter in the Zoom chat box does not send; only the Send button does. Sending a real question before "Start video" gives no correction. The Zoom join page adds its own instruction lines ("Join with your mic off", "Leave it off until it is your turn to talk"). Friction (low).
- Day 31: Jordan Kim (a café coworker) is one of four HQ calendars, unexplained. Polish.
- "Anita left a note" toast pops up mid-task (Days 31, 33, 34), opens Mail (where F2 waits). Polish.
- Day 33: Chris's question is still a 3-option dropdown with two implausible options. Learning thin.
- Day 35: "sam is late" passes as "an area to grow" although the correction asks for what better looks like; Anita later says "Specific, and not harsh." Learning thin.
- Day 36: address bar stays "sheets.harborsidehq.com/weekly" in the packet's Calendar, Docs and Mail. Polish.
- Day 37: Awards panel does not close with Escape. The skill line "I can write a SUM and cc a co-lead." is jargon for a beginner. `/summary` omits the learner's own look-back answers (they are only on the in-app Recap). Maria's closing email says "This summary is yours" with nothing attached. Friction (low) / polish.
- Act VI still ends straight into the Act VII intro with no Act VI moment (original Segment E note). Polish.

## 4. Regressions
- None found where a checked thing is worse than in the original audit.
- **New since the original report (probably side effects):** F2's false "Done" card (Segment C links it to the route-aware Mail fix), F4's runaway gutter (a new JobCard feature from PR #45), and the Day 30 done screen now naming the café file and Jordan (the original only noted the café address).
- **Not fixed although fixes targeted them:** Day 36 "Done here" under the card (original #2), the I-9 "unsupported" correction (Day 29), "Answer Chris" at 1366 (half-covered rather than fully).

## 5. Re-checks of the listed fixes and Wave 4 additions in this segment
| Fix / addition | Works? | Evidence |
|---|---|---|
| Hiring arrives as actionable Mail (prep, offer, paperwork) | Yes. Each day opens Mail with Anita's email and an in-mail button; the card names the email. | F-d27-mail-1366, F-d28-offer-1366, Day 29 notes |
| Reading alone does not award completion | Yes. Reading each email kept the card on "Read Anita's email…" / task line; completion came only from saving prep, sending the reply, submitting forms. | Days 27–29 notes |
| Act VII dates Apr 12–16, 2027, six months after HQ, dates forward | Yes within the route (code `story-dates.ts:88-91`; Anita's "six months" email; Day 36 calendar Apr 19–25). **No** across a route change after the ending (F6). | F-d34-wrong-mail, F-d37-route-lead-mail |
| Earned story roles on the résumé; no "Simulator" | Yes ("Shift Lead · Sep 2026 – Present", "Team Member / New Hire · Aug–Sep 2026"). | F-d25-app-1366-full, F-d26-resume-911 |
| Personalized award letter | Not checked (College route; not on the Office path). | — |
| Drafts kept under reload (résumé, interview notes, slides, meeting notes) | Yes, all four. Not kept: posting, offer reply, W-4, Day 36 packet (F7). | Days 26, 27, 33, 34 notes |
| Camera instruction | Yes: card "Join muted. Start video. Ask in chat." (but the button is partly under the card, F1). | F-d31-zoom-1366 |
| Weekly amount entry (Day 36) | Yes: wrong total → "Read the total cell and enter the weekly amount."; "4,820" and "4820" accepted. | Day 36 notes |
| Job titles stay English in Spanish, with a gloss | Partly: intros and hiring mail gloss; résumé/application show "Shift Lead" bare and translate "Team Member" (F14). | F-d26-resume-es-911 |
| Budget "Actual minus Budget" line | Not checked (Act III/IV; not on this route). | — |
| "Start Act VII" shows the Job Card | Yes. | F-d34-after-start |
| Wave 4 communication additions (texts, template comment, voicemail) | None fall in Days 25–37. The Zoom chat check (pre-existing) now rejects "hi". | Day 31 notes |

## 6. Predicted items (not counted)
- A beginner on Day 36 who cannot find "Done here" will probably press "Open Mail" and send, then be told "Finish the other three parts, then send." and loop.
- A learner who presses the big blue "Stop for today" on the Day 36 arrival (F9) may think the program is over and never open the Recap.
- The false "Start tomorrow" on Day 30 (F2) could make a learner believe HQ day one is done before sharing the file.
- "27 of 42 unlocked" with greyed Acts III–V on a finished Office learner's award panel may read as failure.
- Learners who fill Robin's I-9 with day-first dates (common for many ESOL learners) will get stuck on the generic correction (F3) and guess.

## 7. Running log (chronological, all observations)

### Act VI intro (Studio arrival)
- Observed. At 911×512 "Start Act VI" is at y=670 on a 512-high viewport (page scrollHeight 830). Only cue: the top edge of a cut-off card. `img/F-d25-actintro-911.png`. Same act-intro shell finding as D's F15 / A / B.

### Day 25 notes so far
- Observed. Wrong try before starting: Mail bookmark → card turns green "Message sent | Done. 2 tasks left. | Next task | Do it again"; Portal → "You noticed the conflict and asked for a swap. | Done. 2 tasks left." `img/F-d25-wrong-mail-1366.png`, `img/F-d25-wrong-portal-1366.png`. "Next task" just restores the Day 25 card. Same as B-4 / D-F1 / C5.
- Observed. Posting copy is now route-neutral: "someone organized who has helped lead a shift or a team" (original: "led a team"). Fixed.
- Observed. Help = "You don't need every box" (right lesson).
- Observed. Reload mid-posting drops the checked boxes and the fit line (`img/F-d25-posting-after-reload.png`), card resets to "Open Jobs from the bookmarks". Small loss (4 clicks + 1 line). Friction.
- Observed. Checking the degree box gives "Your cafe work does not include a college degree. This job does not need one. Leave that box empty." (tells the answer; Help already teaches "preferred").
- Observed. Keyboard: Space toggles each requirement; Tab reaches the fit textarea.
- Code-verified. `src/lib/tasks/job-application/content.ts:171,415` Spanish translates "Team Member" to "Miembro del equipo" while other titles stay English ("Shift Lead", "Shift Supervisor", "Assistant Manager"). Résumé Help (`resume-build/content.ts:272`) says "\"Miembro del equipo\" y \"Shift Lead\"". Check against the "titles stay English with a gloss" rule on screen.
- Observed. Posting done by keyboard (Space on the requirements, Tab to fit box, Tab Tab Enter on Apply). Card: "Ready to apply | You fit. Next: the application." `img/F-d25-posting-done.png`.
- Observed. Application work history = earned story roles: "Shift Lead · Harborside Cafe · September 2026 – Present", "Team Member / New Hire · Harborside Cafe · August 2026 – September 2026". No "Simulator". Fixed. `img/F-d25-app-1366-full.png`.
- Observed. The "why" box is pre-filled with the posting fit line "i fix the schedule at cafe". Submitting it (with Part time) gives **"Say why Sam wants this job, or what Sam is good at. For example: "I want this job because ___.""** In Story there is no Sam: the learner is playing themself. Code-verified `src/lib/tasks/job-application/content.ts:87` (en) and `:124` (es) `needWhyReason` hard-codes "Sam"; reached from `whyProblem()` `:204` when `REASON_WORDS` (`:192`) finds no reason word ("fix", "schedule" are not in it). So the line the posting just accepted as "why you fit" is rejected one screen later, and the correction names a stranger. WRONG NAME → friction (never polish).
- Observed. Availability "Part time" accepted in Story (by design, `availabilityFits` `:233`).
- Observed. Help = "Filling out an application" (right lesson), includes the practice note (step 4).
- Observed. Reload on the application keeps the pre-filled why line (it comes from the posting) but the card goes back to "Open Jobs from the bookmarks".
- Observed. Submit with "i want this job. i good with schedule" + Full time → arrival "SHOW YOUR EXPERIENCE / The application wants a résumé." `img/F-d25-app-done.png`.
- Not checked on Day 25: the posting/application at 911 (checked the Day 26 arrival at 911 instead), Spanish on Day 25 screens.

### Day 26 (Your Résumé)
- Observed. Arrival at 911: "Open Résumé…" CTA at y=344, visible. Day starts with a New Tab and the Résumé bookmark highlighted; card: "Write a summary, one thing you did well at each job, and your skills." (no "Open Résumé" button on the card, the bookmark glow is the cue). `img/F-d26-start-911.png`.
- Observed. At 911 the card sits top-right, over the Preview column only; Save résumé is reached by normal page scroll and is never covered (`img/F-d26-save-911.png`). At 1366 the card moves between bottom-left and right as the pane scrolls, and at the bottom of the pane Save is clear (`img/F-d26-save-1366-end.png`). Original "card sits on Save" = FIXED.
- Observed. Summary pre-filled with the application's why line; the roles are the earned ones; no "Simulator" anywhere on the page or preview. FIXED.
- Observed. Wrong try: Save with empty bullets → "Write one thing you did well as Shift Lead, like "Trained new workers."" Clear.
- Observed. Reload with bullets typed: bullets come back ("fix the schedule", "i make coffee"). FIXED (original: vanished). Card after reload: "Open Résumé from the bookmarks".
- Observed. Help (ES) = "Un primer currículum es corto" (right lesson) with practice note.
- Observed. Spanish (`img/F-d26-resume-es-911.png`): "Shift Lead" stays English with no gloss on the résumé; "Team Member / New Hire" becomes "Miembro del equipo / Personal nuevo" (translated), so titles are inconsistent. Months capitalised mid-phrase: "Septiembre de 2026 – Presente", "Agosto de 2026" (Spanish months are lowercase). Bookmarks bar mixes "Correo", "Empleos", "Currículum" with "Calendar", "Forms", "Docs", "Drive".
- Observed. Keyboard: Space toggles skills, Tab reaches Save, Enter saves. Arrival: "BEFORE THE INTERVIEW / Anita wants to talk. / Anita sent an interview invitation. Read her email… / Open Mail". `img/F-d26-done.png`.

### Day 27 (The Interview)
- Observed. Arrival → Mail. Card: "Read Anita's email: Your interview: preparation notes." Inbox has Anita's email on top (8:30 AM). Hiring as Mail = FIXED. The email is in the café inbox (mail.harborsidecafe.com). `img/F-d27-mail-1366.png`.
- Observed. After opening the email, the card still says "Read Anita's email…"; it never points to the "Open interview preparation" button inside the email (the button sits between "Thanks," and Anita's signature). At 911 the button is at y=728 in the reading pane: scroll needed, but the email text runs into it. `img/F-d27-mail-body-911.png`. At 911 the card covers the left of the inbox list, including the sender of Anita's row (the subject stays visible to its right).
- Observed. Wrong try: pressing the Interview bookmark before reading the email opens the prep page and the card switches to "Answer each question. Then ask one." (no harm).
- Observed. "money money money money money money" ×4 → "Question 1 needs a real answer. Write a few sentences in your own words." FIXED (original: passed and called honest).
- Observed. Beginner answers ("i am shift lead at cafe. i make the schedule", "schedule have two people. i see it and fix it", "my english email. i read before send") pass. Fair.
- Observed. Reload with two answers typed: both come back. FIXED. Card after reload: "Open Mail" (fine; Mail has the button).
- Observed. Help = "Answering interview questions" (right lesson); no simulator coaching in the starters any more.
- Observed. Save → "PREPARATION SAVED" then arrival "THEY SAID YES / The offer is in. / In the story, your interview took place between these days." The interview itself is never played; Anita never reacts to the answers. (Learning: the day called "The Interview" is prep only; fair as prep.)
- Not checked on Day 27: keyboard, Spanish, 911 on the prep page.

### Day 28 (The Offer)
- Observed. Offer arrives in Mail: "Your offer from Harborside HQ… Your offer letter is below." The letter is not below; it is behind a "View offer and reply" button. Polish-level wording, but it is an instruction: logged as friction (low).
- Observed. Letter: "Dear applicant," (the email said "Hi Audit5,"). "Your first day is Tuesday, October 6." Oct 6 2026 is a Tuesday. FIXED (original: "Monday").
- Observed. Date is now a 3-button choice (Tuesday, October 6 / Friday, October 9 / Sunday, September 6). Wrong try Oct 9 → "That's not the date in the letter. Look at the second paragraph." Good.
- Observed. Reply "ok i come monday" → "Add your start date from the letter." Clear. "yes thank you. i accept. i start the 6th of october" → accepted. FIXED (original rejected "6th of October").
- Observed. Reload with a reply typed: the reply and the chosen date are lost; card goes to "Open Mail". Small loss (one line + one click). Friction.
- Observed. Help = "Reading an offer letter" (right lesson).
- Observed at 911: immediately after scrolling to the bottom, "Send reply" was under the card (`img/F-d28-send-911.png`, overlap measured). The Playwright click then went through, so the card's avoidance logic (`src/components/task/JobCard.tsx:361-400`, re-measures every frame on scroll) most likely moved it; not conclusive from one screenshot. Re-checked on later days with a delay.
- Observed. Arrival "ALMOST DAY ONE / HR sent the new-hire forms. / HR sent fictional forms for Robin Avery… Use Robin's facts, not your personal details." `img/F-d28-done-911.png`.

### Day 29 (New-Hire Paperwork)
- Observed. Paperwork arrives in Mail ("Before your first day: paperwork practice"): "The example is for Robin Avery, a practice worker… At a real job, you fill out your own forms with your own facts." Card: "Read Anita's email: Before your first day: paperwork practice." The framing is now honest (original: "You just accepted your job, and now you fill out Robin Avery's forms"). FIXED in framing; still Robin's forms by design.
- Observed. W-4 wrong tries, each with a specific correction: empty → "Step 1: choose Robin's filing status."; Married filing jointly → "Married filing jointly is for a married couple. Robin is not married. Read Robin's facts and choose again."; own name as signature → "Check the Signature box. Sign with Robin's full name… Robin Avery."; day-first date 01/10/2026 → "Check the Date box. Write the form date from Robin's facts: 10/01/2026 (month/day/year: October 1)." Original "unsupported" day-first date = FIXED. Lower-case "robin avery" and "10/1/2026" accepted.
- Observed. Reload mid-W-4: every field lost (status, $, signature, date); card goes to "Open Mail". Friction (short form, but a reload costs all of it). 
- Observed at 911: Robin's facts is a sticky strip. At the scroll position of Signature/Date, the card (left corner, x24–364, y206–440) hides "Robin's facts / Robin Avery · Not married · No dependents…" and the Signature label + left half of the field; the field is still clickable on its right half and Date is clear (`img/F-d29-w4-911-st600.png`, `img/F-d29-w4-911-submit.png`). At the filing-status position the card moves top-right and the facts are readable (`img/F-d29-w4-911-st300.png`). Friction (reading strip partly covered at the signing step; the name to type is in the correction).
- Observed. Submit W-4 → "Form submitted | Done. 2 tasks left. | Next task". To reach the I-9 the learner presses Next task (browser closes), then "Open Onboarding from the bookmarks", then the Onboarding bookmark: three presses per form, twice. Friction (low).
- Observed. I-9: the reference strip shows all of Robin's facts ("Born 04/12/1990 … U.S. citizen …"). Signature and Date arrive pre-filled with what I typed on the W-4 ("robin avery", "10/1/2026").
- Observed. **I-9 day-first birth date is still unsupported.** DOB "12/04/1990" (+ status "A lawful permanent resident") → "Compare the form with Robin's facts." After fixing the DOB, the wrong status still gets the same "Compare the form with Robin's facts." Code-verified: `src/lib/tasks/onboarding-paperwork/content.ts:447-450` `REFERENCE_HINT` is the only I-9 correction; the named per-field hints (`W4_FIELD_HINT`, `:353-366`) cover the W-4 only (status, dependents, date), nothing for `dob`, `address` or `workStatus`. The original finding ("a day-first birth date gets only 'Compare the form with Robin's facts'") was about the I-9, and it is NOT fixed there; only the W-4 got named hints. Learning: unsupported.
- Observed. Help = "What is an I-9?" (right lesson).
- Observed at 911: with the page scrolled to the bottom, the card (x24–364, y230–440) covers the label of "Submit I-9"; only the right end of the purple button shows, with no text (`img/F-d29-i9-911-2.png`, taken 900 ms after the scroll). The citizen option at the next position up is also half-covered (`img/F-d29-i9-911-1.png`).
- Observed. **Submit I-9 is covered by the card at both sizes**, and the card's avoidance does not move it. At 911 I scanned the form pane every 20 px (pane y182–456): at every position where the button is inside the pane (scrollTop 1060–1260) the card (x24–364, y230–440) covers its left end, which holds the left-aligned label; only an unlabelled purple bar shows (`img/F-d29-i9-911-submit-covered.png`). At 1366 the label reads "…it I-9" (`img/F-d29-i9-submit-1366.png`). The bar is clickable and Tab+Enter works, but the learner never sees the word "Submit" at 911. Grade: blocks beginners at 911 (label of the only finishing control never visible without moving the card), friction at 1366.
- Observed. Signing out and back in (driver restart) lost the I-9 fields typed earlier.
- Observed. Direct deposit: card headline is still a fact, not a task: "Routing number is 9 digits." (original Segment E note, not fixed). Placeholders still look like real values: "Bay State Bank", "011000015" (a real-format routing number), "000123456789" (not fixed).
- Observed. Swapped routing/account (1234567890 / 000000000) → "Compare the form with Robin's facts." Savings instead of checking → the same generic line. Same unsupported pattern as the I-9.
- Observed. Help = "Setting up direct deposit" (right lesson).
- Observed. Spanish DD screen fully Spanish except title-case "Autorización de Depósito Directo" and the mixed bookmarks bar ("Calendar", "Drive", "Docs", "Forms", "Portal" beside "Correo", "Empleos", "Documentos"). `img/F-d29-dd-es-1366.png`.
- Observed. Finish: "FORM SUBMITTED / You entered Robin's practice bank details. These forms do not change any real bank account." (original "Your pay will land in your account" = FIXED). Arrival: "YOU GOT THE JOB / Welcome to HQ. / You're an Office Administrator now. Chris needs a file from the team drive… / Open Drive from the bookmarks". `img/F-d29-done.png`.
- Not checked on Day 29: keyboard through the forms (Tab/Enter on Submit I-9 assumed from the button role, not run), Spanish W-4/I-9.

### Day 30 (Welcome to HQ)
- Observed. Card: "Your coworker Chris asked for the Q3 notes. Share the current file." Names who and what. FIXED (original: never said which file or who).
- Observed. **False Done from Mail on the first HQ day**: Mail bookmark → green card "Message sent | Direct deposit set up. You're ready for day one. | **Start tomorrow**" (`img/F-d30-wrong-mail.png`). Mail is still the café inbox (mail.harborsidecafe.com) on the HQ day.
- Observed. Drive search "Q3 notes" now finds four files. FIXED. Wrong tries: v1 → "That's version 1. Chris asked for the current file, not the draft."; the Q2 copy → "That one is from June, in the Q2 folder. It is old. Open Q3 2026." Share dialog shows "CO Chris Okafor" (FIXED, was "DO"). Can edit → "Chris asked for view only. Editor lets them change the file." (The card never mentions view only before the wrong try; Help does: "Share them as view only.")
- Observed. Help = "Share the file itself, not the folder" (right topic).
- Observed at 911: the share dialog is cut off at the bottom; "Can view" (y437) and Share (y601) need a wheel scroll of the page (the cut-off dialog is the only cue) (`img/F-d30-share-911.png`, `img/F-d30-share-911-wheel.png`). Friction.
- Observed at 911: **the Job Card scroll gutter grows without limit in Drive.** The Drive list pane's padding-bottom went 62,353 px → 70,656 px in 3 s with no input, then 74,842 px after one wheel; scrollHeight tracks it. Code-verified `src/components/task/JobCard.tsx:117-136` (`updateScrollGutters` sets `--job-card-gutter` from `r.bottom - card.top`; the pane is `flex-1` and grows with its own padding, so `r.bottom` grows each pass) and the MutationObserver on `style` at `:396` re-runs it every frame. Same bug the other segments reported. Effect for the learner: the scrollbar thumb shrinks to nothing and a wheel can fling the list far below the content.
- Observed. Keyboard: Enter on "Can view" then Enter on Share completes.
- Observed. **After sharing, the Drive done screen is the café's**: address "drive.harborsidecafe.com", "SHARED · schedule-week-of-sep-14.pdf · Shared with Jordan Kim · Viewer" (Act I's file and person), under the arrival card (`img/F-d30-done-911.png`). Original noted the café address; now it also shows the wrong file and person. Wrong name/file → friction.
- Observed. Arrival: "FOUR CALENDARS / Find the time that is open for everyone. / Then join the meeting you just booked. Keep your mic off and ask your question in the chat. / Open Calendar from the bookmarks".
- Skipped on Day 30: reload, Spanish.

### Day 31 (Get Everyone in the Room)
- Observed. Grid at 1366: card parks bottom-right, slots and "Invite everyone to this time" clear (`img/F-d31-cal-1366.png`). At 911 the card parks right (x547), slot "2:00 PM" (y299) and Invite (y355) not covered. Original "slots sit under the card" = FIXED.
- Observed. Wrong try 10:00 AM → "Someone is busy then. Find the slot that is open for all four." Help = "Find the gap, not a maybe", which names three of the four busy columns ("at 10 Chris is busy; at 11 Anita is busy; at 1 Jordan is busy"), leaving 2 or 3 PM: Help nearly gives the answer (learning: fair→given away if Help opened first).
- Observed. Reload before inviting: card "Open Calendar from the bookmarks"; nothing typed to lose.
- Observed. Keyboard: Enter on 2:00 PM, Tab Tab to Invite, Enter → "Invite sent | Done. One more task for today."
- Observed. Spanish calendar fully translated ("Miércoles: encuentra un horario… Libre/Ocupado… Invitar a todos a esta hora"); the app name stays "Calendar". `img/F-d31-cal-es-911.png`.
- Observed. Jordan Kim (café coworker) is still one of the four HQ calendars without explanation (original Segment E note; not fixed).
- Observed. A "Anita left a note" toast (`src/components/MariaNoteToast.tsx:10-45`, 5.5 s, opens Mail) pops up at the bottom centre on arriving in Calendar, before the task is done. Not an instruction, but clicking it opens Mail, where the false-Done card waits. Polish.
- Observed. Card now names the camera step: "Join muted. Start video. Ask in chat." FIXED (camera instruction).
- Observed. **Wrong time**: the invite was for 2:00 PM, but the Zoom join page says "You are a few minutes late" while the shelf clock reads 10:01 AM (`img/F-d31-zoom-1366.png`). After a reload the clock showed 6:07 PM. A wrong time is never polish → friction.
- Observed. The Zoom join page carries its own instruction lines: "You are a few minutes late. Join with your mic off." and "Your mic starts off. Leave it off until it is your turn to talk." A second instruction voice beside the Job Card (low; in-world wording).
- Observed. Wrong try Unmute → "Mute your mic again, then continue in chat. Your work is still here." Chat "hi" (via Send) → "Now type your question in the chat. A question asks something, like: When is…? Can I…?" FIXED (original accepted "hi").
- Observed. Enter in the chat box does not send; only the Send button does (keyboard friction).
- Observed. Sending a real question before "Start video" gives no correction at all; the card just stays on its headline. Low friction.
- Observed. Reload mid-call: back to the join screen, chat history gone (nothing graded lost).
- Observed at 1366 and 911: **the card covers the call controls.** At 1366 it covers the left half of the chat box (placeholder "Type your question in the chat…" hidden) and Jordan's tile (`img/F-d31-chat-1366.png`). At 911 it covers "Unmute", most of "Start video" (only the word "video" shows at x364–397), the learner's own tile and the chat placeholder (`img/F-d31-chat-911.png`). I pressed Start video on its visible sliver. The card did not move. Grade: friction at 911 (the button the card names is still partly readable and clickable); close to blocking.
- Observed. Finish: "YOU JOINED WELL", arrival "DO NOT SUBMIT IT BLIND / One row has no receipt. / Check the expense rows against the receipts. Flag missing documentation and report the total supported by receipts." (The arrival tells the learner there is exactly one missing row.)
- Skipped on Day 31: Spanish in Zoom.

### Day 32 (The Expense Report)
- Observed. Redesigned task: every row now has "Choose receipt" (a dropdown of four receipt files) and "Flag missing"; the Harbor Deli row reads $84 while its receipt says $48; the total must be typed. `img/F-d32-exp-1366.png`. Original "only the missing row has a Flag button" and "Drive is never needed" = FIXED; the learning is now real (fair).
- Observed. **The card never says the receipts are in Drive.** Card: "Match the receipts. Flag what is missing." Only Help says "Open Drive to see the receipts." The dropdown lists file names only (receipt-0910.pdf…). A beginner who does not open Help has no on-screen pointer to Drive until they submit a wrong total ("Check each amount against the receipt in Drive."). Friction.
- Observed. Wrong tries: "+ Blank" → "That's not today's sheet. Open September expenses."; Submit blind → "Do not submit it like this. First, flag the row that has no receipt."; total 224 (typo kept) → "One row does not match its receipt. Check each amount against the receipt in Drive."; again → "Look at the Harbor Deli receipt. What amount does it show?" Good escalating support. A wrong receipt chosen for Uber gave no immediate correction.
- Observed. The Day 32 arrival says "One row has no receipt." (tells the learner how many to flag; mild give-away).
- Observed. Drive "Receipts: September" shows each receipt's merchant, date and amount in text. At 911 the Drive pane's gutter was already 2,674 px (same growth bug as Day 30).
- Observed. Reload after matching and flagging: the four matches and "Flagged" come back. The card goes to "Open Sheets from the bookmarks" (and the file list must be clicked again).
- Observed at 911: the card parks top-right (x547–887, y206–440) over the "Flag missing" column; on rows 1–4 only "Fl…" peeks out (`img/F-d32-sheet-911.png`). The needed button (Team dinner) is readable only in a ~30 px scroll band; the third mouse-wheel notch lands in it (`img/F-d32-wheel-911-3.png`, `img/F-d32-flag-911-st272.png`). Amounts, dropdowns, total and Submit stay clear. **Answer to "does it block at 150%": no; friction** (reachable by ordinary scrolling, no card move needed).
- Observed. Spanish: "Gastos de septiembre… Comercio/Categoría/Monto/Recibo… Elegir recibo… Marcar falta… Marcado… Total con recibos ($)… Enviar informe". "Marcar falta" is an odd calque (e.g. "Falta el recibo" / "Marcar que falta"). App name "Sheets" and file names stay English (fine). `img/F-d32-es-911.png`.
- Observed. Total typed "$188" accepted (no "$$" problem). Arrival: "THREE SLIDES / A title, a number, a main point. / …The total comes from the receipts you checked."
- Skipped on Day 32: keyboard pass.

### Day 33 (Presenting to the Team)
- Observed. Arrival: "THREE SLIDES / A title, a number, a main point. …The total comes from the receipts you checked." The original false claim ("the total is already on the slide") is gone. FIXED.
- Observed. Slide 2 carries an "Expense report: reference" table (the receipted rows + "Team dinner $95 No receipt") and a "Total with receipts" box. Wrong try 283 → "Compare the receipt rows and enter their total on slide two." "$188" shows as "$188" on the thumbnail and the presented slide (original "$$188" = FIXED). Present with no title → "Put a title on the first slide first."
- Observed. Reload with all three slides filled: title, $188 and main point come back, on slide 3. FIXED (original: slides reset).
- Observed at 1366: **"Answer Chris" is still partly under the card**: card bottom-left (x24–444, y466–696), button x391–506; only "er Chris" shows (`img/F-d33-present-1366.png`). The page does not scroll at 1366 and the card did not move after 2 s or a wheel. The button is clickable on its visible part. The card headline stays "Three slides. Then present." and never mentions Chris's question (Help's tip does). Original "card covers Answer Chris" = NOT fully fixed; grade friction (partly visible, clickable).
- Observed at 911: on entering the presentation, the card (x24–364, y230–440) hides "Chris: Why is the dinner expense…" and the dropdown's label; "Answer Chris" is below the pane. Wheel notch 2 shows the question with the dropdown's label under the card; notch 3 shows "Answer Chris" clear but the dropdown has scrolled away (`img/F-d33-present-911.png`, `img/F-d33-911-wheel2.png`, `img/F-d33-911-wheel3.png`). Reachable with ordinary scrolling; friction.
- Observed. Chris's question is still a 3-option dropdown ("Meals never count as expenses." / "Its receipt is missing. We need it before including the expense." / "It is too small to report."). Wrong option → "Check the report: what is missing for dinner?" Learning: fair but thin (two options are implausible).
- Observed. Help = "You need three slides, no more" (right lesson).
- Observed. Spanish: slides UI all Spanish ("Diapositivas… Chris: ¿Por qué el gasto de la cena no está incluido en este total?… Responder a Chris"); card "Tres diapositivas. Luego presenta." `img/F-d33-es-1366.png`.
- Observed. Keyboard: select an option, Tab lands on "Answer Chris", Enter submits.
- Observed. **Act VI → VII boundary**: answering Chris goes straight to the full-page Act VII intro. There is still no Act VI closing moment (no "you finished Act VI"). Intro: "ACT VII / You're a Team Lead now / It is April now. You have worked at HQ for six months, through the fall and the winter…" (six-months framing = FIXED).

### Act VII boundary (Day 33 → Day 34)
- Observed. "Start Act VII" lands on the desktop **with the Job Card**: "1 | Day 1 of 4 | Agenda, notes, follow-up. | Open Meeting from the bookmarks" (`img/F-d34-after-start.png`). Original #3 (no Job Card after Start) = FIXED.
- Observed. At 911 "Start Act VII" is at y=685 on a 512 viewport, below the fold; focus is on BODY (`img/F-d34-actintro-911.png`). Same act-intro shell finding as the Act VI intro.
- Observed. Anita's email "Your first day as Team Lead": "It has been six months since your first day at HQ… Today is your first day as Team Lead." Inbox dates run forward: Oct 6 → Oct 9, 2026 for the HQ week (`img/F-d34-wrong-mail.png`). Code-verified Act VII dates: `src/lib/story-dates.ts:88-91` level24–27 = Mon Apr 12, Tue Apr 13, Thu Apr 15, Fri Apr 16, 2027. FIXED.

### Day 34 (Run the Meeting)
- Observed. **False Done again**: before starting, Calendar → "calendar.harborsidecafe.com … MESSAGE SENT" with the green card "Message sent | Done. One more task for today. | Next task" (Day 34 has one task and it is not done); Mail → the same card (`img/F-d34-wrong-cal.png`, `img/F-d34-wrong-mail.png`). Calendar shows the café domain in Act VII.
- Observed. "Take notes in the meeting" can be started before the agenda; no correction. The agenda box's topics are still only in "Need help writing?" ("Saturday close: who covers it / Late supply order: next step / New hire starts Thursday: training"); the page shows only a title and an empty box (original Segment E note, not fixed).
- Observed. The card stays "Agenda, notes, follow-up." for the whole hub and does not move on as parts are saved.
- Observed. Transcript includes Riley's correction ("Correction. I am away Thursday. Alex will handle the training Friday morning instead."). Good listening check. The page ends the transcript with "That's the huddle. Write your notes." (an in-page instruction line).
- Observed. Notes "ok / ok" → "Write a couple of lines on what got decided." FIXED (original passed). Beginner notes pass.
- Observed. Reload with notes typed (unsaved): notes come back. FIXED (original: reload wiped all three parts).
- Observed. Empty follow-up → "Check the transcript's final decisions. In the action list, select the final owner and day for every action." Training = Riley/Thursday → "Check "New hire training" in the action list: who does it, and what day? Use the final decision in the transcript." (names the row: FIXED). Right owners but empty body → "Write the follow-up email. One line for each job: who does it, and what day." FIXED (original accepted an empty email).
- Observed at 911: with that correction showing, the card grows (y158–440) and covers the email body and most of Send; only Send's bottom edge shows (`img/F-d34-email-911-send.png`). The correction also stays on the card after the body is filled (stale). The Playwright click on Send then went through. Friction.
- Observed. Arrival: "FEEDBACK IS PART OF THE JOB NOW / One of your team is up for review…".
- Skipped on Day 34: keyboard, Spanish, Help.

### Day 35 (The Review)
- Observed. Review form now requires "Profile evidence for this strength" (a dropdown of Sam's three wins) plus a strength and an area to grow. Card: "Choose a profile fact. Write one strength and one area to grow." `img/F-d35-review-1366.png`.
- Observed. "Sam is lazy and bad" in both boxes → not accepted (the page stayed; the Help click that followed failed because the next submit passed; see below). Code-verified: `src/lib/tasks/performance-review/content.ts:159-192` `HARSH` catches "lazy" and name-calling in either box; `ABOUT_THE_ISSUE` (`:167`) requires the growth line to be about lateness/the morning open. Original "Sam is lazy and bad would pass" = FIXED.
- Observed. "sam is good trainer. he teach two new people" + "sam is late" → "REVIEW SUBMITTED". The growth line "sam is late" passes although the "short" correction asks for "what better would look like"; the check only wants a lateness word and 3+ words. Learning: fair but thin (the fairness/what-better part is still unchecked; Anita's praise was not re-read this time).
- Observed. Arrival: "EVERYTHING AT ONCE / The full weekly report is yours this week. / A number from Sheets, a note from Calendar, a short write-up in Docs, sent as one packet."
- Skipped on Day 35: Help, reload, 911, keyboard, Spanish (time; one wrong try only).

### Day 36 (Put It All Together)
- Observed. **"Done here" and the "Weekly total ($)" box are still fully under the Job Card at 1366** (card x24–444, y466–696; input and "Done here" at x24, y≈520–600; "← Back to the report" too). The window does not scroll, and the card did not move after 2.5 s or a wheel (`img/F-d36-sheets-1366.png`, `img/F-d36-sheets-1366-wait.png`). At 911 the same (card y230–440, Done here y404) (`img/F-d36-sheets-911.png`). The only way on was to collapse the card ("Hide the rest of this card"), which nothing on screen suggests (`img/F-d36-sheets-collapsed.png`). **Blocks beginners. Original #2 NOT fixed on Day 36.**
  - Root cause, code-verified: `src/lib/job-card-placement.ts:108` `if (count(home, targets) === 0 && count(home, avoid) === 0) return preferred;` The card only leaves its corner for `[data-showme]` targets or `[data-card-avoid]` window controls. "Done here" has no `data-showme` (checked in the DOM: the only show-me targets on screen were `my-job` and `shelf-status` on the shelf), so the `lesser` list (`src/components/task/JobCard.tsx:87-94`) is never consulted from the home corner. The same rule explains Submit I-9 (Day 29), the Zoom controls (Day 31), "Answer Chris" at 1366 (Day 33) and Send at 911 (Day 34).
- Observed. Wrong tries: Open Mail first + Send → "Finish the other three parts, then send."; total 4000 → "Read the total cell and enter the weekly amount." (the weekly-amount correction: works; "4,820" accepted); Calendar "Done here" before noting → "Open the calendar item and note it first." (original "can be ticked without opening the event" = FIXED); summary "Thursday morning open no person" → "Add this week's total from the sheet."; "Everything fine. 4820 thursday morning need" → "Not everything is fine. Open the calendar item again, and say what needs attention."; empty email → "Write a line or two to Anita before you send." (original "report email can be sent empty" = FIXED). Original rejections of "no person" with "coverage gap" jargon = FIXED ("total 4820. thursday morning open no person" passes).
- Observed. Help = "Four apps, one packet" (right lesson).
- Observed. **Reload loses the packet's finished parts**: after Sheets and Calendar were done (hub counter 2 left… then 3), a reload returned the hub to "4" and the weekly total box empty (`img/F-d36-hub-after-reload.png`). Friction.
- Observed. Calendar week shows Mon 19 – Sun 25 with "THU 22 · 6 AM Morning open", "No one is assigned to the morning open. Flag it in the weekly report." (next week, dates forward). The report is "Weekly sales: Apr 5" / "Weekly report: week of Apr 5" (last week). Consistent.
- Observed. The address bar stays "sheets.harborsidehq.com/weekly" while the learner is in the packet's Calendar, Docs and Mail views. Polish.
- Observed. Spanish Mail view: "Reporte semanal: semana del 5 de abril… Enviar… ← Volver al reporte"; card "Cuatro apps. Un paquete." Fine. `img/F-d36-mail-es-911.png`.
- Observed. Arrival: "THE WHOLE WAY HERE / Look at everything you can do now." Here the buttons are in the reverse order: "Stop for today (your work is saved)" comes first and "Open Recap from the bookmarks" second (every other arrival puts the keep-going button first). Friction (low): a learner pressing the first button signs out.
- Skipped on Day 36: keyboard pass.

### Day 37 (Where You've Been) and the Office ending
- Observed. Recap lists awards by act, named (Act I, II, VI, VII on this direct Office route). `img/F-d37-recap-1366-full.png`.
- Observed. Four look-back answers "email / computer / no scared / is good" → accepted; "SUMMARY READY". Original rejection of short answers = FIXED.
- Observed. The in-app summary shows "WHAT I CAN DO NOW" grouped by plain headings and "IN MY OWN WORDS" with the answers; "Copy summary to share", "Download summary (.txt)". One skill line is jargon for a beginner: "I can write a SUM and cc a co-lead." (es: "Puedo escribir una SUMA y poner en copia a un colíder.").
- Observed. Award modal "Where You've Been / See award" opens an Awards panel ("27 of 42 unlocked", locked Acts III–V shown greyed). Escape does not close the panel; only its ✕ (aria-label Close) does. While it is open the Job Card is visible but cannot be pressed (the panel's full-width layer intercepts). Polish (keyboard).
- Observed. Card after the ending: "Summary ready | You finished the "Office" route: 20 days of work in all. | Back to my desk"; then on the desk "Route finished | … | See my summary | Change direction". 
- Observed. **After the ending, opening Mail or Calendar replaces that card**: "Message sent | You finished the "Office" route… | Back to my desk | Do it again" (no See my summary / Change direction) (`img/F-d37-mail-after-ending.png`); opening Maria's closing email turns it into "Day finished | You finished everything." with **no button at all** (`img/F-d37-maria-open.png`). A reload of / brings back "See my summary | Change direction". Same as D's F10 / C.
- Observed. Maria's closing email "From day one to here" says "This summary is yours. Show it to whoever you want." but has no summary attached or linked. Friction (low): dangling reference. Anita's "That was fair — Specific, and not harsh." praises a review whose growth line was "sam is late" (unchecked praise; low).
- Observed. `/summary` (from "See my summary"): "Workplace practice summary | Name Audit5 F en 1 | Class code E2E-AUDIT5 | Date September 29, 2026 | Program Workplace Simulator, EBHCS | Simulated workplace practice, not employment history. | Days of work finished: 20", skills list, Copy / Download (.txt) / Print (`img/F-d37-summary-page-full.png`). Original "no name, date or class" = FIXED. The learner's own look-back answers are NOT on /summary (only on the in-app Recap page). Spanish /summary fully Spanish (`img/F-d37-summary-es-911.png`).
- Observed. Route chooser: "Your next direction | Stay and lead 7 days · Renata | Healthcare / front desk 4 days · Thuy | Office / admin ✓ Finished | College preparation (optional) 4 days · Marcus | Stop here for now". `img/F-d37-chooser-1366.png`.
- Observed. **Changing route after the Office ending sends the story backwards**: I chose "Stay and lead". The Act III intro says "You're a Shift Supervisor now" to someone who has just been Team Lead at HQ for six months; the desk shows "SHIFT SUPERVISOR · Harborside Cafe" and "Day 14: Scheduling the Team" (after Day 37); the inbox is back to September 2026 and every HQ / Anita email is gone (`img/F-d37-route-lead-chosen.png`, `img/F-d37-route-lead-mail.png`). Code-verified: `src/lib/story-dates.ts:62-91` gives level9 (Act III) Sep 28, 2026 vs level27 Apr 16, 2027; `storyToday()` (`src/lib/story-calendar.ts:51`) is the level's own fixed day, with no route-order offset; the comment at `:74-77` claims "no route ever goes backwards", which holds only within one route. Friction (wrong dates/role are never polish).
- Observed. The false-Done card shows again on the new route (Mail → "Message sent | Done. One more task for today.").
