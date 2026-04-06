# Data Guide - Content Source and Fixture Scaling

## Quick Summary
`app/data` เก็บ mock/content seed ที่ feed เข้า models/services/components ระหว่าง development และ demo flows.

## Current Implementation Anchors
- `app/data/types.ts`

## Scale Strategy
- Bottleneck 1: static mock data โตจนดูแลยาก
  - Solution: split datasets by domain and load on demand
- Bottleneck 2: data shape mismatch กับ runtime contracts
  - Solution: validate fixtures against interfaces in CI

## Related Patterns
- Adapter, Builder, Prototype, Visitor

## Scale TODO (3 features)
1. Add fixture validation pipeline that checks schema compatibility before build.
2. Introduce domain-sliced data packs (feed/projects/podcast/docs) with lazy import.
3. Add adapter-ready source abstraction for future CMS/API migration.
