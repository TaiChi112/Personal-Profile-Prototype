import type { LocaleLabels, ThemeLocaleEntry } from './types';

const TH_LABELS: LocaleLabels = {
  nav: { home: 'หน้าหลัก', feed: 'ฟีดรวม', projects: 'โปรเจกต์', library: 'คลังความรู้', articles: 'บทความ', blog: 'บล็อก', docs: 'เอกสาร', resume: 'เรซูเม่', dashboard: 'สถิติ', podcast: 'พอดแคสต์', contact: 'ติดต่อ' },
  hero: { titlePrefix: 'สร้างสรรค์', titleHighlight: 'อนาคต', description: 'นักพัฒนา Full Stack ผู้หลงใหลในการสร้างแอปพลิเคชันที่ขยายตัวได้จริง', btnProjects: 'ดูผลงาน', btnArticles: 'อ่านบทความ' },
  sections: {
    feed: 'ฟีดรวมเนื้อหา', feedDesc: 'รวมทุกความเคลื่อนไหวไว้ที่เดียว',
    projects: 'โปรเจกต์', projectsDesc: 'โปรเจกต์หลักและโมดูลย่อยที่เกี่ยวข้อง',
    articles: 'บทความเชิงลึก', articlesDesc: 'คลิกเพื่ออ่านหรือดูเนื้อหาที่เกี่ยวข้องเพิ่มเติม',
    blog: 'บล็อกส่วนตัว', blogDesc: 'เรื่องราวหลักและเกร็ดเล็กเกร็ดน้อยที่เกี่ยวข้อง',
    docs: 'เอกสารคู่มือ', docsDesc: 'คู่มือและอ้างอิงในรูปแบบโครงสร้าง',
    resume: 'ประวัติย่อ', experience: 'ประสบการณ์ทำงาน', skills: 'ทักษะ', education: 'การศึกษา', summary: 'สรุปข้อมูล',
    dashboard: 'สถิติเนื้อหา', dashboardDesc: 'ข้อมูลเชิงลึกที่สร้างขึ้นจากการวิเคราะห์โครงสร้าง Tree ด้วย Visitor Pattern',
    podcast: 'รายการพอดแคสต์', podcastDesc: 'ฟังความคิดเห็นล่าสุดเกี่ยวกับเทคโนโลยีและอาชีพ',
    contact: 'ติดต่อเรา', contactDesc: 'ส่งข้อความผ่านระบบ Smart Hub',
  },
  actions: { readMore: 'อ่านต่อ', downloadPdf: 'ดาวน์โหลด PDF', view: 'ดู', expand: 'ดูที่เกี่ยวข้อง', collapse: 'ซ่อน', related: 'เนื้อหาที่เกี่ยวข้อง', search: 'ค้นหาเนื้อหา...', filterBy: 'กรองตาม', undo: 'ยกเลิกคำสั่งล่าสุด', locked: 'เนื้อหาพรีเมียม', unlock: 'ปลดล็อก', sortBy: 'เรียงตาม', tour: 'เริ่มการนำชม', tourNext: 'ถัดไป', tourPrev: 'ย้อนกลับ', tourEnd: 'จบการนำชม', tourPause: 'หยุดชั่วคราว', tourPlay: 'เล่นต่อ', tourSpeed: 'ความเร็ว', snapshotSave: 'บันทึกมุมมอง', snapshotLoad: 'โหลดมุมมอง', snapshotPlaceholder: 'ตั้งชื่อ...', listen: 'รับฟัง', playing: 'กำลังเล่น', submit: 'ส่งข้อความ', exportMd: 'ส่งออก MD', exportJson: 'ส่งออก JSON', adminActions: 'เมนูผู้ดูแลระบบ', cloneTemplate: 'โคลน', switchChannel: 'เปลี่ยนโหมดแจ้งเตือน' },
};

export const TH_LOCALE: ThemeLocaleEntry = {
  code: 'TH',
  labels: TH_LABELS,
};
