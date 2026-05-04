import { source } from "../../lib/source";
import { notFound, redirect } from "next/navigation"; // 1. นำเข้า redirect
import defaultMdxComponents from "fumadocs-ui/mdx";
import { Mermaid } from "../../components/Mermaid";
import {
  DocsPage,
  DocsBody,
  DocsDescription,
  DocsTitle,
} from "fumadocs-ui/page";

export default async function Page(props: Readonly<{
  params: Promise<{ slug?: string[] }>;
}>) {
  const params = await props.params;

  // 2. ดักจับที่นี่! ถ้าเข้า /docs เฉยๆ ให้เด้งไปที่หน้าแรกของเอกสาร
  if (!params.slug || params.slug.length === 0) {
    redirect('/docs/'); // สามารถเปลี่ยน path ให้ตรงกับหน้าแรกของคุณได้เลยครับ
  }

  // ดึงหน้าเอกสารตาม URL
  const page = source.getPage(params.slug);

  // ถ้าไม่เจอไฟล์ .md ที่ตรงกับ URL ให้แสดงหน้า 404
  if (!page) notFound();

  const Mdx = page.data.body;

  return (
    <DocsPage toc={page.data.toc} full={page.data.full}>
      <main className="container mx-auto py-10 px-6 max-w-4xl">
        <DocsTitle>{page.data.title}</DocsTitle>
        <DocsDescription>{page.data.description}</DocsDescription>
        {/* โซนแสดงผลเนื้อหา Markdown */}
        <DocsBody>
          <article className="prose prose-slate dark:prose-invert max-w-none">
            <Mdx components={{ ...defaultMdxComponents, Mermaid }} />
          </article>
        </DocsBody>
      </main>
    </DocsPage>
  );
}

// ช่วย Build เป็น Static HTML ล่วงหน้าเพื่อความเร็ว
export async function generateStaticParams() {
  return source.generateParams();
}