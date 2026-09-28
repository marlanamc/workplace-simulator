"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import type { TaskKey } from "@/lib/desktop-content";
import type { Lang } from "@/lib/task-types";
import { DEVICE_KEY, storage } from "@/lib/storage";
import { SUMMARY_COPY, buildCourseSummary, formatCourseSummary } from "@/lib/portfolio-summary";
import { REFLECTION_COPY } from "@/lib/tasks/portfolio-reflection/content";
import { copyText, downloadText, summaryFilename } from "@/lib/share-text";
import SummarySections from "@/components/SummarySections";

const noSubscribe = () => () => {};

export default function SummaryView({
  displayName,
  classCode,
  completedTaskKeys,
  nowIso,
  langParam,
}: {
  displayName: string;
  classCode: string;
  completedTaskKeys: TaskKey[];
  nowIso: string;
  langParam: Lang | null;
}) {
  // The language and the time zone live on this device, so both are read
  // after hydration. Until then the page shows without a date.
  const isClient = useSyncExternalStore(noSubscribe, () => true, () => false);
  const lang: Lang = langParam ?? (isClient && storage.getString(DEVICE_KEY.lang) === "es" ? "es" : "en");
  const [status, setStatus] = useState("");
  const c = REFLECTION_COPY[lang];

  const summary = buildCourseSummary({
    displayName,
    classCode,
    now: isClient ? new Date(nowIso) : undefined,
    completedTaskKeys,
    lang,
  });
  const text = formatCourseSummary(summary);

  const copy = async () => setStatus((await copyText(text)) ? c.copied : c.copyFailed);
  const download = () => setStatus(downloadText(text, summaryFilename(lang)) ? c.downloadStarted : c.downloadFailed);

  const button =
    "inline-flex min-h-11 cursor-pointer items-center rounded-full border border-[#dadce0] bg-white px-5 text-[15px] font-medium text-accent hover:bg-surface-muted";

  return (
    <main lang={lang} className="min-h-screen bg-[#f1f3f4] px-4 py-8 text-[#202124] print:bg-white print:p-0" style={{ fontFamily: "Roboto, Arial, sans-serif" }}>
      <div className="mx-auto flex max-w-[680px] flex-col gap-4">
        <Link href="/" className="w-fit text-[15px] font-medium text-[#0b57d0] underline underline-offset-4 print:hidden">
          {SUMMARY_COPY.backToDesk[lang]}
        </Link>
        <article data-testid="course-summary" className="rounded-2xl border border-[#dadce0] bg-white p-6 print:border-0 print:p-0">
          <h1 className="m-0 text-[24px] font-medium leading-tight">{summary.title}</h1>
          <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-[15px]">
            {summary.details.map((row) => (
              <div key={row.label} className="contents">
                <dt className="text-[#5f6368]">{row.label}</dt>
                <dd className="m-0 font-medium">{row.value}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-3 text-[14px] text-[#5f6368]">{summary.honestLine}</p>
          <p className="mt-1 text-[14px] text-[#5f6368]">{summary.daysLine}</p>

          <h2 className="mt-5 text-[13px] font-medium uppercase tracking-wide text-[#5f6368]">{summary.canDoHeading}</h2>
          <div className="mt-2">
            <SummarySections sections={summary.sections} emptyLabel={SUMMARY_COPY.nothingYet[lang]} />
          </div>
        </article>

        <div className="flex flex-wrap gap-3 print:hidden">
          <button type="button" onClick={copy} className={button}>{c.copySummary}</button>
          <button type="button" onClick={download} className={button}>{c.downloadSummary}</button>
          <button type="button" onClick={() => window.print()} className={button}>{SUMMARY_COPY.print[lang]}</button>
        </div>
        <p role="status" aria-live="polite" className="m-0 min-h-6 text-[15px] text-[#3c4043] print:hidden">
          {status}
        </p>
      </div>
    </main>
  );
}
