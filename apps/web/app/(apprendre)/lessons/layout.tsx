import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Leçons',
  description: 'Catalogue de leçons de théorie musicale : modes, accords, progression, composition.',
};

export default function LessonsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
