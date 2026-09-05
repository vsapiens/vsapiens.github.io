import { readFileSync } from 'node:fs';
import { expect, test } from 'vitest';

/** WCAG 2.x relative luminance and contrast ratio for sRGB hex colors. */
function luminance(hex: string): number {
  const channel = (value: number) => {
    const c = value / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  const [r, g, b] = [1, 3, 5].map((offset) => channel(parseInt(hex.slice(offset, offset + 2), 16)));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
export function contrastRatio(foreground: string, background: string): number {
  const [light, dark] = [luminance(foreground), luminance(background)].sort((a, b) => b - a);
  return (light + 0.05) / (dark + 0.05);
}

// The quote tokens as declared in quote.css / global.css. Keep in sync when a token changes.
const tokens = {
  ink: '#101828', text: '#1F2A3D', muted: '#475467', label: '#5F6879',
  surface: '#EEF2F7', canvas: '#F7F9FC', onDark: '#E6EAF0', onDarkMuted: '#A9B2C2',
};

const textPairs: [keyof typeof tokens, keyof typeof tokens][] = [
  ['text', 'canvas'], ['text', 'surface'], ['muted', 'canvas'], ['muted', 'surface'], ['label', 'canvas'], ['label', 'surface'],
  ['onDark', 'ink'], ['onDarkMuted', 'ink'],
];
const boundaryPairs: [keyof typeof tokens, keyof typeof tokens][] = [['label', 'canvas'], ['onDark', 'ink'], ['ink', 'canvas']];

test('every quote text pair meets WCAG AA (4.5:1) after the contrast reduction', () => {
  for (const [fg, bg] of textPairs) {
    expect(contrastRatio(tokens[fg], tokens[bg]), `${fg} on ${bg}`).toBeGreaterThanOrEqual(4.5);
  }
});

test('field underlines and the dark band boundary meet 3:1 against their surroundings', () => {
  for (const [fg, bg] of boundaryPairs) {
    expect(contrastRatio(tokens[fg], tokens[bg]), `${fg} on ${bg}`).toBeGreaterThanOrEqual(3);
  }
});

test('the quote stylesheet stays monochrome: no accent tokens, no hard-coded accent colors', () => {
  const css = readFileSync(new URL('./quote.css', import.meta.url), 'utf8');
  for (const forbidden of ['--technical-blue', '--systems-violet', '--signal-coral', '#0B5FFF', '#6D28D9', '#FF5A3D', '#f5f3ff', '#fff2ef', '#b42318']) {
    expect(css.toLowerCase(), `quote.css must not use ${forbidden}`).not.toContain(forbidden.toLowerCase());
  }
});
