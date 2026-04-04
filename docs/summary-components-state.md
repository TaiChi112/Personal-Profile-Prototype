# Components and State Flow: app/page.tsx

## 1) Component Responsibility Map
### Shell and Providers
- `PersonalWebsite`: app shell, nav routing, provider wiring, global orchestration
- `UserContext.Provider`: admin role state for access control
- `TourContext.Provider`: current highlighted node during guided tour

### Global UI Services
- `ParticleBackground`: canvas animation backdrop
- `ToastContainer`: render toast events from observer channel
- `ThemeControls`: floating controls for dark mode, command palette, undo, tour, channel switch
- `CommandPalette`: keyboard-first command launcher
- `TourControls`: guided tour playback and navigation controls

### Content Sections
- `HeroSection`: landing and CTA
- `UnifiedFeedSection`: unified mixed-content explorer (search/filter/sort/snapshot)
- `ProjectsSection`: project tree renderer
- `ArticlesSection`, `BlogSection`: tree-based related-content navigation
- `DocsSection`: two-pane docs browser
- `PodcastSection`: episode list + player panel
- `DashboardSection`: analytics widgets + admin template cloning
- `ResumeSection`: resume view + export actions
- `ContactSection`: mediated form interactions

### Recursive Renderer
- `InteractiveContentNode`: core recursive node renderer, expand/collapse, per-node layout switch

## 2) Top-level State Ownership
In `PersonalWebsite`:
- Navigation and shell: `activeTab`, `isMenuOpen`, `activeDropdown`
- Visual config: `styleKey`, `langKey`, `fontKey`, `isDark`
- Power features: `isCommandOpen`, `isTourActive`, `activeNodeId`
- Authorization-like UI: `isAdmin`
- Domain tree mutation: `projectTree`

## 3) Derived State and Resolvers
- `currentStyle = STYLES[styleKey]`
- `currentLang = LOCALES[langKey]`
- `currentFont = FONTS[fontKey]`
- `labels = currentLang.getLabels()`

แนวนี้ทำให้ state เป็น key-driven configuration และ render layer อ่านค่าแบบ declarative

## 4) Event and Control Flow
### Startup flow
1. Mount `PersonalWebsite`
2. `AppSystemFacade.initializeSystem(...)` sets defaults and analytics
3. dark class sync via `document.documentElement.classList`

### Navigation flow
1. Nav button or command executes
2. `setActiveTab(...)`
3. `renderContent()` selects section component

### Tour flow
1. `StartTourCommand` or button -> set tour active + reset iterator
2. `TourControls` advances `TourIterator`
3. `handleTourStep` updates tab or active node
4. `InteractiveContentNode` reacts to `activeNodeId` and expands target

### Feed flow
1. User types query/selects filter/sort
2. Build request for filter chain
3. Apply `FilterHandler` pipeline
4. Apply chosen `ISortStrategy`
5. Render via selected layout (`grid/list/timeline`)

### Contact flow
1. Input change -> mediator receives `change`
2. Mediator validates email/message and updates submit state
3. Submit click -> mediator handles send simulation and reset

### Podcast flow
1. Select episode -> `AudioPlayerContext.setTrack(...)`
2. Context enters stopped then play transition
3. UI buttons call `play/pause/stop` on context

## 4.1) Method-Level Flow References
### Flow: Guided Tour
1. `StartTourCommand.execute()`
2. `setIsTourActive(true)`, `setActiveTab('home')`, `tourIterator.reset()`
3. `TourControls` calls `iterator.next()`/`iterator.prev()`
4. `onExecuteStep(step)` -> `handleTourStep(step)`
5. `setActiveTab(step.targetId)` or `setActiveNodeId(step.targetId)`
6. `InteractiveContentNode.useEffect` detects `activeNodeId` and opens target

### Flow: Unified Feed Processing
1. input handlers update `searchQuery`, `filterType`, `currentSortStrategy`
2. build `FilterRequest`
3. `typeFilter.handle(item, request)`
4. delegates through `SearchFilter.handle` and `TagFilter.handle`
5. accepted items -> `currentSortStrategy.sort(filteredItems)`
6. renderer path -> `ContentLayoutFactory` -> selected layout component

### Flow: Contact Submission
1. `<input onChange>` -> `mediator.email.setValue(...)` or `mediator.message.setValue(...)`
2. `ContactInput.setValue` -> `this.mediator.notify(this, 'change')`
3. `ContactFormMediator.notify('change')` validates and toggles `submitButton.disabled`
4. submit click -> `mediator.submitButton.click()`
5. `ContactFormMediator.notify('click')` sends message and resets fields

### Flow: Notification Channel Toggle
1. `ThemeControls.toggleChannel()` updates `currentChannelIndex`
2. chooses concrete channel (`ToastChannel`/`ConsoleChannel`/`AlertChannel`)
3. `notify.setChannel(new Channel())`
4. subsequent `notify.notify(...)` uses selected channel implementation

## 5) Memoization and Performance-relevant Spots
- `useMemo` for `AudioPlayerContext` and `ContactFormMediator` instances
- `DashboardSection` uses `useMemo` for visitor traversal results (`stats`, `tags`)
- Potential hotspots:
  - recursive rendering in `InteractiveContentNode`
  - many inline closures and class instances inside render scope
  - large monolithic client component increasing re-render surface

## 6) Data Mutation Notes
- `handleAddProject` updates `projectTree` with shallow-clone strategy
- Risk: deep mutation side-effects ถ้า nested structure โตมาก
- Recommended: immutable helper (for example `immer`) for safer nested updates

## 7) Testing Priorities by Component
- High priority:
  - `UnifiedFeedSection` (filter/sort/snapshot correctness)
  - `InteractiveContentNode` (recursive expand/layout behavior)
  - `DashboardSection` (visitor metrics/tag outputs)
  - `ContactSection` (mediator validation and submit behavior)
- Medium priority:
  - `CommandPalette` keyboard navigation and execution
  - `PodcastSection` state transitions

## 8) Reviewer Quick Inspection
1. Verify `renderContent()` still covers all expected tabs
2. Verify command list in `commands` still mirrors primary navigations and controls
3. Verify `ThemeControls` actions match actual handlers (undo, command, role, tour, channel)
4. Verify no broken chain in feed pipeline: filter -> sort -> layout
5. Verify context providers still wrap all consumers (`UserContext`, `TourContext`)
