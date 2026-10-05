# Phase 2: AI Curriculum Engine

**สถานะ:** Backlog
**ความเชื่อมโยง:** Problem Statement

---
## 1. Milestone Goal
- **ปัญหา (The Problem):** ข้อความ Transcript ที่ได้มาจาก YouTube มักจะติดกันเป็นพรืด ไม่มีเว้นวรรค ไม่มีหัวข้อ อ่านยากมาก
- **สิ่งที่อยากได้ (The Solution):** นำ Transcript ไปให้ AI ช่วยย่อย และจัดระเบียบใหม่เป็น "บทเรียน (Modules)" ที่มีหัวข้อชัดเจน พร้อมกับดึงประเด็นสำคัญมาทำเป็นคำถามและคำตอบ (Flashcards) สั้นๆ เพื่อใช้ทดสอบความเข้าใจ

## 2. Acceptance Criteria
> *เมื่อ AI ทำงานเสร็จ ต้องสามารถติ๊กถูกทุกข้อนี้ได้*
- [ ] มี API Route `/api/generate-course`
- [ ] Instruct the chosen LLM integration SDK utilizing structured output generation เพื่อบังคับให้ LLM ตอบกลับมาเป็น JSON
- [ ] The structured data schema must comprise `title`, `modules` (Array ของบทเรียนที่มีชื่อบทและสรุปเนื้อหา), และ `flashcards` (Array ของ `{ question: string, answer: string }`)
- [ ] System Prompt ต้องสั่งให้ AI ย่อยเนื้อหาให้เป็นภาษาที่เข้าใจง่าย เป็นมิตรกับผู้เรียน

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
