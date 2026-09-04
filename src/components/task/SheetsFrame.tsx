"use client";

import type { CSSProperties, ReactNode } from "react";
import { TAB_ICONS } from "@/lib/icons";

/**
 * The Google Sheets chrome — the green header bar with the Sheets mark and the
 * file name, and a read-oriented grid with column/row headers, a selectable
 * cell, an `A1` name box, and an `fx` formula bar. Lifted from
 * `SpreadsheetTask` / `BudgetSheetTask` so a task that only needs the learner
 * to *read* a sheet (`ops-report-packet`) shows a real spreadsheet, not a
 * bordered `<div>` table.
 */

export const SHEETS_GREEN = "#0f9d58";

function SheetsMark() {
  const Icon = TAB_ICONS.spreadsheet;
  return <Icon size={18} strokeWidth={2.25} />;
}

export function SheetsFrame({
  fileName,
  children,
}: {
  fileName: string;
  children: ReactNode;
}) {
  return (
    <div
      className="flex h-full min-h-0 flex-col bg-white text-[14px] text-[#202124]"
      style={{ fontFamily: "Arial, Helvetica, sans-serif" }}
    >
      <div className="flex items-center gap-3 border-b border-[#e0e0e0] px-4 py-2.5">
        <span
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded text-white"
          style={{ background: SHEETS_GREEN }}
        >
          <SheetsMark />
        </span>
        <span className="text-[18px] text-[#3c4043]">{fileName}</span>
        <div className="flex-1" />
      </div>
      {children}
    </div>
  );
}

export interface GridColumn {
  /** Column letter — "A", "B", … */
  key: string;
  width: number;
  /** Header cell text (row 1). */
  header: string;
}

export interface GridRow {
  /** 1-indexed sheet row number. */
  row: number;
  /** Cell text per column key. */
  cells: Record<string, string>;
  /** Rows rendered with the shaded "total" style. */
  total?: boolean;
}

/**
 * A read-only spreadsheet grid. Clicking a cell selects it and surfaces its
 * value (or the caller-supplied formula) in the `fx` bar above.
 */
export function ReadOnlyGrid({
  columns,
  rows,
  /** Returns the `fx`-bar content for a cell — e.g. `=SUM(B2:B7)` for the total. */
  formulaFor,
  selected,
  onSelect,
}: {
  columns: GridColumn[];
  rows: GridRow[];
  formulaFor?: (row: number, col: string) => string | undefined;
  selected: { row: number; col: string };
  onSelect: (cell: { row: number; col: string }) => void;
}) {
  const HEADER_ROW = 1;
  const cellText = (row: number, col: string): string => {
    if (row === HEADER_ROW) return columns.find((c) => c.key === col)?.header ?? "";
    return rows.find((r) => r.row === row)?.cells[col] ?? "";
  };
  const fx = (() => {
    const custom = formulaFor?.(selected.row, selected.col);
    if (custom !== undefined) return custom;
    return cellText(selected.row, selected.col);
  })();
  const totalRows = new Set(rows.filter((r) => r.total).map((r) => r.row));
  const allRows = [HEADER_ROW, ...rows.map((r) => r.row)];

  return (
    <>
      <div className="flex items-center gap-2 border-b border-[#e0e0e0] px-3 py-1.5">
        <span className="min-w-[40px] rounded border border-[#e0e0e0] px-2 py-1 text-center text-[12px] font-medium text-[#3c4043]">
          {selected.col}
          {selected.row}
        </span>
        <span className="text-[13px] italic text-[#5f6368]">fx</span>
        <span className="flex-1 truncate border-l border-[#e0e0e0] px-2 py-1 text-[13px] text-[#202124]">
          {fx}
        </span>
      </div>

      <div className="overflow-auto p-4">
        <div className="inline-block border border-[#c0c0c0]" style={{ fontSize: 13 }}>
          <div className="flex">
            <div
              className="flex shrink-0 items-center justify-center border-b border-r border-[#c0c0c0] bg-[#f8f9fa]"
              style={{ width: 32, height: 24 }}
            />
            {columns.map((col) => (
              <div
                key={col.key}
                className={`flex shrink-0 items-center justify-center border-b border-r border-[#c0c0c0] text-[12px] font-medium ${
                  selected.col === col.key ? "bg-[#d2e3fc] text-[#1a73e8]" : "bg-[#f8f9fa] text-[#5f6368]"
                }`}
                style={{ width: col.width, height: 24 }}
              >
                {col.key}
              </div>
            ))}
          </div>
          {allRows.map((row) => {
            const isHeader = row === HEADER_ROW;
            const isTotal = totalRows.has(row);
            return (
              <div key={row} className="flex">
                <div
                  className={`flex shrink-0 items-center justify-center border-b border-r border-[#c0c0c0] text-[12px] ${
                    selected.row === row ? "bg-[#d2e3fc] text-[#1a73e8]" : "bg-[#f8f9fa] text-[#5f6368]"
                  }`}
                  style={{ width: 32, height: 26 }}
                >
                  {row}
                </div>
                {columns.map((col) => {
                  const isSelected = selected.row === row && selected.col === col.key;
                  const style: CSSProperties = {
                    width: col.width,
                    height: 26,
                    background: isHeader ? "#f8f9fa" : isTotal ? "#fef7e0" : "white",
                    boxShadow: isSelected ? "inset 0 0 0 2px #1a73e8" : undefined,
                  };
                  return (
                    <button
                      key={col.key}
                      onClick={() => onSelect({ row, col: col.key })}
                      className={`shrink-0 border-b border-r border-[#c0c0c0] px-1.5 text-left text-[13px] cursor-pointer ${
                        isHeader || isTotal ? "font-medium" : ""
                      } ${col.key !== "A" ? "tabular-nums" : ""}`}
                      style={style}
                    >
                      {cellText(row, col.key)}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
