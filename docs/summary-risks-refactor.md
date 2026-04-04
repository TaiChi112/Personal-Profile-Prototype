# Risks and Refactor Roadmap: app/page.tsx

## 1) Risk Register
### High Severity
1. Monolithic file complexity
- Symptom: logic for data, patterns, UI, controls, and effects อยู่ไฟล์เดียว
- Impact: merge conflicts สูง, onboarding ช้า, regression risk เพิ่ม
- Recommendation: split by feature and pure-logic modules

2. Mixed responsibilities in render scope
- Symptom: class construction/command definitions/handlers จำนวนมากอยู่ใกล้ JSX
- Impact: readability ต่ำและยากต่อ isolated unit testing
- Recommendation: extract services and hooks (`useTour`, `useFeedEngine`, `useNotificationChannel`)

3. Mutable nested tree updates
- Symptom: `projectTree` update ใช้ shallow copy แล้ว mutate nested children
- Impact: stale render edge cases and harder debugging
- Recommendation: adopt immutable update utility and typed tree updater functions

### Medium Severity
1. Performance overhead on recursive rendering
- Symptom: nested `InteractiveContentNode` renders frequently with layout toggles
- Impact: UI lag on large trees
- Recommendation: memoization boundary + selective virtualization for deep/large nodes

2. Global event handling spread
- Symptom: keyboard shortcuts and side effects managed in component-level effects
- Impact: cross-feature coupling and maintenance friction
- Recommendation: centralize shortcut registry and typed command dispatcher

3. Notification channel side effects
- Symptom: channel switching can change UX semantics dramatically (toast vs alert)
- Impact: inconsistent user expectation
- Recommendation: add channel policy per message severity and environment

### Low Severity
1. Mock-data dependency
- Symptom: runtime path tightly coupled to in-memory mock constants
- Impact: future API integration cost
- Recommendation: abstract data provider interface early

## 2) Refactor Objectives
- Keep behavior parity while reducing cognitive load
- Extract testable units without breaking UI contracts
- Maintain pattern-education value (do not remove pattern intent)

## 3) Incremental Refactor Plan
### Phase A: Zero-UI-change extraction
- Move pure domain interfaces and adapters to `src/patterns` or `src/domain`
- Move strategy/filter/visitor/state classes to dedicated modules
- Add unit tests for extracted pure logic

### Phase B: Section modularization
- Extract each section component into `app/sections/*`
- Keep `PersonalWebsite` as orchestration shell only
- Introduce feature hooks for command palette and tour controls

### Phase C: State architecture cleanup
- Separate UI-global state from feature-local state
- Evaluate lightweight store (context + reducer or Zustand)
- Standardize action names and event contracts

### Phase D: Performance and DX polish
- Add memoized selectors and stable callbacks on hot paths
- Profile recursive tree rendering and apply memo strategies
- Add doc-driven tests for key flows (tour, feed, contact, podcast)

## 4) Quick Wins (Can do first)
1. Extract `FilterHandler` chain and `ISortStrategy` into reusable module
2. Extract `NotificationService` and channel classes into service file
3. Add tests for `TourIterator` and `FeedStateCaretaker`
4. Replace nested tree mutation with immutable helper

## 5) Definition of Done for Refactor
- [ ] `app/page.tsx` size significantly reduced and remains readable
- [ ] Behavior parity for nav/feed/tour/contact/podcast/notifications
- [ ] Core logic covered by unit tests
- [ ] Documentation links in [docs/summary.md](./summary.md) still valid and updated
