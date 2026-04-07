# Singleton Pattern Guide

## Intent
มี instance เดียวสำหรับ shared state/service ที่ต้องใช้ร่วมกันทั้งแอป.

## Where Used in App
- `app/services/system/notification/NotificationBridge.ts`
- `app/models/command/Commands.ts` (`CommandHistory`)

## Scale Concerns
- Global mutable state ทำให้ test isolation ยาก
- Hidden dependency ถ้าเรียก singleton ตรงจากหลาย layer

## Scale TODO (3 features)
1. Add injectable singleton provider for test and storybook environments.
2. Add lifecycle reset API for deterministic integration tests.
3. Add singleton health diagnostics panel for runtime debugging.
