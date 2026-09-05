import { useState } from 'react';
import { services, type Locale } from '@/data/site';
import {
  TEXTAREA_MAX,
  budgetModeLabels,
  getBriefBudget,
  getHandoffUrls,
  timelineLabels,
  type BudgetMode,
  type QuoteAnswers,
  type TimelineKey,
} from '@/lib/quote';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CopyTextButton } from '@/components/islands/CopyTextButton';
import type { QuoteCopy } from './copy';

type Setter = <F extends keyof QuoteAnswers>(field: F, value: QuoteAnswers[F]) => void;

/** Step 2: defaults already filled, the brief updates live, and the hand-off is one click away. */
export function SendStep({ answers, locale, copy, brief, setAnswer, onChangeService, headingRef }: {
  answers: QuoteAnswers; locale: Locale; copy: QuoteCopy; brief: string; setAnswer: Setter; onChangeService: () => void; headingRef: React.RefObject<HTMLHeadingElement | null>;
}) {
  const [identityOpen, setIdentityOpen] = useState(Boolean(answers.name || answers.company || answers.role));
  const service = services.find((item) => item.id === answers.serviceId);
  const urls = getHandoffUrls(brief, copy.subject);
  const budget = getBriefBudget(brief, copy.subject);
  const timelineKeys = Object.keys(timelineLabels[locale]) as Exclude<TimelineKey, ''>[];
  const budgetKeys = Object.keys(budgetModeLabels[locale]) as Exclude<BudgetMode, ''>[];
  const copyButton = <CopyTextButton key="copy" text={brief} label={copy.copy} copiedLabel={copy.copied} failedLabel={copy.copyFailed} variant="ghost" size="lg" className={urls.primary === 'copy' ? 'button-ink' : 'link-underline'} />;
  const whatsapp = <a key="whatsapp" className={urls.primary === 'whatsapp' ? 'button-ink' : 'link-underline'} href={urls.whatsapp} target="_blank" rel="noopener noreferrer">{copy.whatsapp} <span aria-hidden="true">→</span></a>;
  const email = <a key="email" className="link-underline" href={urls.mailto}>{copy.email}</a>;

  return (
    <div className="quote-send">
      <div className="quote-send-form">
        <p className="quote-kicker">{copy.sendKicker}</p>
        <h3 ref={headingRef} tabIndex={-1} className="quote-send-title">{copy.sendTitle}</h3>
        <p className="quote-send-intro">{copy.sendIntro}</p>

        <div className="quote-row">
          <span className="quote-row-label">{copy.serviceLabel}</span>
          <span className="quote-row-value">{service?.name[locale]}</span>
          <button type="button" className="link-underline" onClick={onChangeService}>{copy.changeService}</button>
        </div>

        <RadioGroup value={answers.timeline} onValueChange={(value) => setAnswer('timeline', value as TimelineKey)} label={copy.timeline} className="quote-row quote-choice-row">
          <span className="quote-row-label" aria-hidden="true">{copy.timeline}</span>
          {timelineKeys.map((key) => <RadioGroupItem key={key} name="quote-timeline" value={key} checked={answers.timeline === key}>{timelineLabels[locale][key]}</RadioGroupItem>)}
        </RadioGroup>

        <RadioGroup value={answers.budgetMode} onValueChange={(value) => setAnswer('budgetMode', value as BudgetMode)} label={copy.budget} className="quote-row quote-choice-row">
          <span className="quote-row-label" aria-hidden="true">{copy.budget}</span>
          {budgetKeys.map((key) => <RadioGroupItem key={key} name="quote-budget-mode" value={key} checked={answers.budgetMode === key}>{budgetModeLabels[locale][key]}</RadioGroupItem>)}
        </RadioGroup>

        {answers.budgetMode !== 'fixed' && (
          <div className="quote-field">
            <label htmlFor="quote-budget">{copy.context}</label>
            <textarea id="quote-budget" rows={3} maxLength={TEXTAREA_MAX} value={answers.budgetContext} onChange={(event) => setAnswer('budgetContext', event.target.value)} />
            <span className="quote-counter">{answers.budgetContext.length.toLocaleString('en-US')} / {TEXTAREA_MAX} {copy.counter}</span>
          </div>
        )}

        <div className="quote-identity">
          <button type="button" className="link-underline" aria-expanded={identityOpen} aria-controls="quote-identity-fields" onClick={() => setIdentityOpen((open) => !open)}>{copy.identityToggle} {identityOpen ? '−' : '+'}</button>
          {identityOpen && (
            <div id="quote-identity-fields" className="quote-identity-grid">
              <p className="quote-hint">{copy.identityHint}</p>
              {(['name', 'company', 'role'] as const).map((field) => (
                <div key={field} className="quote-field"><label htmlFor={`quote-${field}`}>{copy[field]}</label><input id={`quote-${field}`} type="text" maxLength={120} autoComplete={field === 'name' ? 'name' : field === 'company' ? 'organization' : 'organization-title'} value={answers[field]} onChange={(event) => setAnswer(field, event.target.value)} /></div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="quote-brief">
        <p className="quote-brief-label"><span>{copy.briefLabel}</span><span>{budget.chars.toLocaleString('en-US')} {copy.counter} · mailto {budget.mailtoLength.toLocaleString('en-US')} · wa.me {budget.whatsappLength.toLocaleString('en-US')}</span></p>
        <pre tabIndex={0}>{brief}</pre>
        {budget.mailtoOverLimit && <p className="quote-notice" role="alert">{copy.overLimit}</p>}
        {!budget.mailtoOverLimit && budget.whatsappOverLimit && <p className="quote-notice">{copy.whatsappLong}</p>}
        <div className="quote-actions">{urls.primary === 'copy' ? [copyButton, whatsapp, email] : [whatsapp, email, copyButton]}</div>
        <p className="quote-privacy">{copy.desktop} {copy.privacy}</p>
      </div>
    </div>
  );
}
