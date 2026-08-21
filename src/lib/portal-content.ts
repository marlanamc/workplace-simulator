export const TIMECLOCK = {
  status: "Clocked in",
  clockedInAt: "8:02 AM",
  todayHours: "1h 10m so far",
  weekHours: "24h 30m this week",
  recent: [
    { date: "Mon, Aug 18", in: "6:58 AM", out: "3:04 PM", total: "8h 06m" },
    { date: "Sat, Aug 16", in: "8:01 AM", out: "4:00 PM", total: "7h 59m" },
    { date: "Fri, Aug 15", in: "10:03 AM", out: "6:02 PM", total: "7h 59m" },
  ],
};

export interface PayStub {
  id: string;
  period: string;
  payDate: string;
  gross: string;
  net: string;
}

export const PAY_STUBS: PayStub[] = [
  { id: "aug-1", period: "Aug 1 – Aug 15", payDate: "Aug 16, 2026", gross: "$864.00", net: "$742.18" },
  { id: "jul-2", period: "Jul 16 – Jul 31", payDate: "Aug 1, 2026", gross: "$901.50", net: "$774.61" },
  { id: "jul-1", period: "Jul 1 – Jul 15", payDate: "Jul 16, 2026", gross: "$832.00", net: "$714.99" },
];
