import { ResumeViewer } from "@/app/components/resume/ResumeViewer";
import { SiteHeader } from "@/app/components/layout/SiteHeader";

export default async function InteractiveResumePage(props: {
  params: Promise<{ tab: string }>;
}) {
  const params = await props.params;
  const lang = params.tab === "th" ? "th" : "en";

  return (
    <div className="min-h-screen bg-fd-background">
      <SiteHeader />
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Interactive Resume</h1>
          <p className="text-fd-muted-foreground max-w-2xl mx-auto">
            Explore my skills, experience, and projects through an interactive interface. 
            All data is sourced directly from a central configuration file.
          </p>
        </div>
        
        <ResumeViewer lang={lang} />
      </main>
    </div>
  );
}
