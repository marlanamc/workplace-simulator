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
