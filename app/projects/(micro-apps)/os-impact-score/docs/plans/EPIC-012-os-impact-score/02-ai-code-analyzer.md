# Phase 2: AI Code Analyzer

**สถานะ:** Backlog
**ความเชื่อมโยง:** Problem Statement

---
## 1. Milestone Goal
- **ปัญหา (The Problem):** ข้อมูล Diff ที่ได้มาเป็นแค่ข้อความดิบๆ สีเขียวสีแดง ไม่มีใครอ่านเข้าใจได้ทันที
- **สิ่งที่อยากได้ (The Solution):** การป้อนข้อมูล Diff to a structured LLM integration SDK โดยสั่งให้ AI วิเคราะห์ถึงความสามารถในการวางสถาปัตยกรรม ความสะอาดของโค้ด และให้คะแนน (0-100) กลับมาเป็นรูปแบบ JSON

## 2. Acceptance Criteria
> *เมื่อ AI ทำงานเสร็จ ต้องสามารถติ๊กถูกทุกข้อนี้ได้*
- [ ] นำข้อมูลจาก Phase 1 ส่งต่อให้ a structured data generation function
- [ ] Define a strict schema ensuring the AI returnsคะแนนใน 4 มิติ: `Architecture`, `Readability`, `Complexity`, และ `BestPractices`
- [ ] AI ต้องเขียนคำวิจารณ์ (Review Summary) สั้นๆ ประมาณ 3-4 บรรทัดสรุปสไตล์การเขียนโค้ดของคนๆ นี้
- [ ] หาก AI พบว่า Diff มีแต่การแก้ Readme หรือ Typo ให้คะแนน `Complexity` ออกมาต่ำอย่างสมเหตุสมผล

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
