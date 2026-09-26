import type { ReactNode } from "react";
import type { PdfDocument } from "@/lib/pdf-content";

/** A real US Letter sheet: 8.5in × 11in, ~1in margins, 12pt Times. Zoom scales the whole page. */
export const LETTER = { widthIn: 8.5, heightIn: 11 } as const;

export function PdfPage({ children, footer }: { children: ReactNode; footer?: string }) {
  return (
    <div
      className="relative box-border h-full w-full"
      style={{
        padding: "1in 1in 1.15in",
        fontFamily: '"Times New Roman", Times, Georgia, serif',
        fontSize: "12pt",
        lineHeight: 1.35,
        color: "#1a1a1a",
      }}
    >
      {children}
      <div
        className="absolute flex items-center justify-between border-t border-[#1a1a1a]/30 text-[9pt] text-[#444]"
        style={{ left: "1in", right: "1in", bottom: "0.55in", paddingTop: "0.2in" }}
      >
        <span>{footer ?? "Harborside Cafe · Internal"}</span>
        <span>Page 1 of 1</span>
      </div>
    </div>
  );
}

export function Letterhead() {
  return (
    <div className="mb-[14pt] border-b-[1.5pt] border-[#1a1a1a] pb-[8pt]">
      <div className="text-[16pt] font-bold tracking-[0.14em]">HARBORSIDE CAFE</div>
      <div className="mt-[2pt] text-[10pt] tracking-wide text-[#333]">142 Main Street · Harborside</div>
    </div>
  );
}

function ReportPage({ doc }: { doc: Extract<PdfDocument, { kind: "report" }> }) {
  return (
    <>
      <Letterhead />
      <h1 className="mb-[16pt] text-center text-[16pt] font-bold tracking-wide">{doc.title}</h1>
      <table className="mb-[16pt] w-full border-collapse text-[12pt]">
        <tbody>
          <tr>
            {doc.meta.map((m) => (
              <td key={m.label} className="border border-[#1a1a1a] px-[8pt] py-[6pt] align-top">
                <div className="text-[9pt] font-bold">{m.label}</div>
                <div className="mt-[0.1em]">{m.value}</div>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
      <h2 className="mb-[6pt] text-[12pt] font-bold">{doc.sectionHeading}</h2>
      <ol className="m-0 flex list-decimal flex-col gap-[8pt] pl-[18pt] text-[12pt] leading-[1.35]">
        {doc.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ol>
      <p className="mt-[28pt] text-[12pt] leading-relaxed">
        Prepared by
        <br />
        <span className="italic">{doc.signedBy}</span>
      </p>
    </>
  );
}

function AwardLetterPage({ doc }: { doc: Extract<PdfDocument, { kind: "award-letter" }> }) {
  return (
    <>
      <div className="mb-[14pt] border-b-[1.5pt] border-[#1a1a1a] pb-[8pt]">
        <div className="text-[16pt] font-bold tracking-[0.08em]">{doc.school.toUpperCase()}</div>
        <div className="mt-[2pt] text-[10pt] tracking-wide text-[#333]">Office of Financial Aid</div>
      </div>
      <h1 className="mb-[16pt] text-center text-[16pt] font-bold tracking-wide">Financial Aid Award Letter</h1>
      <table className="mb-[16pt] w-full border-collapse text-[12pt]">
        <tbody>
          <tr>
            <td className="border border-[#1a1a1a] px-[8pt] py-[6pt] align-top">
              <div className="text-[9pt] font-bold">Student</div>
              <div className="mt-[0.1em]">{doc.student}</div>
            </td>
            <td className="border border-[#1a1a1a] px-[8pt] py-[6pt] align-top">
              <div className="text-[9pt] font-bold">Term</div>
              <div className="mt-[0.1em]">{doc.term}</div>
            </td>
          </tr>
        </tbody>
      </table>
      {doc.body.map((line) => (
        <p key={line} className="mb-[10pt] text-[12pt] leading-relaxed">
          {line}
        </p>
      ))}
      <table className="mb-[16pt] w-full border-collapse text-[12pt]">
        <thead>
          <tr className="bg-[#f3f3f3]">
            <th className="border border-[#1a1a1a] px-[8pt] py-[6pt] text-left font-bold">Award</th>
            <th className="border border-[#1a1a1a] px-[8pt] py-[6pt] text-right font-bold">Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-[#1a1a1a] px-[8pt] py-[6pt]">{doc.awardName}</td>
            <td className="border border-[#1a1a1a] px-[8pt] py-[6pt] text-right tabular-nums">{doc.amount}</td>
          </tr>
        </tbody>
      </table>
      <p className="text-[12pt] leading-relaxed">
        <span className="font-bold">Accept by: </span>
        {doc.acceptBy}
      </p>
      <p className="mt-[28pt] text-[12pt] leading-relaxed">
        Prepared by
        <br />
        <span className="italic">{doc.signedBy}</span>
      </p>
    </>
  );
}

function PayStubPage({
  doc,
  employeeName,
}: {
  doc: Extract<PdfDocument, { kind: "paystub" }>;
  employeeName?: string;
}) {
  return (
    <>
      <Letterhead />
      <h1 className="mb-[0.7em] text-center text-[1.35em] font-bold tracking-[0.08em]">EARNINGS STATEMENT</h1>
      <table className="mb-[0.85em] w-full border-collapse text-[1em]">
        <tbody>
          <tr>
            <td className="border border-[#1a1a1a] px-[0.7em] py-[0.4em]">
              <div className="text-[0.78em] font-bold">Employee</div>
              <div className="mt-[0.1em]">{employeeName?.trim() || doc.employee}</div>
            </td>
            <td className="border border-[#1a1a1a] px-[0.7em] py-[0.4em]">
              <div className="text-[0.78em] font-bold">Pay period</div>
              <div className="mt-[0.1em]">{doc.payPeriod}</div>
            </td>
            <td className="border border-[#1a1a1a] px-[0.7em] py-[0.4em]">
              <div className="text-[0.78em] font-bold">Pay date</div>
              <div className="mt-[0.1em]">{doc.payDate}</div>
            </td>
          </tr>
        </tbody>
      </table>

      <h2 className="mb-[0.2em] text-[1em] font-bold">Earnings</h2>
      <table className="mb-[0.75em] w-full border-collapse text-[0.95em]">
        <thead>
          <tr className="bg-[#f3f3f3]">
            <th className="border border-[#1a1a1a] px-[0.7em] py-[0.3em] text-left font-bold">Description</th>
            <th className="border border-[#1a1a1a] px-[0.7em] py-[0.3em] text-left font-bold">Detail</th>
            <th className="border border-[#1a1a1a] px-[0.7em] py-[0.3em] text-right font-bold">Amount</th>
          </tr>
        </thead>
        <tbody>
          {doc.earnings.map((e) => {
            const hours = e.label === "Regular hours" ? e.detail.split(/ (.+)/) : null;
            return (
            <tr key={e.label}>
              <td className="border border-[#1a1a1a] px-[0.7em] py-[0.3em]">{e.label}</td>
              <td className="border border-[#1a1a1a] px-[0.7em] py-[0.3em]">
                {hours ? (
                  <>
                    <span
                      data-showme="stub-hours"
                      data-showme-primary=""
                      data-showme-oval=""
                      className="inline-block -rotate-2 rounded-[50%] border-[2.5px] border-[#e87400] px-[0.45em] py-[0.08em]"
                    >
                      {hours[0]}
                    </span>
                    {hours[1] ? ` ${hours[1]}` : null}
                  </>
                ) : (
                  e.detail
                )}
              </td>
              <td className="border border-[#1a1a1a] px-[0.7em] py-[0.3em] text-right tabular-nums">{e.amount}</td>
            </tr>
            );
          })}
          <tr>
            <td className="border border-[#1a1a1a] px-[0.7em] py-[0.3em] font-bold" colSpan={2}>
              Gross pay
            </td>
            <td className="border border-[#1a1a1a] px-[0.7em] py-[0.3em] text-right font-bold tabular-nums">{doc.grossPay}</td>
          </tr>
        </tbody>
      </table>

      <h2 className="mb-[0.2em] text-[1em] font-bold">Deductions</h2>
      <table className="mb-[0.75em] w-full border-collapse text-[0.95em]">
        <tbody>
          {doc.deductions.map((d) => (
            <tr key={d.label}>
              <td className="border border-[#1a1a1a] px-[0.7em] py-[0.3em]">{d.label}</td>
              <td className="border border-[#1a1a1a] px-[0.7em] py-[0.3em] text-right tabular-nums">{d.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <table className="w-full border-collapse text-[1em]">
        <tbody>
          <tr>
            <td className="border-[2px] border-[#1a1a1a] px-[0.7em] py-[0.45em] font-bold">Net pay</td>
            <td className="border-[2px] border-[#1a1a1a] px-[0.7em] py-[0.45em] text-right text-[1.25em] font-bold tabular-nums">
              <span
                data-showme="stub-net-pay"
                data-showme-primary=""
                data-showme-oval=""
                className="inline-block -rotate-2 rounded-[50%] border-[2.5px] border-[#e87400] px-[0.55em] py-[0.12em]"
              >
                {doc.netPay}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
}

function SchedulePage({ doc }: { doc: Extract<PdfDocument, { kind: "schedule" }> }) {
  const cell = "border border-[#1a1a1a] px-[5pt] py-[5pt]";
  return (
    <>
      <Letterhead />
      <h1 className="mb-[4pt] text-center text-[16pt] font-bold tracking-wide">{doc.title}</h1>
      {/* The week is what people check first, so it is the biggest line after the title. */}
      <p className="mb-[14pt] text-center text-[14pt] font-bold">{doc.week}</p>
      <table className="mb-[14pt] w-full border-collapse text-[10.5pt]">
        <thead>
          <tr className="bg-[#f3f3f3]">
            <th className={`${cell} text-left font-bold`}>Name</th>
            {doc.days.map((d) => (
              <th key={d} className={`${cell} text-center font-bold`}>
                {d}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {doc.rows.map((r) => (
            <tr key={r.name}>
              <td className={`${cell} whitespace-nowrap`}>{r.name}</td>
              {r.shifts.map((sh, i) => (
                <td key={i} className={`${cell} text-center tabular-nums`}>
                  {sh || "—"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <ul className="m-0 flex list-disc flex-col gap-[4pt] pl-[16pt] text-[11pt]">
        {doc.notes.map((n) => (
          <li key={n}>{n}</li>
        ))}
      </ul>
      <p className="mt-[20pt] text-[11pt] italic">{doc.postedBy}</p>
    </>
  );
}

/**
 * One document as a real sheet of paper, scaled. The PDF Reader shows it full
 * size; a task can show it inline (a file preview, a picker's details pane)
 * so the learner reads the actual page, not a description of it.
 *
 * `stamp` draws a rubber-stamp word across the page (DRAFT), the kind of mark
 * that tells a real copy from an unfinished one.
 */
export function PdfSheet({
  doc,
  scale = 1,
  employeeName,
  stamp,
}: {
  doc: PdfDocument;
  scale?: number;
  employeeName?: string;
  stamp?: string;
}) {
  return (
    <div className="shrink-0" style={{ width: `${LETTER.widthIn * scale}in`, height: `${LETTER.heightIn * scale}in` }}>
      <div
        className="relative origin-top-left overflow-hidden bg-white"
        style={{
          width: `${LETTER.widthIn}in`,
          height: `${LETTER.heightIn}in`,
          transform: `scale(${scale})`,
          boxShadow: "0 1px 3px rgba(0,0,0,0.28), 0 8px 24px rgba(0,0,0,0.22)",
        }}
      >
        <PdfPage footer={doc.kind === "award-letter" ? `${doc.school} · Financial Aid` : undefined}>
          {doc.kind === "report" ? (
            <ReportPage doc={doc} />
          ) : doc.kind === "award-letter" ? (
            <AwardLetterPage doc={doc} />
          ) : doc.kind === "schedule" ? (
            <SchedulePage doc={doc} />
          ) : (
            <PayStubPage doc={doc} employeeName={employeeName} />
          )}
        </PdfPage>
        {stamp && (
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-[38%] -translate-x-1/2 -rotate-[18deg] rounded-[10pt] border-[5pt] border-[#c5221f]/70 px-[18pt] py-[4pt] text-[64pt] font-bold tracking-[0.18em] text-[#c5221f]/70"
          >
            {stamp}
          </div>
        )}
      </div>
    </div>
  );
}
