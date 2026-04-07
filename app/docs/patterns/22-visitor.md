# Visitor Pattern Guide

## Intent
แยก algorithm ออกจากโครงสร้าง object โดยให้ visitor เดินผ่าน element แล้วประมวลผล.

## Where Used in App
- `app/services/content/ContentTreeAnalysis.ts`
- `app/interfaces/content-tree.ts`

## Scale Concerns
- Visitor เพิ่มขึ้นมากทำให้ discoverability ต่ำ
- Tree traversal cost สูงถ้ารันหลาย visitor ต่อเนื่อง

## Scale TODO (3 features)
1. Add visitor registry and naming conventions for discoverability.
2. Add batched traversal that runs multiple visitors in one pass.
3. Add async visitor support for IO-bound analysis tasks.
