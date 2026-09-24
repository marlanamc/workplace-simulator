import { describe, expect, it } from "vitest";
import { LEVELS, taskKeysForLevel, TASK_INFO, actForLevel } from "@/lib/tracks-content";
import { CAST } from "@/lib/cast";
import { ACT_INTROS, type ActIntroActKey } from "@/lib/act-intro-content";
import { PATIENT, INTAKE_COPY } from "@/lib/tasks/patient-intake/content";
import { PATIENT as APPOINTMENT_PATIENT } from "@/lib/tasks/appointment-scheduling/content";
import { BILLING_ROWS } from "@/lib/tasks/billing-sheet/content";
import { SHIFT_MOMENT } from "@/lib/story-beats";
import { dayNumber, dayTitle, dayLabel, dayInAct, workdaysInAct } from "@/lib/shift-spine";
import { JOB_CARD_COPY, JOB_CARD_LINE, shouldShowListIntro } from "@/lib/job-card-content";
import { tourEventIntro } from "@/lib/tasks/tour/content";
import { bodyForTask } from "@/lib/tasks/mail/content";

/**
 * The story has to hold together for someone reading it once, in order, with
 * no idea how the code is organized. These are the three ways it fell apart
 * before: a counter that reset without saying what it counted, a level number
 * that skipped, and a calendar that ran backwards.
 */

/** Weekday order within a work week, for comparing two story moments. */
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

function weekdayOf(moment: string): number {
  const hit = DAYS.findIndex((d) => moment.includes(d));
  return hit;
}

describe("the story calendar", () => {
  it("never runs backwards inside a single day", () => {
    for (const level of LEVELS) {
      const moments = taskKeysForLevel(level).map((k) => ({
        key: k,
        day: weekdayOf(SHIFT_MOMENT[k].en),
        text: SHIFT_MOMENT[k].en,
      }));
      const dated = moments.filter((m) => m.day >= 0);
      for (let i = 1; i < dated.length; i++) {
        expect(
          dated[i].day,
          `${dayTitle(level, "en")}: "${dated[i].text}" (${dated[i].key}) comes after ` +
            `"${dated[i - 1].text}" (${dated[i - 1].key}) but is an earlier weekday`,
        ).toBeGreaterThanOrEqual(dated[i - 1].day);
      }
    }
  });

  it("gives every task a moment in both languages", () => {
    for (const key of Object.keys(TASK_INFO) as (keyof typeof TASK_INFO)[]) {
      expect(SHIFT_MOMENT[key]?.en, `${key} has no English moment`).toBeTruthy();
      expect(SHIFT_MOMENT[key]?.es, `${key} has no Spanish moment`).toBeTruthy();
    }
  });
});

describe("day numbering", () => {
  it("is sequential with no letter suffixes or gaps", () => {
    LEVELS.forEach((level, i) => {
      expect(dayNumber(level)).toBe(i);
    });
  });

  it("never bakes a number into a level title, in either language", () => {
    for (const level of LEVELS) {
      for (const lang of ["en", "es"] as const) {
        expect(
          level.title[lang],
          `"${level.title[lang]}" carries its own number — numbering comes from LEVELS order`,
        ).not.toMatch(/^(Level|Day|Nivel|D[ií]a)\s*\d/i);
      }
    }
  });

  it("labels the orientation level by name, not as a day", () => {
    expect(dayTitle(LEVELS[0], "en")).toBe("How this works");
    expect(dayLabel(LEVELS[0], "en")).toBe("How this works");
    // The very first Job Card kicker a Spanish learner sees. It used to read
    // "How this works" because Level.title was an English-only string.
    expect(dayTitle(LEVELS[0], "es")).toBe("Cómo funciona esto");
    expect(dayLabel(LEVELS[0], "es")).toBe("Cómo funciona esto");
  });

  it("labels the opening as the night before, in both languages", () => {
    expect(dayTitle(LEVELS[1], "en")).toBe("The Night Before");
    expect(dayLabel(LEVELS[1], "en")).toBe("The Night Before");
    expect(dayLabel(LEVELS[1], "es")).toBe("La noche anterior");
  });

  it("labels Act I workdays as Day N of 6 in both languages", () => {
    const act1Workdays = LEVELS.filter((level) => actForLevel(level)?.key === "act1" && dayNumber(level) > 0);
    expect(act1Workdays).toHaveLength(6);
    expect(workdaysInAct(act1Workdays[0])).toHaveLength(6);
    act1Workdays.forEach((level, i) => {
      const n = i + 1;
      expect(dayInAct(level)).toBe(n);
      expect(dayLabel(level, "en")).toBe(level.key === "level1" ? "The Night Before" : `Day ${n} of 6`);
      expect(dayLabel(level, "es")).toBe(level.key === "level1" ? "La noche anterior" : `Día ${n} de 6`);
    });
  });

  it("keeps the Job Card meter aligned with Act I workday count", () => {
    const shifts = workdaysInAct(LEVELS[1]).length;
    expect(shifts).toBe(6);
    expect(dayLabel(LEVELS[2], "en")).toContain(`of ${shifts}`);
  });

  it("still tells a new hire this week has 5 cafe shifts (schedule flavor, not sitting count)", () => {
    expect(tourEventIntro("en", "Ana").subheadline).toContain("5 shifts");
    expect(tourEventIntro("es", "Ana").subheadline).toContain("5 turnos");
    expect(bodyForTask("mail-reply", "en", "Ana").plain.join(" ")).toContain("5 shifts");
    expect(bodyForTask("mail-reply", "es", "Ana").plain.join(" ")).toContain("5 turnos");
  });
});

describe("the task counter", () => {
  it("says what it is counting when there is more than one task", () => {
    for (const lang of ["en", "es"] as const) {
      expect(JOB_CARD_COPY[lang].jobOf(2, 4)).toMatch(/2/);
      expect(JOB_CARD_COPY[lang].jobOf(2, 4)).toMatch(/4/);
    }
  });

  it("shows nothing at all on a one-task day", () => {
    // "Task 1 of 1" is a counter that communicates nothing; the day's name
    // carries the position instead.
    for (const lang of ["en", "es"] as const) {
      expect(JOB_CARD_COPY[lang].jobOf(1, 1)).toBe("");
    }
  });
});

describe("the Day One list intro", () => {
  const base = {
    storyFlags: {},
    completedTaskKeys: ["tour"],
    levelKey: "level1",
    celebrating: false,
  };

  it("waits until the walkthrough is done and Day One has started", () => {
    expect(shouldShowListIntro(base)).toBe(true);
    expect(shouldShowListIntro({ ...base, completedTaskKeys: [] })).toBe(false);
    expect(shouldShowListIntro({ ...base, levelKey: "level0" })).toBe(false);
  });

  it("does not talk over the level-up card, and does not repeat", () => {
    expect(shouldShowListIntro({ ...base, celebrating: true })).toBe(false);
    expect(shouldShowListIntro({ ...base, storyFlags: { "list-intro-seen": "true" } })).toBe(false);
  });
});

/**
 * The fourth way the story fell apart: a Job Card said "Maria said welcome"
 * on the very first day, when nothing had yet said who Maria was. A name with
 * no role attached is just a stranger, and the learner is left wondering who
 * they are supposed to be writing to.
 *
 * A person is "introduced" when some screen the learner sees *before* that
 * card attaches a role to the name — a manager line, an act intro, a story
 * beat that says what they do.
 */
describe("the cast", () => {
  /** First names, which is how the cards refer to people. */
  const firstNameOf = (full: string) => full.split(" ")[0];

  it("never names a person on a Job Card before introducing them", () => {
    // Surfaces that introduce someone with a role, and the earliest level
    // index by which the learner has seen them.
    const introducedBy = new Map<string, number>();

    // The level-0 first-day screen names the Act I manager with her title.
    for (const lang of ["en", "es"] as const) {
      const intro = tourEventIntro(lang, "Ana").subheadline ?? "";
      for (const m of Object.values(CAST)) {
        if (m.title && intro.includes(m.name)) introducedBy.set(firstNameOf(m.name), 0);
      }
    }

    // Each act intro names that act's manager before any of its levels run.
    for (const level of LEVELS) {
      const act = actForLevel(level);
      const actKey = act?.key;
      if (!actKey || !(actKey in ACT_INTROS)) continue;
      const idx = LEVELS.findIndex((l) => l.key === act.levelKeys[0]);
      const line = ACT_INTROS[actKey as ActIntroActKey].manager.en;
      for (const m of Object.values(CAST)) {
        if (!line.includes(m.name)) continue;
        const prev = introducedBy.get(firstNameOf(m.name));
        if (prev === undefined || idx < prev) introducedBy.set(firstNameOf(m.name), idx);
      }
    }

    const problems: string[] = [];
    LEVELS.forEach((level, levelIdx) => {
      for (const key of taskKeysForLevel(level)) {
        const line = JOB_CARD_LINE[key]?.en ?? TASK_INFO[key]?.dispatch.en;
        if (!line) continue;
        for (const m of Object.values(CAST)) {
          const first = firstNameOf(m.name);
          if (!new RegExp(`\\b${first}\\b`).test(line)) continue;
          // A line that names the relationship right next to the name
          // introduces the person on the spot — "Reply to your coworker,
          // Darnell." That is the pattern we want, not a violation.
          const rolePrefix = new RegExp(
            `\\b(your|our|the|a|new)\\b[^.]{0,24}\\b${first}\\b`,
            "i",
          );
          if (rolePrefix.test(line)) {
            // This card introduces them; everyone downstream may use the
            // bare name.
            const prev = introducedBy.get(first);
            if (prev === undefined || levelIdx < prev) introducedBy.set(first, levelIdx);
            continue;
          }
          const known = introducedBy.get(first);
          if (known === undefined || known > levelIdx) {
            problems.push(
              `${dayTitle(level, "en")} (${key}): "${line}" names ${first}, ` +
                `but no screen before this level says who ${first} is`,
            );
          }
        }
      }
    });

    expect(problems, problems.join("\n")).toEqual([]);
  });

  it("does not reuse a first name for two different people", () => {
    // cast.test.ts already pins *full* names as unique — which is precisely
    // how two Sams and two Jordans once coexisted. Learners see first names.
    const byFirst = new Map<string, string[]>();
    for (const m of Object.values(CAST)) {
      const first = firstNameOf(m.name);
      byFirst.set(first, [...(byFirst.get(first) ?? []), m.name]);
    }
    for (const [first, fulls] of byFirst) {
      expect(fulls, `${fulls.join(" and ")} share the first name ${first}`).toHaveLength(1);
    }
  });

  it("keeps walk-on characters clear of the cast's names", () => {
    // Walk-ons are hardcoded in task content rather than CAST. A walk-on that
    // borrows a cast name reads as the same person turning up in a new job —
    // either half of the name is enough to cause it.
    const castFirst = new Set(Object.values(CAST).map((m) => firstNameOf(m.name)));
    const castLast = new Set(
      Object.values(CAST)
        .map((m) => m.name.split(" ").slice(1).join(" "))
        .filter(Boolean),
    );
    // Strip a leading honorific so "Nurse Elena" is compared as "Elena".
    const bare = (w: string) => w.replace(/^(Nurse|Dr\.?)\s+/i, "").split(" · ")[0];
    const walkOns = [
      PATIENT.name,
      INTAKE_COPY.en.coworkerName,
      INTAKE_COPY.en.careTeamName,
      APPOINTMENT_PATIENT.en,
    ];
    for (const w of walkOns) {
      const parts = bare(w).split(" ");
      const first = parts[0];
      const last = parts.slice(1).join(" ");
      expect(
        castFirst.has(first),
        `walk-on "${w}" reuses the cast first name ${first}`,
      ).toBe(false);
      if (last) {
        expect(
          castLast.has(last),
          `walk-on "${w}" reuses the cast surname ${last}`,
        ).toBe(false);
      }
    }
  });

  it("keeps the two clinic patients as one person", () => {
    // The same patient is named in patient-intake, appointment-scheduling and
    // billing-sheet. They drifted apart once already.
    expect(APPOINTMENT_PATIENT.en).toBe(PATIENT.name);
    expect(APPOINTMENT_PATIENT.es).toBe(PATIENT.name);
    expect(BILLING_ROWS.some((r) => r.patient === PATIENT.name)).toBe(true);
  });
});
