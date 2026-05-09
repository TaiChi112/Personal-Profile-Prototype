/**
 * FACTORY METHOD PATTERN - Localization
 * 
 * Purpose: Create UI labels in different languages without hardcoding
 * 
 * Key Classes:
 * - LocalizationFactory (Interface) - defines getLabels() method
 * - EnglishLocalization, ThaiLocalization (Concrete Factories)
 * 
 * Pattern Benefits:
 * - Add new language by creating new factory class
 * - Decouple language logic from components
 * - Easy to switch languages at runtime
 */

// ====================================
// UI Labels Interface
// ====================================
/**
 * All labels that can be localized
 * Organized by sections (nav, hero, actions, etc.)
 */
interface UILabels {
  nav: {
    home: string;
    feed: string;
    projects: string;
    library: string;
    articles: string;
    blog: string;
    docs: string;
    resume: string;
    dashboard: string;
    podcast: string;
    contact: string;
  };
  hero: {
    titlePrefix: string;
    titleHighlight: string;
    description: string;
    btnProjects: string;
    btnArticles: string;
  };
  sections: {
    feed: string;
    feedDesc: string;
    projects: string;
    projectsDesc: string;
    articles: string;
    articlesDesc: string;
    blog: string;
    blogDesc: string;
    docs: string;
    docsDesc: string;
    resume: string;
    experience: string;
    skills: string;
    education: string;
    summary: string;
    dashboard: string;
    dashboardDesc: string;
    podcast: string;
    podcastDesc: string;
    contact: string;
    contactDesc: string;
  };
  actions: {
    readMore: string;
    downloadPdf: string;
    view: string;
    expand: string;
    collapse: string;
    related: string;
    search: string;
    filterBy: string;
    undo: string;
    locked: string;
    unlock: string;
    sortBy: string;
    tour: string;
    tourNext: string;
    tourPrev: string;
    tourEnd: string;
    tourPause: string;
    tourPlay: string;
    tourSpeed: string;
    snapshotSave: string;
    snapshotLoad: string;
    snapshotPlaceholder: string;
    listen: string;
    playing: string;
    submit: string;
    exportMd: string;
    exportJson: string;
    adminActions: string;
    cloneTemplate: string;
    switchChannel: string;
  };
}

// ====================================
// FACTORY METHOD: LocalizationFactory
// ====================================
/**
 * Factory Method Interface
 * Defines how to create UI labels for a specific language
 */
interface LocalizationFactory {
  code: string;
  getLabels(): UILabels;
}

// ====================================
// CONCRETE FACTORY 1: English
// ====================================
/**
 * English localization factory
 * Returns all UI labels in English
 */
const EnglishLocalization: LocalizationFactory = {
  code: 'EN',
  getLabels: () => ({
    nav: {
      home: 'Home',
      feed: 'Feed',
      projects: 'Projects',
      library: 'Library',
      articles: 'Articles',
      blog: 'Blog',
      docs: 'Docs',
      resume: 'Resume',
      dashboard: 'Analytics',
      podcast: 'Podcast',
      contact: 'Contact'
    },
    hero: {
      titlePrefix: 'Building the',
      titleHighlight: 'Future',
      description: 'Software Engineering crafting scalable applications.',
      btnProjects: 'View Projects',
      btnArticles: 'Read Articles'
    },
    sections: {
      feed: 'Unified Feed',
      feedDesc: 'All content in one place.',
      projects: 'Projects',
      projectsDesc: 'Super Projects and their related sub-modules.',
      articles: 'Technical Articles',
      articlesDesc: 'Drill down into topics to see related content.',
      blog: 'Personal Blog',
      blogDesc: 'Main stories and related thoughts.',
      docs: 'Documentation',
      docsDesc: 'Guides and References in a structured view.',
      resume: 'Resume',
      experience: 'Experience',
      skills: 'Skills',
      education: 'Education',
      summary: 'Summary',
      dashboard: 'Content Analytics',
      dashboardDesc: 'Insights generated from the content tree.',
      podcast: 'Tech Talks Podcast',
      podcastDesc: 'Listen to my latest thoughts on technology.',
      contact: 'Get in Touch',
      contactDesc: 'Use the Smart Hub below to send a message.'
    },
    actions: {
      readMore: 'Read more',
      downloadPdf: 'PDF',
      view: 'View',
      expand: 'Show Related',
      collapse: 'Hide Related',
      related: 'Related Items',
      search: 'Search content...',
      filterBy: 'Filter by',
      undo: 'Undo Last Action',
      locked: 'Premium Content',
      unlock: 'Unlock Access',
      sortBy: 'Sort by',
      tour: 'Start Guided Tour',
      tourNext: 'Next Section',
      tourPrev: 'Previous',
      tourEnd: 'End Tour',
      tourPause: 'Pause Tour',
      tourPlay: 'Resume Tour',
      tourSpeed: 'Speed',
      snapshotSave: 'Save View',
      snapshotLoad: 'Load View',
      snapshotPlaceholder: 'Snapshot name...',
      listen: 'Listen',
      playing: 'Now Playing',
      submit: 'Send Message',
      exportMd: 'Export MD',
      exportJson: 'Export JSON',
      adminActions: 'Admin Actions',
      cloneTemplate: 'Clone',
      switchChannel: 'Toggle Notification Mode'
    }
  })
};

// ====================================
// CONCRETE FACTORY 2: Thai
// ====================================
/**
 * Thai localization factory
 * Returns all UI labels in Thai
 */
const ThaiLocalization: LocalizationFactory = {
  code: 'TH',
  getLabels: () => ({
    nav: {
      home: 'หน้าหลัก',
      feed: 'ฟีดรวม',
      projects: 'โปรเจกต์',
      library: 'คลังความรู้',
      articles: 'บทความ',
      blog: 'บล็อก',
      docs: 'เอกสาร',
      resume: 'เรซูเม่',
      dashboard: 'สถิติ',
      podcast: 'พอดแคสต์',
      contact: 'ติดต่อ'
    },
    hero: {
      titlePrefix: 'สร้างสรรค์',
      titleHighlight: 'อนาคต',
      description: 'นักพัฒนา Full Stack ผู้หลงใหลในการสร้างแอปพลิเคชันที่ขยายตัวได้',
      btnProjects: 'ดูผลงาน',
      btnArticles: 'อ่านบทความ'
    },
    sections: {
      feed: 'ฟีดรวมเนื้อหา',
      feedDesc: 'รวมทุกความเคลื่อนไหวไว้ที่เดียว',
      projects: 'โปรเจกต์',
      projectsDesc: 'โปรเจกต์หลักและโมดูลย่อยที่เกี่ยวข้อง',
      articles: 'บทความเชิงลึก',
      articlesDesc: 'คลิกเพื่ออ่านหรือดูเนื้อหาที่เกี่ยวข้องเพิ่มเติม',
      blog: 'บล็อกส่วนตัว',
      blogDesc: 'เรื่องราวหลักและเกร็ดเล็กเกร็ดน้อยที่เกี่ยวข้อง',
      docs: 'เอกสารคู่มือ',
      docsDesc: 'คู่มือและอ้างอิงในรูปแบบโครงสร้าง',
      resume: 'ประวัติย่อ',
      experience: 'ประสบการณ์ทำงาน',
      skills: 'ทักษะ',
      education: 'การศึกษา',
      summary: 'สรุปข้อมูล',
      dashboard: 'สถิติเนื้อหา',
      dashboardDesc: 'ข้อมูลเชิงลึกที่สร้างขึ้นจากการวิเคราะห์เนื้อหา',
      podcast: 'รายการพอดแคสต์',
      podcastDesc: 'ฟังความคิดเห็นล่าสุดเกี่ยวกับเทคโนโลยี',
      contact: 'ติดต่อเรา',
      contactDesc: 'ส่งข้อความผ่านระบบอัจฉริยะ'
    },
    actions: {
      readMore: 'อ่านต่อ',
      downloadPdf: 'ดาวน์โหลด PDF',
      view: 'ดู',
      expand: 'ดูที่เกี่ยวข้อง',
      collapse: 'ซ่อน',
      related: 'เนื้อหาที่เกี่ยวข้อง',
      search: 'ค้นหาเนื้อหา...',
      filterBy: 'กรองตาม',
      undo: 'ยกเลิกคำสั่งล่าสุด',
      locked: 'เนื้อหาพรีเมียม',
      unlock: 'ปลดล็อก',
      sortBy: 'เรียงตาม',
      tour: 'เริ่มการนำชม',
      tourNext: 'ถัดไป',
      tourPrev: 'ย้อนกลับ',
      tourEnd: 'จบการนำชม',
      tourPause: 'หยุดชั่วคราว',
      tourPlay: 'เล่นต่อ',
      tourSpeed: 'ความเร็ว',
      snapshotSave: 'บันทึกมุมมอง',
      snapshotLoad: 'โหลดมุมมอง',
      snapshotPlaceholder: 'ตั้งชื่อ...',
      listen: 'รับฟัง',
      playing: 'กำลังเล่น',
      submit: 'ส่งข้อความ',
      exportMd: 'ส่งออก MD',
      exportJson: 'ส่งออก JSON',
      adminActions: 'เมนูผู้ดูแลระบบ',
      cloneTemplate: 'โคลน',
      switchChannel: 'เปลี่ยนโหมดแจ้งเตือน'
    }
  })
};

// ====================================
// FACTORY REGISTRY
// ====================================
/**
 * All available localization factories
 * Easy to add new languages by adding a new factory here
 */
const LOCALES: Record<string, LocalizationFactory> = {
  'en': EnglishLocalization,
  'th': ThaiLocalization
};

// ====================================
// CLIENT CODE EXAMPLE
// ====================================

/**
 * DEMO: Factory Method pattern for localization
 */
export function demoLocalizationFactories() {
  console.log('=== FACTORY METHOD PATTERN: Localization ===\n');

  // Without Factory Method (bad way):
  // if (lang === 'en') { title = 'Home'; menu = 'Feed'; ... }
  // else if (lang === 'th') { title = 'หน้าหลัก'; menu = 'ฟีดรวม'; ... }
  // ❌ Causes code duplication and is hard to maintain

  // With Factory Method (good way):
  const englishFactory = LOCALES['en'];
  const thaiFactory = LOCALES['th'];

  console.log('--- English Localization ---');
  const enLabels = englishFactory.getLabels();
  console.log(`Home: ${enLabels.nav.home}`);
  console.log(`Feed: ${enLabels.nav.feed}`);
  console.log(`Title: ${enLabels.hero.titleHighlight}`);

  console.log('\n--- Thai Localization ---');
  const thLabels = thaiFactory.getLabels();
  console.log(`Home: ${thLabels.nav.home}`);
  console.log(`Feed: ${thLabels.nav.feed}`);
  console.log(`Title: ${thLabels.hero.titleHighlight}`);

  // Switch language dynamically
  console.log('\n--- Dynamic Language Switching ---');
  const currentLang = 'th';
  const factory = LOCALES[currentLang];
  const labels = factory.getLabels();

  console.log(`Current Language: ${factory.code}`);
  console.log(`Header: ${labels.sections.feed}`);
  console.log(`Description: ${labels.sections.feedDesc}`);

  // Easy to add new language - just create new factory!
  console.log('\n✓ Factory Method: Easy to add new languages\n');
}

// ====================================
// EXPORTS
// ====================================
export {
  type UILabels,
  type LocalizationFactory,
  EnglishLocalization,
  ThaiLocalization,
  LOCALES
};
