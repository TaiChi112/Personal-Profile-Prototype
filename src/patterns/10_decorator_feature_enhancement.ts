/**
 * DECORATOR PATTERN - Feature Enhancement
 * 
 * Problem: page.tsx components have features that can be optionally added:
 *          - Tooltips, Loading states, Error handling, Analytics tracking
 *          - Don't want to create Component, ComponentWithTooltip, ComponentWithLoading, etc.
 * 
 * Solution: Wrap components dynamically with decorator layers
 *          Each decorator adds responsibility without modifying original
 * 
 * Real-world usage from page.tsx:
 *   - Button can be: Button → WithTooltip → WithAnalytics → WithLoading
 *   - Card can be: Card → WithErrorBoundary → WithSkeleton
 *   - Component + features compose at runtime
 */

// ====================================
// COMPONENT INTERFACE
// ====================================

export interface UIComponent {
  name: string;
  render(): string;
  getMetadata(): ComponentInfo;
}

export interface ComponentInfo {
  type: string;
  displayName: string;
  decorators: string[];
}

// ====================================
// CONCRETE COMPONENT - Base
// ====================================

export class Button implements UIComponent {
  name = 'Button';

  constructor(
    private label: string = 'Click me',
    private variant: 'primary' | 'secondary' | 'danger' = 'primary'
  ) {}

  render(): string {
    return `<button class="btn btn-${this.variant}">${this.label}</button>`;
  }

  getMetadata(): ComponentInfo {
    return {
      type: 'Button',
      displayName: `Button[${this.variant}]`,
      decorators: [],
    };
  }
}

export class Card implements UIComponent {
  name = 'Card';

  constructor(
    private title: string = 'Card Title',
    private content: string = 'Card content'
  ) {}

  render(): string {
    return `
      <div class="card">
        <div class="card-header">${this.title}</div>
        <div class="card-body">${this.content}</div>
      </div>
    `;
  }

  getMetadata(): ComponentInfo {
    return {
      type: 'Card',
      displayName: this.title,
      decorators: [],
    };
  }
}

// ====================================
// DECORATOR - Base
// ====================================

export abstract class ComponentDecorator implements UIComponent {
  protected component: UIComponent;

  constructor(component: UIComponent) {
    this.component = component;
  }

  get name(): string {
    return this.component.name;
  }

  abstract render(): string;

  getMetadata(): ComponentInfo {
    const meta = this.component.getMetadata();
    meta.decorators.push(this.getDecoratorName());
    return meta;
  }

  protected abstract getDecoratorName(): string;
}

// ====================================
// CONCRETE DECORATORS
// ====================================

/**
 * Decorator: Add tooltip
 */
export class WithTooltip extends ComponentDecorator {
  constructor(
    component: UIComponent,
    private tooltip: string
  ) {
    super(component);
  }

  render(): string {
    return `<div class="tooltip-wrapper" title="${this.tooltip}">
      ${this.component.render()}
    </div>`;
  }

  protected getDecoratorName(): string {
    return 'WithTooltip';
  }
}

/**
 * Decorator: Add loading state
 */
export class WithLoading extends ComponentDecorator {
  constructor(
    component: UIComponent,
    private isLoading: boolean = false
  ) {
    super(component);
  }

  render(): string {
    if (this.isLoading) {
      return `<div class="loading-wrapper">
        <div class="spinner"></div>
        <p>Loading...</p>
      </div>`;
    }
    return this.component.render();
  }

  setLoading(loading: boolean): void {
    this.isLoading = loading;
  }

  protected getDecoratorName(): string {
    return 'WithLoading';
  }
}

/**
 * Decorator: Add error handling
 */
export class WithErrorBoundary extends ComponentDecorator {
  constructor(
    component: UIComponent,
    private error: string | null = null
  ) {
    super(component);
  }

  render(): string {
    if (this.error) {
      return `<div class="error-box">
        <p class="error-title">Error occurred:</p>
        <p class="error-message">${this.error}</p>
      </div>`;
    }
    return this.component.render();
  }

  setError(error: string | null): void {
    this.error = error;
  }

  protected getDecoratorName(): string {
    return 'WithErrorBoundary';
  }
}

/**
 * Decorator: Add analytics tracking
 */
export class WithAnalytics extends ComponentDecorator {
  private clickCount: number = 0;
  private renderCount: number = 0;

  constructor(
    component: UIComponent,
    private eventName: string
  ) {
    super(component);
  }

  render(): string {
    this.renderCount++;
    this.trackEvent('render', { count: this.renderCount });
    // Wrap with onclick tracking
    const html = this.component.render();
    return html.replace(
      '<button',
      `<button onclick="(this._analyticsClickCount = (this._analyticsClickCount || 0) + 1)"`
    );
  }

  private trackEvent(action: string, data: Record<string, unknown>): void {
    console.log(`[Analytics] ${this.eventName} - ${action}`, data);
  }

  getAnalytics(): { renders: number; clicks: number } {
    return {
      renders: this.renderCount,
      clicks: this.clickCount,
    };
  }

  protected getDecoratorName(): string {
    return 'WithAnalytics';
  }
}

/**
 * Decorator: Add skeleton/placeholder
 */
export class WithSkeleton extends ComponentDecorator {
  constructor(
    component: UIComponent,
    private isLoading: boolean = false
  ) {
    super(component);
  }

  render(): string {
    if (this.isLoading) {
      return `<div class="skeleton">
        <div class="skeleton-line"></div>
        <div class="skeleton-line short"></div>
        <div class="skeleton-text"></div>
      </div>`;
    }
    return this.component.render();
  }

  setLoading(loading: boolean): void {
    this.isLoading = loading;
  }

  protected getDecoratorName(): string {
    return 'WithSkeleton';
  }
}

/**
 * Decorator: Add disabled state
 */
export class WithDisabled extends ComponentDecorator {
  constructor(
    component: UIComponent,
    private disabled: boolean = false
  ) {
    super(component);
  }

  render(): string {
    const html = this.component.render();
    if (this.disabled) {
      return html.replace(/<button/, '<button disabled');
    }
    return html;
  }

  setDisabled(disabled: boolean): void {
    this.disabled = disabled;
  }

  protected getDecoratorName(): string {
    return 'WithDisabled';
  }
}

/**
 * Decorator: Add animations
 */
export class WithAnimation extends ComponentDecorator {
  constructor(
    component: UIComponent,
    private animationClass: string = 'fade-in'
  ) {
    super(component);
  }

  render(): string {
    const html = this.component.render();
    return `<div class="animated ${this.animationClass}">
      ${html}
    </div>`;
  }

  protected getDecoratorName(): string {
    return 'WithAnimation';
  }
}

// ====================================
// COMPONENT FACTORY WITH DECORATORS
// ====================================

export class EnhancedComponentFactory {
  /**
   * Create button with optional decorators
   */
  static createButton(
    label: string,
    options: {
      variant?: 'primary' | 'secondary' | 'danger';
      tooltip?: string;
      disabled?: boolean;
      animated?: boolean;
      analytics?: boolean;
    } = {}
  ): UIComponent {
    let component: UIComponent = new Button(label, options.variant);

    if (options.tooltip) {
      component = new WithTooltip(component, options.tooltip);
    }

    if (options.disabled) {
      component = new WithDisabled(component, true);
    }

    if (options.animated) {
      component = new WithAnimation(component);
    }

    if (options.analytics) {
      component = new WithAnalytics(component, `button-${label}`);
    }

    return component;
  }

  /**
   * Create card with optional decorators
   */
  static createCard(
    title: string,
    content: string,
    options: {
      withErrorBoundary?: boolean;
      withSkeleton?: boolean;
      withAnalytics?: boolean;
      animated?: boolean;
    } = {}
  ): UIComponent {
    let component: UIComponent = new Card(title, content);

    if (options.withErrorBoundary) {
      component = new WithErrorBoundary(component);
    }

    if (options.withSkeleton) {
      component = new WithSkeleton(component);
    }

    if (options.animated) {
      component = new WithAnimation(component);
    }

    if (options.withAnalytics) {
      component = new WithAnalytics(component, `card-${title}`);
    }

    return component;
  }
}

// ====================================
// COMPONENT REGISTRY
// ====================================

export class ComponentRegistry {
  private components: Map<string, UIComponent> = new Map();

  register(id: string, component: UIComponent): void {
    this.components.set(id, component);
  }

  get(id: string): UIComponent | undefined {
    return this.components.get(id);
  }

  renderAll(): Record<string, string> {
    const rendered: Record<string, string> = {};
    this.components.forEach((component, id) => {
      rendered[id] = component.render();
    });
    return rendered;
  }

  listComponents(): Array<{
    id: string;
    name: string;
    decorators: string[];
  }> {
    const list: Array<{ id: string; name: string; decorators: string[] }> = [];
    this.components.forEach((component, id) => {
      const meta = component.getMetadata();
      list.push({
        id,
        name: meta.displayName,
        decorators: meta.decorators,
      });
    });
    return list;
  }
}

// ====================================
// DEMO
// ====================================

export function demoDecoratorPattern() {
  console.log('\n🎁 DECORATOR PATTERN - Feature Enhancement\n');

  // Create components with different decorator combinations
  const registry = new ComponentRegistry();

  // Button 1: Simple button
  registry.register('btn1', new Button('Save'));

  // Button 2: Button with tooltip
  registry.register(
    'btn2',
    new WithTooltip(new Button('Delete', 'danger'), 'Remove this item permanently')
  );

  // Button 3: Button with multiple decorators
  let btn3: UIComponent = new Button('Submit', 'primary');
  btn3 = new WithTooltip(btn3, 'Click to submit the form');
  btn3 = new WithAnimation(btn3, 'pulse');
  registry.register('btn3', btn3);

  // Card 1: Simple card
  registry.register(
    'card1',
    new Card('Welcome', 'This is a simple card')
  );

  // Card 2: Card with error boundary
  registry.register(
    'card2',
    new WithErrorBoundary(new Card('Data', 'Loading data...'))
  );

  // Card 3: Card with skeleton and error handling
  let card3: UIComponent = new Card('User Profile', 'John Doe - 25 years old');
  card3 = new WithSkeleton(card3, false);
  card3 = new WithErrorBoundary(card3);
  card3 = new WithAnalytics(card3, 'user-profile-card');
  registry.register('card3', card3);

  // Using factory
  const factoryBtn = EnhancedComponentFactory.createButton('Download', {
    variant: 'secondary',
    tooltip: 'Download the file',
    animated: true,
    analytics: true,
  });
  registry.register('btn-factory', factoryBtn);

  console.log('📋 Registered components:');
  registry.listComponents().forEach((comp) => {
    const decorators = comp.decorators.length > 0 ? ` [${comp.decorators.join(', ')}]` : '';
    console.log(`  • ${comp.id}: ${comp.name}${decorators}`);
  });

  console.log('\n✨ Component hierarchy:');
  console.log('  Button');
  console.log('    └─ WithTooltip');
  console.log('         └─ WithAnimation');
  console.log('              └─ WithAnalytics');

  console.log('\n🎯 Rendering sample:');
  const sample = registry.get('btn3');
  if (sample) {
    console.log('  HTML:', sample.render().substring(0, 80) + '...');
    console.log('  Metadata:', sample.getMetadata());
  }

  console.log(
    '\n✅ Decorator Pattern Benefits:'
  );
  console.log(
    '  ✓ Add responsibilities dynamically (composition over inheritance)'
  );
  console.log(
    '  ✓ Avoid class explosion (Button, ButtonWithTooltip, ButtonWithLoading, etc.)'
  );
  console.log(
    '  ✓ Flexible feature combination'
  );
  console.log(
    '  ✓ Single Responsibility Principle (each decorator = one concern)'
  );
}
