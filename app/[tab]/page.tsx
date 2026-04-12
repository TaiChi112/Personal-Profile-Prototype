"use client";

import { useParams } from 'next/navigation';
import { PersonalWebsiteApp } from '../features/composition/PersonalWebsiteApp';

export default function TabPage() {
  const params = useParams<{ tab: string }>();
  const tab = Array.isArray(params.tab) ? params.tab[0] : params.tab;

  return <PersonalWebsiteApp initialTab={tab} />;
}
