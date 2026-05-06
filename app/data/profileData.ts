export const profileData = {
    currectStatus: 'Seeking Software Engineering Internship (Spring 2027)',
    titlePrefix: 'Hi, I\'m Anothai (TaiChi)',
    titleHighlight: 'Architecting Code. Documenting the Journey.',
    description: 'Computer Science Student passionate about System Design and AI. Welcome to my digital garden where I showcase my portfolio and share deep dives into software architecture.',

    avatar: {
        type: 'image' as 'text' | 'image',
        text: 'AD',
        imageUrl: '/TaiChi.JPG',
        position: 'Software Engineer',
        description: 'Building scalable systems & elegant interfaces',
    },

    // 🎯 แก้ไขส่วน buttons เป็น Array เพื่อให้รองรับการสเกล
    buttons: [
        {
            id: 'resume-btn',
            label: 'View Resume',
            target: 'resume',     // ถ้าเป็น tab ภายใน ใส่แค่ชื่อ
            variant: 'primary',
            iconName: 'layout'
        },
        {
            id: 'docs-btn',
            label: 'Read Docs',
            target: '/docs',      // ถ้าต้องการให้โหลดหน้าใหม่ (Hard Navigation) ใส่ / นำหน้า
            variant: 'secondary',
            iconName: 'fileText'
        },
        /* ตัวอย่างการเพิ่มปุ่มลิงก์ออกภายนอกในอนาคต:
        {
            id: 'github-btn',
            label: 'GitHub',
            target: 'https://github.com/TaiChi112', // ขึ้นต้นด้วย http จะเปิดในแท็บใหม่
            variant: 'secondary',
            iconName: 'externalLink'
        }
        */
    ],

    skills: {
        title: 'Core Arsenal',
        data: [
            { name: 'TypeScript', iconName: 'terminal', colorClass: 'text-blue-500' },
            { name: 'Next.js', iconName: 'layout', colorClass: 'text-cyan-500' },
            { name: 'PostgreSQL', iconName: 'database', colorClass: 'text-emerald-500' },
            { name: 'Architecture', iconName: 'architecture', colorClass: 'text-indigo-500' },
        ]
    },

    currentProject: {
        title: 'Universal Academic Portfolio System (UAPS)',
        description: 'An intelligent document processing and portfolio management platform.',
        link: 'https://github.com/TaiChi112/UAPS',
        status: 'Currently Building'
    },
};