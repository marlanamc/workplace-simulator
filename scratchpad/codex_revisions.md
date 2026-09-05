# Codex revisions

## 2026-09-05 — Act I review changes

Status: implemented locally; automated verification passed. Marlana's in-depth playthrough is next.

Scope: the current Act I in `src/lib/tracks-content.ts`: L0, L1, L2, L3, L3a, L3a2. The original review also discusses Act II; those implementation changes are a later pass. No learner progress or level order was changed.

### What changed and why

| Level | Change | Why |
| --- | --- | --- |
| L0 — How this works | Kept the four-step browser tour. The last step now says “Tap the ? on this card to try Help,” with equivalent Spanish. | Trying Help is required here; “if you get lost” made it sound optional. |
| L0 | After closing Help, the Job Card says the learner has tried Help and is ready for the first task. | The old “Now try Help” instruction asked for something the learner had just done. |
| L0 | Added how to reopen a shrunken card to the existing Help lesson, in both languages. | Makes recovery explicit without adding another introductory step or instruction surface. |
| L0 | Aligned Spanish completion copy with English and removed stale Mail + Calendar comments. | Spanish still described an older desktop/briefcase flow; Calendar is no longer in the tour. |
| L1 — Day One | Shared the attachment completion body between the per-task copy and fallback copy. | Keeps the same explanation from drifting into two versions. The reply/attachment challenge remains as reviewed. |
| L2 — The First Week | First wrong day gets the existing comparison hint. From the second wrong day onward, the Job Card points to Thursday, Aug 27 and the 11 AM appointment. The stronger instruction persists while finding the day. Replay clears the local attempt count. | Preserves independent comparison on the first attempt and gives a learner who is stuck a clearer way forward. Correct selection still opens the swap form; it does not automatically finish the task. |
| L3 — Payday | Changed shift-review completion copy to describe reviewing schedule, clock-out, and paystub knowledge. | The old text claimed “no coaching needed,” even after wrong answers. Three recall questions do not prove independent performance of a shift. |
| L3a — One More Thing | Added a dedicated bilingual email-etiquette Help lesson: check Darnell, answer his apron question, add the location and a short closing in your own words. | This compose task was using generic mail-step Help. The lesson now supports the actual writing task. |
| L3a2 — The Sick Call | Added dedicated bilingual Help covering Maria, inability to attend today's shift, and a short message without symptom details. The tip distinguishes this email scenario from a workplace's own call-out process. | Supports the essential absence notice without suggesting detailed medical disclosure or a universal email rule. |

All new task coaching uses the existing Job Card reporting path.

### What I checked but kept

- Timeclock's “Looks right” button already provides a specific correction through the Job Card.
- Paystub Help already explains gross pay, net pay, and deductions. Keep the current content until the playthrough shows whether learners need more support.
- Swap alternatives already explain why a different day or an early Thursday shift does not solve the problem. The new escalation targets the earlier day-finding step, which had only a general correction.
- Email etiquette and sick-call messages currently accept any nonempty body. This pass improves their Help; it does **not** claim the app checks writing quality or that a teacher receives the text. Whether to add a required-content check needs careful thought: a narrow phrase list can reject valid English or Spanish. Capture actual answers during playtesting before choosing grading rules.
- No extra drag demonstration or onboarding step was added. Test whether the existing explanation and restoration control are enough.

### Automated verification

- Updated the first-session test to follow the four-step tour and close Help through its visible Job Card button.
- Extended the Spanish language test through the complete tour and first-Mail handoff at 1024 × 768, including manually shrinking and restoring the card.
- Added a schedule recovery test: first wrong day → general hint; second wrong day → specific hint; correct Thursday → prefilled swap form and cleared schedule guidance.
- Updated a stale story-coherence assertion to check the five-shift count in both languages without requiring the old phrase “on the floor.”
- `npm run check`: passed — lint, TypeScript, and 774 unit tests across 14 files.
- `npm run test:e2e`: eight cases passed, including both onboarding languages; the new schedule case initially used the wrong button label. After correcting that test selector, the targeted schedule rerun passed. All nine cases have passing results.
- The targeted rerun needed permission to start the local server after the earlier server stopped; it then completed successfully.
- `git diff --check`: passed.

### Marlana's playthrough — things to think about

Use `/studio` → Time machine for individual levels. For the full first-run experience, use a fresh test learner in an incognito window so old introduction flags do not skip the tour.

| Level | Try this | What to notice |
| --- | --- | --- |
| L0 | Play from the desktop through Maria's inbox. Shrink/restore the card and try Help. Repeat in Spanish. | Does each next action feel clear? Does returning from Mail to the Welcome tab for Help feel like going backward? Does the task-list introduction delay or help the first real email? |
| L1 | Open a decoy; try the wrong mail action; choose the wrong attachment, then correct it. | Is the reason understandable? Can you recover without losing useful work? Can a learner explain what Maria asked for after using a starter? |
| L2 | Pick two nonconflicting days, then Thursday. In the form, try an early shift or another day before the late Thursday option. | Does the stronger hint help you compare the times, or simply give away the answer? Is the phone calendar readable beside/below the schedule? |
| L3 | Clock in, choose “Looks right,” then tell Maria you forgot. Open the wrong stub; try gross pay and regular-only hours. Read Help, then finish shift-review. | Does starting the day at 8:15 with a forgotten 7 AM punch make sense? Can you explain the corrected answer? Is the paystub vocabulary too much at once? |
| L3a | Open Help and write a short answer in your own words. Also try an incomplete message. | Should sending require the answer about aprons, or should this stay open practice? Note examples of acceptable wording before we design any validator. |
| L3a2 | Open Help and write a brief absence notice. Try a message that only says “I'm sick.” | Is the essential notice clear without medical details? Should completion require explicitly saying you cannot attend the shift? |

Record exact confusing wording, the action you tried, the language, and what you expected. Those details will make the next revision much more precise than “this felt confusing.”

### Decisions still open

- Resolved in the later drag-practice revision below: learners move the card once, with keyboard movement also supported.
- Should the L1 task-list introduction require opening the list, or is its current acknowledgment enough?
- What should a completed free-text email certify: practicing the send workflow, or including specified content? Current checks support the former much more strongly.
- Does Payday need a vocabulary pause, or does optional Help work in practice?

### Later Act II pass

The review's incident completion/assessment concern, Calendar introduction wording, and spreadsheet email-total validation/catalog mismatch remain open. Incident and handbook are now L3b in Act II; they were listed under Act I in the older review. See [act-1-review.md](act-1-review.md) for those findings.

### Marlana's notes

<!-- Add playthrough observations and decisions here. -->

## 2026-09-05 — Bookmark wording after playthrough feedback

Changed the first tour instruction to “These are your bookmarks. They are shortcuts to websites you use for work.” Spanish: “Estos son tus marcadores. Son accesos directos a sitios web que usas para el trabajo.”

Reason: “app” can suggest an installed phone or desktop program. “Shortcuts to websites” explains what bookmarks do in the browser without introducing that distinction.

## 2026-09-05 — Practice moving the Job Card

Decision: learners should move the card once, rather than visit all four corners.

- Replaced the drag explanation and “Got it” acknowledgment with “Drag this card to another corner.” Spanish: “Arrastra esta tarjeta a otra esquina.”
- The introduction advances only after the card changes corners. Clicking the header, making a small drag that returns to the same corner, or pressing an arrow toward the current edge does not advance it.
- Kept the existing keyboard alternative: focus the card's header and use an arrow key to move to another corner. Its accessible label describes this control. A successful keyboard move also completes the practice.
- After the move, the existing shrink practice begins. When it finishes, the card returns to its usual starting corner so a top-corner practice move does not cover the browser bookmarks. There are still three introduction beats, and no requirement to visit every corner.
- Added browser coverage for an actual drag, a same-corner drop that must not advance, and the Spanish keyboard path.

Why: physically moving the card demonstrates how to uncover something it blocks. One successful move teaches that skill without making positioning the main lesson.

For Marlana's playthrough: is the blue header clearly the part to grab? Can learners discover the keyboard alternative when needed? Does one move feel sufficient before the shrink step?

Verification: `npm run check` passed (lint, TypeScript, 774 unit tests). Seven browser cases passed in the full run; the two onboarding cases exposed the top-left bookmark obstruction. After correcting the post-practice position, both English and Spanish onboarding reruns passed. `git diff --check` passed.

## 2026-09-05 — Plain acknowledgment labels and clearer buttons

- Changed “Got it” to “I understand” in the tour, task-list introduction, and Act I Help labels. The tour and task-list Spanish acknowledgment now reads “Entiendo.” Help retains “Back to my task” so the button also describes what happens.
- Made the Job Card's primary and Help buttons more visibly pressable with a subtle lower shadow, a defined edge, slightly squarer corners, and hover/pressed states. Kept the large click area and added a clear keyboard-focus outline. Equal-choice primary buttons receive the same styling.
- Reduced-motion preferences disable the new transitions.

Why: Marlana prefers a literal acknowledgment for English learners, and the large flat button needed a clearer button shape.

Playtest: does “I understand” feel clear? Does the button now look clickable without pulling attention away from the instruction?

Verification: `npm run check` passed (lint, TypeScript, 774 unit tests); all nine browser tests passed, including English and Spanish onboarding. `git diff --check` passed.

## 2026-09-05 — Bottom-bar task-list introduction

- Changed the instruction to “This orange button on the bottom bar opens your task list.” Spanish: “Este botón naranja en la barra de abajo abre tu lista de tareas.”
- Removed the shelf button's separate animated ring. The introduction now draws one steady orange border around the button, using the same element for the surrounding dimming.
- Kept that border at least 4 pixels inside every viewport edge, so its bottom cannot be cut off.
- Added browser assertions for one outline, its viewport bounds, and the absence of a second shelf pulse.

Why: “bottom bar” identifies the location, “opens your task list” explains the result, and one complete outline is easier to follow than two competing rings.

Verification: lint, TypeScript, and 774 unit tests passed. All six first-session browser tests passed, including both languages and the highlight bounds check. Inspected the captured highlight screenshot; one complete border is visible above the bottom edge.

## 2026-09-05 — Clarify the remaining task is for today

Changed the welcome-email completion message to “Message sent. One more task for today.” Spanish: “Mensaje enviado. Queda una tarea más por hoy.” Updated the shared one-task-left fallback to use the same daily scope. The button still says “Next task.”

Why: “One task left” could sound like the whole program is almost finished. Naming today makes the stopping point clear.

## 2026-09-05 — Explain the purpose before the walkthrough

Added the approved welcome before the desktop and Job Card introduction, in English and Spanish. It explains safe practice, five story days in the first role, working at your own pace, points/awards and progression, and five practical skill goals. Includes Marlie's clickable email address and “Show me how it works.”

The welcome has its own language switch and a responsive, scrollable layout. It is the only surface shown until the learner continues; the existing Job Card introduction then begins. A learner-specific story flag remembers dismissal on this device. Learners with completed tasks or a completed Job Card introduction bypass it. Studio's fresh-account reset clears the story flags so it can be replayed.

Why: learners should understand what the simulator is for before learning its controls. This explains the program without adding another instruction voice during tasks.

For Marlana: try a fresh test learner. Does this give enough motivation before the tour? Is the amount of reading comfortable, especially in Spanish? The five days are story days, not a requirement to attend on five calendar days.

Verification: `npm run check` passed (lint, TypeScript, 774 unit tests). All 10 browser tests passed. Inspected the English layout at 1024px and Spanish layout at 390px; no clipped text or controls. Language switching, dismissal persistence, and the existing walkthrough handoff are covered.

## 2026-09-05 — Name the personal calendar on the phone

The schedule task asked learners to compare shifts to “your own calendar,” but the phone beside the schedule only said “Calendar” / “Your phone.” That link was easy to miss.

- Job Card: “Compare next week's shifts to the personal calendar on your phone. Find the day that is at the same time as something you already have.”
- Phone heading: “My Calendar.” Caption under the phone: “Your personal calendar.”
- Desktop dispatch, first wrong-day hint, Help, and the unused event intro now name the phone in both languages.

Why: the skill is comparing work to life. Learners need to know the phone graphic is their personal calendar, not a decoration or a second work schedule.

The phone now stays on the swap form too, so learners can still see the 11 AM appointment when they pick a replacement shift. The Job Card there says: “Look at the personal calendar on your phone. Pick a shift that starts after your appointment.”

## 2026-09-05 — Day 3 starts with a forgotten clock-in

Payday used to open at the end of the shift, with Clock Out. That felt backwards for the start of Day 3.

- The time clock now starts not punched in. It is 8:15 AM. The scheduled shift is 7:00 AM – 3:00 PM.
- After Clock In, the card compares “You arrived 7:00 AM” with “Clock-in time 8:15 AM.”
- “Looks right” points at that gap. The mail subject is “I forgot to clock in at 7.”
- Maria’s handoff after the swap now says to clock in in the morning and check the time. Her reply is at 8:22 AM.
- Shift-review asks about arriving and clocking in, not leaving.

Why: forgetting to punch in is a real morning mistake. Starting Day 3 with clock-out was a story problem, not a skill problem.
