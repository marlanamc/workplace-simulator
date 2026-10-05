"use client";

import { useRef, useState, type ReactNode } from "react";
import { SheetsFrame } from "@/components/task/SheetsFrame";
import SheetEmailMenu from "@/components/task/SheetEmailMenu";
import type { ConfidenceScenario } from "@/lib/tasks/confidence/content";
import type { Lang } from "@/lib/task-types";

/** Story's spreadsheet workspace, with lesson facts and in-cell editing. */
export default function LessonSheet({ scenario: s, lang, values, onChange, onEmail, overlay }: {
  scenario: ConfidenceScenario; lang: Lang; values: Record<string, string>;
  onChange: (cell: string, value: string) => void; onEmail: () => void; overlay?: ReactNode;
}) {
  const [selected, setSelected] = useState("B2");
  const [formula, setFormula] = useState("");
  const grid = useRef<HTMLDivElement>(null);
  const rows = s.rows ?? [];
  const totalRow = rows.length + 2;
  const total = rows.reduce((sum, _, i) => sum + Number((values[`B${i + 2}`] ?? "0").replace(",", ".")), 0);
  const t = (en: string, es: string) => lang === "es" ? es : en;
  return <div className="relative min-h-full" data-testid="lesson-sheet-workspace">
    <SheetsFrame fileName={s.title[lang]}>
      <SheetEmailMenu lang={lang} onEmail={onEmail} showMeId="lesson-sheet-email" />
      <div aria-hidden="true" className="flex flex-wrap items-center gap-5 border-b border-[#dadce0] bg-[#f9fbfd] px-5 py-2 text-sm text-[#5f6368]">
        <span>↶</span><span>↷</span><span>🖨</span><span>100%</span><span>|</span><span>Arial</span><span>10</span><b>B</b><i>I</i><u>U</u><span>⊞</span><span>≡</span>
      </div>
      <div className="flex items-center gap-3 border-b border-[#dadce0] px-3 py-1">
        <span className="w-14 border-r text-center text-xs">{selected}</span><span className="italic text-[#5f6368]">fx</span>
        <input aria-label={t("Formula bar", "Barra de fórmulas")} className="min-h-9 min-w-0 flex-1 px-2 outline-[#1a73e8]" value={formula} readOnly={selected === `B${totalRow}`} onChange={e => setFormula(e.target.value)} onKeyDown={e => {
          if (e.key === "Enter" && selected !== `B${totalRow}`) { onChange(selected, formula); requestAnimationFrame(() => grid.current?.querySelector<HTMLInputElement>(`[data-cell="${selected}"]`)?.focus()); }
        }} />
      </div>
      <div className="flex flex-col gap-5 p-4 xl:flex-row xl:items-start">
        <aside aria-label={t("Source material", "Documentos")} className="w-full shrink-0 border border-[#e8dfc4] bg-[#fffdf5] px-4 font-mono text-sm shadow-sm xl:w-64">
          {s.sources.map((src, i) => <article key={i} className="border-b border-dashed border-[#c9c1ac] py-3 last:border-0"><h2 className="mb-1 font-bold">{src.title[lang]}</h2><p className="whitespace-pre-line leading-relaxed">{src.text[lang]}</p></article>)}
        </aside>
        <div ref={grid} className="min-w-0 flex-1 overflow-x-auto">
          <table className="w-full min-w-[560px] table-fixed border-collapse text-[13px] [&_td]:border [&_td]:border-[#d5d8dc] [&_th]:border [&_th]:border-[#c0c0c0] [&_th]:bg-[#f8f9fa] [&_th]:font-normal [&_th]:text-[#5f6368]">
            <colgroup><col className="w-9"/><col className="w-40"/><col className="w-28"/>{['C','D','E'].map(c => <col key={c} className="w-24"/>)}</colgroup>
            <thead><tr><th className="h-7"/>{['A','B','C','D','E'].map(c => <th key={c}>{c}</th>)}</tr></thead>
            <tbody>{Array.from({length: Math.max(14, totalRow + 3)}, (_, i) => {
              const row = i + 1; const cell = `B${row}`; const entry = rows[row - 2];
              return <tr key={row} className={row === totalRow ? "bg-[#fef7e0]" : "bg-white"}>
                <th className="h-9 text-center">{row}</th>
                <td className="px-2">{row === 1 ? t("Item", "Artículo") : row === totalRow ? t("Total", "Total") : entry?.label[lang]}</td>
                <td className={selected === cell ? "outline-2 -outline-offset-2 outline-[#1a73e8]" : ""}>
                  {row === 1 ? <span className="px-2">{t("Amount", "Cantidad")}</span> : row === totalRow ? <button type="button" aria-label={t("Total cell", "Celda del total")} data-testid="sheet-total" className="min-h-9 w-full px-2 text-right tabular-nums" onClick={() => {setSelected(cell); setFormula(`=SUM(B2:B${totalRow - 1})`);}}>{Number.isFinite(total) ? total.toFixed(2) : '#VALUE!'}</button> : entry ? <input aria-label={cell} data-cell={cell} data-showme={`lesson-sheet-${cell}`} inputMode="decimal" className="min-h-9 w-full bg-transparent px-2 text-right tabular-nums outline-[#1a73e8]" value={values[cell] ?? ''} onFocus={() => {setSelected(cell); setFormula(values[cell] ?? '');}} onChange={e => {onChange(cell, e.target.value); setFormula(e.target.value);}} onKeyDown={e => {
                    if (['Enter','ArrowDown','ArrowUp'].includes(e.key)) {const next = row + (e.key === 'ArrowUp' ? -1 : 1); if (next >= 2 && next < totalRow) {e.preventDefault(); grid.current?.querySelector<HTMLInputElement>(`[data-cell="B${next}"]`)?.focus();}}
                  }}/> : null}
                </td>{['C','D','E'].map(c => <td key={c}/>)}
              </tr>;
            })}</tbody>
          </table>
        </div>
      </div>
      <div className="flex items-center gap-5 border-t border-[#dadce0] bg-[#f9fbfd] px-5 text-sm"><span aria-hidden>☷</span><span className="border-b-2 border-[#188038] bg-[#e6f4ea] px-5 py-3 text-[#137333]">{t("Sheet1", "Hoja1")}</span></div>
    </SheetsFrame>
    {overlay && <div className="absolute inset-x-3 top-28 z-20 mx-auto max-w-xl rounded-xl border border-[#dadce0] bg-white p-4 shadow-2xl">{overlay}</div>}
  </div>;
}
