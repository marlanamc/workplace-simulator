const COLORS = ["#ea4335", "#4285f4", "#fbbc04", "#34a853", "#a142f4", "#ff6d01"];

/** Deterministic pseudo-random in [0, 1) — same output on server and client, so no hydration mismatch. */
function pseudoRandom(seed: number): number {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

/** A short confetti burst. Pieces use deterministic "randomness" (seeded by index) instead of Math.random(), so server-rendered and client-hydrated markup always match. */
export default function Confetti({ count = 32 }: { count?: number }) {
  const pieces = Array.from({ length: count }, (_, i) => {
    const r = (n: number) => pseudoRandom(i * 7.13 + n);
    return {
      left: r(1) * 100,
      delay: r(2) * 0.3,
      duration: 1.4 + r(3) * 1.1,
      color: COLORS[Math.floor(r(4) * COLORS.length)],
      width: 6 + r(5) * 5,
      height: 10 + r(6) * 6,
      rotate: r(7) * 360,
    };
  });

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
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
