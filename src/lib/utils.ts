import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function formatPublicationDate(date: Date, locale: 'en' | 'es', month: 'short' | 'long' = 'long'): string {
  return date.toLocaleDateString(locale === 'es' ? 'es-MX' : 'en-US', {
    year: 'numeric',
    month,
    day: 'numeric',
    timeZone: 'UTC',
  });
}
