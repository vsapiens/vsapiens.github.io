import { contact, services, type Locale, type Price, type Service } from '../data/site';

export type BudgetMode = '' | 'fixed' | 'phased' | 'invoice';
export type TimelineKey = '' | 'flexible' | 'weeks' | 'urgent';

export interface QuoteAnswers {
  serviceId: string;
  situation: string;
  /** A locale-independent key; the label comes from timelineLabels. */
  timeline: TimelineKey;
  budgetMode: BudgetMode;
  budgetContext: string;
  name: string;
  company: string;
  role: string;
}

export type QuoteField = keyof QuoteAnswers;
export type ContactLane = 'hiring' | 'consulting';

export interface QuoteValidation {
  valid: boolean;
  errors: Partial<Record<QuoteField, string>>;
}

export const emptyQuoteAnswers: QuoteAnswers = {
  serviceId: '',
  situation: '',
  timeline: '',
  budgetMode: '',
  budgetContext: '',
  name: '',
  company: '',
  role: '',
};

/** Honest defaults: prices are fixed and most first conversations are exploratory, so both fields start filled and cost zero clicks. */
export const defaultQuoteAnswers: QuoteAnswers = { ...emptyQuoteAnswers, timeline: 'flexible', budgetMode: 'fixed' };

/** Per-textarea character cap. Two capped fields plus fixed lines stay inside the mailto limits below even in Spanish. */
export const TEXTAREA_MAX = 600;
/** Outlook truncates hyperlinks near 2,048 characters; keep a margin for the client's own additions. */
export const MAILTO_SAFE_LENGTH = 1900;
/** Encoded `text=` payload length above which WhatsApp Web has been reported to truncate prefilled messages; a soft warning. */
export const WHATSAPP_SOFT_LIMIT = 1000;
export const QUOTE_STORAGE_KEY = 'quote-brief:v1';

const budgetModes: readonly Exclude<BudgetMode, ''>[] = ['fixed', 'phased', 'invoice'];
const timelineKeys: readonly Exclude<TimelineKey, ''>[] = ['flexible', 'weeks', 'urgent'];

export const timelineLabels: Record<Locale, Record<Exclude<TimelineKey, ''>, string>> = {
  en: { flexible: 'Flexible / exploring', weeks: 'Within 2–4 weeks', urgent: 'Urgent / incident-driven' },
  es: { flexible: 'Flexible / explorando', weeks: 'Dentro de 2–4 semanas', urgent: 'Urgente / motivado por incidente' },
};

export const budgetModeLabels: Record<Locale, Record<Exclude<BudgetMode, ''>, string>> = {
  en: { fixed: 'Fixed price works for us', phased: 'We need a phased plan', invoice: 'We need a formal quote with an invoice' },
  es: { fixed: 'El precio fijo nos funciona', phased: 'Necesitamos un plan por fases', invoice: 'Necesitamos cotización formal con factura' },
};

const requiredFields: readonly { field: QuoteField; message: string }[] = [
  { field: 'serviceId', message: 'Choose a service.' },
  { field: 'situation', message: 'Describe the current situation.' },
  { field: 'timeline', message: 'Choose a timeline.' },
  { field: 'budgetMode', message: 'Choose how you want to handle budget.' },
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

export function isServiceId(value: string): boolean {
  return services.some((service) => service.id === value);
}

export function validateQuoteAnswers(answers: Partial<QuoteAnswers>): QuoteValidation {
  const errors: Partial<Record<QuoteField, string>> = {};

  for (const { field, message } of requiredFields) {
    if (!answers[field]?.trim()) errors[field] = message;
  }

  if (answers.serviceId?.trim() && !isServiceId(answers.serviceId)) {
    errors.serviceId = 'Choose a valid service.';
  }

  if (answers.timeline && !timelineKeys.includes(answers.timeline as Exclude<TimelineKey, ''>)) {
    errors.timeline = 'Choose a timeline.';
  }

  if (answers.budgetMode && !budgetModes.includes(answers.budgetMode as Exclude<BudgetMode, ''>)) {
    errors.budgetMode = 'Choose how you want to handle budget.';
  }

  return { valid: Object.keys(errors).length === 0, errors };
}

const briefLabels: Record<Locale, Record<string, string>> = {
  en: { title: 'Project brief', name: 'Name', company: 'Company', role: 'Role', service: 'Service', investment: 'Investment', duration: 'Duration', credit: 'Credit', situation: 'Situation', timeline: 'Timeline', budget: 'Budget', context: 'Context' },
  es: { title: 'Resumen del proyecto', name: 'Nombre', company: 'Empresa', role: 'Rol', service: 'Servicio', investment: 'Inversión', duration: 'Duración', credit: 'Crédito', situation: 'Situación', timeline: 'Plazo', budget: 'Presupuesto', context: 'Contexto' },
};

export function buildQuoteBrief(answers: QuoteAnswers, locale: Locale): string {
  const service = services.find((item) => item.id === answers.serviceId);
  if (!service) throw new Error('A valid service is required to build a quote brief.');
  const labels = briefLabels[locale];
  const budgetMode = answers.budgetMode ? budgetModeLabels[locale][answers.budgetMode] : '';
  const timeline = answers.timeline ? timelineLabels[locale][answers.timeline] : '';
  const credit = formatCreditClause(service, locale);

  const lines: [string, string][] = [
    [labels.name, answers.name.trim()],
    [labels.company, answers.company.trim()],
    [labels.role, answers.role.trim()],
    [labels.service, service.name[locale]],
    [labels.investment, formatDualPrice(service.price, locale)],
    [labels.duration, service.duration[locale]],
    [labels.credit, credit],
    [labels.situation, answers.situation.trim()],
    [labels.timeline, timeline],
    [labels.budget, budgetMode],
    [labels.context, answers.budgetContext.trim()],
  ];

  return `${labels.title}\n\n${lines.filter(([, value]) => value).map(([label, value]) => `${label}: ${value}`).join('\n')}`;
}

export function createWhatsAppUrl(message: string): string {
  return `https://wa.me/${contact.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export function createMailtoUrl(subject: string, body?: string): string {
  const base = `mailto:${contact.email}?subject=${encodeURIComponent(subject)}`;
  return body === undefined ? base : `${base}&body=${encodeURIComponent(body)}`;
}

export interface BriefBudget {
  chars: number;
  mailtoLength: number;
  whatsappLength: number;
  mailtoOverLimit: boolean;
  whatsappOverLimit: boolean;
}

/** Sizes the encoded hand-off URLs so the UI can warn before a mail client silently truncates the brief. */
export function getBriefBudget(brief: string, subject: string): BriefBudget {
  const mailtoLength = createMailtoUrl(subject, brief).length;
  const whatsappLength = createWhatsAppUrl(brief).length;
  return {
    chars: brief.length,
    mailtoLength,
    whatsappLength,
    mailtoOverLimit: mailtoLength > MAILTO_SAFE_LENGTH,
    whatsappOverLimit: encodeURIComponent(brief).length > WHATSAPP_SOFT_LIMIT,
  };
}

export interface HandoffUrls {
  whatsapp: string;
  mailto: string;
  primary: 'whatsapp' | 'copy';
}

/** When the encoded mailto would be truncated by common clients, copy becomes the guaranteed path and email opens with the subject only. */
export function getHandoffUrls(brief: string, subject: string): HandoffUrls {
  const budget = getBriefBudget(brief, subject);
  return {
    whatsapp: createWhatsAppUrl(brief),
    mailto: budget.mailtoOverLimit ? createMailtoUrl(subject) : createMailtoUrl(subject, brief),
    primary: budget.mailtoOverLimit ? 'copy' : 'whatsapp',
  };
}

const storageVersion = 1;

export function serializeQuoteAnswers(answers: QuoteAnswers): string {
  return JSON.stringify({ version: storageVersion, answers });
}

function clampText(value: unknown): string {
  return typeof value === 'string' ? value.slice(0, TEXTAREA_MAX) : '';
}

/** Restores answers saved by serializeQuoteAnswers; unknown versions, malformed JSON, and unknown values are dropped. */
export function parseQuoteAnswers(raw: string | null): QuoteAnswers | null {
  if (!raw) return null;
  let payload: unknown;
  try { payload = JSON.parse(raw); } catch { return null; }
  if (!payload || typeof payload !== 'object') return null;
  const { version, answers } = payload as { version?: unknown; answers?: unknown };
  if (version !== storageVersion || !answers || typeof answers !== 'object') return null;
  const source = answers as Record<string, unknown>;
  const serviceId = typeof source.serviceId === 'string' && isServiceId(source.serviceId) ? source.serviceId : '';
  const budgetMode = budgetModes.find((mode) => mode === source.budgetMode) ?? defaultQuoteAnswers.budgetMode;
  const timeline = timelineKeys.find((key) => key === source.timeline) ?? defaultQuoteAnswers.timeline;
  return {
    serviceId,
    situation: clampText(source.situation),
    timeline,
    budgetMode,
    budgetContext: clampText(source.budgetContext),
    name: clampText(source.name),
    company: clampText(source.company),
    role: clampText(source.role),
  };
}

export function getRequestedService(search: string): string {
  const requested = new URLSearchParams(search).get('service') ?? '';
  return isServiceId(requested) ? requested : '';
}

/** `#quote` or `?service=` always mean consulting; `?lane=hiring` or `#hiring` select the recruiter lane; default consulting. */
export function resolveInitialLane(search: string, hash: string): ContactLane {
  if (hash === '#quote' || getRequestedService(search)) return 'consulting';
  if (hash === '#hiring' || new URLSearchParams(search).get('lane') === 'hiring') return 'hiring';
  return 'consulting';
}
