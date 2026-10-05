# Phase 2: AI Conversion Logic

**สถานะ:** Backlog
**ความเชื่อมโยง:** Problem Statement

---
## 1. Milestone Goal
- **ปัญหา (The Problem):** หน้าต่าง UI พร้อมแล้ว แต่ยังไม่มีสมอง AI ที่จะช่วยแปลงโค้ดจริงๆ
- **สิ่งที่อยากได้ (The Solution):** ระบบที่รับโค้ดดิบ (Raw Text) จากฝั่งซ้าย ส่งไปประมวลผลผ่าน AI via the chosen LLM integration SDK แล้วดึงเอาเฉพาะโค้ดผลลัพธ์ (ตัดคำพูดทักทายของ AI ทิ้ง) มาแสดงผลที่ฝั่งขวาแบบ Streaming (พิมพ์ทีละตัวอักษร)

## 2. Acceptance Criteria
> *เมื่อ AI ทำงานเสร็จ ต้องสามารถติ๊กถูกทุกข้อนี้ได้*
- [ ] มีการสร้าง API Route `/api/convert-schema` แบบ POST
- [ ] การตั้งค่า System Prompt ชัดเจน บังคับให้ AI "ตอบกลับมาเฉพาะโค้ด Typescript for the target ORM format เท่านั้น ห้ามอธิบาย ห้ามใส่ข้อความทักทาย"
- [ ] รองรับการส่งข้อมูลกลับมายังหน้าบ้านแบบ Streaming
- [ ] หาก AI ตอบกลับมามี Markdown Block (เช่น ```typescript) ต้องมีโค้ดฝั่งหน้าบ้านคอยตัดคำพวกนี้ออกก่อนนำไปโชว์ใน Editor

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
