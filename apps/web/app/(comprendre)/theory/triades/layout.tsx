import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Triades',
  description:
    'Triades et leurs renversements sur le manche : majeure, mineure, diminuée, augmentée.',
};

export default function TriadesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
