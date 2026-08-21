"use client";

import { useState } from "react";
import { PAY_STUBS } from "@/lib/portal-content";
import ScheduleTask from "./ScheduleTask";
import TimeclockTask from "./TimeclockTask";

type Section = "schedule" | "timeclock" | "paystubs";

const SECTIONS: { key: Section; label: string }[] = [
  { key: "schedule", label: "Schedule" },
  { key: "timeclock", label: "Time Clock" },
  { key: "paystubs", label: "Pay Stubs" },
];

export default function PortalPage() {
  const [section, setSection] = useState<Section>("schedule");
  const [openStub, setOpenStub] = useState<string | null>(null);

  return (
    <div className="flex h-full min-h-0 flex-col bg-[var(--surface-muted)] text-[15px] text-[var(--text-primary)]">
      <div className="flex items-center gap-3 border-b border-[var(--border)] bg-white px-4 py-3">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#8430ce] text-[13px] text-white">
          ▦
        </span>
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

        {section === "paystubs" && (
          <div>
            <h2 className="mb-4 text-[19px] font-medium">Pay stubs</h2>
            <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-white">
              {PAY_STUBS.map((p, i) => (
                <button
                  key={p.id}
                  onClick={() => setOpenStub(p.id)}
                  className={`flex w-full items-center justify-between px-4 py-3.5 text-left hover:bg-[var(--surface-muted)] cursor-pointer ${i !== 0 ? "border-t border-[var(--border)]" : ""}`}
                >
                  <div>
                    <div className="text-[14px] font-medium text-[var(--text-primary)]">{p.period}</div>
                    <div className="text-[13px] text-[var(--text-tertiary)]">Paid {p.payDate}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[14px] font-medium text-[var(--text-primary)]">{p.net}</div>
                    <div className="text-[13px] text-[var(--text-tertiary)]">net pay</div>
                  </div>
                </button>
              ))}
            </div>

            {openStub && (
              <div
                className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-6"
                onClick={() => setOpenStub(null)}
              >
                <div
                  className="w-full max-w-[420px] rounded-2xl bg-white p-6 shadow-2xl animate-fade-up"
                  onClick={(e) => e.stopPropagation()}
                >
                  {(() => {
                    const stub = PAY_STUBS.find((p) => p.id === openStub)!;
                    return (
                      <>
                        <h3 className="mb-4 text-[18px] font-medium">{stub.period}</h3>
                        <div className="flex flex-col gap-2 text-[14px]">
                          <div className="flex justify-between">
                            <span className="text-[var(--text-secondary)]">Pay date</span>
                            <span className="font-medium">{stub.payDate}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[var(--text-secondary)]">Gross pay</span>
                            <span className="font-medium">{stub.gross}</span>
                          </div>
                          <div className="flex justify-between border-t border-[var(--border)] pt-2">
                            <span className="text-[var(--text-secondary)]">Net pay</span>
                            <span className="font-semibold">{stub.net}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => setOpenStub(null)}
                          className="mt-5 inline-flex min-h-[44px] w-full items-center justify-center rounded-full border border-[var(--border)] text-[14px] font-medium text-[var(--text-primary)] cursor-pointer"
                        >
                          Close
                        </button>
                      </>
                    );
                  })()}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
