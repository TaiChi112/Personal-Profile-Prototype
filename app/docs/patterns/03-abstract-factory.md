# Abstract Factory Pattern Guide

## Intent
สร้าง family ของ object ที่สอดคล้องกัน (เช่น locale + style tokens) โดยไม่ผูก concrete class.

## Where Used in App
- `app/models/theme/ThemeConfig.ts` (style families and localization families)

## Scale Concerns
- Product family matrix โตเร็วเมื่อเพิ่ม theme/locale combinations
- ผสม family ผิดคู่แล้วเกิด inconsistent UX

## Scale TODO (3 features)
1. Add compatibility matrix validation between style and localization families.
2. Add theme family extension API for partner-specific branding.
3. Add dynamic family loader for optional theme packs.
