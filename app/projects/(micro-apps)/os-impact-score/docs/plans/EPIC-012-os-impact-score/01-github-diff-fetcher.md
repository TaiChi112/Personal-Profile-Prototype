# Phase 1: GitHub Diff Fetcher

**สถานะ:** Backlog
**ความเชื่อมโยง:** Problem Statement

---
## 1. Milestone Goal
- **ปัญหา (The Problem):** การดูแค่ยอดดาว (Stars) ของ Repository ไม่สามารถบอกได้ว่าโปรแกรมเมอร์คนนั้นเขียนโค้ดเก่งจริงหรือไม่ (บางคนแก้แค่ Typo หรือ Readme ก็ได้ Commit แล้ว)
- **สิ่งที่อยากได้ (The Solution):** การเรียกใช้งาน GitHub API แบบเจาะลึก โดยดึงรายการ Pull Request 5 รายการล่าสุดของผู้ใช้ แล้วไปดึงข้อมูลการแก้ไขไฟล์ (Diff) เพื่อให้เห็นว่าผู้ใช้นั้นเพิ่มโค้ดบรรทัดไหน และลบบรรทัดไหนออกไปจริงๆ

## 2. Acceptance Criteria
> *เมื่อ AI ทำงานเสร็จ ต้องสามารถติ๊กถูกทุกข้อนี้ได้*
- [ ] มี API Route `/api/fetch-github-diff` ที่รับค่า `username`
- [ ] ใช้ `@octokit/rest` ค้นหา Pull Requests ที่ผู้ใช้คนนี้เป็นคนเปิดและถูก Merge แล้ว
- [ ] ดึงข้อมูล `application/vnd.github.v3.diff` ของแต่ละ PR ออกมา
- [ ] หากข้อมูล Diff ยาวเกินไป (เช่น เกิน 10,000 บรรทัด) ต้องมีการตัด (Truncate) เพื่อไม่ให้เกิน Token Limit ของ AI ในเฟสถัดไป

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
