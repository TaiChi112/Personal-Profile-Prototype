import { reader } from './keystatic';
import { getProjectsTree, getBlogsTree, getArticlesTree } from '../services/content/ContentTreeSetup';

export async function fetchAllKeystaticData() {
  const [blogsListRaw, articlesListRaw, projectsListRaw] = await Promise.all([
    reader.collections.blogs.all(),
    reader.collections.articles.all(),
    reader.collections.projects.all(),
  ]);

  const projectsList = projectsListRaw.map((p) => ({
    id: p.slug,
    slug: p.slug,
    title: p.entry.title || '',
    description: p.entry.summary || '',
    date: p.entry.date || '',
    category: p.entry.category || 'Web',
    githubUrl: p.entry.githubUrl || undefined,
    repoUrl: p.entry.internalAppRoute || undefined,
    featured: p.entry.featured || false,
    techStack: p.entry.techStack ? [...p.entry.techStack] : [],
    thumbnail: p.entry.coverImage || '',
  }));

  const blogsList = blogsListRaw.map((b) => ({
    id: b.slug,
    slug: b.slug,
    title: b.entry.title || '',
    summary: b.entry.summary || '',
    date: b.entry.date || '',
    category: (b.entry.category || 'DevLog') as "Personal" | "Lifestyle" | "DevLog",
    coverImage: b.entry.coverImage || undefined,
  }));

  const articlesList = articlesListRaw.map((a) => ({
    id: a.slug,
    slug: a.slug,
    title: a.entry.title || '',
    excerpt: a.entry.excerpt || '',
    publishedAt: a.entry.publishedAt || '',
    tags: a.entry.tags ? [...a.entry.tags] : [],
    readTime: a.entry.readTime || '',
    content: '', // not needed for tree
    author: {
      name: a.entry.authorName || '',
      avatar: a.entry.authorAvatar || '',
    },
  }));

  const [blogsTree, articlesTree] = await Promise.all([
    getBlogsTree(articlesList, blogsList),
    getArticlesTree(articlesList, blogsList),
  ]);

  return { projectsList, blogsTree, articlesTree, blogsList };
}
