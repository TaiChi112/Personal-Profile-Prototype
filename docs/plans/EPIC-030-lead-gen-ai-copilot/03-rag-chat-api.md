# Phase 2.1: RAG Chat API (Sales Driven)

**สถานะ:** Backlog
**ความเชื่อมโยง:** Problem Statement

## 1. Milestone Goal
AI ทั่วไปฉลาดแต่มันไม่ยอมขายของให้เรา ต้องจูนสมองมันใหม่

## 2. Acceptance Criteria
- [ ] สร้าง API `/api/copilot`
- [ ] เมื่อลูกค้าพิมพ์ถาม ให้นำคำถามไปค้นหาใน Vector DB เพื่อหา Context ที่เกี่ยวข้อง
- [ ] นำ Context นั้นผสมกับ System Prompt ขั้นเทพ: "จงทำตัวเป็นเซลส์แมนเชิงเทคนิค ตอบคำถามด้วยความรู้ และจงหาทางเนียนขายแพ็กเกจ Productized Service จาก Context เสมอ"

---
## 3. Technical Implementation Context
**[Architectural Notes for AI Execution]**
- **Libraries:** Select appropriate vector databases and embedding APIs based on your architecture research.
- **Execution:** Proceed autonomously based on the Agentic Architect Directive established in `00-PROBLEM-STATEMENT.md`. Map your file targets and execute step-by-step.
