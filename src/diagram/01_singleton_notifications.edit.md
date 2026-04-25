# Singleton Pattern Edit - Strict Notification Hub

```mermaid
classDiagram
    class NotificationHub {
        -static instance: NotificationHub
        -channels: INotificationChannel[]
        -isConfigured: boolean
        -constructor()
        +static getInstance() NotificationHub
        +configure(channels: INotificationChannel[]) void
        +notify(payload: NotificationPayload) void
        +reset() void
    }
    
    class INotificationChannel {
        <<interface>>
        +send(payload: NotificationPayload) void
        +getName() string
    }
    
    class NotificationPayload {
        <<interface>>
        +title: string
        +message: string
        +type: NotificationType
        +timestamp: Date
        +metadata?: Record
    }
    
    class StrictConsoleChannel {
        +send(payload: NotificationPayload) void
        +getName() string
    }
    
    class AuditLogChannel {
        -logs: NotificationPayload[]
        +send(payload: NotificationPayload) void
        +getName() string
    }
    
    class UIToastChannel {
        +send(payload: NotificationPayload) void
        +getName() string
    }
    
    NotificationHub --> INotificationChannel: broadcasts to
    NotificationHub ..> NotificationPayload: uses
    INotificationChannel <|.. StrictConsoleChannel
    INotificationChannel <|.. AuditLogChannel
    INotificationChannel <|.. UIToastChannel
    
    note for NotificationHub "Singleton with\nimmutable configuration\nBroadcasts to multiple channels"
    note for NotificationPayload "Structured payload\nwith type safety"
```

## Description - Edit Version
- **NotificationHub**: Singleton with strict configuration
- **INotificationChannel**: Interface สำหรับ channels
- **NotificationPayload**: Structured, type-safe payload with metadata
- **Channels**: Multiple channel implementations
- **Key Features:**
  - Immutable config: configure() once
  - Composite channels: broadcast to multiple
  - Structured payload: enforces complete data
  - isConfigured flag prevents reconfiguration
