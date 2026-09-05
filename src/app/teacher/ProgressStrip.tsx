import type { ActProgress } from "./progress";

/** Seven pips, one per act: filled = finished, ringed = where they are now,
 *  hollow = not there yet, faint dash = not on their path. */
export default function ProgressStrip({ acts }: { acts: ActProgress[] }) {
  return (
    <div className="flex items-center gap-1.5">
      {acts.map((a) => {
        const title = `Act ${a.numeral}: ${a.shortTitle} — ${
          a.state === "off-path" ? "not on this path" : `${a.done}/${a.total} done`
        }`;
        if (a.state === "off-path") {
          return (
            <span key={a.key} title={title} className="h-2 w-2 rounded-full bg-white/8" />
          );
        }
        return (
          <span
            key={a.key}
            title={title}
            className="h-2.5 w-2.5 rounded-full"
            style={{
              background: a.state === "done" ? a.color : a.state === "current" ? "transparent" : "rgba(255,255,255,0.12)",
              boxShadow: a.state === "current" ? `inset 0 0 0 2px ${a.color}` : undefined,
            }}
          />
        );
      })}
    </div>
  );
}
