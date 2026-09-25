---
name: build-lesson
description: Turn a Workplace-simulator game task into a standalone lesson, or audit and fix an existing lesson, so a learner who never played Story mode can finish it without getting stuck. Use when asked to make a task or level a lesson, add a `lesson` block, convert game levels to lessons, or review why a lesson is confusing.
---

# Build or fix a lesson

A lesson (`/lessons/<taskKey>`) runs one game task on its own. The learner has
**no Story context**. They don't know their job, their manager, their login, the
files, or what happened yesterday. They are adult ESOL learners, often new to
computers. Your job is to make sure the screen alone tells them everything.

Read `AGENTS.md` first. Its rules still apply: the Job Card is the only
instruction voice, lessons must not call server actions, all copy is `{ en, es }`,
and pass/fail rules live in `content.ts`.

Work through the phases in order. Don't skip the audit, and don't call a
lesson done until you've looked at the screenshots.

## Phase 1: Check the task can be a lesson

1. Find the task in `src/lib/tasks/registry.ts` (`TASKS[key]`). It must be
   `built: true` and not `retired`.
2. `seedForLesson(key)` in `src/lib/lessons/catalog.ts` must return a seed,
   meaning the task sits in a track. `lessons.test.ts` checks this for every
   reachable task.
3. Find the component. `grep -rn "tasks/<key>/content" src/app src/components`
   finds the component that renders it.

## Phase 2: Audit as the learner (write it down)

Open the component and its `content.ts`. For **every step**, fill one row of
this table in your notes. Paste it into your reply if the user asked for an
audit.

| Step | Job Card says (Guided) | What is on screen | What the learner must know | Where on screen they learn it |
|---|---|---|---|---|

Any cell in the last column that says "nowhere", "a closed modal", "an earlier
Story task", or "the teacher guide" is a stuck point. Then go through
`checklist.md` line by line. Every item there is a real stuck point from past
lessons.

## Phase 3: Write the `lesson` block

In the task's registry entry, add or complete the block. Types are in
`src/lib/lessons/types.ts`.

```ts
lesson: {
  title: { en: "Verb the thing", es: "..." },          // plain, short enough to read in the card
  summary: { en: "One sentence a teacher reads.", es: "..." },
  skills: ["email"],                                    // SkillTag from lessons/skills.ts
  minutes: 8,
  scene: {
    you: { en: "You are a server at Harborside Cafe.", es: "..." },
    people: [{ name: "Renata Silva", role: { en: "Your manager", es: "Tu gerente" } }],
    need: { en: "What is needed today, and why. Facts, not steps.", es: "..." },
  },
  reference: [                                          // anything the learner must copy or check
    { label: { en: "Password", es: "Contraseña" }, value: "Harbor2026" },
  ],
  guide: { skills, prepare, stickingPoints, followUp, peerHelp },
},
```

- **`scene.people`** lists **everyone the task's Job Card lines, dispatch, or
  emails name**. A test fails if the Job Card names a cast member the scene
  doesn't introduce.
- **`reference`** holds exact values (passwords, dates, file names, form data)
  and short facts. Keep each value to one line of about 35 characters, so the
  card fits above the Job Card at 1366×768. The info card shows values with
  no spaces in a typewriter font.
- `reference` values are facts, never instructions. No verbs like "Click" or
  "Type".
- If the task writes "your name" somewhere (a résumé heading), fill it from a
  persona or a placeholder. `displayName` is `""` in lessons.
- `guide.stickingPoints` must describe what learners see **after** your fixes.
  Update it last.

## Phase 4: Fix the task (both modes unless noted)

Apply every fix from your audit. The usual set:

- **Job Card lines** (`RIGHT_NOW_STEPS` in `content.ts`):
  - One or two actions per line.
  - Name the real button text in quotes-free form ("Click Email the total to
    Renata").
  - No idioms or aphorism frames.
  - The step index advances on **state** (a cell fixed, a box chosen), not
    only when the view changes.
  - If the line refers to the info card, say "your info card" /
    "tu tarjeta de información". That exact phrase makes the card glow.
- **`jobCardLine` and `dispatch`**: "On my own" mode shows these for every
  step, so they must be correct and plain. They must not name anyone Story
  mode hasn't introduced by then (`story-coherence.test.ts` checks this). Use
  a role instead ("the new coworker").
- **Show me**: give each step with something to click a `data-showme="id"` on
  the target. Use `useShowMe()` and pass `onShowMe` / `showMeActive` to
  `RightNowBar`. Render `<ShowMeHighlight>`. On a writing step, point at the
  text box, not Send.
- **Corrections**: say which box, day, or field is wrong and what the right
  shape is. Put the strings in `content.ts`, never hard-coded in the component.
- **Forgiving checks**: reuse `parseMoney` (`text-facts.ts`), `mentionsAmount`,
  `sameDate` (`onboarding-paperwork/content.ts`), and `normalizeRename`.
  Accept `$`, comma decimals, 1- or 2-digit months, spaces, underscores,
  "No problem", and typos near the key word. Add each new accepted form to a
  test.
- **Information to copy stays visible** while the learner types. Never put it
  in a modal that closes, and never behind a view they must leave. Phones use
  `PhoneFrame` / `PhoneTexts` in a side `<aside>`, like `ScheduleTask`. A
  compose pop-up docks right with a light scrim (`justify-end bg-black/15`),
  so the source stays readable.
- **Story-only material** ("before your shift", "Next comes the interview",
  story mail, fading scaffolds): hide it or reword it when
  `useLesson() !== null`.
- **Sentence starters**: each language's list stays in that language, and the
  lines fit the lesson's facts.
- **Help lesson**: it must describe the screen that's showing, with no
  missing buttons and no "green box" that isn't green.

## Phase 5: Copy rules (both languages, same pass)

- Write like a calm coworker: short subject-verb-object sentences.
- Spanish is written from the meaning, not the English words. Use
  Latin-American Spanish and informal *tú*.
- Use gender-neutral Spanish where you can ("Empezar", "Atiendes mesas", "Soltero/a").
- `grep` `e2e/` and `src/lib/__tests__/` for any exact string you change.

## Phase 6: Verify

1. `npm run check` must be green.
2. Take screenshots with the script in this folder (dev server on :3000):
   ```
   node .claude/skills/build-lesson/screens.mjs <taskKey>            # en, guided
   node .claude/skills/build-lesson/screens.mjs <taskKey> es independent
   ```
   It saves the intro, the first task screen, and the Show me spotlight at
   1366×768, then prints the paths.
3. **Look at every screenshot**, then walk the rest of the task yourself with
   Playwright or a browser to reach the later steps. At each step, check that:
   - the Job Card line matches the screen,
   - nothing the learner needs is hidden, clipped, or behind the Job Card,
   - the info card isn't cut off.
4. `npx playwright test e2e/lessons.spec.ts e2e/lessons-smoke.spec.ts`
5. If you changed a shared task, also run the Story e2e spec that plays it
   (`grep -rln "<button text>" e2e`).
6. Commit per lesson, with a message that says what the learner could not do
   before and can do now.
