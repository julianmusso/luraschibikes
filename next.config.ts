import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // cacheComponents disabled due to incompatibility with Sanity Studio
  // Studio uses cookies() in metadata which conflicts with cacheComponents
  // cacheComponents: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      }
    ],
  }
};

export default nextConfig;
