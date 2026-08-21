export default function ProgressBar({ value, max }: { value: number; max: number }) {
  return (
    <div className="h-1 w-full bg-[var(--border)]">
      <div
        className="h-full bg-[var(--accent)] transition-[width]"
        style={{ width: `${(Math.min(value, max) / max) * 100}%` }}
      />
    </div>
  );
}
