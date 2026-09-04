// @vitest-environment jsdom
import { afterEach, expect, test } from 'vitest';
import { cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SiteNavigation } from './SiteNavigation';

afterEach(cleanup);

test('opens the mobile navigation as a labelled sheet and closes it with Escape', async () => {
  const user = userEvent.setup();
  render(<SiteNavigation locale="en" currentPath="/" />);

  expect(screen.queryByRole('dialog', { name: 'Site navigation' })).toBeNull();

  await user.click(screen.getByRole('button', { name: 'Open navigation' }));
  const sheet = screen.getByRole('dialog', { name: 'Site navigation' });
  expect(within(sheet).getByRole('link', { name: 'Work' }).getAttribute('href')).toBe('/work');

  await user.keyboard('{Escape}');
  expect(screen.queryByRole('dialog', { name: 'Site navigation' })).toBeNull();
});

test('keeps Spanish navigation and locale switching on Spanish routes', () => {
  render(<SiteNavigation locale="es" currentPath="/es/work" />);

  expect(screen.getByRole('link', { name: 'Trabajo' }).getAttribute('aria-current')).toBe('page');
  expect(screen.getByRole('link', { name: 'English' }).getAttribute('href')).toBe('/work');
});

test('localizes the mobile navigation dialog controls', async () => {
  const user = userEvent.setup();
  render(<SiteNavigation locale="es" currentPath="/es" />);

  await user.click(screen.getByRole('button', { name: 'Abrir navegación' }));

  expect(screen.getByRole('button', { name: 'Cerrar' })).toBeTruthy();
});

test('keeps the work section current on case-study routes', () => {
  render(<SiteNavigation locale="en" currentPath="/work/vitrina" />);

  expect(screen.getByRole('link', { name: 'Work' }).getAttribute('aria-current')).toBe('page');
});
