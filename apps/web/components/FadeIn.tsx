/**
 * FadeIn — entrée animée sobre (framer-motion) au scroll.
 * `once: true` : l'animation ne se rejoue pas en remontant le scroll.
 */

'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

export interface FadeInProps {
  children: ReactNode;
  /** Délai d'entrée en cascade (secondes) */
  delay?: number;
  className?: string;
}

export function FadeIn({ children, delay = 0, className }: FadeInProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, ease: 'easeOut', delay }}
    >
      {children}
    </motion.div>
  );
}
