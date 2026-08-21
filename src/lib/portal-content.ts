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
