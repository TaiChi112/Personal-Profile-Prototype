import { docs, meta } from '../../.source/server';
import { loader } from 'fumadocs-core/source';
import { toFumadocsSource } from 'fumadocs-mdx/runtime/server';

export const source = loader({
  // baseUrl: '/demo',
  baseUrl: '/docs',
  source: toFumadocsSource(docs, meta),
});