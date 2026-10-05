# Phase 2: AI Marketing Frameworks

**สถานะ:** Backlog
**ความเชื่อมโยง:** Problem Statement

---
## 1. Milestone Goal
- **ปัญหา (The Problem):** AI ทั่วไปมักจะเขียนคำโฆษณาที่ดูเป็นหุ่นยนต์เกินไป อ่านแล้วไม่กระตุ้นยอดขาย
- **สิ่งที่อยากได้ (The Solution):** บังคับสไตล์การเขียนของ AI (System Prompt) ให้ทำงานตามกรอบทฤษฎีการตลาดจริงๆ โดยให้สร้างผลลัพธ์ออกเป็น 3 ส่วนชัดเจนในรูปแบบ JSON:
  1. **Facebook Ad:** ใช้สูตร AIDA (Attention, Interest, Desire, Action)
  2. **TikTok Script:** เน้น Hook ปลุกเร้าอารมณ์ใน 3 วินาทีแรก
  3. **Email/Line Broadcast:** ใช้สูตร PAS (Problem, Agitate, Solve)

## 2. Acceptance Criteria
> *เมื่อ AI ทำงานเสร็จ ต้องสามารถติ๊กถูกทุกข้อนี้ได้*
- [ ] มี API Route `/api/generate-copy`
- [ ] Utilize a structured data generation LLM SDK bound to a schema validation library ที่แยกโครงสร้างตาม 3 แพลตฟอร์ม
- [ ] System Prompt ถูกเขียนอย่างรัดกุม ห้าม AI ใช้ภาษาที่ดูประดิษฐ์เกินไป (เช่น "ปฏิวัติวงการ", "เปิดประสบการณ์ใหม่") และให้ใช้ภาษาที่เป็นธรรมชาติเหมือนมนุษย์คุยกัน
- [ ] ผลลัพธ์ส่งกลับมาอย่างถูกต้องครบถ้วนทั้ง 3 รูปแบบ

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
