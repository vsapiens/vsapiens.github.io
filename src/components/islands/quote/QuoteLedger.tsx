import { services, type Locale } from '@/data/site';
import { budgetModeLabels, formatCreditClause, formatDualPrice, type QuoteAnswers } from '@/lib/quote';
import type { QuoteCopy } from './copy';

interface Row { key: string; label: string; value: string; step?: number; }

export function QuoteLedger({ answers, locale, copy, onEdit, briefChars }: {
  answers: QuoteAnswers; locale: Locale; copy: QuoteCopy; onEdit: (step: number) => void; briefChars: number;
}) {
  const service = services.find((item) => item.id === answers.serviceId);
  const t = copy.ledger;
  const rows: Row[] = [
    { key: 'service', label: t.service, value: service?.name[locale] ?? '', step: 0 },
    { key: 'investment', label: t.investment, value: service ? formatDualPrice(service.price, locale) : '' },
    { key: 'duration', label: t.duration, value: service?.duration[locale] ?? '' },
    ...(service && formatCreditClause(service, locale) ? [{ key: 'credit', label: t.credit, value: formatCreditClause(service, locale) }] : []),
    { key: 'timeline', label: t.timeline, value: answers.timeline, step: 2 },
    { key: 'budget', label: t.budget, value: answers.budgetMode ? budgetModeLabels[locale][answers.budgetMode] : '', step: 2 },
  ];
  return (
    <aside className="quote-ledger" aria-live="polite" aria-label={t.title}>
      <p className="quote-ledger-title">{t.title}</p>
      <dl>
        {rows.map((row) => (
          <div key={row.key} className="quote-ledger-row" data-empty={row.value ? undefined : true}>
            <dt>{row.label}</dt>
            <dd>
              <span>{row.value || t.pending}</span>
              {row.step !== undefined && row.value && <button type="button" onClick={() => onEdit(row.step!)} aria-label={`${t.edit}: ${row.label}`}>{t.edit}</button>}
            </dd>
          </div>
        ))}
      </dl>
      <p className="quote-ledger-file"><span>{t.file}</span><span>{briefChars ? `${briefChars.toLocaleString('en-US')} ${copy.counter}` : t.pending}</span></p>
    </aside>
  );
}
