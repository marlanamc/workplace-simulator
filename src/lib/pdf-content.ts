import { AID_ACCEPT_BY_DAY, COLLEGE_STORY_DAY_BY_LEVEL, SPRING_TERM_START, shortDate, storyYear, yearDate } from "./story-dates";

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

/** A posted crew schedule: one row per person, one column per day. */
export interface ScheduleDoc extends PdfBase {
  kind: "schedule";
  title: string;
  /** The line people check first: "Week of Sep 14 – 20, 2026". */
  week: string;
  days: string[];
  rows: { name: string; shifts: string[] }[];
  notes: string[];
  postedBy: string;
}

/**
 * A training certificate or its practice test: the issuer at the top, then
 * whose it is and its dates. `holder` "You" is replaced by the learner's
 * name, as on the pay stub.
 */
export interface CertificateDoc extends PdfBase {
  kind: "certificate";
  issuer: string;
  title: string;
  holder: string;
  statement: string;
  fields: { label: string; value: string }[];
  /** A practice test lists its questions; a certificate has none. */
  items?: string[];
  signedBy: string;
}

export type PdfDocument = ReportDoc | PayStubDoc | AwardLetterDoc | ScheduleDoc | CertificateDoc;

/**
 * Dated the day before the College door's Paperwork sitting (level17, Wed
 * Nov 18, 2026), when the letter "arrived": Tue Nov 17, 2026.
 */
const AWARD_LETTER_DAY = COLLEGE_STORY_DAY_BY_LEVEL.level17 - 1;
const AWARD_LETTER_DATE = `${shortDate(AWARD_LETTER_DAY, "en")}, ${storyYear(AWARD_LETTER_DAY)}`;

/**
 * The sitting a Downloads file first shows up in. A file with no entry has
 * been there since Day One. Nothing arrives before its story moment: the
 * first pay stub waits for payday, and the college award letter waits for
 * the college route's Paperwork day (a learner on another route never gets
 * it).
 */
export const PDF_ARRIVES_WITH: Record<string, string> = {
  "paystub-first": "level3a3",
  "award-letter-spring-2027": "level17",
};

export const PDF_DOCUMENTS: PdfDocument[] = [
  // Day 2: Maria asks the new hire for a copy for the cafe's files. The
  // training was the week before the Night Before (Mon Aug 17).
  {
    kind: "certificate",
    id: "food-handler-certificate",
    name: "food-handler-certificate.pdf",
    size: "184 KB",
    date: "Aug 12, 2026",
    issuer: "Harborside Food Safety Training",
    title: "Food Handler Certificate",
    holder: "You",
    statement: "completed the Food Handler Training Course and passed the exam.",
    fields: [
      { label: "Issued", value: "Aug 12, 2026" },
      { label: "Expires", value: "Aug 12, 2029" },
      { label: "Certificate no.", value: "FH-26-40817" },
    ],
    signedBy: "Program Director, Harborside Food Safety Training",
  },
  {
    kind: "paystub",
    id: "paystub-first",
    name: "paystub-aug-18-27.pdf",
    size: "96 KB",
    date: "Aug 28, 2026",
    /** UI substitutes the learner's display name. */
    employee: "You",
    // Through the day before payday: the 48 hours are the six shifts from
    // Aug 18 to Aug 27. Payday's own shift goes on the next stub.
    payPeriod: "Aug 18 – Aug 27, 2026",
    payDate: "Aug 28, 2026",
    earnings: [
      { label: "Regular hours", detail: "48 @ $15.00/hr", amount: "$720.00" },
    ],
    grossPay: "$720.00",
    deductions: [
      { label: "Federal tax withheld", amount: "-$72.00" },
      { label: "State tax withheld", amount: "-$21.60" },
      // Standard employee rates: 6.2% + 1.45% of $720 = $55.08.
      // IRS Publication 15 (2026): https://www.irs.gov/publications/p15
      { label: "Social Security / Medicare", amount: "-$55.08" },
    ],
    netPay: "$571.32",
  },
  {
    kind: "award-letter",
    id: "award-letter-spring-2027",
    name: "bhcc-award-letter-spring-2027.pdf",
    size: "112 KB",
    date: AWARD_LETTER_DATE,
    school: "Bunker Hill Community College",
    student: "Jordan Rivera",
    term: "Spring 2027",
    awardName: "Federal Pell Grant",
    amount: "$2,400.00",
    acceptBy: yearDate(AID_ACCEPT_BY_DAY, "en"),
    body: [
      `We are pleased to offer the following financial aid for the Spring 2027 term. Classes start on ${yearDate(SPRING_TERM_START, "en")}.`,
      "This award is applied to tuition and fees. You must accept or decline by the date below. After that date the offer may be given to another student.",
    ],
    signedBy: "Office of Financial Aid, Bunker Hill Community College",
  },
];

/**
 * Other files in the Downloads folder that Mail's file picker previews. They
 * stay out of `PDF_DOCUMENTS` so the PDF app keeps its short list. Each one
 * is a real page, so the learner tells them apart by reading, the way they
 * would at work: the title at the top, the Expires date, the form's name.
 */
export type FilePreview =
  | { kind: "pdf"; doc: PdfDocument; stamp?: string }
  | { kind: "photo"; caption: string };

const CERTIFICATE = PDF_DOCUMENTS.find((d) => d.id === "food-handler-certificate") as CertificateDoc;

export const DOWNLOAD_PREVIEWS: Record<string, FilePreview> = {
  "food-handler-certificate.pdf": { kind: "pdf", doc: CERTIFICATE },
  // Not the certificate: the practice test from the same training.
  "food-handler-practice-test.pdf": {
    kind: "pdf",
    stamp: "PRACTICE",
    doc: {
      ...CERTIFICATE,
      id: "food-handler-practice-test",
      name: "food-handler-practice-test.pdf",
      size: "92 KB",
      date: "Aug 11, 2026",
      title: "Food Handler Practice Test",
      statement: "took the practice test. This is not a certificate.",
      fields: [
        { label: "Date", value: "Aug 11, 2026" },
        { label: "Score", value: "17 / 20" },
      ],
      items: [
        "Cold food must stay at or below: 41°F",
        "Wash your hands for at least: 20 seconds",
        "Cooked chicken must reach: 165°F",
      ],
    },
  },
  // A certificate from an earlier job. It has expired.
  "food-handler-certificate-2022.pdf": {
    kind: "pdf",
    doc: {
      ...CERTIFICATE,
      id: "food-handler-certificate-2022",
      name: "food-handler-certificate-2022.pdf",
      size: "176 KB",
      date: "Jun 3, 2022",
      fields: [
        { label: "Issued", value: "Jun 3, 2022" },
        { label: "Expires", value: "Jun 3, 2025" },
        { label: "Certificate no.", value: "FH-22-11935" },
      ],
    },
  },
  "shift-swap-form.pdf": {
    kind: "pdf",
    doc: {
      kind: "report",
      id: "shift-swap-form",
      name: "shift-swap-form.pdf",
      size: "58 KB",
      date: "Jul 22, 2026",
      title: "Shift Swap Request",
      meta: [
        { label: "Employee", value: "________________" },
        { label: "Date", value: "________________" },
      ],
      sectionHeading: "Fill in both shifts",
      items: [
        "My shift: day ________ time ________",
        "Coworker who will work it: ________________",
        "Coworker signature: ________________",
        "Manager approval: ________________",
      ],
      signedBy: "Give this form to your manager 48 hours before the shift.",
    },
  },
  "photo-jobsite-0714.jpg": { kind: "photo", caption: "Back patio, Jul 14" },
};
