# Phase 2: AI Proposal Engine

**สถานะ:** Backlog
**ความเชื่อมโยง:** Problem Statement

---
## 1. Milestone Goal
- **ปัญหา (The Problem):** AI ทั่วไปเขียน Proposal ได้แค่ผิวเผิน ไม่สามารถอธิบายได้ว่า "ทำไมบริษัทเราถึงตอบโจทย์ลูกค้ารายนี้"
- **สิ่งที่อยากได้ (The Solution):** นำข้อความจากเอกสารทั้งสองฝั่ง โยนเข้าสู่ LLM (ที่มี Context Window ขนาดใหญ่) และใช้ System Prompt ระดับผู้เชี่ยวชาญด้านการขาย (B2B Sales) เพื่อจับคู่จุดเด่นของบริษัทให้เข้ากับปัญหาของลูกค้า และแปลงเป็นโครงสร้าง JSON ที่มีหัวข้อชัดเจน เช่น บทสรุปผู้บริหาร, วิธีการทำงาน, และการประเมินราคา

## 2. Acceptance Criteria
> *เมื่อ AI ทำงานเสร็จ ต้องสามารถติ๊กถูกทุกข้อนี้ได้*
- [ ] มี API Route `/api/generate-proposal`
- [ ] Send extracted text to the chosen LLM integration SDK (utilizing a large-context LLM)
- [ ] บังคับให้ AI ตอบกลับมาas structured JSON based on a validated schema เช่น `{ executiveSummary, proposedSolution, timeline, pricingEstimate, companyAdvantage }`
- [ ] AI ต้องสามารถสรุป "จุดแข็งของบริษัท" (Company Advantage) ที่สอดคล้องกับความต้องการของลูกค้าได้อย่างเฉียบขาด

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
