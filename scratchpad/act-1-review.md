# Act I: New Hire — Review

Updated 2026-09-05 against the current source. This is a code/content review, not a new live playtest; earlier live-verification notes below are historical. Drop playtest notes in **Marlana's feedback**.

**Updated opinion:** Level 0 is stronger now. Introducing the Job Card on the desktop, then using it to open the browser, teaches the actual navigation loop. Keep the four-step browser tour. The next priority is making sure learners can recover after shrinking the card and reach their first real email without confusion—not adding more introductory content.

**Implementation follow-up (2026-09-05):** Act I changes and remaining playtest questions are tracked in [codex_revisions.md](codex_revisions.md). Findings below describe the review baseline; the revision log records what has since been addressed.

**Scope:** This file covers Acts I–II. The current map has 13 levels: Act I is L0, L1, L2, L3, L3a, L3a2; Act II is L3b, L3c, L4–L8. The numbered task reviews are retained for continuity; the level-by-level sections at the end cover every current level, including tasks missing from the original review. Source of truth: `src/lib/tracks-content.ts` (`ACTS`, `LEVELS`, `TRACKS`).

---

## 1. L0 — How This Works

**Task:** tour — desktop Job Card introduction, then bookmarks → Mail → work-email explanation → Help; a task-list introduction follows at the start of L1.

### What's working

- The desktop comes first. The learner meets one instruction surface and uses its button to open the browser; this teaches the same loop later jobs use (`DesktopClient.tsx`, `job-card-content.ts`).
- The browser walkthrough is four steps in both languages. Calendar is removed, so everything introduced has an immediate use (`tasks/tour/content.ts`).
- Ringing the whole bookmarks row before narrowing to Mail gives the word “bookmarks” a visible referent. That fixes the old abstract “show me” beat.
- Shrinking the card requires a real arrow click. Opening Mail and Help also require interaction; the tour includes practice rather than only acknowledgments.
- “You cannot break anything” remains useful reassurance. The Help lesson now uses clearer wording about this card and shrinking it.

### Concerns / could be better

- Four steps describes only the browser walkthrough. There are also three desktop introduction beats, the Help close/finish transition, and the L1 task-list introduction. Judge the complete onboarding by how easily someone reaches Maria's email, not the walkthrough count.
- Dragging is described but not required. That is reasonable for pacing, but clicking “Got it” does not demonstrate the learner can move an obstructing card.
- “Tap the ? ... if you get lost” sounds optional even though clicking it is required to advance this tour step. Make the practice instruction direct: “Tap the ? to try Help.” Keep the reassurance in the lesson, in both languages.
- The final Help step returns from Mail to the tour tab. Closing Help, finishing, and meeting the task list introduce several transitions before the first real job; check whether learners understand where they landed.
- The English and Spanish `TOUR_COPY.doneBody` differ materially: English says to return to the desktop; Spanish still lists the white desktop button, briefcase, and blue next button. These are not equivalent instructions.
- `e2e/first-session.spec.ts` still expects the old first-step wording and the removed Calendar beats. This is a confirmed stale test, not evidence that the current walkthrough fails for learners. The historical verification notes below do not establish that today's e2e suite passes.

### Suggested change

- Keep the current sequence and the Calendar introduction at its point of use.
- Prioritize updating the stale e2e expectations and aligning the bilingual completion copy; then make the required Help action explicit.
- Playtest the full desktop → tour → Help → first-email handoff, including shrinking/restoring the card, small screens, and Spanish. Keep every recovery instruction in the Job Card.

### Fixed (2026-09-04)

- L0 tour trimmed from 6 to 4 steps — Calendar removed, tour now ends bookmarks → click Mail → "this is your work email" → tap `?` help
- Added a 1-step spotlight at the start of Level 4: rings the Calendar bookmark once, gated on a `calendar-reminder-seen` story flag so it never repeats
- Note: the ring has no accompanying text — Act II's Job Card always shows the task's own goal line ("Handle a meeting invite"), not a reported step's line, so the spotlight ring alone is the callback
- Verified live via Playwright: tour is 4 steps with no Calendar step; L4 ring appears once, dismisses on click, and does not reappear after reload

### Fixed, round 2 (2026-09-04) — reading level + bookmark intro

- Step 1 rewritten: was a no-op "show me the bookmarks" with nothing actually shown (a plain dim screen, no ring); now reads "These are your bookmarks. Each one opens an app you use for work." and rings the **whole bookmarks row** before narrowing to Mail — added `data-testid="bookmarks-row"` and a `ringOnLook` opt-in on `TourStep` since look beats previously never rendered a ring at all (`TourWalkthrough.tsx`)
- Help drawer "Where to look" lesson: "The blue card" → "This blue card" (avoids implying there's more than one); "Card in the way? ... hide it" → "... shrink it" (matches the collapse-button wording used elsewhere); tip "The card is always current. When in doubt, read it." → "This card always tells you what to do next. Read it if you are not sure." (plain, direct, no idiom)
- Verified live: ring now actually appears on step 1, all four steps read correctly end to end, Help drawer copy confirmed on screen

### Marlana's feedback


---

## 2. L1 — Day One

**Task:** mail (reply) — read Maria's welcome, send a thank-you

### What's working

- Good real-inbox simulation: 7 decoy emails (HR, IT, vendor, ad, coworker), all dated/labeled plausibly
- Each decoy has a *specific* wrong-click hint rather than a generic "nope"
- Sentence starters give a scaffolded on-ramp for someone who freezes at a blank compose box

### Concerns / could be better

- Pure "reply to say thanks" — lowest possible stakes
- No real concern; just flagging it's intentionally trivial (good as lesson 1)

### Suggested change

- No change — leave as-is
- Low stakes is correct for task 1

### Marlana's feedback


---

## 3. L1 — Day One

**Task:** mail (attach) — confirm what Maria needs via comprehension check, then reply + attach the right file

### What's working

- Comprehension check ("What does Maria need?") *before* the reply — catches learners who'd otherwise attach blind
- File picker has 3 near-miss decoys (photo, wrong form, wrong month)
- Hints name the actual distinguishing feature ("that one is June, she asked for July")

### Concerns / could be better

- Done-screen line "In a real job, most asks from a manager look like this" repeats almost verbatim in the MAIL_COPY fallback strings
- Sign of copy that's been duplicated rather than shared
- Not learner-facing, but worth a cleanup pass eventually

### Suggested change

- Low priority: dedupe the two copies of that line into one shared constant next time this file is touched
- Not worth a special pass on its own

### Marlana's feedback


---

## 4. L2 — The First Week

**Task:** schedule — spot the shift that conflicts with a personal calendar event, request the correct swap

### What's working

- Good real-world skill: matching two separate lists (work schedule vs. personal calendar) instead of a flagged/highlighted conflict
- Wrong swap options are plausible near-misses (right day wrong time, wrong day entirely) — not throwaway distractors

### Concerns / could be better

- Row never visually flags `conflict: true` (comment literally says "never shown as a warning on the row")
- Success depends entirely on the learner cross-referencing two lists correctly
- That's the intended difficulty, but for a low-literacy / low-confidence learner with no scaffolding hint if they're stuck, this could be the first real "wall" in Act I
- Worth watching in playtest

### Suggested change

- Keep it unflagged on first attempt (that's the actual skill)
- Add a "stuck" escalation: if they open the swap picker and choose wrong twice, the Job Card hint gets more explicit (e.g. "Look at Thursday specifically")
- Preserves the challenge while giving low-confidence learners a way out instead of a wall

### Marlana's feedback


---

## 5. L3 — Payday

**Task:** timeclock — clock out, notice hours are short (8:02 start vs 7:00 scheduled), message supervisor

### What's working

- Quiet-numeracy check: today's total (6h58m) vs scheduled (8h) — learner has to notice the mismatch with no red banner doing it for them
- Mirrors the schedule task's "you have to look" philosophy consistently
- Sentence starters again lower the writing barrier

### Concerns / could be better

- Resolved in source: the “Looks right” button calls `looksRight()`, which sends `WRONG_LOOKS_RIGHT_HINT[lang]` through the existing feedback path (`TimeclockTask.tsx`). It is not a silent wrong answer.
- The remaining question is whether the learner understands the start-time discrepancy after reading that correction.

### Suggested change

- No new wrong-answer handler needed. During playtesting, deliberately choose “Looks right” and check that the correction is visible and understandable in the Job Card.

### Marlana's feedback


---

## 6. L3 — Payday

**Task:** paystub — open Alex Chen's stub (not Sam's/Priya's), read gross vs. net, confirm hours

### What's working

- Realistic PDF-reader flow instead of an in-app fake table — reinforces "this opens like a real downloaded file"
- Gross-vs-net and overtime-hours are the two most common real paystub confusions
- Both wrong answers target that confusion directly ($1,005 gross vs $863.30 net; regular-only vs regular+OT)

### Concerns / could be better

- Still a likely difficulty spike: selecting the person, reading the stub, and answering two questions combines navigation, vocabulary, and numeracy.
- Correction to the old review: the Help lessons already explain gross pay, net pay, and deductions, and the net-pay step defines it as the amount reaching the bank. The issue is whether learners notice/use the available explanation, not missing vocabulary content.

### Suggested change

- Keep the content. Watch whether learners can explain their net-pay answer; if they guess, use a brief Job Card prompt or existing Help lesson rather than adding another instruction surface.

### Marlana's feedback


---

## 7. L3b — When Something Happens (Act II)

**Task:** incident — write up a customer slip in order, submit to shift lead

### What's working

- Open-ended writing task with real scaffolding (sentence starters covering what / injury / action-taken / notification) rather than multiple choice
- Good variety alongside the earlier email writing and numeric tasks
- Framing ("no one right way to say it, clear and in order is what matters") removes perfectionism pressure

### Concerns / could be better

- The component checks nonempty time/place and at least 15 characters of narrative, then marks the task complete. It does not assess chronology or factual completeness (`IncidentTask.tsx`).
- The old “teacher-graded” claim was too strong: this submit handler does not send the written report to a teacher. Completion copy nevertheless says the lead has what happened “in order.” A completion badge is stronger evidence than the check supports.

### Suggested change

- Distinguish “submitted/completed the practice” from “the report is accurate.” Do not promise teacher review unless a real submission/review path exists. Check that learners include what happened and what they did, without forcing one exact phrasing.

### Marlana's feedback


---

## 8. L3b — When Something Happens (Act II)

**Task:** handbook — look up sick-call-out policy under a "Jordan needs an answer now" prompt

### What's working

- Simulates a real skill often skipped in curricula: search/scan a reference doc under mild time pressure instead of being told the answer
- Wrong options are plausible policy-adjacent numbers (30 min = meal break length, not callout window) rather than random distractors
- Teaches "read the whole thing," not "guess among these three"

### Concerns / could be better

- None significant — clean, well-scoped task

### Suggested change

- No change

### Marlana's feedback


---

> [!note] Cross-cutting pattern
> - The original eight task reviews share a "done" screen with a *why this mattered* sentence
> - Example: "Catching that yourself... is what keeps a clash from turning into a missed shift"
> - Generally short and bilingual; L0 completion copy needs alignment between languages
> - Worth naming: it's the connective tissue across all 8 — quiet spaced-repetition of the *reason*, not just the mechanic

> [!question] Updated pacing question
> - Schedule is now L2; timeclock, paystub, and shift-review form L3. The original “three tasks in Level 2” concern no longer describes the level map.
> - Payday still combines discrepancy checking, pay vocabulary, and recall. Watch whether shift-review shows understanding or only recognition of the correct option.

---

# Act II: Shift Lead — Review

Same cast, new job title. Current Act II has 7 levels and 10 tasks: incident/handbook (L3b, reviewed above), account recovery (L3c), then Calendar, Drive, and Sheets (L4–L8).

---

## 9. L4 — The Calendar

**Task:** calendar — spot a meeting invite on a day off, propose a new time

### What's working

- Directly reuses the "cross-reference two calendars" skill from Act I's schedule task
- Adds a step of *acting* on it (propose, not just flag)
- Only 2 time options rather than free-text time — keeps it low-friction for the reading/writing level

### Concerns / could be better

- Third time the exact same underlying skill appears: "check X against your schedule before agreeing"
  - Act I schedule
  - Act I timeclock hours-check
  - Now this
- Repetition is good for retention, but at this review's task 9 it may read as same puzzle, new skin rather than a new challenge
- Worth deciding if that's intentional scaffolding or just needs a genuinely new wrinkle

### Suggested change

- Keep it as the "same skill, new tool" bridge into Act II (the lesson text already says this explicitly, which helps)
- Make sure task 15 (triage) is the one that finally does something new with it — not a 4th repeat
- If task 15 also just re-tests the same noticing skill, add a genuinely new wrinkle there instead of here

### Marlana's feedback


---

## 10. L5 — Shared Files

**Task:** files — find the right week's schedule, rename it to convention, share view-only with Jordan

### What's working

- Best-designed task so far
- 3 sequential sub-skills that map to 3 distinct real Drive mistakes:
  1. Find the right file among near-duplicates
  2. Rename to a stated convention
  3. Set permission correctly
- "Messy mode" variant (draft / copy / next-week duplicates) is a nice difficulty dial for later replay
- `normalizeRename()` forgiving case / spacing / `.pdf` is a genuinely good UX call — grades the *intent*, not exact keystrokes

### Concerns / could be better

- Resolved in source: `FilesTask.tsx` renders `c.renameHint` immediately above the rename input. The format example is already available while typing. Visual readability still needs a playtest.

### Suggested change

- Keep the inline example. Test whether learners distinguish finding the correct file from renaming it, then understand why Jordan gets view-only access.

### Marlana's feedback


---

## 11. L5 — Shared Files

**Task:** mail-send-link (reused mail content)

### What's working

- Good continuity — same inbox shell as Act I, now compose-only
- Tests "link not attachment" right after the task that produced the link
- `sendsLinkNotFile()` validation is lenient by design (checks for link-language + file-name-language, rejects "attached")
- Fits a free-text grading task aimed at non-fluent writers

### Concerns / could be better

- Same underlying mail app / content file as Act I mail tasks
- Good reuse, no new concern — just noting it's not a new build

### Suggested change

- No change — good reuse, exactly what should happen

### Marlana's feedback


---

## 12. L6 — The Numbers

**Task:** spreadsheet — enter 5 tip amounts, read the auto-summed total, email it

### What's working

- Clean single-skill task: data entry → trust the tool's math → report the result in one sentence
- Good pacing after the 3-skill files task
- `WRONG_ENTRY_HINT` exists for a mismatched entry — nice small catch

### Concerns / could be better

- Confirmed source mismatch: `curriculum-catalog.ts` says “flag one that's wrong,” but the component checks the learner's transcription against five supplied amounts. There is no deliberate bad-source-slip step in the current flow.
- More consequential: `SpreadsheetTask.tsx` only checks that the email body is nonempty. A learner can omit or misstate the total and still complete the job.

### Suggested change

- Align the catalog description with the current data-entry skill; do not add another puzzle just to satisfy stale copy.
- Add a forgiving check that the message reports the correct total, following the existing status-report pattern. Accept natural wording in both languages and explain a missing or incorrect total through the Job Card.

### Marlana's feedback


---

## 13. L7 — Reporting In

**Task:** make-a-copy — open a view-only template, File → Make a copy instead of trying to edit it

### What's working

- Teaches a genuinely load-bearing real-world Google Workspace behavior (view-only templates are everywhere at real jobs) that a lot of people never learn explicitly
- Three parallel wrong-path hints (typing directly, sharing, downloading) each redirect to the correct action rather than just saying "no"
- Good use of decoys as teaching moments, not just error states

### Concerns / could be better

- None significant — tightly scoped, one clear skill

### Suggested change

- No change

### Marlana's feedback


---

## 14. L7 — Reporting In

**Task:** status-report — write `=SUM()` in your own copy, cc a co-lead, mention the total in the email body

### What's working

- First task that has the learner actually *author* a formula rather than just read one
- Appropriately sequenced right after make-a-copy, so the "this is your editable copy" context is fresh
- Cc vs. To vs. Reply-all distinction gets its own explicit lesson line — worth doing, common real confusion
- App checks the SUM formula, Cc recipient, and whether the email mentions the total (`StatusReportTask.tsx`); this is more validation than the original review credited

### Concerns / could be better

- Resolved in source: wrong Cc selections call `say(HINTS[lang].cc)` immediately, and sending also checks the Cc address. This is not a silent failure.
- Passing those checks demonstrates the required mechanics, not the quality of the entire written report. Avoid describing it as teacher-graded without evidence of teacher review.

### Suggested change

- Keep the current wrong-Cc feedback. Focus playtesting on valid SUM variants, understanding the selected range, and including the total in a meaningful message.

### Marlana's feedback


---

## 15. L8 — Covering More Ground

**Task:** triage — a calendar conflict and a file-share request land at once; handle both, either order

### What's working

- Strong capstone for Act II — doesn't teach a new skill, makes you apply two earlier ones back-to-back:
  - Calendar-conflict skill (task 9)
  - File-share skill (task 10)
- "Two things waiting" framing is a realistic shift-lead moment
- "You choose the order, the only real mistake is forgetting one" is exactly the right instruction — validates order-independence explicitly instead of silently expecting a specific sequence

### Concerns / could be better

- None significant — well-built synthesis task and a good place to end the act

### Suggested change

- No change — good place to end the act

### Marlana's feedback


---

> [!note] Updated Act II cross-cutting notes
> - Calendar is a reasonable transfer task: a familiar comparison in a new tool. It does not directly follow three mismatch tasks; email etiquette, sick-call practice, incident/handbook, and account recovery intervene.
> - The larger difficulty changes are the three-part files task and authoring a formula/report. Give those more playtest attention than the repetition alone.
> - Source resolves the old rename-example and wrong-Cc questions. The spreadsheet catalog still promises “flag one that's wrong,” while the implementation checks transcription rather than a deliberately incorrect source slip.

---

# Things that can go wrong — every current level in Acts I–II

These are learner mistakes and product risks to test, not a claim that every risk is a reproduced bug. Each section names the recovery or observation worth checking. Keep coaching in the Job Card. Level keys match `tracks-content.ts`; lettered levels are intentional.

## L0 — How this works

- **Losing the instruction:** after shrinking the card, a learner may not know how to restore it or may mistake a locked shelf control for a broken app. Check recovery before adding more tour content.
- **Following the ring without understanding:** a learner can click Mail but still not know bookmarks open apps. Ask them to find Mail again after the tour.
- **Stopping at Help:** the conditional wording can make a required click sound optional; returning to the tour tab can look like going backward. Check the Help close/finish handoff.
- **Regression risk:** stale e2e Calendar expectations and mismatched English/Spanish completion text are confirmed source issues. Update both before relying on this as a verified onboarding flow.

## L1 — Day One (`mail-reply`, `mail-attach`)

- **Wrong message or action:** learners may open a decoy, compose a new email, or Forward instead of Reply. Check that the correction names the intended sender/action and preserves their ability to retry.
- **Incomplete attachment workflow:** a learner may pass the comprehension question but select June instead of July, pick a photo, or send without the file. Verify the attachment can be inspected and corrected.
- **Scaffold dependence:** clicking a sentence starter can look like composing a response without understanding it. Ask what the reply says and which file Maria requested.

## L2 — The First Week (`schedule`)

- **Comparing only dates:** a learner can pick the right day but the wrong time, or confuse a personal appointment with the work shift. Keep the initial comparison unflagged; use increasingly specific Job Card help when stuck.
- **Repeated guessing:** if a learner cycles through swap options, eventual success is weak evidence of understanding. Ask them to point to the two conflicting entries.
- **Losing context in the picker:** check that they can return to the schedule without losing their place and that both lists remain readable on a small screen.

## L3 — Payday (`timeclock`, `paystub`, `shift-review`)

- **Trusting the recorded hours:** “Looks right” may be chosen because the clock generated the number. The correction is wired; check whether it helps the learner find the 8:02 versus 7:00 discrepancy.
- **Reading the wrong number/person:** Sam's stub, gross pay, and regular-only hours are plausible mistakes. Confirm wrong answers lead back to the relevant label rather than repeated guessing.
- **Vocabulary overload:** net/gross/deductions explanations exist in Help. Check that learners can use them while keeping their place in the paystub task.
- **Recall mistaken for performance:** shift-review is three choice questions, not another real clock-out or paystub operation. It is useful retrieval practice; it does not by itself demonstrate independent tool use.

## L3a — One More Thing (`mail-etiquette`)

- **Writing without a clear request:** the learner may include a greeting and closing but omit the purpose, or address the wrong person. Test whether the task rewards a useful message rather than just recognizable email parts.
- **Rejecting a valid voice:** concise or differently phrased English/Spanish can still be professional. Include natural alternate answers when checking grading behavior.
- **Copying without transfer:** starters are helpful, but ask the learner to explain who the message is for and what they need from that person.

## L3a2 — The Sick Call (`call-out-sick`)

- **Missing the essential notice:** a learner may say they are sick without clearly saying they cannot attend today's shift, or write to a coworker instead of Maria. Check recovery for each omission.
- **Assuming email guarantees notice:** this scenario practices contacting Maria before the shift; avoid implying that the same channel or notice rule applies at every workplace.
- **Too much personal detail:** learners may think a good message requires a detailed medical explanation. Review whether the scaffolding supports a short, relevant absence message.

## L3b — When Something Happens (`incident`, `handbook`) — Act II

- **Completion mistaken for quality:** the incident check accepts a sufficiently long narrative without checking order or facts. The current done copy can overstate what was demonstrated; do not promise teacher review without a real review path.
- **Guessing policy numbers:** a learner may choose a break-length number instead of the callout window. Ask them to show the policy passage supporting their answer.
- **Reading pressure:** the urgent scenario may encourage guessing or make learners rush the report. Check that Help and corrections let them slow down without implying failure.

## L3c — Locked Out (`account-recovery`)

- **Mixing up credentials:** learners may confuse their classroom PIN, the simulated work password, and the six-digit verification code. Check that the current step makes the distinction clear.
- **Picking the wrong text:** the ad and coworker's message are intentional distractors. A successful retry should come from recognizing the sender and code, not memorizing the option position.
- **Poor transfer from a fixed code:** the simulation uses a fixed code. Check whether learners understand finding the code in the message rather than remembering these six digits.

## L4 — The Calendar (`calendar`)

- **Accepting before checking availability:** learners may see an invitation as an instruction they must accept. Ask them to compare the invite with their day off before choosing a response.
- **Confusing a proposal with acceptance:** check whether they understand what proposing a new time communicates.
- **Unexplained spotlight:** the Calendar ring has no rendered reminder text in this flow. Since L0 no longer introduces Calendar, treat this as its first introduction, not a memory test; check whether the Job Card goal gives enough context.

## L5 — Shared Files (`files`, `mail-send-link`)

- **Correct-looking wrong file:** draft/copy/next-week names can be confused. Verify learners inspect date/version before renaming, especially in messy mode.
- **Format versus intent:** the rename example is visible and normalization is forgiving. Check natural spacing/case variations and whether the learner understands why a shared convention helps.
- **Too much access:** choosing edit instead of view is the consequential sharing error. Ask why Jordan only needs view access.
- **Link and access treated as the same thing:** learners can describe a link without understanding that the recipient also needs permission. Ask them to explain both steps after sending the message.

## L6 — The Numbers (`spreadsheet`)

- **Plausible wrong total:** a misplaced decimal or wrong row can still produce a realistic sum. The entry check catches mismatches; check whether its feedback helps locate the error.
- **Unsupported catalog promise:** no deliberate bad source slip is present in this flow. Align “flag one that's wrong” with transcription checking, or deliberately design that additional skill.
- **Sending without reporting the total:** confirmed in `SpreadsheetTask.tsx`: `trySend()` only requires a nonempty body. A message that omits or misstates the total can complete the task. This is a stronger concern than the catalog wording because reporting the number is part of the stated job.

## L7 — Reporting In (`make-a-copy`, `status-report`)

- **Editing the template:** learners may try typing, sharing, or downloading instead of making a copy. Verify the wrong-path hints help them understand why a copy is needed.
- **Formula syntax without range understanding:** a learner can copy SUM without understanding which cells it adds. Check their explanation of the range as well as the accepted formula.
- **Wrong audience or missing number:** wrong Cc feedback is wired, and sending checks Cc and the total. Exercise these paths with readable alternate messages in both languages.
- **Assuming full assessment:** these checks validate particular requirements, not every claim in the report. Keep completion language proportional to what is checked.

## L8 — Covering More Ground (`triage`)

- **Forgetting the second job:** the learner may finish the calendar request and assume the whole task is done. Check that the Job Card preserves the remaining obligation.
- **Losing progress while switching:** test both orders and switching midway through a request, not just completing each in one sitting.
- **Searching for a hidden preferred order:** the content permits either order. Verify progress and completion really support both, and ask learners how they knew both requests were finished.
