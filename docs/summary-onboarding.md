# Onboarding Guide: app/page.tsx

คู่มือนี้ช่วยให้นักพัฒนาใหม่เข้าใจไฟล์ [app/page.tsx](../app/page.tsx) แบบเร็วและปลอดภัย

## 1) First 30 Minutes
1. เปิดอ่าน [docs/summary.md](./summary.md) เพื่อเห็นภาพรวมก่อน
2. อ่าน [docs/summary-architecture.md](./summary-architecture.md) เพื่อเข้าใจ layer และ lifecycle
3. อ่าน [docs/summary-components-state.md](./summary-components-state.md) เพื่อเข้าใจ owner ของ state
4. เปิด [docs/summary-patterns.md](./summary-patterns.md) เพื่อ map symbol กับ pattern

## 2) Mental Model You Should Keep
- Think in flows, not only components:
  - Data normalization flow
  - UI control flow
  - Pattern interaction flow
- `PersonalWebsite` คือ orchestration shell
- Section components คือ feature endpoints
- Pattern classes คือ behavior engines behind UI

## 3) Safe Change Zones (Low Risk)
- เพิ่ม labels ใน localization factories
- เพิ่ม style token/classname ใน concrete style factories
- เพิ่ม sort strategy ใหม่ใน `SORT_STRATEGIES`
- ปรับ copy/text ใน section components ที่ไม่แตะ state orchestration

## 4) Caution Zones (High Risk)
- แก้ `InteractiveContentNode` recursion และ open-state behavior
- แก้ `TourIterator` + `handleTourStep` + `TourControls` พร้อมกัน
- แก้ notification bridge (`NotificationService`, channels, emitter)
- แก้ tree mutation logic ของ `projectTree`

## 5) Practical Walkthrough Tasks
### Task A: Add new feed sort mode
1. Implement new `ISortStrategy`
2. Push into `SORT_STRATEGIES`
3. Verify in Unified Feed sort menu

### Task B: Add new notification transport
1. Create class implementing `INotificationChannel`
2. Add switch logic in `ThemeControls.toggleChannel`
3. Verify toast/console/alert behavior consistency

### Task C: Add new section tab
1. Extend `navItems`
2. Add render branch in `renderContent()`
3. Add optional command in command palette

## 6) Validation Checklist Before Commit
- [ ] Navigation still works on desktop and mobile
- [ ] Cmd/Ctrl+K command palette still opens and executes commands
- [ ] Tour can start, move next/prev, and stop cleanly
- [ ] Feed search/filter/sort/snapshot still works
- [ ] Podcast controls preserve state transitions
- [ ] Contact submit still validates email + message length
- [ ] No regression in notification visibility

## 7) Suggested Learning Order for Patterns
1. Adapter + Composite + Builder
2. Strategy + Chain of Responsibility + Memento
3. Command + Iterator + Observer
4. State + Mediator + Visitor
5. Bridge + Facade + Flyweight + Prototype + Template Method

## 8) When You Need to Go Deeper
- Pattern rationale and symbol mapping: [docs/summary-patterns.md](./summary-patterns.md)
- Refactor plan and technical debt: [docs/summary-risks-refactor.md](./summary-risks-refactor.md)
