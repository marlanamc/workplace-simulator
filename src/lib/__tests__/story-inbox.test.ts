import { describe, expect, it } from "vitest";
import type { TaskKey } from "@/lib/desktop-content";
import { LEVELS, taskKeysForLevel } from "@/lib/tracks-content";
import { storyMailsFor, storyMailsUpTo } from "@/lib/story-beats";

/**
 * The inbox must time-travel: replaying Day One shows Day One's inbox,
 * not every Maria mail the learner has since unlocked. (Regression test
 * for the replay screenshot where "find Maria's email" faced 12 unread
 * future mails, all from Maria.)
 */

/** A learner who has finished everything up to and including the calendar. */
const FAR_ALONG: TaskKey[] = LEVELS.flatMap(taskKeysForLevel).slice(
  0,
  LEVELS.flatMap(taskKeysForLevel).indexOf("calendar") + 1,
);

describe("storyMailsUpTo", () => {
  it("replaying mail-reply does not show later Maria story mails", () => {
    const mails = storyMailsUpTo("mail-reply", FAR_ALONG, {});
    expect(mails.map((m) => m.key)).toEqual([]);
  });

  it("with no active mail task, everything unlocked so far still shows", () => {
    const all = storyMailsUpTo(null, FAR_ALONG, {});
    expect(all.length).toBe(storyMailsFor(FAR_ALONG, {}).length);
    expect(all.length).toBeGreaterThan(3);
  });

  it("a first-time learner mid-Day-One sees the same thing as a replayer", () => {
    const firstTimer = storyMailsUpTo("mail-reply", ["tour"], {});
    const replayer = storyMailsUpTo("mail-reply", FAR_ALONG, {});
    expect(replayer.map((m) => m.key)).toEqual(firstTimer.map((m) => m.key));
  });

  it("every story mail's unlockAfter task exists in the curriculum order", () => {
    const order = LEVELS.flatMap(taskKeysForLevel);
    for (const mail of storyMailsFor(order, {})) {
      expect(order, `story mail "${mail.key}" unlocks after unknown task "${mail.unlockAfter}"`).toContain(mail.unlockAfter);
    }
  });
});
