import { services } from '@/data/site';
import type { QuoteCopy } from './copy';

const icons = [
  <path key="tag" d="M4 4h9l7 7-9 9-7-7V4zM8 8h.01" />,
  <path key="clock" d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2" />,
  <path key="credit" d="M4 12a8 8 0 0 1 14-5.3M20 12a8 8 0 0 1-14 5.3M18 3v4h-4M6 21v-4h4" />,
  <path key="lock" d="M6 11h12v9H6zM9 11V7a3 3 0 0 1 6 0v4" />,
];

/** Four guarantees the visitor can hold the offer to; the credit window comes from the service data, never from copy alone. */
export function TrustStrip({ copy }: { copy: QuoteCopy }) {
  const days = services.find((service) => service.credit)?.credit?.windowDays ?? 0;
  return (
    <ul className="trust-strip">
      {copy.trust.map(([title, body], index) => (
        <li key={title}>
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{icons[index]}</svg>
          <span><strong>{title}</strong><small>{body.replace('{days}', String(days))}</small></span>
        </li>
      ))}
    </ul>
  );
}
