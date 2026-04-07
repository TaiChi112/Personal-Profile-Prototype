# Strategy Pattern Guide

## Intent
สลับ algorithm ได้ผ่าน interface เดียว โดยไม่แก้ consumer logic.

## Where Used in App
- `app/models/feed/FeedSort.ts`

## Scale Concerns
- Strategy selection logic กระจัดกระจาย
- Performance ต่างกันมากแต่ไม่ถูก monitor

## Scale TODO (3 features)
1. Add strategy registry with feature-flag driven selection.
2. Add benchmark hooks to compare strategy performance in runtime.
3. Add composable multi-key sorting strategies.
