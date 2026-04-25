# Factory Method Edit - Type-Safe i18n Engine

```mermaid
classDiagram
    class LocaleFactory {
        <<interface>>
        +code: string
        +createTranslations() TranslationSchema
    }
    
    class EnglishFactory {
        +code: string
        +createTranslations() TranslationSchema
    }
    
    class ThaiFactory {
        +code: string
        +createTranslations() TranslationSchema
    }
    
    class TranslationSchema {
        <<interface>>
        +common: object
        +auth: object
        +errors: object
    }
    
    class I18nEngine~T~ {
        -factory: LocaleFactory
        -cache: TranslationSchema
        +t~K~(path: K, params?) string
        +switchLocale(factory: LocaleFactory) void
    }
    
    LocaleFactory <|.. EnglishFactory
    LocaleFactory <|.. ThaiFactory
    LocaleFactory ..> TranslationSchema: creates
    I18nEngine --> LocaleFactory: uses
    I18nEngine ..> TranslationSchema: caches
    
    note for TranslationSchema "Template Literal Types\nfor type-safe paths\n'nav.home' checked at compile"
    note for I18nEngine "Generic engine with\nstrict interpolation\nand hot-swapping"
```

## Description
- **LocaleFactory**: Interface สำหรับ language factories
- **TranslationSchema**: Schema with functions for interpolation
- **I18nEngine**: Generic engine รองรับ type-safe dot notation
- **Key Features:**
  - Template Literal Types for path ('nav.home')
  - Strict interpolation with required params
  - Hot-swapping locales
