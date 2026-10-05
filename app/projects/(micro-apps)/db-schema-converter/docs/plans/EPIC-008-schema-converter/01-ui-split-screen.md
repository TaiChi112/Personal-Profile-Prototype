# Phase 1: Split-Screen Code Editor UI

**สถานะ:** Backlog
**ความเชื่อมโยง:** Problem Statement

---
## 1. Milestone Goal
- **ปัญหา (The Problem):** ผู้ใช้ต้องการวางโค้ดเก่าและดูผลลัพธ์โค้ดใหม่พร้อมๆ กัน เพื่อตรวจสอบความถูกต้อง
- **สิ่งที่อยากได้ (The Solution):** หน้าต่างเว็บแบบแบ่งครึ่ง (ซ้าย-ขวา) ด้านซ้ายสำหรับพิมพ์หรือวางโค้ด SQL/Prisma ด้านขวาสำหรับแสดงโค้ด Drizzle ที่แปลงเสร็จแล้ว พร้อมปุ่ม "Copy to Clipboard" เพื่อให้นำไปใช้งานต่อได้ทันที

## 2. Acceptance Criteria
> *เมื่อ AI ทำงานเสร็จ ต้องสามารถติ๊กถูกทุกข้อนี้ได้*
- [ ] สร้างหน้า `/projects/db-schema-converter`
- [ ] มีช่อง Textarea 2 ช่อง แบ่งหน้าจอซ้าย-ขวาอย่างชัดเจน (อาจจะใช้ Editor พื้นฐานที่รองรับ Syntax Highlighting เบื้องต้น)
- [ ] มีปุ่ม "Convert to Drizzle" อยู่ตรงกลาง
- [ ] มีปุ่ม "Copy" ที่ฝั่งผลลัพธ์ (ด้านขวา)
- [ ] รองรับ Responsive Design (เมื่อเปิดบนมือถือ หน้าจอซ้ายขวาจะเปลี่ยนเป็นเรียงบนล่าง)

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
