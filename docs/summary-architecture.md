# Architecture Deep Dive: app/page.tsx

## 1) Intent and Architectural Style
ไฟล์ [app/page.tsx](../app/page.tsx) ใช้แนวทาง "Pattern-driven UI Monolith":
- มี domain data + UI orchestration + interaction logic รวมไว้ในไฟล์เดียว
- ใช้ design patterns เป็น boundary ทางความคิดแทนการแยกไฟล์เชิงเทคนิค
- จุดแข็ง: เรียนรู้ flow ได้ในจุดเดียว
- จุดเสี่ยง: maintainability และ testing complexity สูงเมื่อ feature โต

## 2) Core Layers (Logical)
### Data and Domain Layer
- Interfaces: `Article`, `Blog`, `Doc`, `Project`, `ResumeData`, `PodcastEpisode`, `UnifiedContentItem`
- Mock datasets: `MOCK_*` constants เป็น in-memory data source
- Adapter layer แปลง source ต่างชนิดไปสู่ canonical type (`UnifiedContentItem`)

### Composition Layer
- `ContentBuilder` สร้าง tree ของ `CompositeNode` และ `LeafNode`
- ได้ root trees สำคัญ: `INITIAL_PROJECTS_TREE`, `BLOGS_TREE`, `ARTICLES_TREE`
- Tree ถูก render แบบ recursive ผ่าน `InteractiveContentNode`

### Presentation and Style Layer
- Runtime factories:
  - Locale: `EnglishLocalization`, `ThaiLocalization`
  - Style: `ModernStyle`, `MinimalStyle`, `FutureStyle`, `AcademicStyle`
  - Typography: `PrimaryFont`, `SecondaryFont`
- Theme/layout controls ถูกเปลี่ยนระหว่าง runtime โดยไม่แก้ component contract

### Interaction and Behavior Layer
- Notification abstraction: `NotificationService` + channels (`ToastChannel`, `ConsoleChannel`, `AlertChannel`)
- Command system: `ICommand` implementations + `CommandHistory`
- Guided tour: `TourIterator` และ `TourControls`
- Feed behavior: filter chain + sort strategy + snapshot memento
- Contact form: mediator for validation/submit flow
- Podcast player: state machine (`Stopped`, `Playing`, `Paused`)

### System Bootstrap Layer
- `AppSystemFacade.initializeSystem` ทำ initialization sequence ให้จบใน entry point เดียว
- ใส่ initial theme/admin/lang defaults และ analytics hooks

## 3) Runtime Flow (Lifecycle)
1. Initial render
- React mounts root component (`PersonalWebsite`)
- `useEffect` เรียก `AppSystemFacade.initializeSystem`

2. Global setup
- Notification channel เริ่มที่ Toast
- Analytics init + initial event
- Theme/admin/lang state ถูก set จาก helper managers

3. User interaction phase
- Nav/Command Palette เปลี่ยน `activeTab`
- Feed section รัน filter/sort pipeline ก่อน render
- Dashboard ใช้ visitor traverse เพื่อสร้าง metrics/tag cloud

4. Advanced interaction phase
- Tour mode trigger แล้ว iterator ขยับ step
- Mediator จัดการ contact form enable/disable และ submit event
- Audio state machine เปลี่ยนสถานะ player แบบ explicit

## 4) Data Flow
### Normalization flow
Raw mock -> Adapter functions -> `UnifiedContentItem` -> Layout tree and cards

### Analytics flow
Composite roots -> `traverse(...)` -> `MetricsVisitor`/`TagsVisitor` -> dashboard widgets

### UI state flow
Control components (`ThemeControls`, `CommandPalette`, `TourControls`) -> state setters -> section rendering

## 4.1) Symbol-to-Symbol Runtime Chains
### Chain A: App boot and global setup
1. `PersonalWebsite` mounts
2. `useEffect(() => AppSystemFacade.initializeSystem(...), [])`
3. `AppSystemFacade.initializeSystem`
4. `notify.setChannel(new ToastChannel())`
5. `AnalyticsSystem.init()` and `AnalyticsSystem.trackEvent("App Launched")`
6. `ThemeManager.getInitialPreference()`
7. callback setters: `setDark`, `setStyle`, `setFont`, `setAdmin`, `setLang`

### Chain B: Notification delivery path
1. caller invokes `notify.notify(message, type)`
2. `NotificationService.notify` delegates `this.channel.send(...)`
3. when channel is toast: `ToastChannel.send` -> `ToastEventEmitter.getInstance().emit(...)`
4. `ToastContainer` subscriber receives `NotificationEvent`
5. local `toasts` state updates and UI toast is rendered

### Chain C: Dashboard analytics generation
1. `DashboardSection` executes `useMemo`
2. create `MetricsVisitor` and `TagsVisitor`
3. call `traverse(projectTree, mv/tv)` then traverse `BLOGS_TREE` and `ARTICLES_TREE`
4. visitor aggregates `counts` and `tags`
5. UI binds `stats.total`, `stats.project`, and tag list chips

### Chain D: Admin template clone path
1. click template button in `DashboardSection`
2. `templateRegistry.get(key)` -> `ProjectTemplate`
3. `template.clone()` returns deep-cloned `UnifiedContentItem`
4. customize clone meta from prompt
5. `onCloneProject(clonedItem)` -> `handleAddProject`
6. `setProjectTree(newTree)` triggers updated project render

## 5) Context and State Boundaries
- `UserContext`: authorization-like UI state (`isAdmin`)
- `TourContext`: active node targeting ระหว่าง guided tour
- Local state per section for feature-specific behavior (feed snapshots, player state, contact form fields)

## 6) Architectural Trade-offs
### Why this works well
- Demonstrates many patterns in one real UI
- Low cross-file friction for exploration and learning
- Fast prototyping with explicit objects/classes

### Cost to pay
- Single-file cognitive load สูง
- Diff noise สูงเมื่อแก้หลาย concern พร้อมกัน
- Unit tests ยากเพราะ classes/components ผูกกันแน่น

## 7) Recommended Near-term Direction
- Step 1: Extract pure logic first
  - Move adapters, strategies, filter chain, visitors, and state classes into `src/patterns/*`
- Step 2: Extract UI composition
  - Move sections (`PodcastSection`, `ContactSection`, `UnifiedFeedSection`) เป็น module files
- Step 3: Keep thin page shell
  - ให้ [app/page.tsx](../app/page.tsx) เหลือ orchestration และ provider wiring เท่านั้น
