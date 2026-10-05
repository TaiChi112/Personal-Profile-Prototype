# Phase 1: AI Mermaid Generator

**สถานะ:** Backlog
**ความเชื่อมโยง:** Problem Statement

---
## 1. Milestone Goal
- **ปัญหา (The Problem):** ไวยากรณ์ (Syntax) ของ Mermaid เขียนยากและจำยาก โดยเฉพาะเรื่องทิศทางลูกศรและการจัดกลุ่ม (Subgraphs)
- **สิ่งที่อยากได้ (The Solution):** พิมพ์คำสั่งบ้านๆ เช่น "ขอผังระบบ E-commerce ที่มี Frontend, Backend API, และแยก Database ออกเป็น Read/Write" แล้ว AI เข้าใจบริบท พร้อมแปลงเป็นโค้ดสคริปต์ Mermaid ที่สมบูรณ์แบบ ไม่พัง ไม่ Error

## 2. Acceptance Criteria
> *เมื่อ AI ทำงานเสร็จ ต้องสามารถติ๊กถูกทุกข้อนี้ได้*
- [ ] มี API Route `/api/generate-diagram` แบบ POST รับข้อความ (String)
- [ ] ตั้งค่า System Prompt ให้สั่ง AI ทำตัวเป็น "Cloud Architect" และห้ามตอบข้อความอื่นใดนอกจากโค้ด Mermaid ที่อยู่ภายใน Markdown block ` ```mermaid `
- [ ] รองรับการเขียนผังแบบต่างๆ (Flowchart, Sequence Diagram, Architecture/Graph) โดยให้ AI ตัดสินใจเลือกประเภทผังที่เหมาะสมที่สุดเอง

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
