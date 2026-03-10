import type { Metadata } from 'next';
import { Archivo_Black, Space_Mono } from 'next/font/google';
import { AuthProvider } from '@/lib/auth';
import { Providers } from './providers';
import { Analytics } from '@vercel/analytics/react';
import './globals.css';

const archivoBlack = Archivo_Black({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-archivo',
  display: 'swap',
});

const spaceMono = Space_Mono({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-space',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'ADAGIO - Théorie Musicale Brutale',
  description: 'Maîtrise la théorie musicale. Pas de dashboard. Pas de SaaS. Juste du métal.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="dark">
      <body className={`${archivoBlack.variable} ${spaceMono.variable}`}>
        <Providers>
          <AuthProvider>
            {children}
          </AuthProvider>
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
