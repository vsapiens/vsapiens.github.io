import { describe, expect, test } from 'vitest';
import { services } from '../data/site';
import {
  MAILTO_SAFE_LENGTH,
  QUOTE_STORAGE_KEY,
  TEXTAREA_MAX,
  WHATSAPP_SOFT_LIMIT,
  buildQuoteBrief,
  createMailtoUrl,
  createWhatsAppUrl,
  defaultQuoteAnswers,
  emptyQuoteAnswers,
  formatCreditClause,
  formatDualPrice,
  formatPrice,
  getBriefBudget,
  getHandoffUrls,
  getLocalizedPath,
  getRequestedService,
  parseQuoteAnswers,
  resolveInitialLane,
  serializeQuoteAnswers,
  timelineLabels,
  validateQuoteAnswers,
  type QuoteAnswers,
} from './quote';

const completeAnswers: QuoteAnswers = {
  ...emptyQuoteAnswers,
  serviceId: 'performance-audit',
  situation: 'API p99 regressions under checkout load',
  timeline: 'weeks',
  budgetMode: 'fixed',
};

describe('quote helpers', () => {
  test('adds or removes the Spanish prefix without duplicating it', () => {
    expect(getLocalizedPath('/work#selected', 'es')).toBe('/es/work#selected');
    expect(getLocalizedPath('/es/work', 'en')).toBe('/work');
  });

  test('formats the approved currency for the active locale', () => {
    expect(formatPrice({ usd: 1500, mxn: 30000 }, 'en')).toBe('USD 1,500');
    expect(formatPrice({ usd: 1500, mxn: 30000 }, 'es')).toBe('MXN 30,000');
  });

  test('formats both currencies with the locale currency first', () => {
    expect(formatDualPrice({ usd: 1500, mxn: 30000 }, 'en')).toBe('USD 1,500 · MXN 30,000');
    expect(formatDualPrice({ usd: 1500, mxn: 30000 }, 'es')).toBe('MXN 30,000 · USD 1,500');
  });

  test('renders the diagnosis credit clause and nothing for services without credit', () => {
    const diagnosis = services.find((service) => service.id === 'diagnosis')!;
    const audit = services.find((service) => service.id === 'performance-audit')!;
    expect(formatCreditClause(diagnosis, 'en')).toBe('Credited toward a Performance audit booked within 30 days.');
    expect(formatCreditClause(diagnosis, 'es')).toBe('Se descuenta de una Auditoría de rendimiento contratada dentro de 30 días.');
    expect(formatCreditClause(audit, 'en')).toBe('');
  });

  test('reports every required quote answer when the form is incomplete', () => {
    expect(validateQuoteAnswers({ serviceId: '', situation: '  ', timeline: '', budgetMode: '' })).toEqual({
      valid: false,
      errors: {
        serviceId: 'Choose a service.',
        situation: 'Describe the current situation.',
        timeline: 'Choose a timeline.',
        budgetMode: 'Choose how you want to handle budget.',
      },
    });
  });

  test('starts from honest defaults: flexible timeline and fixed price', () => {
    expect(defaultQuoteAnswers).toEqual({ ...emptyQuoteAnswers, timeline: 'flexible', budgetMode: 'fixed' });
    expect(validateQuoteAnswers({ ...defaultQuoteAnswers, serviceId: 'diagnosis', situation: 'p99 doubled' })).toEqual({ valid: true, errors: {} });
    expect(timelineLabels.en.flexible).toBe('Flexible / exploring');
    expect(timelineLabels.es.urgent).toBe('Urgente / motivado por incidente');
  });

  test('rejects a timeline that is not one of the offered keys', () => {
    expect(validateQuoteAnswers({ ...completeAnswers, timeline: 'Within 4 weeks' as QuoteAnswers['timeline'] }).errors).toEqual({ timeline: 'Choose a timeline.' });
  });

  test('rejects a non-empty service identifier that is not offered', () => {
    expect(validateQuoteAnswers({ ...completeAnswers, serviceId: 'unsupported-service' })).toEqual({
      valid: false,
      errors: { serviceId: 'Choose a valid service.' },
    });
  });

  test('accepts a complete quote with an offered service and no optional fields', () => {
    expect(validateQuoteAnswers(completeAnswers)).toEqual({ valid: true, errors: {} });
  });

  test('builds an English brief with dual pricing, duration, and budget mode, omitting empty optional lines', () => {
    expect(buildQuoteBrief(completeAnswers, 'en')).toBe(
      'Project brief\n\nService: Performance audit\nInvestment: USD 1,500 · MXN 30,000\nDuration: 2–3 weeks\nSituation: API p99 regressions under checkout load\nTimeline: Within 2–4 weeks\nBudget: Fixed price works for us',
    );
  });

  test('adds identity, context, and credit lines only when they apply', () => {
    const answers: QuoteAnswers = {
      ...completeAnswers,
      serviceId: 'diagnosis',
      name: 'Ana Ruiz',
      company: 'Acme',
      role: 'CTO',
      budgetMode: 'invoice',
      budgetContext: 'Need a CFDI before starting.',
    };
    expect(buildQuoteBrief(answers, 'en')).toBe(
      'Project brief\n\nName: Ana Ruiz\nCompany: Acme\nRole: CTO\nService: Systems diagnosis\nInvestment: USD 500 · MXN 10,000\nDuration: 3–5 working days\nCredit: Credited toward a Performance audit booked within 30 days.\nSituation: API p99 regressions under checkout load\nTimeline: Within 2–4 weeks\nBudget: We need a formal quote with an invoice\nContext: Need a CFDI before starting.',
    );
  });

  test('builds a Spanish brief using the Mexican price first', () => {
    expect(buildQuoteBrief(completeAnswers, 'es')).toBe(
      'Resumen del proyecto\n\nServicio: Auditoría de rendimiento\nInversión: MXN 30,000 · USD 1,500\nDuración: 2–3 semanas\nSituación: API p99 regressions under checkout load\nPlazo: Dentro de 2–4 semanas\nPresupuesto: El precio fijo nos funciona',
    );
  });

  test('encodes the whole WhatsApp brief for the configured destination', () => {
    expect(createWhatsAppUrl('Performance brief & scope')).toBe(
      'https://wa.me/528120008400?text=Performance%20brief%20%26%20scope',
    );
  });

  test('uses email as an encoded fallback for the generated brief', () => {
    expect(createMailtoUrl('Project brief', 'Line one & two')).toBe(
      'mailto:iamerickfrank@gmail.com?subject=Project%20brief&body=Line%20one%20%26%20two',
    );
  });

  test('measures the encoded hand-off budget and flags the client limits', () => {
    const short = getBriefBudget('Short brief', 'Subject');
    expect(short.chars).toBe(11);
    expect(short.mailtoLength).toBe(createMailtoUrl('Subject', 'Short brief').length);
    expect(short.whatsappLength).toBe(createWhatsAppUrl('Short brief').length);
    expect(short).toMatchObject({ mailtoOverLimit: false, whatsappOverLimit: false });

    const accented = 'ñ'.repeat(700);
    const long = getBriefBudget(accented, 'Subject');
    expect(long.mailtoLength).toBeGreaterThan(MAILTO_SAFE_LENGTH);
    expect(long.mailtoOverLimit).toBe(true);
    expect(long.whatsappOverLimit).toBe(true);
    expect(TEXTAREA_MAX).toBe(600);
    expect(WHATSAPP_SOFT_LIMIT).toBe(1000);
  });

  test('keeps WhatsApp primary for a normal brief and falls back to copy when the mailto would be truncated', () => {
    const normal = getHandoffUrls('Project brief\n\nService: Performance audit', 'Project brief');
    expect(normal.primary).toBe('whatsapp');
    expect(normal.mailto).toContain('body=Project%20brief');

    const oversized = getHandoffUrls('x'.repeat(2500), 'Project brief');
    expect(oversized.primary).toBe('copy');
    expect(oversized.mailto).toBe('mailto:iamerickfrank@gmail.com?subject=Project%20brief');
    expect(oversized.whatsapp).toContain('wa.me');
  });

  test('round-trips answers through session storage and rejects unusable payloads', () => {
    const answers: QuoteAnswers = { ...completeAnswers, name: 'Ana', budgetContext: 'x'.repeat(TEXTAREA_MAX + 50) };
    const parsed = parseQuoteAnswers(serializeQuoteAnswers(answers));
    expect(parsed).toMatchObject({ serviceId: 'performance-audit', name: 'Ana', budgetMode: 'fixed' });
    expect(parsed?.budgetContext).toHaveLength(TEXTAREA_MAX);
    expect(QUOTE_STORAGE_KEY).toBe('quote-brief:v1');

    expect(parseQuoteAnswers(null)).toBeNull();
    expect(parseQuoteAnswers('not json')).toBeNull();
    expect(parseQuoteAnswers(JSON.stringify({ version: 99, answers }))).toBeNull();
    expect(parseQuoteAnswers(JSON.stringify({ version: 1, answers: { serviceId: 'nope', timeline: 'Within 4 weeks', budgetMode: 'weird', extra: 1 } }))).toEqual({
      ...defaultQuoteAnswers,
    });
  });

  test('resolves the contact lane and requested service from the URL', () => {
    expect(resolveInitialLane('', '')).toBe('consulting');
    expect(resolveInitialLane('?lane=hiring', '')).toBe('hiring');
    expect(resolveInitialLane('?lane=hiring', '#quote')).toBe('consulting');
    expect(resolveInitialLane('?service=diagnosis', '')).toBe('consulting');
    expect(resolveInitialLane('', '#hiring')).toBe('hiring');
    expect(getRequestedService('?service=diagnosis')).toBe('diagnosis');
    expect(getRequestedService('?service=nope')).toBe('');
  });
});
