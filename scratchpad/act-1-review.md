# Act I: New Hire — Review

Dev server running at [http://localhost:3000](http://localhost:3000). Play alongside this and drop notes in **Marlana's feedback**.

---

## 1. L0 — How This Works

**Task:** tour — find bookmarks, Mail, Calendar, and the ? help

### What's working

- Genuinely minimal: 6 steps, mostly single clicks
- Teaches the *interface* first (bookmarks instead of a URL bar, the help `?`) before any task-logic — right order for someone who's never used a browser-like UI
- "You cannot break anything" in the welcome copy is a nice anxiety-reducer

### Concerns / could be better

- Tour points at Mail and Calendar, but Act I's first task is Mail only
- Calendar doesn't get used until Act II (level 4)
- Tour spends a step on a bookmark the learner won't touch again for 3 levels — minor risk they forget it means anything by then

### Suggested change

- Cut the Calendar step from the tour, **or** move it later (e.g. a 1-step "remember Calendar?" beat right before level 4 opens it for real)
- Keep the tour tightly matched to what's used in the next hour of play

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

## 4. L2 — Settling In

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
- Add a "stuck" escalation: if they open the swap picker and choose wrong twice, the RightNowBar hint gets more explicit (e.g. "Look at Thursday specifically")
- Preserves the challenge while giving low-confidence learners a way out instead of a wall

### Marlana's feedback


---

## 5. L2 — Settling In

**Task:** timeclock — clock out, notice hours are short (8:02 start vs 7:00 scheduled), message supervisor

### What's working

- Quiet-numeracy check: today's total (6h58m) vs scheduled (8h) — learner has to notice the mismatch with no red banner doing it for them
- Mirrors the schedule task's "you have to look" philosophy consistently
- Sentence starters again lower the writing barrier

### Concerns / could be better

- Only one path is graded (send the "something's off" message)
- "Looks right" as a wrong answer isn't explored — unclear what happens if a learner clicks it
- Does it just re-show the question, or is there no wrong-hint at all (unlike the others, which have explicit wrongHint copy)?
- Worth checking live

### Suggested change

- Verify live first
- If "Looks right" has no wrongHint, add one (`WRONG_LOOKS_RIGHT_HINT` already exists in the file — confirm it's actually wired to that button)
- Every other task in Act I gives a specific wrong-answer hint; this one should match

### Marlana's feedback


---

## 6. L2 — Settling In

**Task:** paystub — open Alex Chen's stub (not Sam's/Priya's), read gross vs. net, confirm hours

### What's working

- Realistic PDF-reader flow instead of an in-app fake table — reinforces "this opens like a real downloaded file"
- Gross-vs-net and overtime-hours are the two most common real paystub confusions
- Both wrong answers target that confusion directly ($1,005 gross vs $863.30 net; regular-only vs regular+OT)

### Concerns / could be better

- Densest task in Act I: 3 sub-steps (open right stub → net pay question → hours question)
- Plus new vocab (gross, net, deductions, overtime) in a level that's otherwise 1-step tasks
- Might be the actual difficulty spike of Act I — more than the schedule task

### Suggested change

- Don't cut content
- Consider whether the vocab (gross / net / deductions) gets its own beat in the 2-minute lesson *before* the questions, rather than only inside the wrong-answer hints
- Right now a learner who guesses right on both questions never sees the words explained

### Marlana's feedback


---

## 7. L3 — When Something Happens

**Task:** incident — write up a customer slip in order, submit to shift lead

### What's working

- Open-ended writing task with real scaffolding (sentence starters covering what / injury / action-taken / notification) rather than multiple choice
- Good variety after 5 straight click-and-pick tasks
- Framing ("no one right way to say it, clear and in order is what matters") removes perfectionism pressure

### Concerns / could be better

- Teacher-graded, not app-graded — no pass/fail check in the code; it just submits
- Fine pedagogically, but worth confirming the UI actually tells the learner "this goes to your teacher"
- Risk: they think they passed or failed a task the app never checked

### Suggested change

- Verify live
- If the done-screen doesn't already say something like "your teacher will read this," add one line making that explicit
- Badge/checkmark language elsewhere reads like a pass, so this task needs to visibly break that pattern

### Marlana's feedback


---

## 8. L3 — When Something Happens

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
> - Every Act I task ends on a "done" screen with a *why this mattered* sentence
> - Example: "Catching that yourself... is what keeps a clash from turning into a missed shift"
> - Consistently bilingual, consistently short
> - Worth naming: it's the connective tissue across all 8 — quiet spaced-repetition of the *reason*, not just the mechanic

> [!question] Biggest open question
> - Tasks 4–6 (schedule, timeclock, paystub) all withhold a visual "something's wrong here" cue
> - Learner has to notice a mismatch unaided
> - Consistent design — but that's 3 tasks in a row with no highlighting
> - Right amount of difficulty stacking for Level 2, or should at least one of the three have a lighter touch?

---

# Act II: Shift Lead — Review

Same cast, new job title. Act II hands over lead tools: Calendar, Drive, Sheets. 5 levels, 7 tasks.

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
- Repetition is good for retention, but by level 9 it may read as same puzzle, new skin rather than a new challenge
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

- None significant on the base version
- Rename convention is typed free-text with no visible format example on-screen at time of typing
- Hint text has it — worth confirming during play that it's visible, not buried behind a help tap

### Suggested change

- Verify live that `renameHint` ("Format: schedule-week-of-aug-24") is visible on-screen while typing, not just reachable via help
- If it's only in help, surface it as inline placeholder / subtext by default
- This is exactly the kind of format-recall task where an example should never be hidden

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

- Lesson text says "flag one that's wrong" (per the catalog's skill description)
- No row in `TIP_ROWS` marked as intentionally wrong, nor a decoy slip
- Actual content only has the learner transcribe 5 correct numbers
- Worth checking live whether a "spot the error" step exists in the UI that isn't in this content file
- As read, the catalog's stated skill ("flag one that's wrong") doesn't match what the data supports

### Suggested change

- Verify live first — could be a stale catalog description rather than a missing feature
- If confirmed missing, either:
  - Add one intentionally-wrong tip slip that should NOT be transcribed as-is (mirrors the paystub task's "which stub" pattern), **or**
  - Fix `curriculum-catalog.ts`'s skill text to drop "flag one that's wrong" so the description matches what's actually taught

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
- Teacher-graded (free-text formula + free-text email), consistent with the "authored content" pattern from Act I's incident report

### Concerns / could be better

- `CC_PICKS` includes Alex and Sam as wrong cc options with `ok: false`
- No wrongHint surfaced anywhere in this content file for picking them
- Worth checking in the live UI whether choosing the wrong cc gives feedback or just silently fails to complete the task

### Suggested change

- Verify live
- If wrong cc picks silently fail rather than explaining why, add a short hint ("Alex doesn't need this number — Jordan is the co-lead who does")
- Cc lesson should have the same wrong-answer teaching pattern as every other multiple-choice moment in the game

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

> [!note] Act II cross-cutting notes
> - Acts I and II share the same "done screen names why it mattered" pattern — consistency holds up
> - Task 9 (calendar) risks feeling repetitive coming right after Act I's 3 unaided-noticing tasks (schedule / timeclock / paystub) — that's now 4 tasks in a row testing "compare two lists / notice a mismatch"
> - Task 10 (files) is where the difficulty actually escalates with new sub-skills, so the ordering front-loads sameness before the real step-up
> - Two spots to verify live rather than just from source:
>   - Task 12's "flag one that's wrong" (spreadsheet) skill description doesn't seem to match the data
>   - Task 14's wrong-cc options (`CC_PICKS`) don't show an obvious wrongHint path in this file
