# App Documentation Hub

เอกสารชุดนี้เป็นศูนย์กลางสำหรับ architecture ใน `app/` โดยเน้น GoF patterns ที่ใช้งานจริงและแนวทาง scale แบบ practical.

## How to Use
- เริ่มที่ folder guides เพื่อเข้าใจ boundary ของ layer
- ตามด้วย pattern guides เพื่อดู intent + implementation anchor
- ทุกเอกสารมี `Scale TODO (3 features)` สำหรับ roadmap ต่อได้ทันที

## Folder Guides
- [Models Guide](./models.md)
- [Services Guide](./services.md)
- [Components Guide](./components.md)
- [Features Guide](./features.md)
- [Interfaces Guide](./interfaces.md)
- [Types Guide](./types.md)
- [Data Guide](./data.md)

## Pattern Guides (22 implemented)
1. [01 Singleton](./patterns/01-singleton.md)
2. [02 Factory Method](./patterns/02-factory-method.md)
3. [03 Abstract Factory](./patterns/03-abstract-factory.md)
4. [04 Builder](./patterns/04-builder.md)
5. [05 Prototype](./patterns/05-prototype.md)
6. [06 Adapter](./patterns/06-adapter.md)
7. [07 Bridge](./patterns/07-bridge.md)
8. [08 Composite](./patterns/08-composite.md)
9. [09 Decorator](./patterns/09-decorator.md)
10. [10 Facade](./patterns/10-facade.md)
11. [11 Proxy](./patterns/11-proxy.md)
12. [12 Flyweight](./patterns/12-flyweight.md)
13. [13 Chain of Responsibility](./patterns/13-chain-of-responsibility.md)
14. [14 Command](./patterns/14-command.md)
15. [15 Iterator](./patterns/15-iterator.md)
16. [16 Mediator](./patterns/16-mediator.md)
17. [17 Memento](./patterns/17-memento.md)
18. [18 Observer](./patterns/18-observer.md)
19. [19 State](./patterns/19-state.md)
20. [20 Strategy](./patterns/20-strategy.md)
21. [21 Template Method](./patterns/21-template-method.md)
22. [22 Visitor](./patterns/22-visitor.md)

## Pattern-to-Implementation Quick Matrix
- Singleton: `app/services/system/notification/NotificationBridge.ts`, `app/models/command/Commands.ts`
- Factory/Abstract Factory: `app/models/theme/ThemeConfig.ts`
- Builder/Adapter: `app/services/content/ContentTreeSetup.ts`
- Composite: `app/interfaces/content-tree.ts`, `app/components/content/InteractiveContentNode.tsx`
- Decorator/Proxy: `app/components/content/ProtectedDecoratedContent.tsx`
- Facade: `app/services/system/AppSystemFacade.ts`
- Flyweight: `app/components/system/ParticleBackground.tsx`
- CoR/Strategy/Memento: `app/models/feed/*`
- Iterator: `app/models/tour/Tour.ts`
- Mediator: `app/services/contact/ContactFormMediator.ts`
- Observer/Bridge: `app/services/system/notification/NotificationBridge.ts`
- State: `app/models/podcast/AudioPlayerStateMachine.ts`
- Template Method: `app/services/content/ResumeExporters.ts`
- Visitor: `app/services/content/ContentTreeAnalysis.ts`

## Scope Notes
- อยู่ในขอบเขต `app/` เท่านั้น
- Interpreter ยังไม่อยู่ใน production implementation ของ `app/` จึงไม่รวมในชุดนี้
