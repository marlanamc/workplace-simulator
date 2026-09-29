# Act I fix-up plan (after the Wave 5 re-audit)

Scope: How this works, the Night Before, and Days 2–6 (`level0`–`level3a3`). Source: the Wave 5 Segment A report (25 findings, F-1 to F-25), plus the shared causes Segments B–F found.

**Working rule (owner, 29 Sep):** one act at a time, slowly. Act II does not start until the owner signs off on Act I.

## Owner decisions (29 Sep)
- **Job Card at small sizes:** below about 1100 px wide, the card docks as a fixed side strip and the app window narrows beside it, so nothing is ever under it. Above that width it floats as now.
- **Language is saved per learner** (a database field), not per device.
- **Pay stub stays in English**, as real US stubs are. The Spanish card line and Help add the English words: "pago neto (Net pay)".
- **Build on current main**, including 8ae6aca.

## Phase 1: shared causes, verified on Act I
1. **Job Card layout.**
   - Fix the runaway scroll gutter (F-2, F-25).
   - Dock the card at small widths (F-3, F-16, F-17). The Show me spotlight and the card-overlap e2e are updated to match.
2. **Only the owning task may say "Done".** An app with no active task shows its home, and the card keeps today's job (F-9, F-22). This is the same cause as B-4, C5 and D-F1.
3. **Reload keeps work.** Every Act I task keeps its current step and typed text in `useTaskDraft` (F-7, F-23).
4. **Writing checks on `src/lib/grading/meaning.ts`.**
   - Day 2's text reply accepts an accented "sí" and needs Thursday or 2 PM (F-1).
   - Every Act I check gets tests meant to break it: accents, negation, misspellings, and plausible wrong answers.

## Phase 2: Act I specifics
- **Card lines match the moment (F-4, F-5, F-10):**
  - Show me points at the empty choice first.
  - "Click Submit" appears once text is typed.
  - A correction replaces "Click Send" instead of appearing under it.
- **Coming back after "Stop for today" (F-6):** a welcome-back card with Continue as the main button.
- **Day 6 answers are not given away (F-8):** no net pay on the stub list, and the learner counts the shifts.
- **Dates and clocks agree (F-11, F-12, F-13, F-19):**
  - Filler emails get story days.
  - The phone clock follows the story clock.
  - The Day 3 "payday" wording is fixed.
- **Spanish (F-11, F-20, F-21, F-24):**
  - Localized dates and labels.
  - Language saved per learner.
  - The pay-stub gloss.
- **Keyboard (F-14):** after every card action, focus moves to the next thing to press.
- **Small items (F-15, F-18, F-19):**
  - Day 4's answer appears in the story.
  - The tour's Help label is corrected.
  - The first-day wording is fixed.
  - The Spanish calque is fixed.

## Phase 3: verification, then sign-off
- A fresh-signup replay of Act I in EN and ES, at 1366×768 and 911×512.
- Keyboard, a wrong try, Help, a reload, and opening other apps mid-task.
- Screenshots of each sitting, and the Act I rows updated in the local report.
- Owner sign-off before Act II.
