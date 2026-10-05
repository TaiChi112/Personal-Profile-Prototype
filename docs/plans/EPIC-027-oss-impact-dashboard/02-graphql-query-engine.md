# Phase 1.2: GraphQL Query Engine

**สถานะ:** Backlog
**ความเชื่อมโยง:** Problem Statement

## 1. Milestone Goal
ต้องการดึงข้อมูลแม่นยำที่สุดว่า "PR ไหนของเราถูก Merge เข้าโปรเจกต์ดังๆ บ้าง" ภายใน Request เดียว

## 2. Acceptance Criteria
- [ ] เขียนan advanced query to fetch `search(query: "is:pr author:USERNAME is:merged", type: ISSUE)`
- [ ] ดึงข้อมูล `repository { stargazers { totalCount } }` ออกมาด้วย
- [ ] คัดกรอง (Filter) ทิ้งโปรเจกต์ย่อยๆ เพื่อโชว์เฉพาะโปรเจกต์ที่มีดาวสูง (High Impact)

---
## 3. Technical Implementation Context
**[Architectural Notes for AI Execution]**
- **Libraries:** Select appropriate API fetching and caching strategies based on your architecture research.
- **Execution:** Proceed autonomously based on the Agentic Architect Directive established in `00-PROBLEM-STATEMENT.md`. Map your file targets and execute step-by-step.
