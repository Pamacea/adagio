import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Gammes',
  description: 'Toutes les gammes : majeure, mineure, pentatoniques, blues, harmoniques et symétriques.',
};

export default function ScalesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
