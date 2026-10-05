import { compile } from '@mdx-js/mdx';
import fs from 'fs';
const mdx = fs.readFileSync('content/docs/computer_science/systems/coa/labs/pipelining-hazard.mdx', 'utf8');
compile(mdx, { jsx: true }).then(() => console.log('SUCCESS')).catch(console.error);
