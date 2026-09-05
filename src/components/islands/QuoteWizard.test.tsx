// @vitest-environment jsdom
import { afterEach, beforeEach, expect, test } from 'vitest';
import { cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QUOTE_STORAGE_KEY, serializeQuoteAnswers, emptyQuoteAnswers } from '@/lib/quote';
import { QuoteWizard } from './QuoteWizard';

beforeEach(() => {
  window.sessionStorage.clear();
  window.history.replaceState({}, '', '/contact');
});
afterEach(cleanup);

test('exposes a 1:1 clickable stepper and blocks unreached steps', async () => {
  const user = userEvent.setup();
  render(<QuoteWizard locale="en" />);

  const stepper = screen.getByRole('list', { name: 'Brief steps' });
  const buttons = within(stepper).getAllByRole('button');
  expect(buttons).toHaveLength(4);
  expect(buttons[0].getAttribute('aria-current')).toBe('step');
  expect(buttons[1].hasAttribute('disabled')).toBe(true);

  await user.click(screen.getByRole('button', { name: 'Continue → Situation' }));
  expect(screen.getByRole('alert').textContent).toBe('Choose one service.');

  await user.click(screen.getByRole('radio', { name: /Performance audit/ }));
  await user.click(screen.getByRole('button', { name: 'Continue → Situation' }));
  expect(within(stepper).getAllByRole('button')[1].getAttribute('aria-current')).toBe('step');
  expect(screen.getByRole('heading', { level: 3, name: 'What is happening today?' })).toBeTruthy();
});

test('pre-selects the requested service, starts on the situation step, and fills the ledger', async () => {
  window.history.replaceState({}, '', '/contact?service=diagnosis#quote');
  render(<QuoteWizard locale="en" />);

  expect(await screen.findByRole('heading', { level: 3, name: 'What is happening today?' })).toBeTruthy();
  const ledger = screen.getByRole('complementary', { name: 'BRIEF / LEDGER' });
  expect(ledger.textContent).toContain('Systems diagnosis');
  expect(ledger.textContent).toContain('USD 500 · MXN 10,000');
  expect(ledger.textContent).toContain('Credited toward a Performance audit booked within 30 days.');
  expect(within(ledger).getByRole('button', { name: 'Edit: Service' })).toBeTruthy();
});

test('restores answers saved in this tab and shows the character budget', async () => {
  window.sessionStorage.setItem(QUOTE_STORAGE_KEY, serializeQuoteAnswers({ ...emptyQuoteAnswers, serviceId: 'performance-audit', situation: 'p99 doubled under load' }));
  const user = userEvent.setup();
  render(<QuoteWizard locale="en" />);

  await user.click(await screen.findByRole('button', { name: 'Continue → Situation' }));
  const textarea = screen.getByLabelText('What is happening today?') as HTMLTextAreaElement;
  expect(textarea.value).toBe('p99 doubled under load');
  expect(screen.getByText('22 / 600 characters')).toBeTruthy();
});

test('reviews a complete brief, orders WhatsApp first, and clears storage on start over', async () => {
  const user = userEvent.setup();
  render(<QuoteWizard locale="es" />);

  await user.click(screen.getByRole('radio', { name: /Auditoría de rendimiento/ }));
  await user.click(screen.getByRole('button', { name: 'Continuar → Situación' }));
  await user.type(screen.getByLabelText('¿Qué está ocurriendo hoy?'), 'La latencia cambia bajo carga real.');
  await user.click(screen.getByRole('button', { name: 'Continuar → Plazo' }));
  await user.click(screen.getByRole('radio', { name: /Dentro de 2/ }));
  await user.click(screen.getByRole('radio', { name: /El precio fijo/ }));
  await user.click(screen.getByRole('button', { name: 'Revisar resumen' }));

  const brief = screen.getByText(/Resumen del proyecto/).textContent ?? '';
  expect(brief).toContain('Inversión: MXN 30,000 · USD 1,500');
  expect(brief).toContain('Duración: 2–3 semanas');
  expect(brief).toContain('Presupuesto: El precio fijo nos funciona');
  const links = screen.getAllByRole('link');
  expect(links[0].textContent).toContain('Enviar por WhatsApp');
  expect(links[0].getAttribute('href')).toMatch(/^https:\/\/wa\.me\/528120008400\?text=/);
  expect(window.sessionStorage.getItem(QUOTE_STORAGE_KEY)).not.toBeNull();

  await user.click(screen.getByRole('button', { name: 'Empezar de nuevo' }));
  expect(window.sessionStorage.getItem(QUOTE_STORAGE_KEY)).toBeNull();
  expect(screen.getByRole('heading', { level: 3, name: '¿Qué tipo de ayuda necesitas?' })).toBeTruthy();
});
