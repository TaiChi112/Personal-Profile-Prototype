/**
 * OBSERVER PATTERN - One-to-Many Dependency
 * 
 * Problem: page.tsx has events that need multiple subscribers
 *          - Theme changes affect navbar, cards, buttons
 *          - Language changes update all labels
 *          - Don't want components tightly coupled
 * 
 * Solution: Observer pattern - subjects notify observers of changes
 *          Loose coupling between publisher and subscribers
 */

// ====================================
// OBSERVER INTERFACE
// ====================================

export interface Observer {
  update(subject: Subject, data?: { theme?: string; language?: string }): void;
  getName(): string;
}

// ====================================
// SUBJECT INTERFACE
// ====================================

export interface Subject {
  attach(observer: Observer): void;
  detach(observer: Observer): void;
  notify(data?: { theme?: string; language?: string }): void;
}

// ====================================
// CONCRETE SUBJECT
// ====================================

/**
 * Theme subject - notifies when theme changes
 */
export class ThemeSubject implements Subject {
  private observers: Set<Observer> = new Set();
  private currentTheme: string = 'light';

  attach(observer: Observer): void {
    this.observers.add(observer);
    console.log(`[Theme] ${observer.getName()} subscribed`);
  }

  detach(observer: Observer): void {
    this.observers.delete(observer);
    console.log(`[Theme] ${observer.getName()} unsubscribed`);
  }

  notify(data?: { theme?: string; language?: string }): void {
    console.log(`[Theme] Notifying ${this.observers.size} observers...`);
    this.observers.forEach((observer) => {
      observer.update(this, data);
    });
  }

  setTheme(theme: string): void {
    if (this.currentTheme !== theme) {
      console.log(`\n→ Theme changed: ${this.currentTheme} → ${theme}`);
      this.currentTheme = theme;
      this.notify({ theme });
    }
  }

  getTheme(): string {
    return this.currentTheme;
  }
}

/**
 * Language subject - notifies when language changes
 */
export class LanguageSubject implements Subject {
  private observers: Set<Observer> = new Set();
  private currentLanguage: string = 'en';

  attach(observer: Observer): void {
    this.observers.add(observer);
    console.log(`[Language] ${observer.getName()} subscribed`);
  }

  detach(observer: Observer): void {
    this.observers.delete(observer);
    console.log(`[Language] ${observer.getName()} unsubscribed`);
  }

  notify(data?: { theme?: string; language?: string }): void {
    console.log(`[Language] Notifying ${this.observers.size} observers...`);
    this.observers.forEach((observer) => {
      observer.update(this, data);
    });
  }

  setLanguage(language: string): void {
    if (this.currentLanguage !== language) {
      console.log(`\n→ Language changed: ${this.currentLanguage} → ${language}`);
      this.currentLanguage = language;
      this.notify({ language });
    }
  }

  getLanguage(): string {
    return this.currentLanguage;
  }
}

// ====================================
// CONCRETE OBSERVERS
// ====================================

/**
 * Observer: Navigation bar
 */
export class NavbarObserver implements Observer {
  private theme: string = 'light';
  private language: string = 'en';

  update(subject: Subject, data?: { theme?: string; language?: string }): void {
    if (subject instanceof ThemeSubject) {
      this.theme = (subject as ThemeSubject).getTheme();
      console.log(`  [Navbar] Updated theme to ${this.theme}`);
    } else if (subject instanceof LanguageSubject) {
      this.language = (subject as LanguageSubject).getLanguage();
      console.log(`  [Navbar] Updated language to ${this.language}`);
    }
  }

  getName(): string {
    return 'Navbar';
  }

  render(): string {
    return `Navbar (${this.theme}, ${this.language})`;
  }
}

/**
 * Observer: Card component
 */
export class CardObserver implements Observer {
  private theme: string = 'light';

  update(subject: Subject, data?: { theme?: string; language?: string }): void {
    if (subject instanceof ThemeSubject) {
      this.theme = (subject as ThemeSubject).getTheme();
      console.log(`  [Card] Updated theme to ${this.theme}`);
    }
  }

  getName(): string {
    return 'Card';
  }
}

/**
 * Observer: Button component
 */
export class ButtonObserver implements Observer {
  private theme: string = 'light';
  private language: string = 'en';

  update(subject: Subject, data?: { theme?: string; language?: string }): void {
    if (subject instanceof ThemeSubject) {
      this.theme = (subject as ThemeSubject).getTheme();
      console.log(`  [Button] Updated theme to ${this.theme}`);
    } else if (subject instanceof LanguageSubject) {
      this.language = (subject as LanguageSubject).getLanguage();
      console.log(`  [Button] Updated language to ${this.language}`);
    }
  }

  getName(): string {
    return 'Button';
  }
}

/**
 * Observer: Logger
 */
export class LoggerObserver implements Observer {
  private events: string[] = [];

  update(subject: Subject, data?: { theme?: string; language?: string }): void {
    const event = `${new Date().toISOString()} - ${subject.constructor.name} updated`;
    this.events.push(event);
    console.log(`  [Logger] Event logged: ${event}`);
  }

  getName(): string {
    return 'Logger';
  }

  getEventLog(): string[] {
    return [...this.events];
  }
}

// ====================================
// APPLICATION COORDINATOR
// ====================================

export class ApplicationCoordinator {
  private themeSubject: ThemeSubject;
  private languageSubject: LanguageSubject;
  private observers: Observer[] = [];

  constructor() {
    this.themeSubject = new ThemeSubject();
    this.languageSubject = new LanguageSubject();
  }

  /**
   * Register observer for both subjects
   */
  registerObserver(observer: Observer): void {
    this.observers.push(observer);
    this.themeSubject.attach(observer);
    this.languageSubject.attach(observer);
  }

  /**
   * Change theme - all observers notified
   */
  setTheme(theme: string): void {
    this.themeSubject.setTheme(theme);
  }

  /**
   * Change language - all observers notified
   */
  setLanguage(language: string): void {
    this.languageSubject.setLanguage(language);
  }

  /**
   * Get observer count
   */
  getObserverCount(): number {
    return this.observers.length;
  }
}

// ====================================
// DEMO
// ====================================

export function demoObserverPattern() {
  console.log('\n👁️  OBSERVER PATTERN - One-to-Many Dependency\n');

  const app = new ApplicationCoordinator();

  // Create observers
  const navbar = new NavbarObserver();
  const card = new CardObserver();
  const button = new ButtonObserver();
  const logger = new LoggerObserver();

  // Register observers
  console.log('📢 Registering observers:\n');
  app.registerObserver(navbar);
  app.registerObserver(card);
  app.registerObserver(button);
  app.registerObserver(logger);

  console.log(`\n✓ Total observers: ${app.getObserverCount()}`);

  // Change theme
  console.log('\n🎨 Changing theme...');
  app.setTheme('dark');

  // Change language
  console.log('\n🌍 Changing language...');
  app.setLanguage('th');

  // Change theme again
  console.log('\n🎨 Changing theme again...');
  app.setTheme('light');

  console.log('\n✅ Observer Pattern Benefits:');
  console.log('  ✓ Loose coupling between subjects and observers');
  console.log('  ✓ Dynamic subscribe/unsubscribe');
  console.log('  ✓ One subject change notifies many observers');
  console.log('  ✓ Observers don\'t need to know about each other');
}
