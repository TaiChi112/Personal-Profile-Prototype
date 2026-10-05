# Phase 3: Export & Download System

**สถานะ:** Backlog
**ความเชื่อมโยง:** Problem Statement

---
## 1. Milestone Goal
- **ปัญหา (The Problem):** วาดกราฟเสร็จแล้ว แต่เอาไปแปะสไลด์นำเสนองานไม่ได้ เพราะแคปหน้าจอแล้วภาพแตก
- **สิ่งที่อยากได้ (The Solution):** ปุ่ม "Download SVG" และ "Download PNG" เพื่อนำภาพแผนผังที่ได้ไปใช้ต่องานจริงๆ

## 2. Acceptance Criteria
> *เมื่อ AI ทำงานเสร็จ ต้องสามารถติ๊กถูกทุกข้อนี้ได้*
- [ ] มีปุ่มกดดาวน์โหลดภาพแสดงอยู่ใต้แผนผัง
- [ ] ฟังก์ชันโหลด SVG (ง่ายเพราะ `mermaid` สร้าง SVG ให้อยู่แล้ว) สามารถ Export และรักษาความคมชัดได้ 100%
- [ ] ฟังก์ชันโหลด PNG ต้องใช้ Canvas API ในการแปลง SVG ให้กลายเป็นรูปภาพพื้นหลังโปร่งใส (Transparent Background) เพื่อให้นำไปแปะในงานนำเสนอได้สวยงาม

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
