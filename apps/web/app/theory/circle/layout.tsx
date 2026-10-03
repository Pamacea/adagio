import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cercle des quintes',
  description: 'Cercle des quintes interactif : tonalités, accords diatoniques et relatives.',
};

export default function CircleLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
