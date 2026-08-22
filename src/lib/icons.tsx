import type { LucideIcon } from "lucide-react";
import {
  Banknote,
  BookOpen,
  Calculator,
  Calendar,
  CalendarClock,
  CalendarDays,
  CircleHelp,
  ClipboardList,
  Clock,
  Coffee,
  Compass,
  Copy,
  FileText,
  FolderOpen,
  Globe,
  HardDrive,
  LayoutGrid,
  ListChecks,
  Mail,
  Megaphone,
  Send,
  StickyNote,
  Table2,
  Users,
} from "lucide-react";
import type { AppKey, TaskKey } from "@/lib/desktop-content";

export type { LucideIcon };

export const TASK_ICONS: Record<TaskKey, LucideIcon> = {
  tour: CircleHelp,
  mail: Mail,
  schedule: CalendarDays,
  timeclock: Clock,
  paystub: Banknote,
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
};

export const APP_ICONS: Record<AppKey, LucideIcon> = {
  browser: Globe,
  pdf: FileText,
};

export const TAB_ICONS: Record<string, LucideIcon> = {
  tour: CircleHelp,
  mail: Mail,
  portal: LayoutGrid,
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
};

export const TRACK_ICONS: Record<string, LucideIcon> = {
  orientation: CircleHelp,
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
};

export const FOLDER_ICONS: Record<string, LucideIcon> = {
  Schedules: CalendarDays,
  Forms: ClipboardList,
  "Manager Memos": StickyNote,
};

export { Flag, Lock, Target, FileText, PartyPopper, Hourglass, Coffee, Languages, Check, Trophy } from "lucide-react";

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
