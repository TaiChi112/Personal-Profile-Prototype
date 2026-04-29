export interface InternshipProject {
  id: string;
  title: string;
  repoUrl?: string;
  description: string[];
  timeline?: {
    start: string;
    status?: TimelineStatus;
  };
}

export type TimelineStatus =
  | "present"
  | "scale"
  | "refactor"
  | "maintenance"
  | "archive";

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

export type ResumeLanguage = "en" | "th";

export const INTERNSHIP_RESUME_EN: InternshipResumeData = {
  name: "Anothai Vichapaiboon",
  title: "Software Engineer Intern / Agentic Software Engineer Intern",
  summary:
    "Computer Science student passionate about combining AI technologies with systematic software development. Strong in TypeScript and Python, with a core strength in AI-assisted development that uses LLMs as tools to accelerate delivery under my own engineering judgment and control. Deeply interested in AI Agent Orchestration, System Design, and Software Architecture. Seeking internship opportunities to build practical software solutions that solve real-world problems.",
  skillGroups: [
    {
      id: "languages",
      title: "Languages",
      items: ["TypeScript (Primary)", "Python", "C++", "Go"],
    },
    {
      id: "frameworks-tools",
      title: "Frameworks & Tools",
      items: ["Next.js", "Express.js", "Elysia", "Prisma", "FastAPI", "Docker"],
    },
    {
      id: "databases",
      title: "Databases",
      items: ["PostgreSQL", "MySQL", "MongoDB"],
    },
    {
      id: "other",
      title: "Other",
      items: [
        "Model Context Protocol (MCP)",
        "Git",
        "GitHub",
        "GitHub Copilot",
        "GitHub Copilot CLI",
        "GitHub Action",
        "Gemini CLI",
        "Claude",
        "Design Patterns(GoF)",
        "SOLID",
        "SDLC",
      ],
    },
    {
      id: "soft-skills",
      title: "Working Style & Soft Skills",
      items: [
        "Design-First Approach",
        "Strategic Problem Solving",
        "Adaptability",
        "Technical Communication",
      ],
    },
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
      id: "ru-cs",
      degree: "Computer Science",
      institution: "Ramkhamhaeng University, Faculty of Science",
      year: "Expected Graduation: 2027",
      details: [
        "Relevant Coursework: Software Engineering, Algorithm Design and Analysis, System Analysis and Design, Data Mining, Database, Design Pattern",
      ],
    },
  ],
  keyProjects: [
    {
      id: "personal-website",
      title: "Personal Website (Design Pattern Playground)",
      repoUrl: "https://github.com/TaiChi112/personal-profile-prototype",
      description: [
        "Problem/Motivation: Learning advanced Software Design Patterns often lacks practical, real-world frontend implementation examples.",
        "Solution/Benefit: Developed a portfolio website using TypeScript and Next.js, explicitly implementing GoF patterns (Factory, Builder, Visitor) within the architecture. This resulted in a highly maintainable codebase and served as a tangible proof-of-concept for clean code engineering.",
      ],
      timeline: {
        start: "18/01/2026",
        status: "refactor",
      },
    },
    {
      id: "ocr-pipeline",
      title: "AI-Powered Manga OCR and Translation Pipeline (HITL)",
      repoUrl: "https://github.com/TaiChi112/Converter-Mange-OCR",
      description: [
        "Problem/Motivation: Translating comics manually is highly inefficient due to the complexity of extracting text from images.",
        "Solution/Benefit: Engineered an end-to-end Python pipeline leveraging digital image processing and Optical Character Recognition (OCR). Integrated a Human-in-the-Loop (HITL) workflow to ensure high contextual accuracy and quality control in English-to-Thai translations.",
      ],
      timeline: {
        start: "24/02/2026",
        status: "scale",
      },
    },
    {
      id: "uaps",
      title: "Universal Academic Portfolio System (UAPs)",
      repoUrl: "https://github.com/TaiChi112/UAPs",
      description: [
        "Problem/Motivation: Using a single, static resume for different roles reduces the chance of matching company-specific requirements.",
        "Solution/Benefit: Designed a normalized relational database to securely and flexibly manage skills and experiences. Built a Dynamic Resume generator that outputs tailored documents mapped to specific Job Descriptions, laying the architectural groundwork for future LLM-driven candidate-job matching.",
      ],
      timeline: {
        start: "29/03/2026",
        status: "refactor",
      },
    },
    {
      id: "calendar-agent",
      title: "Google Calendar AI Agent (MCP)",
      repoUrl: "https://github.com/TaiChi112/SDLC_HUB_PROTOTYPE",
      description: [
        "Problem/Motivation: Manually managing schedules and checking for appointment overlaps is time-consuming and error-prone.",
        "Solution/Benefit: Developed a Python-based AI agent utilizing the Model Context Protocol (MCP) to interpret natural language commands. Integrated with the Google Calendar API to automate scheduling and perform real-time overlap detection, significantly reducing manual calendar management.",
      ],
      timeline: {
        start: "27/01/2026",
        status: "refactor",
      },
    },
    {
      id: "scaffolding-cli",
      title: "Project Scaffolding CLI Tool (MVP)",
      repoUrl: "https://github.com/TaiChi112/Project-Scaffolding-CLI-Tool",
      description: [
        "Problem/Motivation: Setting up new software project structures involves repetitive and time-consuming manual configurations.",
        "Solution/Benefit: Built a command-line interface (CLI) to automate project bootstrapping (Selection & Contribute features). Engineered a highly flexible architecture designed to support future LLM integration, enabling developers to scaffold custom projects using simple natural language prompts.",
      ],
      timeline: {
        start: "12/04/2026",
        status: "refactor",
      },
    },

    {
      id: "phygital-platform",
      title: "AI-Powered Phygital Icebreaker Platform",
      repoUrl: "https://github.com/TaiChi112/CS-ICEbreaker-HUB",
      description: [
        "Problem/Motivation: Networking events often suffer from low engagement and awkward initial interactions.",
        'Solution/Benefit: Developed a "Phygital" platform merging physical and online participation. Applied AI to dynamically generate and randomize domain-specific questions (e.g., Computer Science, Data Science), effectively breaking the ice and fostering meaningful professional connections.',
      ],
      timeline: {
        start: "23/03/2026",
        status: "refactor",
      },
    },
  ],
  additionalInformation: [
    "Language Proficiency: Thai (Native), English (Intermediate)",
  ],
  contact: {
    phone: "+66 96 910 7926",
    email: "anothai.0978452316@gmail.com",
    location: "Bangkok, Thailand",
    linkedin: "linkedin.com/in/anothai-vichapaiboon-a88790260",
    github: "github.com/TaiChi112",
    portfolio: "taichi112.works",
  },
};

export const INTERNSHIP_RESUME_TH: InternshipResumeData = {
  name: "อโณทัย วิชาไพบูลย์",
  title: "นักศึกษาฝึกงาน Software Engineer / Agentic Software Engineer",
  summary:
    "นักศึกษาวิทยาการคอมพิวเตอร์ที่สนใจการนำ AI มาประยุกต์กับการพัฒนาซอฟต์แวร์อย่างเป็นระบบ ถนัด TypeScript และ Python โดยมีจุดแข็งด้านการใช้ LLM เป็นเครื่องมือช่วยเพิ่มความเร็วในการพัฒนา ภายใต้การตัดสินใจเชิงวิศวกรรมของตนเอง สนใจงานด้าน AI Agent, การออกแบบระบบ (System Design) และสถาปัตยกรรมซอฟต์แวร์ (Software Architecture) และกำลังมองหาโอกาสฝึกงานเพื่อสร้างซอฟต์แวร์ที่แก้ปัญหาได้จริง",
  skillGroups: [
    {
      id: "languages",
      title: "ภาษาโปรแกรม",
      items: ["TypeScript (Primary)", "Python", "C++", "Go"],
    },
    {
      id: "frameworks-tools",
      title: "เฟรมเวิร์กและเครื่องมือ",
      items: ["Next.js", "Express.js", "Elysia", "Prisma", "FastAPI", "Docker"],
    },
    {
      id: "databases",
      title: "ฐานข้อมูล",
      items: ["PostgreSQL", "MySQL", "MongoDB", "SQL", "NoSQL"],
    },
    {
      id: "other",
      title: "อื่นๆ",
      items: [
        "Model Context Protocol (MCP)",
        "Git",
        "GitHub",
        "GitHub Copilot",
        "Gemini",
        "Claude",
        "GoF Design Patterns",
        "SOLID",
        "SDLC",
      ],
    },
    {
      id: "soft-skills",
      title: "รูปแบบการทำงานและทักษะการสื่อสาร",
      items: [
        "Design-First Approach",
        "Strategic Problem Solving",
        "Adaptability",
        "Technical Communication",
      ],
    },
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
      id: "ru-cs",
      degree: "วิทยาการคอมพิวเตอร์",
      institution: "มหาวิทยาลัยรามคำแหง คณะวิทยาศาสตร์",
      year: "คาดว่าจะสำเร็จการศึกษา: 2027",
      details: [
        "รายวิชาที่เกี่ยวข้อง: Software Engineering, Algorithm Design and Analysis, System Analysis and Design, Data Mining, Database, Design Pattern",
      ],
    },
  ],
  keyProjects: [
    {
      id: "uaps",
      title: "Universal Academic Portfolio System (UAPs)",
      repoUrl: "https://github.com/TaiChi112",
      description: [
        "ปัญหา/แรงจูงใจ: การใช้ resume ฉบับเดียวสมัครทุกตำแหน่ง ทำให้โอกาสตรงกับความต้องการของแต่ละบริษัทลดลง",
        "แนวทางแก้/ประโยชน์: design relational database normalized เพื่อจัดการทักษะและประสบการณ์อย่างปลอดภัยและยืดหยุ่น พร้อมพัฒนา Dynamic Resume generator ให้สร้างเอกสารตาม Job Description และวางโครงไว้สำหรับ candidate-job matching ด้วย LLM ในอนาคต",
      ],
      timeline: {
        start: "2024-06",
        status: "present",
      },
    },
    {
      id: "calendar-agent",
      title: "Google Calendar AI Agent (MCP)",
      repoUrl: "https://github.com/TaiChi112",
      description: [
        "ปัญหา/แรงจูงใจ: การจัดตารางงานและตรวจสอบเวลาซ้อนด้วยมือใช้เวลามากและผิดพลาดได้ง่าย",
        "แนวทางแก้/ประโยชน์: พัฒนา AI Agent ด้วย Python และ Model Context Protocol (MCP) เพื่อแปลคำสั่งภาษาธรรมชาติ เชื่อมต่อ Google Calendar API เพื่อจัดตารางอัตโนมัติและตรวจสอบเวลาซ้อนแบบเรียลไทม์ ลดภาระงานที่ต้องทำด้วยมืออย่างมีนัยสำคัญ",
      ],
      timeline: {
        start: "2024-12",
        status: "present",
      },
    },
    {
      id: "scaffolding-cli",
      title: "Project Scaffolding CLI Tool (MVP)",
      repoUrl: "https://github.com/TaiChi112",
      description: [
        "ปัญหา/แรงจูงใจ: การเริ่มโปรเจกต์ใหม่ต้องตั้งค่าโครงสร้างซ้ำๆ ซึ่งใช้เวลาและเกิดความไม่สม่ำเสมอ",
        "แนวทางแก้/ประโยชน์: สร้างเครื่องมือ CLI สำหรับตั้งต้นโครงโปรเจกต์ (Selection & Contribute) พร้อมออกแบบสถาปัตยกรรมให้ยืดหยุ่นต่อการต่อยอด LLM ในอนาคต เพื่อสร้างโปรเจกต์จากคำสั่งภาษาธรรมชาติได้",
      ],
      timeline: {
        start: "2024-05",
        status: "present",
      },
    },
    {
      id: "ocr-pipeline",
      title: "AI-Powered Manga OCR and Translation Pipeline (HITL)",
      repoUrl: "https://github.com/TaiChi112",
      description: [
        "ปัญหา/แรงจูงใจ: การแปลคอมิกด้วยมือไม่มีประสิทธิภาพ เพราะการดึงข้อความจากภาพมีความซับซ้อนสูง",
        "แนวทางแก้/ประโยชน์: ออกแบบ pipeline แบบ end-to-end ด้วย Python โดยใช้ image processing และ OCR พร้อม Human-in-the-Loop (HITL) เพื่อคงความถูกต้องเชิงบริบทและควบคุมคุณภาพงานแปล English-Thai",
      ],
      timeline: {
        start: "2024-08",
        status: "present",
      },
    },
    {
      id: "personal-website",
      title: "Personal Website (Design Pattern Playground)",
      repoUrl: "https://github.com/TaiChi112/personal-profile-prototype",
      description: [
        "ปัญหา/แรงจูงใจ: การเรียน Design Pattern ขั้นสูงมักขาดตัวอย่างที่นำไปใช้จริงในงาน frontend",
        "แนวทางแก้/ประโยชน์: พัฒนาเว็บไซต์พอร์ตโฟลิโอด้วย TypeScript และ Next.js โดยประยุกต์ GoF patterns (Factory, Builder, Visitor) ในสถาปัตยกรรมจริง ทำให้โค้ดดูแลง่ายขึ้น และใช้เป็นหลักฐานเชิงปฏิบัติของการพัฒนาแบบมีโครงสร้าง",
      ],
      timeline: {
        start: "2024-10",
        status: "present",
      },
    },
    {
      id: "phygital-platform",
      title: "AI-Powered Phygital Icebreaker Platform",
      repoUrl: "https://github.com/TaiChi112",
      description: [
        "ปัญหา/แรงจูงใจ: งาน networking มักมีการมีส่วนร่วมน้อยและบรรยากาศเกร็งในช่วงเริ่มต้นสนทนา",
        "แนวทางแก้/ประโยชน์: พัฒนาแพลตฟอร์มแบบ Phygital ที่เชื่อมการเข้าร่วมทั้งออฟไลน์และออนไลน์ ใช้ AI สุ่มและสร้างคำถามตามโดเมน (เช่น Computer Science, Data Science) เพื่อช่วยละลายพฤติกรรมและกระตุ้นบทสนทนาที่มีคุณภาพมากขึ้น",
      ],
      timeline: {
        start: "2024-09",
        status: "present",
      },
    },
  ],
  additionalInformation: [
    "ความสามารถด้านภาษา: Thai (Native), English (Intermediate)",
  ],
  contact: {
    phone: "+66 96 910 7926",
    email: "anothai.0978452316@gmail.com",
    location: "กรุงเทพมหานคร, ประเทศไทย",
    linkedin: "linkedin.com/in/anothai-vichapaiboon-a88790260",
    github: "github.com/TaiChi112",
    portfolio: "personal-profile-prototype.vercel.app",
  },
};

export const INTERNSHIP_RESUMES: Record<ResumeLanguage, InternshipResumeData> =
  {
    en: INTERNSHIP_RESUME_EN,
    th: INTERNSHIP_RESUME_TH,
  };

export function getInternshipResume(
  language: ResumeLanguage,
): InternshipResumeData {
  return INTERNSHIP_RESUMES[language] ?? INTERNSHIP_RESUME_EN;
}

export const INTERNSHIP_RESUME = INTERNSHIP_RESUME_EN;
