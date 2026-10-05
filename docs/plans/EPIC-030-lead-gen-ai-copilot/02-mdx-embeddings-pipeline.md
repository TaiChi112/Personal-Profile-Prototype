# Phase 1.2: MDX to Embeddings Pipeline

**สถานะ:** Backlog
**ความเชื่อมโยง:** Problem Statement

## 1. Milestone Goal
ข้อมูลประวัติงาน (Case Studies) และราคาแพ็กเกจ มีการอัปเดตเรื่อยๆ ต้องมีระบบดึงข้อมูลเข้าสมอง AI อัตโนมัติ

## 2. Acceptance Criteria
- [ ] Develop an ingestion script (หรือ API Route โหมดแอดมิน) ที่กวาดอ่านไฟล์ `.mdx` ทั้งหมดในโฟลเดอร์
- [ ] แบ่งข้อความ (Chunking) เป็นท่อนย่อยๆ และprocess them through an embedding generation API
- [ ] บันทึกค่า Vector กลับลงไปในฐานข้อมูลจาก Phase 1.1

---
## 3. Technical Implementation Context
**[Architectural Notes for AI Execution]**
- **Libraries:** Select appropriate vector databases and embedding APIs based on your architecture research.
- **Execution:** Proceed autonomously based on the Agentic Architect Directive established in `00-PROBLEM-STATEMENT.md`. Map your file targets and execute step-by-step.
