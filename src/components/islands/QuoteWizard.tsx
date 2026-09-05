import { useEffect, useMemo, useRef, useState } from 'react';
import { type Locale } from '@/data/site';
import {
  QUOTE_STORAGE_KEY,
  TEXTAREA_MAX,
  buildQuoteBrief,
  defaultQuoteAnswers,
  getRequestedService,
  isServiceId,
  parseQuoteAnswers,
  serializeQuoteAnswers,
  validateQuoteAnswers,
  type QuoteAnswers,
  type QuoteField,
} from '@/lib/quote';
import { quoteCopy } from './quote/copy';
import { ServiceBand } from './quote/ServiceBand';
import { SendStep } from './quote/SendStep';
import { TrustStrip } from './quote/TrustStrip';

const SEND = 1;
/** Step 1 owns the only required inputs; step 2 starts from defaults. */
const stepFields: readonly QuoteField[][] = [['serviceId', 'situation'], []];

function readStorage(): string | null {
  try { return window.sessionStorage.getItem(QUOTE_STORAGE_KEY); } catch { return null; }
}
function writeStorage(value: string | null) {
  try { value === null ? window.sessionStorage.removeItem(QUOTE_STORAGE_KEY) : window.sessionStorage.setItem(QUOTE_STORAGE_KEY, value); } catch { /* storage unavailable */ }
}

export function QuoteWizard({ locale }: { locale: Locale }) {
  const t = quoteCopy[locale];
  const [answers, setAnswers] = useState<QuoteAnswers>(defaultQuoteAnswers);
  const [step, setStep] = useState(0);
  const [fieldError, setFieldError] = useState<QuoteField | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const serviceRef = useRef<HTMLInputElement>(null);
  const situationRef = useRef<HTMLTextAreaElement>(null);
  const focusHeadingOnStep = useRef(false);

  useEffect(() => {
    const restored = parseQuoteAnswers(readStorage()) ?? defaultQuoteAnswers;
    const requested = getRequestedService(window.location.search);
    setAnswers(requested ? { ...restored, serviceId: requested } : restored);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    writeStorage(answers === defaultQuoteAnswers ? null : serializeQuoteAnswers(answers));
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
  const stepOneValid = !stepFields[0].some((field) => validation.errors[field]);
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

  const continueFlow = () => {
    const invalidField = stepFields[0].find((field) => validation.errors[field] || (field === 'serviceId' && !isServiceId(answers.serviceId)));
    if (invalidField) {
      setFieldError(invalidField);
      requestAnimationFrame(() => (invalidField === 'serviceId' ? serviceRef : situationRef).current?.focus());
      return;
    }
    goToStep(SEND);
  };

  const startOver = () => {
    writeStorage(null);
    setAnswers(defaultQuoteAnswers);
    goToStep(0);
  };

  const errorId = fieldError ? `quote-${fieldError}-error` : undefined;

  return (
    <div className="quote-wizard" aria-labelledby="quote-title" data-step={step}>
      <header className="quote-masthead">
        <p className="quote-kicker">{t.kicker}</p>
        <h2 id="quote-title" className="quote-display">{t.display}</h2>
        <div className="quote-masthead-row">
          <p className="quote-intro">{t.intro}</p>
          <ol className="quote-steps" aria-label={t.stepsLabel}>
            {t.steps.map((label, index) => (
              <li key={label}>
                <button type="button" aria-current={index === step ? 'step' : undefined} disabled={index === SEND && !stepOneValid} onClick={() => (index === SEND ? continueFlow() : goToStep(0))}>
                  <span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span> {label}
                </button>
              </li>
            ))}
          </ol>
        </div>
      </header>

      {step === 0 && (
        <div className="quote-step-one">
          <h3 ref={headingRef} tabIndex={-1} className="sr-only">{t.steps[0]}</h3>
          <ServiceBand locale={locale} value={answers.serviceId} onChange={(value) => setAnswer('serviceId', value)} invalid={fieldError === 'serviceId'} describedBy={fieldError === 'serviceId' ? errorId : undefined} firstRef={serviceRef} copy={t} />
          {fieldError === 'serviceId' && <p className="quote-error" id={errorId} role="alert">{t.errors.serviceId}</p>}

          <div className="quote-situation">
            <div className="quote-field quote-field-large">
              <label htmlFor="quote-situation">{t.situation}</label>
              <p className="quote-hint" id="quote-situation-hint">{t.situationHint}</p>
              <textarea ref={situationRef} id="quote-situation" rows={4} maxLength={TEXTAREA_MAX} value={answers.situation} onChange={(event) => setAnswer('situation', event.target.value)} aria-invalid={fieldError === 'situation'} aria-describedby={['quote-situation-hint', fieldError === 'situation' ? errorId : ''].filter(Boolean).join(' ')} />
              <span className="quote-counter">{answers.situation.length.toLocaleString('en-US')} / {TEXTAREA_MAX} {t.counter}</span>
              {fieldError === 'situation' && <p className="quote-error" id={errorId} role="alert">{t.errors.situation}</p>}
            </div>
            <div className="quote-actions">
              <button type="button" className="button-ink" onClick={continueFlow}>{t.continue} <span aria-hidden="true">→</span></button>
            </div>
          </div>
        </div>
      )}

      {step === SEND && <SendStep answers={answers} locale={locale} copy={t} brief={brief} setAnswer={setAnswer} onChangeService={() => goToStep(0)} headingRef={headingRef} />}

      <TrustStrip copy={t} />
      <p className="quote-footnote">
        <span>{t.storage}</span>
        <button type="button" className="link-underline" onClick={startOver}>{t.startOver}</button>
      </p>
    </div>
  );
}
