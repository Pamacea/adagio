/**
 * cn - Conditional className utility
 * Combines clsx and tailwind-merge for optimal Tailwind class merging
 */

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
