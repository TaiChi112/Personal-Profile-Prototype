# Phase 4: High-Ticket Paywall & Watermark

**สถานะ:** Backlog
**ความเชื่อมโยง:** Problem Statement

---
## 1. Milestone Goal
- **ปัญหา (The Problem):** หากไม่มีระบบล็อก ผู้ใช้จะดาวน์โหลดเอกสารระดับมืออาชีพไปฟรีๆ ซึ่งเครื่องมือนี้มีมูลค่ามหาศาลต่อธุรกิจของพวกเขา
- **สิ่งที่อยากได้ (The Solution):** หน้า Preview ใน Phase 3 จะถูกประทับลายน้ำ (Watermark) ตัวใหญ่ๆ ว่า "Draft / Unpaid" ทับลงไปตรงกลางเอกสารทุกหน้า เมื่อลูกค้าจ่ายเงินหลักร้อยบาท ($15) ระบบถึงจะปลดล็อกลายน้ำ และเปิดให้ดาวน์โหลดไฟล์สมบูรณ์ได้

## 2. Acceptance Criteria
> *เมื่อ AI ทำงานเสร็จ ต้องสามารถติ๊กถูกทุกข้อนี้ได้*
- [ ] เพิ่ม Component "Watermark" วางซ้อนทับบน PDF Preview ในกรณีที่สถานะ `hasPaid` เป็น false
- [ ] มีปุ่ม "Buy this Proposal for $15" ค้างอยู่บนหน้าจอ ซึ่งจะลิงก์to a payment gateway checkout session
- [ ] สร้างระบบจัดการ Payment Session เพื่อจดจำว่าผู้ใช้จ่ายเงินสำหรับเอกสารฉบับนี้แล้ว (อาจผูกกับ ID ชั่วคราว หรือ Session ID)
- [ ] เมื่อชำระเงินสำเร็จ ลายน้ำใน PDF Viewer จะหายไป และปุ่มจะเปลี่ยนเป็น "Download PDF"
- [ ] เมื่อคลิกดาวน์โหลด ระบบจะต้อง Export เป็นไฟล์ `.pdf` ที่ไม่มีลายน้ำอย่างสมบูรณ์

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
