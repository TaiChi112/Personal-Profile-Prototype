export interface TourStep {
  type: 'NAV' | 'EXPAND' | 'RESET_EXPAND';
  targetId?: string;
  label?: string;
  description?: string;
  hint?: string;
  highlightId?: string;
}

export interface IIterator<T> {
  next(): T | null;
  prev(): T | null;
  hasNext(): boolean;
  hasPrev(): boolean;
  current(): T;
  reset(): void;
  jumpTo(item: T): void;
}

export class TourIterator implements IIterator<TourStep> {
  private position = 0;

  constructor(private readonly steps: TourStep[]) {}

  next(): TourStep | null {
    if (this.hasNext()) {
      this.position++;
      return this.steps[this.position];
    }
    return null;
  }

  prev(): TourStep | null {
    if (this.hasPrev()) {
      this.position--;
      return this.steps[this.position];
    }
    return null;
  }

  hasNext(): boolean {
    return this.position < this.steps.length - 1;
  }

  hasPrev(): boolean {
    return this.position > 0;
  }

  current(): TourStep {
    return this.steps[this.position];
  }

  reset(): void {
    this.position = 0;
  }

  jumpTo(step: TourStep): void {
    const index = this.steps.indexOf(step);
    if (index !== -1) {
      this.position = index;
      return;
    }
    if (step.targetId !== undefined) {
      const fallback = this.steps.findIndex(
        (s) => s.type === step.type && s.targetId === step.targetId
      );
      if (fallback !== -1) {
        this.position = fallback;
      }
    }
  }
}
