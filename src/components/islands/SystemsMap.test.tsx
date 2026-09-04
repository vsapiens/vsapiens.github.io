// @vitest-environment jsdom
import { afterEach, expect, test } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SystemsMap } from './SystemsMap';

afterEach(cleanup);

test('switches system lenses and exposes the selected node evidence', async () => {
  const user = userEvent.setup();
  render(<SystemsMap locale="en" />);

  expect(screen.getByRole('tabpanel').textContent).toContain('Human direction');
  await user.click(screen.getByRole('tab', { name: 'Performance' }));
  expect(screen.getByRole('tabpanel').textContent).toContain('Observe under load');

  await user.click(screen.getByRole('button', { name: 'Inspect Verification' }));
  expect(screen.getByRole('progressbar', { name: 'Verification position' }).getAttribute('aria-valuenow')).toBe('80');
  expect(screen.getByText('Evidence before authorization')).toBeTruthy();
});

test('shows dependency annotations on request and opens node detail in a dialog', async () => {
  const user = userEvent.setup();
  render(<SystemsMap locale="en" />);

  await user.click(screen.getByRole('radio', { name: 'Dependencies' }));
  expect(screen.getByText('context → execution')).toBeTruthy();

  await user.click(screen.getByRole('button', { name: 'Inspect Verification' }));
  await user.click(screen.getByRole('button', { name: 'Open Verification detail' }));
  expect(screen.getByRole('dialog', { name: 'Verification' }).textContent).toContain('tests, review, and observed output');

  await user.keyboard('{Escape}');
  expect(screen.queryByRole('dialog', { name: 'Verification' })).toBeNull();
});
