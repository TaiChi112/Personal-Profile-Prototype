# Phase 2.2: Global Component Migration

**สถานะ:** Backlog
**ความเชื่อมโยง:** Problem Statement

## 1. Milestone Goal
โปรเจกต์เดิมที่เขียนมา ต้องเปลี่ยนมาใช้ของจากคลังกลาง เพื่อให้เป็นมาตรฐานเดียวกันทั้งหมด

## 2. Acceptance Criteria
- [ ] เข้าไปแก้ไขโค้ดในแอป `Personal-Profile-Prototype` และ Micro-Apps ต่างๆ
- [ ] เปลี่ยน path การ import จาก `import { Button } from "@/components/ui/button"` เป็น `import { Button } from "@repo/ui"`
- [ ] ตรวจสอบความถูกต้องของสไตล์ (CSS) ไม่ให้มีส่วนใดพังหลังจากการย้าย

---
## 3. Technical Implementation Context
**[Architectural Notes for AI Execution]**
- **Libraries:** Select appropriate component primitives, styling tools, and bundlers based on your architecture research.
- **Execution:** Proceed autonomously based on the Agentic Architect Directive established in `00-PROBLEM-STATEMENT.md`. Map your file targets and execute step-by-step.
