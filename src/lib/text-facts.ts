/** Numeric tokens, with common English/Spanish currency grouping. Never match inside a larger number. */
export function mentionsAmount(text: string, expected: number): boolean {
  const tokens = text.match(/\d+(?:[.,\u00a0 ]\d+)*/g) ?? [];
  return tokens.some((raw) => {
    let token = raw.trim().replace(/[\u00a0 ]/g, '');
    if (/^\d{1,3}([.,]\d{3})+([.,]\d{1,2})?$/.test(token)) {
      token = token.replace(/[.,](?=\d{3}(?:[.,]|$))/g, '');
    }
    token = token.replace(',', '.');
    return Math.abs(Number(token) - expected) < 0.001;
  });
}

/**
 * A money amount as a learner types it into one box: "$42.50", "42.50",
 * "42.5", "42,50" (comma for cents, as in much of the world), "1,234.50".
 * Null when it is not a single amount.
 */
export function parseMoney(raw: string): number | null {
  let s = raw.trim().replace(/^\$\s*/, "").replace(/\s+/g, "");
  if (!s) return null;
  if (/^\d+,\d{1,2}$/.test(s)) s = s.replace(",", ".");
  else if (/^\d{1,3}(,\d{3})+(\.\d{1,2})?$/.test(s)) s = s.replace(/,/g, "");
  if (!/^\d+(\.\d{1,2})?$|^\.\d{1,2}$/.test(s)) return null;
  return Number(s);
}
