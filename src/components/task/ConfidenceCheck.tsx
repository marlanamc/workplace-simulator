import type { ConfidenceOption } from "@/lib/task-types";

export default function ConfidenceCheck({
  question,
  options,
  selected,
  onSelect,
}: {
  question: string;
  options: ConfidenceOption[];
  selected: string | null;
  onSelect: (reply: string) => void;
}) {
  return (
    <div>
      <div className="mb-2.5 text-[15px] font-medium">{question}</div>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <button
            key={o.label}
            onClick={() => onSelect(o.reply)}
            className="min-h-[44px] rounded-full border px-4 text-[14px] font-medium cursor-pointer"
            style={
              selected === o.reply
                ? { background: "#3c4043", color: "#fff", borderColor: "#3c4043" }
                : { background: "#fff", color: "var(--text-primary)", borderColor: "var(--border)" }
            }
          >
            {o.label}
          </button>
        ))}
      </div>
      {selected && (
        <div className="mt-3 rounded-lg bg-[var(--accent-tint)] px-3.5 py-3 text-[14px] leading-relaxed text-[#0b3d78]">
          {selected}
        </div>
      )}
    </div>
  );
}
