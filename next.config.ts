import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    domains: ['c0swb92iep.ufs.sh'],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
