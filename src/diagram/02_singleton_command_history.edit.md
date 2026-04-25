# Singleton + Command Pattern Edit - Strict Mode

```mermaid
classDiagram
    class CommandHistory {
        -static instance: CommandHistory
        -history: ICommand[]
        -constructor()
        +static getInstance() CommandHistory
        +push(command: ICommand) void
        +pop() ICommand | undefined
        +getHistory() ICommand[]
    }
    
    class ICommand {
        <<interface>>
        +execute() void
        +undo() void
        +getMetaData() object
    }
    
    class NavigationSystem {
        -currentTab: string
        +navigateTo(tab: string) void
        +getCurrentTab() string
    }
    
    class ThemeService {
        -isDark: boolean
        +enableDarkMode() void
        +disableDarkMode() void
        +isOn() boolean
    }
    
    class NavigateCommand {
        -receiver: NavigationSystem
        -targetTab: string
        -previousTab: string
        +id: string
        +label: string
        +execute() void
        +undo() void
        +getMetaData() object
    }
    
    class ToggleThemeCommand {
        -receiver: ThemeService
        +id: string
        +label: string
        +execute() void
        +undo() void
        +getMetaData() object
    }
    
    CommandHistory --> ICommand: manages
    ICommand <|.. NavigateCommand
    ICommand <|.. ToggleThemeCommand
    NavigateCommand --> NavigationSystem: uses
    ToggleThemeCommand --> ThemeService: uses
    
    note for CommandHistory "Singleton manages\ncommand history"
    note for NavigateCommand "Commands with explicit\nReceiver pattern"
```

## Description
- **CommandHistory**: Singleton จัดการ history กลาง
- **ICommand**: Interface ที่มี getMetaData() สำหรับดึงข้อมูล
- **NavigationSystem/ThemeService**: Receivers ที่เก็บ business logic
- **Commands**: ตัวกลางที่สั่ง Receiver ทำงาน
- Separation of Concerns ชัดเจน
