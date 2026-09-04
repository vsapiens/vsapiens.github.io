import { describe, expect, test } from 'vitest';
import {
  buildQuoteBrief,
  createMailtoUrl,
  createWhatsAppUrl,
  formatPrice,
  getLocalizedPath,
  validateQuoteAnswers,
  type QuoteAnswers,
} from './quote';

const completeAnswers: QuoteAnswers = {
  serviceId: 'performance-audit',
  situation: 'API p99 regressions under checkout load',
  timeline: 'Within 4 weeks',
  budgetContext: 'Need an audit before the next launch.',
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

  test('reports every required quote answer when the form is incomplete', () => {
    expect(validateQuoteAnswers({ serviceId: '', situation: '  ', timeline: '', budgetContext: '' })).toEqual({
      valid: false,
      errors: {
        serviceId: 'Choose a service.',
        situation: 'Describe the current situation.',
        timeline: 'Choose a timeline.',
        budgetContext: 'Add budget or project context.',
      },
    });
  });

  test('builds a recruiter-readable English brief from complete answers', () => {
    expect(buildQuoteBrief(completeAnswers, 'en')).toBe(
      'Project brief\n\nService: Performance audit\nInvestment: USD 1,500\nSituation: API p99 regressions under checkout load\nTimeline: Within 4 weeks\nBudget / context: Need an audit before the next launch.',
    );
  });

  test('builds a Spanish brief using the Mexican price', () => {
    expect(buildQuoteBrief(completeAnswers, 'es')).toBe(
      'Resumen del proyecto\n\nServicio: Auditoría de rendimiento\nInversión: MXN 30,000\nSituación: API p99 regressions under checkout load\nPlazo: Within 4 weeks\nPresupuesto / contexto: Need an audit before the next launch.',
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
});
