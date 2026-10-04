"use client";
import type { Lang } from "@/lib/task-types";
export default function PrintConfidence({ lang }: { lang: Lang }) {
  return <button type="button" className="min-h-11 rounded-full border px-4 py-2" onClick={() => window.print()}>{lang === "es" ? "Imprimir esta hoja" : "Print this sheet"}</button>;
}
