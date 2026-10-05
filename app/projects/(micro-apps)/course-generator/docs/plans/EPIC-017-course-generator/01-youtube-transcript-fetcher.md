# Phase 1: YouTube Transcript Fetcher

**สถานะ:** Backlog
**ความเชื่อมโยง:** Problem Statement

---
## 1. Milestone Goal
- **ปัญหา (The Problem):** อยากอ่านสรุปจากคลิป YouTube แต่ไม่มีเวลามานั่งฟังแล้วจดตาม
- **สิ่งที่อยากได้ (The Solution):** หน้าเว็บที่มีช่องให้วางลิงก์ YouTube (URL) เพียงอย่างเดียว เมื่อกดตกลง ระบบหลังบ้านจะแอบไปดึงคำบรรยายอัตโนมัติ (CC / Transcript) ที่ซ่อนอยู่ในคลิปนั้นออกมาเป็นตัวอักษรทั้งหมด

## 2. Acceptance Criteria
> *เมื่อ AI ทำงานเสร็จ ต้องสามารถติ๊กถูกทุกข้อนี้ได้*
- [ ] มีช่อง Input รับ URL และทำการตรวจสอบ (Validate) ว่าเป็นลิงก์ของ `youtube.com` หรือ `youtu.be` จริงๆ
- [ ] มี API Route `/api/fetch-transcript`
- [ ] ใช้งานไลบรารีอย่าง `youtube-transcript` (หรือ API ฝั่ง YouTube) เพื่อดึงข้อมูล Transcript ออกมาเป็น String
- [ ] ระบบต้องตรวจสอบความยาว (Duration) ของคลิปวิดีโอเพื่อเตรียมส่งต่อให้ระบบล็อก (Paywall) ใน Phase 4

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
