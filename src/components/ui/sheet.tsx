import type { ReactNode } from 'react';
import { Dialog } from './dialog';

interface SheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  closeLabel?: string;
  children: ReactNode;
}

export function Sheet({ open, onOpenChange, title, closeLabel, children }: SheetProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange} title={title} closeLabel={closeLabel} className="ml-auto mr-0 min-h-full max-w-sm shadow-[-10px_0_0_var(--technical-blue)]">
      {children}
    </Dialog>
  );
}
