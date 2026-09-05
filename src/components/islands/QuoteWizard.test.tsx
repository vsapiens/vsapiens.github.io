// @vitest-environment jsdom
import { afterEach, beforeEach, expect, test } from 'vitest';
import { cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QUOTE_STORAGE_KEY, serializeQuoteAnswers, defaultQuoteAnswers } from '@/lib/quote';
import { QuoteWizard } from './QuoteWizard';

beforeEach(() => {
  window.sessionStorage.clear();
  window.history.replaceState({}, '', '/contact');
});
afterEach(cleanup);

test('reaches a complete brief with defaults after choosing a service and describing the situation', async () => {
  const user = userEvent.setup();
  render(<QuoteWizard locale="en" />);

  const steps = within(screen.getByRole('list', { name: 'Brief steps' })).getAllByRole('button');
  expect(steps).toHaveLength(2);
  expect(steps[0].getAttribute('aria-current')).toBe('step');
  expect(steps[1].hasAttribute('disabled')).toBe(true);

  await user.click(screen.getByRole('button', { name: 'Continue' }));
  expect(screen.getByRole('alert').textContent).toContain('Choose one service.');

  await user.click(screen.getByRole('radio', { name: 'Performance audit' }));
  await user.click(screen.getByRole('button', { name: 'Continue' }));
  expect(screen.getByRole('alert').textContent).toContain('Describe the current situation.');

  await user.type(screen.getByLabelText('What is happening today?'), 'p99 doubled under checkout load');
  await user.click(screen.getByRole('button', { name: 'Continue' }));

  expect(screen.getByRole('heading', { level: 3, name: 'Your brief.' })).toBeTruthy();
  const brief = screen.getByText(/Project brief/).textContent ?? '';
  expect(brief).toContain('Service: Performance audit');
  expect(brief).toContain('Timeline: Flexible / exploring');
  expect(brief).toContain('Budget: Fixed price works for us');
  expect(screen.getByRole('radio', { name: 'Flexible / exploring' })).toBeTruthy();
  const links = screen.getAllByRole('link');
  expect(links[0].textContent).toContain('Send on WhatsApp');
  expect(links[0].getAttribute('href')).toMatch(/^https:\/\/wa\.me\/528120008400\?text=/);
});

test('pre-selects the requested service and carries its credit clause into the brief', async () => {
  window.history.replaceState({}, '', '/contact?service=diagnosis#quote');
  const user = userEvent.setup();
  render(<QuoteWizard locale="en" />);

  const diagnosis = await screen.findByRole('radio', { name: 'Systems diagnosis' });
  expect((diagnosis as HTMLInputElement).checked).toBe(true);
  await user.type(screen.getByLabelText('What is happening today?'), 'Competing explanations for a slow report.');
  await user.click(screen.getByRole('button', { name: 'Continue' }));
  expect(screen.getByText(/Project brief/).textContent).toContain('Credit: Credited toward a Performance audit booked within 30 days.');
});

test('keeps identity collapsed, reveals context only for non-fixed budgets, and restores saved answers', async () => {
  window.sessionStorage.setItem(QUOTE_STORAGE_KEY, serializeQuoteAnswers({ ...defaultQuoteAnswers, serviceId: 'performance-audit', situation: 'p99 doubled under load' }));
  const user = userEvent.setup();
  render(<QuoteWizard locale="en" />);

  expect(((await screen.findByLabelText('What is happening today?')) as HTMLTextAreaElement).value).toBe('p99 doubled under load');
  await user.click(screen.getByRole('button', { name: 'Continue' }));

  expect(screen.queryByLabelText('Name')).toBeNull();
  const toggle = screen.getByRole('button', { name: /Add who to reply to/ });
  expect(toggle.getAttribute('aria-expanded')).toBe('false');
  await user.click(toggle);
  await user.type(screen.getByLabelText('Name'), 'Ana Ruiz');
  expect(screen.getByText(/Project brief/).textContent).toContain('Name: Ana Ruiz');

  expect(screen.queryByLabelText(/Anything else that shapes the scope/)).toBeNull();
  await user.click(screen.getByRole('radio', { name: 'We need a formal quote with an invoice' }));
  expect(screen.getByLabelText(/Anything else that shapes the scope/)).toBeTruthy();
});

test('changes the service without losing the situation and clears storage on start over', async () => {
  const user = userEvent.setup();
  render(<QuoteWizard locale="es" />);

  await user.click(screen.getByRole('radio', { name: 'Auditoría de rendimiento' }));
  await user.type(screen.getByLabelText('¿Qué está ocurriendo hoy?'), 'La latencia cambia bajo carga real.');
  await user.click(screen.getByRole('button', { name: 'Continuar' }));
  expect(screen.getByText(/Resumen del proyecto/).textContent).toContain('Plazo: Flexible / explorando');

  await user.click(screen.getByRole('button', { name: 'Cambiar servicio' }));
  expect((screen.getByLabelText('¿Qué está ocurriendo hoy?') as HTMLTextAreaElement).value).toBe('La latencia cambia bajo carga real.');
  expect(window.sessionStorage.getItem(QUOTE_STORAGE_KEY)).not.toBeNull();

  await user.click(screen.getByRole('button', { name: 'Empezar de nuevo' }));
  expect(window.sessionStorage.getItem(QUOTE_STORAGE_KEY)).toBeNull();
  expect((screen.getByLabelText('¿Qué está ocurriendo hoy?') as HTMLTextAreaElement).value).toBe('');
});
