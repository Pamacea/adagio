import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@adagio/ui', '@adagio/theory', '@adagio/types', '@adagio/api-client'],
  poweredByHeader: false, // Hide X-Powered-By header for security
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
};

export default nextConfig;
