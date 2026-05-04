import { source } from "../../lib/source";
import { notFound } from "next/navigation";
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

  // ดึงหน้าเอกสารตาม URL
  const page = source.getPage(params.slug);

  // ถ้าไม่เจอไฟล์ .md ที่ตรงกับ URL ให้แสดงหน้า 404
  if (!page) notFound();

  const Mdx = page.data.body;

  return (
    <DocsPage toc={page.data.toc} full={page.data.full}>
      <main className="container mx-auto py-10 px-6 max-w-4xl">
        {/* <div className="mb-8 border-b pb-4">
          <h1 className="text-4xl font-bold">{page.data.title}</h1>
          <p className="text-gray-500 mt-2">
            กำลังแสดงผลในโหมดทดสอบ (Demo Route)
          </p>
        </div> */}
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
