# 🤖 การตั้งค่า LINE Messaging API

เพื่อเชื่อมต่อ AI OS ของคุณเข้ากับแอปพลิเคชัน LINE บนมือถือ เราจำเป็นต้องสร้าง **LINE Channel** ขึ้นมาเพื่อรับส่งข้อความผ่าน Webhook ครับ

กรุณาทำตามขั้นตอนด้านล่างนี้ (ใช้เวลาประมาณ 3 นาที):

## ขั้นตอนที่ 1: สร้าง LINE Provider และ Channel
1. เข้าไปที่ [LINE Developers Console](https://developers.line.biz/console/) แล้วทำการ Log in ด้วยบัญชี LINE ของคุณ
2. หากยังไม่เคยมี Provider ให้กดปุ่ม **Create a new provider** แล้วตั้งชื่อ (เช่น `AI-Native-OS`)
3. เมื่อเข้ามาใน Provider แล้ว ให้กดปุ่ม **Create a new channel**
4. เลือกประเภทเป็น **Messaging API**
5. กรอกข้อมูลที่จำเป็น:
   - **Channel icon**: ใส่รูปโปรไฟล์ของบอท
   - **Channel name**: ชื่อของบอท (เช่น `My AI OS`)
   - **Channel description**: คำอธิบายสั้นๆ
   - **Category & Subcategory**: เลือกหมวดหมู่ที่เหมาะสม
6. กดยอมรับเงื่อนไขแล้วกด **Create**

## ขั้นตอนที่ 2: สร้างและคัดลอก Access Token
1. เมื่อสร้าง Channel เสร็จแล้ว ให้เข้าไปที่ Channel นั้น
2. เลือกแท็บ **Messaging API** 
3. เลื่อนลงมาล่างสุดที่หัวข้อ **Channel access token (long-lived)**
4. กดปุ่ม **Issue** เพื่อสร้าง Token
5. **คัดลอก (Copy)** ข้อมูล 2 อย่างนี้เตรียมไว้ให้ผม:
   - **Channel access token** (จากแท็บ Messaging API)
   - **Channel secret** (จากแท็บ Basic settings)

## ขั้นตอนที่ 3: ปิด Auto-reply
1. ไปที่แท็บ **Messaging API**
2. ตรงส่วน LINE Official Account features หัวข้อ **Auto-reply messages** ให้กดปุ่ม Edit
3. เปลี่ยนการตั้งค่า **Auto-reply messages** ให้เป็น `Disabled` (ปิด) เพื่อป้องกันไม่ให้บอทของ LINE ตอบมั่วเวลา AI ของเราทำงาน

---

ถ้าคุณเตรียม **Channel Access Token** และ **Channel Secret** พร้อมแล้ว แจ้งผมได้เลยครับ! เราจะเอามาใส่ใน Environment Variables (`.env`) แล้วเริ่มลุยเขียน API สำหรับรับข้อความทันที 🚀
