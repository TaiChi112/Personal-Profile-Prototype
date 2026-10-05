# Phase 4: B2B Pay-per-link Monetization

**สถานะ:** Backlog
**ความเชื่อมโยง:** Problem Statement

---
## 1. Milestone Goal
- **ปัญหา (The Problem):** ถ้าปล่อยให้ HR สร้างลิงก์สัมภาษณ์ฟรีไม่อั้น เจ้าของระบบจะเสียค่า API ของ LLM หนักมาก
- **สิ่งที่อยากได้ (The Solution):** ผูกปุ่ม "Generate Interview Link" เข้ากับa B2B payment gateway โดยบริษัทจะต้องจ่ายเงิน (เช่น $5 หรือ $10) ต่อ 1 ลิงก์ทดสอบ เพื่อรับประกันว่าเราจะได้กำไรต่อผู้สมัคร 1 คนเสมอ

## 2. Acceptance Criteria
> *เมื่อ AI ทำงานเสร็จ ต้องสามารถติ๊กถูกทุกข้อนี้ได้*
- [ ] ปุ่มสร้างลิงก์ต้องถูกล็อกไว้ หากยังไม่ได้ชำระเงิน
- [ ] เมื่อกดสร้าง ระบบจะconnect to the payment gateway เพื่อเก็บเงิน
- [ ] เมื่อบริษัทจ่ายเงินสำเร็จ จะได้ Credit กลับมา เพื่อนำไปสร้างลิงก์ทดสอบได้
- [ ] Implement a credit ledger schema (ที่ทำหน้าที่เป็น HR)

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
