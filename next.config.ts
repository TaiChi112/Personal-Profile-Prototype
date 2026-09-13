import type { NextConfig } from "next";
import { createMDX } from 'fumadocs-mdx/next';
import withPWA from "@ducanh2912/next-pwa";

const withMDX = createMDX();

const nextConfig: NextConfig = {
  output: 'standalone',
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default withMDX(withPWA({ dest: "public", disable: process.env.NODE_ENV === "development" })(nextConfig));
