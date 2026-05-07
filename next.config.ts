import type { NextConfig } from "next";
import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

const nextConfig: NextConfig = {
  /* config options here */
  async headers() {
    return [
      {
        // บังคับให้ใส่ Header นี้ในทุกๆ หน้าเว็บ (/(.*))
        source: '/(.*)',
        headers: [
          {
            key: 'X-Served-By',
            // ดึงค่าจาก .env ถ้าหาไม่เจอให้ขึ้นว่า Local-Dev
            value: process.env.SERVER_NODE || 'Local-Dev',
          },
        ],
      },
    ];
  },
};

export default withMDX(nextConfig);
