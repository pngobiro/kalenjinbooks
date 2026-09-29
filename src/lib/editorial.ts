/**
 * Editorial tone palette.
 *
 * Replaces eight stock Tailwind gradients (emerald-500, fuchsia-600 and friends)
 * that were the most saturated thing on the site and fought the warm earth
 * brand. Every value is drawn from the site palette, so a card never looks like
 * it came from a different product.
 *
 * Defined in one place because the homepage, the author grid and the blog
 * covers all index into the same list and must stay in step.
 */
export const EDITORIAL_TONES = [
  { from: '#8A4B2A', to: '#5C3218' }, // burnt sienna
  { from: '#4F6D4C', to: '#2F452D' }, // deep sage
  { from: '#A8762B', to: '#6E4C18' }, // ochre
  { from: '#7A4B5C', to: '#4A2B36' }, // plum clay
  { from: '#3F5A6B', to: '#24353F' }, // slate teal
  { from: '#9C5A3C', to: '#5F3320' }, // terracotta
  { from: '#5B5340', to: '#33301F' }, // olive ash
  { from: '#6B4A2F', to: '#3B2917' }, // bark
] as const;

/** Pick a tone by index, wrapping safely. */
export function toneAt(index: number) {
  return EDITORIAL_TONES[((index % EDITORIAL_TONES.length) + EDITORIAL_TONES.length) % EDITORIAL_TONES.length];
}

/** Ready-to-use CSS background for a tone index. */
export function toneBackground(index: number): string {
  const t = toneAt(index);
  return `linear-gradient(140deg, ${t.from} 0%, ${t.to} 100%)`;
}
