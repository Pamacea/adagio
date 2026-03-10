import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@adagio/ui', '@adagio/theory', '@adagio/types', '@adagio/api-client'],
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
};

export default nextConfig;
