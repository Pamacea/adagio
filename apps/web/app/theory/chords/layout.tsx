import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Accords',
  description: 'Bibliothèque d’accords diatoniques : degrés, voicings et diagrammes.',
};

export default function ChordsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
