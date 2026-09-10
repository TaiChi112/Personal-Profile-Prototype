import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  return [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/en/docs`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/th/docs`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/admin/analytics`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/en/resume/interactive`,
      lastModified: new Date(),
    },
  ];
}
