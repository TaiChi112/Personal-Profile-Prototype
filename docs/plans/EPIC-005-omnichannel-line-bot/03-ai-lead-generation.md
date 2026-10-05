# Phase 3: Conversational AI & Lead Capture

**สถานะ:** Backlog
**ความเชื่อมโยง:** Milestone 3 (Master Plan)

---
## 1. มุมมองผู้ใช้งาน (User Story & Problem)
- **ปัญหา (The Problem):** AI เก่งแค่การตอบคำถามประวัติ แต่ไม่ได้ทำหน้าที่ "เซลส์" เพื่อปิดการขายหรือเก็บช่องทางติดต่อ (Lead)
- **สิ่งที่อยากได้ (The Solution):** ต้องการจูน System Prompt ให้ AI ทำหน้าที่เป็นเลขาฝ่ายขาย (Lead Generation) หากเห็นว่าลูกค้าน่าจะสนใจจ้างงาน ให้บอทสอบถามชื่อ บริษัท และอีเมลอย่างแนบเนียน และเมื่อได้ข้อมูลครบ ให้ใช้ Function Calling สั่งบันทึกข้อมูลลง Database ทันที

## 2. เกณฑ์การตรวจรับงาน (Acceptance Criteria)
> *เมื่อ AI ทำงานเสร็จ ต้องสามารถติ๊กถูกทุกข้อนี้ได้*
- [ ] มีตาราง `Lead` ใน Prisma ประกอบด้วยฟิลด์ `name`, `company`, `email`, `requirements` และ `ownerUserId`
- [ ] มีการใช้งาน AI Function Calling (Vercel AI SDK Tools) ชื่อ `save_lead_info`
- [ ] เมื่อพิมพ์คุยใน LINE แล้วให้ข้อมูลอีเมล บอทจะเรียก Function เพื่อเซฟลงฐานข้อมูลโดยอัตโนมัติ
- [ ] ข้อมูล Vector ดึงมาจาก `ownerUserId` ที่ผูกไว้ใน Phase 2 อย่างถูกต้อง

---
## 3. พื้นที่สำหรับ AI (AI Technical Proposal & Execution)
