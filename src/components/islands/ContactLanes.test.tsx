// @vitest-environment jsdom
import { afterEach, beforeEach, expect, test } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ContactLanes } from './ContactLanes';

function mountPanels() {
  document.body.innerHTML = '<div id="contact-lanes-panel-hiring" role="tabpanel"></div><div id="contact-lanes-panel-consulting" role="tabpanel"></div>';
}

beforeEach(() => {
  mountPanels();
  window.history.replaceState({}, '', '/contact');
  document.documentElement.removeAttribute('data-lane');
});
afterEach(() => { cleanup(); document.body.innerHTML = ''; });

test('defaults to consulting, toggles the SSR panels, and records the lane in the URL', async () => {
  const user = userEvent.setup();
  render(<ContactLanes locale="en" />, { container: document.body.appendChild(document.createElement('div')) });

  const consulting = screen.getByRole('tab', { name: /Consulting/ });
  const hiring = screen.getByRole('tab', { name: /Hiring/ });
  expect(consulting.getAttribute('aria-selected')).toBe('true');
  expect(document.getElementById('contact-lanes-panel-hiring')?.hidden).toBe(true);

  await user.click(hiring);
  expect(hiring.getAttribute('aria-selected')).toBe('true');
  expect(document.getElementById('contact-lanes-panel-consulting')?.hidden).toBe(true);
  expect(document.getElementById('contact-lanes-panel-hiring')?.hidden).toBe(false);
  expect(window.location.search).toBe('?lane=hiring');
});

test('reads the initial lane from the URL and clears the pre-hydration marker', () => {
  window.history.replaceState({}, '', '/contact?lane=hiring');
  document.documentElement.setAttribute('data-lane', 'hiring');
  render(<ContactLanes locale="es" />, { container: document.body.appendChild(document.createElement('div')) });

  expect(screen.getByRole('tab', { name: /Contratar/ }).getAttribute('aria-selected')).toBe('true');
  expect(document.documentElement.hasAttribute('data-lane')).toBe(false);
});
