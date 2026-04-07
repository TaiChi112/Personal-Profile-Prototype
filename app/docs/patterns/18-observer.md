# Observer Pattern Guide

## Intent
ให้ subscriber หลายตัวรับการแจ้งเตือนเมื่อ state/event เปลี่ยน.

## Where Used in App
- `app/services/system/notification/NotificationBridge.ts` (`subscribeToToasts`, emitter)

## Scale Concerns
- Subscriber leak ถ้า unsubscribe ไม่ครบ
- Notification storm เมื่อ event frequency สูง

## Scale TODO (3 features)
1. Add auto-dispose subscription helpers for component lifecycle safety.
2. Add event throttling and coalescing for burst notifications.
3. Add prioritized observer execution with failure isolation.
