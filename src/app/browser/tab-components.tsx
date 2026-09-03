import type { ComponentType } from "react";
import PortalPage from "./PortalPage";
import CalendarTask from "./CalendarTask";
import FilesTask from "./FilesTask";
import SpreadsheetTask from "./SpreadsheetTask";
import MakeACopyTask from "./MakeACopyTask";
import StatusReportTask from "./StatusReportTask";
import TriageTask from "./TriageTask";
import TeamScheduleTask from "./TeamScheduleTask";
import FormulaCheckTask from "./FormulaCheckTask";
import TeamMeetingTask from "./TeamMeetingTask";
import PriorityCallTask from "./PriorityCallTask";
import CollegeOfferTask from "./CollegeOfferTask";
import BudgetSheetTask from "./BudgetSheetTask";
import CollegePortalTask from "./CollegePortalTask";
import CourseworkTask from "./CourseworkTask";
import LibrarySearchTask from "./LibrarySearchTask";
import FrontDeskTask from "./FrontDeskTask";
import BillingSheetTask from "./BillingSheetTask";
import ExpenseReportTask from "./ExpenseReportTask";
import SlideDeckTask from "./SlideDeckTask";
import VideoCallTask from "./VideoCallTask";
import MeetingMinutesTask from "./MeetingMinutesTask";
import PerformanceReviewTask from "./PerformanceReviewTask";
import OpsReportPacketTask from "./OpsReportPacketTask";
import PortfolioReflectionTask from "./PortfolioReflectionTask";
import HandbookTask from "./HandbookTask";
import IncidentTask from "./IncidentTask";
import AccountRecoveryTask from "./AccountRecoveryTask";

/**
 * Which component renders each browser tab. Adding a self-contained task
 * means adding one line here — no `&&` branch to append to a render ladder.
 *
 * `tour` and `mail` are deliberately absent: they take walkthrough props and
 * stay explicitly wired in `BrowserClient`. A `newtab-*` key also isn't here
 * — the New Tab page has its own guarded render.
 */
export const TAB_COMPONENTS: Record<string, ComponentType> = {
  portal: PortalPage,
  calendar: CalendarTask,
  files: FilesTask,
  spreadsheet: SpreadsheetTask,
  "make-a-copy": MakeACopyTask,
  "status-report": StatusReportTask,
  triage: TriageTask,
  "team-schedule": TeamScheduleTask,
  "formula-check": FormulaCheckTask,
  "team-meeting": TeamMeetingTask,
  "priority-call": PriorityCallTask,
  "college-offer": CollegeOfferTask,
  "budget-sheet": BudgetSheetTask,
  "college-portal": CollegePortalTask,
  coursework: CourseworkTask,
  library: LibrarySearchTask,
  "front-desk": FrontDeskTask,
  "billing-sheet": BillingSheetTask,
  "expense-report": ExpenseReportTask,
  slides: SlideDeckTask,
  "meeting-minutes": MeetingMinutesTask,
  "performance-review": PerformanceReviewTask,
  "ops-report-packet": OpsReportPacketTask,
  "portfolio-reflection": PortfolioReflectionTask,
  zoom: VideoCallTask,
  handbook: HandbookTask,
  incident: IncidentTask,
  "account-recovery": AccountRecoveryTask,
};
