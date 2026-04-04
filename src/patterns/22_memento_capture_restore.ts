/**
 * MEMENTO PATTERN - Capture & Restore State
 * 
 * Problem: page.tsx needs undo/redo with full state saving
 *          - Save application state at checkpoints
 *          - Restore to any previous point
 *          - Don't expose internal state structure
 * 
 * Solution: Create memento to capture state snapshot
 *          Caretaker manages collection of mementos
 */

// ====================================
// MEMENTO - Snapshot of state
// ====================================

export interface AppState {
  theme: string;
  language: string;
  userName: string;
  dataVersion: number;
}

/**
 * Memento - stores snapshot of state
 * Client cannot access memento details
 */
export class Memento {
  constructor(private state: AppState, private timestamp: Date) {}

  getState(): AppState {
    return JSON.parse(JSON.stringify(this.state)); // Deep copy
  }

  getTimestamp(): Date {
    return this.timestamp;
  }

  getDescription(): string {
    return `Snapshot at ${this.timestamp.toLocaleTimeString()} (v${this.state.dataVersion})`;
  }
}

// ====================================
// ORIGINATOR - Creates & restores mementos
// ====================================

/**
 * Originator - the object whose state is being saved
 */
export class Application {
  private state: AppState = {
    theme: 'light',
    language: 'en',
    userName: 'Guest',
    dataVersion: 1,
  };

  /**
   * Create memento of current state
   */
  createMemento(): Memento {
    return new Memento(this.state, new Date());
  }

  /**
   * Restore from memento
   */
  restoreFromMemento(memento: Memento): void {
    this.state = memento.getState();
    console.log(`[App] Restored state: ${memento.getDescription()}`);
  }

  /**
   * Change state
   */
  setTheme(theme: string): void {
    this.state.theme = theme;
    this.state.dataVersion++;
    console.log(`[App] Theme changed to: ${theme}`);
  }

  setLanguage(language: string): void {
    this.state.language = language;
    this.state.dataVersion++;
    console.log(`[App] Language changed to: ${language}`);
  }

  setUserName(userName: string): void {
    this.state.userName = userName;
    this.state.dataVersion++;
    console.log(`[App] User changed to: ${userName}`);
  }

  getState(): AppState {
    return JSON.parse(JSON.stringify(this.state)); // Deep copy
  }

  getStateDescription(): string {
    return `Theme: ${this.state.theme}, Lang: ${this.state.language}, User: ${this.state.userName}, V${this.state.dataVersion}`;
  }
}

// ====================================
// CARETAKER - Manages mementos
// ====================================

/**
 * Caretaker - stores and manages mementos
 * Only caretaker can create/restore mementos
 */
export class StateManager {
  private mementos: Memento[] = [];
  private currentIndex: number = -1;

  /**
   * Save current state
   */
  save(memento: Memento, label?: string): void {
    // Remove future if we're not at the end
    if (this.currentIndex < this.mementos.length - 1) {
      this.mementos = this.mementos.slice(0, this.currentIndex + 1);
    }
    this.mementos.push(memento);
    this.currentIndex++;
    console.log(`✓ State saved [${this.currentIndex}]: ${label || memento.getDescription()}`);
  }

  /**
   * Can undo?
   */
  canUndo(): boolean {
    return this.currentIndex > 0;
  }

  /**
   * Undo to previous state
   */
  undo(): Memento | null {
    if (this.canUndo()) {
      this.currentIndex--;
      console.log(`↶ Undo to [${this.currentIndex}]`);
      return this.mementos[this.currentIndex];
    }
    console.log('↶ Nothing to undo');
    return null;
  }

  /**
   * Can redo?
   */
  canRedo(): boolean {
    return this.currentIndex < this.mementos.length - 1;
  }

  /**
   * Redo to next state
   */
  redo(): Memento | null {
    if (this.canRedo()) {
      this.currentIndex++;
      console.log(`↷ Redo to [${this.currentIndex}]`);
      return this.mementos[this.currentIndex];
    }
    console.log('↷ Nothing to redo');
    return null;
  }

  /**
   * Jump to specific snapshot
   */
  jumpToSnapshot(index: number): Memento | null {
    if (index >= 0 && index < this.mementos.length) {
      this.currentIndex = index;
      console.log(`⚡ Jumped to snapshot [${index}]`);
      return this.mementos[index];
    }
    return null;
  }

  /**
   * Get history
   */
  getHistory(): string[] {
    return this.mementos.map((m, i) => `[${i}] ${m.getDescription()}`);
  }

  /**
   * Get snapshot count
   */
  getSnapshotCount(): number {
    return this.mementos.length;
  }

  /**
   * Get current index
   */
  getCurrentIndex(): number {
    return this.currentIndex;
  }
}

// ====================================
// UNDO/REDO HANDLER
// ====================================

export class UndoRedoController {
  constructor(
    private app: Application,
    private manager: StateManager
  ) {}

  /**
   * Checkpoint - save current state
   */
  checkpoint(label?: string): void {
    const memento = this.app.createMemento();
    this.manager.save(memento, label);
  }

  /**
   * Undo
   */
  undo(): void {
    const memento = this.manager.undo();
    if (memento) {
      this.app.restoreFromMemento(memento);
    }
  }

  /**
   * Redo
   */
  redo(): void {
    const memento = this.manager.redo();
    if (memento) {
      this.app.restoreFromMemento(memento);
    }
  }

  /**
   * Get status
   */
  getStatus(): {
    canUndo: boolean;
    canRedo: boolean;
    snapshotCount: number;
    currentIndex: number;
  } {
    return {
      canUndo: this.manager.canUndo(),
      canRedo: this.manager.canRedo(),
      snapshotCount: this.manager.getSnapshotCount(),
      currentIndex: this.manager.getCurrentIndex(),
    };
  }

  /**
   * Get history
   */
  getHistory(): string[] {
    return this.manager.getHistory();
  }
}

// ====================================
// DEMO
// ====================================

export function demoMementoPattern() {
  console.log('\n💾 MEMENTO PATTERN - Capture & Restore State\n');

  const app = new Application();
  const manager = new StateManager();
  const controller = new UndoRedoController(app, manager);

  // Initial state
  controller.checkpoint('Initial');

  // Make changes
  console.log('\n=== Making Changes ===\n');
  app.setTheme('dark');
  controller.checkpoint('Theme: Dark');

  app.setLanguage('th');
  controller.checkpoint('Language: Thai');

  app.setUserName('John Doe');
  controller.checkpoint('User: John');

  console.log(`\nCurrent state: ${app.getStateDescription()}`);

  // Undo operations
  console.log('\n=== Undoing ===\n');
  controller.undo();
  console.log(`State: ${app.getStateDescription()}`);

  controller.undo();
  console.log(`State: ${app.getStateDescription()}`);

  // Redo
  console.log('\n=== Redoing ===\n');
  controller.redo();
  console.log(`State: ${app.getStateDescription()}`);

  // History
  console.log('\n📋 History:');
  controller.getHistory().forEach((entry) => console.log(`  ${entry}`));

  const status = controller.getStatus();
  console.log(`\n📊 Status:`);
  console.log(`  Can undo: ${status.canUndo}`);
  console.log(`  Can redo: ${status.canRedo}`);
  console.log(`  Snapshots: ${status.snapshotCount}`);
  console.log(`  Current: [${status.currentIndex}]`);

  console.log('\n✅ Memento Pattern Benefits:');
  console.log('  ✓ Capture state snapshots');
  console.log('  ✓ Restore to any previous point');
  console.log('  ✓ Don\'t expose internal state');
  console.log('  ✓ Support undo/redo');
  console.log('  ✓ Full state management without mutable references');
}
