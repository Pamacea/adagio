import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sessions',
  description: 'Tes sessions d’apprentissage et ta progression.',
};

export default function SessionsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
