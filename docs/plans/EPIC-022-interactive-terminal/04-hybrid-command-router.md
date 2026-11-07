# Phase 2.2: Hybrid Command Router

**สถานะ:** COMPLETED
**ความเชื่อมโยง:** Problem Statement

## 1. Milestone Goal
สลับการทำงานระหว่างระบบธรรมดากับ AI ได้อย่างไร้รอยต่อ

## 2. Acceptance Criteria
- [x] ถ้าระบบพบคำสั่งแปลกๆ ที่ไม่อยู่ในรายการ ให้ส่ง String นั้นไปยิง the AI endpoint (`command-router.ts`)
- [x] รอรับผลแบบ Streaming กลับมาแสดงบนจอ Terminal พร้อมเอฟเฟกต์พิมพ์ทีละตัว (Typewriter) (`TerminalModal.tsx`)

---
## 3. Technical Implementation Context
**[Architectural Notes for AI Execution]**
- **Libraries:** Select appropriate UI terminal and API tools based on your architecture research.
- **Execution:** Proceed autonomously based on the Agentic Architect Directive established in `00-PROBLEM-STATEMENT.md`. Map your file targets and execute step-by-step.
