import { RootProvider } from "fumadocs-ui/provider/next";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { source } from "../lib/source";
import "fumadocs-ui/style.css";
import { SiteHeader } from "../components/layout/SiteHeader";
import { ParticleBackground } from "../components/system/ParticleBackground";

export default function DocsRootLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return (
    <RootProvider>
      <div className="relative min-h-screen overflow-x-hidden">
        <ParticleBackground isDark={true} styleName="Modern" />

        <div className="relative z-10">
          <SiteHeader />
          <DocsLayout
            tree={source.pageTree}
            sidebar={{ enabled: true }}
            nav={{ enabled: true }}
          >
            {children}
          </DocsLayout>
        </div>
      </div>
    </RootProvider>
  );
}
