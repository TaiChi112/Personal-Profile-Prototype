# Services Guide - Orchestration and Side Effects

## Quick Summary
`app/services` ดูแล orchestration, side effects, และ integration flow เช่น content setup, notification bridge, system facade, form mediation.

## Current Implementation Anchors
- `app/services/system/AppSystemFacade.ts`
- `app/services/system/notification/NotificationBridge.ts`
- `app/services/content/ContentTreeSetup.ts`
- `app/services/content/ContentTreeAnalysis.ts`
- `app/services/content/ResumeExporters.ts`
- `app/services/contact/ContactFormMediator.ts`

## Scale Strategy
- Bottleneck 1: service orchestration ผูกกันแน่น
  - Solution: depend on interfaces + compose in feature hooks
- Bottleneck 2: channel/service growth ทำให้ branching เยอะ
  - Solution: register pipeline-based handlers instead of manual branching

## Related Patterns
- Facade, Bridge, Observer, Builder, Adapter, Visitor, Template Method, Mediator

## Scale TODO (3 features)
1. Add async notification pipeline with retry/fallback policies per channel.
2. Introduce service-level telemetry hooks for latency/error dashboards.
3. Create content orchestration plugin point for external data-source adapters.
