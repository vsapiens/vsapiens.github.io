import { useState } from 'react';
import { Button, type ButtonProps } from '@/components/ui/button';

export interface CopyTextButtonProps extends Omit<ButtonProps, 'onClick' | 'children'> {
  text: string;
  label: string;
  copiedLabel: string;
  failedLabel: string;
  onCopied?: () => void;
}

/** Copies `text` to the clipboard and announces the outcome through a polite live region. */
export function CopyTextButton({ text, label, copiedLabel, failedLabel, onCopied, ...props }: CopyTextButtonProps) {
  const [status, setStatus] = useState('');
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setStatus(copiedLabel);
      onCopied?.();
    } catch {
      setStatus(failedLabel);
    }
  };
  return (
    <>
      <Button {...props} onClick={copy}>{label}</Button>
      <p className="copy-status" role="status" aria-live="polite">{status}</p>
    </>
  );
}
