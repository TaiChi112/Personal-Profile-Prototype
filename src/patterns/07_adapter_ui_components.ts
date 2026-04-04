/**
 * ADAPTER PATTERN - Real-world Application from app/page.tsx
 * 
 * Problem: app/page.tsx deals with multiple content types:
 *          - Project (with title, description, techStack, featured status)
 *          - Blog (with title, summary, category)
 *          - Video (with headline, views, tags)
 *          - Article (with title, excerpt, readTime, tags)
 *          - Doc (with title, section, content)
 *          - PodcastEpisode (with duration, tags)
 *   
 *   Each has different structure and properties. Need a unified interface
 *   to display them in lists, filters, and search results.
 * 
 * Solution: Create adapters that convert all content types to UnifiedContentItem
 *          Allows treating different content types uniformly
 * 
 * Real-world benefit: Single rendering component can handle all content types
 *                    Consistent filtering, sorting, and display logic
 */

// ====================================
// REAL-WORLD DATA TYPES from app/page.tsx
// ====================================

export interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  githubUrl?: string;
  liveUrl?: string;
  thumbnail: string;
  featured: boolean;
  date: string;
}

export interface Blog {
  id: string;
  title: string;
  slug: string;
  summary: string;
  date: string;
  category: 'Personal' | 'Lifestyle' | 'DevLog';
  coverImage?: string;
}

export interface ExternalVideoData {
  videoId: string;
  headline: string;
  descriptionSnippet: string;
  published_timestamp: number;
  thumbnail_high: string;
  views: number;
  tags: string[];
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  publishedAt: string;
  tags: string[];
  readTime: string;
  author: { name: string; avatar: string };
}

export interface Doc {
  id: string;
  title: string;
  slug: string;
  section: string;
  content: string;
  lastUpdated: string;
}

export interface PodcastEpisode {
  id: string;
  title: string;
  duration: string;
  description: string;
  date: string;
  tags: string[];
}

// ====================================
// UNIFIED INTERFACE - What we want
// ====================================

export type DecorationType = 'new' | 'featured' | 'sponsor' | 'hot' | 'popular';

export interface UnifiedContentItem {
  id: string;
  type: 'project' | 'blog' | 'video' | 'article' | 'doc' | 'podcast';
  title: string;
  description: string;
  date: string;
  imageUrl?: string;
  meta: string[];
  actionLink?: string;
  decorations?: DecorationType[];
  isLocked?: boolean;
}

// ====================================
// ADAPTEE CLASSES - Existing incompatible interfaces
// ====================================

// (These are no longer needed for the real-world app/page.tsx pattern,
//  but kept here for reference of how adapters would work with legacy components)

// ====================================
// ADAPTER IMPLEMENTATIONS
// ====================================

/**
 * Adapter: Project → UnifiedContentItem
 */
export class ProjectAdapter {
  static adapt(project: Project): UnifiedContentItem {
    return {
      id: `proj-${project.id}`,
      type: 'project',
      title: project.title,
      description: project.description,
      date: project.date,
      imageUrl: project.thumbnail,
      meta: project.techStack,
      actionLink: project.githubUrl,
      decorations: project.featured ? ['featured'] : [],
      isLocked: project.title.includes('Merchant'),
    };
  }
}

/**
 * Adapter: Blog → UnifiedContentItem
 */
export class BlogAdapter {
  static adapt(blog: Blog): UnifiedContentItem {
    return {
      id: `blog-${blog.id}`,
      type: 'blog',
      title: blog.title,
      description: blog.summary,
      date: blog.date,
      imageUrl: blog.coverImage,
      meta: [blog.category],
      actionLink: `#/blog/${blog.slug}`,
    };
  }
}

/**
 * Adapter: ExternalVideoData → UnifiedContentItem
 */
export class VideoAdapter {
  static adapt(video: ExternalVideoData): UnifiedContentItem {
    const views = video.views;
    const isPopular = views > 10000;

    return {
      id: `vid-${video.videoId}`,
      type: 'video',
      title: video.headline,
      description: video.descriptionSnippet,
      date: new Date(video.published_timestamp).toISOString().split('T')[0],
      imageUrl: video.thumbnail_high,
      meta: [`${views} views`, ...video.tags],
      actionLink: `#/video/${video.videoId}`,
      decorations: isPopular ? ['popular', 'hot'] : [],
    };
  }
}

/**
 * Adapter: Article → UnifiedContentItem
 */
export class ArticleAdapter {
  static adapt(article: Article): UnifiedContentItem {
    return {
      id: `art-${article.id}`,
      type: 'article',
      title: article.title,
      description: article.excerpt,
      date: article.publishedAt,
      imageUrl: undefined,
      meta: [...article.tags, `${article.readTime} read`],
      actionLink: `#/article/${article.slug}`,
      isLocked: article.tags.includes('Advanced'),
    };
  }
}

/**
 * Adapter: Doc → UnifiedContentItem
 */
export class DocAdapter {
  static adapt(doc: Doc): UnifiedContentItem {
    return {
      id: `doc-${doc.id}`,
      type: 'doc',
      title: doc.title,
      description: doc.content.substring(0, 100) + '...',
      date: doc.lastUpdated,
      meta: [doc.section],
      actionLink: `#/docs/${doc.slug}`,
    };
  }
}

/**
 * Adapter: PodcastEpisode → UnifiedContentItem
 */
export class PodcastAdapter {
  static adapt(podcast: PodcastEpisode): UnifiedContentItem {
    return {
      id: `pod-${podcast.id}`,
      type: 'podcast',
      title: podcast.title,
      description: podcast.description,
      date: podcast.date,
      meta: [podcast.duration, ...podcast.tags],
      actionLink: `#/podcast/${podcast.id}`,
      decorations: ['new'],
    };
  }
}

// ====================================
// UNIFIED ADAPTER FACTORY
// ====================================

/**
 * Factory to adapt any content type to UnifiedContentItem
 */
export class ContentAdapterFactory {
  static adapt(content: unknown): UnifiedContentItem {
    // Detect content type and apply appropriate adapter
    if (this.isProject(content)) {
      return ProjectAdapter.adapt(content as Project);
    } else if (this.isBlog(content)) {
      return BlogAdapter.adapt(content as Blog);
    } else if (this.isVideo(content)) {
      return VideoAdapter.adapt(content as ExternalVideoData);
    } else if (this.isArticle(content)) {
      return ArticleAdapter.adapt(content as Article);
    } else if (this.isDoc(content)) {
      return DocAdapter.adapt(content as Doc);
    } else if (this.isPodcast(content)) {
      return PodcastAdapter.adapt(content as PodcastEpisode);
    }

    throw new Error(`Unknown content type: ${typeof content}`);
  }

  private static isProject(obj: unknown): obj is Project {
    return typeof obj === 'object' && obj !== null && 'techStack' in obj && 'featured' in obj;
  }

  private static isBlog(obj: unknown): obj is Blog {
    return (
      typeof obj === 'object' &&
      obj !== null &&
      'category' in obj &&
      ('Personal' === (obj as Blog).category ||
        'Lifestyle' === (obj as Blog).category ||
        'DevLog' === (obj as Blog).category)
    );
  }

  private static isVideo(obj: unknown): obj is ExternalVideoData {
    return typeof obj === 'object' && obj !== null && 'videoId' in obj && 'views' in obj;
  }

  private static isArticle(obj: unknown): obj is Article {
    return (
      typeof obj === 'object' &&
      obj !== null &&
      'readTime' in obj &&
      'author' in obj &&
      Array.isArray((obj as Article).tags)
    );
  }

  private static isDoc(obj: unknown): obj is Doc {
    return typeof obj === 'object' && obj !== null && 'section' in obj && 'slug' in obj;
  }

  private static isPodcast(obj: unknown): obj is PodcastEpisode {
    return typeof obj === 'object' && obj !== null && 'duration' in obj && 'episode' in (obj as unknown as Record<string, unknown>);
  }
}

// ====================================
// CONTENT MANAGER - Unified content handling
// ====================================

/**
 * Manages multiple content types with unified interface
 * Real-world usage: Filtering, searching, and sorting all content types together
 */
export class ContentManager {
  private adaptedContent: Map<string, UnifiedContentItem> = new Map();

  /**
   * Register any content type - automatically adapted
   */
  registerContent(content: unknown): string {
    const adapted = ContentAdapterFactory.adapt(content);
    this.adaptedContent.set(adapted.id, adapted);
    return adapted.id;
  }

  /**
   * Get content by ID
   */
  getContent(id: string): UnifiedContentItem | null {
    return this.adaptedContent.get(id) || null;
  }

  /**
   * Filter by content type
   */
  filterByType(type: UnifiedContentItem['type']): UnifiedContentItem[] {
    return Array.from(this.adaptedContent.values()).filter((item) => item.type === type);
  }

  /**
   * Filter by decoration (e.g., 'featured', 'new', 'hot')
   */
  filterByDecoration(decoration: DecorationType): UnifiedContentItem[] {
    return Array.from(this.adaptedContent.values()).filter((item) =>
      item.decorations?.includes(decoration)
    );
  }

  /**
   * Search by title or description
   */
  search(query: string): UnifiedContentItem[] {
    const q = query.toLowerCase();
    return Array.from(this.adaptedContent.values()).filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q)
    );
  }

  /**
   * Sort by date
   */
  sortByDate(order: 'asc' | 'desc' = 'desc'): UnifiedContentItem[] {
    const items = Array.from(this.adaptedContent.values());
    return items.sort((a, b) => {
      const aDate = new Date(a.date).getTime();
      const bDate = new Date(b.date).getTime();
      return order === 'desc' ? bDate - aDate : aDate - bDate;
    });
  }

  /**
   * Get all content
   */
  getAllContent(): UnifiedContentItem[] {
    return Array.from(this.adaptedContent.values());
  }

  /**
   * Get content count
   */
  getCount(): number {
    return this.adaptedContent.size;
  }

  /**
   * Get count by type
   */
  getCountByType(type: UnifiedContentItem['type']): number {
    return this.filterByType(type).length;
  }
}

// ====================================
// DEMO - Real-world usage from app/page.tsx
// ====================================

export function demoAdapterPattern() {
  console.log('\n📌 ADAPTER PATTERN - Real-world Content Management\n');

  // Sample data from app/page.tsx
  const sampleProject: Project = {
    id: '1',
    title: 'E-Commerce Super App',
    description: 'A massive e-commerce ecosystem with user auth, product management, and payment integration.',
    techStack: ['Next.js', 'Supabase', 'Stripe'],
    githubUrl: 'https://github.com/example/ecommerce',
    featured: true,
    date: '2023-08-15',
    thumbnail: '',
  };

  const sampleBlog: Blog = {
    id: 'blog-1',
    title: 'My Journey into Tech',
    slug: 'my-journey',
    summary: 'How I started coding and became a developer.',
    date: '2023-01-20',
    category: 'Personal',
    coverImage: '',
  };

  const sampleVideo: ExternalVideoData = {
    videoId: 'v1',
    headline: 'Building SaaS from Scratch',
    descriptionSnippet: 'Live coding and building a SaaS application in 2 hours.',
    published_timestamp: 1696118400000,
    thumbnail_high: '',
    views: 15000,
    tags: ['SaaS', 'Tutorial'],
  };

  const sampleArticle: Article = {
    id: 'art-1',
    title: 'Advanced TypeScript Patterns',
    slug: 'advanced-typescript',
    excerpt: 'Generic types, Utility types, and how to write cleaner code.',
    content: 'Full content...',
    publishedAt: '2023-11-02',
    tags: ['TypeScript', 'Advanced'],
    readTime: '12 min',
    author: { name: 'Dev Expert', avatar: '' },
  };

  const sampleDoc: Doc = {
    id: 'doc-1',
    title: 'Authentication Guide',
    slug: 'auth',
    section: 'Core Concepts',
    content: 'We use JWT for authentication. Here is how to implement it...',
    lastUpdated: '2024-02-15',
  };

  const samplePodcast: PodcastEpisode = {
    id: 'p1',
    title: 'Ep.1: The Future of Frontend',
    duration: '45:20',
    description: 'Discussing the latest trends in frontend development with industry experts.',
    date: '2023-11-10',
    tags: ['Tech', 'Frontend'],
  };

  // Create content manager
  const manager = new ContentManager();

  // Register all content types
  console.log('📝 Registering content...');
  manager.registerContent(sampleProject);
  manager.registerContent(sampleBlog);
  manager.registerContent(sampleVideo);
  manager.registerContent(sampleArticle);
  manager.registerContent(sampleDoc);
  manager.registerContent(samplePodcast);

  console.log(`✅ Total content registered: ${manager.getCount()}\n`);

  // Show content breakdown by type
  console.log('📊 Content breakdown by type:');
  console.log(`  Projects: ${manager.getCountByType('project')}`);
  console.log(`  Blog posts: ${manager.getCountByType('blog')}`);
  console.log(`  Videos: ${manager.getCountByType('video')}`);
  console.log(`  Articles: ${manager.getCountByType('article')}`);
  console.log(`  Docs: ${manager.getCountByType('doc')}`);
  console.log(`  Podcasts: ${manager.getCountByType('podcast')}\n`);

  // Show filtering by type
  console.log('🔍 Featured content:');
  const featured = manager.filterByDecoration('featured');
  featured.forEach((item) => {
    console.log(`  ✓ [${item.type}] ${item.title}`);
  });

  console.log('\n🆕 New content:');
  const newContent = manager.filterByDecoration('new');
  newContent.forEach((item) => {
    console.log(`  ✓ [${item.type}] ${item.title}`);
  });

  // Show search functionality
  console.log('\n🔎 Search results for "typescript":');
  const searchResults = manager.search('typescript');
  searchResults.forEach((item) => {
    console.log(`  ✓ [${item.type}] ${item.title}`);
  });

  // Show sorting by date
  console.log('\n📅 Content sorted by date (newest first):');
  const sorted = manager.sortByDate('desc');
  sorted.slice(0, 3).forEach((item) => {
    console.log(`  ✓ [${item.type}] ${item.title} - ${item.date}`);
  });

  console.log('\n✨ Benefits of Adapter Pattern:');
  console.log('  ✓ Different content types converted to unified interface');
  console.log('  ✓ Single filter/search logic works for all content');
  console.log('  ✓ Easy to add new content types (just create a new adapter)');
  console.log('  ✓ Consistent display and handling across the application');
}

// ====================================
// COMPONENT ADAPTER PATTERN - For UI Components
// ====================================

/**
 * React-like component interface
 */
export interface ReactComponent {
  componentName: string;
  props: Record<string, unknown>;
  renderElement(): { type: string; children: unknown };
  getMeta?(): { category?: string; responsive?: boolean };
}

/**
 * HTML element interface
 */
export interface HTMLElement {
  tag: string;
  attributes: Record<string, unknown>;
  children: string;
  generate(): string;
}

/**
 * Custom component interface
 */
export interface CustomComponent {
  name: string;
  type: string;
  render(): string;
  getInfo?(): Record<string, unknown>;
}

/**
 * Unified component interface
 */
export interface UnifiedComponent {
  id: string;
  name: string;
  type: 'react-component' | 'html-element' | 'custom-component';
  category?: string;
  responsive?: boolean;
  render(): string;
}

/**
 * Adapter for React components
 */
export class ReactComponentAdapter implements UnifiedComponent {
  id: string;
  name: string;
  type = 'react-component' as const;
  category?: string;
  responsive?: boolean;

  constructor(private component: ReactComponent, id: string) {
    this.id = id;
    this.name = component.componentName;
    const meta = component.getMeta?.();
    this.category = meta?.category;
    this.responsive = meta?.responsive;
  }

  render(): string {
    const element = this.component.renderElement();
    return `<${element.type}>${element.children}</${element.type}>`;
  }
}

/**
 * Adapter for HTML elements
 */
export class HTMLElementAdapter implements UnifiedComponent {
  id: string;
  name: string;
  type = 'html-element' as const;
  category: string;
  responsive?: boolean;

  constructor(private element: HTMLElement, id: string) {
    this.id = id;
    this.name = element.tag.toUpperCase();
    this.category = this.inferCategory(element.tag);
  }

  private inferCategory(tag: string): string {
    const layoutTags = ['div', 'section', 'article', 'aside', 'header', 'footer', 'nav', 'main'];
    return layoutTags.includes(tag.toLowerCase()) ? 'layout' : 'content';
  }

  render(): string {
    return this.element.generate();
  }
}

/**
 * Adapter for custom components
 */
export class CustomComponentAdapter implements UnifiedComponent {
  id: string;
  name: string;
  type = 'custom-component' as const;
  category?: string;
  responsive?: boolean;

  constructor(private component: CustomComponent, id: string) {
    this.id = id;
    this.name = component.name;
    const info = component.getInfo?.();
    this.category = info?.category as string;
    this.responsive = info?.responsive as boolean;
  }

  render(): string {
    return this.component.render();
  }
}

/**
 * Factory to create appropriate adapter
 */
export class ComponentAdapterFactory {
  static createAdapter(component: unknown, id: string): UnifiedComponent {
    if (this.isReactComponent(component)) {
      return new ReactComponentAdapter(component, id);
    } else if (this.isHTMLElement(component)) {
      return new HTMLElementAdapter(component, id);
    } else if (this.isCustomComponent(component)) {
      return new CustomComponentAdapter(component, id);
    }

    throw new Error('Unknown component type');
  }

  private static isReactComponent(obj: unknown): obj is ReactComponent {
    return (
      typeof obj === 'object' &&
      obj !== null &&
      'componentName' in obj &&
      'props' in obj &&
      'renderElement' in obj
    );
  }

  private static isHTMLElement(obj: unknown): obj is HTMLElement {
    return (
      typeof obj === 'object' &&
      obj !== null &&
      'tag' in obj &&
      'attributes' in obj &&
      'generate' in obj
    );
  }

  private static isCustomComponent(obj: unknown): obj is CustomComponent {
    return (
      typeof obj === 'object' &&
      obj !== null &&
      'name' in obj &&
      'type' in obj &&
      'render' in obj
    );
  }
}

/**
 * Component manager with unified interface
 */
export class ComponentManager {
  private components: Map<string, UnifiedComponent> = new Map();
  private idCounter = 0;

  /**
   * Register any component type
   */
  registerComponent(component: unknown): string {
    const id = `comp-${++this.idCounter}`;
    const adapted = ComponentAdapterFactory.createAdapter(component, id);
    this.components.set(id, adapted);
    return id;
  }

  /**
   * Get component info by ID
   */
  getComponentInfo(id: string): {
    name: string;
    type: string;
    category?: string;
    responsive?: boolean;
  } | null {
    const comp = this.components.get(id);
    if (!comp) return null;
    return {
      name: comp.name,
      type: comp.type,
      category: comp.category,
      responsive: comp.responsive,
    };
  }

  /**
   * List all components
   */
  listComponents(): Array<{
    id: string;
    name: string;
    type: string;
    category?: string;
  }> {
    return Array.from(this.components.values()).map((comp) => ({
      id: comp.id,
      name: comp.name,
      type: comp.type,
      category: comp.category,
    }));
  }

  /**
   * Render component by ID
   */
  renderComponent(id: string): string | null {
    const comp = this.components.get(id);
    return comp ? comp.render() : null;
  }

  /**
   * Get count
   */
  getCount(): number {
    return this.components.size;
  }
}
