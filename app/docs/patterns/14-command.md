# Command Pattern Guide

## Intent
ห่อ action เป็น object เพื่อรองรับ execute/undo/history/replay.

## Where Used in App
- `app/models/command/Commands.ts`
- `app/features/composition/useCommandList.tsx`

## Scale Concerns
- Command history โตจน memory ใช้มาก
- Undo/redo invariants แตกถ้าคำสั่งมี side effects ข้ามระบบ

## Scale TODO (3 features)
1. Add bounded history with persistence strategy per command type.
2. Add macro command composition for multi-step user actions.
3. Add command replay validator for deterministic state restoration.
