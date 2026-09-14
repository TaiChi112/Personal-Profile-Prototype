# 📝 สิ่งที่ต้องเตรียมสำหรับ Phase 4 (Full Agentic Automation)

เพื่อให้ผม (AI Agent) สามารถเข้าไปจัดการโปรเจกต์ของคุณผ่าน Next.js Web UI ได้อย่างสมบูรณ์แบบ เราจำเป็นต้องเชื่อมต่อ MCP Servers เพิ่มเติม (นอกเหนือจาก Filesystem ที่ผมเชื่อมให้แล้ว)

คุณสามารถเตรียม API Keys เหล่านี้ และนำไปใส่ในไฟล์ `/home/dev/ai-factory/.env` (ไฟล์หลักที่เราทำไว้) ได้เลยครับ:

---

## 1. 🐙 GitHub Personal Access Token (สำหรับจัดการ Code / Pull Requests)
*เรามีอยู่แล้วในระบบ แต่อาจจะต้องอัปเดตสิทธิ์ให้ครบถ้วน*
- **Key Name:** `GITHUB_PERSONAL_ACCESS_TOKEN`
- **วิธีขอ:** ไปที่ GitHub -> Settings -> Developer Settings -> Personal Access Tokens (Classic)
- **สิทธิ์ (Scopes) ที่ต้องติ๊ก:** `repo` (จัดการ repository เต็มรูปแบบ), `workflow` (สำหรับสั่งรัน CI/CD), `read:org`

## 2. 📋 Linear API Key (สำหรับจัดการ Task Tracking / Issues)
*เครื่องมือสำหรับสร้างตั๋วงาน (Issue) แบบฉบับ Agentic ทีม*
- **Key Name:** `LINEAR_API_KEY`
- **วิธีขอ:** เข้าเว็บ Linear.app -> Settings -> API -> Personal API Keys -> กด Create Key

## 3. ☁️ Google Cloud / Maps API (ถ้าโปรเจกต์คุณต้องใช้)
*เราตั้งค่าเตรียมไว้แล้ว หากในอนาคตแชทบอทต้องคำนวณเส้นทางหรือหาร้านค้า*
- **Key Name:** `GOOGLE_MAPS_API_KEY`

---

💡 **สถานะการทำงานปัจจุบัน:**
ขณะนี้ผมได้ทำการ Implement (เขียนโค้ดผูกระบบ) ให้ **Filesystem MCP** เสียบเข้าไปทำงานใน Next.js แชทบอทเรียบร้อยแล้ว หากคุณลองสั่งแชทบอทว่า *"ช่วยอ่านไฟล์ .env ให้หน่อย"* แชทบอทจะสามารถทะลวงเข้ามาอ่านไฟล์ในเครื่องได้ทันทีครับ! 

(เมื่อคุณได้ Key ของ GitHub หรือ Linear มาครบแล้ว แจ้งผมได้เลย ผมจะไปเขียนโค้ดเสียบ MCP เพิ่มให้ทันทีครับ!)
