import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { TASK_LIST } from "@/lib/tasks/registry";
import { TAB_META, TAB_META_BY_KEY, tabLabel } from "@/lib/tabs";

/** Story Mode Audit Stream I: finding #15 (the Spanish pass). */

/** "Abre Recepción en los marcadores" / "Siguiente: Abrir Portal" → "Recepción" / "Portal". */
const NAMED_BOOKMARK = /^(?:Siguiente: )?(?:Abre|Abrir) (.+?)(?: en los marcadores)?$/;

describe("#15 the Spanish card names the bookmark that is on screen", () => {
  it.each(TASK_LIST.filter((d) => !d.retired).map((d) => [d.key, d] as const))("%s", (_key, d) => {
    const named = NAMED_BOOKMARK.exec(d.handoffCta.es)?.[1];
    if (!named) return; // The CTA names an action ("Pide un cambio"), not a bookmark.
    const tabKeys = d.location?.tab
      ? [d.location.tab]
      : TAB_META.filter((t) => t.label === d.bookmarkLabel).map((t) => t.key);
    expect(tabKeys.length, `${d.key}: no tab is labeled ${d.bookmarkLabel}`).toBeGreaterThan(0);
    for (const key of tabKeys) {
      const onScreen = tabLabel(key, TAB_META_BY_KEY[key].label, "es");
      expect(named, `${d.key}: the card says "${d.handoffCta.es}" but the bookmark reads "${onScreen}"`).toBe(onScreen);
    }
  });
});

/**
 * Learner-gendered Spanish. The learner's gender is unknown, so copy addressed
 * to "tú" uses neutral constructions ("Te damos la bienvenida", "Te sientes
 * mal", "Ya tienes todo"). Kept deliberately narrow so it does not flag
 * nouns ("la lista") or other characters ("Maria está ocupada").
 */
const LEARNER_GENDERED: RegExp[] = [
  /(?<!\p{L})(estás|eres|estabas|estarás|quedaste|te sientes|no estés|seas) (muy |tan |más )?(listo|lista|seguro|segura|solo|sola|enfermo|enferma|cansado|cansada|ocupado|ocupada|perfecto|perfecta|nuevo|nueva|supervisor|supervisora|administrador|administradora)(\/[oa])?(?!\p{L})/iu,
  /(?<!\p{L})(tú|ti) (mismo|misma|solo|sola)(?!\p{L})/iu,
  /(?<!\p{L}|la |una |de )bienvenid[oa]s?(?!\p{L})(?! *")/iu,
  /(?<!\p{L})(Estimado|Estimada) (solicitante|empleado|empleada)(?!\p{L})/u,
  /(?<!\p{L})sin ser (grosero|grosera)(?!\p{L})/iu,
];

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = path.join(dir, name);
    if (statSync(full).isDirectory()) return name === "__tests__" ? [] : sourceFiles(full);
    return /\.(ts|tsx)$/.test(name) ? [full] : [];
  });
}

describe("#15 Spanish copy does not assume the learner's gender", () => {
  const root = path.resolve(__dirname, "../..");
  const hits: string[] = [];
  for (const file of sourceFiles(root)) {
    readFileSync(file, "utf8").split("\n").forEach((line, i) => {
      for (const re of LEARNER_GENDERED) {
        const m = re.exec(line);
        if (m) hits.push(`${path.relative(root, file)}:${i + 1}  «${m[0]}»`);
      }
    });
  }
  it("has no learner-gendered forms in src/", () => {
    expect(hits).toEqual([]);
  });
});

describe("#15 calques named in the audit stay fixed", () => {
  const root = path.resolve(__dirname, "../..");
  const CALQUES: RegExp[] = [
    /Este día está hecho/,
    /(?<!\p{L})(aplica|aplicar|aplicas|Aplicar|Aplica)(?= (a|para|antes|de todos|\.|,|"))|Aplicar a este|Luego aplica\./u,
    /En el piso"|Nos vemos en el piso|pregunta del piso|El piso está lleno/,
    /Me dieron regular|leche regular/,
    /reportarte conmigo|sigues reportándome/,
  ];
  const hits: string[] = [];
  for (const file of sourceFiles(root)) {
    readFileSync(file, "utf8").split("\n").forEach((line, i) => {
      for (const re of CALQUES) {
        const m = re.exec(line);
        if (m) hits.push(`${path.relative(root, file)}:${i + 1}  «${m[0]}»`);
      }
    });
  }
  it("has none of them in src/", () => {
    expect(hits).toEqual([]);
  });
});
