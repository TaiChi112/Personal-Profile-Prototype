# Memento Pattern Guide

## Intent
เก็บ snapshot state เพื่อ restore ย้อนกลับได้โดยไม่เปิดเผย internals.

## Where Used in App
- `app/models/feed/FeedState.ts`

## Scale Concerns
- Snapshot size โตเร็วเมื่อ state ใหญ่
- Restore incompatibility เมื่อ schema state เปลี่ยน

## Scale TODO (3 features)
1. Add compressed memento storage with retention policy.
2. Add schema-versioned mementos with migration adapters.
3. Add selective restore mode for partial feed state rollback.
