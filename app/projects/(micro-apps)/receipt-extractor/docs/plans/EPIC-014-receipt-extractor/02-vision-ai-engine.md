# Phase 2: Vision AI Engine

**สถานะ:** Backlog
**ความเชื่อมโยง:** Problem Statement

---
## 1. Milestone Goal
- **ปัญหา (The Problem):** รูปแบบใบเสร็จมีหลากหลาย บางอันเป็นสลิปโอนเงิน บางอันเป็นใบกำกับภาษียับๆ ซึ่งโปรแกรม OCR ธรรมดาอ่านไม่รู้เรื่อง
- **สิ่งที่อยากได้ (The Solution):** นำพลังของ Large Multimodal Model (utilizing a multimodal LLM) มาใช้อ่านรูปภาพแบบลึกซึ้ง (Vision) โดย AI จะเข้าใจบริบทว่าตัวเลขไหนคือยอดรวมสุทธิ และตัวไหนคือวันที่ พร้อมจัดหมวดหมู่ให้เอง (เช่น ค่าอาหาร, ค่าเดินทาง, ค่าอุปกรณ์)

## 2. Acceptance Criteria
> *เมื่อ AI ทำงานเสร็จ ต้องสามารถติ๊กถูกทุกข้อนี้ได้*
- [ ] มี API Route `/api/extract-receipt` ที่รับข้อมูล Base64 ของรูปภาพ
- [ ] Instruct the chosen Multimodal LLM SDK ให้ส่งรูปไปให้ LLM ประมวลผล
- [ ] Define a strict output schema for structured data generation: `{ date: string, vendor: string, amount: number, category: string, confidenceScore: number }`
- [ ] AI ต้องสามารถระบุหมวดหมู่บัญชีพื้นฐานได้อัตโนมัติ

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
