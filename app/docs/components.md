# Components Guide - UI Composition Boundaries

## Quick Summary
`app/components` ควรโฟกัส UI rendering และ interaction behavior ไม่แบก domain orchestration หนักเกินไป.

## Current Implementation Anchors
- `app/components/content/ProtectedDecoratedContent.tsx`
- `app/components/content/InteractiveContentNode.tsx`
- `app/components/feed/FeedItemCard.tsx`
- `app/components/system/ParticleBackground.tsx`

## Scale Strategy
- Bottleneck 1: deep component tree render cost สูงเมื่อ data โต
  - Solution: memoization + virtualization for large trees/lists
- Bottleneck 2: UI policy (decoration/protection) hardcoded
  - Solution: inject style/policy adapters via props or context

## Related Patterns
- Decorator, Proxy, Composite, Flyweight

## Scale TODO (3 features)
1. Add tree virtualization for large content hierarchies (>1000 nodes).
2. Introduce composable decorator stack API for badges/borders/status overlays.
3. Add component-level error boundaries for content and feed rendering zones.
