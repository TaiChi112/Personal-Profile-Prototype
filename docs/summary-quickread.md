# Quick Read Brief: app/page.tsx

เอกสารสั้นสำหรับอ่านไวภายใน 5-10 นาที

## What this file is
- [app/page.tsx](../app/page.tsx) คือ React client page ที่โชว์ portfolio + pattern playground
- ใช้ data mock หลายชนิด แล้ว normalize เป็น `UnifiedContentItem`
- มี feature หลัก: feed, projects tree, dashboard analytics, podcast player, contact mediator, command palette, guided tour

## Core architecture in 7 bullets
1. Data adapters unify content models
2. Builder+Composite สร้าง/แสดงต้นไม้ content
3. Factory family เปลี่ยน locale/style/font runtime
4. Command+History ขับ command palette และ undo
5. Visitor คำนวณ analytics จาก tree
6. State machine คุม podcast player
7. Bridge+Observer คุม notification channels

## Most important symbols
- Shell: `PersonalWebsite`
- Tree: `ContentBuilder`, `InteractiveContentNode`
- Feed engine: `FilterHandler`, `ISortStrategy`
- Notifications: `NotificationService`, `ToastEventEmitter`
- Tour: `TourIterator`, `TourControls`
- Contact: `ContactFormMediator`

## Fast task map
- Add a new feed sort: implement `ISortStrategy`, push into `SORT_STRATEGIES`
- Add notification channel: implement `INotificationChannel`, set via `notify.setChannel(...)`
- Add tab/section: update `navItems` and `renderContent()`

## Where to go next
- Deep architecture: [summary-architecture.md](./summary-architecture.md)
- Symbol flow details: [summary-symbol-flow.md](./summary-symbol-flow.md)
- Risks/refactor: [summary-risks-refactor.md](./summary-risks-refactor.md)
