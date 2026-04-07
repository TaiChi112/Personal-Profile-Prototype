# Mediator Pattern Guide

## Intent
ให้ component คุยผ่านตัวกลางเพื่อลด coupling ระหว่างกัน.

## Where Used in App
- `app/services/contact/ContactFormMediator.ts`

## Scale Concerns
- Mediator รับ responsibility มากเกินไป
- Event flow ไม่ชัดเจนเมื่อ component เพิ่ม

## Scale TODO (3 features)
1. Add mediator event contract map with typed channels.
2. Add middleware hooks for validation and side-effect isolation.
3. Add mediator diagnostics timeline for form interactions.
