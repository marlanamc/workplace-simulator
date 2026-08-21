import { getBadges, getLearnerById } from "@/lib/db/queries";
import { TRACKS } from "@/lib/tracks-content";
import { SKILLS } from "@/lib/skills";
import type { TaskKey } from "@/lib/desktop-content";
import CertificatePrintButton from "./CertificatePrintButton";

export default async function CertificatePage({
  params,
}: {
  params: Promise<{ learnerId: string }>;
}) {
  const { learnerId } = await params;
  const learner = await getLearnerById(learnerId);

  if (!learner) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--surface-muted)] p-6">
        <div className="max-w-[420px] rounded-2xl border border-[var(--border)] bg-white p-8 text-center">
          <h1 className="text-[19px] font-medium">Certificate not found</h1>
          <p className="mt-2 text-[14px] text-[var(--text-secondary)]">
            This link doesn&apos;t match a learner in the Workplace Simulator. Double-check the URL, or ask your teacher
            for the right link.
          </p>
        </div>
      </div>
    );
  }

  const displayName = learner.displayName;

  const badges = await getBadges(learnerId);
  const earnedAtByTrack = new Map(
    badges.filter((b) => b.badgeKey.startsWith("track:")).map((b) => [b.badgeKey.slice("track:".length), b.awardedAt])
  );
  const earnedTracks = TRACKS.filter((t) => earnedAtByTrack.has(t.key));

  return (
    <div className="flex min-h-screen justify-center bg-[var(--surface-muted)] p-6 print:bg-white print:p-0">
      <div className="w-full max-w-[720px]">
        <div className="mb-5 flex items-center justify-between print:hidden">
          <span className="text-[13px] text-[var(--text-tertiary)]">Workplace Simulator</span>
          <CertificatePrintButton />
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-white p-8 sm:p-10 print:rounded-none print:border-0 print:p-0">
          <div className="mb-8 flex items-center gap-3 border-b border-[var(--border)] pb-6">
            <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#123a5c] text-[15px] font-bold text-white">
              HC
            </span>
            <div>
              <div className="text-[15px] font-semibold tracking-wide text-[#123a5c]">HARBORSIDE CAFE</div>
              <div className="text-[12px] text-[var(--text-tertiary)]">Workplace Simulator — training record</div>
            </div>
          </div>

          <div className="mb-8">
            <div className="text-[12px] font-semibold uppercase tracking-wide text-[var(--accent)]">
              Certificate of Completion
            </div>
            <h1 className="mt-1.5 text-[28px] font-medium leading-tight">{displayName}</h1>
          </div>

          {earnedTracks.length === 0 ? (
            <p className="text-[15px] text-[var(--text-secondary)]">
              No certificates earned yet — {displayName} hasn&apos;t completed a full level in the simulator.
            </p>
          ) : (
            <div className="flex flex-col gap-6">
              {earnedTracks.map((track) => {
                const awardedAt = earnedAtByTrack.get(track.key)!;
                return (
                  <div key={track.key} className="rounded-xl border border-[var(--border)] p-5">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <h2 className="text-[17px] font-medium">🏆 {track.title}</h2>
                      <span className="text-[13px] text-[var(--text-tertiary)]">
                        Earned{" "}
                        {new Date(awardedAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <p className="mt-1 text-[14px] text-[var(--text-secondary)]">{track.subtitle}</p>
                    <ul className="mt-3 flex flex-col gap-1.5">
                      {track.taskKeys.map((taskKey: TaskKey) => (
                        <li key={taskKey} className="flex items-start gap-2 text-[14px] leading-relaxed">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--success)]" />
                          {SKILLS[taskKey]}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          )}

          <p className="mt-10 border-t border-[var(--border)] pt-4 text-[12px] leading-relaxed text-[var(--text-tertiary)]">
            This certificate reflects skills practiced in the Harborside Cafe Workplace Simulator, a digital-literacy
            training tool. It is not an accredited certification.
          </p>
        </div>
      </div>
    </div>
  );
}
