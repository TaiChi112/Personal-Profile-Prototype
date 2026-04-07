# Composite Pattern Guide

## Intent
มองโครงสร้างต้นไม้เป็น object เดียวกันได้ทั้ง node เดี่ยวและกลุ่ม node.

## Where Used in App
- `app/interfaces/content-tree.ts`
- `app/components/content/InteractiveContentNode.tsx`

## Scale Concerns
- Recursive rendering cost สูงเมื่อ tree ใหญ่
- Update subtree แบบเฉพาะจุดทำได้ยากถ้าไม่มี diff model

## Scale TODO (3 features)
1. Add tree diff engine for selective subtree updates.
2. Add node virtualization for deep and wide hierarchies.
3. Add permission metadata on composite nodes for role-aware rendering.
