/**
 * SINGLETON PATTERN - Command History
 * 
 * Purpose: Maintain undo/redo history as a single instance across the app
 * 
 * Key Classes:
 * - CommandHistory (Singleton) - เก็บเรื่อย ๆ เฉพาะ 20 commands ล่าสุด
 * 
 * Benefit: ทุก UI component ใช้ historyManager ตัวเดียวกัน ไม่มีการซ้ำซ้อน
 */

// ====================================
// Command Interface
// ====================================
/**
 * Interface that all commands must implement
 */
interface ICommand {
  id: string;
  label: string;
  execute(): void;
  undo(): void;
  matches(query: string): boolean;
}

// ====================================
// SINGLETON: CommandHistory
// ====================================
/**
 * Singleton Pattern for Command History Management
 * 
 * Maintains a stack of executed commands for undo functionality.
 * Only one instance exists for the entire application.
 */
class CommandHistory {
  private history: ICommand[] = [];
  private static instance: CommandHistory;
  private readonly MAX_HISTORY = 20;

  /**
   * Private constructor prevents external instantiation
   */
  private constructor() { }

  /**
   * SINGLETON: Get or create the single instance
   */
  static getInstance(): CommandHistory {
    if (!CommandHistory.instance) {
      CommandHistory.instance = new CommandHistory();
    }
    return CommandHistory.instance;
  }

  /**
   * Add command to history and maintain max size
   */
  push(command: ICommand): void {
    this.history.push(command);
    // Keep only last 20 commands to prevent memory bloat
    if (this.history.length > this.MAX_HISTORY) {
      this.history.shift();
    }
    console.log(`[CommandHistory] Added: ${command.label} (Total: ${this.history.length})`);
  }

  /**
   * Pop last command from history (for undo)
   */
  pop(): ICommand | undefined {
    const command = this.history.pop();
    if (command) {
      console.log(`[CommandHistory] Removed: ${command.label} (Remaining: ${this.history.length})`);
    }
    return command;
  }

  /**
   * Check if history is empty
   */
  isEmpty(): boolean {
    return this.history.length === 0;
  }

  /**
   * Get current history size
   */
  size(): number {
    return this.history.length;
  }

  /**
   * Clear all history
   */
  clear(): void {
    this.history = [];
    console.log('[CommandHistory] Cleared all history');
  }

  /**
   * Get all commands (for debugging)
   */
  getHistory(): ICommand[] {
    return [...this.history];
  }
}

// ====================================
// CONCRETE COMMANDS (Examples)
// ====================================

/**
 * Example: Navigate to a tab
 */
class NavigateCommand implements ICommand {
  private previousTab: string = '';
  public id: string;
  public label: string;
  private targetTab: string;
  private setTab: (tab: string) => void;
  private getCurrentTab: () => string;

  constructor(
    id: string,
    label: string,
    targetTab: string,
    setTab: (tab: string) => void,
    getCurrentTab: () => string
  ) {
    this.id = id;
    this.label = label;
    this.targetTab = targetTab;
    this.setTab = setTab;
    this.getCurrentTab = getCurrentTab;
  }

  execute(): void {
    this.previousTab = this.getCurrentTab();
    this.setTab(this.targetTab);
    CommandHistory.getInstance().push(this);
    console.log(`[NavigateCommand] Executed: ${this.label}`);
  }

  undo(): void {
    this.setTab(this.previousTab);
    console.log(`[NavigateCommand] Undo: Returned to ${this.previousTab}`);
  }

  matches(query: string): boolean {
    return this.label.toLowerCase().includes(query.toLowerCase());
  }
}

/**
 * Example: Toggle dark mode
 */
class ToggleThemeCommand implements ICommand {
  id = 'toggle-theme';
  label = 'Toggle Dark Mode';
  private toggleTheme: () => void;

  constructor(toggleTheme: () => void) {
    this.toggleTheme = toggleTheme;
  }

  execute(): void {
    this.toggleTheme();
    CommandHistory.getInstance().push(this);
    console.log('[ToggleThemeCommand] Theme toggled');
  }

  undo(): void {
    this.toggleTheme();
    console.log('[ToggleThemeCommand] Undo: Theme reverted');
  }

  matches(query: string): boolean {
    const keywords = ['dark', 'theme', 'mode', 'light', 'toggle'];
    return keywords.some(kw => kw.includes(query.toLowerCase()));
  }
}

/**
 * Example: Switch style/theme preset
 */
class SwitchStyleCommand implements ICommand {
  private previousStyle: string = '';
  public id: string;
  public label: string;
  private styleKey: string;
  private setStyle: (style: string) => void;
  private getCurrentStyle: () => string;

  constructor(
    id: string,
    label: string,
    styleKey: string,
    setStyle: (style: string) => void,
    getCurrentStyle: () => string
  ) {
    this.id = id;
    this.label = label;
    this.styleKey = styleKey;
    this.setStyle = setStyle;
    this.getCurrentStyle = getCurrentStyle;
  }

  execute(): void {
    this.previousStyle = this.getCurrentStyle();
    this.setStyle(this.styleKey);
    CommandHistory.getInstance().push(this);
    console.log(`[SwitchStyleCommand] Switched to ${this.styleKey}`);
  }

  undo(): void {
    this.setStyle(this.previousStyle);
    console.log(`[SwitchStyleCommand] Undo: Reverted to ${this.previousStyle}`);
  }

  matches(query: string): boolean {
    return this.label.toLowerCase().includes(query.toLowerCase());
  }
}

/**
 * Example: Toggle admin role
 */
class ToggleRoleCommand implements ICommand {
  id = 'toggle-role';
  label = 'Toggle Admin Role';
  private toggleRole: () => void;

  constructor(toggleRole: () => void) {
    this.toggleRole = toggleRole;
  }

  execute(): void {
    this.toggleRole();
    CommandHistory.getInstance().push(this);
    console.log('[ToggleRoleCommand] Role toggled');
  }

  undo(): void {
    this.toggleRole();
    console.log('[ToggleRoleCommand] Undo: Role reverted');
  }

  matches(query: string): boolean {
    return this.label.toLowerCase().includes(query.toLowerCase()) ||
      ['admin', 'role', 'user'].some(kw => kw.includes(query.toLowerCase()));
  }
}

// ====================================
// CLIENT CODE EXAMPLE
// ====================================

/**
 * DEMO: Using CommandHistory singleton for undo/redo
 */
export function demoCommandHistorySingleton() {
  console.log('=== SINGLETON PATTERN: Command History ===\n');

  // Simulate state
  let currentTab = 'home';
  let isDarkMode = false;
  let currentStyle = 'modern';
  //   let isAdmin = false;

  // Get the singleton instance
  const history1 = CommandHistory.getInstance();
  const history2 = CommandHistory.getInstance();

  // Verify single instance
  console.log('history1 === history2:', history1 === history2); // true ✓

  // Create commands
  const navHome = new NavigateCommand(
    'nav-home',
    'Go to Home',
    'home',
    (tab) => { currentTab = tab; },
    () => currentTab
  );

  const toggleTheme = new ToggleThemeCommand(
    () => { isDarkMode = !isDarkMode; }
  );

  const switchStyle = new SwitchStyleCommand(
    'style-future',
    'Switch to Future Style',
    'future',
    (style) => { currentStyle = style; },
    () => currentStyle
  );

  // Execute commands
  console.log('\n--- Executing Commands ---');
  navHome.execute();
  toggleTheme.execute();
  switchStyle.execute();

  console.log(`\nHistory size: ${history1.size()}`); // 3

  // Perform undo
  console.log('\n--- Performing Undo ---');
  const lastCommand = history1.pop();
  if (lastCommand) {
    lastCommand.undo();
  }

  console.log(`History size after undo: ${history1.size()}`); // 2

  // Get all history
  console.log('\n--- All Commands in History ---');
  history1.getHistory().forEach((cmd, i) => {
    console.log(`${i + 1}. ${cmd.label}`);
  });

  console.log('\n✓ Singleton: Single history instance manages all undo/redo\n');

  if (history1 === history2) {
    console.log("Singleton works: Both history1 and history2 are the same instance.");
  }

  console.log('\n--- All Commands in History ---');
  history2.getHistory().forEach((cmd, i) => {
    console.log(`${i + 1}. ${cmd.label}`);
  });
}

demoCommandHistorySingleton();

// ====================================
// EXPORTS
// ====================================
export {
  CommandHistory,
  type ICommand,
  NavigateCommand,
  ToggleThemeCommand,
  SwitchStyleCommand,
  ToggleRoleCommand
};
