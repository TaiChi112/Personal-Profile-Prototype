# Facade Pattern Guide

## Intent
ซ่อน subsystem complexity หลัง API เดียว เพื่อให้ consumer ใช้ง่ายและคงที่.

## Where Used in App
- `app/services/system/AppSystemFacade.ts`

## Scale Concerns
- Facade อาจกลายเป็น god-object
- Hidden coupling ถ้าภายใน facade เรียก dependency แบบ hardcoded

## Scale TODO (3 features)
1. Add modular facade composition (auth/analytics/boot as separate capabilities).
2. Add hook-based facade initialization for lazy subsystem startup.
3. Add facade contract tests to prevent accidental API expansion.
