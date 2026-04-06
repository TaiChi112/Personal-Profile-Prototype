# Models Guide - Domain Logic at Scale

## Quick Summary
`app/models` เก็บ domain behavior ที่ควรเป็น framework-agnostic เช่น command, strategy, state machine, template model.

## Current Implementation Anchors
- `app/models/command/Commands.ts`
- `app/models/feed/FeedSort.ts`, `app/models/feed/FeedFilter.ts`, `app/models/feed/FeedState.ts`
- `app/models/theme/ThemeConfig.ts`
- `app/models/tour/Tour.ts`
- `app/models/template/ProjectTemplate.ts`
- `app/models/podcast/AudioPlayerStateMachine.ts`

## Scale Strategy
- Bottleneck 1: model classes โตจนจับ concern หลายอย่างในไฟล์เดียว
  - Solution: split by capability (core contract / concrete impl / registry)
- Bottleneck 2: hidden global state ใน singleton-like classes
  - Solution: expose explicit factory/provider for testability

## Related Patterns
- Singleton, Command, Strategy, Chain of Responsibility, Memento, State, Iterator, Prototype, Factory Method, Abstract Factory

## Scale TODO (3 features)
1. Add versioned command contracts to support backward-compatible command replay.
2. Introduce pluggable strategy registry for feed sorting/filtering without editing core model files.
3. Add model-level test fixtures package to standardize scenario generation across patterns.
