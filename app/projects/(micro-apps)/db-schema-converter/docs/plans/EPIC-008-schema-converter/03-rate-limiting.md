# Phase 3: Daily Rate Limiting

**สถานะ:** Backlog
**ความเชื่อมโยง:** Problem Statement

---
## 1. Milestone Goal
- **ปัญหา (The Problem):** หากปล่อยให้ใครก็ได้มากดปุ่ม Convert ไม่จำกัด เจ้าของเว็บจะล้มละลายเพราะค่า API
- **สิ่งที่อยากได้ (The Solution):** ระบบแจกโควตาฟรี 3 ครั้งต่อวันให้คนที่เพิ่งเข้ามาเว็บนี้ โดยไม่ต้องสมัครสมาชิกให้ยุ่งยาก (ลดอุปสรรคในการใช้งานครั้งแรก) หากกดครบโควตาแล้ว ระบบจะบล็อกการกดปุ่ม

## 2. Acceptance Criteria
> *เมื่อ AI ทำงานเสร็จ ต้องสามารถติ๊กถูกทุกข้อนี้ได้*
- [ ] มีกลไกนับจำนวนครั้งการคลิก (Counter) เก็บไว้ใน LocalStorage หรือ Cookie ผูกกับวันที่ปัจจุบัน (รีเซ็ตทุกเที่ยงคืน)
- [ ] หน้าเว็บมีข้อความแจ้งเตือนสถานะ เช่น "คุณเหลือสิทธิ์ใช้งานฟรีอีก 2 ครั้งในวันนี้"
- [ ] หากสิทธิ์เหลือ 0 ปุ่ม "Convert" จะถูกเปลี่ยนเป็นปุ่มสีเทา (Disabled) และมีแบนเนอร์แจ้งเตือนปรากฏขึ้นมาเพื่อเสนอให้ปลดล็อกแบบเสียเงิน
- [ ] ระบบหลังบ้าน (API Route) ต้องมีการเช็ค Rate Limit พื้นฐานตาม IP Address ด้วยเพื่อป้องกันบอทยิงรัวๆ

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
