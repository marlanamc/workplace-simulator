<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Working in this repo

Read [README.md](README.md) for the architecture and [TESTING.md](TESTING.md) for how to
verify. This file is only the things that are easy to get wrong.

### The one rule

**The Job Card is the only surface that tells a learner what to do.** If a feature wants to
instruct the learner, it reports to the Job Card (`src/lib/job-card-context.tsx`) instead of
drawing its own banner, strip, or toast. This product previously had six competing
instruction voices and the whole point of the current design is that it has one.

### Before you commit

`npm run check` — lint + typecheck + unit tests, a few seconds. It must be green.
`npm run test:e2e` for anything touching login, the walkthrough, or the Job Card.

### Content wiring

- Adding a task or level? Just run `npm test`. `content-integrity.test.ts` names exactly
  which wiring is missing (both languages, task locations, handoff CTA, icons).
- All learner-facing copy is `Localized` (`{ en, es }`). Both halves, always — the suite
  fails otherwise, because an English string in Spanish mode is invisible in review.
- `LEVELS` in `tracks-content.ts` drives the wallpaper, tab management (`freeTabbing`), and
  the level-up celebration. A new level needs an entry in `LEVELS` *and* a home in a track,
  or `levelForTrack()` falls back to the last level and misattributes everything after it.
- `TASK_LOCATIONS` is a `Partial<Record<TaskKey, ...>>` on purpose: an unbuilt next task
  shows "More coming soon" rather than a dead button.
- Task pass/fail rules live in the task's `content.ts` as pure functions, not in components,
  so they can be unit-tested without React.

### React constraints this repo enforces as errors

- **No `setState` synchronously in an effect body.** Derive it during render, seed it with
  lazy `useState`, or use the `override ?? stored` pattern (see `LoginForm.tsx`). Effects are
  for syncing with genuinely external systems, like DOM measurement.
- **No `Math.random()` in render.** Client components must be deterministic (seed by index or
  props — see `Confetti.tsx`) or generate the value after mount in an event handler, or
  hydration mismatches.
- Shared logic takes `now` as a parameter (see `release-ladder.ts`) rather than calling
  `Date.now()` internally, so tests can control time.
