# State Pattern Guide

## Intent
เปลี่ยน behavior ของ context ตาม current state โดยไม่ใช้ conditional ก้อนใหญ่.

## Where Used in App
- `app/models/podcast/AudioPlayerStateMachine.ts`

## Scale Concerns
- Transition rules กระจายจนตรวจสอบยาก
- Invalid transition handling ไม่ชัดเจน

## Scale TODO (3 features)
1. Add explicit transition table and guard predicates.
2. Add state transition audit logs for playback debugging.
3. Add hierarchical state support for buffering/network substates.
