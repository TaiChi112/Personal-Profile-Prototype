# Decorator Pattern Guide

## Intent
เพิ่ม behavior/visual layer ให้ object เดิมโดยไม่แก้ class ต้นฉบับ.

## Where Used in App
- `app/components/content/ProtectedDecoratedContent.tsx`
- `app/components/feed/FeedItemCard.tsx`

## Scale Concerns
- Decorator stack ซ้อนหลายชั้นจน debug ยาก
- Style precedence conflict ระหว่าง decorator layers

## Scale TODO (3 features)
1. Add ordered decorator pipeline with conflict resolution rules.
2. Add decorator debug mode to inspect active layers at runtime.
3. Add declarative decorator presets for feature teams.
