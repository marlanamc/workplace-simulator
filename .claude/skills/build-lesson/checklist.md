# Learner-view audit checklist

Every line here is a stuck point found in a real lesson. Answer each one for
the lesson you're working on, and fix every "no".

## Arriving cold
- [ ] Does the scene say who the learner is, where they work, and what's needed today, with no Story knowledge?
- [ ] Is every person the task mentions (in emails, To fields, card lines, notes) introduced in `scene.people`? *(Renata in the tips sheet.)*
- [ ] Is every login, code, file name, date, or form value the learner must type in `reference` or visible on screen? *(The sign-in password was never given.)*
- [ ] Is every jargon noun explained or replaced ("slip", "formula", "range", "syllabus", "slot", "status cell")?
- [ ] Does the task refer to anything that only happened in an earlier Story task (a shift they filled, "your practice in the simulator")?

## Information that disappears
- [ ] Does anything the learner must copy vanish before they type it (a picker that closes, a modal, a view they leave)? *(The text code.)*
- [ ] Does a compose pop-up or dialog cover the number or name the learner has to write?
- [ ] Does a reference block scroll away just when the matching fields appear? *(W-4 facts.)*
- [ ] Does the Job Card or info card cover task content at 1366×768?
- [ ] Does a picker or modal dim the Job Card so corrections can't be read?

## The Job Card lines
- [ ] Is each line one or two actions, naming the real button text?
- [ ] Does the line match what's actually on screen (a dropdown called a checkbox, "Reply" where the button says "Continue")?
- [ ] Does the step advance when the key action happens, not only when the view changes? *(The formula step only appeared after it was already done.)*
- [ ] Is any required click never mentioned (a cell you must click before Email works)?
- [ ] Is any line skipped or never shown (step 0 jumping to 2)?
- [ ] Are `jobCardLine` and `dispatch` correct? They're all "On my own" mode shows. *(The calendar line said the opposite of the task.)*
- [ ] Are there idioms ("That day is yours", "send it up", "check it against", "spot the clash")?
- [ ] Is the lesson title short enough to read in the card header?

## Answer checks
- [ ] Does copying a value exactly as shown pass? *("$42.50" failed a `parseFloat` check.)*
- [ ] Do other honest formats pass: comma decimals, `10/1/2026`, spaces in codes, underscores instead of dashes, `aug24`, "labour"?
- [ ] Does a polite yes pass even with "no" or "not" in it ("No problem", "I will not be late")?
- [ ] Does a short but correct answer pass ("on the shelf", "I will call and fix it")?
- [ ] Does the correction say which field or day is wrong and what shape is expected?
- [ ] Is an empty box reported before a mismatch?
- [ ] Is any "correct" answer contradicted by the screen? *(The answer said "Sam", but the schedule said Tomás Ortiz.)*
- [ ] Does the task ask about content that isn't on the page? *(The assignment's complaint email.)*
- [ ] Does anything tell a real adult a fact about themselves ("You do not have a degree")? It should talk about the persona or history instead.

## Scaffolding
- [ ] Does every clickable step have Show me, pointing at the right control (the text box on a writing step)?
- [ ] Does clicking a normal control while exploring get scolded? Only correct a *choice*, not looking.
- [ ] Does the help drawer describe the screen that's currently showing?
- [ ] Do help and guide text match the real visuals (the "green box", the "budget line")?
- [ ] Do the sentence starters stay in one language and fit the lesson's facts?
- [ ] Is Story-only wording gone in a lesson ("before your shift", "like always", "Day one is complete", "Next: …")?

## Both languages
- [ ] Is every new string `{ en, es }`, with the Spanish written from the meaning?
- [ ] Do Spanish screens show Spanish data (formula words, day names, labels) where the English screen shows English?
