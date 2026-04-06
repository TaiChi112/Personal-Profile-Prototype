export type EventType = 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';

export interface NotificationEvent {
  message: string;
  type: EventType;
  id: number;
}

type Observer = (event: NotificationEvent) => void;

interface INotificationChannel {
  send(message: string, type: EventType): void;
}

class ToastEventEmitter {
  private observers: Observer[] = [];
  private static instance: ToastEventEmitter;
  private static idCounter = 0;

  private constructor() {}

  static getInstance(): ToastEventEmitter {
    if (!ToastEventEmitter.instance) {
      ToastEventEmitter.instance = new ToastEventEmitter();
    }
    return ToastEventEmitter.instance;
  }

  subscribe(observer: Observer): () => void {
    this.observers.push(observer);
    return () => {
      this.observers = this.observers.filter((entry) => entry !== observer);
    };
  }

  emit(message: string, type: EventType) {
    const event: NotificationEvent = { message, type, id: ++ToastEventEmitter.idCounter };
    this.observers.forEach((observer) => observer(event));
  }
}

class ToastChannel implements INotificationChannel {
  send(message: string, type: EventType): void {
    ToastEventEmitter.getInstance().emit(message, type);
  }
}

class ConsoleChannel implements INotificationChannel {
  send(message: string, type: EventType): void {
    const styles = {
      INFO: 'color: #3b82f6; font-weight: bold;',
      SUCCESS: 'color: #10b981; font-weight: bold;',
      WARNING: 'color: #f59e0b; font-weight: bold;',
      ERROR: 'color: #ef4444; font-weight: bold;',
    };
    console.log(`%c[${type}] %c${message}`, styles[type] || '', 'color: inherit;');
  }
}

class AlertChannel implements INotificationChannel {
  send(message: string, type: EventType): void {
    if (type === 'ERROR' || type === 'WARNING') {
      alert(`[${type}] ${message}`);
    } else {
      console.log(`[${type}] ${message}`);
    }
  }
}

class NotificationService {
  private channel: INotificationChannel;
  private static instance: NotificationService;

  private constructor() {
    this.channel = new ToastChannel();
  }

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  setChannel(channel: INotificationChannel) {
    this.channel = channel;
    this.notify(`Switched notification channel to ${channel.constructor.name}`, 'INFO');
  }

  notify(message: string, type: EventType = 'INFO') {
    this.channel.send(message, type);
  }
}

const notify = NotificationService.getInstance();

export function setNotificationChannel(channelName: 'Toast' | 'Console' | 'Alert') {
  if (channelName === 'Toast') notify.setChannel(new ToastChannel());
  else if (channelName === 'Console') notify.setChannel(new ConsoleChannel());
  else notify.setChannel(new AlertChannel());
}

export function subscribeToToasts(observer: Observer): () => void {
  return ToastEventEmitter.getInstance().subscribe(observer);
}

export { notify };
