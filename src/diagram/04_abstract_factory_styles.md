# Abstract Factory Pattern - Theming System

```mermaid
classDiagram
    class StyleFactory {
        <<interface>>
        +name: string
        +getMainLayoutClass() string
        +getCardClass() string
        +getButtonClass(variant) string
        +getNavbarClass() string
        +getBadgeClass(type) string
        +getSectionTitleClass() string
        +getContainerClass(type) string
        +getModalClass() string
        +getToastClass(type) string
        +getLockedOverlayClass() string
        +getTourOverlayClass() string
    }
    
    class ModernStyle {
        +name: string
        +getMainLayoutClass() string
        +getCardClass() string
        +getButtonClass(variant) string
        +getNavbarClass() string
        +getBadgeClass(type) string
        +getSectionTitleClass() string
        +getContainerClass(type) string
        +getModalClass() string
        +getToastClass(type) string
        +getLockedOverlayClass() string
        +getTourOverlayClass() string
    }
    
    class MinimalStyle {
        +name: string
        +getMainLayoutClass() string
        +getCardClass() string
        +getButtonClass(variant) string
        +getNavbarClass() string
        +getBadgeClass(type) string
        +getSectionTitleClass() string
        +getContainerClass(type) string
        +getModalClass() string
        +getToastClass(type) string
        +getLockedOverlayClass() string
        +getTourOverlayClass() string
    }
    
    class FutureStyle {
        +name: string
        +getMainLayoutClass() string
        +getCardClass() string
        +getButtonClass(variant) string
        +getNavbarClass() string
        +getBadgeClass(type) string
        +getSectionTitleClass() string
        +getContainerClass(type) string
        +getModalClass() string
        +getToastClass(type) string
        +getLockedOverlayClass() string
        +getTourOverlayClass() string
    }
    
    class AcademicStyle {
        +name: string
        +getMainLayoutClass() string
        +getCardClass() string
        +getButtonClass(variant) string
        +getNavbarClass() string
        +getBadgeClass(type) string
        +getSectionTitleClass() string
        +getContainerClass(type) string
        +getModalClass() string
        +getToastClass(type) string
        +getLockedOverlayClass() string
        +getTourOverlayClass() string
    }
    
    StyleFactory <|.. ModernStyle
    StyleFactory <|.. MinimalStyle
    StyleFactory <|.. FutureStyle
    StyleFactory <|.. AcademicStyle
    
    note for StyleFactory "Abstract Factory creates\nentire family of related\nstyle classes"
```

## Description
- **StyleFactory**: Abstract factory interface ที่ define methods สำหรับสร้าง style objects
- **ModernStyle/MinimalStyle/FutureStyle/AcademicStyle**: Concrete factories แต่ละ theme
- แต่ละ factory สร้าง consistent set ของ styles (buttons, cards, modals, etc.)
- Switch entire theme ได้ในครั้งเดียว
