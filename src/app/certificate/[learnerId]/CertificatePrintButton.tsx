"use client";

export default function CertificatePrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="inline-flex min-h-[46px] items-center rounded-full border border-[var(--border)] px-5 text-[15px] font-medium text-[var(--text-primary)] hover:bg-[var(--surface-muted)] cursor-pointer print:hidden"
    >
      Print
    </button>
  );
}
