# Types Guide - Shared Type System Rules

## Quick Summary
`app/types` ใช้สำหรับ shared types ที่ไม่ได้เป็น domain behavior โดยตรง เช่น UI-centric unions, enums, helper aliases.

## Current Implementation Anchors
- `app/types/index.ts`

## Scale Strategy
- Bottleneck 1: type drift ระหว่าง data/model/component
  - Solution: define canonical source types and derive others
- Bottleneck 2: stringly-typed IDs และ style keys
  - Solution: branded types and constrained unions

## Related Patterns
- Decorator, Strategy, Factory families (ผ่าน type contracts)

## Scale TODO (3 features)
1. Add branded ID types for commands, nodes, and feed items.
2. Introduce generated type map from content schema definitions.
3. Create shared discriminated unions for feature event payloads.
