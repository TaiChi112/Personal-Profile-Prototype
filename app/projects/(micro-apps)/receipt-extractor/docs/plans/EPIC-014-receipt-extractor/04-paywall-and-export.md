# Phase 4: Paywall & CSV Export

**สถานะ:** Backlog
**ความเชื่อมโยง:** Problem Statement

---
## 1. Milestone Goal
- **ปัญหา (The Problem):** ผู้ใช้เชื่อมั่นในระบบแล้วพร้อมจ่ายเงิน แต่เรายังไม่มีช่องทางรับเงิน
- **สิ่งที่อยากได้ (The Solution):** Connect a payment gateway แบบ Pay-per-batch (ไม่ต้องสมัครสมาชิกรายเดือน) เมื่อจ่ายเงินสำเร็จ ให้ระบบคิวทำงานต่อจนครบ 100 รูป และสุดท้ายรวมข้อมูลทั้งหมดเป็นปุ่ม "Download CSV" ให้ลูกค้านำไปส่งนักบัญชีต่อได้เลย

## 2. Acceptance Criteria
> *เมื่อ AI ทำงานเสร็จ ต้องสามารถติ๊กถูกทุกข้อนี้ได้*
- [ ] มีปุ่ม "Pay $5 to Unlock" ที่เชื่อมต่อกับ a payment gateway checkout session
- [ ] เมื่อชำระเงินสำเร็จ หน้าต่าง Modal จะปิดลง และระบบคิวจะดำเนินการประมวลผลใบเสร็จที่เหลือต่ออัตโนมัติ
- [ ] เมื่อประมวลผลครบทุกรูป ปุ่ม "Download CSV" จะปรากฏขึ้น
- [ ] ระบบแปลงข้อมูล JSON Array (จากรูปทั้ง 100 ใบ) ออกมาเป็นไฟล์ `.csv` รูปแบบมาตรฐาน (Columns: Date, Vendor, Category, Amount) ที่เปิดด้วย Excel ได้สมบูรณ์

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
