# Interfaces Guide - Contracts and Extensibility

## Quick Summary
`app/interfaces` เป็นจุดรวม contract ที่บอก shape ของ data/object collaboration โดยไม่ผูกกับ implementation detail.

## Current Implementation Anchors
- `app/interfaces/content-tree.ts`
- `app/interfaces/index.ts`

## Scale Strategy
- Bottleneck 1: contract เปลี่ยนบ่อยและกระทบหลาย layer
  - Solution: version interfaces and deprecate gradually
- Bottleneck 2: overly broad interfaces ทำให้ coupling สูง
  - Solution: split interfaces by use-case (read/write/render)

## Related Patterns
- Composite, Visitor, Adapter

## Scale TODO (3 features)
1. Add versioned content-tree interfaces to support gradual migration.
2. Introduce read-only vs mutable contract split for safer traversal logic.
3. Add extension-point interfaces for external adapter and visitor plugins.
