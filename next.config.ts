import type { NextConfig } from "next";


const nextConfig: NextConfig = {
  /* Needed for images from coingecko */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'coin-images.coingecko.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
