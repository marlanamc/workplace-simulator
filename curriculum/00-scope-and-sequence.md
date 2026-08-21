# Ready for the Lead Role — Scope & Sequence

**Goal:** Prepare adult ESOL students for promotion into a supervisor/lead role by
building confidence with everyday office technology — email, PDFs, schedules, pay
stubs, and workplace judgment — through low-stakes practice.

**Format for every lesson:**
- 20 minutes max, split into two 10-minute halves.
- **Part A — Simulator.** Practice the skill in the Workplace Simulator app.
  Nothing is real; nothing can be broken; wrong clicks get a friendly nudge, not
  an error. There's no step-by-step wizard inside the app itself — a dismissible
  **Objectives panel** (🎯 tab, right edge of the screen) tells the student what
  the current track and task are, and a **Help** button inside the task gives a
  short on-demand lesson if they get stuck. The apps otherwise look and behave
  like the real thing.
- **Part B — Real Practice.** The *same* skill, same steps, done for real on the
  Chromebook — usually by downloading a practice file the teacher posted in
  Google Classroom. This is where the confidence built in Part A gets tested in
  a real (but still safe — no real accounts, no real coworkers) environment.
- Designed to be done **asynchronously** — a student can sit down, read the one-page
  instruction sheet, and do both halves alone.

**Digital literacy range in the room:** some students have never turned on a
computer; others are ready for spreadsheets. Track 0 exists so nobody starts the
manager-skills tracks without the physical basics (mouse/trackpad, opening a
browser tab, using Google Classroom itself). Track 0 is a prerequisite, not a
gate everyone repeats — a student who can already do it skips straight to Track 1.

---

## How the simulator now organizes itself

The simulator is one persistent desktop with two apps — a **Browser** (which
hosts WorkMail, the Employee Portal, and the Handbook as tabs, the way a real
job's tools mostly live in one browser) and a **PDF Reader**. That desktop never
changes. What changes, track by track, is *which tasks are asked of the
student* and *which emails/documents show up* — a new email from Maria, a new
pay stub, a new incident to write up. The story stays Harborside Cafe
throughout; the responsibilities grow.

Three things replaced the old single confidence check-in as the feedback loop:

- **Points** — every completed task adds to a running total shown in the
  shelf's system tray, with a small "+100" pop the moment it happens.
- **A certificate per track** — finishing every task in a track fires a
  celebration and saves a certificate the student can find again later in the
  Objectives panel.
- **The confidence check-in still happens** at the end of a task (the same
  three ungraded self-rating questions as before) — points and certificates
  are the *visible* reward; the check-in is still where the honest reflection
  happens, and teachers should still read those answers.

## Track 0: Foundations (prerequisite — skip if already comfortable)

Unchanged — this happens before the student ever opens the simulator.

| Lesson | Skill | Part A (Simulator) | Part B (Real Chromebook) |
|---|---|---|---|
| 0.1 | Turn on device, open a browser | n/a — physical device only | Turn on Chromebook, open Chrome, go to one bookmarked site |
| 0.2 | Mouse/trackpad & clicking targets | Click-practice screen in simulator (big buttons) | Open Google Classroom, click into "our class" |
| 0.3 | Typing & using a keyboard | Type a short practice message in a mock text box | Type your name and today's date into a real Google Doc |
| 0.4 | Downloading a file from Google Classroom | n/a | Open Classroom, find "Practice Files," download one file, find it in Downloads |

---

## Track 1: Getting Started

One task — the first thing a new hire actually has to do: answer a message
from a supervisor. **All three tracks are now built and playable.**

| Lesson | Task key | Skill focus | Simulator app |
|---|---|---|---|
| 1 | `mail` | Read a supervisor's email, reply, and attach the right file | Browser → WorkMail |

See `01-lesson-mail.md`. This single lesson covers what used to be two separate
lessons (reply, then attach) — the built app already asks for both in one flow.

---

## Track 2: Schedules & Documents

**Built.** Any future spreadsheet-editing practice (a roster, a tally) will
live as a new "Sheets"-style tab inside the Browser, alongside WorkMail and
the Employee Portal — not as a separate desktop app.

| Lesson | Task key | Skill focus | Simulator app |
|---|---|---|---|
| 2 | `schedule` | Spot a scheduling conflict and request a change the right way | Browser → Employee Portal |
| 3 | `timeclock` | Clock out and confirm your hours look right | Browser → Employee Portal |
| 4 | `paystub` | Read a pay stub and confirm net pay against hours worked | Browser → Employee Portal + PDF Reader |

See `02-lesson-schedule.md`, `03-lesson-timeclock.md`, `04-lesson-paystub.md`.

---

## Track 3: Judgment & Follow-Through

**Built.** This is where tool confidence turns into workplace judgment —
writing something under a little social pressure, and knowing where to look
something up instead of guessing.

| Lesson | Task key | Skill focus | Simulator app |
|---|---|---|---|
| 5 | `incident` | Write up what happened, in order, in a professional tone | Browser → a new Incident Form |
| 6 | `handbook` | Find an answer in the employee handbook under pressure | Browser → Handbook |

See `05-lesson-incident.md`, `06-lesson-handbook.md`. By the time a student
finishes both, they've independently used every app in the simulator today —
the old "capstone" lesson is really just what finishing this track already
means, not a separate exercise. Tracks 4 and 5 below continue the story
past this point and introduce more apps; they're planned but not yet built.

---

## Track 4: Growing at Work *(planned — not yet built)*

**Story bridge:** finishing Track 3 is what actually earns the promotion the
Track 1 email hinted was coming — the student is now a shift lead, and shift
leads use a few tools individual crew members didn't need: a shared
calendar, a shared drive of files instead of one inbox, and a simple
spreadsheet instead of a paper tally sheet. No new desktop app — these are
new Browser tabs, same as Employee Portal and the Incident Report were.

| Lesson | Task key | Skill focus | Simulator app |
|---|---|---|---|
| 7 | `calendar` | Accept a meeting invite, spot a double-booking against your shift, propose a different time | Browser → a new Calendar tab |
| 8 | `files` | Find the right file in a shared drive (folders + search), share it at "view" not "edit," rename it to match a naming convention | Browser → a new Shared Drive tab |
| 9 | `spreadsheet` | Enter numbers into a shared weekly tally, read a formula's total, notice and flag one that's wrong | Browser → a new Sheets-style tab |

Optional stretch, lower priority (can slip to a later pass): `video-call` —
join a mock team meeting, mute/unmute, use chat, understand basic etiquette
(camera optional, no need for real video since the etiquette is the point,
not the technology).

**Design notes:**
- `calendar` chains directly off the `schedule`/`mail` skills from Track 2 —
  same "notice a conflict, say something" shape, new tool.
- `files` extends the file-picker pattern already built for `mail`'s
  attachment step (`PickerModal`) — same component, a folder layer added on
  top, plus a new "who can see this" permission choice.
- `spreadsheet` is the first task that isn't itself the point — the *point*
  is still judgment (a formula-looking total can be wrong; do you just copy
  it, or check it?), the spreadsheet is the setting. Keeps this from turning
  into a spreadsheet-software tutorial.

---

## Track 5: Planning What's Next *(planned — not yet built)*

**Story bridge:** with the promotion behind them, the student starts
considering community college or a training program — not instead of work,
alongside it. This runs as a second storyline layered onto the same
Harborside Cafe desktop: new bookmarks appear in the same Browser next to
the work ones (a college portal, a coursework site, a library search), the
same way a real person's browser mixes work and personal tabs. The point
being made on purpose: the skills already practiced (read it carefully,
reply with what's asked, attach the right file, look it up instead of
guessing) are exactly the skills these new tools need too — nothing about
them is actually new.

| Lesson | Task key | Skill focus | Simulator app |
|---|---|---|---|
| 10 | `enrollment` | Navigate a college portal: find the application deadline, check a required-documents checklist, submit a short statement of interest | Browser → a new College Portal tab |
| 11 | `financial-aid` | Read a financial aid award letter (a real document, not a summary) and find the amount and the accept-by deadline | PDF Reader + Browser → College Portal |
| 12 | `coursework` | Read a syllabus, find an assignment's due date, and submit a short response — same "read it, attach it, send it" shape as `mail`, in a new tool | Browser → a new Coursework (LMS) tab |
| 13 | `research` | Search a library-style database for a source on a given topic, and tell a credible source from an unreliable one | Browser → a new Library Search tab |

**Design notes:**
- `financial-aid` mirrors `paystub`'s shape exactly (open a real document,
  answer a "find it" check) — deliberately, so a student who did `paystub`
  confidently should recognize the pattern immediately.
- `coursework` mirrors `mail`'s shape (read what's asked, attach the right
  thing, send/submit) for the same reason — proof to the student that a new
  logo and color scheme doesn't mean a new skill.
- `research` is the one genuinely new skill in this track: telling a
  credible source from an unreliable one. It plants 3–4 decoy sources (one
  obviously promotional, one outdated, one a forum post, one a real-looking
  library database entry) and asks which one to cite — same "spot it, don't
  guess" shape as `handbook`, applied to a new judgment call.
- Consider whether `enrollment` and `financial-aid` should be one task
  instead of two before building — they're presented separately here
  because they're different documents/interactions, but they may feel like
  one continuous errand to a student. Worth watching in Track 4 (`calendar`/
  `files`/`spreadsheet`) whether that instinct holds before finalizing.

---

## Differentiating for a wide skill range

Your class spans two very different starting points: students who've never
touched a computer, and students with college degrees or office experience from
another country who already know *what* a spreadsheet or a professional email
is — they just don't know the specific software, or U.S. workplace norms
(directness, cc'ing a manager, how formal to be, etc.).

The same lesson structure serves both without splitting into separate curricula:

- **Software mechanics** (where to click, how to attach a file, how to read a
  pay stub) is where beginners spend most of their time. This is what the
  in-task **Help** button is for — it's always available, never required, and
  it's the *only* place step-by-step hand-holding lives now (the app itself
  doesn't narrate what to click).
- **Workplace judgment** (what tone to use, when to ask instead of assume, how
  to word a schedule-change request) is where the college-background/
  experienced students should spend their attention — Track 3 in particular is
  built around this, not around clicking.
- **Self-pacing does the differentiation for you**: a beginner spends the full
  10 minutes per half getting comfortable with clicks; an experienced student
  blows through Part A in 2 minutes and spends the rest of the time on Part B's
  real practice and the confidence check-in's reflection questions. Nobody
  needs to be held back or given separate material — the task is the same, the
  time spent on each piece just differs.
- When you *do* want to stretch the stronger students, add an optional "extra
  challenge" line to Part B (e.g., "also cc the front desk") rather than a
  separate worksheet — keeps the lesson single-track and low-prep for you.

---

## Lesson template (used for every lesson)

1. **We will learn...** (1 objective, plain language, read aloud if needed)
2. **Watch** — 1-minute teacher demo or short screen-recording, if available
3. **Part A: Simulator practice** (~10 min) — do the task in the app, at least
   twice if it's quick; the Help button is available the whole time, the
   Objectives panel shows what track/task is current
4. **Part B: Real practice** (~10 min) — same task for real, using a file
   downloaded from Google Classroom
5. **Confidence check-in** — 3 quick self-rating questions ("I could do this at
   work," "I would ask for help if," etc.) — not a graded quiz, alongside the
   points/certificate the app already awarded automatically
