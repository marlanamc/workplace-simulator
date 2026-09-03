import { describe, expect, it } from "vitest";
import { SCHEDULE, SWAP_OPTIONS, PERSONAL_CALENDAR } from "@/lib/tasks/schedule/content";
import { TRACKS, TASK_LOCATIONS, type PortalSection } from "@/lib/tracks-content";
import { storyMailsFor } from "@/lib/story-beats";
import { LEVELS, taskKeysForLevel } from "@/lib/tracks-content";

/**
 * Level 2 is one cause and one effect: notice the clash, then ask for the fix.
 * The pieces that make that true are spread across content, routing, and the
 * story chain, and every one of them fails quietly — a learner just ends up
 * being taught something the next screen contradicts.
 */

const ALL_TASKS = LEVELS.flatMap((l) => taskKeysForLevel(l));

describe("the schedule/swap content", () => {
  it("exactly one shift clashes, and the personal calendar explains why", () => {
    const clashing = SCHEDULE.filter((d) => d.conflict);
    expect(clashing).toHaveLength(1);
    const event = PERSONAL_CALENDAR.find((e) => e.date === clashing[0].date);
    expect(event, "the clashing shift needs a personal event on the same date").toBeDefined();
  });

  it("only one swap option actually clears the appointment", () => {
    expect(SWAP_OPTIONS.filter((o) => o.works)).toHaveLength(1);
  });

  it("the working option is a later shift on the SAME day as the clash", () => {
    const clashing = SCHEDULE.find((d) => d.conflict)!;
    const works = SWAP_OPTIONS.find((o) => o.works)!;
    // Same day: the cafe still needs Thursday covered.
    expect(works.label.en).toContain(clashing.day);
    // Later: the doctor is at 11 AM, so a PM start is the whole point.
    expect(works.label.en).toMatch(/\b\d{1,2}:\d{2} PM –/);
  });

  it("every wrong swap option says why it is wrong, in both languages", () => {
    for (const o of SWAP_OPTIONS.filter((o) => !o.works)) {
      expect(o.wrongHint?.en, `${o.key} needs an English hint`).toBeTruthy();
      expect(o.wrongHint?.es, `${o.key} needs a Spanish hint`).toBeTruthy();
    }
  });
});

describe("one voice for messaging the manager", () => {
  it("call-out-sick is written in Mail, not a portal section", () => {
    const loc = TASK_LOCATIONS["call-out-sick"];
    expect(loc?.tab).toBe("mail");
    expect(loc?.section).toBeUndefined();
  });

  it("no task routes to a call-out-sick portal section any more", () => {
    const sections = Object.values(TASK_LOCATIONS)
      .map((l) => l?.section)
      .filter(Boolean) as PortalSection[];
    expect(sections).not.toContain("call-out-sick" as PortalSection);
  });
});

describe("Level 2 and Level 3 membership", () => {
  const track = (key: string) => TRACKS.find((t) => t.key === key)!;

  it("the first week is one task: notice it, then ask", () => {
    expect(track("first-week").taskKeys).toEqual(["schedule"]);
  });

  it("the sick day waits until the learner has a track record", () => {
    expect(track("payday-trouble").taskKeys).not.toContain("call-out-sick");
    expect(track("first-week").taskKeys).not.toContain("call-out-sick");
    expect(track("sick-day").taskKeys).toEqual(["call-out-sick"]);
  });

  it("the email-shape lesson comes right before the sick call", () => {
    expect(track("mail-etiquette").taskKeys).toEqual(["mail-etiquette"]);
    const order = ALL_TASKS;
    expect(order.indexOf("mail-etiquette")).toBeLessThan(order.indexOf("call-out-sick"));
  });
});

describe("the story chain still connects", () => {
  it("Maria answers the swap request, which completes the schedule task", () => {
    const mails = storyMailsFor(ALL_TASKS, {});
    const swapReply = mails.find((m) => m.key === "story-schedule");
    expect(swapReply?.unlockAfter).toBe("schedule");
  });

  it("nothing references being sick before the sick day happens", () => {
    const mails = storyMailsFor(ALL_TASKS, {});
    const sickIndex = ALL_TASKS.indexOf("call-out-sick");
    for (const mail of mails) {
      if (!mail.body) continue;
      const at = ALL_TASKS.indexOf(mail.unlockAfter);
      if (at >= sickIndex) continue;
      const text = mail.body.en.join(" ").toLowerCase();
      expect(text, `"${mail.key}" mentions being sick before the call-out task`).not.toContain("sick");
    }
  });

  it("the call-out gets its own reply from Maria", () => {
    const mails = storyMailsFor(ALL_TASKS, {});
    expect(mails.find((m) => m.unlockAfter === "call-out-sick")).toBeDefined();
  });
});
