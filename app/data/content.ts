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
  slug?: string;
  category?: string;
  description: string;
  techStack: string[];
  githubUrl?: string;
  repoUrl?: string;
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

// { id: '1-2', title: 'Mobile Customer App', description: 'React Native app for buyers.', techStack: ['React Native', 'Expo'], githubUrl: '#', featured: false, date: '2023-09-15', thumbnail: '' },
// { id: '2', title: 'AI Chat System', description: 'Chat app leveraging OpenAI API with real-time streaming response and history management.', techStack: ['React', 'Node.js', 'OpenAI'], githubUrl: '#', featured: true, date: '2023-06-10', thumbnail: '' },
// { id: '2-1', title: 'Socket Server', description: 'Real-time message handling.', techStack: ['Node.js', 'Socket.io'], githubUrl: '#', featured: false, date: '2023-06-12', thumbnail: '' },
export const MOCK_PROJECTS: Project[] = [
  { id: '1', title: "Personal Website (Design Pattern Playground)", description: "Problem/Motivation: Learning advanced Software Design Patterns often lacks practical, real-world frontend implementation examples. Solution/Benefit: Developed a portfolio website using TypeScript and Next.js, explicitly implementing GoF patterns (Factory, Builder, Visitor) within the architecture. This resulted in a highly maintainable codebase and served as a tangible proof-of-concept for clean code engineering.", techStack: ['Nextjs'], githubUrl: 'https://github.com/TaiChi112/UAPs', featured: true, date: '2023-10-01', thumbnail: '' },
  { id: '2', title: "AI-Powered Manga OCR and Translation Pipeline (HITL)", description: "Problem/Motivation: Translating comics manually is highly inefficient due to the complexity of extracting text from images. Solution/Benefit: Engineered an end-to-end Python pipeline leveraging digital image processing and Optical Character Recognition (OCR). Integrated a Human-in-the-Loop (HITL) workflow to ensure high contextual accuracy and quality control in English-to-Thai translations.", techStack: ['Nextjs'], githubUrl: 'https://github.com/TaiChi112/AI-Powered-Manga-OCR-and-Translation-Pipeline', featured: true, date: '2023-10-01', thumbnail: '' },
  { id: '3', title: "Universal Academic Portfolio System (UAPs)", description: "Problem/Motivation: Using a single, static resume for different roles reduces the chance of matching company-specific requirements.Solution/Benefit: Designed a normalized relational database to securely and flexibly manage skills and experiences. Built a Dynamic Resume generator that outputs tailored documents mapped to specific Job Descriptions, laying the architectural groundwork for future LLM-driven candidate-job matching.", techStack: ['Nextjs'], githubUrl: 'https://github.com/TaiChi112/UAPs', featured: true, date: '2023-10-01', thumbnail: '' },
  { id: '4', title: "Google Calendar AI Agent (MCP)", description: "Problem/Motivation: Manually managing schedules and checking for appointment overlaps is time-consuming and error-prone. Solution/Benefit: Developed a Python-based AI agent utilizing the Model Context Protocol (MCP) to interpret natural language commands. Integrated with the Google Calendar API to automate scheduling and perform real-time overlap detection, significantly reducing manual calendar management.", techStack: ['Nextjs'], githubUrl: 'https://github.com/TaiChi112/Google-Calendar-AI-Agent', featured: true, date: '2023-10-01', thumbnail: '' },
  { id: '5', title: "Project Scaffolding CLI Tool (MVP)", description: "Problem/Motivation: Setting up new software project structures involves repetitive and time-consuming manual configurations. Solution/Benefit: Built a command-line interface (CLI) to automate project bootstrapping (Selection & Contribute features). Engineered a highly flexible architecture designed to support future LLM integration, enabling developers to scaffold custom projects using simple natural language prompts.", techStack: ['Nextjs'], githubUrl: 'https://github.com/TaiChi112/Project-Scaffolding-CLI-Tool', featured: true, date: '2023-10-01', thumbnail: '' },
  { id: '6', title: "AI-Powered Phygital Icebreaker Platform", description: "Problem/Motivation: Networking events often suffer from low engagement and awkward initial interactions. Solution/Benefit: Developed a `Phygital` platform merging physical and online participation. Applied AI to dynamically generate and randomize domain-specific questions (e.g., Computer Science, Data Science), effectively breaking the ice and fostering meaningful professional connections.", techStack: ['Nextjs'], githubUrl: 'https://github.com/TaiChi112/CS-ICEbreaker-HUB', featured: true, date: '2023-10-01', thumbnail: '' },
  { id: '7', title: 'E-Commerce Super App', description: 'A massive e-commerce ecosystem. Includes user authentication, product management, shopping cart, and payment gateway integration.', techStack: ['Next.js', 'Supabase', 'Stripe'], githubUrl: '#', featured: true, date: '2023-08-15', thumbnail: '' },
  { id: '7-1', title: 'Merchant Dashboard', description: 'Admin panel for sellers.', techStack: ['React', 'Tailwind'], githubUrl: '#', featured: true, date: '2023-09-01', thumbnail: '' },
  {
    id: 'mini-app-google-books',
    title: 'Google Books Explorer',
    slug: 'google-books',
    category: 'Web',
    description: 'A hybrid-layout library explorer powered by Google Books API.',
    techStack: ['Next.js', 'API', 'Tailwind', 'Zustand'],
    repoUrl: '/projects/google-books',
    featured: true,
    date: '2024-03-05',
    thumbnail: ''
  },
  {
    id: 'mini-app-github',
    title: 'GitHub Explorer',
    slug: 'github',
    category: 'Web',
    description: 'A multi-layout dashboard for exploring GitHub profiles and repositories.',
    techStack: ['Next.js', 'API', 'Tailwind', 'Recharts'],
    repoUrl: '/projects/github',
    featured: true,
    date: '2024-02-15',
    thumbnail: ''
  },
  { id: 'mini-app-todo', title: 'Todo App', slug: 'todo', category: 'Applications', description: 'A local-first interactive Todo mini-app built into the portfolio.', techStack: ['React', 'Zustand', 'Mini-App'], repoUrl: '/projects/todo', featured: true, date: '2023-11-20', thumbnail: '' },
  {
    id: 'mini-app-crypto',
    title: 'Live Crypto Dashboard',
    slug: 'crypto',
    category: 'Web',
    description: 'A real-time cryptocurrency dashboard tracking live prices.',
    techStack: ['Next.js', 'API', 'Tailwind'],
    repoUrl: '/projects/crypto',
    featured: true,
    date: '2023-12-01',
    thumbnail: ''
  },
  {
    id: 'mini-app-focus-flow',
    title: 'FocusFlow',
    slug: 'focus-flow',
    category: 'Applications',
    description: 'A productivity application designed for deep work.',
    techStack: ['Next.js', 'React', 'Tailwind'],
    repoUrl: '/projects/focus-flow',
    featured: true,
    date: '2024-05-01',
    thumbnail: ''
  },

  { id: 'mini-app-kanban', title: 'Kanban Task Board', slug: 'kanban', category: 'Applications', description: 'A drag-and-drop Kanban board for task management.', techStack: ['Next.js', 'Zustand'], repoUrl: '/projects/kanban', featured: true, date: '2024-06-01', thumbnail: '' },
  { id: 'mini-app-sort-viz', title: 'Sorting Visualizer', slug: 'sort-viz', category: 'Applications', description: 'Interactive visualizations of sorting algorithms.', techStack: ['Next.js', 'Tailwind'], repoUrl: '/projects/sort-viz', featured: true, date: '2024-06-02', thumbnail: '' },
  { id: 'mini-app-noteflow', title: 'NoteFlow Markdown', slug: 'noteflow', category: 'Applications', description: 'A dual-pane markdown editor with local persistence.', techStack: ['Next.js', 'Zustand'], repoUrl: '/projects/noteflow', featured: true, date: '2024-06-03', thumbnail: '' },
  { id: 'mini-app-regex-lab', title: 'Regex Lab', slug: 'regex-lab', category: 'Applications', description: 'A real-time Regular Expression tester and visualizer.', techStack: ['Next.js', 'Regex'], repoUrl: '/projects/regex-lab', featured: true, date: '2024-06-04', thumbnail: '' },
  { id: 'mini-app-glass-dash', title: 'Glassmorphism Dash', slug: 'glass-dash', category: 'Applications', description: 'A beautiful glassmorphism dashboard.', techStack: ['Next.js', 'Tailwind'], repoUrl: '/projects/glass-dash', featured: true, date: '2024-06-05', thumbnail: '' },



  { id: 'mini-app-type-trainer', title: 'Typing Trainer', slug: 'type-trainer', category: 'Applications', description: 'Developer typing speed and accuracy trainer.', techStack: ['Next.js'], repoUrl: '/projects/type-trainer', featured: true, date: '2024-07-01', thumbnail: '' },
  { id: 'mini-app-habit-rpg', title: 'Habit RPG', slug: 'habit-rpg', category: 'Applications', description: 'Level up your life with this gamified habit tracker.', techStack: ['Next.js'], repoUrl: '/projects/habit-rpg', featured: true, date: '2024-07-02', thumbnail: '' },
  { id: 'mini-app-flashcards', title: 'Dev Flashcards', slug: 'flashcards', category: 'Applications', description: 'Spaced repetition memory cards for developers.', techStack: ['Next.js'], repoUrl: '/projects/flashcards', featured: true, date: '2024-07-03', thumbnail: '' },
  { id: 'mini-app-focus-idle', title: 'Focus Idle', slug: 'focus-idle', category: 'Applications', description: 'Pomodoro timer meets idle building game.', techStack: ['Next.js'], repoUrl: '/projects/focus-idle', featured: true, date: '2024-07-04', thumbnail: '' },



  { id: 'mini-app-smart-deal', title: 'SmartDeal Calculator', slug: 'smart-deal', category: 'Applications', description: 'Compare prices and find the best value for money.', techStack: ['Next.js'], repoUrl: '/projects/smart-deal', featured: true, date: '2024-08-01', thumbnail: '' },
  { id: 'mini-app-thai-tax', title: 'ThaiTax Planner', slug: 'thai-tax', category: 'Applications', description: 'Step-by-step Thai income tax calculator.', techStack: ['Next.js'], repoUrl: '/projects/thai-tax', featured: true, date: '2024-08-02', thumbnail: '' },
  { id: 'mini-app-trip-planner', title: 'Trip Planner & Risk', slug: 'trip-planner', category: 'Applications', description: 'Calculate fuel, resting points, and trip risks.', techStack: ['Next.js'], repoUrl: '/projects/trip-planner', featured: true, date: '2024-08-03', thumbnail: '' },
  { id: 'mini-app-finance-flow', title: 'FinanceFlow', slug: 'finance-flow', category: 'Applications', description: 'Minimalist income and expense tracker.', techStack: ['Next.js'], repoUrl: '/projects/finance-flow', featured: true, date: '2024-08-04', thumbnail: '' },
  { id: 'mini-app-bill-splitter', title: 'BillSplitter', slug: 'bill-splitter', category: 'Applications', description: 'Split bills and generate PromptPay QR codes.', techStack: ['Next.js'], repoUrl: '/projects/bill-splitter', featured: true, date: '2024-08-05', thumbnail: '' },
  { id: 'mini-app-sub-auditor', title: 'Subscription Auditor', slug: 'sub-auditor', category: 'Applications', description: 'Manage your monthly subscriptions and find hidden costs.', techStack: ['Next.js'], repoUrl: '/projects/sub-auditor', featured: true, date: '2024-08-06', thumbnail: '' },



  { id: 'mini-app-smart-timetable', title: 'Smart Timetable', slug: 'smart-timetable', category: 'Applications', description: 'Visual weekly schedule planner.', techStack: ['Next.js'], repoUrl: '/projects/smart-timetable', featured: true, date: '2024-09-01', thumbnail: '' },
  { id: 'mini-app-fridge-tracker', title: 'Fridge Expiry Tracker', slug: 'fridge-tracker', category: 'Applications', description: 'Track grocery expiry dates to reduce food waste.', techStack: ['Next.js'], repoUrl: '/projects/fridge-tracker', featured: true, date: '2024-09-02', thumbnail: '' },
  { id: 'mini-app-med-tracker', title: 'Med & Vitamin Tracker', slug: 'med-tracker', category: 'Applications', description: 'Daily checklist for medications and supplements.', techStack: ['Next.js'], repoUrl: '/projects/med-tracker', featured: true, date: '2024-09-03', thumbnail: '' },
  { id: 'mini-app-decision-wheel', title: 'Decision Spinner', slug: 'decision-wheel', category: 'Applications', description: 'Random choice generator for daily decisions.', techStack: ['Next.js'], repoUrl: '/projects/decision-wheel', featured: true, date: '2024-09-04', thumbnail: '' },
  { id: 'mini-app-chore-divider', title: 'Chore Divider', slug: 'chore-divider', category: 'Applications', description: 'Fairly distribute household chores among roommates.', techStack: ['Next.js'], repoUrl: '/projects/chore-divider', featured: true, date: '2024-09-05', thumbnail: '' },



  { id: 'mini-app-sleep-sync', title: 'SleepSync', slug: 'sleep-sync', category: 'Applications', description: 'Calculate optimal sleep cycles to wake up refreshed.', techStack: ['Next.js'], repoUrl: '/projects/sleep-sync', featured: true, date: '2024-09-06', thumbnail: '' },
  { id: 'mini-app-lend-ledger', title: 'LendLedger', slug: 'lend-ledger', category: 'Applications', description: 'Keep track of items and money you lent to friends.', techStack: ['Next.js'], repoUrl: '/projects/lend-ledger', featured: true, date: '2024-09-07', thumbnail: '' },
  { id: 'mini-app-pack-mate', title: 'PackMate', slug: 'pack-mate', category: 'Applications', description: 'Smart travel checklist generator based on trip type.', techStack: ['Next.js'], repoUrl: '/projects/pack-mate', featured: true, date: '2024-09-08', thumbnail: '' },
  { id: 'mini-app-recipe-scaler', title: 'RecipeScaler', slug: 'recipe-scaler', category: 'Applications', description: 'Easily scale recipe ingredients up or down.', techStack: ['Next.js'], repoUrl: '/projects/recipe-scaler', featured: true, date: '2024-09-09', thumbnail: '' },
  { id: 'mini-app-park-pin', title: 'ParkPin', slug: 'park-pin', category: 'Applications', description: 'Never forget where you parked your car in a mall.', techStack: ['Next.js'], repoUrl: '/projects/park-pin', featured: true, date: '2024-09-10', thumbnail: '' },



  { id: 'mini-app-body-metrics', title: 'BodyMetrics', slug: 'body-metrics', category: 'Applications', description: 'Calculate your BMI and BMR easily.', techStack: ['Next.js'], repoUrl: '/projects/body-metrics', featured: true, date: '2024-10-01', thumbnail: '' },
  { id: 'mini-app-tabata-timer', title: 'Tabata Timer', slug: 'tabata-timer', category: 'Applications', description: 'Interval timer for HIIT workouts.', techStack: ['Next.js'], repoUrl: '/projects/tabata-timer', featured: true, date: '2024-10-02', thumbnail: '' },
  { id: 'mini-app-macro-calc', title: 'MacroCalc', slug: 'macro-calc', category: 'Applications', description: 'Calculate calories from Protein, Carbs, and Fat.', techStack: ['Next.js'], repoUrl: '/projects/macro-calc', featured: true, date: '2024-10-03', thumbnail: '' },
  { id: 'mini-app-hydrate', title: 'Hydrate Tracker', slug: 'hydrate', category: 'Applications', description: 'Visually track your daily water intake.', techStack: ['Next.js'], repoUrl: '/projects/hydrate', featured: true, date: '2024-10-04', thumbnail: '' },
  { id: 'mini-app-zen-mood', title: 'ZenMood', slug: 'zen-mood', category: 'Applications', description: 'Simple daily mood and energy tracker.', techStack: ['Next.js'], repoUrl: '/projects/zen-mood', featured: true, date: '2024-10-05', thumbnail: '' },



  { id: 'mini-app-wealth-viz', title: 'WealthViz', slug: 'wealth-viz', category: 'Applications', description: 'Visual Net Worth and Asset Dashboard.', techStack: ['Next.js'], repoUrl: '/projects/wealth-viz', featured: true, date: '2024-11-01', thumbnail: '' },
  { id: 'mini-app-cash-flow', title: 'CashFlow Diagram', slug: 'cash-flow', category: 'Applications', description: 'Visualize where your money goes.', techStack: ['Next.js'], repoUrl: '/projects/cash-flow', featured: true, date: '2024-11-02', thumbnail: '' },
  { id: 'mini-app-time-block', title: 'TimeBlock 24h', slug: 'time-block', category: 'Applications', description: 'Visualize your 24-hour time allocation.', techStack: ['Next.js'], repoUrl: '/projects/time-block', featured: true, date: '2024-11-03', thumbnail: '' },
  { id: 'mini-app-skill-radar', title: 'Skill Radar', slug: 'skill-radar', category: 'Applications', description: 'Spider chart for analyzing personal skills.', techStack: ['Next.js'], repoUrl: '/projects/skill-radar', featured: true, date: '2024-11-04', thumbnail: '' },
  { id: 'mini-app-life-heatmap', title: 'Life Heatmap', slug: 'life-heatmap', category: 'Applications', description: 'GitHub-style 365 days activity tracker.', techStack: ['Next.js'], repoUrl: '/projects/life-heatmap', featured: true, date: '2024-11-05', thumbnail: '' },


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
