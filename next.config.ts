import type { NextConfig } from "next";
import { createMDX } from 'fumadocs-mdx/next';
import withPWA from "@ducanh2912/next-pwa";

const withMDX = createMDX();

const nextConfig: NextConfig = {
  output: process.env.VERCEL ? undefined : 'standalone',
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error'] } : false,
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default withMDX(withPWA({ dest: "public", disable: process.env.NODE_ENV === "development" })(nextConfig));
