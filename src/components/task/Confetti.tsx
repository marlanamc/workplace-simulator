const COLORS = ["#ea4335", "#4285f4", "#fbbc04", "#34a853", "#a142f4", "#ff6d01"];

/** Deterministic pseudo-random in [0, 1) - same output on server and client, so no hydration mismatch. */
function pseudoRandom(seed: number): number {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

/**
 * Two decimals, because the browser rounds what it parses out of a style
 * attribute: React writes `26.169890576420585%`, the DOM reads back `26.1699%`,
 * and hydration reports a mismatch on every piece even though both sides
 * computed the same number. Rounding first makes the value round-trip.
 */
function round(value: number): number {
  return Math.round(value * 100) / 100;
}

/** A short confetti burst. Pieces use deterministic "randomness" (seeded by index) instead of Math.random(), so server-rendered and client-hydrated markup always match. */
export default function Confetti({ count = 32 }: { count?: number }) {
  const pieces = Array.from({ length: count }, (_, i) => {
    const r = (n: number) => pseudoRandom(i * 7.13 + n);
    return {
      left: round(r(1) * 100),
      delay: round(r(2) * 0.3),
      duration: round(1.4 + r(3) * 1.1),
      color: COLORS[Math.floor(r(4) * COLORS.length)],
      width: round(6 + r(5) * 5),
      height: round(10 + r(6) * 6),
      rotate: round(r(7) * 360),
    };
  });

  // Behind the content, not over it: falling pieces crossing a headline make
  // the one sentence on the screen harder to read, which is the opposite of
  // what a celebration is for.
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden>
      {pieces.map((p, i) => (
        <span
          key={i}
          className="absolute top-0 animate-confetti-fall rounded-[1px]"
          style={{
            left: `${p.left}%`,
            width: p.width,
            height: p.height,
            background: p.color,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            transform: `rotate(${p.rotate}deg)`,
          }}
        />
      ))}
    </div>
  );
}
