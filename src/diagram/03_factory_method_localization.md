# Factory Method Pattern - Localization

```mermaid
classDiagram
    class LocalizationFactory {
        <<interface>>
        +getLabels() UILabels
        +getLanguageCode() string
    }
    
    class EnglishLocalization {
        +getLabels() UILabels
        +getLanguageCode() string
    }
    
    class ThaiLocalization {
        +getLabels() UILabels
        +getLanguageCode() string
    }
    
    class UILabels {
        <<interface>>
        +nav: object
        +hero: object
        +sections: object
        +actions: object
    }
    
    LocalizationFactory <|.. EnglishLocalization
    LocalizationFactory <|.. ThaiLocalization
    EnglishLocalization ..> UILabels: creates
    ThaiLocalization ..> UILabels: creates
    
    note for LocalizationFactory "Factory Method Pattern\nEach factory creates\nlanguage-specific labels"
```

## Description
- **LocalizationFactory**: Interface ที่ define factory method `getLabels()`
- **EnglishLocalization/ThaiLocalization**: Concrete factories ที่สร้าง UILabels สำหรับแต่ละภาษา
- **UILabels**: Product interface ที่มี labels สำหรับ nav, hero, sections, actions
- Add ภาษาใหม่โดยสร้าง concrete factory class
