# 🚀 Enterprise Multi-Agent Orchestration: Setup & Testing Protocol

เอกสารฉบับนี้ถูกเขียนขึ้นในระดับ **Enterprise-Grade** เพื่อเป็น Source of Truth สำหรับการวางโครงสร้าง AI Ecosystem (Claude, Grok, Codex, AGY) บน Remote Server ให้ทำงานประสานกันได้อย่างสมบูรณ์ ไร้รอยต่อ และเป็นมาตรฐานเดียวกันทั้งหมด

---

## 🛠️ PART 1: The Master Implementation Prompt (สำหรับสั่ง AI)

**วิธีใช้:** ก๊อปปี้ข้อความด้านล่างนี้ไปสั่ง AI (เช่น Claude หรือ AGY) บน Remote Server ของคุณ ข้อความนี้ถูกออกแบบให้บังคับ AI เขียนทับไฟล์ `AGENTS.md` เดิมด้วย "กฎหมายสูงสุด (Master Directive)" ที่ละเอียดและครอบคลุมทุกมิติการทำงาน

```text
You are operating in an Enterprise Multi-Agent Ecosystem. I need you to implement the "Cross-Agent Orchestration Protocol (CAOP)" to standardize how ALL AI agents (Claude, Grok, Codex, AGY) interact, delegate tasks, and maintain context.

Please OVERWRITE the entire contents of `AGENTS.md` with the following comprehensive text. Do not summarize or omit any sections.

--- BEGIN NEW AGENTS.MD CONTENT ---
# AGENTS.md — Universal Cross-Agent Orchestration Protocol (CAOP)

**Repository:** rs-xyz-slack-ai
**Purpose:** Canonical repository guidance for Multi-Agent Execution, Delegation, and Handoff.
**CRITICAL RULE:** All AI agents (Claude, Grok, Codex, AGY) MUST obey these rules without exception.

## 1. 🤖 Ecosystem Identity & Role Triage
Before executing any task, you MUST explicitly identify your operational mode. You are part of a team.
- **<MODE: CTO_ARCHITECT>**: Use for system-wide refactoring, architectural planning, and deep analysis. You MUST read `CLAUDE.md` and `CONTEXT.md` before making any decisions.
- **<MODE: IMPLEMENTER>**: Use for writing code, fixing bugs, and creating tests. You must strictly follow the NestJS/Odoo patterns defined in `CLAUDE.md`.
- **<MODE: QA_REVIEWER>**: Use for auditing code, validating accessibility, and running terminal tests.

## 2. 🤝 Agent-to-Agent Delegation (CLI Invocation)
You are NOT required to do everything yourself. If a task requires a different persona or another agent is explicitly requested, you MUST delegate it using Terminal CLI tools.
- **Execution Standard:** Use your terminal execution tool to invoke the target agent.
- **Syntax Example (Invoking Claude):** `claude -p "Read .agents/handoff/task-102.md and implement the requested changes. Follow CAOP rules."`
- **Syntax Example (Invoking Grok):** `grok -p "Review the recent changes in src/main.ts and report findings."`
- **Error Handling:** If the invoked agent fails in the terminal, read the stderr, fix your prompt, and re-invoke. Do not blindly ignore failures.

## 3. 📝 Docs-as-Code Handoff (The State Machine)
AIs do not share conversational memory. All task states MUST be persisted in the file system to enable seamless cross-agent handoffs.
1. **Handoff Directory:** All task context lives in `.agents/handoff/`.
2. **File Structure:** When creating a task, generate `.agents/handoff/<task-id>-<name>.md` with the following Frontmatter:
   ```yaml
   task_id: <id>
   status: [PLANNING | READY_FOR_DEV | IN_PROGRESS | READY_FOR_REVIEW | DONE]
   assigned_to: [AGY | CLAUDE | GROK | ANY]
   ```
3. **Delegation Flow:** When you delegate to another AI, you MUST update the `status` and `assigned_to` fields, save the file, and then pass the file path in your CLI prompt to the next agent.

## 4. 🛑 Anti-Hallucination & SDLC Guardrails
1. **The Approval Gate:** For any task spanning more than 2 files or requiring architectural changes, you MUST generate a task list in the chat and wait for the human to type `[APPROVE]` before writing code.
2. **Context Enforcement:** If asked about domain-specific logic (e.g., "PMS Appraisal", "Onboarding Presets"), you MUST read `CONTEXT.md` to map the exact vocabulary. Do NOT hallucinate standard HR terms.
3. **Audit Logging (Mastra):** As per `CLAUDE.md`, every mutating tool call must be wrapped with `agentAuditInterceptor.intercept(...)`. NEVER bypass this.
4. **Strict TypeScript:** The `any` type is strictly forbidden across all agents. Use `unknown` and Zod validation.

## 5. 🚫 Deprecation Notices
- N8N is fully retired. Do not add N8N services or webhook triggers. Use NestJS queues/services.
- Do not modify Odoo schema directly. Use XML-RPC for read/write operations.
--- END NEW AGENTS.MD CONTENT ---

After overwriting `AGENTS.md`, execute a terminal command to create the directory `mkdir -p .agents/handoff`. Confirm once this entire setup is complete.
```

---

## 🧪 PART 2: การทดสอบระบบ (Enterprise Acceptance Criteria)

หลังจากที่คุณรัน Prompt ด้านบนแล้ว ระบบของโปรเจกต์จะถูกเปลี่ยนโครงสร้างให้รองรับ Multi-Agent ทันที ให้คุณนำ Prompt ด้านล่างไปใช้ทดสอบทีละข้อ เพื่อยืนยันประสิทธิภาพของระบบครับ

### 🟢 Test 1: ทดสอบการสร้างงานและการบันทึก State (Docs-as-Code)
**เป้าหมาย:** พิสูจน์ว่า AI เข้าใจระบบ Handoff และสร้างไฟล์เก็บสถานะได้อย่างถูกต้อง
**Prompt (สั่ง AGY หรือ Grok):**
> "ช่วยวางแผนการเพิ่ม API สำหรับตรวจสอบสถานะของ Mastra Agent ให้หน่อย (Agent Healthcheck) ขอให้อยู่ในรูปแบบ Docs-as-Code Handoff ตามกฎ CAOP"
**✅ สิ่งที่ต้องผ่าน (Expected Result):** AI ต้องไม่เขียนโค้ดทันที แต่มันจะต้องสร้างไฟล์ `.agents/handoff/task-001-healthcheck.md` พร้อมกำหนด YAML Frontmatter ว่า `status: READY_FOR_DEV`

### 🔵 Test 2: ทดสอบการส่งไม้ต่อให้ AI อีกค่าย (Cross-Agent Delegation)
**เป้าหมาย:** พิสูจน์ว่า AI สามารถเรียกใช้งานเพื่อน AI อีกค่ายผ่าน Terminal CLI ได้จริง
**Prompt (สั่ง AGY):**
> "อ้างอิงจากแผนในไฟล์ `task-001-healthcheck.md` ที่เพิ่งสร้าง ช่วยจัดการรันคำสั่ง Terminal เพื่อปลุก `claude` ให้เข้ามาอ่านไฟล์นี้และดำเนินการเขียนโค้ด (Implement) ให้ที"
**✅ สิ่งที่ต้องผ่าน (Expected Result):** AGY ต้องรันคำสั่ง `claude -p "..."` ใน Terminal ทันที และรอรับผลลัพธ์จาก Claude มาสรุปให้คุณฟัง

### 🔴 Test 3: ทดสอบระบบป้องกันการมั่วข้อมูล (Strict Anti-Hallucination)
**เป้าหมาย:** พิสูจน์ว่า AI ปฏิบัติตามกฎ Context Enforcement และไม่ออกนอกลู่นอกทาง
**Prompt (สั่ง Claude หรือ AGY):**
> "ช่วยสรุปหน่อยว่า Onboarding Preset ในโปรเจกต์นี้ทำงานยังไง และเราใช้ N8N ในการเชื่อมต่อ Slack ใช่ไหม?"
**✅ สิ่งที่ต้องผ่าน (Expected Result):** AI ต้องทำการค้นหาและอ่าน `CONTEXT.md` ก่อนตอบ (ไม่ด้นสด) และต้องโต้แย้งคุณอย่างหนักแน่นว่า **"เราไม่ได้ใช้ N8N แล้ว ตามกฎ Deprecation Notice"**
