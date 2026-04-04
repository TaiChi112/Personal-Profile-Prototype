/**
 * COMMAND PATTERN - Encapsulate Requests as Objects
 * 
 * Problem: page.tsx needs to support undo/redo, command queuing, scheduling
 *          - Different actions need different parameters
 *          - Want to defer execution
 *          - Need to log and reverse operations
 * 
 * Solution: Encapsulate request as object, separate requester from executor
 *          Enables undo, queuing, scheduling, logging
 */

// ====================================
// COMMAND INTERFACE
// ====================================

export interface Command {
  execute(): void;
  undo(): void;
  getDescription(): string;
  canUndo(): boolean;
}

// ====================================
// RECEIVER - The object that performs work
// ====================================

export interface Document {
  content: string;
  fontSize: number;
  position: { x: number; y: number };
  getContent(): string;
}

export class SimpleDocument implements Document {
  content: string = '';
  fontSize: number = 12;
  position: { x: number; y: number } = { x: 0, y: 0 };

  getContent(): string {
    return this.content;
  }
  getFontSize(): number {
    return this.fontSize;
  }

  setText(text: string): void {
    console.log(`[Document] Set text: "${text}"`);
    this.content = text;
  }

  setFontSize(size: number): void {
    console.log(`[Document] Set font size: ${size}px`);
    this.fontSize = size;
  }

  setPosition(x: number, y: number): void {
    console.log(`[Document] Move to (${x}, ${y})`);
    this.position = { x, y };
  }

  appendText(text: string): void {
    console.log(`[Document] Append: "${text}"`);
    this.content += text;
  }
}

// ====================================
// CONCRETE COMMANDS
// ====================================

export class SetTextCommand implements Command {
  private previousText: string;
  private newText: string;

  constructor(
    private document: SimpleDocument,
    newText: string
  ) {
    this.newText = newText;
    this.previousText = document.getContent();
  }

  execute(): void {
    this.document.setText(this.newText);
  }

  undo(): void {
    this.document.setText(this.previousText);
  }

  getDescription(): string {
    return `Set text to "${this.newText}"`;
  }

  canUndo(): boolean {
    return true;
  }
}

export class ChangeFontSizeCommand implements Command {
  private previousSize: number;
  private newSize: number;

  constructor(
    private document: SimpleDocument,
    newSize: number
  ) {
    this.newSize = newSize;
    this.previousSize = document.fontSize;
  }

  execute(): void {
    this.document.setFontSize(this.newSize);
  }

  undo(): void {
    this.document.setFontSize(this.previousSize);
  }

  getDescription(): string {
    return `Change font size to ${this.newSize}px`;
  }

  canUndo(): boolean {
    return true;
  }
}

export class MoveCommand implements Command {
  private previousX: number;
  private previousY: number;
  private newX: number;
  private newY: number;

  constructor(
    private document: SimpleDocument,
    newX: number,
    newY: number
  ) {
    this.newX = newX;
    this.newY = newY;
    this.previousX = document.position.x;
    this.previousY = document.position.y;
  }

  execute(): void {
    this.document.setPosition(this.newX, this.newY);
  }

  undo(): void {
    this.document.setPosition(this.previousX, this.previousY);
  }

  getDescription(): string {
    return `Move to (${this.newX}, ${this.newY})`;
  }

  canUndo(): boolean {
    return true;
  }
}

export class MacroCommand implements Command {
  constructor(private commands: Command[]) { }

  execute(): void {
    console.log('[Macro] Executing sequence...');
    this.commands.forEach((cmd) => cmd.execute());
  }

  undo(): void {
    console.log('[Macro] Undoing sequence (reverse order)...');
    for (let i = this.commands.length - 1; i >= 0; i--) {
      this.commands[i].undo();
    }
  }

  getDescription(): string {
    return `Macro: ${this.commands.map((c) => c.getDescription()).join(', ')}`;
  }

  canUndo(): boolean {
    return this.commands.every((c) => c.canUndo());
  }

  addCommand(command: Command): void {
    this.commands.push(command);
  }
}

// ====================================
// INVOKER - Executes commands
// ====================================

export class CommandExecutor {
  private undoStack: Command[] = [];
  private redoStack: Command[] = [];

  /**
   * Execute command and add to undo stack
   */
  execute(command: Command): void {
    console.log(`→ Execute: ${command.getDescription()}`);
    command.execute();
    if (command.canUndo()) {
      this.undoStack.push(command);
      this.redoStack = []; // Clear redo when new command executed
    }
  }

  /**
   * Undo last command
   */
  undo(): void {
    const command = this.undoStack.pop();
    if (command) {
      console.log(`↶ Undo: ${command.getDescription()}`);
      command.undo();
      this.redoStack.push(command);
    } else {
      console.log('↶ Nothing to undo');
    }
  }

  /**
   * Redo last undone command
   */
  redo(): void {
    const command = this.redoStack.pop();
    if (command) {
      console.log(`↷ Redo: ${command.getDescription()}`);
      command.execute();
      this.undoStack.push(command);
    } else {
      console.log('↷ Nothing to redo');
    }
  }

  /**
   * Get undo/redo history
   */
  getHistory(): { undo: string[]; redo: string[] } {
    return {
      undo: this.undoStack.map((c) => c.getDescription()),
      redo: this.redoStack.map((c) => c.getDescription()),
    };
  }

  /**
   * Check if can undo/redo
   */
  canUndo(): boolean {
    return this.undoStack.length > 0;
  }

  canRedo(): boolean {
    return this.redoStack.length > 0;
  }
}

// ====================================
// DEMO
// ====================================

export function demoCommandPattern() {
  console.log('\n📝 COMMAND PATTERN - Encapsulate Requests\n');

  const document = new SimpleDocument();
  const executor = new CommandExecutor();

  // Execute commands
  console.log('=== Executing Commands ===\n');
  executor.execute(new SetTextCommand(document, 'Hello World'));
  executor.execute(new ChangeFontSizeCommand(document, 16));
  executor.execute(new MoveCommand(document, 100, 50));

  console.log('\n📊 History:', executor.getHistory());

  // Undo
  console.log('\n=== Undoing ===\n');
  executor.undo(); // Undo Move
  executor.undo(); // Undo FontSize

  console.log('\n📊 History:', executor.getHistory());

  // Redo
  console.log('\n=== Redoing ===\n');
  executor.redo();

  // Macro command
  console.log('\n=== Macro Command ===\n');
  const macro = new MacroCommand([
    new SetTextCommand(document, 'Macro Text'),
    new ChangeFontSizeCommand(document, 20),
    new MoveCommand(document, 200, 100),
  ]);

  executor.execute(macro);

  console.log('\n📊 Final History:', executor.getHistory());

  console.log('\n✅ Command Pattern Benefits:');
  console.log('  ✓ Encapsulate requests as objects');
  console.log('  ✓ Support undo/redo');
  console.log('  ✓ Queue commands');
  console.log('  ✓ Combine commands (Macro)');
}
