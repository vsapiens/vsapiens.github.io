import { cn } from '@/lib/utils';

export interface StepperProps {
  steps: readonly { label: string }[];
  current: number;
  /** Highest step index the user may jump to; later steps stay disabled until reached in order. */
  maxReached: number;
  onSelect: (index: number) => void;
  label: string;
  doneLabel: string;
  className?: string;
}

/** A 1:1, clickable step index. Completed steps stay reachable so people can edit without replaying the flow. */
export function Stepper({ steps, current, maxReached, onSelect, label, doneLabel, className }: StepperProps) {
  return (
    <ol className={cn('quote-stepper', className)} aria-label={label}>
      {steps.map((step, index) => {
        const done = index < current || (index !== current && index <= maxReached);
        return (
          <li key={step.label} data-done={done || undefined}>
            <button type="button" aria-current={index === current ? 'step' : undefined} disabled={index > maxReached} onClick={() => onSelect(index)}>
              <span className="quote-stepper-index" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
              <span className="quote-stepper-label">{step.label}</span>
              {done && <span className="sr-only"> ({doneLabel})</span>}
            </button>
          </li>
        );
      })}
    </ol>
  );
}
