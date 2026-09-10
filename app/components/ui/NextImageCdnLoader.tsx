'use client';

import Image, { ImageProps } from 'next/image';

const cloudflareLoader = ({ src, width, quality }: { src: string; width: number; quality?: number }) => {
  const params = [`width=${width}`];
  if (quality) {
    params.push(`quality=${quality}`);
  }
  params.push('format=auto');
  return `https://mock.cloudflare.images.com/cdn-cgi/image/${params.join(',')}/${src}`;
};

export default function NextImageCdnLoader(props: ImageProps) {
  return <Image {...props} loader={cloudflareLoader} />;
}
