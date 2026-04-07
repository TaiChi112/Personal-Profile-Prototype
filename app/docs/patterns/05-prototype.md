# Prototype Pattern Guide

## Intent
clone object จากต้นแบบเพื่อสร้าง instance ใหม่อย่างรวดเร็วและคงโครงสร้างเดิม.

## Where Used in App
- `app/models/template/ProjectTemplate.ts`
- `app/models/template/ProjectTemplateRegistry.ts`

## Scale Concerns
- Deep clone cost สูงเมื่อ template ซับซ้อน
- Shared reference leak ถ้า clone ไม่ลึกพอ

## Scale TODO (3 features)
1. Add selectable clone strategy (shallow/deep/structuredClone) per template type.
2. Add template diff utility for clone verification.
3. Add template inheritance (base template + override) for reusable variants.
