export interface InternshipProject {
  id: string;
  title: string;
  description: string[];
}

export interface ResumeWorkExperience {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string[];
}

export interface ResumeEducation {
  id: string;
  degree: string;
  institution: string;
  year: string;
  details: string[];
}

export interface ResumeSkillGroup {
  id: string;
  title: string;
  items: string[];
}

export interface ResumeSectionVisibility {
  summary?: boolean;
  experience?: boolean;
  education?: boolean;
  projects?: boolean;
  skills?: boolean;
  additionalInformation?: boolean;
}

export interface AtsExportProfile {
  summaryMaxWords: number;
  maxProjects: number;
  maxBulletsPerProject: number;
  includeExperience: boolean;
}

export interface InternshipResumeData {
  name: string;
  title: string;
  summary: string;
  contact: {
    phone: string;
    email: string;
    location: string;
    linkedin: string;
    github: string;
    portfolio: string;
  };
  education: ResumeEducation[];
  skillGroups: ResumeSkillGroup[];
  experience?: ResumeWorkExperience[];
  sectionVisibility?: ResumeSectionVisibility;
  atsExportProfile: AtsExportProfile;
  keyProjects: InternshipProject[];
  additionalInformation: string[];
}

export const INTERNSHIP_RESUME: InternshipResumeData = {
  name: 'Anothai Vichapaiboon',
  title: 'Software Engineer Intern / Agentic Software Engineer Intern',
  summary:
    'Computer Science student passionate about combining AI technologies with systematic software development. Strong in TypeScript and Python, with a core strength in AI-assisted development that uses LLMs as tools to accelerate delivery under my own engineering judgment and control. Deeply interested in AI Agent Orchestration, System Design, and Software Architecture. Seeking internship opportunities to build practical software solutions that solve real-world problems.',
  skillGroups: [
    { id: 'languages', title: 'Programming Languages', items: ['TypeScript (primary)', 'Python', 'C++', 'Go', 'Rust'] },
    { id: 'frameworks', title: 'Frameworks and ORM', items: ['Next.js', 'Express.js', 'Elysia', 'Prisma'] },
    { id: 'databases', title: 'Databases', items: ['PostgreSQL', 'MySQL', 'MongoDB'] },
    { id: 'tools', title: 'Tools and Infrastructure', items: ['Docker', 'Git/GitHub', 'GitHub Actions', 'Model Context Protocol (MCP)'] },
    { id: 'ai', title: 'AI and Prompt Engineering', items: ['GitHub Copilot CLI', 'Gemini CLI', 'Claude', 'NotebookLM'] },
    { id: 'concepts', title: 'Core Concepts', items: ['Design Patterns(GoF)', 'SOLID Principles', 'SDLC'] },
    { id: 'soft', title: 'Working Style & Soft Skills', items: ['Design-First Approach', 'Strategic Problem Solving', 'Adaptability', 'Technical Communication'] },
  ],
  sectionVisibility: {
    summary: true,
    education: true,
    projects: true,
    skills: true,
    additionalInformation: true,
    experience: false,
  },
  atsExportProfile: {
    summaryMaxWords: 70,
    maxProjects: 5,
    maxBulletsPerProject: 2,
    includeExperience: false,
  },
  experience: [],
  education: [
    {
      id: 'ru-cs',
      degree: 'Computer Science',
      institution: 'Ramkhamhaeng University, Faculty of Science',
      year: 'Expected Graduation: 2027',
      details: [
        'Relevant Coursework: Software Engineering, Algorithm Design and Analysis, System Analysis and Design, Data Mining, Database, Design Pattern',
      ],
    },
  ],
  keyProjects: [
    {
      id: 'uaps',
      title: 'Universal Academic Portfolio System (UAPs)',
      description: [
        'Designed a relational database architecture using normalization to store skill and experience data with flexibility',
        'Built a Dynamic Resume system that can generate documents tailored to each company\'s Job Description and target role',
      ],
    },
    {
      id: 'calendar-agent',
      title: 'Google Calendar AI Agent (MCP)',
      description: [
        'Developed a Python AI agent using Model Context Protocol (MCP) to connect with and interact with external tools',
      ],
    },
    {
      id: 'scaffolding-cli',
      title: 'Project Scaffolding CLI Tool (MVP)',
      description: [
        'Built a command-line interface tool to reduce initial software project setup time, covering Selection and Contribute features',
      ],
    },
    {
      id: 'ocr-pipeline',
      title: 'AI-Powered Manga OCR and Translation Pipeline (HITL)',
      description: [
        'Developed an end-to-end Python pipeline for translating manga and comics from English to Thai',
      ],
    },
    {
      id: 'personal-website',
      title: 'Personal Website (Design Pattern Playground)',
      description: [
        'Built a personal portfolio website with TypeScript and Next.js as a place to showcase work and experiment with engineering ideas',
      ],
    },
    {
      id: 'phygital-platform',
      title: 'AI-Powered Phygital Icebreaker Platform',
      description: [
        'Developed a platform that combines real-world and online participation in a phygital format',
      ],
    },
  ],
  additionalInformation: ['Language Proficiency: Thai (Native), English (Intermediate)'],
  contact: {
    phone: '+66 96 910 7926',
    email: 'anothai.0978452316@gmail.com',
    location: 'Bangkok, Thailand',
    linkedin: 'linkedin.com/in/anothai-vichapaiboon-a88790260',
    github: 'github.com/TaiChi112',
    portfolio: 'personal-profile-prototype.vercel.app',
  },
};
