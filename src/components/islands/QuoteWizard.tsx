import { useEffect, useMemo, useRef, useState } from 'react';
import { type Locale } from '@/data/site';
import {
  QUOTE_STORAGE_KEY,
  TEXTAREA_MAX,
  budgetModeLabels,
  buildQuoteBrief,
  emptyQuoteAnswers,
  getRequestedService,
  isServiceId,
  parseQuoteAnswers,
  serializeQuoteAnswers,
  timelineLabels,
  validateQuoteAnswers,
  type BudgetMode,
  type TimelineKey,
  type QuoteAnswers,
  type QuoteField,
} from '@/lib/quote';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Stepper } from '@/components/ui/stepper';
import { quoteCopy } from './quote/copy';
import { ServiceCards } from './quote/ServiceCards';
import { QuoteLedger } from './quote/QuoteLedger';
import { HandoffPanel } from './quote/HandoffPanel';

/** Fields validated by each step, in order. Step 3 (review) has no required fields of its own. */
const stepFields: readonly QuoteField[][] = [['serviceId'], ['situation'], ['timeline', 'budgetMode'], []];
const REVIEW = 3;

function readStorage(): string | null {
  try { return window.sessionStorage.getItem(QUOTE_STORAGE_KEY); } catch { return null; }
}
function writeStorage(value: string | null) {
  try { value === null ? window.sessionStorage.removeItem(QUOTE_STORAGE_KEY) : window.sessionStorage.setItem(QUOTE_STORAGE_KEY, value); } catch { /* storage unavailable */ }
}

/** Highest step whose prerequisites are all valid, so restored or pre-filled answers unlock the stepper honestly. */
function furthestValidStep(answers: QuoteAnswers): number {
  const { errors } = validateQuoteAnswers(answers);
  for (let step = 0; step < REVIEW; step += 1) {
    if (stepFields[step].some((field) => errors[field])) return step;
  }
  return REVIEW;
}

export function QuoteWizard({ locale }: { locale: Locale }) {
  const t = quoteCopy[locale];
  const [answers, setAnswers] = useState<QuoteAnswers>(emptyQuoteAnswers);
  const [step, setStep] = useState(0);
  const [maxReached, setMaxReached] = useState(0);
  const [fieldError, setFieldError] = useState<QuoteField | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const serviceRef = useRef<HTMLInputElement>(null);
  const situationRef = useRef<HTMLTextAreaElement>(null);
  const timelineRef = useRef<HTMLInputElement>(null);
  const budgetRef = useRef<HTMLInputElement>(null);
  const focusHeadingOnStep = useRef(false);

  useEffect(() => {
    const restored = parseQuoteAnswers(readStorage()) ?? emptyQuoteAnswers;
    const requested = getRequestedService(window.location.search);
    const initial = requested ? { ...restored, serviceId: requested } : restored;
    const reached = furthestValidStep(initial);
    setAnswers(initial);
    setMaxReached(reached);
    if (requested) setStep(Math.min(1, reached));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    writeStorage(answers === emptyQuoteAnswers ? null : serializeQuoteAnswers(answers));
  }, [answers, hydrated]);

  useEffect(() => {
    if (!focusHeadingOnStep.current) return;
    focusHeadingOnStep.current = false;
    headingRef.current?.focus({ preventScroll: true });
    const section = document.getElementById('quote');
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (section && section.getBoundingClientRect().top < 0) section.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
  }, [step]);

  const validation = useMemo(() => validateQuoteAnswers(answers), [answers]);
  const brief = useMemo(() => (validation.valid ? buildQuoteBrief(answers, locale) : ''), [answers, locale, validation.valid]);

  const setAnswer = <F extends QuoteField>(field: F, value: QuoteAnswers[F]) => {
    setAnswers((current) => ({ ...current, [field]: value }));
    if (fieldError === field) setFieldError(null);
  };

  const goToStep = (next: number) => {
    setFieldError(null);
    focusHeadingOnStep.current = true;
    setStep(next);
  };

  const focusField = (field: QuoteField) => {
    const refs: Partial<Record<QuoteField, React.RefObject<HTMLElement | null>>> = { serviceId: serviceRef, situation: situationRef, timeline: timelineRef, budgetMode: budgetRef };
    refs[field]?.current?.focus();
  };

  const continueFlow = () => {
    const invalidField = stepFields[step].find((field) => validation.errors[field] || (field === 'serviceId' && !isServiceId(answers.serviceId)));
    if (invalidField) {
      setFieldError(invalidField);
      requestAnimationFrame(() => focusField(invalidField));
      return;
    }
    setMaxReached((current) => Math.max(current, step + 1));
    goToStep(step + 1);
  };

  const startOver = () => {
    writeStorage(null);
    setAnswers(emptyQuoteAnswers);
    setMaxReached(0);
    goToStep(0);
  };

  const errorId = fieldError ? `quote-${fieldError}-error` : undefined;
  const firstMissing = stepFields.findIndex((fields) => fields.some((field) => validation.errors[field]));
  const counter = (value: string) => <span className="quote-counter" aria-live="polite">{value.length.toLocaleString('en-US')} / {TEXTAREA_MAX} {t.counter}</span>;

  return (
    <div className="quote-wizard" aria-labelledby="quote-title" data-step={step}>
      <header className="quote-masthead">
        <p className="quote-eyebrow">{t.eyebrow}</p>
        <h2 id="quote-title">{t.title}</h2>
        <p className="quote-intro">{t.intro}</p>
      </header>

      <div className="quote-layout">
        <Stepper steps={t.steps.map((label) => ({ label }))} current={step} maxReached={maxReached} onSelect={goToStep} label={t.stepsLabel} doneLabel={t.done} />

        <div className="quote-panel">
          <p className="quote-panel-marker" aria-hidden="true">{String(step + 1).padStart(2, '0')} / {String(t.steps.length).padStart(2, '0')}</p>

          {step === 0 && (
            <div className="quote-step">
              <h3 ref={headingRef} tabIndex={-1}>{t.service}</h3>
              <p className="quote-hint">{t.serviceHint}</p>
              <ServiceCards locale={locale} value={answers.serviceId} onChange={(value) => setAnswer('serviceId', value)} label={t.service} invalid={fieldError === 'serviceId'} describedBy={fieldError === 'serviceId' ? errorId : undefined} firstRef={serviceRef} copy={t} />
              {fieldError === 'serviceId' && <p className="quote-error" id={errorId} role="alert">{t.errors.serviceId}</p>}
            </div>
          )}

          {step === 1 && (
            <div className="quote-step">
              <h3 ref={headingRef} tabIndex={-1}><label htmlFor="quote-situation">{t.situation}</label></h3>
              <p className="quote-hint" id="quote-situation-hint">{t.situationHint}</p>
              <textarea ref={situationRef} id="quote-situation" rows={7} maxLength={TEXTAREA_MAX} value={answers.situation} onChange={(event) => setAnswer('situation', event.target.value)} aria-invalid={fieldError === 'situation'} aria-describedby={['quote-situation-hint', fieldError === 'situation' ? errorId : ''].filter(Boolean).join(' ')} />
              {counter(answers.situation)}
              {fieldError === 'situation' && <p className="quote-error" id={errorId} role="alert">{t.errors.situation}</p>}
            </div>
          )}

          {step === 2 && (
            <div className="quote-step">
              <h3 ref={headingRef} tabIndex={-1}>{t.timeline}</h3>
              <RadioGroup value={answers.timeline} onValueChange={(value) => setAnswer('timeline', value as TimelineKey)} label={t.timeline} className="quote-timeline-options" describedBy={fieldError === 'timeline' ? errorId : undefined} invalid={fieldError === 'timeline'}>
                {(Object.keys(timelineLabels[locale]) as Exclude<TimelineKey, ''>[]).map((key, index) => <RadioGroupItem key={key} name="quote-timeline" value={key} checked={answers.timeline === key} inputRef={index === 0 ? timelineRef : undefined}><span className="quote-option-index" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span><strong>{timelineLabels[locale][key]}</strong></RadioGroupItem>)}
              </RadioGroup>
              {fieldError === 'timeline' && <p className="quote-error" id={errorId} role="alert">{t.errors.timeline}</p>}

              <h3 className="quote-subhead">{t.budget}</h3>
              <p className="quote-hint">{t.budgetHint}</p>
              <RadioGroup value={answers.budgetMode} onValueChange={(value) => setAnswer('budgetMode', value as BudgetMode)} label={t.budget} className="quote-timeline-options" describedBy={fieldError === 'budgetMode' ? errorId : undefined} invalid={fieldError === 'budgetMode'}>
                {(Object.keys(budgetModeLabels[locale]) as Exclude<BudgetMode, ''>[]).map((mode, index) => <RadioGroupItem key={mode} name="quote-budget-mode" value={mode} checked={answers.budgetMode === mode} inputRef={index === 0 ? budgetRef : undefined}><span className="quote-option-index" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span><strong>{budgetModeLabels[locale][mode]}</strong></RadioGroupItem>)}
              </RadioGroup>
              {fieldError === 'budgetMode' && <p className="quote-error" id={errorId} role="alert">{t.errors.budgetMode}</p>}

              <label className="quote-optional" htmlFor="quote-budget">{t.budgetContext}</label>
              <textarea id="quote-budget" rows={4} maxLength={TEXTAREA_MAX} value={answers.budgetContext} onChange={(event) => setAnswer('budgetContext', event.target.value)} />
              {counter(answers.budgetContext)}
            </div>
          )}

          {step === REVIEW && (
            <div className="quote-step quote-review">
              <h3 ref={headingRef} tabIndex={-1}>{t.review}</h3>
              <fieldset className="quote-identity">
                <legend>{t.identity}</legend>
                <p className="quote-hint">{t.identityHint}</p>
                <div className="quote-identity-grid">
                  {(['name', 'company', 'role'] as const).map((field) => (
                    <label key={field}><span>{t[field]}</span><input id={`quote-${field}`} type="text" maxLength={120} autoComplete={field === 'name' ? 'name' : field === 'company' ? 'organization' : 'organization-title'} value={answers[field]} onChange={(event) => setAnswer(field, event.target.value)} /></label>
                  ))}
                </div>
              </fieldset>
              {brief ? (
                <HandoffPanel brief={brief} copy={t} />
              ) : (
                <div className="quote-missing" role="alert">
                  <p>{t.missing}</p>
                  <Button variant="secondary" size="lg" onClick={() => goToStep(Math.max(0, firstMissing))}>{t.fix}</Button>
                </div>
              )}
            </div>
          )}

          <div className="quote-navigation">
            <Button variant="ghost" size="lg" onClick={() => goToStep(Math.max(0, step - 1))} disabled={step === 0}>{t.back}</Button>
            {step < REVIEW
              ? <Button variant="primary" size="lg" onClick={continueFlow}>{t.next[step]}</Button>
              : <Button variant="ghost" size="lg" onClick={startOver}>{t.startOver}</Button>}
          </div>
          <p className="quote-storage-note">{t.storage}</p>
        </div>

        <QuoteLedger answers={answers} locale={locale} copy={t} onEdit={goToStep} briefChars={brief.length} />
      </div>
    </div>
  );
}
