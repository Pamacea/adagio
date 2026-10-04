import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Antisèche',
  description:
    'L’antisèche de théorie musicale : gammes, accords, substitutions et repères du manche.',
};

export default function NotesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
