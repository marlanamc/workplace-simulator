import type { LucideIcon } from "lucide-react";
import {
  ArrowLeftRight,
  Banknote,
  BookOpen,
  Calculator,
  Calendar,
  CalendarClock,
  CalendarDays,
  ChartColumn,
  ClipboardList,
  Clock,
  Coffee,
  Compass,
  Copy,
  FileText,
  FolderOpen,
  Globe,
  GraduationCap,
  HardDrive,
  KeyRound,
  Landmark,
  LayoutGrid,
  Library,
  ListChecks,
  Mail,
  Phone,
  MailOpen,
  Megaphone,
  Paperclip,
  Reply,
  RotateCcw,
  Send,
  StickyNote,
  Table2,
  Thermometer,
  Users,
  Video,
  Presentation,
  Receipt,
} from "lucide-react";
import type { AppKey, TaskKey } from "@/lib/desktop-content";

export type { LucideIcon };

export const TASK_ICONS: Record<TaskKey, LucideIcon> = {
  tour: Coffee,
  mail: Mail,
  "mail-read": MailOpen,
  "mail-reply": Mail,
  "mail-attach": Paperclip,
  schedule: CalendarDays,
  "swap-request": ArrowLeftRight,
  "mail-etiquette": Mail,
  "call-out-sick": Thermometer,
  timeclock: Clock,
  paystub: Banknote,
  "shift-review": RotateCcw,
  "account-recovery": KeyRound,
  incident: ClipboardList,
  handbook: BookOpen,
  calendar: Calendar,
  files: FolderOpen,
  spreadsheet: Table2,
  "make-a-copy": Copy,
  "status-report": Send,
  triage: ListChecks,
  "team-schedule": CalendarClock,
  "formula-check": Calculator,
  "team-meeting": Users,
  "priority-call": Megaphone,
  "college-offer": GraduationCap,
  "budget-sheet": ChartColumn,
  "reply-all": Reply,
  enrollment: Landmark,
  "appointment-scheduling": CalendarClock,
  "financial-aid": FileText,
  "patient-intake": ClipboardList,
  coursework: BookOpen,
  "billing-sheet": Calculator,
  research: Library,
  "confidentiality-call": Phone,
  "office-drive": HardDrive,
  "multi-person-scheduling": CalendarClock,
  "video-call": Video,
  "expense-report": Receipt,
  "slide-deck": Presentation,
  "meeting-minutes": ClipboardList,
  "performance-review": FileText,
  "ops-report-packet": Send,
  "portfolio-reflection": Compass,
};

export const APP_ICONS: Record<AppKey, LucideIcon> = {
  browser: Globe,
  pdf: FileText,
};

/**
 * Circular Chrome-style mark so learners recognize the web browser
 * the way they would on a Chromebook, instead of a generic globe tile.
 */
export function ChromeIcon({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      aria-hidden
      className="block shrink-0 overflow-hidden rounded-full"
    >
      <circle cx="24" cy="24" r="24" fill="#EA4335" />
      <path fill="#FBBC05" d="M24 24 L44.785 12 A24 24 0 0 1 24 48 Z" />
      <path fill="#34A853" d="M24 24 L24 48 A24 24 0 0 1 3.215 12 Z" />
      <circle cx="24" cy="24" r="10.5" fill="#fff" />
      <circle cx="24" cy="24" r="8" fill="#4285F4" />
    </svg>
  );
}

/**
 * Red file with a folded corner and PDF wordmark — the document mark
 * learners already know, instead of a generic red tile with a page glyph.
 */
export function PdfIcon({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      aria-hidden
      className="block shrink-0"
      style={{ filter: "drop-shadow(0 1px 1px rgba(0,0,0,0.35))" }}
    >
      <path
        fill="#E5252A"
        d="M11 2h16l10 10v30a4 4 0 0 1-4 4H11a4 4 0 0 1-4-4V6a4 4 0 0 1 4-4z"
      />
      <path fill="#FF8A80" d="M27 2v10h10" />
      <path fill="#B71C1C" d="M27 2 37 12h-6a4 4 0 0 1-4-4V2z" />
      <text
        x="22.5"
        y="33"
        textAnchor="middle"
        fill="#fff"
        fontSize="11"
        fontWeight="800"
        fontFamily="Arial, Helvetica, sans-serif"
        letterSpacing="0.5"
      >
        PDF
      </text>
    </svg>
  );
}

export const TAB_ICONS: Record<string, LucideIcon> = {
  tour: Coffee,
  mail: Mail,
  portal: LayoutGrid,
  "account-recovery": KeyRound,
  incident: ClipboardList,
  handbook: FileText,
  calendar: Calendar,
  files: HardDrive,
  spreadsheet: Table2,
  "make-a-copy": Table2,
  "status-report": Table2,
  triage: ListChecks,
  "team-schedule": Table2,
  "formula-check": Table2,
  "team-meeting": Calendar,
  "priority-call": Megaphone,
  "college-offer": Mail,
  "budget-sheet": Table2,
  zoom: Video,
  "college-portal": Landmark,
  coursework: BookOpen,
  library: Library,
  "front-desk": CalendarClock,
  "billing-sheet": Table2,
  "expense-report": Table2,
  slides: Presentation,
  "meeting-minutes": ClipboardList,
  "performance-review": FileText,
  "ops-report-packet": Send,
  "portfolio-reflection": Compass,
};

export const TRACK_ICONS: Record<string, LucideIcon> = {
  orientation: Coffee,
  starter: Coffee,
  schedules: CalendarDays,
  judgment: Compass,
  calendar: Calendar,
  files: FolderOpen,
  spreadsheet: Table2,
  reporting: Copy,
  triage: ListChecks,
  "team-schedule": CalendarClock,
  "formula-check": Calculator,
  "team-meeting": Users,
  "priority-call": Megaphone,
  "college-offer": GraduationCap,
  "budget-sheet": ChartColumn,
  "reply-all": Reply,
  enrollment: Landmark,
  "appointment-scheduling": CalendarClock,
  "financial-aid": FileText,
  "patient-intake": ClipboardList,
  coursework: BookOpen,
  "billing-sheet": Calculator,
  research: Library,
  "confidentiality-call": Phone,
  "office-drive": HardDrive,
  "get-everyone-in-the-room": Users,
  "expense-report": Receipt,
  "slide-deck": Presentation,
  "meeting-minutes": ClipboardList,
  "performance-review": FileText,
  "ops-report-packet": Send,
  "portfolio-reflection": Compass,
};

export const FOLDER_ICONS: Record<string, LucideIcon> = {
  Schedules: CalendarDays,
  Forms: ClipboardList,
  "Manager Memos": StickyNote,
  "Q2 2026": FolderOpen,
  "Q3 2026": FolderOpen,
  Shared: Users,
  Receipts: Receipt,
};

export {
  Flag,
  Lock,
  Target,
  FileText,
  PartyPopper,
  Hourglass,
  Coffee,
  Languages,
  Check,
  Trophy,
  Briefcase,
} from "lucide-react";

export function CircleGlyph({
  icon: Icon,
  color,
  size = 28,
}: {
  icon: LucideIcon;
  color: string;
  size?: number;
}) {
  return (
    <span
      className="flex shrink-0 items-center justify-center rounded-full text-white"
      style={{ background: color, width: size, height: size }}
    >
      <Icon size={Math.round(size * 0.55)} strokeWidth={2.25} />
    </span>
  );
}
