import type { Ref } from 'react';
import { services, type Locale } from '@/data/site';
import { serviceDetails } from '@/data/content';
import { formatCreditClause, formatPrice } from '@/lib/quote';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import type { QuoteCopy } from './copy';

export function ServiceCards({ locale, value, onChange, label, invalid, describedBy, firstRef, copy }: {
  locale: Locale; value: string; onChange: (value: string) => void; label: string; invalid: boolean; describedBy?: string; firstRef: Ref<HTMLInputElement>; copy: QuoteCopy;
}) {
  const secondary: Locale = locale === 'en' ? 'es' : 'en';
  return (
    <RadioGroup value={value} onValueChange={onChange} label={label} className="quote-service-options" describedBy={describedBy} invalid={invalid}>
      {services.map((service, index) => {
        const credit = formatCreditClause(service, locale);
        return (
          <RadioGroupItem key={service.id} name="quote-service" value={service.id} checked={value === service.id} inputRef={index === 0 ? firstRef : undefined} inputLabel={`${service.name[locale]} — ${formatPrice(service.price, locale)}`}>
            <span className="quote-option-index" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
            <span className="quote-service-body">
              <strong>{service.name[locale]}</strong>
              <small>{service.description[locale]}</small>
              <span className="quote-service-includes"><span>{copy.includes}</span>{serviceDetails[service.id].includes[locale].join(' · ')}</span>
              {credit && <em className="quote-service-credit">{credit}</em>}
            </span>
            <span className="quote-service-price">
              <b>{formatPrice(service.price, locale)}</b>
              <i>{formatPrice(service.price, secondary)}</i>
              <u>{service.duration[locale]}</u>
            </span>
          </RadioGroupItem>
        );
      })}
    </RadioGroup>
  );
}
