# Builder Pattern Edit - Full-Scale with Director

```mermaid
classDiagram
    class IContentBuilder {
        <<interface>>
        +reset(rootId, layout, title?) void
        +addContainer(id, layout, title?, data?) IContentBuilder
        +addItem(item: UnifiedContentItem) IContentBuilder
        +up() IContentBuilder
        +getTree() CompositeNode
    }
    
    class JSONContentBuilder {
        -root: CompositeNode
        -currentContainer: CompositeNode
        -stack: CompositeNode[]
        +reset(rootId, layout, title?) void
        +addContainer(id, layout, title?, data?) IContentBuilder
        +addItem(item: UnifiedContentItem) IContentBuilder
        +up() IContentBuilder
        +getTree() CompositeNode
    }
    
    class ContentDirector {
        -builder: IContentBuilder
        +setBuilder(builder: IContentBuilder) void
        +buildHomepage(projects, blogs) CompositeNode
        +buildProjectsPage(projects) CompositeNode
        +buildBlogGrid(blogs) CompositeNode
        +buildTimeline(items) CompositeNode
    }
    
    class CompositeNode {
        +id: string
        +type: "container"
        +layoutStyle: LayoutStyleType
        +children: LayoutNode[]
        +title?: string
        +data?: UnifiedContentItem
    }
    
    class LeafNode {
        +id: string
        +type: "item"
        +data: UnifiedContentItem
    }
    
    class UnifiedContentItem {
        <<interface>>
        +id: string
        +type: string
        +title: string
        +description: string
        +meta: string[]
    }
    
    IContentBuilder <|.. JSONContentBuilder
    ContentDirector --> IContentBuilder: uses
    JSONContentBuilder ..> CompositeNode: creates
    JSONContentBuilder ..> LeafNode: creates
    CompositeNode o-- LeafNode: contains
    LeafNode --> UnifiedContentItem: has
    
    note for ContentDirector "Director encapsulates\nconstruction recipes\nSeparated from Builder"
    note for IContentBuilder "Builder interface\nallows polymorphism"
```

## Description - Edit Version
- **IContentBuilder**: Builder interface สำหรับ polymorphism
- **JSONContentBuilder**: Concrete builder implementation
- **ContentDirector**: Separates construction recipes
- **CompositeNode/LeafNode**: Products being built
- **Key Features:**
  - Strict separation: Director (recipes) vs Builder (steps)
  - Interface-based: supports multiple builder types
  - Method chaining enabled
  - Director provides high-level recipes
