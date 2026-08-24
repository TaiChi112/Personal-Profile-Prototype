import { source } from "@/app/lib/source";
import { notFound } from "next/navigation";
import defaultMdxComponents from "fumadocs-ui/mdx";
import { Card } from "fumadocs-ui/components/card";
import { Mermaid } from "@/app/components/Mermaid";
import { DocsActionsDropdown } from "@/app/components/docs/DocsActionsDropdown";
import { Github } from "lucide-react";
import * as LucideIcons from "lucide-react";
import path from "path";
import fs from "fs/promises";
import {
  DocsPage,
  DocsBody,
  DocsDescription,
  DocsTitle,
} from "fumadocs-ui/page";

const CustomCard = (props: any) => {
  let finalIcon = props.icon;
  
  if (typeof props.icon === 'string') {
    const IconComponent = (LucideIcons as any)[props.icon];
    if (IconComponent) {
      finalIcon = <IconComponent />;
    }
  }

  return <Card {...props} icon={finalIcon} />;
};

export default async function Page(props: Readonly<{
  params: Promise<{ slug?: string[], tab: string }>;
}>) {
  const params = await props.params;

  // ดึงหน้าเอกสารตาม URL และภาษา (โดยใช้ params.tab แทน params.lang)
  const page = source.getPage(params.slug, params.tab);

  console.log("DEBUG /docs route:", { slug: params.slug, lang: params.tab, found: !!page });

  // ถ้าไม่เจอไฟล์ .md ที่ตรงกับ URL ให้แสดงหน้า 404
  if (!page) notFound();

  const Mdx = page.data.body;

  let rawMarkdown = "";
  let githubEditUrl = "";
  let githubRawUrl = "";
  try {
    const pageFilePath = page.absolutePath;
    if (pageFilePath) {
      const filePath = path.join(process.cwd(), pageFilePath);
      rawMarkdown = await fs.readFile(filePath, "utf-8");
      githubEditUrl = `https://github.com/taichi112/personal-profile-prototype/edit/main/${pageFilePath}`;
      githubRawUrl = `https://raw.githubusercontent.com/taichi112/personal-profile-prototype/main/${pageFilePath}`;
    }
  } catch (e) {
    console.error("Failed to read raw markdown", e);
  }

  return (
    <DocsPage toc={page.data.toc} full={page.data.full}>
      <main className="container mx-auto py-10 px-6 max-w-4xl relative">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <DocsTitle>{page.data.title}</DocsTitle>
            <DocsDescription>{page.data.description}</DocsDescription>
          </div>
          <div className="mt-1">
            <DocsActionsDropdown markdownContent={rawMarkdown} githubEditUrl={githubEditUrl} githubRawUrl={githubRawUrl} title={page.data.title ?? "Documentation"} />
          </div>
        </div>
        {/* โซนแสดงผลเนื้อหา Markdown */}
        <DocsBody>
          <article className="prose prose-slate dark:prose-invert max-w-none">
            <Mdx components={{ ...defaultMdxComponents, Mermaid }} />
            <Mdx components={{ ...defaultMdxComponents, Card: CustomCard, Mermaid }} />
          </article>
        </DocsBody>

        {githubEditUrl && (
          <div className="mt-12 pt-6 border-t border-fd-border flex justify-between items-center text-sm text-fd-muted-foreground">
            <a
              href={githubEditUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-fd-foreground flex items-center gap-2 transition-colors"
            >
              <Github className="w-4 h-4" />
              Propose an edit on GitHub
            </a>
          </div>
        )}
      </main>
    </DocsPage>
  );
}

export const dynamicParams = false;

// ช่วย Build เป็น Static HTML ล่วงหน้าเพื่อความเร็ว
export async function generateStaticParams() {
  const params = await source.generateParams();
  return params.map(p => ({ ...p, tab: p.lang }));
}
