import type { ReactNode } from 'react';
import type { StyleKey } from '../theme/ThemeConfig';

type NotifyLevel = 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';

type NotifyFn = (message: string, type: NotifyLevel) => void;

export interface ICommand {
  id: string;
  label: string;
  icon: ReactNode;
  execute(): void;
  undo(): void;
  matches(query: string): boolean;
}

class CommandHistory {
  private history: ICommand[] = [];
  private static instance: CommandHistory;

  private constructor() {}

  static getInstance(): CommandHistory {
    if (!CommandHistory.instance) {
      CommandHistory.instance = new CommandHistory();
    }
    return CommandHistory.instance;
  }

  push(command: ICommand): void {
    this.history.push(command);
    if (this.history.length > 20) this.history.shift();
  }

  pop(): ICommand | undefined {
    return this.history.pop();
  }

  isEmpty(): boolean {
    return this.history.length === 0;
  }
}

export const historyManager = CommandHistory.getInstance();

export class NavigateCommand implements ICommand {
  private previousTab: string;

  constructor(
    public id: string,
    public label: string,
    public icon: ReactNode,
    private targetTab: string,
    private setTab: (tab: string) => void,
    private getCurrentTab: () => string,
    private notify: NotifyFn,
  ) {
    this.previousTab = '';
  }

  execute(): void {
    this.previousTab = this.getCurrentTab();
    this.setTab(this.targetTab);
    historyManager.push(this);
    this.notify(`Mapsd to ${this.label}`, 'INFO');
  }

  undo(): void {
    this.setTab(this.previousTab);
    this.notify('Undo: Returned to previous tab', 'WARNING');
  }

  matches(query: string): boolean {
    return this.label.toLowerCase().includes(query.toLowerCase());
  }
}

export class ToggleThemeCommand implements ICommand {
  id = 'toggle-theme';
  label = 'Toggle Dark Mode';

  constructor(public icon: ReactNode, private toggle: () => void, private notify: NotifyFn) {}

  execute(): void {
    this.toggle();
    historyManager.push(this);
    this.notify('Theme toggled', 'SUCCESS');
  }

  undo(): void {
    this.toggle();
    this.notify('Undo: Theme reverted', 'WARNING');
  }

  matches(query: string): boolean {
    return this.label.toLowerCase().includes(query.toLowerCase()) || 'dark'.includes(query.toLowerCase());
  }
}

export class SwitchStyleCommand implements ICommand {
  private previousStyle: StyleKey;

  constructor(
    public id: string,
    public label: string,
    public icon: ReactNode,
    private styleKey: StyleKey,
    private setStyle: (style: StyleKey) => void,
    private getCurrentStyle: () => StyleKey,
    private notify: NotifyFn,
  ) {
    this.previousStyle = this.getCurrentStyle();
  }

  execute(): void {
    this.previousStyle = this.getCurrentStyle();
    this.setStyle(this.styleKey);
    historyManager.push(this);
    this.notify(`Switched to ${this.styleKey} style`, 'SUCCESS');
  }

  undo(): void {
    this.setStyle(this.previousStyle);
    this.notify(`Undo: Style reverted to ${this.previousStyle}`, 'WARNING');
  }

  matches(query: string): boolean {
    return this.label.toLowerCase().includes(query.toLowerCase());
  }
}

export class ToggleRoleCommand implements ICommand {
  id = 'toggle-role';
  label = 'Toggle Admin Role';

  constructor(public icon: ReactNode, private toggle: () => void, private notify: NotifyFn) {}

  execute(): void {
    this.toggle();
    historyManager.push(this);
    this.notify('User Role Switched', 'INFO');
  }

  undo(): void {
    this.toggle();
    this.notify('Undo: Role reverted', 'WARNING');
  }

  matches(query: string): boolean {
    return this.label.toLowerCase().includes(query.toLowerCase()) || 'admin'.includes(query.toLowerCase());
  }
}

export class StartTourCommand implements ICommand {
  id = 'start-tour';
  label = 'Start Guided Tour';

  constructor(public icon: ReactNode, private start: () => void, private notify: NotifyFn) {}

  execute(): void {
    this.start();
    this.notify('Tour Started', 'SUCCESS');
  }

  undo(): void {
    this.notify('Tour stopped', 'INFO');
  }

  matches(query: string): boolean {
    return this.label.toLowerCase().includes(query.toLowerCase()) || 'tour'.includes(query.toLowerCase());
  }
}
