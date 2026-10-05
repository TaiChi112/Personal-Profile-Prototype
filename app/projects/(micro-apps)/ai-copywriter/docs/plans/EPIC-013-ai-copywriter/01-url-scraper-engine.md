# Phase 1: URL Scraper & Data Extractor

**สถานะ:** Backlog
**ความเชื่อมโยง:** Problem Statement

---
## 1. Milestone Goal
- **ปัญหา (The Problem):** นักการตลาดหรือเจ้าของร้านไม่มีเวลามานั่งพิมพ์อธิบายว่าสินค้าตัวเองมีส่วนผสมอะไรบ้าง หรือมีฟังก์ชันอะไรบ้าง
- **สิ่งที่อยากได้ (The Solution):** นำลิงก์หน้าเว็บสินค้า (เช่น หน้า Sale Page หรือ Shopee/Lazada) มาแปะในช่อง จากนั้นระบบหลังบ้านของเราจะไปโหลดหน้าเว็บนั้นมา และสกัดเอาเฉพาะข้อความเนื้อหา (Text Content) ที่เกี่ยวกับสินค้ามาเตรียมไว้ให้ AI อ่าน

## 2. Acceptance Criteria
> *เมื่อ AI ทำงานเสร็จ ต้องสามารถติ๊กถูกทุกข้อนี้ได้*
- [ ] มี API Route `/api/scrape-product` แบบ POST ที่รับค่า `url`
- [ ] ใช้ไลบรารีอย่าง `cheerio` หรือ `puppeteer` ในการดึง HTML จาก URL ที่กำหนด
- [ ] ระบบสามารถทำความสะอาด (Sanitize) HTML เพื่อตัดแท็กที่รุงรังออก เหลือแต่ข้อความล้วน
- [ ] ข้อมูลที่สกัดได้ ต้องนำมาจัดให้อยู่ในความยาวที่จำกัด (เพื่อไม่ให้เกิน Token Limit ของ LLM)

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
