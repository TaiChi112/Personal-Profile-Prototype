# Features Guide - Composition-Root Friendly Modules

## Quick Summary
`app/features` ใช้เป็น boundary ของ feature modules และ orchestration hooks เพื่อลด complexity ใน `app/page.tsx`.

## Current Implementation Anchors
- `app/features/composition/useContentTabMapper.tsx`
- `app/features/composition/useProjectTreeState.ts`
- `app/features/composition/useTourCommandOrchestration.tsx`
- `app/features/composition/useCommandList.tsx`
- `app/features/composition/navConfig.tsx`
- `app/features/composition/NavigationShell.tsx`
- `app/features/sections/*`

## Scale Strategy
- Bottleneck 1: cross-feature dependency leakage
  - Solution: enforce one-way dependency (features -> shared only)
- Bottleneck 2: page-level state wiring โตเกิน
  - Solution: move orchestration into dedicated hooks per concern

## Related Patterns
- Command, Iterator, Facade, Mediator (through integration points)

## Scale TODO (3 features)
1. Add feature manifest registry so new sections can be plugged without editing central switch logic.
2. Introduce feature-level lazy loading for heavy sections and analytics widgets.
3. Add feature boundary tests to prevent imports from one feature into another feature internals.
