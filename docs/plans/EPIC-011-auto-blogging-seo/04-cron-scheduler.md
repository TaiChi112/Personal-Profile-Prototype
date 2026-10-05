# Phase 4: CRON Scheduler

**สถานะ:** Backlog
**ความเชื่อมโยง:** Problem Statement 2 (Master Plan)

---
## 1. Milestone Goal
- **ปัญหา (The Problem):** ถ้าต้องมากดรันสคริปต์เองทุกวัน ก็ไม่ต่างอะไรกับการต้องมานั่งเขียนบล็อกเอง (ไม่เป็นระบบอัตโนมัติ 100%)
- **สิ่งที่อยากได้ (The Solution):** การเชื่อมต่อสคริปต์ทั้งหมด (Phase 1 ถึง 3) เข้าด้วยกัน แล้วนำไปรันบนระบบตั้งเวลา (CRON Job) เช่น ให้ทำงานอัตโนมัติทุกๆ เช้าวันจันทร์เวลา 8:00 น.

## 2. Acceptance Criteria
> *เมื่อ AI ทำงานเสร็จ ต้องสามารถติ๊กถูกทุกข้อนี้ได้*
- [ ] มีไฟล์สคริปต์หลัก (เช่น `scripts/run-auto-blog.ts`) ที่รวมโค้ดทุกส่วนเข้าด้วยกันอย่างสมบูรณ์
- [ ] สคริปต์ถูกอัปโหลดขึ้น GitHub Actions หรือนำไปผูกกับระบบ Cron Job ของแพลตฟอร์ม (using a reliable scheduler/cron system)
- [ ] มีการตั้งค่าตารางเวลาทำงานที่ชัดเจน (เช่น `0 8 * * 1` สำหรับทุกวันจันทร์)
- [ ] หากกระบวนการล้มเหลว (เช่น API ของ GitHub ล่ม) จะต้องไม่มีการเปิด PR ขยะ หรือทำให้ระบบพัง

---
## 3. พื้นที่สำหรับ AI (AI Technical Proposal & Execution)
## 3. Technical Implementation Context
**[Architectural Notes for AI Execution]**
- **Libraries:** Select appropriate API and SDK tools based on your architecture research.
- **Execution:** Proceed autonomously based on the Agentic Architect Directive established in `00-PROBLEM-STATEMENT.md`. Map your file targets and execute step-by-step.
