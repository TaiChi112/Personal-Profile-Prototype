# Phase 1: Dual PDF Parser

**สถานะ:** Backlog
**ความเชื่อมโยง:** Problem Statement

---
## 1. Milestone Goal
- **ปัญหา (The Problem):** ผู้ใช้ (ฝั่ง Agency) ขี้เกียจคัดลอกข้อความแนะนำบริษัทของตัวเอง และข้อกำหนดของลูกค้า (TOR/RFP) มาแปะในฟอร์ม เพราะเอกสารเหล่านี้ยาวเป็นสิบหน้า
- **สิ่งที่อยากได้ (The Solution):** หน้าเว็บที่มีกล่องอัปโหลด 2 กล่องชัดเจน กล่องซ้ายสำหรับ "Company Profile (PDF)" กล่องขวาสำหรับ "Client Request / RFP (PDF)" ระบบหลังบ้านจะใช้เครื่องมืออ่าน PDF สกัดตัวอักษรทั้งหมดออกมาเตรียมไว้ให้ AI

## 2. Acceptance Criteria
> *เมื่อ AI ทำงานเสร็จ ต้องสามารถติ๊กถูกทุกข้อนี้ได้*
- [ ] มีหน้าเว็บ `/projects/proposal-writer` พร้อม UI อัปโหลดเอกสาร 2 ฝั่ง
- [ ] มี API Route `/api/parse-documents`
- [ ] ใช้งานไลบรารีสกัดข้อความ เช่น `a robust text extraction library` เพื่อแปลงไฟล์อัปโหลดให้กลายเป็น String ธรรมดา
- [ ] ระบบต้องตรวจสอบ (Validate) ว่าไฟล์ที่อัปโหลดไม่ใช่ไฟล์เปล่า และจำกัดขนาดไฟล์ไม่ให้เกินที่กำหนด (เช่น 10MB ต่อไฟล์)

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
