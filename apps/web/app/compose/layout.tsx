import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Composer',
  description:
    'Construis tes progressions d’accords : cercle des degrés, substitutions et suggestions en temps réel.',
};

export default function ComposeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
