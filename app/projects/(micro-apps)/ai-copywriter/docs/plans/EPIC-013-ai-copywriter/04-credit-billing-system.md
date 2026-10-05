# Phase 4: Credit Billing System

**สถานะ:** Backlog
**ความเชื่อมโยง:** Problem Statement

---
## 1. Milestone Goal
- **ปัญหา (The Problem):** AI Copywriter ถือเป็นเครื่องมือที่มีต้นทุนสูง หากให้ใช้ฟรีไปเรื่อยๆ จะไม่สามารถสร้างผลกำไรได้
- **สิ่งที่อยากได้ (The Solution):** ระบบจัดการ "เครดิต (Credits)" ที่บังคับให้ผู้ใช้ต้องล็อกอิน (via an authentication provider) ระบบจะแจกฟรี 3 เครดิตในตอนแรก และเมื่อกด Gen 1 ครั้งจะหัก 1 เครดิต เมื่อเครดิตหมด ให้มีปุ่มจ่ายเงินซื้อเพิ่มผ่าน a payment gateway

## 2. Acceptance Criteria
> *เมื่อ AI ทำงานเสร็จ ต้องสามารถติ๊กถูกทุกข้อนี้ได้*
- [ ] เพิ่มฟิลด์ `credits` (Int) ลงในthe application's ORM schema
- [ ] การเรียกใช้ API `/api/generate-copy` จะต้องตรวจสอบเครดิตก่อน หากพอให้ทำงานและหักเครดิตลง 1
- [ ] มีแถบแสดงเครดิตคงเหลือในหน้า Dashboard
- [ ] มีหน้า Pricing สำหรับเลือกซื้อแพ็กเกจเครดิต และเชื่อมต่อกับ a payment gateway checkout session
- [ ] มี a payment gateway webhook คอยรับข้อมูลการจ่ายเงินและบวกเครดิตให้ผู้ใช้อย่างถูกต้อง

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
