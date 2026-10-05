# Phase 2.2: Incident Reports MDX Integration

**สถานะ:** Backlog
**ความเชื่อมโยง:** Problem Statement

## 1. Milestone Goal
เวลาเว็บพัง อยากมีพื้นที่สำหรับชี้แจงปัญหาและบอกว่าแก้ไขเสร็จแล้ว เพื่อแสดงความรับผิดชอบ

## 2. Acceptance Criteria
- [ ] นำ Engine การประมวลผล MDX มาประยุกต์ใช้กับโฟลเดอร์ `content/incidents/`
- [ ] นำรายการ Incident ไปแสดงด้านล่างของกราฟ Uptime ในหน้า `/status`
- [ ] ถ้ามี Incident ที่สถานะเป็น "Investigating" (กำลังตรวจสอบ) ให้แสดงแบนเนอร์แจ้งเตือนที่แถบบนสุดของทุกหน้าในเว็บ

---
## 3. Technical Implementation Context
**[Architectural Notes for AI Execution]**
- **Libraries:** Select appropriate monitoring providers and UI data visualization tools based on your architecture research.
- **Execution:** Proceed autonomously based on the Agentic Architect Directive established in `00-PROBLEM-STATEMENT.md`. Map your file targets and execute step-by-step.
