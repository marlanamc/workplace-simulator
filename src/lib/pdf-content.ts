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

export interface AwardLetterDoc extends PdfBase {
  kind: "award-letter";
  school: string;
  student: string;
  term: string;
  awardName: string;
  amount: string;
  acceptBy: string;
  body: string[];
  signedBy: string;
}

export type PdfDocument = ReportDoc | PayStubDoc | AwardLetterDoc;

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
    id: "paystub-first",
    name: "paystub-aug-18-28.pdf",
    size: "96 KB",
    date: "Aug 28, 2026",
    /** UI substitutes the learner's display name. */
    employee: "You",
    payPeriod: "Aug 18 – Aug 28, 2026",
    payDate: "Aug 28, 2026",
    earnings: [
      { label: "Regular hours", detail: "48 @ $15.00/hr", amount: "$720.00" },
    ],
    grossPay: "$720.00",
    deductions: [
      { label: "Federal tax withheld", amount: "-$72.00" },
      { label: "State tax withheld", amount: "-$21.60" },
      { label: "Social Security / Medicare", amount: "-$8.00" },
    ],
    netPay: "$618.40",
  },
  {
    kind: "award-letter",
    id: "award-letter-fall-2026",
    name: "bhcc-award-letter-fall-2026.pdf",
    size: "112 KB",
    date: "Sep 10, 2026",
    school: "Bunker Hill Community College",
    student: "Jordan Rivera",
    term: "Fall 2026",
    awardName: "Federal Pell Grant",
    amount: "$2,400.00",
    acceptBy: "October 15, 2026",
    body: [
      "We are pleased to offer the following financial aid for the Fall 2026 term.",
      "This award is applied to tuition and fees. You must accept or decline by the date below. After that date the offer may be given to another student.",
    ],
    signedBy: "Office of Financial Aid, Bunker Hill Community College",
  },
];
