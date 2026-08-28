# Handoff: The Job Card — single guidance surface for Workplace Simulator

## Overview

Workplace Simulator (`marlanamc/workplace-simulator`, Next.js 16 / React 19 / Tailwind 4) currently tells a learner what to do through **six different surfaces**: the desktop `ShiftBriefing`, the browser `TaskDispatchStrip`, the in-app `RightNowBar`, the `ShowMeHighlight` spotlight, the `NudgeToast` coaching toast, and the `TaskDoneCard` + `TaskDoneActions` finish screen (plus `MariaNoteToast`, `MyJobPanel`, `TourWalkthrough`). For adults with low digital literacy this is too many voices in too many places, and the surface that sets up the job (the desktop briefing) disappears the moment the app window opens.

This handoff replaces all of that with **one object: the Job Card.** A single card, docked in a screen corner, that is the only thing in the product that tells the learner what to do. It is present on the desktop, stays on top of app windows, absorbs error coaching, and replaces the finish screen.

**Scope of this change**
- ADD: `JobCard` (new persistent component) + its state source.
- REPLACE: `ShiftBriefing`, `TaskDispatchStrip`, `RightNowBar`, `NudgeToast` (as an instruction channel), `TaskDoneCard` + `TaskDoneActions`, and the Level 0 `TourWalkthrough`.
- KEEP: `ShowMeHighlight` (the Job Card's "Show me" button drives it), `HelpDrawer`, `PickerModal`, `MyJobPanel` (as an optional "see the whole map" panel, no longer the primary instruction surface), `Shelf`, `BrowserClient`, all task components and content files.

## About the design files

The files in this bundle are **design references written as HTML prototypes** — they show intended look and behavior. They are **not** production code to copy. The task is to recreate them inside the existing Next.js/React/Tailwind codebase using its established patterns (`useProgress`, `useWindowManager`, `Localized<string>` content objects, CSS custom properties in `src/app/globals.css`).

The prototypes are Design Components: each `.dc.html` file is a self-contained page that opens in a browser (`support.js` is the runtime; keep it next to the HTML files). The chrome inside them (browser tab strip, Mail, shelf) was recreated from the real source files and is included only as context — do not re-implement it, it already exists.

- `Job Card Flow.dc.html` — **the design to build.** Clickable: plays all of Day One (both mail jobs) with the Job Card driving. Read its logic class (`class Component extends DCLogic`) for the exact state machine.
- `Guidance Options.dc.html` — the three directions explored; option **1a** was chosen. 1b (Maria speaks) and 1c (job ticket) are documented there for context only.
- `Current Flow (recreation).dc.html` — today's build, annotated with the six competing voices. Use it as the "before" reference.

## Fidelity

**High-fidelity.** Colors, type sizes, radii, and spacing below are final and are drawn from `src/app/globals.css` tokens plus the existing Chromebook-flavored UI. Recreate pixel-accurately with Tailwind classes / CSS vars as the codebase already does.

## The Job Card

### Placement and shape

- Fixed-position card, `z-index` above app windows and below modals (prototype uses `z-index: 70`; `HelpDrawer` and `PickerModal` are 70+/80 today — put the card at 70 and raise the drawer/picker above it).
- Width `420px`. Radius `24px`. Background `#ffffff`. Shadow `0 18px 48px rgba(0,0,0,0.34)`.
- Default corner: **bottom-left**, `left: 24px; bottom: 72px` (72 = 48px `SHELF_RESERVE` + 24px air).
- Entry animation: `cardpop` — `opacity 0 → 1`, `translateY(14px) → 0`, `0.24s ease-out`. Respect `prefers-reduced-motion` (the codebase already does this in `globals.css`).

### Draggable, corner-snapping

- The **header** is the drag handle (`cursor: grab`, `grabbing` while dragging; `touch-action: none` on the card).
- While dragging, the card follows the pointer, clamped inside the stage; shadow deepens to `0 28px 64px rgba(0,0,0,0.42)` and it scales to `1.01`.
- On release it **snaps to the nearest of four corners** by card-center position: `bl` (default), `br`, `tl`, `tr`. Corner offsets: left/right `24px`, top `24px`, bottom `72px`. Transition `0.22s ease-out` on `left/right/top/bottom`.
- Snapping (not free positioning) is deliberate: the card can never end up half off-screen or in an unfamiliar spot.
- The card **returns to bottom-left at the start of every new job**, so a job always begins in the same place.
- Keyboard: header is focusable (`tabindex="0"`, `role="button"`, aria-label "Move this card to another corner. Drag it, or use the arrow keys."). Arrow keys move it corner to corner (Left → `?l`, Right → `?r`, Up → `t?`, Down → `b?`).
- Once the card is not in `bl`, a small **⤡ snap-back button** appears in the header (28×28 circle, `rgba(255,255,255,0.18)`, white icon) that returns it to `bl`. Grip dots (2 columns × 3 dots, 3px, white, `opacity 0.75`) sit at the header's right edge as the drag affordance.

### Anatomy

**Header** — `display:flex; align-items:center; gap:10px; padding:12px 20px; color:#fff`, background = tone color (blue `#0b57d0` while working, green `#1e8e3e` when a job is finished).
- Badge: 26×26 circle, `rgba(255,255,255,0.22)`, 14px/700 — the job number, or a ✓ when done.
- Kicker: 15px/500, truncates. Text is the job's name (e.g. "Job 2 of 2 · send the report").
- Then the snap-back button (conditional) and grip dots.

**Body** — `padding: 20px`.
- **The instruction line**: 27px / weight 500 / `line-height 1.2` / `letter-spacing -0.01em` / `#202124`. **Hard rule: one short sentence, ideally under 6 words.** ("Open Maria's email." / "Click Reply." / "Attach the July report." / "Write one short line." / "Click Send.")
- **Correction block** (conditional, replaces the nudge toast): `margin-top:14px`, radius 14px, background `#fef0dc` (`--warning-tint`), padding `12px 14px`, alert-circle icon 22px stroke `#b06000`, text 17px/500 `#8a5000`. Auto-clears after **5s** or on the next correct action. Corrections appear **inside the card** — never as a floating toast — so there is only ever one place to look.
- **Primary button** (only on cards that have one): full width, `min-height:64px`, radius 16px, tone background, white, 20px/500, `white-space: nowrap`. This is the only button that ever advances the flow from the card.
- **Help row** (only while the learner is mid-job): two buttons in a `gap:10px` row.
  - "Show me" — flex:1, `min-height:56px`, radius 16px, `2px solid #0b57d0`; unpressed white/blue, pressed `#0b57d0`/white with label "Hide". Drives the existing `ShowMeHighlight` against the current step's target (`data-showme` ids already in `MailClient`: `maria-row`, `reply-button`, `attach-button`, `send-button`).
  - Speaker button — 56×56, radius 16, `2px solid #dadce0`. Reads the instruction line aloud (`speechSynthesis`; the repo already has `src/lib/read-aloud.ts` — use `speakText(line, lang)`). aria-label "Read this out loud".
- **Progress dots**: 4 equal-width bars, `height:8px`, radius 999, `gap:6px`. Done = `#1e8e3e`, current = tone color, future = `#e8eaed`. Hidden during the first-run intro beats.

## The flow

### First run (replaces the Level 0 `TourWalkthrough`)

Two beats on the desktop, each one sentence with a single button. No spotlight tour, no tab hunting:
1. Badge "1", kicker "Your job card" — **"This card always tells you the next thing to do."** → `OK`
2. Same header — **"It stays in this corner. Nothing else will tell you what to do."** → `Got it`

Then the card becomes the Day One job card. Progress dots are hidden for both beats. The rest of the current tour content (finding bookmarks, the Help `?`) moves to later levels where it is actually needed, or is dropped.

### Day One, job 1 (`mail-reply`) — 4 steps

| Place | Card line | Card affordances | Advances when |
| --- | --- | --- | --- |
| Desktop | "Maria said welcome. Write her back." | Primary `Open Mail` | button opens Browser on the Mail tab |
| Mail, inbox | "Open Maria's email." | Show me → `maria-row`, speaker | learner clicks Maria's row |
| Mail, reading | "Click Reply." | Show me → `reply-button`, speaker | Reply clicked |
| Mail, compose | "Write one short line." then "Click Send." | Show me → `send-button`, speaker | Send with non-empty body |
| Finished | "Sent. One job left." (green) | Primary `Next job` | resets to desktop for job 2 |

### Day One, job 2 (`mail-attach`) — 4 steps

Same shape; the compose step is "Attach the July report." until a file is attached, then "Click Send." Finished line: "Sent, with the file." → primary `Next job`; when the whole day is done: **"That's today done."** → `Start tomorrow`.

### Errors (all answered inside the card)

| Wrong action | Correction text |
| --- | --- |
| Wrong inbox row | the row's existing `wrongHint` from `src/lib/tasks/mail/content.ts`, e.g. "Darnell is a coworker. Look for Maria Delgado." |
| Maria's older welcome mail during job 2 | "That is her older welcome note. Open the newer one about the safety report." |
| Forward instead of Reply | "That is Forward. It sends her email to someone else. Click Reply." |
| Send with empty body | "Write one short line first." |
| Send without the attachment | "She asked for the file. Click Attach file." |
| Wrong file in the picker | the file's existing `wrongHint`, e.g. "That one is June. She asked for July." |

Nothing ever blocks or fails — the learner keeps trying, exactly as today.

### Finish (replaces `TaskDoneCard` + `TaskDoneActions`)

No done screen and no three-button choice. The card header turns green, the line states what happened in five words or fewer, and there is **one** primary button (`Next job` / `Start tomorrow`). "Do it again" and "Back to desktop" move into the `MyJobPanel` as quiet secondary options. The skill badge (`SKILLS[taskKey]`, badge number, "Counts toward…") is recorded into the awards case silently rather than being presented for reading.

### Fading by level (the user's explicit requirement)

Guidance loosens as the learner progresses — reuse the existing `release-ladder.ts` / `useSkillGuidance` rung logic:
- **Act I (levels 0–3)**: full card — per-step instruction line, Show me, speaker, dots.
- **Act II**: the card states the **goal only** ("Jordan needs this week's schedule"), no per-click steps; Show me appears only after a wrong action or on request.
- **Act III**: the card is a title plus a tick box; Show me is available but never offered.

## State

Derive the card from existing state rather than adding a parallel store. In the prototype the whole card is a pure function of:

```
intro      0 | 1 | 2          first-run beats, 2 = past intro
job        current task key   (prototype: 1 | 2 for the two Day One jobs)
place      "desktop" | app    which surface is showing  → useWindowManager
view       "list"|"read"|"compose"  the task's own internal step  → task component
draft      string             composed body
attached   boolean
picker     boolean
showMe     boolean            drives ShowMeHighlight
correction string             "" when none; auto-clears after 5s
done       boolean            this job finished
allDone    boolean            level finished
corner     "bl"|"br"|"tl"|"tr"
drag       {x,y} | null       live drag position
```

In the real app: `job`/`done`/`allDone` come from `useProgress()` (`completedTaskKeys`, `currentTrack`, `nextTaskInTrack`); `place` from `useWindowManager()`; `view`/`draft`/`attached`/`picker` stay inside the task component. The cleanest shape is a **`JobCardProvider`** that exposes `setStep(stepId)` / `correct(message)` / `setShowMeTarget(id)`, which each task calls where it currently renders its own `RightNowBar` and calls `recordWrong()`. `corner`/`drag` are card-local UI state; `corner` resets to `bl` on job change.

Each step contributes: `badge`, `kicker`, `line`, optional `primary` label + action, `help` (bool), `tone`, `step` index for the dots.

## Design tokens

All exist in `src/app/globals.css` unless noted.

| Token | Value | Use |
| --- | --- | --- |
| `--accent` | `#1a73e8` | shelf/browser accents |
| accent (card) | `#0b57d0` | card header + primary button (matches Mail's existing `#0b57d0`) |
| `--success` | `#1e8e3e` | finished header, done dots |
| `--warning` | `#b06000` | correction icon |
| `--warning-tint` | `#fef0dc` | correction background |
| correction text | `#8a5000` | correction copy |
| `--text-primary` | `#202124` | instruction line |
| `--text-secondary` | `#5f6368` | secondary copy |
| `--border` | `#dadce0` | speaker button border |
| muted bar | `#e8eaed` | future progress dots |
| `--surface` | `#ffffff` | card background |

Type: Roboto (already loaded via `--font-roboto`). Card line 27/500; kicker 15/500; correction 17/500; primary 20/500; Show me 17/500.
Radii: card 24; buttons 16; correction 14; dots/pills 999.
Shadows: resting `0 18px 48px rgba(0,0,0,0.34)`; dragging `0 28px 64px rgba(0,0,0,0.42)`.
Motion: `cardpop 0.24s ease-out`; corner snap `0.22s ease-out`; existing `showme-pulse 1.6s` for the spotlight ring.

## Accessibility

- Every card control is ≥ 44px tall; the primary button is 64px and full-width.
- Header is keyboard-reachable and arrow-key movable; the snap-back button has an aria-label.
- The instruction line should be in an `aria-live="polite"` region so it is announced when it changes (today's `NudgeToast` already does this — carry the pattern over).
- Read-aloud uses the existing `speakAloud` preference; the speaker button works regardless.
- Spanish: today's `RightNowBar` shows English and Spanish stacked. Open decision — either keep the second language as a 13px line under the instruction, or leave it behind the existing `lang` toggle. The prototype shows English only.

## Assets

- `public/wallpapers/latte.jpg` — the existing Act I wallpaper, copied from the repo, included for the prototype only.
- Icons are Lucide (`lucide-react`, already a dependency): `MapPin` (Show me), `Volume2` (speaker), `AlertCircle` (correction), `Check` (done), `Shrink`/corner icon (snap back), plus the task icons already mapped in `src/lib/icons.tsx`.
- No new fonts, images, or dependencies.

## Files in this bundle

| File | What it is |
| --- | --- |
| `Job Card Flow.dc.html` | The design to build — clickable Day One. Its logic class is the reference state machine. |
| `Guidance Options.dc.html` | The three explored directions; 1a chosen. |
| `Current Flow (recreation).dc.html` | Today's build, annotated with the six competing instruction surfaces. |
| `support.js` | Runtime for the `.dc.html` files. Keep alongside them; not part of the implementation. |
| `public/wallpapers/latte.jpg` | Wallpaper used by the prototypes. |

## Repo files this touches

Read before changing: `src/app/DesktopClient.tsx`, `src/components/ShiftBriefing.tsx`, `src/components/MyJobPanel.tsx`, `src/components/Shelf.tsx`, `src/app/browser/BrowserClient.tsx`, `src/app/mail/MailClient.tsx`, `src/components/task/RightNowBar.tsx`, `src/components/task/TaskDispatchStrip.tsx`, `src/components/task/NudgeToast.tsx`, `src/components/task/ShowMeHighlight.tsx`, `src/components/task/TaskDoneCard.tsx`, `src/components/task/TaskDoneActions.tsx`, `src/components/task/TourWalkthrough.tsx`, `src/lib/tracks-content.ts`, `src/lib/shift-spine.ts`, `src/lib/use-skill-guidance.ts`, `src/lib/tasks/mail/content.ts`.

Copy is deliberately shorter than today's content objects: the `dispatch`, `EVENT_INTRO`, and `TASK_INTRO` bodies get cut down to a single card line per step. Keep the `Localized<string>` shape so Spanish stays first-class.
