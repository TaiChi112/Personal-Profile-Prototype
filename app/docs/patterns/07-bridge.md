# Bridge Pattern Guide

## Intent
แยก abstraction ออกจาก implementation เพื่อให้เปลี่ยน channel/transport ได้อิสระ.

## Where Used in App
- `app/services/system/notification/NotificationBridge.ts`

## Scale Concerns
- Channel behavior แตกต่างกันจน abstraction ไม่พอ
- Error handling ไม่สม่ำเสมอระหว่าง channels

## Scale TODO (3 features)
1. Add asynchronous channel contract with delivery result statuses.
2. Add channel middleware for dedupe/throttle/retry policies.
3. Add fallback chain configuration for channel outage scenarios.
