# Phase 4: Video Length Paywall

**สถานะ:** Backlog
**ความเชื่อมโยง:** Problem Statement

---
## 1. Milestone Goal
- **ปัญหา (The Problem):** AI LLM ไม่สามารถอ่านคลิปวิดีโอระดับ 2 ชั่วโมงให้ฟรีๆ ได้ทุกวัน เพราะจะกิน Token มหาศาลเกินไป
- **สิ่งที่อยากได้ (The Solution):** โมเดลธุรกิจแบบ Freemium กำหนดให้ผู้ใช้วางลิงก์ YouTube ที่มีความยาวไม่เกิน 15 นาทีเพื่อสร้างคอร์สฟรีได้ไม่อั้น (ดึงดูดให้เกิดความไวรัล) แต่ถ้าใส่วิดีโอที่ยาวกว่า 15 นาที (เช่น คลิปอาจารย์บรรยาย 3 ชั่วโมง) ระบบจะล็อกและขอให้จ่ายเงิน $5 เพื่อดำเนินการต่อ

## 2. Acceptance Criteria
> *เมื่อ AI ทำงานเสร็จ ต้องสามารถติ๊กถูกทุกข้อนี้ได้*
- [ ] ที่ API ขาเข้า ให้เพิ่มตัวตรวจจับความยาว (Duration) ของคลิปวิดีโอ YouTube
- [ ] หากคลิปมีความยาว `> 15 นาที` ระบบจะหยุดทำงานก่อนเข้าถึง AI และเด้ง Popup แจ้งเตือนลูกค้า
- [ ] เชื่อมต่อปุ่ม "Pay $5 to summarize this long video" to a payment gateway checkout session
- [ ] เมื่อลูกค้าชำระเงินสำเร็จ ระบบถึงจะยอมส่ง Transcript ขนาดยาวนั้นไปให้ AI ประมวลผลและสร้างคอร์ส

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
