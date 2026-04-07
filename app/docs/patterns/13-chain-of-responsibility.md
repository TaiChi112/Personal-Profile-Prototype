# Chain of Responsibility Pattern Guide

## Intent
ส่ง request ผ่าน handler chain ทีละตัวจนกว่าจะมีตัวจัดการหรือครบ chain.

## Where Used in App
- `app/models/feed/FeedFilter.ts`

## Scale Concerns
- ลำดับ chain เปลี่ยนแล้วผลลัพธ์เปลี่ยนโดยไม่ตั้งใจ
- Debug ยากเมื่อ chain ยาวและมี side effects

## Scale TODO (3 features)
1. Add chain builder with explicit priority and deterministic ordering.
2. Add tracing output for each handler decision.
3. Add runtime chain composition for per-feature filter sets.
