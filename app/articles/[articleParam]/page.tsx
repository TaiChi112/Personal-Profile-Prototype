"use client";

import { useParams } from 'next/navigation';
import { PersonalWebsiteApp } from '../../features/composition/PersonalWebsiteApp';

export default function ArticleDetailPage() {
  const params = useParams<{ articleParam: string }>();
  const articleParam = Array.isArray(params.articleParam) ? params.articleParam[0] : params.articleParam;

  return <PersonalWebsiteApp initialTab="articles" initialArticleParam={articleParam} />;
}
