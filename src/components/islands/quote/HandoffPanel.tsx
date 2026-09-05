import { getBriefBudget, getHandoffUrls } from '@/lib/quote';
import { CopyTextButton } from '@/components/islands/CopyTextButton';
import type { QuoteCopy } from './copy';

export function HandoffPanel({ brief, copy }: { brief: string; copy: QuoteCopy }) {
  const t = copy.handoff;
  const urls = getHandoffUrls(brief, t.subject);
  const budget = getBriefBudget(brief, t.subject);
  const copyButton = <CopyTextButton key="copy" text={brief} label={t.copy} copiedLabel={t.copied} failedLabel={t.copyFailed} variant={urls.primary === 'copy' ? 'signal' : 'ghost'} size="lg" />;
  const whatsapp = <a key="whatsapp" className={`button-link ${urls.primary === 'whatsapp' ? 'button-signal' : 'button-secondary'}`} href={urls.whatsapp} target="_blank" rel="noopener noreferrer">{t.whatsapp}<span aria-hidden="true">↗</span></a>;
  const email = <a key="email" className="button-link button-secondary" href={urls.mailto}>{t.email}</a>;
  return (
    <div className="quote-handoff">
      <pre tabIndex={0}>{brief}</pre>
      <p className="quote-budget-line"><span>{copy.ledger.file}</span><span>{budget.chars.toLocaleString('en-US')} chars · mailto {budget.mailtoLength.toLocaleString('en-US')} · wa.me {budget.whatsappLength.toLocaleString('en-US')}</span></p>
      {budget.mailtoOverLimit && <p className="quote-notice" role="alert">{t.overLimit}</p>}
      {!budget.mailtoOverLimit && budget.whatsappOverLimit && <p className="quote-notice">{t.whatsappLong}</p>}
      <div className="quote-handoff-actions">{urls.primary === 'copy' ? [copyButton, whatsapp, email] : [whatsapp, email, copyButton]}</div>
      <p className="quote-privacy">{t.desktop} {t.privacy}</p>
    </div>
  );
}
