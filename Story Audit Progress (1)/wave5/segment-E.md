# Wave 5 re-audit: Segment E (Act V path B, Front desk, through the ending)

_Status: COMPLETE (29 Sep). Sections 2–6 follow the header; the running notes and code probes below are the raw evidence log._

## 1. Header
- Segment E: Studio once, "Start of Day 21: Getting Ready · Front desk", then play forward through Days 21–24, the Front desk ending, the summary and the route chooser.
- Build: http://localhost:3300 (469078f). Code read at 469078f (`git show 469078f:<path>` where main differs; the four task `content.ts` files and `clinic-privacy.ts` are identical on main).

- **Accounts** (class E2E-AUDIT5, PIN 1234):
  - `Audit5 E en 1`: English, 1366×768 with 911×512 checks at key screens. One Studio jump (Day 21 · Front desk), then continuous through Days 21–24, the ending, `/summary` and the chooser. Mid-Day 24 the driver process died during a permission-check outage; I signed the same learner back in (Add user, same name/code/PIN) and it resumed on Day 24 with nothing lost.
  - `Audit5 E es 2`: second fresh sign-up, **Spanish at 911×512**, its own single Studio jump to the same start, played continuously through Day 24, the ending and `/summary`. Used for the Spanish pass and for live Spanish leak tests without breaking account 1.
- **Conditions checked**

| Sitting | EN 1366 | 911×512 | ES | Keyboard | Wrong try | Help | Reload |
|---|---|---|---|---|---|---|---|
| Act V intro | yes | yes | yes | yes (Tab ×3, Enter) | n/a | n/a | no |
| Day 21 | yes | yes | yes | no (mouse) | yes (Mail, Portal, wrong reason, 12:30, "ok see you 10:00", "Sí, está bien.") | yes | yes |
| Day 22 | yes | yes | yes | no | yes (empty, x/x/x, 12/03/1998, "cough", Both people, fixture leak, "no") | yes | yes |
| Day 23 | yes | yes | yes | yes (cell, File, Email ▸, Email collaborators) | yes (wrong row, wrong-row email, "row 4 85 dollars", "the ekg is wrong", Mail) | yes | yes |
| Day 24 | yes | yes | yes | no | yes (fixture leak, no callback, beginner refusal, rude, "Yes she is coming", "Sí, hoy…") | yes | yes |
| Ending / summary / chooser | yes | yes | yes | no | yes (Mail note) | n/a | no |

- **Not checked:** keyboard on Days 21, 22, 24 tasks (only the act intro and Day 23 menu path); Print on `/summary`; Copy on `/summary` (Download fired); the College route after Front desk; a Spanish reload. The Spanish closing note in Mail was not opened live (the browser was minimized); its text is Code-verified (`story-beats.ts:694-697`).

## 2. Per-sitting table

| Sitting | Original verdict | UI/UX now | Learning now | Clean Pass? | Key evidence |
|---|---|---|---|---|---|
| Day 21 Getting Ready (appointment-scheduling) | Friction → Blocks (card-covered) | **blocks beginners** (1366: "Offer the open time" below the window with no cue; 911 friction) | fair | No | 11:30 row and the question are now clear of the card (fixed). "Offer the open time" at y=723–769 in a window ending at 712, overlay scrollbar only, card names no step (`E-d21-picked-1130-1366.png`). Mail/Portal show a false green "Done. One more task for today." (`E-d21-wrong-mail-1366.png`). The confirmation text grades well in both languages; the Day 21 done view never appears (`E-d21-text-sent-1366.png`). |
| Day 22 The Paperwork (patient-intake) | **Broken grading** | **broken** (a paraphrased leak passes) + **blocks at 911** (File intake under the card) | given away | No | "Sorry Tomas, I can't show you. She has a cold." passed and Thuy praised it (`E-d22-leak-cold-sent.png`, `E-d23-thuy-formfiled.png`); "No puedo, es privado. Tiene gripe." passed in Spanish (`E-es-d22-leak-gripe-911.png`). x/x/x now rejected; fixture leak rejected; "Tomás" named (all fixed). 911: File intake uncovered only in a 15–30 px scroll band (`E-d22-file-911-band.png`); scroll area grows past 390,000 px (`E-d22-911-gutter-bottom.png`). |
| Day 23 Staying On Top of It (billing-sheet) | Blocks beginners | **broken** ("row 4 85 dollars" rejected) + **blocks** (1366 grid and reference under the card; 911 File menu under the card at every position) | given away (both starters are the full answer); File → Email never taught | No | `E-d23-sheet-1366.png`, `E-d23-sheet-911.png`, `E-d23-row485-1366.png`, `E-d23-starters-1366.png`. Distinct names (Pat Brennan / Morgan Okonkwo) fixed; starters now in the page language (fixed). |
| Day 24 Finding a Real Answer (confidentiality-call) | **Broken grading** | **broken** (visit-confirming and time-giving replies still pass) ; 911 friction | given away (two starters = the answer) | No | "Her visit is today. I cannot share more. I can have Maya call you back." passed with the award (`E-d24-leak-sent-1366.png`); "Es a las once y media…" (her real slot) passed in Spanish (`E-es-d24-leak-oncemedia-911.png`). The fixture leak and the honest refusal are now graded right (fixed). |
| Front desk ending, note, summary, chooser | Friction (one-line award, no summary) | **friction** | none | No | Summary page works in both languages (`E-summary-1366.png`, `E-es-summary-911.png`); "Anita needs you at HQ" is gone (fixed). Opening Thuy's note turns the card into "You finished everything." with no buttons (`E-d24-closingnote-1366.png`); the note praises a leak. |

**Tally (4 sittings + ending, worst verdict):** 0 Clean Pass · 3 broken (Days 22, 23, 24) · 1 blocks beginners (Day 21) · 1 friction (ending). Learning: 3 given away (22, 23, 24), 1 fair (21). Original for these four: 2 broken, 2 blocks.

## 3. Findings

### E-1. The privacy checks still pass leaks that are not on their word lists (finding #4 only partly fixed)
- **Sittings:** Day 22, Day 24 (both languages)
- **Severity:** broken
- **Kind:** UI/UX · grading passes the wrong thing (and Learning: the skill being taught)
- **Route:** Dev
- **Evidence:** Observed: Day 22 "Sorry Tomas, I can't show you. She has a cold." → INTAKE FILED (`E-d22-leak-cold-sent.png`); ES "No puedo, es privado. Tiene gripe." → INGRESO ARCHIVADO (`E-es-d22-leak-gripe-911.png`). Day 24 "Her visit is today. I cannot share more. I can have Maya call you back." → CALL HANDLED + award (`E-d24-leak-sent-1366.png`); ES "Es a las once y media. No puedo decir más. Maya te va a llamar." → LLAMADA ATENDIDA (`E-es-d24-leak-oncemedia-911.png`). Code-verified (`wave5/E/privacy.ts`, `privacy2.ts` against the real functions): also pass "Her appointment is at noon…", "It is in the morning…", "She has one today…", "The doctor sees her today…", "Yes, I can't tell you the time…", "half past eleven…", "eleven thirty…", "Su cita es hoy…"; Day 22: "She has the flu", "she is pregnant", "She came for a check up", "She has a checkup". Cause: `src/lib/tasks/clinic-privacy.ts:31-38` FACTS only knows follow-up/cough/sick/enferma and digit times; CONFIRMS (`:40-52`) needs "she/maya has|is|comes…" patterns, so "her visit/appointment is…", "yes," + refusal, number words and any other illness slip through. What is fixed: the fixture leaks, "Maya comes at 11:30", "Yes she is coming today", "Sí, tiene cita a las 11:30" and the honest refusal "Sorry, I can not give information. Maya will call you." now grade correctly (Observed).
- **Steps:** Front desk Day 22 → file the form → Nurse Elena only → reply "Sorry Tomas, I can't show you. She has a cold." → Send. Or Day 24 → "Her visit is today. I cannot share more. I can have Maya call you back." → Say it.
- **Fix:** invert the check: pass only a refusal + callback (Day 24) or a refusal (Day 22) whose other clauses contain no statement about Maya, her visit, a time, or a health word (a small list plus "her/su + visit/appointment/cita"), and number-word times.

### E-2. Thuy's closing notes praise a leak
- **Sittings:** Day 22 → Day 23 mail; Day 24 → ending note
- **Severity:** broken (a wrong statement to the learner about the core skill)
- **Kind:** Learning · feedback
- **Route:** Content + Dev
- **Evidence:** Observed after the E-1 leaks: "The intake is in. You kept it off a coworker who is not on the care team." (`E-d23-thuy-formfiled.png`) and "You did not share the visit. You offered to have the patient call back. That was the right call." (`E-d24-closingnote-1366.png`). Code: `src/lib/story-beats.ts:610-619, 690-698` are fixed text, unlocked by task completion only.
- **Fix:** fixing E-1 fixes this; the note could also quote the learner's own reply.

### E-3. Billing email rejects "row 4 85 dollars" and tells the learner to add the charge they wrote
- **Sitting:** Day 23 (both languages)
- **Severity:** broken (grading fails a right answer with a wrong correction)
- **Kind:** UI/UX · grading
- **Route:** Dev
- **Evidence:** Observed: "row 4 85 dollars" → "Say what the charge should be. Check the reference list." (`E-d23-row485-1366.png`); ES "fila 4 85 dolares" → "Di cuál debería ser el cargo. Revisa la lista de referencia." Code: `src/lib/text-facts.ts:3` tokenizes `\d+(?:[.,\u00a0 ]\d+)*`, so "4 85" becomes 485. Also rejected (Code-verified): "row four should be eighty five", "EKG should be eighty-five dollars".
- **Steps:** Day 23 → click $185 → File → Email → Email collaborators → "row 4 85 dollars" → Send.
- **Fix:** in `mentionsAmount`, only join digit groups across a space when the second group has exactly three digits (a thousands group), and accept number words.

### E-4. Opening an earlier task's page turns the card into a false green "Done"
- **Sittings:** Day 21 (Mail, Portal), Day 22 (Calendar), Day 23 (Mail, EN and ES), ending (Mail)
- **Severity:** friction
- **Kind:** UI/UX · wrong instruction on the Job Card
- **Route:** Dev
- **Evidence:** Observed: Day 21 Mail → "Message sent / Done. One more task for today. / Next task", all 4 bars green (`E-d21-wrong-mail-1366.png`); Portal → "You noticed the conflict and asked for a swap. / Done. One more task for today." (`E-d21-wrong-portal-1366.png`); Day 22 Calendar → same (`E-d22-wrong-calendar-911.png`); Day 23 Mail → "That's today done. / Start tomorrow"; ES "Mensaje enviado / Terminaste este día. / Empezar mañana". "Next task" only returns to the real card. Same as Segment D F1.
- **Fix:** a done state from a task outside the current sitting must not drive the card.

### E-5. Day 21: "Offer the open time" is below the window at 100%, with no cue
- **Sitting:** Day 21
- **Severity:** blocks (by the agreed rule; the fix is one scroll, but nothing shows the page continues)
- **Kind:** UI/UX · fold
- **Route:** Dev
- **Evidence:** Observed at 1366×768: after choosing the reason and 11:30 the progress bar moves to step 3, but the button sits at y=723–769 in a scroll area ending at y=712 (scrollHeight 830, clientHeight 501); the select above it ends cleanly, so nothing is cut; the scrollbar is overlay-only (offsetWidth = clientWidth); the card shows only "Offer Maya a time that works." (`E-d21-picked-1130-1366.png`). The `RIGHT_NOW_STEPS` in `appointment-scheduling/content.ts:268-276` ("Click Offer the open time.") never appear on the Story card. At 911 the rows are visibly cut, so scrolling is cued (friction).
- **Fix:** scroll the Offer button into view (or reveal it next to the selected row) when a slot is picked, or show the step line on the card.

### E-6. Day 22 at 911: the card sits on "File intake" at almost every scroll position
- **Sitting:** Day 22
- **Severity:** blocks (911); friction at 1366
- **Kind:** UI/UX · covering
- **Route:** Dev
- **Evidence:** Observed: card x24–364, y206–440; the sticky clinic header covers y162–211; scanning scrollTop 0–700 in 10 px steps, the button was uncovered only at 220–250 and then only 9–18 of 36 sample points (`E-d22-file-911-band.png`). My own mis-aimed click at another position hit the Calendar bookmark. At 1366 the card covers the field labels, the start of each box and all of "File intake" except "…ake" (`E-d22-desk-1366.png`), and after filing it covers "Nurse Elena" and "Tomás Ortiz" (`E-d22-filed-1366.png`); scrolling uncovers them and the cut-off select cues it.
- **Fix:** give the intake page the card gutter on the left (content is centred with free space on the right) or let the card move off the primary button.

### E-7. Day 23: the card covers the whole charge grid and reference list at 100%, and the File menu at 150%
- **Sitting:** Day 23
- **Severity:** blocks
- **Kind:** UI/UX · covering
- **Route:** Dev
- **Evidence:** Observed at 1366: card x24–444, y433–696 over the reference list and all five grid rows; the right two-thirds of the window is empty (`E-d23-sheet-1366.png`). Scrolling 293 px uncovers the grid (`E-d23-picked-1366.png`), but then the reference list is off the top, so comparing needs scrolling back and forth under the card; nothing says to scroll. At 911 the toolbar "File"/"Archivo" is under the card at every scroll position (it does not scroll); "93000 · EKG" is uncovered at 1 of 18 positions, $185 at 4 (`E-d23-sheet-911.png`). Keyboard can still reach File (Tab/Enter), a beginner cannot know that.
- **Fix:** put the Sheets task's card in the empty right-hand area (it is left-aligned content), and never over the menu bar.

### E-8. Day 23 never tells the learner how to email from Sheets
- **Sitting:** Day 23
- **Severity:** friction
- **Kind:** Learning · unsupported
- **Route:** Content
- **Evidence:** Observed: the card says only "Find the charge that does not match." before and after the row is clicked; Help lists three points about prices and rows, none about File → Email → Email collaborators (`E-d23-help-1366.png`). The office note says "Email Pat". `RIGHT_NOW_STEPS` (`billing-sheet/content.ts:200-204`) has the menu path but it is not shown in Story. A wrong row click gives no feedback at all.
- **Fix:** after the right row is clicked, the card's line becomes "Choose File → Email → Email collaborators."

### E-9. Starters hand over the answer (Days 23 and 24)
- **Sittings:** Day 23, Day 24
- **Severity:** friction
- **Kind:** Learning · given away
- **Route:** Content
- **Evidence:** Observed: Day 23 starters "Pat, the EKG for Okonkwo is $185. The list says $85." and "93000 should be $85, not $185." (`E-d23-starters-1366.png`), each passes on its own (Code-verified `billingEmailVerdict` → ok). Day 24 starters "I'm sorry, I can't confirm any information about a patient's visit." + "I can have Maya call you back if that works." together are the full answer. Day 21's starters, with ___ for the time, are the model to follow.
- **Fix:** blank the facts (row, charge, callback) the way Day 21 does.

### E-10. Day 22: placeholders are the answers, and the recipient question labels itself
- **Sitting:** Day 22
- **Severity:** friction
- **Kind:** Learning · given away; UI/UX · copy
- **Route:** Content
- **Evidence:** Observed: the three boxes show grey "Maya Ansari", "03/12/1998", "Follow-up" (`E-d22-desk-1366.png`), so an empty form looks filled; clicking File intake then gives "Fill name, date of birth, and reason first." The request cards read "Tomás Ortiz · kitchen (not care team)" and "Nurse Elena · care team" under a box that states the answer: "Fictional clinic assignment record: … Tomás Ortiz works in the kitchen and has no care assignment for Maya. This is simplified practice." The wrong-choice correction is hard English: "Compare the verified assignment with both requests. A request alone does not establish access." (ES: "Pedir acceso no demuestra autorización."). Tomás still works "in the kitchen" at a clinic.
- **Fix:** neutral placeholders; drop "(not care team)" from the label; plain correction ("Only the care team can see the chart. Is Tomás on the care team?").

### E-11. Reload and tab-switching lose in-task work on every Front desk day
- **Sittings:** Days 21–24
- **Severity:** friction
- **Kind:** UI/UX · state
- **Route:** Dev
- **Evidence:** Observed: Day 21 reload loses the reason and slot; Day 22 reload loses the filed form, the choice and the draft (`E-d22-after-reload-reopen.png`), and switching to Calendar and back clears the typed form; Day 23 reload returns to the Sheets home, draft gone; Day 24 reload clears the reply. The day and card come back each time.
- **Fix:** keep the desk's step state and drafts in the same store the other tasks use for drafts.

### E-12. The finished day hands straight to the next arrival card; the learner never sees what they sent
- **Sittings:** Day 21, 22, 23
- **Severity:** friction
- **Kind:** UI/UX · feedback
- **Route:** Dev
- **Evidence:** Observed: after "Send confirmation" on Day 21 the Day 22 arrival card opened at once over the intake desk (`E-d21-text-sent-1366.png`); the done view with the booked row and "Your text to Maya" (`FrontDeskTask.tsx:200-218`) is never seen because `FrontDeskTask` switches desks by `currentTrack` (`:95-103`). Same after Day 22 and 23. There is also no text reply from Maya.
- **Fix:** hold the finished desk until the learner continues, then show the arrival card.

### E-13. After the ending, reading Thuy's note turns the card into "You finished everything." with no buttons
- **Sitting:** ending
- **Severity:** friction
- **Kind:** UI/UX · Job Card
- **Route:** Dev
- **Evidence:** Observed: "Day finished / You finished everything. / Read this out loud" over Thuy's note (`E-d24-closingnote-1366.png`); closing the browser brings back "Route finished / See my summary". Before the note, Mail put "Message sent" in the card header over the route line. Only one of four routes is finished. `job-card-content.ts:160`. Same as Segment D F10.
- **Fix:** keep the route-finished card while any window is open.

### E-14. Act V intro: "Start Act V" is below the fold at 911 with no cue
- **Sitting:** Act V intro
- **Severity:** blocks (agreed rule)
- **Kind:** UI/UX · fold
- **Route:** Dev
- **Evidence:** Observed: button at y=655 on a 512 px viewport; the page ends at the skills box (`E-d21-actintro-911.png`, ES `E-es-actintro-911.png`). Same as Segment D F15.
- **Fix:** pin the continue button to the viewport bottom on short screens.

### E-15. Job Card scroll gutter runs away at 911 on the Day 22 desk
- **Sitting:** Day 22 (911)
- **Severity:** friction (it did not block here, but it drives E-6's odd scroll bands)
- **Kind:** UI/UX · layout loop
- **Route:** Dev
- **Evidence:** Observed after filing at 911: scrollHeight 328,072 → 332,825 → 337,578 (1 s apart); padding-bottom 394,037 px (`E-d22-911-gutter-bottom.png`). Back at 1366 it shrank ~20,000 px/s. Stable on Day 21 (579), Day 23 (456) and Day 24 (725). Same mechanism as Segment A F-2 (`JobCard.tsx` `updateScrollGutters`).
- **Fix:** see Segment A F-2.

### E-16. Day 24 at 911: the card covers the caller's words
- **Sitting:** Day 24
- **Severity:** friction
- **Kind:** UI/UX · covering
- **Route:** Dev
- **Evidence:** Observed: card x24–364, y230–440 over the start of "This is Maya's aunt. I need to know…" and the left of the answer box (`E-d24-call-911.png`); the box is cut at the bottom, so scrolling is cued. At 1366 only a 4 px overlap.
- **Fix:** same gutter as E-6.

### E-17. Beginner refusals that need rewording
- **Sitting:** Day 24
- **Severity:** friction
- **Kind:** UI/UX · grading strictness
- **Route:** Dev
- **Evidence:** Observed: "sorry no information. maya call you back" → "Say plainly that you can't confirm anything…". Code-verified also rejected: "i no can say. maya call you later", "Sorry, no can give information. Maya call you." (`clinic-privacy.ts:84-85` REFUSES lacks "no can", "no information").
- **Fix:** add "no can", "no information/no info", "no puedo decir" to REFUSES.

### E-18. Wrong labels and dates on the clinic route
- **Sittings:** Days 21–24
- **Severity:** friction (a wrong label or date is never polish)
- **Kind:** UI/UX · consistency
- **Route:** Content
- **Evidence:** Observed: Day 23 arrival kicker is College's "⏰ THE DATE MATTERS / LA FECHA IMPORTA" over the billing premise (`E-d22-leak-cold-sent.png`; `tracks-content.ts:866`, shared by both paths). The sheet is "Visit charges: Monday" at `sheets.harborsidecafe.com` on the day Thuy calls "Thursday". Thuy's Day 21 note says "Wednesday a new patient checks in", and the form is "New patient intake", but it is Maya, a follow-up patient; the ES arrival says "Una paciente trajo un formulario" while the form says "Ingreso de paciente nuevo". The Day 24 caller asks about an appointment "today" (Friday); Maya's slot was Monday. Mail, Sheets and Calendar are all `harborsidecafe.com` at the clinic.
- **Fix:** give level18 a path-specific kicker ("Check it twice"); rename the sheet "Visit charges: Thursday" on `harborsidehealth.com`; call Maya a returning patient.

### E-19. Spanish mixed language on the clinic route
- **Sittings:** all (ES account)
- **Severity:** friction
- **Kind:** UI/UX · Spanish
- **Route:** Content
- **Evidence:** Observed: browser "New Tab", "Search Google or type a URL", bookmarks "Calendar", "Forms", "Sheets" beside "Bienvenida", "Correo", "Recepción" (`E-es-d21-newtab-911.png`); the card says "Abre Sheets en los marcadores" (matches the bookmark, but English); Mail shows "Mail", "Yesterday", "Mon" beside "Ayer", "Lun"; the awards dialog keeps "II · Shift Lead", "III · Shift Supervisor" (`E-es-routefinished-911.png`) and the award line is the lowercase fragment "rechazar una petición creíble de información privada". Code-verified: Thuy's note "Ofreciste que el paciente devuelva la llamada" should be "la paciente" (`story-beats.ts:696`). The act intro's "Nuevas habilidades que vas a construir" is a calque ("que vas a desarrollar"), and it calls the skill "Formularios de admisión" while the page says "Ingreso de paciente". What is right: every task screen, correction and starter on the four desks is Spanish (the billing starters are now in the page language), and "Sí, a las 11:30" and "Hola Maya, las 10:00 están ocupadas. Puedes venir hoy a las 11:30." grade correctly.
- **Fix:** localize the browser chrome and bookmark labels (or gloss them), use one term for intake, fix "la paciente".

### Polish (does not cost time or understanding)
- Help kicker still says "2-minute lesson" on every desk (`E-d21-help-1366.png`).
- Day 23 keyboard: after Email collaborators, focus stays on BODY instead of the message box.
- Day 21 at 911 the card covers the Forms/Sign In/Portal bookmarks (not needed for the task).
- The desktop clock jumped to real elapsed time (9:01 AM → 1:30 PM → 9:36 PM) between sessions.

## 4. Regressions
- None found against the original audit for these four sittings. E-5 (Day 21 "Offer the open time" below the window) was probably there before, hidden behind the card that covered the 11:30 row; it is only visible now that the card moved. E-12 (instant hand-off to the next arrival) matches Segment D's Day 21 note.

## 5. Checks of fixes and Wave 4 items in this segment
| Item | Works? | Evidence |
|---|---|---|
| #4 clinic privacy: fixture leaks rejected, honest refusal passes | **Partly.** Fixture sentences and several variants now grade right in both languages; paraphrased leaks still pass (E-1) | `E-d24-leak-sent-1366.png`, code probes |
| Distinct names (Pat Brennan, office manager / Morgan Okonkwo, patient) | Yes | `E-d23-compose-1366.png`, sheet text |
| "reply to Sam" → Tomás | Yes | Day 22 card |
| Front desk ending no longer says "Anita needs you at HQ" | Yes | `E-d24-closingnote-1366.png`; no match in `src` |
| Every ending gives something to keep (#6) | Yes: Route finished card → See my summary → `/summary` with Copy/Download/Print, EN and ES | `E-summary-1366.png`, `E-es-summary-911.png` |
| Route mail (#1): Thuy's notes arrive | Yes (Mon, Yesterday, 3:55 PM notes present) | `E-d23-mail-1366.png` |
| Day 21 text-message confirmation to Maya | Grading works (EN/ES, blanks rejected, "10:00" corrected); the sent text is never shown back (E-12) | `E-d21-text-wrong-911.png`, `E-es-d21-text-911.png` |
| Billing: match code to fee schedule | Works as a task; card coverage (E-7) and missing menu instruction (E-8) remain; "row 4 85" misgraded (E-3) | |
| Billing starters in the page language | Yes | `E-d23-starters-1366.png`, `E-es-d23-compose-911.png` |
| Day 24 call panel no longer scripts the reply | Yes | `E-d24-call-1366.png` |
| Day 24 arrival uses the clinic line, not "Cite a source" | Yes (body); kicker "Use your judgment, don't guess" shared | `E-d24-arrival-1366.png` |
| Card overlap guard (#2, PR #45) | Better on Days 21 and 24 at 1366; still covers Days 22–23 at 1366 and 22–23 at 911 (E-6, E-7) | |
| Route chooser after the ending | Yes: Healthcare "✓ Finished", four other routes, Not now; fits at 911 | `E-chooser-1366.png`, `E-chooser-911.png` |

## 6. Predicted items (not counted)
- A Spanish-first learner may type Maya's birth date day-first (12/03/1998, as "12 de marzo" reads); it is rejected with "Check the date of birth. Copy it from Maya's paper form." The correction is fair, but the paper form could show "March 12, 1998" to remove the ambiguity.
- A beginner who sees a green "Done. One more task for today." after opening Mail may think the day is over and stop (E-4).
- A learner who reads Thuy's note before pressing See my summary may leave on "You finished everything." and never find the summary (E-13).
- On Day 23 a learner who never finds File → Email may email Pat from Mail instead, which the task does not accept.

## Resume from here
- Account `Audit5 E en 1` (E2E-AUDIT5 / 1234), English. Studio used once (Day 21 · Front desk).
- (Updated after resume) Days 21, 22, 23 complete. Now on **Day 24** (call open, wrong tries done; Help/reload/911 and the final passing reply not yet done). Still to do: Day 24 finish, Thuy's closing note, ending card, `/summary`, route chooser, Spanish pass.
- Driver: `wave5/E/driver.mjs` on port 9555 (`E/run.sh p1 < E/s.js`).
- Driver: `wave5/E/driver.mjs` on port 9555 (`E/run.sh p1 < E/s.js`).

## Running notes (Observed, account `Audit5 E en 1`)
- Act V intro: at 911×512 "Start Act V" is at y=655 on a 512 px viewport; document scrolls, no cue (`E-d21-actintro-911.png`). Keyboard: Tab x3 reaches it, Enter works.
- Day 21: Mail bookmark → card turns green "Message sent / Done. One more task for today. / Next task", all bars green (`E-d21-wrong-mail-1366.png`). Portal → "You noticed the conflict and asked for a swap. / Done. One more task for today." (`E-d21-wrong-portal-1366.png`). Next task returns to the Day 21 card.
- Day 21 1366: 11:30 row and question visible (fixed). "Offer the open time" at y=723–769, window ends y=712, overlay scrollbar only (offsetWidth==clientWidth), card gives no step line (`E-d21-picked-1130-1366.png`).
- Day 21: wrong reason "Luis Moreno" → "Luis Moreno has 9:30. Look at the 10:00 row. Whose name is there?"; 12:30 → blocked message. Good.
- Day 21 reload: browser closes, reason and slot choice lost.
- Day 21 911: card top-right covers bookmarks Forms/Sign In/Portal; textarea right edge under card, Send half visible (`E-d21-text-911.png`). No gutter runaway (579/245 stable).
- Day 21 text: "ok see you 10:00" → "Your text needs the new time. Which time on the schedule says Open? Write that time." Starters have ___ blanks (good). "hi maya, 10 is taken. you can come 11:30 today. ok?" passed, then Day 22 arrival card appeared at once over the intake desk; the Day 21 done view (booked row + sent text) never showed (`E-d21-text-sent-1366.png`; `FrontDeskTask.tsx:95-103` swaps desks by `currentTrack`).
- Day 22 card: "File the form. Choose who may see it, then reply to Tomás." (Sam→Tomás fixed.) At 1366 the card (bottom-left, x24–444, y433–696) covers the field labels, the start of each box and "File intake" except "…ake" (`E-d22-desk-1366.png`, `E-d22-focus-1366.png`); after filing it covers "Nurse Elena" and "Tomás Ortiz" names (`E-d22-filed-1366.png`).
- Day 22 form: empty → "Fill name, date of birth, and reason first."; x/x/x → "Check the name…"; 12/03/1998 → "Check the date of birth…"; "cough" → "Check the reason…"; 3/12/1998 + "follow up" filed. Grey placeholders in the boxes are still the answers ("Maya Ansari", "03/12/1998", "Follow-up").
- Day 22 recipient "Both people" + safe reply → "Compare the verified assignment with both requests. A request alone does not establish access." Fixture leak "Sorry Tomas, she is here for her cough…" → "Do not tell Tomás the reason for the visit. Just say you cannot share it." "no" → "Say no, and that the form is only for the care team…".
- Day 22 reload: everything lost (filed form, choice, typed draft) (`E-d22-after-reload-reopen.png`). Switching to another bookmark and back also clears the typed form.
- Day 22 911: the card (x24–364, y206–440) sits over the whole "File intake" button at every scroll position except a ~15–30 px band (scan: uncovered only at scrollTop 220–250, 9–18 of 36 sample points) (`E-d22-file-911-band.png`). The sticky clinic header covers y162–211. Mis-aimed click hit the Calendar bookmark → card turned to "Message sent / Done. One more task for today." (`E-d22-wrong-calendar-911.png`).
- Day 22 911 after filing: the scroll area's height ran away: 328,072 → 332,825 → 337,578 px (1 s apart), padding-bottom 394,037 px at the bottom (`E-d22-911-gutter-bottom.png`). Back at 1366 it shrank slowly (229,401 → 164,965 over 3 s).
- **Day 22 leak passes live:** Nurse Elena only + "Sorry Tomas, I can't show you. She has a cold." → "INTAKE FILED", day done, Day 23 arrival (`E-d22-leak-cold-typed.png`, `E-d22-leak-cold-sent.png`).
- Day 23 arrival kicker is College's "⏰ THE DATE MATTERS" over the clinic body "The clinic charges need checking…" (`tracks-content.ts:866`, shared by both paths).

- Day 23 card: "Find the charge that does not match." Mail on Day 23 → "Message sent / That's today done. / Start tomorrow" (false done). Thuy's notes now arrive (Mon "11:30 is on the book", "The form is filed" — which praised my leaking reply: "You kept it off a coworker who is not on the care team.") (`E-d23-thuy-formfiled.png`).
- Day 23 sheet: still "Visit charges: Monday" at `sheets.harborsidecafe.com`. Office manager is now **Pat Brennan**, patient **Morgan Okonkwo** (distinct; fixed).
- Day 23 1366: card (x24–444, y433–696) covers the reference list and the whole charge grid (`E-d23-sheet-1366.png`); scroll area can scroll 293 px (gutter 303 px) and scrolling to the bottom uncovers the grid (`E-d23-picked-1366.png`), but then the reference list is off the top; nothing says to scroll.
- Day 23: clicking the wrong row ($145) gives no feedback; clicking $185 turns it red; the card does not change or name File → Email → Email collaborators at any point (Help doesn't either) (`E-d23-help-1366.png`).
- Day 23 911: card covers the "File" menu at every scroll position (it is in the fixed toolbar); reference "93000 · EKG" uncovered at 1 of 18 positions, $185 at 4 (`E-d23-sheet-911.png`). No gutter runaway here (456 stable).
- Day 23 email: "Maya Ansari should be $85" → "Say which row is wrong…"; **"row 4 85 dollars" → "Say what the charge should be. Check the reference list."** (wrong; `E-d23-row485-1366.png`); "the ekg is wrong" → same (right). Starters (English page): "Pat, the EKG for Okonkwo is $185. The list says $85." / "93000 should be $85, not $185." — both are the full answer (`E-d23-starters-1366.png`).
- Day 23 keyboard: $185 cell, File, Email ▸, Email collaborators all reachable with Tab/Enter; focus is not moved into the message box (activeElement BODY).
- Day 23 reload: back to Sheets home, draft and row choice lost.

- Day 23 finish: "row 4 is wrong. It should be $85." passed → Day 24 arrival card "🔎 USE YOUR JUDGMENT, DON'T GUESS / Finding a Real Answer / Someone calls asking about a patient's visit. You cannot check who is calling. Protect the patient's information." (clinic-specific body; the old "Cite a source" line is gone). No Day 23 done view shown (same instant hand-off as Day 21).
- Day 24 card: "Answer the call about Maya." The call panel no longer scripts the answer (fixed). At 1366 the card only touches the box edge (4 px). Caller still says "appointment today" (Maya's slot was Monday; this is Friday per Thuy's note).
- Day 24 corrections (Observed): fixture leak "Maya comes at 11:30 today…" → "You do not know who this really is, so you cannot confirm a visit."; "I can not give information" → "Good. You did not share anything. Now offer to have Maya call them back."; "sorry no information. maya call you back" → "Say plainly that you can't confirm anything, and offer to have Maya call them back." (honest beginner reply rejected); "Sorry, I cannot give information. Goodbye." → "You can say no without being rude…"; "Yes she is coming today…" → leak correction.
- Day 24 starters: "I'm sorry, I can't confirm any information about a patient's visit." + "I can have Maya call you back if that works." Together they are the whole answer (code: `callReplyVerdict` → ok).

- (After the permission-check outage the driver process had died; I signed `Audit5 E en 1` back in through "Add user" in a fresh browser context. It returned straight to Day 24, "Answer the call about Maya." No progress lost.)
- Day 24 Help: "Do not confirm anything over the phone… The safe answer: you cannot confirm anything, and you can have the patient call them back." Reload: browser closes, typed reply lost (`draft=""`).
- Day 24 911: card (x24–364, y230–440) covers the start of the caller's line ("This is Maya's aunt…") and the left of the answer box (`E-d24-call-911.png`); the box is cut at the bottom, so scrolling is cued; scroll height stable (725).
- **Day 24 leak passes live:** "Her visit is today. I cannot share more. I can have Maya call you back." → "CALL HANDLED", award "Finding a Real Answer — Stay polite. Do not confirm." (`E-d24-leak-typed-1366.png`, `E-d24-leak-sent-1366.png`, `E-d24-award-1366.png`).
- Ending card (after the award): "Call handled / You finished the "Front desk" route: 16 days of work in all. / Back to my desk / Do it again" (`E-d24-endcard-1366.png`); a "Thuy left a note" line showed briefly and was gone when I closed the award dialog. After Back to my desk: "Route finished / … / Your summary lists what you can do now… / See my summary / Change direction" (`E-d24-routefinished-1366.png`). At 911 See my summary is inside the card and visible (`E-d24-routefinished-911.png`).
- Mail with the route finished: card header "Message sent" over the route line. Opening Thuy's closing note "You did not confirm": **"You did not share the visit. You offered to have the patient call back. That was the right call. That finishes your practice at the front desk. Your work is saved."** — praise for a reply that confirmed the visit. The card then reads "Day finished / **You finished everything.**" with no buttons (`E-d24-closingnote-1366.png`). Closing the browser window brings "Route finished / See my summary" back. No "Anita needs you at HQ" anywhere (fixed; `grep` of `src` finds no such line).
- `/summary?lang=en`: name, class code, date, "Simulated workplace practice, not employment history.", "Days of work finished: 16", three skill groups incl. "Working at a clinic front desk" (4 lines: "I can book an appointment without double-booking. / I can judge who may see a patient form. / I can match visit codes to charges. / I can decline a plausible request for private information."). Copy / Download (.txt) / Print present; Download fired (`E-summary-1366.png`, `E-summary-911.png`).
- Route chooser ("Change direction"): Healthcare / front desk "✓ Finished", other four routes offered, "Not now". All visible at 911 (`E-chooser-1366.png`, `E-chooser-911.png`).

## Code-verified grading probes (run early)
Script: `wave5/E/privacy.ts`, `wave5/E/privacy2.ts`, run with the repo's `tsx` against the real functions (read-only).

### Confidentiality call (`callReplyVerdict`, `src/lib/tasks/confidentiality-call/content.ts:107`) — leaks that still return `ok`
- "Her appointment is in the morning. I can't say more. Maya will call you." → ok
- "Her appointment is at noon. I can't say more. Maya will call you back." → ok
- "She has one today. I can't tell the time. Maya will call you back." → ok
- "Her visit is today. I cannot share more. I can have Maya call you back." → ok
- "The doctor sees her today. I can't say more. Maya will call you back." → ok
- "Yes, I can't tell you the time. Maya will call you back." → ok (a "yes" to "does she have an appointment today")
- "half past eleven. sorry I can not give information. Maya will call you" → ok (her real slot)
- "eleven thirty. I can not say more. Maya will call you back." → ok (her real slot)
- "Su cita es hoy. No puedo dar más información. Maya te va a llamar." → ok
- "Es a las once y media. No puedo decir más. Maya te va a llamar." → ok (her real slot, in Spanish)
Caught correctly: "Maya comes at 11:30 today…", "She has an appointment today, but…", "Yes she is coming today…", "Sí, tiene cita a las 11:30…", "Ella tiene una cita hoy…".
Honest beginner refusals rejected as `weak`: "i no can say. maya call you later", "Sorry, no can give information. Maya call you.", "sorry no information. maya call you back".
Fixture honest refusal "Sorry, I can not give information. Maya will call you." → ok (fixed).

### Patient intake reply to Tomás (`declineIsSafe`, `src/lib/tasks/patient-intake/content.ts:150`) — medical reasons that still pass
- "Sorry Tomas, it is private. She has a checkup." → safe
- "Sorry, it's private. She has the flu." → safe
- "sorry i can not. she is pregnant" → safe
- "I can't show you. She has a cold." → safe
- "No puedo, es privado. Tiene gripe." → safe
- "I'm not allowed. She came for a check up." → safe
Caught: anything with cough/tos/follow-up/seguimiento/sick/enferma, "here for a…".

### Billing email (`billingEmailVerdict`, `billing-sheet/content.ts:127`; `mentionsAmount`, `src/lib/text-facts.ts:2`)
- "row 4 85 dollars" → no-charge; "fila 4 85 dolares" → no-charge. `mentionsAmount` joins "4 85" into one number (485) because its token regex allows a space as a thousands separator.
- "row four should be eighty five", "EKG should be eighty-five dollars" → no-charge (number words).
- "row 4 is wrong. It should be $85." → ok (fixture fixed).

