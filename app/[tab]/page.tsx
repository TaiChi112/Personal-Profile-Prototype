import { PersonalWebsiteApp } from '../features/composition/PersonalWebsiteApp';
import { i18n } from '../lib/i18n';
import { TAB_IDS } from '../features/composition/tabRouting';

// Include i18n locales AND the standard tabs
export async function generateStaticParams() {
  const params: { tab: string }[] = [];
  
  // 1. Language tabs
  i18n.languages.forEach((lang) => {
    params.push({ tab: lang });
  });

  TAB_IDS.forEach((tab) => {
    const langTab = tab as unknown as typeof i18n.languages[number];
    if (!i18n.languages.includes(langTab)) {
      params.push({ tab });
    }
  });

  // Also include the plural forms used in URL sometimes
  params.push({ tab: 'blogs' });
  params.push({ tab: 'analytics' });

  return params;
}

export const dynamicParams = false;

export default async function TabPage({ params }: { params: Promise<{ tab: string }> }) {
  const resolvedParams = await params;
  const tab = Array.isArray(resolvedParams.tab) ? resolvedParams.tab[0] : resolvedParams.tab;

  return <PersonalWebsiteApp initialTab={tab} />;
}
