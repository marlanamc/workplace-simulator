"use client";

import type { Lang } from "@/lib/task-types";
import { MATERIAL_COPY } from "@/lib/lessons/materials-links";

export default function PrintMaterials({ lang }: { lang: Lang }) {
  return <button type="button" onClick={() => window.print()} className="min-h-11 rounded-full bg-[#0b57d0] px-5 py-2 font-semibold text-white">{MATERIAL_COPY.print[lang]}</button>;
}
