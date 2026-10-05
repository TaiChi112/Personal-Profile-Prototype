# Phase 1: LINE Webhook & Message Queue

**สถานะ:** Backlog
**ความเชื่อมโยง:** Milestone 1 (Master Plan)

---
## 1. มุมมองผู้ใช้งาน (User Story & Problem)
- **ปัญหา (The Problem):** ถ้าตั้งค่าให้ Webhook ของ LINE คุยกับ AI (LLM) ตรงๆ จะทำให้เกิดปัญหา Time-out ได้ง่าย เพราะ AI ตอบช้าเกินกำหนดของ LINE (ซึ่งห้ามเกินระดับวินาที)
- **สิ่งที่อยากได้ (The Solution):** ต้องการ API `/api/webhook/line` ที่แค่รับข้อความจาก LINE แล้วตอบกลับ 200 OK ทันที จากนั้นนำข้อความไปโยนใส่ระบบคิว (BullMQ + Redis) เพื่อให้ Worker ทำงานเบื้องหลังในการไปเรียก AI แล้วค่อยส่งข้อความกลับไปหาผู้ใช้ผ่าน LINE Push/Reply Message

## 2. เกณฑ์การตรวจรับงาน (Acceptance Criteria)
> *เมื่อ AI ทำงานเสร็จ ต้องสามารถติ๊กถูกทุกข้อนี้ได้*
- [ ] มี API Route `/api/webhook/line` ที่รองรับการตรวจสอบ Signature ของ LINE (เพื่อความปลอดภัย)
- [ ] ข้อความแชทถูกส่งเข้าสู่คิวของ BullMQ 
- [ ] มี Worker คอยหยิบข้อความจากคิวออกมาพิมพ์ออกทาง Console (ทดสอบระบบ)
- [ ] หากเกิด Error ใน Worker ระบบต้องสามารถ Retry งานซ้ำได้ตามมาตรฐาน BullMQ

---
## 3. พื้นที่สำหรับ AI (AI Technical Proposal & Execution)
