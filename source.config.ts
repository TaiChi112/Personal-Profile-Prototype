import { defineDocs, defineConfig } from 'fumadocs-mdx/config';
import { rehypeCodeDefaultOptions,remarkMdxMermaid } from 'fumadocs-core/mdx-plugins';
import { z } from 'zod';

// import remarkMath from 'remark-math';
// import rehypeKatex from 'rehype-katex';

export const { docs, meta } = defineDocs({
  // ชี้ไปที่โฟลเดอร์ docs ที่อยู่หน้าสุดของโปรเจกต์ (ที่เก็บไฟล์ .md ของคุณ)
  dir: 'docs', 
  docs: {
    schema: z
      .object({
        title: z.string().optional(),
        description: z.string().optional(),
        icon: z.string().optional(),
        full: z.boolean().optional(),
        _openapi: z.record(z.string(), z.any()).optional(),
      })
      .passthrough(),
  },
});

export default defineConfig({
  mdxOptions: {
    rehypeCodeOptions: {
      ...rehypeCodeDefaultOptions,
      langs: ['dotenv'],
      langAlias: {
        env: 'dotenv',
      },
    },
    remarkPlugins: (v) => [remarkMdxMermaid, ...v],
    // remarkPlugins: [remarkMdxMermaid],
    // remarkPlugins: [remarkMath, remarkMdxMermaid, remarkMdxFiles],
    //     // rehypePlugins: [[rehypeKatex, { output: 'html' }]],
    //     rehypePlugins: (v) => [rehypeKatex, ...v],
  },
});
