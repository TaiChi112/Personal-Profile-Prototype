export interface SyncTask {
  id: string;
  url: string;
  method: string;
  body: any;
  timestamp: number;
}

export class OfflineSyncQueue {
  private queueKey = 'offline-sync-queue';

  constructor(queueKey?: string) {
    if (queueKey) {
      this.queueKey = queueKey;
    }
  }

  public enqueue(task: Omit<SyncTask, 'id' | 'timestamp'>): void {
    const queue = this.getAll();
    const newTask: SyncTask = {
      ...task,
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15),
      timestamp: Date.now(),
    };
    queue.push(newTask);
    this.saveQueue(queue);
  }

  public getAll(): SyncTask[] {
    if (typeof window === 'undefined') return [];
    
    try {
      const data = localStorage.getItem(this.queueKey);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Error reading from localStorage:', e);
      return [];
    }
  }

  public dequeue(): SyncTask | undefined {
    const queue = this.getAll();
    const task = queue.shift();
    this.saveQueue(queue);
    return task;
  }

  public remove(id: string): void {
    const queue = this.getAll();
    const filtered = queue.filter(task => task.id !== id);
    this.saveQueue(filtered);
  }

  public clear(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.queueKey);
    }
  }

  private saveQueue(queue: SyncTask[]): void {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(this.queueKey, JSON.stringify(queue));
      } catch (e) {
        console.error('Error saving to localStorage:', e);
      }
    }
  }
}
