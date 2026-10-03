import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Modes',
  description: 'Les 7 modes grecs et leur caractère émotionnel : ionien, dorien, phrygien, lydien, mixolydien, éolien, locrien.',
};

export default function ModesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
