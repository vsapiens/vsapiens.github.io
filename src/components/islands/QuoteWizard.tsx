import { useEffect, useMemo, useRef, useState } from 'react';
import { services, type Locale } from '@/data/site';
import {
  buildQuoteBrief,
  createMailtoUrl,
  createWhatsAppUrl,
  formatPrice,
  validateQuoteAnswers,
  type QuoteAnswers,
  type QuoteField,
} from '@/lib/quote';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const emptyAnswers: QuoteAnswers = {
  serviceId: '',
  situation: '',
  timeline: '',
  budgetContext: '',
};

const copy = {
  en: {
    eyebrow: 'PROJECT STARTER',
    title: 'Turn the constraint into a useful brief.',
    intro: 'Four short steps. Your answers stay in this browser until you choose WhatsApp, email, or copy.',
    step: 'Step', of: 'of', result: 'Brief ready',
    service: 'What kind of help do you need?',
    situation: 'What is happening today?', situationHint: 'Share the symptom, decision, role, or product boundary. Leave out credentials and customer data.',
    timeline: 'What timing are you working with?',
    budget: 'What should I know about budget or context?', budgetHint: 'Include a range, constraints, team shape, or what has already been tried.',
    timelines: ['Flexible / exploring', 'Within 2–4 weeks', 'Urgent / incident-driven'],
    back: 'Back', next: 'Continue', create: 'Create brief', edit: 'Edit answers', copy: 'Copy brief', copied: 'Brief copied.', copyFailed: 'Copy was unavailable. Select the brief and copy it manually.',
    whatsapp: 'Send by WhatsApp', email: 'Send by email', privacy: 'Nothing is sent automatically. Opening WhatsApp or email transfers this brief only after you confirm there.',
    errors: { serviceId: 'Choose one service.', situation: 'Describe the current situation.', timeline: 'Choose a timeline.', budgetContext: 'Add budget or project context.' },
    subject: 'Project brief for Erick González',
  },
  es: {
    eyebrow: 'INICIO DE PROYECTO',
    title: 'Convierte la restricción en un resumen útil.',
    intro: 'Cuatro pasos breves. Tus respuestas permanecen en este navegador hasta que elijas WhatsApp, correo o copiar.',
    step: 'Paso', of: 'de', result: 'Resumen listo',
    service: '¿Qué tipo de ayuda necesitas?',
    situation: '¿Qué está ocurriendo hoy?', situationHint: 'Comparte el síntoma, la decisión, el rol o el límite del producto. No incluyas credenciales ni datos de clientes.',
    timeline: '¿Con qué plazo estás trabajando?',
    budget: '¿Qué debo saber del presupuesto o contexto?', budgetHint: 'Incluye un rango, restricciones, forma del equipo o lo que ya intentaron.',
    timelines: ['Flexible / explorando', 'Dentro de 2–4 semanas', 'Urgente / motivado por incidente'],
    back: 'Atrás', next: 'Continuar', create: 'Crear resumen', edit: 'Editar respuestas', copy: 'Copiar resumen', copied: 'Resumen copiado.', copyFailed: 'No fue posible copiar. Selecciona el resumen y cópialo manualmente.',
    whatsapp: 'Enviar por WhatsApp', email: 'Enviar por correo', privacy: 'Nada se envía automáticamente. WhatsApp o correo reciben este resumen sólo cuando confirmas el envío allí.',
    errors: { serviceId: 'Elige un servicio.', situation: 'Describe la situación actual.', timeline: 'Elige un plazo.', budgetContext: 'Agrega presupuesto o contexto del proyecto.' },
    subject: 'Resumen de proyecto para Erick González',
  },
} as const;

const stepFields: QuoteField[] = ['serviceId', 'situation', 'timeline', 'budgetContext'];

export function QuoteWizard({ locale }: { locale: Locale }) {
  const [answers, setAnswers] = useState<QuoteAnswers>(emptyAnswers);
  const [step, setStep] = useState(0);
  const [fieldError, setFieldError] = useState<QuoteField | null>(null);
  const [copyStatus, setCopyStatus] = useState('');
  const serviceRef = useRef<HTMLInputElement>(null);
  const situationRef = useRef<HTMLTextAreaElement>(null);
  const timelineRef = useRef<HTMLInputElement>(null);
  const budgetRef = useRef<HTMLTextAreaElement>(null);
  const t = copy[locale];

  useEffect(() => {
    const requestedService = new URLSearchParams(window.location.search).get('service') ?? '';
    if (services.some((service) => service.id === requestedService)) {
      setAnswers((current) => ({ ...current, serviceId: requestedService }));
    }
  }, []);

  const brief = useMemo(() => {
    if (step !== 4 || !validateQuoteAnswers(answers).valid) return '';
    return buildQuoteBrief(answers, locale);
  }, [answers, locale, step]);

  const setAnswer = (field: QuoteField, value: string) => {
    setAnswers((current) => ({ ...current, [field]: value }));
    if (fieldError === field) setFieldError(null);
  };

  const focusField = (field: QuoteField) => {
    const refs = { serviceId: serviceRef, situation: situationRef, timeline: timelineRef, budgetContext: budgetRef };
    refs[field].current?.focus();
  };

  const continueFlow = () => {
    const field = stepFields[step];
    const value = answers[field]?.trim();
    const invalidService = field === 'serviceId' && !services.some((service) => service.id === value);
    if (!value || invalidService) {
      setFieldError(field);
      requestAnimationFrame(() => focusField(field));
      return;
    }

    if (step === 3) {
      const validation = validateQuoteAnswers(answers);
      if (!validation.valid) {
        const firstInvalid = stepFields.find((candidate) => validation.errors[candidate]);
        if (firstInvalid) {
          setFieldError(firstInvalid);
          setStep(stepFields.indexOf(firstInvalid));
          requestAnimationFrame(() => focusField(firstInvalid));
        }
        return;
      }
      setStep(4);
      return;
    }

    setStep((current) => current + 1);
  };

  const copyBrief = async () => {
    try {
      await navigator.clipboard.writeText(brief);
      setCopyStatus(t.copied);
    } catch {
      setCopyStatus(t.copyFailed);
    }
  };

  const errorId = fieldError ? `quote-${fieldError}-error` : undefined;

  return (
    <section className="quote-wizard" id="quote" aria-labelledby="quote-title">
      <div className="quote-heading">
        <p>{t.eyebrow}</p>
        <h2 id="quote-title">{t.title}</h2>
        <span>{t.intro}</span>
      </div>

      <div className="quote-panel">
        <div className="quote-progress-copy">
          <span>{step < 4 ? `${t.step} ${step + 1} ${t.of} 4` : t.result}</span>
          <strong>{step < 4 ? `${(step + 1) * 25}%` : '100%'}</strong>
        </div>
        <Progress value={step < 4 ? (step + 1) * 25 : 100} label={step < 4 ? `${t.step} ${step + 1} ${t.of} 4` : t.result} />

        {step === 0 && (
          <div className="quote-step">
            <h3>{t.service}</h3>
            <RadioGroup value={answers.serviceId} onValueChange={(value) => setAnswer('serviceId', value)} label={t.service} className="quote-service-options" describedBy={fieldError === 'serviceId' ? errorId : undefined} invalid={fieldError === 'serviceId'}>
              {services.map((service, index) => (
                <RadioGroupItem key={service.id} name="quote-service" value={service.id} checked={answers.serviceId === service.id} inputRef={index === 0 ? serviceRef : undefined}>
                  <span className="quote-option-index">0{index + 1}</span>
                  <span><strong>{service.name[locale]}</strong><small>{service.description[locale]}</small></span>
                  <b>{formatPrice(service.price, locale)}</b>
                </RadioGroupItem>
              ))}
            </RadioGroup>
            {fieldError === 'serviceId' && <p className="quote-error" id={errorId} role="alert">{t.errors.serviceId}</p>}
          </div>
        )}

        {step === 1 && (
          <div className="quote-step">
            <label htmlFor="quote-situation"><strong>{t.situation}</strong><span>{t.situationHint}</span></label>
            <textarea ref={situationRef} id="quote-situation" rows={6} value={answers.situation} onChange={(event) => setAnswer('situation', event.target.value)} aria-invalid={fieldError === 'situation'} aria-describedby={fieldError === 'situation' ? errorId : undefined} />
            {fieldError === 'situation' && <p className="quote-error" id={errorId} role="alert">{t.errors.situation}</p>}
          </div>
        )}

        {step === 2 && (
          <div className="quote-step">
            <h3>{t.timeline}</h3>
            <RadioGroup value={answers.timeline} onValueChange={(value) => setAnswer('timeline', value)} label={t.timeline} className="quote-timeline-options" describedBy={fieldError === 'timeline' ? errorId : undefined} invalid={fieldError === 'timeline'}>
              {t.timelines.map((timeline, index) => <RadioGroupItem key={timeline} name="quote-timeline" value={timeline} checked={answers.timeline === timeline} inputRef={index === 0 ? timelineRef : undefined}><span className="quote-option-index">0{index + 1}</span><strong>{timeline}</strong></RadioGroupItem>)}
            </RadioGroup>
            {fieldError === 'timeline' && <p className="quote-error" id={errorId} role="alert">{t.errors.timeline}</p>}
          </div>
        )}

        {step === 3 && (
          <div className="quote-step">
            <label htmlFor="quote-budget"><strong>{t.budget}</strong><span>{t.budgetHint}</span></label>
            <textarea ref={budgetRef} id="quote-budget" rows={6} value={answers.budgetContext} onChange={(event) => setAnswer('budgetContext', event.target.value)} aria-invalid={fieldError === 'budgetContext'} aria-describedby={fieldError === 'budgetContext' ? errorId : undefined} />
            {fieldError === 'budgetContext' && <p className="quote-error" id={errorId} role="alert">{t.errors.budgetContext}</p>}
          </div>
        )}

        {step === 4 && brief && (
          <div className="quote-result">
            <pre tabIndex={0}>{brief}</pre>
            <p className="quote-privacy">{t.privacy}</p>
            <div className="quote-result-actions">
              <a className="button-link button-signal" href={createWhatsAppUrl(brief)} target="_blank" rel="noopener noreferrer">{t.whatsapp}<span aria-hidden="true">↗</span></a>
              <a className="button-link button-secondary" href={createMailtoUrl(t.subject, brief)}>{t.email}</a>
              <Button variant="ghost" size="lg" onClick={copyBrief}>{t.copy}</Button>
            </div>
            <p className="quote-copy-status" role="status" aria-live="polite">{copyStatus}</p>
          </div>
        )}

        {step < 4 && (
          <div className="quote-navigation">
            <Button variant="ghost" size="lg" onClick={() => { setFieldError(null); setStep((current) => Math.max(0, current - 1)); }} disabled={step === 0}>{t.back}</Button>
            <Button variant="primary" size="lg" onClick={continueFlow}>{step === 3 ? t.create : t.next}</Button>
          </div>
        )}
        {step === 4 && <Button variant="ghost" size="lg" className="quote-edit" onClick={() => { setCopyStatus(''); setStep(0); }}>{t.edit}</Button>}
      </div>
    </section>
  );
}
