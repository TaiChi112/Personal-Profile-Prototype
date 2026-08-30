import { PersonalWebsiteApp } from './features/composition/PersonalWebsiteApp';
import { fetchAllKeystaticData } from './lib/content-fetcher';

export default async function PersonalWebsite() {
  const { projectsList, blogsTree, articlesTree, blogsList } = await fetchAllKeystaticData();

  return (
    <PersonalWebsiteApp 
      initialTab="home" 
      initialProjectsList={projectsList}
      initialBlogsTree={blogsTree}
      initialArticlesTree={articlesTree}
      blogsList={blogsList}
    />
  );
}