# 📋 คู่มือการเตรียม Linear API Key

เพื่อช่วยให้ AI เข้าไปอ่าน Ticket, ขยับสถานะ Kanban Board, หรือสร้าง Bug Report บนระบบ Linear อัตโนมัติ

## 📋 ข้อมูลที่ต้องกรอก
1. ล็อกอินเข้า [Linear](https://linear.app) -> ไปที่ Settings -> API
2. กด **New API Key**

| ชื่อ Field | สิ่งที่ต้องเลือก/กรอก | ผลลัพธ์ |
| :--- | :--- | :--- |
| **Label** | `AI-Agent-MCP` | สำหรับอ้างอิง |
| **Key** | (Auto-generated) | จะได้รหัส `lin_api_...` |

**การจัดการ:** นำรหัสไปแทนที่ `REPLACE_WITH_LINEAR_API_KEY` ในไฟล์ `~/.gemini/config/mcp_config.json`
