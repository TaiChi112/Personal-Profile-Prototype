export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  publishedAt: string;
  tags: string[];
  readTime: string;
  author: {
    name: string;
    avatar: string;
  };
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

export interface Doc {
  id: string;
  title: string;
  slug: string;
  section: string;
  content: string;
  lastUpdated: string;
}

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

export interface Experience {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string[];
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  year: string;
}

export interface ResumeData {
  name: string;
  title: string;
  summary: string;
  skills: string[];
  experience: Experience[];
  education: Education[];
  contact: {
    email: string;
    location: string;
  };
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

export interface PodcastEpisode {
  id: string;
  title: string;
  duration: string;
  description: string;
  date: string;
  tags: string[];
}

export const MOCK_ARTICLES_FLAT: Article[] = [
  {
    id: '1',
    title: 'Understanding React Server Components',
    slug: 'react-server-components',
    excerpt: 'Deep dive into how RSC works under the hood and why it changes everything.',
    content: 'Full content...',
    publishedAt: '2023-10-15',
    tags: ['React', 'Next.js'],
    readTime: '8 min',
    author: { name: 'Dev', avatar: '' },
  },
  {
    id: '2',
    title: 'Advanced TypeScript Patterns',
    slug: 'advanced-typescript',
    excerpt: 'Generic types, Utility types, and how to write cleaner code.',
    content: 'Full content...',
    publishedAt: '2023-11-02',
    tags: ['TypeScript'],
    readTime: '12 min',
    author: { name: 'Dev', avatar: '' },
  },
];

export const MOCK_BLOGS: Blog[] = [
  { id: '1', title: 'My Journey into Tech', slug: 'my-journey', summary: 'How I started coding...', date: '2023-01-20', category: 'Personal' },
  { id: '2', title: 'Why I love Coffee', slug: 'coffee-coding', summary: 'A look at caffeine...', date: '2023-05-10', category: 'Lifestyle' },
];

export const MOCK_PROJECTS: Project[] = [
  { id: '1', title: 'E-Commerce Super App', description: 'A massive e-commerce ecosystem. Includes user authentication, product management, shopping cart, and payment gateway integration.', techStack: ['Next.js', 'Supabase', 'Stripe'], githubUrl: '#', featured: true, date: '2023-08-15', thumbnail: '' },
  { id: '1-1', title: 'Merchant Dashboard', description: 'Admin panel for sellers.', techStack: ['React', 'Tailwind'], githubUrl: '#', featured: false, date: '2023-09-01', thumbnail: '' },
  { id: '1-2', title: 'Mobile Customer App', description: 'React Native app for buyers.', techStack: ['React Native', 'Expo'], githubUrl: '#', featured: false, date: '2023-09-15', thumbnail: '' },
  { id: '2', title: 'AI Chat System', description: 'Chat app leveraging OpenAI API with real-time streaming response and history management.', techStack: ['React', 'Node.js', 'OpenAI'], githubUrl: '#', featured: true, date: '2023-06-10', thumbnail: '' },
  { id: '2-1', title: 'Socket Server', description: 'Real-time message handling.', techStack: ['Node.js', 'Socket.io'], githubUrl: '#', featured: false, date: '2023-06-12', thumbnail: '' },
];

export const MOCK_VIDEOS: ExternalVideoData[] = [
  { videoId: 'v1', headline: 'Building SaaS', descriptionSnippet: 'Live coding...', published_timestamp: 1696118400000, thumbnail_high: '', views: 15000, tags: ['SaaS'] },
];

export const MOCK_PODCASTS: PodcastEpisode[] = [
  { id: 'p1', title: 'Ep.1: The Future of Frontend', duration: '45:20', description: 'Discussing the latest trends in frontend development.', date: '2023-11-10', tags: ['Tech', 'Frontend'] },
  { id: 'p2', title: 'Ep.2: Burnout & Mental Health', duration: '32:15', description: 'How to manage stress as a developer.', date: '2023-11-17', tags: ['Health', 'Career'] },
  { id: 'p3', title: 'Ep.3: Interview with AI', duration: '50:00', description: 'Can AI replace junior developers? We ask ChatGPT.', date: '2023-11-24', tags: ['AI', 'Career'] },
];

export const MOCK_RESUME: ResumeData = {
  name: 'Anothai Vichapaiboon',
  title: 'Software Engineer',
  summary: 'Passionate developer building scalable apps.',
  skills: ['Typescript', 'Nextjs', 'Python', 'Docker', 'PostgreSQL', 'Express.js', 'Elysia'],
  experience: [
    { id: '1', role: 'Volunteer', company: 'Tech Co', period: '2021-Present', description: ['Led migration.', 'Optimized performance.', 'Mentored juniors.'] },
    { id: '2', role: 'Web Dev', company: 'Agency XY', period: '2019-2021', description: ['Built client sites.', 'Implemented UI designs.'] },
  ],
  education: [{ id: '1', degree: 'B.Sc. CS', institution: 'Ramkhamhaeng University', year: '2022-2026' }],
  contact: { email: 'anothai.0978452316@gmail.com', location: 'Bangkok' },
};

export const MOCK_DOCS: Doc[] = [
  { id: '1', title: 'Getting Started', slug: 'start', section: 'Intro', content: 'Welcome to the documentation.', lastUpdated: '2024-01-10' },
  { id: '2', title: 'Authentication', slug: 'auth', section: 'Core Concepts', content: 'We use JWT for authentication.', lastUpdated: '2024-02-15' },
  { id: '3', title: 'Database Schema', slug: 'db', section: 'Core Concepts', content: 'The database consists of 5 main tables.', lastUpdated: '2024-03-01' },
];
