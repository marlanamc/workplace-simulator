"use client";

import { useState } from "react";
import { useProgress } from "@/lib/progress-context";
import type { Localized } from "@/lib/task-types";
import ScheduleTask from "./ScheduleTask";
import TimeclockTask from "./TimeclockTask";
import PaystubTask from "./PaystubTask";
import SwapRequestTask from "./SwapRequestTask";
import ShiftReviewTask from "./ShiftReviewTask";
import { TAB_ICONS, CircleGlyph } from "@/lib/icons";
import { useWindowManager } from "@/lib/window-manager";
import type { PortalSection } from "@/lib/tracks-content";

type Section = PortalSection;

/** The Portal's own chrome. Every Act I Portal task is reached through this
 *  strip, and it was English in Spanish mode. */
const PORTAL_TITLE: Localized<string> = { en: "Employee Portal", es: "Portal del empleado" };

const SECTIONS: { key: Section; label: Localized<string> }[] = [
  { key: "schedule", label: { en: "Schedule", es: "Horario" } },
  { key: "swap-request", label: { en: "Shift Swap", es: "Cambio de turno" } },
  { key: "timeclock", label: { en: "Time Clock", es: "Reloj checador" } },
  { key: "paystubs", label: { en: "Pay Stubs", es: "Recibos de pago" } },
  { key: "shift-review", label: { en: "Shift notes", es: "Notas del turno" } },
];

const PORTAL_SECTIONS = new Set<string>(SECTIONS.map((s) => s.key));

function isPortalSection(value: string | null): value is Section {
  return !!value && PORTAL_SECTIONS.has(value);
}

export default function PortalPage() {
  const { lang } = useProgress();
  const { portalSection, portalSectionToken } = useWindowManager();
  const [section, setSection] = useState<Section>(() =>
    isPortalSection(portalSection) ? portalSection : "schedule",
  );
  // The day picked on the Schedule tab, carried over so Shift Swap opens
  // with it already chosen instead of asking the learner to find it twice.
  const [swapDay, setSwapDay] = useState<string | null>(null);
  const [lastToken, setLastToken] = useState(portalSectionToken);
  if (portalSectionToken !== lastToken) {
    setLastToken(portalSectionToken);
    if (isPortalSection(portalSection)) setSection(portalSection);
  }

  return (
    <div className="flex h-full min-h-0 flex-col bg-surface-muted text-[15px] text-text-primary">
      <div className="flex items-center gap-3 border-b border-border bg-white px-4 py-3">
        <CircleGlyph icon={TAB_ICONS.portal} color="#8430ce" size={28} />
        <span className="text-[15px] font-medium">{PORTAL_TITLE[lang]}</span>
      </div>

      <div className="flex gap-1 border-b border-border bg-white px-4 pt-2">
        {SECTIONS.map((s) => (
          <button
            key={s.key}
            onClick={() => setSection(s.key)}
            className={`rounded-t-lg px-4 py-2.5 text-[14px] font-medium cursor-pointer ${
              section === s.key
                ? "border-b-2 border-[#8430ce] text-[#8430ce]"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            {s.label[lang]}
          </button>
        ))}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-6">
        {section === "schedule" && (
          <ScheduleTask
            onRequestSwap={(day) => {
              setSwapDay(day);
              setSection("swap-request");
            }}
          />
        )}
        {section === "swap-request" && <SwapRequestTask initialShift={swapDay} />}
        {section === "timeclock" && <TimeclockTask />}
        {section === "paystubs" && <PaystubTask />}
        {section === "shift-review" && <ShiftReviewTask />}
      </div>
    </div>
  );
}
