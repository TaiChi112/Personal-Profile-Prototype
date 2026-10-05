import { compile } from '@mdx-js/mdx';
import fs from 'fs';
import glob from 'glob';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

const files = glob.sync('content/**/*.mdx');
let hasError = false;

async function checkFiles() {
  for (const file of files) {
    try {
      const content = fs.readFileSync(file, 'utf8');
      await compile(content, { 
        jsx: true,
        remarkPlugins: [remarkMath],
        rehypePlugins: [rehypeKatex]
      });
    } catch (err) {
      console.error(`\nERROR IN FILE: ${file}`);
      console.error(err.message);
      hasError = true;
    }
  }
}

checkFiles().then(() => {
  if (!hasError) { console.log('ALL FILES PASSED MDX COMPILATION!'); }
});
