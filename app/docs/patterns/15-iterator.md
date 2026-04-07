# Iterator Pattern Guide

## Intent
เข้าถึงสมาชิกของ collection ตามลำดับโดยไม่เปิดเผยโครงสร้างภายใน.

## Where Used in App
- `app/models/tour/Tour.ts`
- `app/features/composition/useTourCommandOrchestration.tsx`

## Scale Concerns
- Iterator state sync ยากเมื่อ data ถูกแก้ไขระหว่าง iteration
- รองรับ traversal mode เดียวไม่พอสำหรับ UX หลายแบบ

## Scale TODO (3 features)
1. Add snapshot-based iterator mode for mutation-safe traversal.
2. Add filtered and reverse traversal strategies.
3. Add resumable iterator persistence for long tours.
