import { PersonalWebsiteApp } from '../../features/composition/PersonalWebsiteApp';
import { fetchAllKeystaticData } from '../../lib/content-fetcher';

export default async function BlogDetailPage({ params }: { params: Promise<{ blogParam: string }> }) {
  const resolvedParams = await params;
  const blogParam = Array.isArray(resolvedParams.blogParam) ? resolvedParams.blogParam[0] : resolvedParams.blogParam;
  
  const { projectsList, blogsTree, articlesTree, blogsList } = await fetchAllKeystaticData();

  return (
    <PersonalWebsiteApp 
      initialTab="blog" 
      initialBlogParam={blogParam} 
      initialProjectsList={projectsList}
      initialBlogsTree={blogsTree}
      initialArticlesTree={articlesTree}
      blogsList={blogsList}
    />
  );
}
