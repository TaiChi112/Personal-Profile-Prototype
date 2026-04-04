# Design Patterns Catalog: app/page.tsx

เอกสารนี้ map การใช้ design patterns กับ symbol จริงใน [app/page.tsx](../app/page.tsx)

## Creational Patterns
### Singleton
- Symbols: `NotificationService`, `ToastEventEmitter`, `CommandHistory`
- Purpose: shared instance สำหรับ global notification stream และ command undo stack
- Practical effect: ลด duplicate state manager และคุม side-effect point เดียว

### Factory Method and Abstract Factory
- Symbols: `LocalizationFactory`, `StyleFactory`, `TypographyFactory` + concrete factories
- Purpose: เลือก family ของ labels/classnames/fonts ตาม runtime key
- Practical effect: feature toggle ด้าน language/theme/font ผ่าน mapping table (`LOCALES`, `STYLES`, `FONTS`)

### Builder
- Symbol: `ContentBuilder`
- Purpose: ประกอบ tree structure แบบ fluent API
- Practical effect: สร้าง hierarchical content model อ่านง่ายกว่าการเขียน object nested ตรงๆ

### Prototype
- Symbols: `ProjectTemplate`, `ProjectTemplateRegistry`
- Purpose: clone base project template แล้ว customize
- Practical effect: Admin flow ทำ template-based creation โดยไม่กระทบ original template

## Structural Patterns
### Adapter
- Symbols: `adaptProjectToUnified`, `adaptBlogToUnified`, `adaptVideoToUnified`, `adaptArticleToUnified`, `adaptDocToUnified`, `adaptPodcastToUnified`
- Purpose: normalize data models ต่างชนิดสู่ `UnifiedContentItem`
- Practical effect: render pipeline ใช้ card renderer เดียวได้กับทุก content type

### Composite
- Symbols: `LayoutNode`, `CompositeNode`, `LeafNode`, `InteractiveContentNode`
- Purpose: represent and render tree structure recursively
- Practical effect: supports nested sections, expandable nodes, and mixed layout modes

### Decorator
- Symbol: `ContentDecorator`
- Purpose: แปะ visual badge behavior โดยไม่แก้ core card component
- Practical effect: add `new/featured/hot/popular/sponsor` overlays ได้แบบ composable

### Proxy
- Symbol: `AccessControlProxy`
- Purpose: คั่นสิทธิ์ก่อน render real content
- Practical effect: lock premium/admin content พร้อม UX overlay

### Flyweight
- Symbols: `ParticleFactory`, `IconParticleFlyweight`, `ParticleContext`
- Purpose: reuse particle drawing metadata
- Practical effect: ลด object churn ตอน animate background canvas

### Bridge
- Symbols: `INotificationChannel`, `ToastChannel`, `ConsoleChannel`, `AlertChannel`, `NotificationService`
- Purpose: decouple notification abstraction ออกจาก delivery channel
- Practical effect: runtime switch channel ใน `ThemeControls` ได้โดยไม่แก้ caller

### Facade
- Symbol: `AppSystemFacade`
- Purpose: รวม initialization ที่กระจายหลายระบบเป็น single entry
- Practical effect: startup logic ดูง่ายและลด duplication ใน `useEffect`

## Behavioral Patterns
### Strategy
- Symbols: `ISortStrategy`, `DateSortStrategy`, `TitleSortStrategy`, `LengthSortStrategy`
- Purpose: runtime-selectable sorting policy
- Practical effect: feed sort menu เปลี่ยน behavior โดยไม่ if/else ก้อนใหญ่

### Chain of Responsibility
- Symbols: `FilterHandler`, `SearchFilter`, `TypeFilter`, `TagFilter`
- Purpose: apply filter rules ทีละชั้นจน reject/accept
- Practical effect: เพิ่ม filter ใหม่ได้โดย compose chain แทน rewrite function เดียว

### Visitor
- Symbols: `IVisitor`, `MetricsVisitor`, `TagsVisitor`, `traverse`
- Purpose: แยก operation ออกจาก tree structure
- Practical effect: dashboard metrics/tag cloud คำนวณได้โดยไม่แก้ node classes

### State
- Symbols: `AudioPlayerContext`, `StoppedState`, `PlayingState`, `PausedState`
- Purpose: explicit finite-state transitions for player behavior
- Practical effect: play/pause/stop logic predictable และลด invalid transitions

### Mediator
- Symbol: `ContactFormMediator`
- Purpose: centralize interaction ของ email/message/submit components
- Practical effect: validation and submit orchestration ไม่กระจาย logic ไปหลาย component

### Command
- Symbols: `ICommand`, `NavigateCommand`, `ToggleThemeCommand`, `SwitchStyleCommand`, `ToggleRoleCommand`, `StartTourCommand`
- Purpose: encapsulate user actions and support undo/dispatch
- Practical effect: command palette + history manager ทำ keyboard-driven UX ได้ง่าย

### Iterator
- Symbol: `TourIterator`
- Purpose: deterministic traversal ของ tour steps
- Practical effect: controls (next/prev/play) แยกจาก storage format ของ steps

### Memento
- Symbols: `FeedStateMemento`, `FeedStateCaretaker`
- Purpose: save/restore feed UI state snapshot
- Practical effect: user can persist and reload workspace views quickly

### Template Method
- Symbols: `ContentExporter`, `MarkdownExporter`, `JsonExporter`
- Purpose: fix export algorithm skeleton; vary format-specific steps
- Practical effect: เพิ่ม exporter ใหม่ได้โดย override format/mime/extension

### Observer
- Symbols: `ToastEventEmitter.subscribe`, `ToastContainer`
- Purpose: pub-sub model for toast events
- Practical effect: sender ไม่ต้องรู้ว่า UI consumer เป็นใคร

## Pattern Coupling Notes
- Pattern overlap intentionally high: feed section ใช้ Strategy + CoR + Memento ร่วมกัน
- Dashboard ใช้ Composite + Visitor + Prototype (admin flow)
- Notification stack ใช้ Bridge + Observer + Singleton

## Extension Playbook
- Add new notification channel:
  1. Implement `INotificationChannel`
  2. Inject via `notify.setChannel(...)`
- Add new feed sort:
  1. Implement `ISortStrategy`
  2. Append into `SORT_STRATEGIES`
- Add new filter:
  1. Extend `FilterHandler`
  2. Wire into chain setup in feed section
