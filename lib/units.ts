const UNIT_TO_ML: Record<string, number> = {
  ml: 1,
  millilitre: 1,
  millilitres: 1,
  milliliter: 1,
  milliliters: 1,
  cl: 10,
  l: 1000,
  litre: 1000,
  liter: 1000,
  oz: 29.57,
  ounce: 29.57,
  ounces: 29.57,
  "fl oz": 29.57,
  shot: 44.36,
  shots: 44.36,
  jigger: 44.36,
  cup: 236.59,
  cups: 236.59,
  tsp: 4.93,
  teaspoon: 4.93,
  teaspoons: 4.93,
  tbsp: 14.79,
  tablespoon: 14.79,
  tablespoons: 14.79,
  dash: 0.92,
  dashes: 0.92,
  splash: 6,
  splashes: 6,
  drop: 0.05,
  drops: 0.05,
  pint: 473.18,
  pints: 473.18,
};

function parseLeadingNumber(text: string): { value: number; rest: string } | null {
  const trimmed = text.trim();
  // mixed number "1 1/2" or simple fraction "1/2" or decimal/int, also handles ranges "2-3" -> average
  const mixedMatch = trimmed.match(/^(\d+)\s+(\d+)\/(\d+)\s*(.*)$/);
  if (mixedMatch) {
    const whole = Number(mixedMatch[1]);
    const num = Number(mixedMatch[2]);
    const den = Number(mixedMatch[3]);
    return { value: whole + num / den, rest: mixedMatch[4] };
  }
  const fractionMatch = trimmed.match(/^(\d+)\/(\d+)\s*(.*)$/);
  if (fractionMatch) {
    const num = Number(fractionMatch[1]);
    const den = Number(fractionMatch[2]);
    return { value: num / den, rest: fractionMatch[3] };
  }
  const rangeMatch = trimmed.match(/^(\d+(?:\.\d+)?)\s*-\s*(\d+(?:\.\d+)?)\s*(.*)$/);
  if (rangeMatch) {
    const a = Number(rangeMatch[1]);
    const b = Number(rangeMatch[2]);
    return { value: (a + b) / 2, rest: rangeMatch[3] };
  }
  const numberMatch = trimmed.match(/^(\d+(?:\.\d+)?)\s*(.*)$/);
  if (numberMatch) {
    return { value: Number(numberMatch[1]), rest: numberMatch[2] };
  }
  return null;
}

/**
 * Convertit une mesure texte (issue de TheCocktailDB ou saisie libre) en millilitres.
 * Retourne null quand la mesure est relative ou non quantifiable ("part", "fill with", garniture...).
 */
export function parseMeasureToMl(measureRaw: string | null | undefined): number | null {
  if (!measureRaw) return null;
  const text = measureRaw.toLowerCase().replace(/\s+/g, " ").trim();
  if (!text) return null;

  if (/(fill|top)\s?(it)?\s?(up)?\s?with/.test(text)) return null;
  if (/^(part|parts)\b/.test(text)) return null;

  const leading = parseLeadingNumber(text);
  if (!leading) return null;

  const rest = leading.rest.trim();
  // trier les unités les plus longues d'abord pour matcher "fl oz" avant "oz"
  const units = Object.keys(UNIT_TO_ML).sort((a, b) => b.length - a.length);
  for (const unit of units) {
    if (rest === unit || rest.startsWith(unit + " ") || rest.startsWith(unit)) {
      return Math.round(leading.value * UNIT_TO_ML[unit] * 100) / 100;
    }
  }
  if (/^part/.test(rest)) return null;
  return null;
}

export function formatMl(ml: number): string {
  if (ml >= 1000) return `${(ml / 1000).toFixed(2).replace(/\.00$/, "")} L`;
  return `${Math.round(ml)} ml`;
}
