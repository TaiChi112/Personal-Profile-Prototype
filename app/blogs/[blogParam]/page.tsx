"use client";

import { useParams } from 'next/navigation';
import { PersonalWebsiteApp } from '../../features/composition/PersonalWebsiteApp';

export default function BlogDetailPage() {
  const params = useParams<{ blogParam: string }>();
  const blogParam = Array.isArray(params.blogParam) ? params.blogParam[0] : params.blogParam;

  return <PersonalWebsiteApp initialTab="blog" initialBlogParam={blogParam} />;
}
