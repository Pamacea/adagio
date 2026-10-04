import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Notation',
  description: 'Lire et écrire la notation musicale : notes, accords et progressions.',
};

export default function NotationLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
