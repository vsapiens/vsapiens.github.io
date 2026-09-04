import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export function RadioGroup({ value, onValueChange, label, children, className }: { value: string; onValueChange: (value: string) => void; label: string; children: ReactNode; className?: string }) {
  return <fieldset className={className} data-value={value} onChange={(event) => { const target = event.target; if (target instanceof HTMLInputElement) onValueChange(target.value); }}><legend className="sr-only">{label}</legend>{children}</fieldset>;
}

export function RadioGroupItem({ value, checked, children }: { value: string; checked: boolean; children: ReactNode }) {
  return (
    <label className={cn('inline-flex cursor-pointer items-center gap-2 border px-3 py-2 text-xs font-medium', checked ? 'border-systems-violet bg-systems-violet/10 text-systems-violet' : 'border-grid-line bg-surface text-muted-ink')}>
      <input className="size-3 accent-systems-violet" type="radio" name="map-mode" value={value} checked={checked} readOnly />
      {children}
    </label>
  );
}
