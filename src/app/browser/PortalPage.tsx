"use client";

import { useState } from "react";
import ScheduleTask from "./ScheduleTask";
import TimeclockTask from "./TimeclockTask";
import PaystubTask from "./PaystubTask";
import { TAB_ICONS, CircleGlyph } from "@/lib/icons";
import { useWindowManager } from "@/lib/window-manager";
import type { PortalSection } from "@/lib/tracks-content";

type Section = PortalSection;

const SECTIONS: { key: Section; label: string }[] = [
  { key: "schedule", label: "Schedule" },
  { key: "timeclock", label: "Time Clock" },
  { key: "paystubs", label: "Pay Stubs" },
];

function isPortalSection(value: string | null): value is Section {
  return value === "schedule" || value === "timeclock" || value === "paystubs";
}

export default function PortalPage() {
  const { portalSection, portalSectionToken } = useWindowManager();
  const [section, setSection] = useState<Section>(() =>
    isPortalSection(portalSection) ? portalSection : "schedule",
  );
  const [lastToken, setLastToken] = useState(portalSectionToken);
  if (portalSectionToken !== lastToken) {
    setLastToken(portalSectionToken);
    if (isPortalSection(portalSection)) setSection(portalSection);
  }

  return (
    <div className="flex h-full min-h-0 flex-col bg-[var(--surface-muted)] text-[15px] text-[var(--text-primary)]">
      <div className="flex items-center gap-3 border-b border-[var(--border)] bg-white px-4 py-3">
        <CircleGlyph icon={TAB_ICONS.portal} color="#8430ce" size={28} />
        <span className="text-[15px] font-medium">Employee Portal</span>
      </div>

      <div className="flex gap-1 border-b border-[var(--border)] bg-white px-4 pt-2">
        {SECTIONS.map((s) => (
          <button
            key={s.key}
            onClick={() => setSection(s.key)}
            className={`rounded-t-lg px-4 py-2.5 text-[14px] font-medium cursor-pointer ${
              section === s.key
                ? "border-b-2 border-[#8430ce] text-[#8430ce]"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-6">
        {section === "schedule" && <ScheduleTask />}
        {section === "timeclock" && <TimeclockTask />}
        {section === "paystubs" && <PaystubTask />}
      </div>
    </div>
  );
}
