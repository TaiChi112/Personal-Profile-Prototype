# Phase 2.1: Client Onboarding Form

**สถานะ:** Backlog
**ความเชื่อมโยง:** Problem Statement

## 1. Milestone Goal
ลูกค้าจ่ายเงินแล้ว ต้องรู้ว่าขั้นตอนต่อไปคืออะไร และต้องส่งข้อมูลโค้ดมาให้เราตรวจ

## 2. Acceptance Criteria
- [ ] สร้างหน้า `/onboarding` ที่ล็อกไว้เฉพาะคนที่จ่ายเงินผ่าน the payment provider (เช็คจาก Session หรือ Database)
- [ ] มีแบบฟอร์มเชิงลึก บังคับกรอก: URL โปรเจกต์, GitHub Repo, และคำอธิบายปัญหาแบบละเอียด (Pain points)
- [ ] เมื่อกด Submit ข้อมูลจะถูกบันทึก และส่งแจ้งเตือนเข้า the admin notification channel

---
## 3. Technical Implementation Context
**[Architectural Notes for AI Execution]**
- **Libraries:** Select an appropriate payment gateway and database schema based on your architecture research.
- **Execution:** Proceed autonomously based on the Agentic Architect Directive established in `00-PROBLEM-STATEMENT.md`. Map your file targets and execute step-by-step.
