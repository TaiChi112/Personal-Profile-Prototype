# 🐘 คู่มือการเตรียม PostgreSQL Connection URL

เพื่อให้ AI Agent สามารถดึงข้อมูล, วิเคราะห์ Schema, หรือทำ Backend Data Debugging ในฐานข้อมูลจริงได้

## 📊 ภาพรวมการทำงาน
```mermaid
graph LR
    AI[AI Agent] -->|Execute SQL| MCP(mcp_config.json)
    MCP -->|Connect| DB[(PostgreSQL Database)]
    DB -->|Return Rows| AI
```

## 📋 ข้อมูลที่ต้องกรอก
| ชื่อ Field | รูปแบบที่ต้องการ | ตัวอย่าง |
| :--- | :--- | :--- |
| **Connection URL** | `postgresql://[user]:[password]@[host]:[port]/[dbname]` | `postgresql://admin:secret@localhost:5432/my_app_db` |

**การจัดการ:** นำ URL นี้ไปแทนที่ `REPLACE_WITH_POSTGRES_URL_IF_HAVE` ในไฟล์ `~/.gemini/config/mcp_config.json`
