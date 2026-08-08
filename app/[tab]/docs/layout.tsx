import { RootProvider } from "fumadocs-ui/provider/next";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { source } from "@/app/lib/source";
import "fumadocs-ui/style.css";
import { DocsClientBackground } from "@/app/components/system/DocsClientBackground";
import { i18n } from "@/app/lib/i18n";
import { SiteHeader } from "@/app/components/layout/SiteHeader";

export default async function DocsRootLayout({
  children,
  params,
}: {
  readonly children: React.ReactNode;
  readonly params: Promise<{ tab: string }>;
}) {
  const { tab } = await params;
  
  return (
    <RootProvider i18n={i18n.provider(tab)}>
      <div className="relative min-h-screen">
        <DocsClientBackground />

        <div className="relative z-10 flex flex-col min-h-screen">
          <SiteHeader />
          <div className="flex-1 max-w-7xl mx-auto w-full">
            <DocsLayout
              tree={source.pageTree[tab as keyof typeof source.pageTree]}
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
