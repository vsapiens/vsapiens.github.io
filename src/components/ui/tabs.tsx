import { createContext, useContext, useId, type KeyboardEvent, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface TabsContextValue {
  value: string;
  setValue: (value: string) => void;
  baseId: string;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabs() {
  const context = useContext(TabsContext);
  if (!context) throw new Error('Tabs components must be used inside Tabs.');
  return context;
}

export function Tabs({ value, onValueChange, children }: { value: string; onValueChange: (value: string) => void; children: ReactNode }) {
  const baseId = useId();
  return <TabsContext.Provider value={{ value, setValue: onValueChange, baseId }}>{children}</TabsContext.Provider>;
}

export function TabsList({ children, label, className }: { children: ReactNode; label: string; className?: string }) {
  return <div role="tablist" aria-label={label} className={cn('flex flex-wrap gap-2', className)}>{children}</div>;
}

export function TabsTrigger({ value, children }: { value: string; children: ReactNode }) {
  const context = useTabs();
  const active = context.value === value;
  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    const tabs = Array.from(event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>('[role="tab"]') ?? []);
    const current = tabs.indexOf(event.currentTarget);
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : (current + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
    event.preventDefault();
    tabs[next]?.focus();
    tabs[next]?.click();
  };
  return (
    <button
      type="button"
      role="tab"
      id={`${context.baseId}-tab-${value}`}
      aria-controls={`${context.baseId}-panel-${value}`}
      aria-selected={active}
      tabIndex={active ? 0 : -1}
      onClick={() => context.setValue(value)}
      onKeyDown={onKeyDown}
      className={cn('border px-3 py-2 text-sm font-semibold', active ? 'border-technical-blue bg-technical-blue text-white' : 'border-grid-line bg-surface text-ink hover:border-technical-blue')}
    >
      {children}
    </button>
  );
}

export function TabsContent({ value, children, className }: { value: string; children: ReactNode; className?: string }) {
  const context = useTabs();
  if (context.value !== value) return null;
  return <div role="tabpanel" id={`${context.baseId}-panel-${value}`} aria-labelledby={`${context.baseId}-tab-${value}`} className={className}>{children}</div>;
}
