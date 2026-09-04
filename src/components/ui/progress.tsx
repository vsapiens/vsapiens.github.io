import { cn } from '@/lib/utils';

export function Progress({ value, label, className }: { value: number; label: string; className?: string }) {
  const bounded = Math.max(0, Math.min(100, value));
  return (
    <div className={cn('h-2 w-full overflow-hidden bg-grid-line', className)} role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={bounded}>
      <div className="h-full bg-signal-coral transition-[width] duration-300 motion-reduce:transition-none" style={{ width: `${bounded}%` }} />
    </div>
  );
}
