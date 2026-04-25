# Singleton Pattern - Notification System

```mermaid
classDiagram
    class NotificationService {
        -static instance: NotificationService
        -channel: INotificationChannel
        -constructor()
        +static getInstance() NotificationService
        +setChannel(channel: INotificationChannel) void
        +notify(message: string, type: EventType) void
    }
    
    class INotificationChannel {
        <<interface>>
        +send(message: string, type: EventType) void
    }
    
    class ToastChannel {
        +send(message: string, type: EventType) void
    }
    
    class ConsoleChannel {
        +send(message: string, type: EventType) void
    }
    
    class AlertChannel {
        +send(message: string, type: EventType) void
    }
    
    class ToastEventEmitter {
        -static instance: ToastEventEmitter
        -observers: Observer[]
        -constructor()
        +static getInstance() ToastEventEmitter
        +emit(message: string, type: EventType) void
        +subscribe(observer: Observer) void
        +unsubscribe(observer: Observer) void
    }
    
    NotificationService --> INotificationChannel: uses
    INotificationChannel <|.. ToastChannel
    INotificationChannel <|.. ConsoleChannel
    INotificationChannel <|.. AlertChannel
    ToastChannel --> ToastEventEmitter: uses
    
    note for NotificationService "Singleton ensures single\nnotification service instance"
    note for ToastEventEmitter "Helper singleton for\ntoast event management"
```

## Description
- **NotificationService**: Singleton class สำหรับจัดการการแจ้งเตือน ใช้ Bridge pattern กับ INotificationChannel
- **INotificationChannel**: Interface สำหรับช่องทางการแจ้งเตือนต่างๆ
- **ToastChannel/ConsoleChannel/AlertChannel**: Concrete implementations ของช่องทางแจ้งเตือน
- **ToastEventEmitter**: Helper singleton สำหรับจัดการ observers ของ toast notifications
