import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Profil',
  description: 'Ton profil, statistiques, succès et réglages.',
};

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
