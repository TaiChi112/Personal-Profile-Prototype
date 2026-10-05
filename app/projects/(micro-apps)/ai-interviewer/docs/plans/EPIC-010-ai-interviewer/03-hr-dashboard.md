# Phase 3: HR Dashboard & Link Generation

**สถานะ:** Backlog
**ความเชื่อมโยง:** Problem Statement

---
## 1. Milestone Goal
- **ปัญหา (The Problem):** ต้องมีที่ให้ฝ่ายบุคคล (HR) เข้ามาจัดการระบบสัมภาษณ์ และต้องแน่ใจว่าลิงก์ถูกใช้ได้แค่ครั้งเดียว เพื่อป้องกันการทุจริต
- **สิ่งที่อยากได้ (The Solution):** หน้า Dashboard สำหรับผู้ว่าจ้าง เพื่อกดปุ่ม "Generate Interview Link" และหน้ารวมผลคะแนน (Leaderboard) ของผู้สมัครทั้งหมดที่ทดสอบเสร็จแล้ว

## 2. Acceptance Criteria
> *เมื่อ AI ทำงานเสร็จ ต้องสามารถติ๊กถูกทุกข้อนี้ได้*
- [ ] มีหน้า Dashboard (ต้องล็อกอิน) สำหรับ HR
- [ ] Implement a database schema เพื่อเก็บลิงก์ทดสอบ (UUID), สถานะ (Pending/Completed), และคะแนน
- [ ] เมื่อกดปุ่ม Generate ระบบจะสร้างลิงก์ที่ใช้เข้าห้องสัมภาษณ์ได้เพียง 1 ครั้งเท่านั้น
- [ ] เมื่อมีผู้สมัครทดสอบเสร็จ สถานะในตาราง Dashboard จะอัปเดต และ HR สามารถคลิกดู Report คะแนนฉบับเต็มได้

 (AI Technical Proposal & Execution)
> **WARNING สำหรับ AI Agent:** ห้ามลงมือเขียนโค้ดทันที ให้เสนอ Technical Proposal ด้านล่างนี้ให้ผู้ใช้อนุมัติก่อน

**[AI Technical Proposal]**
- **สถาปัตยกรรม & ไลบรารีที่จะใช้:** ...
- **ไฟล์ที่จะสร้าง/แก้ไข:** ...
- **ลำดับการทำงาน (Execution Steps):** ...

---
## 3. Technical Implementation Context
**[Architectural Notes for AI Execution]**
- **Libraries:** Select appropriate tools based on your architecture research.
- **Execution:** Proceed autonomously based on the Agentic Architect Directive established in `00-PROBLEM-STATEMENT.md`. Map your file targets and execute step-by-step.
