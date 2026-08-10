import { RootProvider } from "fumadocs-ui/provider/next";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { source } from "@/app/lib/source";
import "fumadocs-ui/style.css";
import { DocsClientBackground } from "@/app/components/system/DocsClientBackground";
import { i18n } from "@/app/lib/i18n";
import { SiteHeader } from "@/app/components/layout/SiteHeader";
import { Book, Code2, Briefcase, Landmark, Apple, HeartPulse } from "lucide-react";

export default async function DocsRootLayout({
  children,
  params,
}: {
  readonly children: React.ReactNode;
  readonly params: Promise<{ tab: string }>;
}) {
  const { tab } = await params;
  
  const getTabs = (tab: string) => [
    { 
      title: tab === 'th' ? 'แนะนำเบื้องต้น' : 'Overview', 
      url: `/${tab}/docs`,
      icon: <Book className="w-4 h-4" />
    },
    { 
      title: 'Computer Science', 
      url: `/${tab}/docs/computer_science`,
      icon: <Code2 className="w-4 h-4" />
    },
    { 
      title: 'Business', 
      url: `/${tab}/docs/business`,
      icon: <Briefcase className="w-4 h-4" />
    },
    { 
      title: 'Finance', 
      url: `/${tab}/docs/finance`,
      icon: <Landmark className="w-4 h-4" />
    },
    { 
      title: 'Food Science', 
      url: `/${tab}/docs/food_science`,
      icon: <Apple className="w-4 h-4" />
    },
    { 
      title: 'Wellness', 
      url: `/${tab}/docs/wellness`,
      icon: <HeartPulse className="w-4 h-4" />
    }
  ];

  return (
    <RootProvider i18n={i18n.provider(tab)}>
      <div className="relative min-h-screen">
        <DocsClientBackground />

        <div className="relative z-10 flex flex-col min-h-screen">
          <SiteHeader />
          <div className="flex-1 max-w-7xl mx-auto w-full">
            <DocsLayout
              tree={source.pageTree[tab as keyof typeof source.pageTree]}
              tabs={getTabs(tab)}
              sidebar={{ enabled: true }}
              slots={{ languageSelect: false }}
            >
              {children}
            </DocsLayout>
          </div>
        </div>
      </div>
    </RootProvider>
  );
}
