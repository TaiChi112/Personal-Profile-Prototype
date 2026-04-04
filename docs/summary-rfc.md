# Technical RFC: app/page.tsx Documentation Profile

## RFC-001
- Title: Pattern-driven UI Monolith analysis for [app/page.tsx](../app/page.tsx)
- Status: Draft (documentation baseline)
- Audience: reviewer, maintainer, feature-dev

## 1. Context
โค้ดใน [app/page.tsx](../app/page.tsx) รวมหลาย concerns ไว้ในไฟล์เดียวเพื่อแสดงการประยุกต์ design patterns ใน production-like UI. เอกสารนี้กำหนดกรอบวิเคราะห์และแนวปฏิบัติสำหรับการแก้ไขโดยไม่ทำให้พฤติกรรมเดิมถดถอย

## 2. Goals
1. Capture architectural intent and runtime flows
2. Provide symbol-level reference for debugging and extension
3. Define role-based reading and change strategy

## 3. Non-Goals
1. Refactor code immediately
2. Cover backend/system outside [app/page.tsx](../app/page.tsx)
3. Replace existing pattern docs in [src/docs](../src/docs)

## 4. System Model
- Input domain: mocked content (`MOCK_*`) + UI events
- Internal engines: adapters, filters, sorters, visitors, mediators, command/state systems
- Output: rendered sections + notifications + downloadable exports

## 5. Key Invariants
1. `renderContent()` must always resolve to a valid section for active tab
2. Notification abstraction must route through selected channel
3. Feed pipeline order remains Filter -> Sort -> Layout render
4. Tour progression remains iterator-driven, not ad-hoc index mutations
5. Contact submit enablement must be mediator-controlled

## 6. Operational Flows
- Startup: useEffect -> facade initialization -> theme/admin/lang setup
- Navigation: nav/command triggers -> `setActiveTab` -> section render
- Feed: user criteria -> CoR filters -> strategy sort -> layout factory render
- Analytics: visitor traversal -> aggregate counters/tags -> dashboard view

## 7. Risk Notes
- High complexity from monolithic scope and mixed responsibilities
- Nested tree updates and recursive rendering are primary maintenance hotspots
- Pattern overlap is intentional but increases debugging path length

## 8. Change Control Guidance
1. Prefer pure logic extraction first (strategies, filters, visitors, state classes)
2. Add tests for any modified flow boundary before UI-level changes
3. Keep symbol flow references updated in [summary-symbol-flow.md](./summary-symbol-flow.md)

## 9. References
- Hub: [summary.md](./summary.md)
- Architecture details: [summary-architecture.md](./summary-architecture.md)
- Components/state details: [summary-components-state.md](./summary-components-state.md)
- Pattern catalog: [summary-patterns.md](./summary-patterns.md)
- Symbol flow map: [summary-symbol-flow.md](./summary-symbol-flow.md)
