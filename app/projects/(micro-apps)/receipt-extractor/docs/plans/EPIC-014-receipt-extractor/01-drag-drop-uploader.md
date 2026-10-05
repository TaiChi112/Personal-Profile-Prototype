# Phase 1: Drag & Drop Image Uploader

**สถานะ:** Backlog
**ความเชื่อมโยง:** Problem Statement

---
## 1. Milestone Goal
- **ปัญหา (The Problem):** การกดอัปโหลดทีละไฟล์ทำให้เสียเวลามากสำหรับคนที่มีใบเสร็จเป็นร้อยใบ
- **สิ่งที่อยากได้ (The Solution):** หน้าเว็บที่มีกรอบสี่เหลี่ยมขนาดใหญ่ (Dropzone) ตรงกลางจอ ผู้ใช้สามารถคลุมดำเลือกรูปภาพหลายๆ รูปในคอมพิวเตอร์ แล้วลากมาวางในกรอบนี้ได้เลย เมื่อวางเสร็จ ระบบจะแสดงรูปตัวอย่าง (Thumbnail) เรียงกันเป็น Grid ทันที

## 2. Acceptance Criteria
> *เมื่อ AI ทำงานเสร็จ ต้องสามารถติ๊กถูกทุกข้อนี้ได้*
- [ ] มีหน้าเว็บ `/projects/receipt-extractor`
- [ ] ติดตั้งคอมโพเนนต์ Drag & Drop (เช่น ใช้ `react-dropzone`) 
- [ ] จำกัดประเภทไฟล์ที่อัปโหลดได้ (เฉพาะ .jpg, .png, .jpeg) และจำกัดจำนวนสูงสุดที่ 100 ภาพต่อครั้ง
- [ ] แสดงภาพตัวอย่าง (Thumbnail) ของทุกรูปที่อัปโหลดไว้ เพื่อให้ผู้ใช้ตรวจสอบความถูกต้องก่อนกดปุ่ม "Process Data"

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
