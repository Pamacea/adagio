import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'Adagio - L\'atlas harmonique intelligent pour guitaristes',
  description: 'Explorez la théorie musicale par l\'émotion et la visualisation interactive.',
  keywords: ['guitare', 'théorie musicale', 'harmonie', 'modes', 'gammes', 'accords'],
  authors: [{ name: 'Adagio' }],
  openGraph: {
    title: 'Adagio - L\'atlas harmonique intelligent',
    description: 'Ne joue pas des notes, joue des intentions.',
    type: 'website',
    locale: 'fr_FR',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={inter.variable}>
      <body className="min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
