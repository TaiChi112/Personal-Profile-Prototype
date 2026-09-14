import { PersonalWebsiteApp } from '../features/composition/PersonalWebsiteApp';
import { fetchAllKeystaticData } from '../lib/content-fetcher';

export const dynamic = 'force-static';

export default async function ProjectsPage() {
  const { projectsList, blogsTree, articlesTree, blogsList } = await fetchAllKeystaticData();

  return (
    <PersonalWebsiteApp 
      initialTab="projects"
      initialProjectsList={projectsList}
      initialBlogsTree={blogsTree}
      initialArticlesTree={articlesTree}
      blogsList={blogsList}
    />
  );
}
