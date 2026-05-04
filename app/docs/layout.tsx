import { RootProvider } from "fumadocs-ui/provider/next";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { source } from "../lib/source";
import "fumadocs-ui/style.css";
import { DocsSimpleNav } from "../components/layout/DocsSimpleNav";

export default function DocsRootLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return (
    <RootProvider>
      <DocsSimpleNav />
      <DocsLayout
        tree={source.pageTree}
        sidebar={{ enabled: true }}
        nav={
          {
            // ให้ Fumadocs วาดโลโก้ และเมื่อคลิกโลโก้จะพากลับไปหน้า Home (/)
            // title: (
            //   <span className="text-xl font-bold text-gray-900 dark:text-white">
            //     TaiChi112
            //   </span>
            // ),
            // url: "/",
            // นำ Navigation เรียบง่ายของเราไปเสียบไว้ข้างๆ
            // children: <DocsSimpleNav />,
          }
        }
      >
        {children}
      </DocsLayout>
    </RootProvider>
  );
}
