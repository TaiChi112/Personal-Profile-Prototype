# Abstract Factory Edit - Structured Design System

```mermaid
classDiagram
    class ThemeFactory {
        <<interface>>
        +name: string
        +tokens: DesignTokens
        +getButtons() Record~ButtonVariant, ButtonStyle~
        +getCard() CardStyle
        +getNavbar() NavbarStyle
    }
    
    class ModernTheme {
        +name: string
        +tokens: DesignTokens
        +getButtons() Record~ButtonVariant, ButtonStyle~
        +getCard() CardStyle
        +getNavbar() NavbarStyle
    }
    
    class MinimalTheme {
        +name: string
        +tokens: DesignTokens
        +getButtons() Record~ButtonVariant, ButtonStyle~
        +getCard() CardStyle
        +getNavbar() NavbarStyle
    }
    
    class ButtonStyle {
        +root: string
        +label: string
        +icon: string
    }
    
    class CardStyle {
        +container: string
        +header: string
        +body: string
        +footer: string
    }
    
    class NavbarStyle {
        +root: string
        +item: string
        +activeItem: string
    }
    
    class DesignTokens {
        +colors: object
        +borderRadius: string
    }
    
    ThemeFactory <|.. ModernTheme
    ThemeFactory <|.. MinimalTheme
    ThemeFactory ..> ButtonStyle: creates
    ThemeFactory ..> CardStyle: creates
    ThemeFactory ..> NavbarStyle: creates
    ThemeFactory --> DesignTokens: has
    
    note for ThemeFactory "Record type enforces\nall variants present\nStrict type safety"
    note for ButtonStyle "Compound component\nstructure (root, label, icon)"
```

## Description
- **ThemeFactory**: Abstract factory with structured components
- **ButtonStyle/CardStyle**: Structured component styles
- **DesignTokens**: Reusable design tokens
- **Key Features:**
  - Record<ButtonVariant, ButtonStyle> ensures all variants
  - Compound components (root, label, icon)
  - Separation of tokens from components
