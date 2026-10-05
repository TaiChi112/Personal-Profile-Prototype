# Phase 3: Real-time Processing UI (Freemium Teaser)

**สถานะ:** Backlog
**ความเชื่อมโยง:** Problem Statement

---
## 1. Milestone Goal
- **ปัญหา (The Problem):** ถ้ากดประมวลผลแล้วหน้าจอนิ่งไป 2 นาที ผู้ใช้จะคิดว่าเว็บค้างและปิดทิ้ง
- **สิ่งที่อยากได้ (The Solution):** ระบบคิวบนหน้าจอ (Client-side Queue) ที่จะส่งรูปไปประมวลผลทีละ 1 รูป เมื่อรูปไหนเสร็จแล้ว จะเปลี่ยนสถานะจาก "Pending" เป็นเครื่องหมายติ๊กถูก (✓) สีเขียวทันที และแสดงข้อมูลที่ดึงได้ให้ดูข้างๆ รูป เพื่อความเพลิดเพลินในการรอ

## 2. Acceptance Criteria
> *เมื่อ AI ทำงานเสร็จ ต้องสามารถติ๊กถูกทุกข้อนี้ได้*
- [ ] เมื่อกดปุ่ม "Process" ระบบจะเริ่มวนลูปส่งภาพทีละภาพ (หรือทีละชุดเล็ก) ไปยัง API
- [ ] UI ของรูปที่ประมวลผลเสร็จแล้ว จะอัปเดตเป็นสีเขียว พร้อมโชว์ข้อมูล Date/Amount/Vendor ให้ดูเป็นน้ำจิ้ม
- [ ] **เงื่อนไข Freemium:** เมื่อประมวลผลเสร็จครบ 3 รูป ระบบคิวจะหยุดทำงานชั่วคราว (Pause)
- [ ] หน้าจอแสดง Popup Modal บอกว่า "ทดลองใช้งานฟรีครบ 3 รูปแล้ว AI ของเราดึงข้อมูลได้แม่นยำไหม? จ่ายเพียง $5 เพื่อประมวลผลรูปที่เหลือทั้งหมดและดาวน์โหลด CSV"

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
