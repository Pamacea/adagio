import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Succès',
  description: 'Tes succès et accomplissements : collectionne-les tous.',
};

export default function AchievementsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
