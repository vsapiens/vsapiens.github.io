import type { ReactNode, Ref } from 'react';
import { cn } from '@/lib/utils';

export function RadioGroup({ value, onValueChange, label, children, className, describedBy, invalid }: { value: string; onValueChange: (value: string) => void; label: string; children: ReactNode; className?: string; describedBy?: string; invalid?: boolean }) {
  return <fieldset className={className} data-value={value} aria-describedby={describedBy} aria-invalid={invalid} onChange={(event) => { const target = event.target; if (target instanceof HTMLInputElement) onValueChange(target.value); }}><legend className="sr-only">{label}</legend>{children}</fieldset>;
}

/** `inputLabel` pins the accessible name when the visible label carries extra text (prices, notes) that must not leak into it. */
export function RadioGroupItem({ value, checked, children, name = 'map-mode', inputRef, inputLabel }: { value: string; checked: boolean; children: ReactNode; name?: string; inputRef?: Ref<HTMLInputElement>; inputLabel?: string }) {
  return (
    <label className={cn('inline-flex cursor-pointer items-center gap-2 border px-3 py-2 text-xs font-medium', checked ? 'border-systems-violet bg-systems-violet/10 text-systems-violet' : 'border-grid-line bg-surface text-muted-ink')}>
      <input ref={inputRef} className="size-3 accent-systems-violet" type="radio" name={name} value={value} checked={checked} aria-label={inputLabel} readOnly />
      {children}
    </label>
  );
}
