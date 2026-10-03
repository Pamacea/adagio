import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Warning',
  robots: { index: false },
};

export default function WarningLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
