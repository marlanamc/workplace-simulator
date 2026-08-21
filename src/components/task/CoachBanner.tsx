export default function CoachBanner({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2 bg-[var(--accent-tint)] px-4 py-2.5 text-[14px] text-[#0b3d78]">
      <span aria-hidden>→</span>
      {text}
    </div>
  );
}
