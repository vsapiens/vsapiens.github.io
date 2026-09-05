import type { Ref } from 'react';
import { services, type Locale } from '@/data/site';
import { formatDualPrice } from '@/lib/quote';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import type { QuoteCopy } from './copy';

/** The dark band: four services as index, name, two-line description, price line, and a Select → affordance. One click chooses. */
export function ServiceBand({ locale, value, onChange, invalid, describedBy, firstRef, copy }: {
  locale: Locale; value: string; onChange: (value: string) => void; invalid: boolean; describedBy?: string; firstRef: Ref<HTMLInputElement>; copy: QuoteCopy;
}) {
  return (
    <div className="quote-band">
      <p className="quote-band-kicker" aria-hidden="true">{copy.bandKicker}</p>
      <RadioGroup value={value} onValueChange={onChange} label={copy.service} className="quote-band-grid" describedBy={describedBy} invalid={invalid}>
        {services.map((service, index) => {
          const checked = value === service.id;
          return (
            <RadioGroupItem key={service.id} name="quote-service" value={service.id} checked={checked} inputRef={index === 0 ? firstRef : undefined} inputLabel={service.name[locale]}>
              <span className="quote-service-index" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
              <span className="quote-service-name">{service.name[locale]}</span>
              <span className="quote-service-copy">{service.description[locale]}</span>
              <span className="quote-service-meta">{formatDualPrice(service.price, locale)} · {service.duration[locale]}</span>
              <span className="quote-service-select" aria-hidden="true">{checked ? copy.selected : `${copy.select} →`}</span>
            </RadioGroupItem>
          );
        })}
      </RadioGroup>
    </div>
  );
}
