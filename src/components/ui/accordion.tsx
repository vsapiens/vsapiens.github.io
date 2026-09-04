import { createContext, useContext, useState, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

const AccordionContext = createContext<{ open: string | null; setOpen: (value: string | null) => void } | null>(null);
const ItemContext = createContext<string>('');

export function Accordion({ children, defaultValue = null, className }: { children: ReactNode; defaultValue?: string | null; className?: string }) {
  const [open, setOpen] = useState<string | null>(defaultValue);
  return <AccordionContext.Provider value={{ open, setOpen }}><div className={className}>{children}</div></AccordionContext.Provider>;
}

export function AccordionItem({ value, children, className }: { value: string; children: ReactNode; className?: string }) {
  return <ItemContext.Provider value={value}><section className={cn('border-t border-grid-line', className)}>{children}</section></ItemContext.Provider>;
}

export function AccordionTrigger({ children }: { children: ReactNode }) {
  const context = useContext(AccordionContext);
  const value = useContext(ItemContext);
  if (!context) throw new Error('AccordionTrigger must be used inside Accordion.');
  const active = context.open === value;
  return <button type="button" className="flex w-full items-center justify-between gap-4 py-5 text-left font-semibold text-ink" aria-expanded={active} onClick={() => context.setOpen(active ? null : value)}><span>{children}</span><span aria-hidden="true" className="text-xl text-systems-violet">{active ? '−' : '+'}</span></button>;
}

export function AccordionContent({ children }: { children: ReactNode }) {
  const context = useContext(AccordionContext);
  const value = useContext(ItemContext);
  if (!context || context.open !== value) return null;
  return <div className="pb-5 text-sm leading-6 text-muted-ink">{children}</div>;
}
