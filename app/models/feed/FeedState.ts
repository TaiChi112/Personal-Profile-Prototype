import type { FeedViewState } from '../../interfaces/feed';

export class FeedStateMemento {
  constructor(private readonly state: FeedViewState) {}

  getState(): FeedViewState {
    return this.state;
  }
}

export class FeedStateCaretaker {
  private snapshots: Map<string, FeedStateMemento> = new Map();

  saveSnapshot(name: string, memento: FeedStateMemento): void {
    this.snapshots.set(name, memento);
  }

  getSnapshot(name: string): FeedStateMemento | undefined {
    return this.snapshots.get(name);
  }

  getSnapshotNames(): string[] {
    return Array.from(this.snapshots.keys());
  }
}
