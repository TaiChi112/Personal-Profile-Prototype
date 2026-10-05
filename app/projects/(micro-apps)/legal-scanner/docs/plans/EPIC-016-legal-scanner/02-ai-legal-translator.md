# Phase 2: AI Legal Translator

**สถานะ:** Backlog
**ความเชื่อมโยง:** Problem Statement

---
## 1. Milestone Goal
- **ปัญหา (The Problem):** ถ้าให้ AI ปกติอ่าน มันอาจจะสรุปข้ามๆ หรือพยายามให้คำแนะนำทางกฎหมายซึ่งเสี่ยงต่อการถูกฟ้อง
- **สิ่งที่อยากได้ (The Solution):** System Prompt ที่สั่งให้ AI เป็น "นักแปล" (Translator) เท่านั้น โดยมีหน้าที่ค้นหาประโยคที่เสียเปรียบ (เช่น เลิกจ้างกะทันหัน, ริบเงินมัดจำ, ลิขสิทธิ์ตกเป็นของผู้ว่าจ้าง) แล้วอธิบายออกมาเป็นภาษาชาวบ้าน พร้อมระบุแนบมาด้วยว่ามาจากประโยคไหนในหน้าไหน

## 2. Acceptance Criteria
> *เมื่อ AI ทำงานเสร็จ ต้องสามารถติ๊กถูกทุกข้อนี้ได้*
- [ ] มี API Route `/api/scan-contract`
- [ ] Configure the chosen LLM integration SDK with a structured data schema representing `Array<{ page: number, originalText: string, plainEnglishTranslation: string, riskLevel: 'Low' | 'Medium' | 'High' }>`
- [ ] System Prompt ต้องบังคับเด็ดขาดไม่ให้ AI ฟันธงว่าควรเซ็นหรือไม่ (ห้ามใช้คำว่า "ห้ามเซ็น" ให้ใช้คำว่า "โปรดพิจารณา" แทน)
- [ ] AI ต้องส่งค่ากลับมาเป็น JSON ตามรูปแบบที่กำหนดได้อย่างแม่นยำ

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
