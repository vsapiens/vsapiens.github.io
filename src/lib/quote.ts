import { contact, services, type Locale, type Price, type Service } from '../data/site';

export interface QuoteAnswers {
  serviceId: string;
  situation: string;
  timeline: string;
  budgetContext: string;
}

export type QuoteField = keyof QuoteAnswers;

export interface QuoteValidation {
  valid: boolean;
  errors: Partial<Record<QuoteField, string>>;
}

const requiredFields: readonly { field: QuoteField; message: string }[] = [
  { field: 'serviceId', message: 'Choose a service.' },
  { field: 'situation', message: 'Describe the current situation.' },
  { field: 'timeline', message: 'Choose a timeline.' },
  { field: 'budgetContext', message: 'Add budget or project context.' },
];

export function getLocalizedPath(path: string, locale: Locale): string {
  const match = path.match(/^([^?#]*)(.*)$/);
  const pathname = match?.[1] || '/';
  const suffix = match?.[2] || '';
  const canonicalPath = pathname === '/es' ? '/' : pathname.replace(/^\/es(?=\/)/, '') || '/';

  if (locale === 'en') return `${canonicalPath}${suffix}`;
  return `${canonicalPath === '/' ? '/es' : `/es${canonicalPath}`}${suffix}`;
}

export function formatPrice(price: Price, locale: Locale): string {
  const currency = locale === 'en' ? 'USD' : 'MXN';
  const amount = locale === 'en' ? price.usd : price.mxn;
  return `${currency} ${new Intl.NumberFormat('en-US').format(amount)}`;
}

/** Both currencies on one line, the locale's currency first: `USD 1,500 · MXN 30,000`. */
export function formatDualPrice(price: Price, locale: Locale): string {
  const usd = `USD ${new Intl.NumberFormat('en-US').format(price.usd)}`;
  const mxn = `MXN ${new Intl.NumberFormat('en-US').format(price.mxn)}`;
  return locale === 'en' ? `${usd} · ${mxn}` : `${mxn} · ${usd}`;
}

/** Human-readable credit clause for services whose fee is credited toward a larger engagement; empty when none applies. */
export function formatCreditClause(service: Service, locale: Locale): string {
  if (!service.credit) return '';
  const target = services.find((item) => item.id === service.credit?.towardServiceId);
  if (!target) return '';
  const days = service.credit.windowDays;
  return locale === 'es'
    ? `Se descuenta de una ${target.name.es} contratada dentro de ${days} días.`
    : `Credited toward a ${target.name.en} booked within ${days} days.`;
}

export function validateQuoteAnswers(answers: Partial<QuoteAnswers>): QuoteValidation {
  const errors: Partial<Record<QuoteField, string>> = {};

  for (const { field, message } of requiredFields) {
    if (!answers[field]?.trim()) errors[field] = message;
  }

  if (answers.serviceId?.trim() && !services.some((service) => service.id === answers.serviceId)) {
    errors.serviceId = 'Choose a valid service.';
  }

  return { valid: Object.keys(errors).length === 0, errors };
}

export function buildQuoteBrief(answers: QuoteAnswers, locale: Locale): string {
  const service = services.find((item) => item.id === answers.serviceId);
  if (!service) throw new Error('A valid service is required to build a quote brief.');

  if (locale === 'es') {
    return `Resumen del proyecto\n\nServicio: ${service.name.es}\nInversión: ${formatPrice(service.price, locale)}\nSituación: ${answers.situation.trim()}\nPlazo: ${answers.timeline.trim()}\nPresupuesto / contexto: ${answers.budgetContext.trim()}`;
  }

  return `Project brief\n\nService: ${service.name.en}\nInvestment: ${formatPrice(service.price, locale)}\nSituation: ${answers.situation.trim()}\nTimeline: ${answers.timeline.trim()}\nBudget / context: ${answers.budgetContext.trim()}`;
}

export function createWhatsAppUrl(message: string): string {
  return `https://wa.me/${contact.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export function createMailtoUrl(subject: string, body: string): string {
  return `mailto:${contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
