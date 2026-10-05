# Phase 1.2: AI Roaster Prompt Engine

**สถานะ:** Backlog
**ความเชื่อมโยง:** Problem Statement

## 1. Milestone Goal
ต้องการคำวิจารณ์ที่เจ็บแสบ อ่านแล้วตลก และกระตุ้นให้เกิดการแคปเจอร์หน้าจอแชร์ต่อ

## 2. Acceptance Criteria
- [ ] นำข้อมูลจาก Phase 1.1 ส่งให้ the chosen LLM integration SDK
- [ ] กำหนด System Prompt ให้วิจารณ์การเลือกเทคโนโลยี (เช่น "ใช้ React แต่ไม่ได้ใช้ Next.js ในปีนี้เนี่ยนะ?", "Dependencies บานเบอะขนาดนี้ แอปคุณหนักเท่าเกม AAA หรือเปล่า?")
- [ ] บังคับให้ AI คืนค่า JSON เสมอ ประกอบด้วย: `grade` (A-F), `roastText`, `mainWeakness`

---
## 3. Technical Implementation Context
**[Architectural Notes for AI Execution]**
- **Libraries:** Select an appropriate LLM SDK and image generation strategy based on your architecture research.
- **Execution:** Proceed autonomously based on the Agentic Architect Directive established in `00-PROBLEM-STATEMENT.md`. Map your file targets and execute step-by-step.
