>[!WARNING]
>Unpolished & Unorganized: You will likely encounter raw notes, inconsistent Markdown formatting, and incomplete setup guides. Formatting cleanup is performed in batches rather than continuously.

>[!CAUTION]
>Breaking Changes: Expect frequent refactors that may break existing functionality without notice. Do not rely on this project for production-critical tasks until a stable release (v1.0.0) is tagged.

>[!NOTE]
>Project Context: This repository is part of my personal R&D and academic journey as an Agentic Software Engineer. It serves as a sandbox for exploring new architectures and performance-oriented languages.

>[!TIP]
>How to Navigate: Since the documentation might lag behind, the most reliable way to understand the current logic is to check the recent commit history or explore the /src directory directly.

>[!IMPORTANT]
>Documentation Mismatch: I am prioritizing "Vibe Coding" and rapid feature iteration over documentation updates. Most of the README content below is stale or reflects an older architectural version.

# Design Pattern Map for page.tsx

This document summarizes how `app/page.tsx` applies the patterns across the UI/behavior. Use it as a quick guide while reading the code.

## Big Picture
- A unified content app that normalizes articles/blogs/projects/media into one tree, renders it with multiple layouts/themes, and wires interactions (tours, command palette, snapshots, audio player, contact form) through patterns.
- Most pattern code lives in [app/page.tsx](app/page.tsx); demos for standalone references live under `demo/`.

## Pattern Index (what & where)
- **Adapter** – adapters convert domain objects (projects/blogs/articles/docs/videos/podcasts) to a common `UnifiedContentItem` before rendering. See adapter functions near the top of [app/page.tsx](app/page.tsx).
- **Builder + Composite** – `ContentBuilder` assembles a nested content tree; `InteractiveContentNode` walks and renders that tree with expand/collapse/layout toggles. Defined in [app/page.tsx](app/page.tsx).
- **Abstract Factory (Localization / Style / Typography)** – locale factories (`EnglishLocalization`, `ThaiLocalization`), style factories (`ModernStyle`, `MinimalStyle`, `FutureStyle`, `AcademicStyle`), and font factories choose labels and styling rules at runtime. See factory objects in [app/page.tsx](app/page.tsx).
- **Prototype** – `ProjectTemplate` + `ProjectTemplateRegistry` clone project templates for admin “clone & customize” actions. Lives in [app/page.tsx](app/page.tsx).
- **Template Method** – `ContentExporter` defines the export algorithm; `MarkdownExporter` and `JsonExporter` provide formatting/mime/extensions for resume export. See exporter classes in [app/page.tsx](app/page.tsx).
- **Singletons** – `NotificationService`, `ToastEventEmitter`, `CommandHistory` expose single shared instances. Implemented in [app/page.tsx](app/page.tsx).
- **Facade** – `AppSystemFacade.initializeSystem` bundles theme init, analytics boot, auth check, and notification setup behind one call. In [app/page.tsx](app/page.tsx).
- **Bridge** – `NotificationService` delegates to pluggable channels (`ToastChannel`, `ConsoleChannel`, `AlertChannel`) so UI can switch transports. See notification section in [app/page.tsx](app/page.tsx).
- **Observer** – `ToastEventEmitter` lets `ToastContainer` subscribe to notification events; observers receive `NotificationEvent` payloads. In [app/page.tsx](app/page.tsx).
- **Proxy** – `AccessControlProxy` guards locked cards; bypassed when `isAdmin` is true. Defined in [app/page.tsx](app/page.tsx).
- **Decorator** – `ContentDecorator` adds visual badges (new/featured/hot/etc.) around cards without altering the underlying card. In [app/page.tsx](app/page.tsx).
- **Flyweight** – `ParticleFactory` reuses flyweights to draw animated background symbols efficiently. In [app/page.tsx](app/page.tsx).
- **Memento** – `FeedStateMemento` + `FeedStateCaretaker` save/restore feed layout/search/filter/sort snapshots. Used in `UnifiedFeedSection`. In [app/page.tsx](app/page.tsx).
- **State** – `AudioPlayerContext` swaps between `StoppedState`, `PlayingState`, `PausedState` for podcast player behavior. In [app/page.tsx](app/page.tsx).
- **Mediator** – `ContactFormMediator` coordinates email/message inputs and submit button enablement for the contact form. In [app/page.tsx](app/page.tsx).
- **Command** – `ICommand` implementations (navigate, toggle theme/style/role, start tour) plus `CommandHistory` enable command palette and undo. In [app/page.tsx](app/page.tsx).
- **Iterator** – `TourIterator` drives the guided tour steps (NAV/EXPAND/RESET). In [app/page.tsx](app/page.tsx).
- **Chain of Responsibility** – `SearchFilter` → `TypeFilter` → `TagFilter` filter the unified feed step-by-step. In [app/page.tsx](app/page.tsx).
- **Strategy** – sorting strategies (`DateSortStrategy`, `TitleSortStrategy`, `LengthSortStrategy`) selected at runtime for feed ordering. In [app/page.tsx](app/page.tsx).
- **Visitor** – `MetricsVisitor` and `TagsVisitor` traverse content trees to build analytics (counts/tags) for the dashboard. In [app/page.tsx](app/page.tsx).

## How the pieces interact (quick flow)
1. **Data normalization**: adapters shape raw mocks into `UnifiedContentItem`s.
2. **Tree building**: `ContentBuilder` creates composite trees (projects/blogs/articles) that render via `InteractiveContentNode` (composite + decorator + proxy).
3. **UI chrome**: factories pick locale/style/font; bridge/observer handle notifications; facade initializes systems; flyweight paints the background.
4. **User interactions**: command palette (command + history), guided tour (iterator), feed filters (CoR + strategy), snapshots (memento), audio player (state), contact form (mediator), admin clone (prototype).
5. **Analytics**: visitors traverse trees to produce dashboard stats and tag clouds.

## Reading tips
- Start at the pattern implementations section inside [app/page.tsx](app/page.tsx) (search for "PATTERN IMPLEMENTATION") to see each pattern in isolation.
- Then jump to the section components (`UnifiedFeedSection`, `DashboardSection`, `PodcastSection`, `ContactSection`) to see how those patterns wire into UI behavior.
- For quick experimentation: use the command palette (Cmd/Ctrl+K) to trigger commands; use feed snapshots to see memento restore; switch notification channels to see the bridge; play/pause podcasts to see state transitions.

## Potential extensions
- Add unit snippets per pattern (tiny examples) under `demo/` mirroring the in-page usage.
- Extract pattern blocks into separate modules for reusability and easier testing.
- Add lightweight tests for `FilterHandler` chain, `TourIterator`, and `ContentExporter` formatting.
