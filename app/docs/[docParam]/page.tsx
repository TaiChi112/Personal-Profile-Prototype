"use client";

import { useParams } from 'next/navigation';
import { PersonalWebsiteApp } from '../../features/composition/PersonalWebsiteApp';

export default function DocDetailPage() {
  const params = useParams<{ docParam: string }>();
  const docParam = Array.isArray(params.docParam) ? params.docParam[0] : params.docParam;

  return <PersonalWebsiteApp initialTab="docs" initialDocParam={docParam} />;
}
