# Phase 2: AI Evaluation Engine

**สถานะ:** Backlog
**ความเชื่อมโยง:** Problem Statement

---
## 1. Milestone Goal
- **ปัญหา (The Problem):** AI ปกติมักจะใจดีเกินไป และบอกคำตอบที่ถูกต้องให้ผู้ใช้โดยตรง ซึ่งผิดวิสัยของผู้คุมสอบ
- **สิ่งที่อยากได้ (The Solution):** System Prompt ที่สั่งให้ AI สวมบทบาทเป็น "Senior Tech Lead" ที่เข้มงวด ทำหน้าที่ถามคำถามกดดัน (Grill) ตรวจสอบโค้ดที่ผู้สมัครเขียน และเมื่อหมดเวลา ให้ส่งข้อมูลผลคะแนนดิบๆ ทะลุหลังบ้านไปเซฟลงฐานข้อมูลโดยที่ผู้สมัครไม่เห็น

## 2. Acceptance Criteria
> *เมื่อ AI ทำงานเสร็จ ต้องสามารถติ๊กถูกทุกข้อนี้ได้*
- [ ] เมื่อผู้สมัครพิมพ์โค้ดส่งไป AI จะอ่านโค้ดและประเมินว่าถูกหรือผิด (โดยพิจารณาจาก Logic)
- [ ] AI ต้องไม่เฉลยคำตอบตรงๆ แต่จะบอกแค่ว่า "โค้ดของคุณยังมีบั๊กเรื่อง Memory Leak ลองหาดูซิ"
- [ ] เมื่อเวลาหมด (หรือผู้สมัครกดยอมแพ้) ระบบจะบังคับจบแชท และสั่งให้ AI เรียกใช้ LLM tool calling เพื่อเซฟผลคะแนน (0-100) และคำวิจารณ์ลง Database ทันที

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
