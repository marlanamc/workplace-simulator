interface PdfBase {
  id: string;
  name: string;
  size: string;
  date: string;
}

export interface ReportDoc extends PdfBase {
  kind: "report";
  title: string;
  meta: { label: string; value: string }[];
  sectionHeading: string;
  items: string[];
  signedBy: string;
}

export interface PayStubDoc extends PdfBase {
  kind: "paystub";
  employee: string;
  payPeriod: string;
  payDate: string;
  earnings: { label: string; detail: string; amount: string }[];
  grossPay: string;
  deductions: { label: string; amount: string }[];
  netPay: string;
}

export type PdfDocument = ReportDoc | PayStubDoc;

export const PDF_DOCUMENTS: PdfDocument[] = [
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
    payPeriod: "Aug 1 – Aug 15, 2026",
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
