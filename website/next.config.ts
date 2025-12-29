import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // basePath: '/PomoHub', // Disabled for root deployment
};

export default nextConfig;
