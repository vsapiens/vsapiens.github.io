import { expect, test } from 'vitest';
import { cn } from './utils';

test('cn keeps the last conflicting Tailwind utility while preserving conditional classes', () => {
  expect(cn('px-3 text-ink', false, 'px-4', { 'font-mono': true })).toBe('text-ink px-4 font-mono');
});
