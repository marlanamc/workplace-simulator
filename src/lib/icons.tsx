import type { LucideIcon } from "lucide-react";
import {
  Banknote,
  BookOpen,
  Calendar,
  CalendarDays,
  ClipboardList,
  Clock,
  Coffee,
  Compass,
  FileText,
  FolderOpen,
  Globe,
  HardDrive,
  LayoutGrid,
  Mail,
  StickyNote,
  Table2,
  Wrench,
} from "lucide-react";
import type { AppKey, TaskKey } from "@/lib/desktop-content";

export type { LucideIcon };

export const TASK_ICONS: Record<TaskKey, LucideIcon> = {
  mail: Mail,
  schedule: CalendarDays,
  timeclock: Clock,
  paystub: Banknote,
  incident: ClipboardList,
  handbook: BookOpen,
  calendar: Calendar,
  files: FolderOpen,
  spreadsheet: Table2,
};

export const APP_ICONS: Record<AppKey, LucideIcon> = {
  browser: Globe,
  pdf: FileText,
};

export const TAB_ICONS: Record<string, LucideIcon> = {
  mail: Mail,
  portal: LayoutGrid,
  incident: ClipboardList,
  handbook: FileText,
  calendar: Calendar,
  files: HardDrive,
  spreadsheet: Table2,
};

export const TRACK_ICONS: Record<string, LucideIcon> = {
  starter: Coffee,
  schedules: CalendarDays,
  judgment: Compass,
  growing: Wrench,
};

export const FOLDER_ICONS: Record<string, LucideIcon> = {
  Schedules: CalendarDays,
  Forms: ClipboardList,
  "Manager Memos": StickyNote,
};

export { Flag, Lock, Target, FileText, PartyPopper, Hourglass, Coffee, Languages, Check } from "lucide-react";

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
