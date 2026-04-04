# Symbol-to-Symbol Flow Reference: app/page.tsx

เอกสารนี้เน้น call chain ระดับ class/method เพื่อช่วย review, debug, และ extension

## 1) Startup and System Initialization
1. `PersonalWebsite.useEffect([])`
2. `AppSystemFacade.initializeSystem(callbacks)`
3. `notify.setChannel(new ToastChannel())`
4. `AnalyticsSystem.init()`
5. `AnalyticsSystem.trackEvent('App Launched')`
6. `ThemeManager.getInitialPreference()`
7. callback setters: `setDark`, `setStyle`, `setFont`, `setAdmin`, `setLang`

## 2) Dark Mode Update Path
1. user triggers dark toggle in `ThemeControls`
2. `setIsDark(prev => !prev)`
3. `PersonalWebsite.useEffect([isDark])`
4. `document.documentElement.classList.add/remove('dark')`

## 3) Command Palette Execution Path
1. keyboard shortcut (Cmd/Ctrl+K) toggles `isCommandOpen`
2. `CommandPalette` filters command list by `cmd.matches(query)`
3. select command -> `cmd.execute()`
4. example: `NavigateCommand.execute()` -> `setActiveTab(target)` -> `historyManager.push(this)`
5. undo action -> `handleUndo()` -> `historyManager.pop()?.undo()`

## 4) Notification Dispatch and Render Path
1. caller invokes `notify.notify(message, type)`
2. `NotificationService.notify` delegates to `channel.send`
3. if channel is Toast:
4. `ToastChannel.send` -> `ToastEventEmitter.emit`
5. `ToastContainer.useEffect` subscriber receives event
6. `setToasts([...prev, event])`
7. toast UI rendered via `style.getToastClass(type)`

## 5) Feed Filtering and Sorting Path
1. `UnifiedFeedSection` builds `allItems` via adapters
2. chain wiring: `typeFilter.setNext(searchFilter).setNext(tagFilter)`
3. `allItems.filter(item => typeFilter.handle(item, request))`
4. `TypeFilter.handle` -> `SearchFilter.handle` -> `TagFilter.handle`
5. accepted list -> `currentSortStrategy.sort(filteredItems)`
6. render -> `ContentLayoutFactory(layout, items, renderItem)`

## 6) Snapshot Save/Load (Memento) Path
### Save
1. `saveSnapshot()`
2. `new FeedStateMemento({ layout, searchQuery, filterType, sortLabel })`
3. `feedCaretaker.saveSnapshot(name, memento)`

### Load
1. `loadSnapshot(name)`
2. `feedCaretaker.getSnapshot(name)`
3. `memento.getState()`
4. restore setters: `setLayout`, `setSearchQuery`, `setFilterType`, `setCurrentSortStrategy`

## 7) Tour Navigation Path
1. start action -> `setIsTourActive(true)` + `tourIterator.reset()`
2. `TourControls` play mode repeatedly calls `iterator.next()`
3. each step goes to `onExecuteStep(step)` -> `handleTourStep(step)`
4. nav step: `setActiveTab(step.targetId)`
5. expand step: `setActiveNodeId(step.targetId)`
6. `InteractiveContentNode.useEffect` opens and scrolls target node

## 8) Recursive Content Rendering Path
1. `ProjectsSection`/`ArticlesSection`/`BlogSection` map root children
2. each item enters `InteractiveContentNode`
3. `renderContentCard()` wraps card with:
4. `AccessControlProxy` -> `ContentDecorator` -> content card
5. if composite and open: `renderChildren()` recursively renders child nodes

## 9) Contact Form Mediator Path
1. email/message input onChange -> `ContactInput.setValue`
2. `ContactInput.setValue` calls `mediator.notify(this, 'change')`
3. `ContactFormMediator.notify('change')` validates input
4. toggles `submitButton.setDisabled(...)`
5. submit click -> `submitButton.click()` -> `mediator.notify(this, 'click')`
6. sends notification and resets values via `syncState()`

## 10) Podcast State Machine Path
1. track select -> `AudioPlayerContext.setTrack(track)`
2. context sets `currentTrack`, resets to `StoppedState`, calls `play()`
3. `StoppedState.play()` -> transition to `PlayingState`
4. pause action -> `PlayingState.pause()` -> `PausedState`
5. stop action -> `PlayingState.stop()`/`PausedState.stop()` -> `StoppedState`

## 11) Dashboard Metrics Path
1. `DashboardSection.useMemo` creates `MetricsVisitor`, `TagsVisitor`
2. `traverse(projectTree, visitor)` and traverse other trees
3. `MetricsVisitor.countItem` aggregates per type + total
4. `TagsVisitor` inserts tags into set
5. UI reads `stats` and `tags` for cards/chips

## 12) Project Template Clone Path
1. admin clicks template button
2. `templateRegistry.get(key)` returns `ProjectTemplate`
3. `template.clone()` deep-clones and rewrites id/title/date/decorations
4. optional prompt customizes `meta`
5. `onCloneProject(clonedItem)` -> `handleAddProject`
6. `setProjectTree(newTree)` updates project section and dashboard stats

## 13) Symbol Hotspots for Debugging
- `renderContent()` for tab routing
- `handleTourStep()` for tour desync issues
- `typeFilter.setNext(...)` for feed result mismatches
- `NotificationService.setChannel()` for missing toasts
- `handleAddProject()` for tree mutation/render anomalies
