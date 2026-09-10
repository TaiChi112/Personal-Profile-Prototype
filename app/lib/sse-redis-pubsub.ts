import { EventEmitter } from 'events';

class MockRedisSubscriber extends EventEmitter {
  private channels: Set<string> = new Set();
  private intervalId: NodeJS.Timeout | null = null;

  constructor() {
    super();
  }

  subscribe(channel: string, callback?: (err: Error | null, count: number) => void) {
    this.channels.add(channel);
    if (!this.intervalId) {
      this.startMockMessages();
    }
    console.log(`[MockRedis] Subscribed to ${channel}`);
    if (callback) {
      callback(null, this.channels.size);
    }
  }

  unsubscribe(channel: string, callback?: (err: Error | null, count: number) => void) {
    this.channels.delete(channel);
    console.log(`[MockRedis] Unsubscribed from ${channel}`);
    if (this.channels.size === 0 && this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    if (callback) {
      callback(null, this.channels.size);
    }
  }

  private startMockMessages() {
    this.intervalId = setInterval(() => {
      for (const channel of this.channels) {
        if (channel.startsWith('live-viewers:')) {
          const streamId = channel.split(':')[1];
          const viewers = Math.floor(Math.random() * 5000) + 500;
          this.emit('message', channel, JSON.stringify({ streamId, viewers, timestamp: Date.now() }));
        }
      }
    }, 3000);
  }

  quit() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.removeAllListeners();
    this.channels.clear();
    console.log('[MockRedis] Disconnected');
  }
}

export const sseRedisPubSub = new MockRedisSubscriber();
