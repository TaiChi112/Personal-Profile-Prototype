# Phase 4: Affiliate Integration

**สถานะ:** Backlog
**ความเชื่อมโยง:** Problem Statement

---
## 1. Milestone Goal
- **ปัญหา (The Problem):** แอปพลิเคชันไวรัลแล้ว มีคนเข้าเว็บหลักหมื่นคน แต่เจ้าของเว็บไม่ได้เงินแม้แต่บาทเดียว แถมต้องเสียค่า API LLM ด้วย
- **สิ่งที่อยากได้ (The Solution):** ระบบอัจฉริยะที่จะวิเคราะห์คำแนะนำ (Roadmap) ของ AI ถ้า AI แนะนำให้คนๆ นั้นไปเรียน "React" ระบบหน้าบ้านของเราจะค้นหาลิงก์ Affiliate คอร์ส React มาแปะให้แบบเนียนๆ ในกล่องข้อเสนอแนะ 

## 2. Acceptance Criteria
> *เมื่อ AI ทำงานเสร็จ ต้องสามารถติ๊กถูกทุกข้อนี้ได้*
- [ ] มีไฟล์ Configuration (เช่น `sponsors.json` หรือเขียนใน Database) ที่เก็บคู่มือคำค้นหา เช่น คำว่า "AWS" คู่กับ "ลิงก์ Affiliate คอร์ส AWS"
- [ ] เมื่อ AI ส่ง JSON Roadmap กลับมา หน้าบ้านจะทำการจับคู่คำศัพท์ ถ้าตรงกันให้ใส่ปุ่มลิงก์สปอนเซอร์ลงไปในการ์ดนั้น
- [ ] แนบป้ายโฆษณาเชิงเทคนิค (e.g., 'Deployed on [Hosting Platform]') ไว้ที่มุมจอแบบไม่รบกวนสายตา พร้อมใส่ Affiliate Link
- [ ] ระบบต้องรองรับการกดคลิกผ่านโทรศัพท์มือถือได้อย่างแม่นยำ

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
