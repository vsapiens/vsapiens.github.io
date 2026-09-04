import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: 'blue' | 'violet' | 'coral' | 'neutral';
}

const tones = {
  blue: 'border-technical-blue/30 bg-technical-blue/10 text-technical-blue',
  violet: 'border-systems-violet/30 bg-systems-violet/10 text-systems-violet',
  coral: 'border-signal-coral bg-signal-coral text-ink',
  neutral: 'border-grid-line bg-surface text-muted-ink',
} as const;

export function Badge({ className, tone = 'neutral', ...props }: BadgeProps) {
  return <span className={cn('inline-flex items-center rounded-full border px-2.5 py-1 font-mono text-xs', tones[tone], className)} {...props} />;
}
