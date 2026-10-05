# Phase 1: PDF Upload & Parse

**สถานะ:** Backlog
**ความเชื่อมโยง:** Problem Statement

---
## 1. Milestone Goal
- **ปัญหา (The Problem):** เอกสารสัญญาความลับ (NDA) หรือสัญญาจ้างงาน มักจะมาในรูปแบบไฟล์ PDF ผู้ใช้ไม่สามารถแก้ตัวอักษรหรือคัดลอกออกมาได้ง่ายๆ
- **สิ่งที่อยากได้ (The Solution):** หน้าเว็บที่มีกล่องรับไฟล์อัปโหลด `.pdf` โดยเฉพาะ เมื่อผู้ใช้อัปโหลดแล้ว ระบบหลังบ้านจะใช้ไลบรารีสกัดตัวอักษร (Extract Text) ทั้งหมดออกมาเก็บไว้ในหน่วยความจำ พร้อมทั้งเก็บหมายเลขหน้า (Page Number) ควบคู่กับตัวอักษรนั้นๆ ด้วย

## 2. Acceptance Criteria
> *เมื่อ AI ทำงานเสร็จ ต้องสามารถติ๊กถูกทุกข้อนี้ได้*
- [ ] มีหน้าเว็บ `/projects/legal-scanner` พร้อมกล่องรับไฟล์ PDF
- [ ] มี Popup Modal แจ้งเตือนข้อจำกัดความรับผิดชอบ (Disclaimer) ว่า "ระบบนี้ไม่ใช่การให้คำปรึกษาทางกฎหมาย" บังคับให้กด "ยอมรับ" ก่อนแนบไฟล์
- [ ] ใช้งานไลบรารีเช่น `a robust text extraction library` เพื่ออ่านข้อความออกมาเป็น Array ของ String โดยแยกตามหมายเลขหน้า
- [ ] ระบบต้องลบไฟล์ทิ้งออกจาก Disk ทันทีเมื่อสกัดข้อความเสร็จแล้ว (ประมวลผลใน Memory เพื่อความปลอดภัย)

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
