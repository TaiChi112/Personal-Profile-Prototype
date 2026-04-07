# Builder Pattern Guide

## Intent
ประกอบ object ที่ซับซ้อนทีละขั้น เพื่อควบคุมลำดับและ validation ระหว่างการสร้าง.

## Where Used in App
- `app/services/content/ContentTreeSetup.ts` (`ContentBuilder` flow)

## Scale Concerns
- Build steps มากขึ้นจนลำดับผิดง่าย
- Validation กระจายหลายจุดและยากต่อ maintain

## Scale TODO (3 features)
1. Add explicit build-step state machine to prevent invalid call order.
2. Add schema validation hooks per builder phase.
3. Add partial build snapshots for progressive hydration.
