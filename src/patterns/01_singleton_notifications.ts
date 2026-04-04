/**
 * SINGLETON PATTERN - Notification System
 * 
 * Purpose: Ensure single instance of notification service ให้ใช้ระบบแจ้งเตือนได้อย่างสม่ำเสมอ
 * 
 * Key Classes:
 * - NotificationService (Singleton) - ควบคุมการส่งข้อความแจ้งเตือน
 * - INotificationChannel - Interface สำหรับช่องทางต่างๆ (Toast, Console, Alert)
 * 
 * Benefit: เรียกใช้ notify.getInstance() ได้เสมอ ได้ object เดียวกันตลอดแอป
 */

// ====================================
// Events and Types
// ====================================
type EventType = 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';

interface NotificationEvent {
  message: string;
  type: EventType;
  id: number;
}

type Observer = (event: NotificationEvent) => void;

// ====================================
// Channel Interface (Bridge Pattern)
// ====================================
/**
 * The Bridge interface that lets NotificationService
 * delegate to different channel implementations
 */
interface INotificationChannel {
  send(message: string, type: EventType): void;
}

/** 
 * Toast Channel - emit events to React component observers
 */
class ToastChannel implements INotificationChannel {
  send(message: string, type: EventType): void {
    ToastEventEmitter.getInstance().emit(message, type);
  }
}

/**
 * Console Channel - log to browser console with styling
 */
class ConsoleChannel implements INotificationChannel {
  send(message: string, type: EventType): void {
    const styles = {
      INFO: 'color: #3b82f6; font-weight: bold;',
      SUCCESS: 'color: #10b981; font-weight: bold;',
      WARNING: 'color: #f59e0b; font-weight: bold;',
      ERROR: 'color: #ef4444; font-weight: bold;',
    };
    console.log(
      `%c[${type}] %c${message}`,
      styles[type] || '',
      'color: inherit;'
    );
  }
}

/**
 * Alert Channel - show browser alerts or fallback to console
 */
class AlertChannel implements INotificationChannel {
  send(message: string, type: EventType): void {
    if (type === 'ERROR' || type === 'WARNING') {
      alert(`[${type}] ${message}`);
    } else {
      console.log(`[${type}] ${message}`);
    }
  }
}

// ====================================
// Toast Event Emitter (Helper Singleton)
// ====================================
/**
 * Singleton pattern: Manages observers for toast notifications
 * Acts as the event bus for the ToastChannel
 */
class ToastEventEmitter {
  private observers: Observer[] = [];
  private static instance: ToastEventEmitter;
  private static idCounter = 0;

  private constructor() {}

  /**
   * Singleton accessor
   */
  static getInstance(): ToastEventEmitter {
    if (!ToastEventEmitter.instance) {
      ToastEventEmitter.instance = new ToastEventEmitter();
    }
    return ToastEventEmitter.instance;
  }

  /**
   * Observer subscribes to toast events
   * Returns unsubscribe function
   */
  subscribe(observer: Observer): () => void {
    this.observers.push(observer);
    return () => {
      this.observers = this.observers.filter(obs => obs !== observer);
    };
  }

  /**
   * Emit event to all observers
   */
  emit(message: string, type: EventType): void {
    const event: NotificationEvent = {
      message,
      type,
      id: ++ToastEventEmitter.idCounter
    };
    this.observers.forEach(obs => obs(event));
  }
}

// ====================================
// MAIN SINGLETON: NotificationService
// ====================================
/**
 * Singleton Pattern Implementation
 * 
 * Ensures only ONE instance exists throughout the app lifecycle.
 * Provides unified interface for notifications across different channels.
 */
class NotificationService {
  private channel: INotificationChannel;
  private static instance: NotificationService;

  /**
   * Private constructor prevents direct instantiation
   */
  private constructor() {
    this.channel = new ToastChannel(); // Default channel
  }

  /**
   * SINGLETON: Get or create the single instance
   */
  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  /**
   * Switch notification channel at runtime
   */
  setChannel(channel: INotificationChannel): void {
    this.channel = channel;
    this.notify(
      `Switched notification channel to ${channel.constructor.name}`,
      'INFO'
    );
  }

  /**
   * Send notification using current channel
   */
  notify(message: string, type: EventType = 'INFO'): void {
    this.channel.send(message, type);
  }

  /**
   * Get current channel name
   */
  getChannelName(): string {
    return this.channel.constructor.name;
  }
}

// ====================================
// CLIENT CODE EXAMPLE
// ====================================

/**
 * DEMO: Using Singleton pattern in practice
 */
export function demoSingletonNotifications() {
  console.log('=== SINGLETON PATTERN: Notifications ===\n');

  // Get singleton instance
  const notify1 = NotificationService.getInstance();
  const notify2 = NotificationService.getInstance();

  // Verify they are the SAME instance
  console.log('notify1 === notify2:', notify1 === notify2); // true ✓

  // Use default Toast channel
  notify1.notify('App initialized!', 'INFO');
  notify1.notify('Configuration saved', 'SUCCESS');

  // Switch to Console channel
  console.log('\n--- Switching to Console Channel ---');
  notify1.setChannel(new ConsoleChannel());
  notify1.notify('Now using console channel', 'WARNING');

  // Switch to Alert channel
  console.log('\n--- Switching to Alert Channel ---');
  notify1.setChannel(new AlertChannel());
  // notify1.notify('Critical error detected', 'ERROR'); // Uncomment to test

  // Even though we got notify1 and notify2 at different times,
  // they point to the SAME singleton instance!
  console.log('\nChannel from notify2:', notify2.getChannelName()); // AlertChannel

  console.log('\n✓ Singleton: Only one instance manages all notifications\n');
}

demoSingletonNotifications();

// ====================================
// EXPORTS
// ====================================
export {
  NotificationService,
  ToastEventEmitter,
  type INotificationChannel,
  ToastChannel,
  ConsoleChannel,
  AlertChannel,
  type NotificationEvent,
  type EventType,
  type Observer
};
