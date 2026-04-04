# page.tsx Summary Hub

สรุปนี้เป็นศูนย์กลางเอกสารสำหรับไฟล์ [app/page.tsx](../app/page.tsx) โดยเน้น Thai + English technical terms และลงรายละเอียดเชิงสถาปัตยกรรมเพื่อใช้ทั้งอ่านโค้ด, review, และ onboarding

## Scope
- In scope: เฉพาะ behavior และ architecture ที่อยู่ใน [app/page.tsx](../app/page.tsx)
- Out of scope: backend/service ภายนอกไฟล์นี้, infra/deployment pipeline, และไฟล์ pattern แยกใน [src/patterns](../src/patterns)

## Quick Overview
- ไฟล์นี้เป็น single-page React client component ที่รวมหลาย design patterns ใน production-like UI
- มี content model หลายชนิด (projects, blogs, articles, docs, podcast) แล้ว normalize เป็น `UnifiedContentItem`
- ใช้ context + command + visitor + mediator + state machine เพื่อควบคุม interaction ที่ซับซ้อน

## Reading Modes
- Quick Read Mode (สั้นอ่านไว): [Quick Read Brief](./summary-quickread.md)
- Technical RFC Mode (ละเอียดเชิงสถาปัตยกรรม): [Technical RFC](./summary-rfc.md)

## Document Map
- [Architecture Deep Dive](./summary-architecture.md)
- [Design Patterns Catalog](./summary-patterns.md)
- [Components and State Flow](./summary-components-state.md)
- [Risks and Refactor Roadmap](./summary-risks-refactor.md)
- [Onboarding Guide](./summary-onboarding.md)
- [Symbol-to-Symbol Flow Reference](./summary-symbol-flow.md)

## Suggested Reading Paths
- New contributor path:
  1. [Onboarding Guide](./summary-onboarding.md)
  2. [Architecture Deep Dive](./summary-architecture.md)
  3. [Components and State Flow](./summary-components-state.md)
- Pattern-focused path:
  1. [Design Patterns Catalog](./summary-patterns.md)
  2. [Architecture Deep Dive](./summary-architecture.md)
- Refactor path:
  1. [Risks and Refactor Roadmap](./summary-risks-refactor.md)
  2. [Components and State Flow](./summary-components-state.md)

## Task-Based TOC
### For Reviewer
1. [Quick Read Brief](./summary-quickread.md)
2. [Symbol-to-Symbol Flow Reference](./summary-symbol-flow.md)
3. [Risks and Refactor Roadmap](./summary-risks-refactor.md)

### For Maintainer
1. [Technical RFC](./summary-rfc.md)
2. [Architecture Deep Dive](./summary-architecture.md)
3. [Components and State Flow](./summary-components-state.md)
4. [Onboarding Guide](./summary-onboarding.md)

### For Feature Dev
1. [Quick Read Brief](./summary-quickread.md)
2. [Design Patterns Catalog](./summary-patterns.md)
3. [Symbol-to-Symbol Flow Reference](./summary-symbol-flow.md)
4. [Onboarding Guide](./summary-onboarding.md)

## Key Symbols (Fast Index)
- Data normalization: `adaptProjectToUnified`, `adaptBlogToUnified`, `adaptVideoToUnified`, `adaptArticleToUnified`, `adaptDocToUnified`, `adaptPodcastToUnified`
- Tree and composition: `ContentBuilder`, `CompositeNode`, `LeafNode`, `InteractiveContentNode`
- System orchestration: `AppSystemFacade`, `NotificationService`, `ToastEventEmitter`
- User interaction: `CommandPalette`, `TourIterator`, `ContactFormMediator`, `AudioPlayerContext`
- Analytics and feed engine: `MetricsVisitor`, `TagsVisitor`, `FilterHandler` chain, `ISortStrategy`

## Symbol-to-Symbol Examples (Short)
- Startup chain: `PersonalWebsite.useEffect` -> `AppSystemFacade.initializeSystem` -> `NotificationService.setChannel` -> `AnalyticsSystem.init` -> state setters (`setDark`, `setStyle`, `setFont`, `setAdmin`, `setLang`)
- Feed chain: `UnifiedFeedSection` -> `TypeFilter.handle` -> `SearchFilter.handle` -> `TagFilter.handle` -> `ISortStrategy.sort` -> `ContentLayoutFactory`
- Notification chain: `notify.notify` -> `NotificationService.channel.send` -> `ToastEventEmitter.emit` -> `ToastContainer.subscribe` -> toast render
- Tour chain: `StartTourCommand.execute` -> `setIsTourActive` + `tourIterator.reset` -> `TourControls` -> `handleTourStep` -> `setActiveTab` / `setActiveNodeId`

## Maintenance Notes
- เอกสารชุดนี้ตั้งใจให้ sync กับ [app/page.tsx](../app/page.tsx) เท่านั้น
- ถ้ามีการย้ายโค้ดจาก monolith ไป module ย่อย ให้ปรับทั้ง map และ onboarding section พร้อมกัน
