import {
  MOCK_ARTICLES_FLAT,
  MOCK_BLOGS,
  MOCK_PROJECTS,
  MOCK_VIDEOS,
  type Article,
  type Blog,
  type ExternalVideoData,
  type PodcastEpisode,
  type Project,
} from "../../data/content";
import type {
  CompositeNode,
  LayoutStyleType,
  LeafNode,
  UnifiedContentItem,
} from "../../interfaces/content-tree";

const PROJECT_REPO_BY_TITLE: Record<string, string> = {
  "Personal Website (Design Pattern Playground)":
    "https://github.com/TaiChi112/Personal-Profile-Prototype",
  "AI-Powered Phygital Icebreaker Platform":
    "https://github.com/TaiChi112/CS-ICEbreaker-HUB",
  "Project Scaffolding CLI Tool (MVP)":
    "https://github.com/TaiChi112/Project-Scaffolding-CLI-Tool",
  "AI-Powered Manga OCR and Translation Pipeline (HITL)":
    "https://github.com/TaiChi112/Converter-Mange-OCR",
  "Universal Academic Portfolio System (UAPs)":
    "https://github.com/TaiChi112/UAPs",
  "Google Calendar AI Agent (MCP)":
    "https://github.com/TaiChi112/SDLC_HUB_PROTOTYPE",
};

const toSlug = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replaceAll(/[^a-z0-9\s-]/g, "")
    .replaceAll(/\s+/g, "-")
    .replaceAll(/-+/g, "-");

const getProjectRepositoryLink = (project: Project) => {
  const mappedLink = PROJECT_REPO_BY_TITLE[project.title];
  if (mappedLink) {
    return mappedLink;
  }

  if (
    typeof project.githubUrl === "string" &&
    /^https?:\/\//i.test(project.githubUrl)
  ) {
    return project.githubUrl;
  }

  return undefined;
};

export const adaptProjectToUnified = (
  project: Project,
): UnifiedContentItem => ({
  id: `proj-${project.id}`,
  type: "project",
  slug: toSlug(project.title),
  title: project.title,
  description: project.description,
  date: project.date,
  imageUrl: project.thumbnail,
  meta: project.techStack,
  actionLink: getProjectRepositoryLink(project),
  decorations: project.featured ? ["featured"] : [],
  isLocked: project.title.includes("Merchant"),
});

export const adaptBlogToUnified = (blog: Blog): UnifiedContentItem => ({
  id: `blog-${blog.id}`,
  type: "blog",
  slug: blog.slug,
  title: blog.title,
  description: blog.summary,
  date: blog.date,
  imageUrl: blog.coverImage,
  meta: [blog.category],
  actionLink: "#",
});

export const adaptVideoToUnified = (
  video: ExternalVideoData,
): UnifiedContentItem => ({
  id: `vid-${video.videoId}`,
  type: "video",
  title: video.headline,
  description: video.descriptionSnippet,
  date: new Date(video.published_timestamp).toISOString().split("T")[0],
  imageUrl: video.thumbnail_high,
  meta: [`${video.views} views`],
  actionLink: "#",
  decorations: video.views > 10000 ? ["popular", "hot"] : [],
});

export const adaptArticleToUnified = (
  article: Article,
): UnifiedContentItem => ({
  id: `art-${article.id}`,
  type: "article",
  slug: article.slug,
  title: article.title,
  description: article.excerpt,
  date: article.publishedAt,
  meta: article.tags,
  actionLink: "#",
  isLocked: article.tags.includes("Advanced"),
});

export const adaptPodcastToUnified = (
  podcast: PodcastEpisode,
): UnifiedContentItem => ({
  id: `pod-${podcast.id}`,
  type: "podcast",
  title: podcast.title,
  description: podcast.description,
  date: podcast.date,
  meta: [podcast.duration, ...podcast.tags],
  actionLink: "#",
  decorations: ["new"],
});

class ContentBuilder {
  private readonly root: CompositeNode;
  private currentContainer: CompositeNode;
  private readonly stack: CompositeNode[] = [];

  constructor(
    id: string,
    layoutStyle: LayoutStyleType = "column",
    title?: string,
    data?: UnifiedContentItem,
  ) {
    this.root = {
      id,
      type: "container",
      layoutStyle,
      title,
      children: [],
      data,
    };
    this.currentContainer = this.root;
    this.stack.push(this.root);
  }

  addContainer(
    id: string,
    layoutStyle: LayoutStyleType,
    title?: string,
    data?: UnifiedContentItem,
  ): this {
    const newContainer: CompositeNode = {
      id,
      type: "container",
      layoutStyle,
      title,
      children: [],
      data,
    };
    this.currentContainer.children.push(newContainer);
    this.stack.push(this.currentContainer);
    this.currentContainer = newContainer;
    return this;
  }

  addItem(item: UnifiedContentItem): this {
    const leaf: LeafNode = { id: `leaf-${item.id}`, type: "item", data: item };
    this.currentContainer.children.push(leaf);
    return this;
  }

  up(): this {
    if (this.stack.length > 0) {
      this.currentContainer = this.stack.pop()!;
    }
    return this;
  }

  build(): CompositeNode {
    return this.root;
  }
}

// .addContainer('ai-chat', 'list', 'AI Chat System', { ...adaptProjectToUnified(MOCK_PROJECTS[3]), decorations: ['sponsor'] })
// .addItem(adaptProjectToUnified(MOCK_PROJECTS[4]))
// .up()
// .addContainer('test', 'grid', 'test', { ...adaptProjectToUnified(MOCK_PROJECTS[6]), decorations: ['featured'] })
// .addItem(adaptProjectToUnified(MOCK_PROJECTS[4]))
// .addItem(adaptProjectToUnified(MOCK_PROJECTS[1]))
// .up()
export const INITIAL_PROJECTS_TREE = new ContentBuilder(
  "proj-root",
  "column",
  "All Projects",
)
  .addContainer(
    "personal-website",
    "grid",
    "Personal Website (Design Pattern Playground)",
    { ...adaptProjectToUnified(MOCK_PROJECTS[0]), decorations: ["popular"] },
  )
  .addItem(adaptProjectToUnified(MOCK_PROJECTS[0]))
  .addItem({ ...adaptArticleToUnified(MOCK_ARTICLES_FLAT[0]), isLocked: true })
  .up()
  .addContainer(
    "ai-manga-ocr",
    "list",
    "AI-Powered Manga OCR and Translation Pipeline (HITL)",
    { ...adaptProjectToUnified(MOCK_PROJECTS[1]), decorations: ["sponsor"] },
  )
  .addItem(adaptProjectToUnified(MOCK_PROJECTS[1]))
  .up()
  .addContainer("uaps", "list", "Universal Academic Portfolio System (UAPs)", {
    ...adaptProjectToUnified(MOCK_PROJECTS[2]),
    decorations: ["featured"],
  })
  .addItem(adaptProjectToUnified(MOCK_PROJECTS[2]))
  .up()
  .addContainer(
    "google-calendar-ai",
    "list",
    "Google Calendar AI Agent (MCP)",
    { ...adaptProjectToUnified(MOCK_PROJECTS[3]), decorations: ["hot"] },
  )
  .addItem(adaptProjectToUnified(MOCK_PROJECTS[3]))
  .up()
  .addContainer(
    "project-scaffolding",
    "list",
    "Project Scaffolding CLI Tool (MVP)",
    { ...adaptProjectToUnified(MOCK_PROJECTS[4]), decorations: ["new"] },
  )
  .addItem(adaptProjectToUnified(MOCK_PROJECTS[4]))
  .up()
  .addContainer(
    "ai-powered-icebreaker",
    "list",
    "AI-Powered Phygital Icebreaker Platform",
    { ...adaptProjectToUnified(MOCK_PROJECTS[5]), decorations: ["new"] },
  )
  .addItem(adaptProjectToUnified(MOCK_PROJECTS[5]))
  .up()
  .addContainer("super-app", "grid", "E-Commerce Super App", {
    ...adaptProjectToUnified(MOCK_PROJECTS[6]),
    decorations: ["featured"],
    isLocked: false,
  })
  .build();

export const BLOGS_TREE = new ContentBuilder(
  "blog-root",
  "column",
  "My Writings",
)
  .addContainer("journey", "timeline", "Tech Journey", {
    ...adaptBlogToUnified(MOCK_BLOGS[0]),
    decorations: ["featured"],
  })
  .addItem({
    ...adaptArticleToUnified(MOCK_ARTICLES_FLAT[0]),
    title: "First Framework I Learned",
  })
  .addItem({
    ...adaptProjectToUnified(MOCK_PROJECTS[0]),
    title: "My First Big Failure",
  })
  .up()
  .addContainer(
    "lifestyle",
    "list",
    "Lifestyle",
    adaptBlogToUnified(MOCK_BLOGS[1]),
  )
  .addItem({
    ...adaptVideoToUnified(MOCK_VIDEOS[0]),
    title: "Vlog: A Day in Life",
    decorations: ["new"],
  })
  .build();

export const ARTICLES_TREE = new ContentBuilder(
  "art-root",
  "grid",
  "Knowledge Base",
)
  .addContainer("rsc-master", "grid", "RSC Mastery", {
    ...adaptArticleToUnified(MOCK_ARTICLES_FLAT[0]),
    decorations: ["hot"],
  })
  .addItem({
    ...adaptBlogToUnified(MOCK_BLOGS[0]),
    title: "Why I moved to RSC",
  })
  .addItem({ ...adaptVideoToUnified(MOCK_VIDEOS[0]), title: "Video Demo" })
  .up()
  .addContainer(
    "ts-master",
    "list",
    "TypeScript Zone",
    adaptArticleToUnified(MOCK_ARTICLES_FLAT[1]),
  )
  .addItem({
    ...adaptProjectToUnified(MOCK_PROJECTS[1]),
    title: "Utility Types",
  })
  .build();
