# Beginner ESOL audit follow-up

Implementation follow-up to the 27 September 2026 audit and the local recheck
in `output/playwright/esol-audit-recheck/status.md`.

## Remaining software findings addressed

- Lesson instructions occupy a reserved column, including the 200% equivalent
  Chromebook viewport. Phones have a reserved bottom panel. The lesson card
  cannot be dragged over the app. Story mode retains its corner controls.
- Long instructions and Help scroll within that space. A new instruction
  returns to its first line. Wide-screen reference and instruction cards also
  have separate height budgets.
- The sign-in task scrolls within its window. At narrow widths, selecting the
  real message keeps its sender and original text beside the code input.
- Show me scrolls nested panes even when a target's coordinates are inside
  the viewport. Coursework moves focus to the next field after a correct
  selection.
- Calendar time suggestions are withheld until a rejected attempt in both
  lesson support modes. Short valid replies remain accepted. The finish
  displays the learner's actual message, and reopening compose preserves the
  draft. Practice again clears it.
- The lesson Start button is disabled until its event handler is ready.
  Library tests wait for hydration at the affected transitions.
- Existing seven-pack changes are preserved: printable learner tasks and
  response spaces, calendar/shift alignment, separate spreadsheet/formula
  packs, consistent filenames, and the Spanish appointment-time correction.

## Verification (27–28 September 2026)

- PR preparation on current `main` after #42 merged: `npm run check` passed
  lint, TypeScript, and all 2,146 tests across 49 files.
- `npm run check`: final run passed lint, TypeScript, and all 1,978 unit
  tests across 48 files. `git diff --check` passed.
- New EN/ES audit regressions: a complete run passed all 10 tests, covering
  three viewport sizes and both calendar support modes. An earlier combined
  audit/library run passed all 26 tests. The existing four materials browser
  tests also passed during the initial review.
- Full browser run: 108 passed, 2 skipped, 43 failed. Server logs include
  Neon database connection failures; browser failures include welcome/start
  waits and very long timeouts. The full suite is **not green**.
- Subsequent account-free reruns also suffered multi-minute stalls. The last
  bounded rerun ended with 2 passes, 2 page-navigation timeouts and 26 tests
  not run, even with idle sleep temporarily prevented. The cause of these
  execution stalls is not established; do not treat earlier focused passes
  as a substitute for a clean release run.
- Browser checks used the webpack development server. Production build,
  deployment, and native browser zoom were not verified.

## Release boundary

These are local implementation changes, not a deployment record. No database
migration is required. Confirm the deployed revision before declaring the
fixes available to learners.

The audit's predicted learner reactions, reading level, correction timing,
native browser zoom, real Chromebook input, screen-reader behavior, and
read-aloud quality still need observed learner/accessibility sessions. Those
cannot be established by unit or browser automation alone.
