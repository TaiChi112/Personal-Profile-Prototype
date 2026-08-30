import { PersonalWebsiteApp } from '../../features/composition/PersonalWebsiteApp';
import { fetchAllKeystaticData } from '../../lib/content-fetcher';

export default async function ProjectDetailPage({ params }: { params: Promise<{ projectParam: string }> }) {
  const resolvedParams = await params;
  const projectParam = Array.isArray(resolvedParams.projectParam) ? resolvedParams.projectParam[0] : resolvedParams.projectParam;
  
  const { projectsList, blogsTree, articlesTree, blogsList } = await fetchAllKeystaticData();

  return (
    <PersonalWebsiteApp 
      initialTab="projects" 
      initialProjectParam={projectParam} 
      initialProjectsList={projectsList}
      initialBlogsTree={blogsTree}
      initialArticlesTree={articlesTree}
      blogsList={blogsList}
    />
  );
}
