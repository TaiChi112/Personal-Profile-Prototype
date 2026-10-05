# Phase 4: Pay-per-scan Billing

**สถานะ:** Backlog
**ความเชื่อมโยง:** Problem Statement

---
## 1. Milestone Goal
- **ปัญหา (The Problem):** AI LLM ที่ใช้อ่านเอกสารยาวๆ กิน Token มหาศาล หากไม่เก็บเงิน จะทำให้ต้นทุนเซิร์ฟเวอร์บานปลาย
- **สิ่งที่อยากได้ (The Solution):** บังคับให้ผู้ใช้จ่ายเงินรายครั้ง (Pay-per-scan) เช่น $3 หรือ 100 บาท ต่อการสแกนเอกสาร 1 ฉบับ เพื่อปลดล็อกให้เห็นรายการ "Red Flags" ทั้งหมด (โดยในช่วงแรกอาจจะเบลอข้อความที่ 2 เป็นต้นไปไว้)

## 2. Acceptance Criteria
> *เมื่อ AI ทำงานเสร็จ ต้องสามารถติ๊กถูกทุกข้อนี้ได้*
- [ ] เมื่อ AI วิเคราะห์เสร็จ หน้าจอ Split-Screen จะแสดงข้อมูลการ์ดใบแรกชัดเจน แต่ใบที่เหลือ (ถ้ามี) จะถูกเบลอไว้ (CSS `backdrop-filter: blur()`)
- [ ] มีปุ่ม "Unlock Full Report for $3" วางทับอยู่บนพื้นที่ฝั่งขวา
- [ ] เมื่อกดปุ่ม ระบบจะสร้าง a payment gateway checkout session
- [ ] เมื่อจ่ายเงินสำเร็จ ผู้ใช้จะถูกพากลับมาที่หน้าเดิม และการ์ดทุกใบจะปลดล็อกอ่านได้ทั้งหมด
- [ ] มีปุ่ม "Export Report" (เพิ่มเติมฟรี) เพื่อเซฟรายการจุดเสี่ยงออกมาเป็น PDF อีกใบได้

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
