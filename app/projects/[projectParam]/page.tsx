"use client";

import { useParams } from 'next/navigation';
import { PersonalWebsiteApp } from '../../features/composition/PersonalWebsiteApp';

export default function ProjectDetailPage() {
  const params = useParams<{ projectParam: string }>();
  const projectParam = Array.isArray(params.projectParam) ? params.projectParam[0] : params.projectParam;

  return <PersonalWebsiteApp initialTab="projects" initialProjectParam={projectParam} />;
}
