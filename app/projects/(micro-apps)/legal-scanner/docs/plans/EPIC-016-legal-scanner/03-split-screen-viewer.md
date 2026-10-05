# Phase 3: Split-Screen Viewer

**สถานะ:** Backlog
**ความเชื่อมโยง:** Problem Statement

---
## 1. Milestone Goal
- **ปัญหา (The Problem):** AI บอกว่า "หน้า 3 มีปัญหา" แต่ผู้ใช้เปิดดู PDF ไม่สะดวก ต้องสลับหน้าต่างไปมา
- **สิ่งที่อยากได้ (The Solution):** หน้า UI แบบแบ่งครึ่งจอ (Split-Screen) ด้านซ้ายฝังตัวแสดงผล PDF (a client-side PDF rendering library) ด้านขวาเป็นรายการ์ด (Cards) แสดงจุดเสี่ยง (Red Flags) ที่ AI เจอ เมื่อผู้ใช้กดที่การ์ดไหน ฝั่งซ้ายจะเลื่อนไปยัง PDF หน้านั้นให้โดยอัตโนมัติ

## 2. Acceptance Criteria
> *เมื่อ AI ทำงานเสร็จ ต้องสามารถติ๊กถูกทุกข้อนี้ได้*
- [ ] ติดตั้งไลบรารี a client-side PDF rendering library ฝั่ง Frontend เพื่อใช้แสดงเอกสาร PDF เดิมที่อัปโหลดไป
- [ ] ฝั่งขวาของหน้าจอ นำข้อมูล JSON จาก Phase 2 มาวนลูปแสดงเป็นการ์ดสีแดง (High Risk), สีเหลือง (Medium), สีฟ้า (Low)
- [ ] สร้างระบบ Event เมื่อคลิกการ์ด (onClick) ให้เปลี่ยน state `currentPage` ของตัวอ่าน PDF ฝั่งซ้าย
- [ ] รองรับการแสดงผลแบบ Responsive บนมือถือ (ปรับให้เรียงบนล่างแทนซ้ายขวา)

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
