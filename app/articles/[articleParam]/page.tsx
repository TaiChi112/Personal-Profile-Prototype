import { PersonalWebsiteApp } from '../../features/composition/PersonalWebsiteApp';
import { fetchAllKeystaticData } from '../../lib/content-fetcher';

export default async function ArticleDetailPage({ params }: { params: Promise<{ articleParam: string }> }) {
  const resolvedParams = await params;
  const articleParam = Array.isArray(resolvedParams.articleParam) ? resolvedParams.articleParam[0] : resolvedParams.articleParam;
  
  const { projectsList, blogsTree, articlesTree, blogsList } = await fetchAllKeystaticData();

  return (
    <PersonalWebsiteApp 
      initialTab="articles" 
      initialArticleParam={articleParam} 
      initialProjectsList={projectsList}
      initialBlogsTree={blogsTree}
      initialArticlesTree={articlesTree}
      blogsList={blogsList}
    />
  );
}
