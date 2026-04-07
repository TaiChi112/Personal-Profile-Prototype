# Flyweight Pattern Guide

## Intent
แชร์ state ที่ใช้ร่วมกันเพื่อลด memory footprint ของ object จำนวนมาก.

## Where Used in App
- `app/components/system/ParticleBackground.tsx`

## Scale Concerns
- แยก intrinsic/extrinsic state ไม่ชัดจะทำให้ bug ยาก
- Render loop optimization ไม่พอเมื่อ particle count สูง

## Scale TODO (3 features)
1. Add pooled particle archetypes with configurable quality tiers.
2. Add adaptive density control based on FPS budget.
3. Add offscreen canvas mode for high-density particle scenes.
