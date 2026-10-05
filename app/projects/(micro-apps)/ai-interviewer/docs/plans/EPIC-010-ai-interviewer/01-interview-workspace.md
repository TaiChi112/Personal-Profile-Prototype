# Phase 1: Interview Workspace UI

**สถานะ:** Backlog
**ความเชื่อมโยง:** Problem Statement

---
## 1. Milestone Goal
- **ปัญหา (The Problem):** การพิมพ์ตอบโค้ดในช่องแชทธรรมดา ทำให้ผู้สมัครเขียนโค้ดได้ยาก จัด Format ไม่ได้ และไม่เหมือนการทำงานจริง
- **สิ่งที่อยากได้ (The Solution):** หน้าจอทำแบบทดสอบที่ออกแบบมาเฉพาะ แบ่งจอซ้ายเป็นช่องสนทนา (Chat) กับผู้คุมสอบ AI ส่วนจอขวาเป็น Code Editor (เช่น Monaco Editor) ที่รองรับ Syntax Highlighting เพื่อให้ประสบการณ์คล้ายกับแพลตฟอร์มอย่าง LeetCode หรือ HackerRank

## 2. Acceptance Criteria
> *เมื่อ AI ทำงานเสร็จ ต้องสามารถติ๊กถูกทุกข้อนี้ได้*
- [ ] มีหน้าเว็บสำหรับผู้สมัคร (เช่น `/projects/ai-interviewer/session/[id]`)
- [ ] แบ่ง Layout ชัดเจน: ฝั่งแชท (ใช้ Vercel AI SDK UI) และฝั่ง Code Editor
- [ ] มีนาฬิกาจับเวลาถอยหลัง (Countdown Timer) แสดงให้ผู้สมัครเห็นอย่างชัดเจน (เช่น 30 นาที)
- [ ] ระบบล็อกไม่ให้ผู้สมัคร Copy/Paste โค้ดจากภายนอกเข้ามาวางใน Editor ได้ (ป้องกันการลอกคำตอบบางส่วน)

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
