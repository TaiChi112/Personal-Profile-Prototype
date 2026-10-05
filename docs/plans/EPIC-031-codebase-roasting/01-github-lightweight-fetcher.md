# Phase 1.1: Lightweight GitHub Fetcher

**สถานะ:** Backlog
**ความเชื่อมโยง:** Problem Statement

## 1. Milestone Goal
ผู้ใช้ไม่อยากรอนานเป็นนาที ต้องการเห็นผลการสแกนในหลักวินาที

## 2. Acceptance Criteria
- [ ] Create a serverless endpoint รับ URL ของ Repository
- [ ] ใช้ GitHub REST API (`https://raw.githubusercontent.com/...`) วิ่งไปดึงเฉพาะไฟล์ `package.json` (หรือ `requirements.txt` สำหรับ Python) และ `README.md` โดยไม่ Clone ทั้งโปรเจกต์

---
## 3. Technical Implementation Context
**[Architectural Notes for AI Execution]**
- **Libraries:** Select an appropriate LLM SDK and image generation strategy based on your architecture research.
- **Execution:** Proceed autonomously based on the Agentic Architect Directive established in `00-PROBLEM-STATEMENT.md`. Map your file targets and execute step-by-step.
