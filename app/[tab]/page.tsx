import { PersonalWebsiteApp } from '../features/composition/PersonalWebsiteApp';
import { i18n } from '../lib/i18n';

export async function generateStaticParams() {
  return i18n.languages.map((tab) => ({ tab }));
}

export const dynamicParams = false;

export default async function TabPage({ params }: { params: Promise<{ tab: string }> }) {
  const resolvedParams = await params;
  const tab = Array.isArray(resolvedParams.tab) ? resolvedParams.tab[0] : resolvedParams.tab;

  return <PersonalWebsiteApp initialTab={tab} />;
}
