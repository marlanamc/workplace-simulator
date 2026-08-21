import { TASK_KEYS, type TaskKey } from "./desktop-content";
import { TASK_INFO } from "./tracks-content";

/** Browser tabs the simulator can actually open today. */
export const JUMP_TABS = [
  "mail",
  "portal",
  "incident",
  "handbook",
  "calendar",
  "files",
  "spreadsheet",
] as const;
export type JumpTab = (typeof JUMP_TABS)[number];

export function isJumpTab(value: string | undefined): value is JumpTab {
  return !!value && (JUMP_TABS as readonly string[]).includes(value);
}

export interface CatalogLesson {
  n: string;
  taskKey: string;
  skill: string;
  app: string;
  /** Browser tab to open when this lesson is playable. */
  tab?: JumpTab;
  /** Act V parallel paths. */
  path?: "a" | "b";
}

export interface CatalogLevel {
  key: string;
  n: number;
  title: string;
  folder: string;
  lessons: CatalogLesson[];
}

export interface CatalogAct {
  key: string;
  title: string;
  jobTitle: string;
  color: string;
  levels: CatalogLevel[];
}

function isLessonBuilt(taskKey: string): boolean {
  return (TASK_KEYS as readonly string[]).includes(taskKey) && TASK_INFO[taskKey as TaskKey]?.built === true;
}

export function lessonIsBuilt(lesson: CatalogLesson): boolean {
  return isLessonBuilt(lesson.taskKey);
}

export function playHref(lesson: CatalogLesson): string | null {
  if (!lessonIsBuilt(lesson) || !lesson.tab) return null;
  return `/?task=${lesson.tab}&from=studio`;
}

export function firstPlayableHref(level: CatalogLevel): string | null {
  for (const lesson of level.lessons) {
    const href = playHref(lesson);
    if (href) return href;
  }
  return null;
}

export function catalogStats(acts: CatalogAct[] = CATALOG_ACTS) {
  const lessons = acts.flatMap((a) => a.levels.flatMap((l) => l.lessons));
  const built = lessons.filter(lessonIsBuilt).length;
  return { total: lessons.length, built, written: lessons.length - built };
}

/**
 * The full 25-level map for the designer studio. Independent of `LEVELS` in
 * tracks-content - that list is only what's playable. This one is the
 * curriculum, with built lessons lighting up as they ship.
 */
export const CATALOG_ACTS: CatalogAct[] = [
  {
    key: "act1",
    title: "Act I: New Hire",
    jobTitle: "New Hire",
    color: "#1a73e8",
    levels: [
      {
        key: "level1",
        n: 1,
        title: "New Hire, Day One",
        folder: "act-1-new-hire/level-1-new-hire",
        lessons: [
          {
            n: "1",
            taskKey: "mail",
            skill: "Read a supervisor's email, reply, and attach the right file",
            app: "Mail",
            tab: "mail",
          },
        ],
      },
      {
        key: "level2",
        n: 2,
        title: "Settling In",
        folder: "act-1-new-hire/level-2-settling-in",
        lessons: [
          {
            n: "1",
            taskKey: "schedule",
            skill: "Spot a scheduling conflict and request a change the right way",
            app: "Portal",
            tab: "portal",
          },
          {
            n: "2",
            taskKey: "timeclock",
            skill: "Clock out and confirm your hours look right",
            app: "Portal",
            tab: "portal",
          },
          {
            n: "3",
            taskKey: "paystub",
            skill: "Read a pay stub and confirm net pay against hours worked",
            app: "Portal + PDF",
            tab: "portal",
          },
        ],
      },
      {
        key: "level3",
        n: 3,
        title: "When Something Happens",
        folder: "act-1-new-hire/level-3-when-something-happens",
        lessons: [
          {
            n: "1",
            taskKey: "incident",
            skill: "Write up what happened, in order, in a professional tone",
            app: "Forms",
            tab: "incident",
          },
          {
            n: "2",
            taskKey: "handbook",
            skill: "Find an answer in the employee handbook, even when you feel rushed",
            app: "Docs",
            tab: "handbook",
          },
        ],
      },
    ],
  },
  {
    key: "act2",
    title: "Act II: Shift Lead",
    jobTitle: "Shift Lead",
    color: "#e37400",
    levels: [
      {
        key: "level4",
        n: 4,
        title: "Shift Lead",
        folder: "act-2-shift-lead/level-3-shift-lead",
        lessons: [
          {
            n: "1",
            taskKey: "calendar",
            skill: "Accept a meeting invite, spot a double-booking, propose a different time",
            app: "Calendar",
            tab: "calendar",
          },
          {
            n: "2",
            taskKey: "files",
            skill: "Find a file in a shared drive and share it at view, not edit",
            app: "Drive",
            tab: "files",
          },
          {
            n: "3",
            taskKey: "spreadsheet",
            skill: "Enter numbers, read a formula total, flag one that's wrong",
            app: "Sheets",
            tab: "spreadsheet",
          },
        ],
      },
      {
        key: "level5",
        n: 5,
        title: "Reporting In",
        folder: "act-2-shift-lead/level-4-reporting-in",
        lessons: [
          {
            n: "1",
            taskKey: "make-a-copy",
            skill: "Open a view-only template, then File → Make a copy so you don't overwrite the master",
            app: "Sheets",
            tab: "spreadsheet",
          },
          {
            n: "2",
            taskKey: "status-report",
            skill: "Author a =SUM() on your copy, cc a second recipient on a status email",
            app: "Sheets + Mail",
            tab: "spreadsheet",
          },
        ],
      },
      {
        key: "level6",
        n: 6,
        title: "Covering More Ground",
        folder: "act-2-shift-lead/level-5-covering-more-ground",
        lessons: [
          {
            n: "1",
            taskKey: "triage",
            skill: "Handle two competing requests without dropping either",
            app: "Calendar + Drive",
            tab: "calendar",
          },
        ],
      },
    ],
  },
  {
    key: "act3",
    title: "Act III: Shift Supervisor",
    jobTitle: "Shift Supervisor",
    color: "#1e8e3e",
    levels: [
      {
        key: "level7",
        n: 7,
        title: "Scheduling the Team",
        folder: "act-3-shift-supervisor/level-6-scheduling-the-team",
        lessons: [
          {
            n: "1",
            taskKey: "team-schedule",
            skill: "Build part of a week's shift schedule, resolve a coverage gap",
            app: "Sheets",
            tab: "spreadsheet",
          },
        ],
      },
      {
        key: "level8",
        n: 8,
        title: "Weekly Numbers",
        folder: "act-3-shift-supervisor/level-7-weekly-numbers",
        lessons: [
          {
            n: "1",
            taskKey: "formula-check",
            skill: "Use SUM/AVERAGE, spot and fix a formula pointing at the wrong range",
            app: "Sheets",
            tab: "spreadsheet",
          },
        ],
      },
      {
        key: "level9",
        n: 9,
        title: "First Team Meeting",
        folder: "act-3-shift-supervisor/level-8-first-team-meeting",
        lessons: [
          {
            n: "1",
            taskKey: "team-meeting",
            skill: "Create a meeting invite and write a short agenda",
            app: "Calendar + Docs",
            tab: "calendar",
          },
        ],
      },
      {
        key: "level10",
        n: 10,
        title: "Under Pressure",
        folder: "act-3-shift-supervisor/level-9-under-pressure",
        lessons: [
          {
            n: "1",
            taskKey: "priority-call",
            skill: "Handle three asks at once: a complaint, a coverage gap, and a conflict",
            app: "Mail + Sheets + Calendar",
            tab: "mail",
          },
        ],
      },
    ],
  },
  {
    key: "act4",
    title: "Act IV: Assistant Manager",
    jobTitle: "Assistant Manager",
    color: "#8430ce",
    levels: [
      {
        key: "level11",
        n: 11,
        title: "An Offer",
        folder: "act-4-assistant-manager/level-10-an-offer",
        lessons: [
          {
            n: "1",
            taskKey: "college-offer",
            skill: "Read a formal offer letter, reply, add a commitment to a full calendar",
            app: "Mail + Calendar",
            tab: "mail",
          },
        ],
      },
      {
        key: "level12",
        n: 12,
        title: "The Budget",
        folder: "act-4-assistant-manager/level-11-the-budget",
        lessons: [
          {
            n: "1",
            taskKey: "budget-sheet",
            skill: "Read a budget with an IF status column and a chart, flag what's over",
            app: "Sheets",
            tab: "spreadsheet",
          },
        ],
      },
      {
        key: "level13",
        n: 13,
        title: "Reply-All",
        folder: "act-4-assistant-manager/level-12-reply-all",
        lessons: [
          {
            n: "1",
            taskKey: "reply-all",
            skill: "Decide reply vs. reply-all, edit a casual draft into a professional one",
            app: "Mail",
            tab: "mail",
          },
        ],
      },
    ],
  },
  {
    key: "act5",
    title: "Act V: Bridge (elective)",
    jobTitle: "Prepping for BHCC or Front Office",
    color: "#00897b",
    levels: [
      {
        key: "level14",
        n: 14,
        title: "Getting Ready",
        folder: "act-5-bridge/level-13-getting-ready",
        lessons: [
          {
            n: "1a",
            taskKey: "enrollment",
            skill: "Navigate a college portal, an application deadline, a document checklist",
            app: "Portal",
            tab: "portal",
            path: "a",
          },
          {
            n: "1b",
            taskKey: "appointment-scheduling",
            skill: "Book or move a patient appointment, resolve a double-booking",
            app: "Calendar",
            tab: "calendar",
            path: "b",
          },
        ],
      },
      {
        key: "level15",
        n: 15,
        title: "The Paperwork",
        folder: "act-5-bridge/level-14-the-paperwork",
        lessons: [
          {
            n: "1a",
            taskKey: "financial-aid",
            skill: "Read a real award letter (PDF), find the amount and deadline",
            app: "PDF",
            path: "a",
          },
          {
            n: "1b",
            taskKey: "patient-intake",
            skill: "Process an intake form, judge who's allowed to see it",
            app: "Forms",
            tab: "incident",
            path: "b",
          },
        ],
      },
      {
        key: "level16",
        n: 16,
        title: "Staying On Top of It",
        folder: "act-5-bridge/level-15-staying-on-top-of-it",
        lessons: [
          {
            n: "1a",
            taskKey: "coursework",
            skill: "Read a syllabus, submit a short assignment on time",
            app: "Docs + Mail",
            tab: "handbook",
            path: "a",
          },
          {
            n: "1b",
            taskKey: "billing-sheet",
            skill: "Match visit codes to charges, flag a mismatch",
            app: "Sheets",
            tab: "spreadsheet",
            path: "b",
          },
        ],
      },
      {
        key: "level17",
        n: 17,
        title: "Finding a Real Answer",
        folder: "act-5-bridge/level-16-finding-a-real-answer",
        lessons: [
          {
            n: "1a",
            taskKey: "research",
            skill: "Tell a credible source from an unreliable one",
            app: "Browser",
            path: "a",
          },
          {
            n: "1b",
            taskKey: "confidentiality-call",
            skill: "Decline a plausible-sounding request for information",
            app: "Mail",
            tab: "mail",
            path: "b",
          },
        ],
      },
    ],
  },
  {
    key: "act6",
    title: "Act VI: Office Administrator",
    jobTitle: "Office Administrator (HQ)",
    color: "#c5221f",
    levels: [
      {
        key: "level18",
        n: 18,
        title: "Welcome to HQ",
        folder: "act-6-office-administrator/level-17-welcome-to-hq",
        lessons: [
          {
            n: "1",
            taskKey: "office-drive",
            skill: "Search a much bigger, nested shared drive for the right file version",
            app: "Drive",
            tab: "files",
          },
        ],
      },
      {
        key: "level19",
        n: 19,
        title: "Get Everyone in the Room",
        folder: "act-6-office-administrator/level-18-get-everyone-in-the-room",
        lessons: [
          {
            n: "1",
            taskKey: "multi-person-scheduling",
            skill: "Find a time that works across 3–4 calendars",
            app: "Calendar",
            tab: "calendar",
          },
          {
            n: "2",
            taskKey: "video-call",
            skill: "Join and run the meeting itself",
            app: "Calendar",
            tab: "calendar",
          },
        ],
      },
      {
        key: "level20",
        n: 20,
        title: "The Expense Report",
        folder: "act-6-office-administrator/level-19-the-expense-report",
        lessons: [
          {
            n: "1",
            taskKey: "expense-report",
            skill: "Match receipts to categories, catch the one that's missing",
            app: "Sheets + Drive",
            tab: "spreadsheet",
          },
        ],
      },
      {
        key: "level21",
        n: 21,
        title: "Presenting to the Team",
        folder: "act-6-office-administrator/level-20-presenting-to-the-team",
        lessons: [
          {
            n: "1",
            taskKey: "slide-deck",
            skill: "Build and present a 3-slide deck using a real number from earlier work",
            app: "Slides",
          },
        ],
      },
    ],
  },
  {
    key: "act7",
    title: "Act VII: Team Lead",
    jobTitle: "Team Lead",
    color: "#e8a317",
    levels: [
      {
        key: "level22",
        n: 22,
        title: "Run the Meeting",
        folder: "act-7-team-lead/level-21-run-the-meeting",
        lessons: [
          {
            n: "1",
            taskKey: "meeting-minutes",
            skill: "Run a meeting start to finish: agenda, notes, and a follow-up with owners",
            app: "Calendar + Docs + Mail",
            tab: "calendar",
          },
        ],
      },
      {
        key: "level23",
        n: 23,
        title: "The Review",
        folder: "act-7-team-lead/level-22-the-review",
        lessons: [
          {
            n: "1",
            taskKey: "performance-review",
            skill: "Write a fair, specific, constructive performance note",
            app: "Forms",
            tab: "incident",
          },
        ],
      },
      {
        key: "level24",
        n: 24,
        title: "Put It All Together",
        folder: "act-7-team-lead/level-23-put-it-all-together",
        lessons: [
          {
            n: "1",
            taskKey: "ops-report-packet",
            skill: "Combine a sheet number, a calendar note, and a written summary into one emailed packet",
            app: "Sheets + Calendar + Docs + Mail",
            tab: "spreadsheet",
          },
        ],
      },
      {
        key: "level25",
        n: 25,
        title: "Where You've Been",
        folder: "act-7-team-lead/level-24-where-youve-been",
        lessons: [
          {
            n: "1",
            taskKey: "portfolio-reflection",
            skill: "Review every certificate earned, reflect, and generate a shareable summary",
            app: "Desktop + certificate page",
          },
        ],
      },
    ],
  },
];
