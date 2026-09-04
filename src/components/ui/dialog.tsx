import { useEffect, useId, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  closeLabel?: string;
  children: ReactNode;
  className?: string;
}

const focusableSelector = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function Dialog({ open, onOpenChange, title, description, closeLabel = 'Close', children, className }: DialogProps) {
  const titleId = useId();
  const descriptionId = useId();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onOpenChange(false);
        return;
      }
      if (event.key !== 'Tab' || !panelRef.current) return;

      const panel = panelRef.current;
      const focusable = Array.from(panel.querySelectorAll<HTMLElement>(focusableSelector));
      const first = focusable[0];
      const last = focusable.at(-1);

      if (!first || !last) {
        event.preventDefault();
        panel.focus();
      } else if (event.shiftKey && (document.activeElement === first || document.activeElement === panel)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      } else if (!panel.contains(document.activeElement)) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    panelRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      previousFocus?.focus();
    };
  }, [open, onOpenChange]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[70] grid place-items-center p-4" data-ui="dialog">
      <div
        className="absolute inset-0 cursor-default bg-ink/55 backdrop-blur-sm"
        aria-hidden="true"
        onClick={() => onOpenChange(false)}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        tabIndex={-1}
        className={cn('relative z-10 w-full max-w-xl border border-grid-line bg-surface p-6 shadow-[10px_10px_0_var(--systems-violet)]', className)}
      >
        <div className="flex items-start justify-between gap-5">
          <div>
            <h2 id={titleId} className="text-2xl font-semibold tracking-[-0.03em] text-ink">{title}</h2>
            {description && <p id={descriptionId} className="mt-2 text-sm leading-6 text-muted-ink">{description}</p>}
          </div>
          <button type="button" className="grid size-10 shrink-0 place-items-center border border-grid-line text-xl text-ink hover:border-technical-blue" onClick={() => onOpenChange(false)} aria-label={closeLabel}>
            ×
          </button>
        </div>
        <div className="mt-6">{children}</div>
      </div>
    </div>,
    document.body,
  );
}
