import { describe, expect, it } from "vitest";
import { emailsForTask } from "@/lib/tasks/mail/content";
import { formatInboxTime, hasArrived } from "@/lib/story-calendar";
import { NIGHT_BEFORE, STORY_DAY_BY_LEVEL } from "@/lib/story-dates";
import { LEVELS } from "@/lib/tracks-content";

/**
 * Wave 5 F-11 and F-12: Act I's filler email had fixed labels. The same
 * email read "Yesterday" on Wednesday and on Friday, and the Spanish inbox
 * said "Yesterday", "Mon" and "Aug 18" beside "Lun". Every Act I row now has
 * a story day, and the label comes from it.
 */

type Row = { key: string; time: string; sentOn?: number; isTarget: boolean };

const ACT1_POOLS: [string, Parameters<typeof emailsForTask>[0], number[]][] = [
  // Night Before and Day 2, and the same pool is still open on Day 3.
  ["Night Before / Day 2 / Day 3", "mail-attach", [NIGHT_BEFORE, STORY_DAY_BY_LEVEL.level2, STORY_DAY_BY_LEVEL.level3]],
  ["Day 4", "mail-etiquette", [STORY_DAY_BY_LEVEL.level3a]],
  ["Day 5", "call-out-sick", [STORY_DAY_BY_LEVEL.level3a2]],
];
// Not "Mar": that is Spanish for Tuesday (martes).
const ENGLISH_IN_SPANISH = /\b(Yesterday|Mon|Tue|Wed|Thu|Fri|Sat|Sun|Jan|Feb|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\b/;

const decoys = (task: Parameters<typeof emailsForTask>[0]) =>
  (emailsForTask(task) as Row[]).filter((r) => !r.isTarget && !("story" in r && (r as { story?: boolean }).story && !("notice" in r)));

describe("Act I inbox dates follow the story", () => {
  for (const [name, task, days] of ACT1_POOLS) {
    it(`${name}: every filler email has a story day`, () => {
      for (const row of decoys(task)) expect(row.sentOn, row.key).toEqual(expect.any(Number));
    });

    for (const day of days) {
      it(`${name}, day ${day}: nothing from the future, and no English in Spanish`, () => {
        for (const row of decoys(task).filter((r) => hasArrived(r, day))) {
          expect(row.sentOn!, row.key).toBeLessThanOrEqual(day);
          const es = formatInboxTime({ sentOn: row.sentOn!, clock: row.time, today: day, lang: "es" });
          expect(es, `${row.key} on day ${day}`).not.toMatch(ENGLISH_IN_SPANISH);
        }
      });
    }
  }

  it("the same email is not 'Yesterday' on Wednesday and again on Friday", () => {
    const wed = STORY_DAY_BY_LEVEL.level2;
    const fri = STORY_DAY_BY_LEVEL.level3;
    for (const row of decoys("mail-attach")) {
      const a = formatInboxTime({ sentOn: row.sentOn!, clock: row.time, today: wed, lang: "en" });
      const b = formatInboxTime({ sentOn: row.sentOn!, clock: row.time, today: fri, lang: "en" });
      expect(a === "Yesterday" && b === "Yesterday", row.key).toBe(false);
      // A clock time means "today": it cannot be today on two different days.
      expect(/\d:\d\d/.test(a) && /\d:\d\d/.test(b), row.key).toBe(false);
    }
  });

  it("Day 3's arrival no longer calls it payday (the learner's payday is Day 6)", () => {
    const body = LEVELS.find((l) => l.key === "level3")!.levelUp!.body;
    expect(body.en).not.toMatch(/payday/i);
    expect(body.es).not.toMatch(/d[ií]a de pago/i);
  });
});
