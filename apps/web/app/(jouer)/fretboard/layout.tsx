import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Manche',
  description: 'Manche de guitare interactif : notes, intervalles, degrés et positions CAGED.',
};

export default function FretboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
