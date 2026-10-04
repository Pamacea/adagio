import type { NextConfig } from 'next';
import path from 'node:path';

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // Racine workspace explicite : un pnpm-lock.yaml parasite dans le home
  // faisait inférer C:\Users\Yanis comme root, ce qui plantait Turbopack.
  turbopack: {
    root: path.join(__dirname, '../..'),
  },

  // Transpiler les packages workspace pour Turbopack
  transpilePackages: ['@adagio/ui', '@adagio/theory', '@adagio/types', '@adagio/api-client'],

  // Masquer le header X-Powered-By pour la sécurité
  poweredByHeader: false,

  experimental: {
    // Optimiser les imports de lucide-react
    optimizePackageImports: ['lucide-react'],

    // Activer le support du proxy.js (Next.js 16)
    proxyClientMaxBodySize: '5mb',
  },

  // Rewrites pour le fallback si proxy.js ne suffit pas
  // Note: Avec Next.js 16, proxy.js est la méthode préférée pour les proxies
  async rewrites() {
    const backendUrl = process.env.NESTJS_API_URL || 'http://localhost:3001';

    return [
      {
        source: '/api/v1/:path*',
        destination: `${backendUrl}/api/v1/:path*`,
      },
    ];
  },

  // Pages fusionnées (Phase 1) : /sessions → /lessons, /achievements → /profile
  async redirects() {
    return [
      { source: '/sessions/:path*', destination: '/lessons', permanent: false },
      { source: '/sessions', destination: '/lessons', permanent: false },
      { source: '/achievements', destination: '/profile', permanent: false },
    ];
  },
};

export default nextConfig;
