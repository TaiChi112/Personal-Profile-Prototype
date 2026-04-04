/**
 * COMPOSITE PATTERN - Menu & Navigation Trees
 * 
 * Problem: page.tsx has nested navigation - Navbar with sections, subsections, items
 *          Need uniform treatment of single items and composite groups
 * 
 * Solution: Compose objects into tree structures. Let clients treat individual
 *          items and compositions uniformly.
 * 
 * Real-world usage from page.tsx:
 *   - NavItem (single) vs NavGroup (multiple items)
 *   - Both implement same interface
 *   - Can nest infinitely
 *   - Render entire tree uniformly
 */

// ====================================
// COMPONENT INTERFACE - Uniform
// ====================================

export interface NavComponent {
  name: string;
  path?: string;
  getPath(): string;
  render(): string;
  getChildCount(): number;
  accept(visitor: NavVisitor): void;
}

/**
 * Visitor for traversing tree
 */
export interface NavVisitor {
  visitItem(item: NavItem): void;
  visitGroup(group: NavGroup): void;
}

// ====================================
// LEAF - Single Navigation Item
// ====================================

export class NavItem implements NavComponent {
  name: string;
  path: string;
  icon?: string;
  badge?: string;

  constructor(name: string, path: string, icon?: string, badge?: string) {
    this.name = name;
    this.path = path;
    this.icon = icon;
    this.badge = badge;
  }

  getPath(): string {
    return this.path;
  }

  render(): string {
    const badge = this.badge ? ` <span class="badge">${this.badge}</span>` : '';
    const icon = this.icon ? `<i class="icon">${this.icon}</i>` : '';
    return `<li><a href="${this.path}">${icon} ${this.name}${badge}</a></li>`;
  }

  getChildCount(): number {
    return 0; // Leaf has no children
  }

  accept(visitor: NavVisitor): void {
    visitor.visitItem(this);
  }
}

// ====================================
// COMPOSITE - Navigation Group
// ====================================

export class NavGroup implements NavComponent {
  name: string;
  children: NavComponent[] = [];
  expanded: boolean = false;
  icon?: string;

  constructor(name: string, icon?: string, expanded: boolean = false) {
    this.name = name;
    this.icon = icon;
    this.expanded = expanded;
  }

  getPath(): string {
    // Group path is first child's path or '#'
    if (this.children.length > 0) {
      return this.children[0].getPath();
    }
    return '#';
  }

  /**
   * Add child component (leaf or group)
   */
  add(component: NavComponent): void {
    this.children.push(component);
  }

  /**
   * Remove child component
   */
  remove(component: NavComponent): void {
    const index = this.children.indexOf(component);
    if (index > -1) {
      this.children.splice(index, 1);
    }
  }

  /**
   * Get child at index
   */
  getChild(index: number): NavComponent | undefined {
    return this.children[index];
  }

  getChildCount(): number {
    return this.children.length;
  }

  /**
   * Render group and all children (recursive)
   */
  render(): string {
    const icon = this.icon ? `<i class="icon">${this.icon}</i>` : '';
    const isOpen = this.expanded ? 'open' : '';
    let html = `<li class="group ${isOpen}">`;
    html += `<span class="group-label">${icon} ${this.name}</span>`;
    html += `<ul class="submenu">`;

    // Recursively render children
    this.children.forEach((child) => {
      html += child.render();
    });

    html += `</ul></li>`;
    return html;
  }

  /**
   * Toggle expanded state
   */
  toggle(): void {
    this.expanded = !this.expanded;
  }

  /**
   * Get all items (flattened)
   */
  getAllItems(): NavItem[] {
    const items: NavItem[] = [];
    this.children.forEach((child) => {
      if (child instanceof NavItem) {
        items.push(child);
      } else if (child instanceof NavGroup) {
        items.push(...child.getAllItems());
      }
    });
    return items;
  }

  /**
   * Find item by path (depth-first search)
   */
  findByPath(path: string): NavItem | null {
    for (const child of this.children) {
      if (child instanceof NavItem && child.path === path) {
        return child;
      } else if (child instanceof NavGroup) {
        const found = child.findByPath(path);
        if (found) return found;
      }
    }
    return null;
  }

  accept(visitor: NavVisitor): void {
    visitor.visitGroup(this);
    this.children.forEach((child) => child.accept(visitor));
  }
}

// ====================================
// TREE BUILDER - Helper
// ====================================

export class NavTreeBuilder {
  private root: NavGroup;

  constructor(name: string = 'Root') {
    this.root = new NavGroup(name);
  }

  /**
   * Build tree fluently
   */
  addItem(name: string, path: string, icon?: string): NavTreeBuilder {
    this.root.add(new NavItem(name, path, icon));
    return this;
  }

  /**
   * Add group (returns builder for configuring group)
   */
  addGroup(name: string, icon?: string): NavGroupBuilder {
    const group = new NavGroup(name, icon);
    this.root.add(group);
    return new NavGroupBuilder(group, this);
  }

  /**
   * Build the tree
   */
  build(): NavGroup {
    return this.root;
  }
}

/**
 * Builder for nested groups
 */
export class NavGroupBuilder {
  private group: NavGroup;
  private parent: NavTreeBuilder;

  constructor(group: NavGroup, parent: NavTreeBuilder) {
    this.group = group;
    this.parent = parent;
  }

  /**
   * Add item to current group
   */
  addItem(name: string, path: string, icon?: string): NavGroupBuilder {
    this.group.add(new NavItem(name, path, icon));
    return this;
  }

  /**
   * Add nested group
   */
  addNestedGroup(name: string, icon?: string): NestedGroupBuilder {
    const nested = new NavGroup(name, icon);
    this.group.add(nested);
    return new NestedGroupBuilder(nested, this);
  }

  /**
   * Close group and return to parent
   */
  closeGroup(): NavTreeBuilder {
    return this.parent;
  }

  /**
   * Get current group
   */
  getGroup(): NavGroup {
    return this.group;
  }
}

/**
 * Builder for deeply nested groups
 */
export class NestedGroupBuilder {
  private group: NavGroup;
  private parent: NavGroupBuilder;

  constructor(group: NavGroup, parent: NavGroupBuilder) {
    this.group = group;
    this.parent = parent;
  }

  addItem(name: string, path: string, icon?: string): NestedGroupBuilder {
    this.group.add(new NavItem(name, path, icon));
    return this;
  }

  closeNested(): NavGroupBuilder {
    return this.parent;
  }
}

// ====================================
// NAVIGATOR - Works with tree
// ====================================

export class Navigator {
  private root: NavGroup;
  private currentPath: string = '/';

  constructor(root: NavGroup) {
    this.root = root;
  }

  /**
   * Navigate to path
   */
  navigateTo(path: string): boolean {
    const item = this.root.findByPath(path);
    if (item) {
      this.currentPath = path;
      return true;
    }
    return false;
  }

  /**
   * Get current path
   */
  getCurrentPath(): string {
    return this.currentPath;
  }

  /**
   * Get all navigable items
   */
  getAllItems(): NavItem[] {
    return this.root.getAllItems();
  }

  /**
   * Render entire navigation
   */
  render(): string {
    return this.root.render();
  }

  /**
   * Get navigation structure (for debugging)
   */
  getStructure(component: NavComponent = this.root, indent: string = ''): string[] {
    const lines: string[] = [];
    const prefix = component instanceof NavGroup ? '📁' : '📄';
    lines.push(`${indent}${prefix} ${component.name}`);

    if (component instanceof NavGroup) {
      component.children.forEach((child) => {
        lines.push(...this.getStructure(child, indent + '  '));
      });
    }

    return lines;
  }
}

// ====================================
// VISITOR IMPLEMENTATION
// ====================================

export class NavPrinter implements NavVisitor {
  private indent: number = 0;

  visitItem(item: NavItem): void {
    console.log(`${'  '.repeat(this.indent)}├─ ${item.name} (${item.path})`);
  }

  visitGroup(group: NavGroup): void {
    console.log(`${'  '.repeat(this.indent)}├─ 📁 ${group.name}`);
    this.indent++;
  }

  closeGroup(): void {
    this.indent--;
  }
}

// ====================================
// DEMO
// ====================================

export function demoCompositePattern() {
  console.log('\n🌳 COMPOSITE PATTERN - Navigation Trees\n');

  // Build navigation tree
  const nav = new NavTreeBuilder('Main Menu')
    .addItem('Home', '/')
    .addItem('About', '/about')
    .addGroup('Services', '⚙️')
    .addItem('Design', '/services/design')
    .addItem('Development', '/services/development')
    .addItem('Consulting', '/services/consulting')
    .addNestedGroup('Advanced', '🔧')
    .addItem('API Design', '/services/advanced/api')
    .addItem('Architecture', '/services/advanced/architecture')
    .closeNested()
    .closeGroup()
    .addGroup('Products', '📦')
    .addItem('Product A', '/products/a')
    .addItem('Product B', '/products/b')
    .addItem('Product C', '/products/c')
    .closeGroup()
    .addItem('Blog', '/blog')
    .addItem('Contact', '/contact')
    .build();

  const navigator = new Navigator(nav);

  console.log('📊 Navigation Structure:');
  navigator.getStructure().forEach((line) => console.log(line));

  console.log('\n🔍 All navigable paths:');
  navigator.getAllItems().forEach((item) => {
    console.log(`  • ${item.name}: ${item.path}`);
  });

  console.log('\n🧭 Navigation test:');
  const paths = ['/', '/services/design', '/products/a', '/blog'];
  paths.forEach((path) => {
    const success = navigator.navigateTo(path);
    console.log(`  Navigate to ${path}: ${success ? '✓ Success' : '✗ Failed'}`);
  });

  console.log('\n🎨 Rendered HTML (sample):');
  console.log(nav.render().substring(0, 200) + '...');

  console.log(
    '\n✅ Composite Pattern Benefits:'
  );
  console.log(
    '  ✓ Treat individual items and groups uniformly'
  );
  console.log(
    '  ✓ Build trees of arbitrary depth'
  );
  console.log(
    '  ✓ Add/remove items dynamically'
  );
  console.log(
    '  ✓ Render recursively without client complexity'
  );
}
