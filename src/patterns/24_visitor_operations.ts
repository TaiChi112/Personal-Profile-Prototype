/**
 * VISITOR PATTERN - Add Operations Without Modifying Objects
 * 
 * Problem: page.tsx has component tree that needs multiple operations
 *          - Render components (HTML)
 *          - Validate component props
 *          - Export component structure (JSON/XML)
 *          - Calculate statistics
 *          Don't want to add methods to component classes for each operation
 * 
 * Solution: Define Visitor interface for operations
 *          Each component accepts a visitor
 *          Visitor performs operation on each component type
 */

// ====================================
// COMPONENT HIERARCHY (Element)
// ====================================

export interface ComponentElement {
  accept(visitor: ComponentVisitor): void;
}

/**
 * Button component
 */
export class ButtonComponent implements ComponentElement {
  constructor(
    public text: string,
    public color: string = 'primary'
  ) {}

  accept(visitor: ComponentVisitor): void {
    visitor.visitButton(this);
  }
}

/**
 * Input component
 */
export class InputComponent implements ComponentElement {
  constructor(
    public placeholder: string,
    public type: string = 'text'
  ) {}

  accept(visitor: ComponentVisitor): void {
    visitor.visitInput(this);
  }
}

/**
 * Card component
 */
export class CardComponent implements ComponentElement {
  private children: ComponentElement[] = [];

  constructor(public title: string) {}

  addChild(component: ComponentElement): void {
    this.children.push(component);
  }

  getChildren(): ComponentElement[] {
    return this.children;
  }

  accept(visitor: ComponentVisitor): void {
    visitor.visitCard(this);
    this.children.forEach((child) => child.accept(visitor));
  }
}

/**
 * Container component
 */
export class ContainerComponent implements ComponentElement {
  private children: ComponentElement[] = [];

  constructor(public className: string) {}

  addChild(component: ComponentElement): void {
    this.children.push(component);
  }

  getChildren(): ComponentElement[] {
    return this.children;
  }

  accept(visitor: ComponentVisitor): void {
    visitor.visitContainer(this);
    this.children.forEach((child) => child.accept(visitor));
  }
}

/**
 * Heading component
 */
export class HeadingComponent implements ComponentElement {
  constructor(
    public level: number,
    public text: string
  ) {}

  accept(visitor: ComponentVisitor): void {
    visitor.visitHeading(this);
  }
}

// ====================================
// VISITOR INTERFACE
// ====================================

export interface ComponentVisitor {
  visitButton(component: ButtonComponent): void;
  visitInput(component: InputComponent): void;
  visitCard(component: CardComponent): void;
  visitContainer(component: ContainerComponent): void;
  visitHeading(component: HeadingComponent): void;
}

// ====================================
// CONCRETE VISITORS
// ====================================

/**
 * HTML Renderer - renders components as HTML
 */
export class HtmlRenderingVisitor implements ComponentVisitor {
  private html: string[] = [];

  visitButton(component: ButtonComponent): void {
    this.html.push(`<button class="${component.color}">${component.text}</button>`);
  }

  visitInput(component: InputComponent): void {
    this.html.push(`<input type="${component.type}" placeholder="${component.placeholder}" />`);
  }

  visitCard(component: CardComponent): void {
    this.html.push(`<div class="card"><h3>${component.title}</h3>`);
  }

  visitContainer(component: ContainerComponent): void {
    this.html.push(`<div class="${component.className}">`);
  }

  visitHeading(component: HeadingComponent): void {
    this.html.push(`<h${component.level}>${component.text}</h${component.level}>`);
  }

  getHtml(): string {
    return this.html.join('\n');
  }

  reset(): void {
    this.html = [];
  }
}

/**
 * Validator - validates components
 */
export interface ValidationError {
  component: string;
  issue: string;
}

export class ValidationVisitor implements ComponentVisitor {
  private errors: ValidationError[] = [];

  visitButton(component: ButtonComponent): void {
    if (!component.text || component.text.trim().length === 0) {
      this.errors.push({ component: 'Button', issue: 'Button text cannot be empty' });
    }
    if (!['primary', 'secondary', 'danger', 'success'].includes(component.color)) {
      this.errors.push({ component: 'Button', issue: `Invalid color: ${component.color}` });
    }
  }

  visitInput(component: InputComponent): void {
    if (!component.placeholder || component.placeholder.trim().length === 0) {
      this.errors.push({ component: 'Input', issue: 'Input placeholder cannot be empty' });
    }
    const validTypes = ['text', 'email', 'password', 'number', 'checkbox', 'radio'];
    if (!validTypes.includes(component.type)) {
      this.errors.push({ component: 'Input', issue: `Invalid type: ${component.type}` });
    }
  }

  visitCard(component: CardComponent): void {
    if (!component.title || component.title.trim().length === 0) {
      this.errors.push({ component: 'Card', issue: 'Card title cannot be empty' });
    }
  }

  visitContainer(component: ContainerComponent): void {
    if (!component.className || component.className.trim().length === 0) {
      this.errors.push({ component: 'Container', issue: 'Container className cannot be empty' });
    }
  }

  visitHeading(component: HeadingComponent): void {
    if (component.level < 1 || component.level > 6) {
      this.errors.push({ component: 'Heading', issue: `Invalid level: ${component.level}` });
    }
    if (!component.text || component.text.trim().length === 0) {
      this.errors.push({ component: 'Heading', issue: 'Heading text cannot be empty' });
    }
  }

  getErrors(): ValidationError[] {
    return this.errors;
  }

  isValid(): boolean {
    return this.errors.length === 0;
  }

  reset(): void {
    this.errors = [];
  }
}

/**
 * Statistics - counts components
 */
export class StatisticsVisitor implements ComponentVisitor {
  private stats = {
    buttons: 0,
    inputs: 0,
    cards: 0,
    containers: 0,
    headings: 0,
    total: 0,
  };

  visitButton(): void {
    this.stats.buttons++;
    this.stats.total++;
  }

  visitInput(): void {
    this.stats.inputs++;
    this.stats.total++;
  }

  visitCard(): void {
    this.stats.cards++;
    this.stats.total++;
  }

  visitContainer(): void {
    this.stats.containers++;
    this.stats.total++;
  }

  visitHeading(): void {
    this.stats.headings++;
    this.stats.total++;
  }

  getStats() {
    return { ...this.stats };
  }

  reset(): void {
    this.stats = {
      buttons: 0,
      inputs: 0,
      cards: 0,
      containers: 0,
      headings: 0,
      total: 0,
    };
  }
}

/**
 * JSON Exporter - exports structure as JSON
 */
export class JsonExportVisitor implements ComponentVisitor {
  private objects: unknown[] = [];
  private currentObject: Record<string, unknown> | null = null;

  visitButton(component: ButtonComponent): void {
    this.objects.push({
      type: 'button',
      text: component.text,
      color: component.color,
    });
  }

  visitInput(component: InputComponent): void {
    this.objects.push({
      type: 'input',
      placeholder: component.placeholder,
      inputType: component.type,
    });
  }

  visitCard(component: CardComponent): void {
    this.currentObject = {
      type: 'card',
      title: component.title,
      children: [],
    };
    this.objects.push(this.currentObject);
  }

  visitContainer(component: ContainerComponent): void {
    this.currentObject = {
      type: 'container',
      className: component.className,
      children: [],
    };
    this.objects.push(this.currentObject);
  }

  visitHeading(component: HeadingComponent): void {
    this.objects.push({
      type: 'heading',
      level: component.level,
      text: component.text,
    });
  }

  getJson(): string {
    return JSON.stringify(this.objects, null, 2);
  }

  reset(): void {
    this.objects = [];
    this.currentObject = null;
  }
}

// ====================================
// DEMO
// ====================================

export function demoVisitorPattern() {
  console.log('\n👁️ VISITOR PATTERN - Add Operations Without Modifying Objects\n');

  // Build component tree
  console.log('=== Building Component Tree ===\n');
  const container = new ContainerComponent('page-container');

  const card1 = new CardComponent('Login Form');
  card1.addChild(new HeadingComponent(2, 'Sign In'));
  card1.addChild(new InputComponent('Email address', 'email'));
  card1.addChild(new InputComponent('Password', 'password'));
  card1.addChild(new ButtonComponent('Login', 'primary'));

  const card2 = new CardComponent('Settings');
  card2.addChild(new HeadingComponent(2, 'User Settings'));
  card2.addChild(new ButtonComponent('Edit Profile', 'secondary'));
  card2.addChild(new ButtonComponent('Logout', 'danger'));

  container.addChild(card1);
  container.addChild(card2);
  console.log('✓ Component tree built\n');

  // Visitor 1: HTML Rendering
  console.log('=== HTML Rendering ===\n');
  const renderer = new HtmlRenderingVisitor();
  container.accept(renderer);
  console.log(renderer.getHtml());

  // Visitor 2: Validation
  console.log('\n=== Validation ===\n');
  const validator = new ValidationVisitor();
  container.accept(validator);
  console.log(`Valid: ${validator.isValid()}`);
  if (!validator.isValid()) {
    validator.getErrors().forEach((err) => {
      console.log(`  ✗ ${err.component}: ${err.issue}`);
    });
  } else {
    console.log('  ✓ All components valid');
  }

  // Visitor 3: Statistics
  console.log('\n=== Statistics ===\n');
  const stats = new StatisticsVisitor();
  container.accept(stats);
  const componentStats = stats.getStats();
  console.log(`Total components: ${componentStats.total}`);
  console.log(`  Buttons: ${componentStats.buttons}`);
  console.log(`  Inputs: ${componentStats.inputs}`);
  console.log(`  Cards: ${componentStats.cards}`);
  console.log(`  Containers: ${componentStats.containers}`);
  console.log(`  Headings: ${componentStats.headings}`);

  // Visitor 4: JSON Export
  console.log('\n=== JSON Export ===\n');
  const exporter = new JsonExportVisitor();
  container.accept(exporter);
  console.log(exporter.getJson());

  // Test invalid component
  console.log('\n=== Testing Validation with Invalid Component ===\n');
  const invalidCard = new CardComponent(''); // Invalid: empty title
  validator.reset();
  invalidCard.accept(validator);
  console.log(`Valid: ${validator.isValid()}`);
  validator.getErrors().forEach((err) => {
    console.log(`  ✗ ${err.component}: ${err.issue}`);
  });

  console.log('\n✅ Visitor Pattern Benefits:');
  console.log('  ✓ Add operations without modifying component classes');
  console.log('  ✓ All operations for one type in one place (visitor)');
  console.log('  ✓ Easy to add new operations (new visitors)');
  console.log('  ✓ Separates algorithms from object structures');
  console.log('  ✓ Double dispatch: visitor + element type');
}
