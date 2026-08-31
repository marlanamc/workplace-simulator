"use client";

import { Banknote, CalendarDays, Clock, FileText, FolderOpen, Mail, Table2, Users } from "lucide-react";
import { CalendarApp } from "./apps/CalendarApp";
import { DriveApp } from "./apps/DriveApp";
import { MailApp } from "./apps/MailApp";
import { PortalApp } from "./apps/PortalApp";
import { PdfReaderApp } from "./apps/PdfReaderApp";
import type {
  CalendarEvent,
  DriveFile,
  MailMessage,
  PdfDocument,
  PortalSection,
  WorkspaceAppDefinition,
  WorkspaceHost,
} from "./types";

export const workspaceApps: WorkspaceAppDefinition[] = [
  {
    key: "mail",
    label: "Mail",
    url: "mail.workplace.local",
    color: "#ea4335",
    icon: Mail,
    component: MailApp,
  },
  {
    key: "drive",
    label: "Drive",
    url: "drive.workplace.local",
    color: "#fbbc04",
    icon: FolderOpen,
    component: DriveApp,
  },
  {
    key: "calendar",
    label: "Calendar",
    url: "calendar.workplace.local",
    color: "#34a853",
    icon: CalendarDays,
    component: CalendarApp,
  },
  {
    key: "portal",
    label: "Portal",
    url: "portal.workplace.local",
    color: "#8430ce",
    icon: Table2,
    component: PortalApp,
  },
  {
    key: "pdf",
    label: "PDF Reader",
    url: "downloads.workplace.local",
    color: "#ea4335",
    icon: FileText,
    component: PdfReaderApp,
  },
];

export const mailMessages: MailMessage[] = [
  {
    id: "maria-schedule",
    from: "Maria Delgado",
    email: "maria@workplace.local",
    subject: "Schedule for Jordan",
    time: "8:12 AM",
    unread: true,
    attachmentName: "sched_82426.pdf",
    body: {
      en: [
        "Morning,",
        "Jordan starts today. Please find this week's schedule, rename it clearly, and share it with view-only access.",
        "Thanks, Maria",
      ],
      es: [
        "Buenos dias,",
        "Jordan empieza hoy. Por favor encuentra el horario de esta semana, renombralo claramente y compartelo con acceso de solo lectura.",
        "Gracias, Maria",
      ],
    },
  },
  {
    id: "darnell-cover",
    from: "Darnell Price",
    email: "darnell@workplace.local",
    subject: "Can you cover Friday?",
    time: "Yesterday",
    body: {
      en: ["Could you cover the late Friday shift? No worries if not."],
      es: ["Podrias cubrir el turno tarde del viernes? No hay problema si no."],
    },
  },
  {
    id: "hr-paystub",
    from: "People Team",
    email: "people@workplace.local",
    subject: "Your pay stub is ready",
    time: "Mon",
    body: {
      en: ["Your latest pay stub is available in the employee portal."],
      es: ["Tu talon de pago mas reciente esta disponible en el portal de empleados."],
    },
  },
];

export const driveFiles: DriveFile[] = [
  { id: "sched-aug17", name: "sched_81724.pdf", folder: "Schedules", owner: "Maria Delgado", date: "Aug 17", type: "pdf" },
  { id: "sched-aug24", name: "sched_82426.pdf", folder: "Schedules", owner: "Maria Delgado", date: "Aug 24", type: "pdf" },
  { id: "vacation", name: "vacation_request_form.pdf", folder: "Forms", owner: "People Team", date: "Jun 2", type: "pdf" },
  { id: "memo-july", name: "memo_july.pdf", folder: "Manager Memos", owner: "Maria Delgado", date: "Jul 3", type: "doc" },
];

export const calendarEvents: CalendarEvent[] = [
  { id: "shift-21", title: "Opening shift", day: 21, time: "7:00 AM", calendar: "work", color: "#0b8043" },
  { id: "shift-22", title: "Saturday shift", day: 22, time: "8:00 AM", calendar: "work", color: "#0b8043" },
  {
    id: "lead-huddle",
    title: "Weekly Lead Huddle",
    day: 26,
    time: "9:00 AM",
    calendar: "company",
    color: "#1a73e8",
    description: "A short weekly check-in with the shift leads.",
  },
  { id: "appointment", title: "School pickup", day: 26, time: "8:45 AM", calendar: "personal", color: "#d93025" },
];

export const portalSections: PortalSection[] = [
  {
    key: "schedule",
    label: "Schedule",
    icon: CalendarDays,
    render: (host: WorkspaceHost) => (
      <div className="grid gap-2">
        {["Mon Aug 24 - 7:00 AM to 3:00 PM", "Tue Aug 25 - 7:00 AM to 3:00 PM", "Wed Aug 26 - Off", "Thu Aug 27 - 10:00 AM to 6:00 PM"].map((shift) => (
          <div key={shift} className="rounded-lg border border-[#dadce0] bg-white px-4 py-3 text-[14px] text-[#202124]">
            {shift}
          </div>
        ))}
        <p className="text-[13px] text-[#5f6368]">
          {host.lang === "en" ? "Use this section when another app asks you to check your shifts." : "Usa esta seccion cuando otra app te pida revisar tus turnos."}
        </p>
      </div>
    ),
  },
  {
    key: "timeclock",
    label: "Time Clock",
    icon: Clock,
    render: () => (
      <div className="max-w-[360px] rounded-xl border border-[#dadce0] bg-white p-5">
        <div className="text-[13px] text-[#5f6368]">Current shift</div>
        <div className="mt-1 text-[28px] font-medium text-[#202124]">7:00 AM - 3:00 PM</div>
        <button className="mt-5 h-10 rounded-full bg-[#1a73e8] px-5 text-[14px] font-medium text-white">Clock in</button>
      </div>
    ),
  },
  {
    key: "paystubs",
    label: "Pay Stubs",
    icon: Banknote,
    render: () => (
      <div className="overflow-hidden rounded-xl border border-[#dadce0] bg-white">
        {["Aug 30, 2026", "Aug 16, 2026", "Aug 2, 2026"].map((date) => (
          <button key={date} className="flex w-full items-center justify-between border-b border-[#eef0f3] px-4 py-3 text-left last:border-b-0">
            <span className="text-[14px] text-[#202124]">{date}</span>
            <span className="text-[13px] text-[#1a73e8]">View PDF</span>
          </button>
        ))}
      </div>
    ),
  },
  {
    key: "team",
    label: "Team",
    icon: Users,
    render: () => (
      <div className="grid gap-3 sm:grid-cols-2">
        {["Maria Delgado - Manager", "Jordan Kim - New hire", "Darnell Price - Lead"].map((person) => (
          <div key={person} className="rounded-xl border border-[#dadce0] bg-white p-4 text-[14px] text-[#202124]">
            {person}
          </div>
        ))}
      </div>
    ),
  },
];

export const pdfDocuments: PdfDocument[] = [
  {
    kind: "report",
    id: "safety-report-july",
    name: "safety-report-july.pdf",
    size: "248 KB",
    date: "Aug 1, 2026",
    title: "Monthly Safety Report",
    meta: [
      { label: "Month", value: "July 2026" },
      { label: "Location", value: "Main Street" },
    ],
    sectionHeading: "Summary",
    items: [
      "Incidents reported: 1 (minor slip, no injury. Cleaned within 5 minutes)",
      "Fire extinguisher check: Passed, Jul 3",
      "First aid kit restocked: Jul 10",
      "Floor mats inspected: Jul 10. Replaced one worn mat near the ice machine",
    ],
    signedBy: "Maria Delgado, Cafe Manager",
  },
  {
    kind: "paystub",
    id: "paystub-aug-1",
    name: "paystub-alex-chen-aug-1-15.pdf",
    size: "96 KB",
    date: "Aug 16, 2026",
    employee: "Alex Chen",
    payPeriod: "Aug 1 - Aug 15, 2026",
    payDate: "Aug 16, 2026",
    earnings: [
      { label: "Regular hours", detail: "62.5 @ $15.00/hr", amount: "$937.50" },
      { label: "Overtime hours", detail: "3 @ $22.50/hr", amount: "$67.50" },
    ],
    grossPay: "$1,005.00",
    deductions: [
      { label: "Federal tax withheld", amount: "-$100.50" },
      { label: "State tax withheld", amount: "-$30.15" },
      { label: "Social Security / Medicare", amount: "-$11.05" },
    ],
    netPay: "$863.30",
  },
];

export const defaultWorkspaceHost: WorkspaceHost = {
  lang: "en",
  userName: "Jordan Kim",
  organizationName: "Harborside Cafe",
};
