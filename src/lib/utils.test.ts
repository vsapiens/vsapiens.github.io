import { expect, test } from 'vitest';
import * as utils from './utils';

test('cn keeps the last conflicting Tailwind utility while preserving conditional classes', () => {
  expect(utils.cn('px-3 text-ink', false, 'px-4', { 'font-mono': true })).toBe('text-ink px-4 font-mono');
});

test('formats publication dates without shifting UTC-only frontmatter dates', () => {
  const formatPublicationDate = (utils as typeof utils & {
    formatPublicationDate?: (date: Date, locale: 'en' | 'es', month?: 'short' | 'long') => string;
  }).formatPublicationDate;

  expect(formatPublicationDate?.(new Date('2025-04-15T00:00:00.000Z'), 'es')).toBe('15 de abril de 2025');
});
