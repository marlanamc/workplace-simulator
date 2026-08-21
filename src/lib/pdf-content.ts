export interface PdfDocument {
  id: string;
  name: string;
  size: string;
  date: string;
  pages: string[][];
}

export const PDF_DOCUMENTS: PdfDocument[] = [
  {
    id: "safety-report-july",
    name: "safety-report-july.pdf",
    size: "248 KB",
    date: "Aug 1, 2026",
    pages: [
      [
        "HARBORSIDE CAFE — MONTHLY SAFETY REPORT",
        "Month: July 2026    Location: Main Street",
        "",
        "Incidents reported: 1 (minor slip, no injury — cleaned within 5 minutes)",
        "Fire extinguisher check: Passed, Jul 3",
        "First aid kit restocked: Jul 10",
        "Floor mats inspected: Jul 10 — replaced one worn mat near the ice machine",
        "",
        "Prepared by: Maria Delgado, Cafe Manager",
      ],
    ],
  },
  {
    id: "paystub-aug-1",
    name: "paystub-aug-1-15.pdf",
    size: "96 KB",
    date: "Aug 16, 2026",
    pages: [
      [
        "HARBORSIDE CAFE — EARNINGS STATEMENT",
        "Pay period: Aug 1 – Aug 15, 2026    Pay date: Aug 16, 2026",
        "",
        "Regular hours: 62.5 @ $13.20/hr        $825.00",
        "Overtime hours: 3 @ $19.80/hr           $59.40",
        "Gross pay:                              $864.00",
        "",
        "Federal tax withheld:                   -$86.40",
        "State tax withheld:                     -$25.92",
        "Social Security / Medicare:              -$9.50",
        "Net pay:                                $742.18",
      ],
    ],
  },
];
