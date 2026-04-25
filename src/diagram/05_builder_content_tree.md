# Builder Pattern - Content Tree Builder

```mermaid
classDiagram
    class ContentBuilder {
        -root: CompositeNode
        -currentContainer: CompositeNode
        -stack: CompositeNode[]
        +constructor(id, layoutStyle, title, data)
        +addContainer(id, layoutStyle, title, data) ContentBuilder
        +addItem(id, data) ContentBuilder
        +endContainer() ContentBuilder
        +build() CompositeNode
    }
    
    class LayoutNode {
        <<interface>>
        +id: string
        +type: ComponentType
    }
    
    class LeafNode {
        +id: string
        +type: "item"
        +data: UnifiedContentItem
    }
    
    class CompositeNode {
        +id: string
        +type: "container"
        +layoutStyle: LayoutStyleType
        +children: LayoutNode[]
        +title?: string
        +colSpan?: number
        +data?: UnifiedContentItem
    }
    
    class UnifiedContentItem {
        <<interface>>
        +id: string
        +type: string
        +title: string
        +description: string
        +date: string
        +imageUrl?: string
        +meta: string[]
        +actionLink?: string
        +decorations?: string[]
        +isLocked?: boolean
    }
    
    LayoutNode <|.. LeafNode
    LayoutNode <|.. CompositeNode
    ContentBuilder --> CompositeNode: builds
    CompositeNode --> LayoutNode: contains
    LeafNode --> UnifiedContentItem: has
    
    note for ContentBuilder "Builder Pattern with\nmethod chaining for\nconstructing tree structures"
```

## Description
- **ContentBuilder**: Builder class ที่ construct hierarchical content structures แบบ step-by-step
- **LayoutNode**: Base interface สำหรับ tree nodes
- **LeafNode**: Represents single content item (no children)
- **CompositeNode**: Container ที่มี children และ layout style
- **UnifiedContentItem**: Normalized data type สำหรับ content
- Method chaining enables readable tree construction
