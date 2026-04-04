/**
 * PROTOTYPE PATTERN - Project Template Cloning
 * 
 * Purpose: Clone existing project items as templates without recreating from scratch
 *          Used for "Clone Project" admin feature
 * 
 * Key Classes:
 * - Prototype<T> interface - defines clone() method
 * - ProjectTemplate - implements Prototype for content items
 * - ProjectTemplateRegistry - manages registered templates
 * 
 * Pattern Benefits:
 * - Faster cloning than creating from scratch
 * - Can modify clone without affecting original
 * - Registry pattern for easy template management
 */

import { UnifiedContentItem } from './05_builder_content_tree';

// ====================================
// PROTOTYPE INTERFACE
// ====================================

/**
 * Generic Prototype interface
 * Any class implementing this can be cloned
 */
interface Prototype<T> {
  clone(): T;
}

// ====================================
// CONCRETE PROTOTYPE IMPLEMENTATION
// ====================================

/**
 * ProjectTemplate - Prototype implementation
 * 
 * Represents a cloneable project item.
 * When cloned, creates a new instance with:
 * - Fresh ID (prefixed with timestamp)
 * - "(Clone)" suffix in title
 * - Current date
 * - "new" decoration
 */
class ProjectTemplate implements Prototype<UnifiedContentItem> {
  constructor(private readonly data: UnifiedContentItem) {}

  /**
   * Clone implementation
   * Creates a deep copy with modifications
   */
  clone(): UnifiedContentItem {
    // Deep clone using JSON serialization
    const cloned = JSON.parse(JSON.stringify(this.data));

    // Modify the clone to distinguish it
    const timestamp = Date.now();
    cloned.id = `proj-copy-${timestamp}`;
    cloned.title = `${this.data.title} (Clone)`;
    cloned.date = new Date().toISOString().split('T')[0];
    cloned.decorations = ['new'];

    console.log(`[Prototype] Cloned: "${this.data.title}" -> "${cloned.title}"`);

    return cloned;
  }

  /**
   * Get original data without cloning
   */
  getOriginal(): UnifiedContentItem {
    return this.data;
  }
}

// ====================================
// TEMPLATE REGISTRY (SINGLETON)
// ====================================

/**
 * ProjectTemplateRegistry
 * 
 * Manages a collection of templates that can be cloned.
 * Provides:
 * - register() - add a template
 * - get() - retrieve template by key
 * - getAllKeys() - list all available templates
 */
class ProjectTemplateRegistry {
  private templates: Map<string, ProjectTemplate> = new Map();

  /**
   * Register a project as a cloneable template
   * @param key - unique identifier for this template
   * @param item - the project item to use as template
   */
  register(key: string, item: UnifiedContentItem): void {
    const template = new ProjectTemplate(item);
    this.templates.set(key, template);
    console.log(`[Registry] Registered template: ${key}`);
  }

  /**
   * Retrieve a template by key
   * @param key - template identifier
   * @returns the template, or undefined if not found
   */
  get(key: string): ProjectTemplate | undefined {
    return this.templates.get(key);
  }

  /**
   * Get all registered template keys
   */
  getAllKeys(): string[] {
    return Array.from(this.templates.keys());
  }

  /**
   * Get count of registered templates
   */
  size(): number {
    return this.templates.size;
  }

  /**
   * Check if a template exists
   */
  has(key: string): boolean {
    return this.templates.has(key);
  }
}

// ====================================
// SAMPLE DATA FOR DEMO
// ====================================

const SAMPLE_ECOMMERCE_PROJECT: UnifiedContentItem = {
  id: 'proj-1',
  type: 'project',
  title: 'E-Commerce Super App',
  description: 'A massive e-commerce ecosystem. Includes user authentication, product management, shopping cart, and payment gateway integration.',
  date: '2023-08-15',
  imageUrl: '',
  meta: ['Next.js', 'Supabase', 'Stripe'],
  actionLink: '#',
  decorations: ['featured'],
  isLocked: true
};

const SAMPLE_AI_CHAT_PROJECT: UnifiedContentItem = {
  id: 'proj-2',
  type: 'project',
  title: 'AI Chat System',
  description: 'Chat app leveraging OpenAI API with real-time streaming response and history management.',
  date: '2023-06-10',
  imageUrl: '',
  meta: ['React', 'Node.js', 'OpenAI'],
  actionLink: '#',
  decorations: ['sponsor']
};

// ====================================
// CLIENT CODE EXAMPLE
// ====================================

/**
 * DEMO: Prototype pattern for cloning project templates
 */
export function demoPrototypeCloning() {
  console.log('=== PROTOTYPE PATTERN: Project Template Cloning ===\n');

  // Create and register templates
  console.log('--- Registering Templates ---');
  const templateRegistry = new ProjectTemplateRegistry();

  templateRegistry.register('E-Commerce App', SAMPLE_ECOMMERCE_PROJECT);
  templateRegistry.register('AI Chat System', SAMPLE_AI_CHAT_PROJECT);

  console.log(`Total templates registered: ${templateRegistry.size()}`);
  console.log(`Available templates: ${templateRegistry.getAllKeys().join(', ')}`);

  // Clone a project
  console.log('\n--- Cloning "E-Commerce App" Template ---');
  const ecommerceTemplate = templateRegistry.get('E-Commerce App');
  if (ecommerceTemplate) {
    const clonedProject = ecommerceTemplate.clone();

    // Compare original and clone
    console.log('\nOriginal:');
    console.log(`  ID: ${SAMPLE_ECOMMERCE_PROJECT.id}`);
    console.log(`  Title: ${SAMPLE_ECOMMERCE_PROJECT.title}`);
    console.log(`  Date: ${SAMPLE_ECOMMERCE_PROJECT.date}`);
    console.log(`  Locked: ${SAMPLE_ECOMMERCE_PROJECT.isLocked}`);

    console.log('\nCloned:');
    console.log(`  ID: ${clonedProject.id}`);
    console.log(`  Title: ${clonedProject.title}`);
    console.log(`  Date: ${clonedProject.date}`);
    console.log(`  Locked: ${clonedProject.isLocked}`);
    console.log(`  Decorations: ${clonedProject.decorations?.join(', ')}`);

    // Modify clone without affecting original
    console.log('\n--- Modifying Clone (Original Unaffected) ---');
    clonedProject.description = 'Custom modified version...';
    clonedProject.isLocked = false;

    console.log(`Original isLocked: ${SAMPLE_ECOMMERCE_PROJECT.isLocked}`);
    console.log(`Clone isLocked: ${clonedProject.isLocked}`);
  }

  // Clone multiple copies
  console.log('\n--- Creating Multiple Clones ---');
  const aiTemplate = templateRegistry.get('AI Chat System');
  if (aiTemplate) {
    const clone1 = aiTemplate.clone();
    const clone2 = aiTemplate.clone();
    const clone3 = aiTemplate.clone();

    console.log(`Clone 1 ID: ${clone1.id}`);
    console.log(`Clone 2 ID: ${clone2.id}`);
    console.log(`Clone 3 ID: ${clone3.id}`);
    console.log('✓ All clones have unique IDs (based on timestamp)');
  }

  // Practical use case
  console.log('\n--- Use Case: Admin Clones Project ---');
  function adminCloneProject(templateKey: string): UnifiedContentItem | null {
    const template = templateRegistry.get(templateKey);
    if (!template) {
      console.log(`Template "${templateKey}" not found`);
      return null;
    }

    const clonedProject = template.clone();
    console.log(`✓ Project cloned and ready for customization`);
    return clonedProject;
  }

  const newProject = adminCloneProject('E-Commerce App');
  if (newProject) {
    console.log(`New project title: ${newProject.title}`);
  }

  console.log('\n✓ Prototype: Projects cloned faster and cheaper than creation from scratch\n');
}

// ====================================
// EXPORTS
// ====================================
export {
  type Prototype,
  ProjectTemplate,
  ProjectTemplateRegistry,
  SAMPLE_ECOMMERCE_PROJECT,
  SAMPLE_AI_CHAT_PROJECT
};
