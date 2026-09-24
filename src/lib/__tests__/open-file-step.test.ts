import { describe, expect, it } from "vitest";
import * as spreadsheet from "@/lib/tasks/spreadsheet/content";
import * as budget from "@/lib/tasks/budget-sheet/content";
import * as billing from "@/lib/tasks/billing-sheet/content";
import * as formula from "@/lib/tasks/formula-check/content";
import * as expense from "@/lib/tasks/expense-report/content";
import * as teamSchedule from "@/lib/tasks/team-schedule/content";
import * as statusReport from "@/lib/tasks/status-report/content";
import * as makeACopy from "@/lib/tasks/make-a-copy/content";

// The Sheets home screen has templates and a file list. The first Job Card
// step must name the one file to open, exactly as it reads on screen.
const TASKS = [
  ["spreadsheet", spreadsheet.RIGHT_NOW_STEPS, spreadsheet.SPREADSHEET_COPY, "sheetName"],
  ["budget-sheet", budget.RIGHT_NOW_STEPS, budget.BUDGET_SHEET_COPY, "sheetName"],
  ["billing-sheet", billing.RIGHT_NOW_STEPS, billing.BILLING_COPY, "sheetName"],
  ["formula-check", formula.RIGHT_NOW_STEPS, formula.FORMULA_CHECK_COPY, "sheetName"],
  ["expense-report", expense.RIGHT_NOW_STEPS, expense.EXPENSE_COPY, "sheetName"],
  ["team-schedule", teamSchedule.RIGHT_NOW_STEPS, teamSchedule.TEAM_SCHEDULE_COPY, "sheetName"],
  ["status-report", statusReport.RIGHT_NOW_STEPS, statusReport.STATUS_REPORT_COPY, "sheetName"],
  ["make-a-copy", makeACopy.RIGHT_NOW_STEPS, makeACopy.MAKE_COPY_COPY, "templateName"],
] as const;

describe("first Sheets step names the file", () => {
  for (const [key, steps, copy, field] of TASKS) {
    for (const lang of ["en", "es"] as const) {
      it(`${key} (${lang})`, () => {
        const c = copy[lang] as unknown as Record<string, string>;
        expect(steps[0][lang]).toContain(c[field]);
        expect(steps[0][lang]).toContain(c.recentHeading);
      });
    }
  }
});
