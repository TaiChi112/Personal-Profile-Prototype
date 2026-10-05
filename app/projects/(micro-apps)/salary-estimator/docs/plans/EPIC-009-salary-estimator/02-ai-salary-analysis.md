# Phase 2: AI Salary Analysis Logic

**สถานะ:** Backlog
**ความเชื่อมโยง:** Problem Statement

---
## 1. Milestone Goal
- **ปัญหา (The Problem):** ถ้าแค่เอาตัวเลขมาบวกกันแบบตายตัว มันจะไม่ฉลาดและไม่น่าเชื่อถือ
- **สิ่งที่อยากได้ (The Solution):** ส่งข้อมูลผู้ใช้ไปให้ LLM วิเคราะห์โครงสร้างทักษะ (Tech Stack) เพื่อหาระดับความเชี่ยวชาญ และประเมินช่วงเงินเดือนตลาด (Market Rate) ออกมาเป็นโครงสร้าง JSON พร้อมคำแนะนำ (Roadmap) ว่าถ้าอยากได้เงินเดือนเพิ่มขึ้น ต้องไปเรียนอะไรต่อ

## 2. Acceptance Criteria
> *เมื่อ AI ทำงานเสร็จ ต้องสามารถติ๊กถูกทุกข้อนี้ได้*
- [ ] มี API Route `/api/estimate-salary` แบบ POST 
- [ ] Utilize a structured data generation LLM SDK bound to a defined schema ที่มีโครงสร้างเงินเดือน (ต่ำสุด, สูงสุด, ค่าเฉลี่ย) และข้อเสนอแนะ 3 ข้อ
- [ ] AI ต้องตอบข้อมูลกลับมาได้ภายในระยะเวลาที่กำหนด (ไม่เกิน 10 วินาที)
- [ ] มีการซ่อน Prompt อย่างปลอดภัยใน Backend ไม่ส่ง Prompt เปลือยๆ ออกหน้าบ้าน

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
