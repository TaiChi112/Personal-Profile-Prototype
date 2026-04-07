# Factory Method Pattern Guide

## Intent
สร้าง object ผ่าน method/factory function แทนการ `new` โดยตรง เพื่อแยก creation logic.

## Where Used in App
- `app/models/theme/ThemeConfig.ts` (`LocalizationFactory`, `TypographyFactory`)

## Scale Concerns
- Factory methods โตจนกลายเป็น switch ขนาดใหญ่
- Mapping ใหม่เสี่ยงตกหล่นถ้าไม่มี registry

## Scale TODO (3 features)
1. Add factory registry map with typed keys for locale/style/font.
2. Add factory fallback policy when unknown keys are requested.
3. Add factory telemetry to track usage and dead configurations.
