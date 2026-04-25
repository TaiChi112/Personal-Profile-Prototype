# Singleton Pattern - Command History

```mermaid
classDiagram
    class CommandHistory {
        -static instance: CommandHistory
        -history: ICommand[]
        -MAX_HISTORY: number
        -constructor()
        +static getInstance() CommandHistory
        +push(command: ICommand) void
        +pop() ICommand
        +isEmpty() boolean
        +size() number
        +clear() void
        +getHistory() ICommand[]
        +findCommands(query: string) ICommand[]
    }
    
    class ICommand {
        <<interface>>
        +id: string
        +label: string
        +execute() void
        +undo() void
        +matches(query: string) boolean
    }
    
    class MockCommand {
        +id: string
        +label: string
        +execute() void
        +undo() void
        +matches(query: string) boolean
    }
    
    CommandHistory --> ICommand: manages
    ICommand <|.. MockCommand
    
    note for CommandHistory "Singleton maintains single\nhistory stack across app\nLimited to 20 commands"
```

## Description
- **CommandHistory**: Singleton class ที่จัดการ undo/redo history แบบ centralized
- **ICommand**: Interface สำหรับ commands ที่สามารถ execute และ undo ได้
- **MockCommand**: Example concrete command implementation
- Maintains maximum 20 commands เพื่อป้องกัน memory bloat
