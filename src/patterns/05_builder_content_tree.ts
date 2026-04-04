/**
 * BUILDER PATTERN - Content Tree Builder
 * 
 * Purpose: Construct complex hierarchical content structures step-by-step
 *          using method chaining
 * 
 * Key Classes:
 * - ContentBuilder - builds tree structure
 * - CompositeNode/LeafNode - the objects being built
 * 
 * Pattern Benefits:
 * - Separates construction logic from representation
 * - Supports method chaining for readable code
 * - Easy to build complex nested structures
 * - Can build different variations with same builder
 */

// ====================================
// DATA TYPE DEFINITIONS
// ====================================

/**
 * Unified content item - normalized data type
 * Can represent projects, blogs, articles, videos, docs, podcasts
 */
interface UnifiedContentItem {
  id: string;
  type: 'project' | 'blog' | 'video' | 'article' | 'doc' | 'podcast';
  title: string;
  description: string;
  date: string;
  imageUrl?: string;
  meta: string[]; // tech stack, tags, etc.
  actionLink?: string;
  decorations?: ('new' | 'featured' | 'sponsor' | 'hot' | 'popular')[];
  isLocked?: boolean;
}

type ComponentType = 'container' | 'item';
type LayoutStyleType = 'grid' | 'list' | 'timeline' | 'column' | 'row';

/**
 * Node interface - part of tree structure
 */
interface LayoutNode {
  id: string;
  type: ComponentType;
}

/**
 * Leaf node - represents a single content item
 */
interface LeafNode extends LayoutNode {
  type: 'item';
  data: UnifiedContentItem;
}

/**
 * Composite node - represents a container with children
 */
interface CompositeNode extends LayoutNode {
  type: 'container';
  layoutStyle: LayoutStyleType;
  children: Array<LayoutNode | CompositeNode | LeafNode>;
  title?: string;
  colSpan?: number;
  data?: UnifiedContentItem;
}

// ====================================
// BUILDER PATTERN IMPLEMENTATION
// ====================================

/**
 * Builder Pattern Implementation
 * 
 * Constructs complex tree structures using method chaining.
 * Maintains internal state (root, currentContainer, stack) for building.
 */
class ContentBuilder {
  private root: CompositeNode;
  private currentContainer: CompositeNode;
  private stack: CompositeNode[] = [];

  /**
   * Initialize builder with root container
   * @param id - unique identifier
   * @param layoutStyle - how to layout children
   * @param title - optional title for container
   * @param data - optional data for this node
   */
  constructor(
    id: string,
    layoutStyle: LayoutStyleType = 'column',
    title?: string,
    data?: UnifiedContentItem
  ) {
    this.root = {
      id,
      type: 'container',
      layoutStyle,
      title,
      children: [],
      data
    };
    this.currentContainer = this.root;
    this.stack.push(this.root);
  }

  /**
   * Add a nested container (group of items)
   * Supports method chaining
   * 
   * @param id - unique identifier
   * @param layoutStyle - layout style for this container's children
   * @param title - optional title
   * @param data - optional associated data
   */
  addContainer(
    id: string,
    layoutStyle: LayoutStyleType,
    title?: string,
    data?: UnifiedContentItem
  ): ContentBuilder {
    // Create new container
    const newContainer: CompositeNode = {
      id,
      type: 'container',
      layoutStyle,
      title,
      children: [],
      data
    };

    // Add to current container
    this.currentContainer.children.push(newContainer);

    // Save current container to stack
    this.stack.push(this.currentContainer);

    // Switch context to new container
    this.currentContainer = newContainer;

    console.log(`[Builder] Added container: ${id}`);
    return this; // Enable method chaining
  }

  /**
   * Add a leaf node (single item)
   * Supports method chaining
   * 
   * @param item - the content item to add
   */
  addItem(item: UnifiedContentItem): ContentBuilder {
    // Create leaf node
    const leaf: LeafNode = {
      id: `leaf-${item.id}`,
      type: 'item',
      data: item
    };

    // Add to current container
    this.currentContainer.children.push(leaf);

    console.log(`[Builder] Added item: ${item.title}`);
    return this; // Enable method chaining
  }

  /**
   * Move context up one level (pop from stack)
   * Used after finishing a container's children
   * Supports method chaining
   */
  up(): ContentBuilder {
    if (this.stack.length > 1) {
      this.currentContainer = this.stack.pop()!;
      console.log(`[Builder] Moved up to parent container`);
    }
    return this; // Enable method chaining
  }

  /**
   * Build and return the complete tree structure
   * Final step in building process
   */
  build(): CompositeNode {
    if (this.stack.length !== 1) {
      console.warn('[Builder] Warning: Not all containers closed with .up()');
    }
    console.log(`[Builder] Build complete. Tree height: ${this.getDepth(this.root)}`);
    return this.root;
  }

  /**
   * Helper: Calculate tree depth
   */
  private getDepth(node: LayoutNode | CompositeNode | LeafNode): number {
    if (node.type === 'item') return 1;
    const composite = node as CompositeNode;
    if (composite.children.length === 0) return 1;
    return 1 + Math.max(...composite.children.map(child => this.getDepth(child)));
  }
}

// ====================================
// EXAMPLE: BUILDING CONTENT TREES
// ====================================

/**
 * Sample project data
 */
const SAMPLE_PROJECT_1: UnifiedContentItem = {
  id: '1',
  type: 'project',
  title: 'E-Commerce Super App',
  description: 'A massive e-commerce ecosystem with authentication and payments.',
  date: '2023-08-15',
  meta: ['Next.js', 'Supabase', 'Stripe'],
  decorations: ['featured'],
  actionLink: '#'
};

const SAMPLE_PROJECT_2: UnifiedContentItem = {
  id: '1-1',
  type: 'project',
  title: 'Merchant Dashboard',
  description: 'Admin panel for sellers.',
  date: '2023-09-01',
  meta: ['React', 'Tailwind'],
  actionLink: '#'
};

const SAMPLE_PROJECT_3: UnifiedContentItem = {
  id: '1-2',
  type: 'project',
  title: 'Mobile Customer App',
  description: 'React Native app for buyers.',
  date: '2023-09-15',
  meta: ['React Native', 'Expo'],
  actionLink: '#'
};

const SAMPLE_PROJECT_4: UnifiedContentItem = {
  id: '2',
  type: 'project',
  title: 'AI Chat System',
  description: 'Chat app leveraging OpenAI API.',
  date: '2023-06-10',
  meta: ['React', 'Node.js', 'OpenAI'],
  decorations: ['sponsor'],
  actionLink: '#'
};

/**
 * Build a complex project tree using Builder pattern
 * 
 * Demonstrates method chaining and nested structure building
 */
function buildProjectsTree(): CompositeNode {
  return new ContentBuilder('proj-root', 'column', 'All Projects')
    // First super-app
    .addContainer('super-app', 'grid', 'E-Commerce Super App', SAMPLE_PROJECT_1)
    .addItem(SAMPLE_PROJECT_2)
    .addItem(SAMPLE_PROJECT_3)
    .up() // Done with super-app, go back to root
    // Second super-app
    .addContainer('ai-chat', 'list', 'AI Chat System', SAMPLE_PROJECT_4)
    .addItem({
      ...SAMPLE_PROJECT_4,
      id: '2-1',
      title: 'Socket Server',
      description: 'Real-time message handling.'
    })
    .up() // Done with ai-chat, go back to root
    .build(); // Build final tree
}

// ====================================
// CLIENT CODE EXAMPLE
// ====================================

/**
 * DEMO: Builder pattern for constructing content trees
 */
export function demoContentBuilder() {
  console.log('=== BUILDER PATTERN: Content Tree ===\n');

  // Build the tree using builder
  console.log('--- Building Project Tree ---');
  const projectTree = buildProjectsTree();

  // Inspect the built structure
  console.log('\n--- Tree Structure ---');
  console.log(`Root ID: ${projectTree.id}`);
  console.log(`Root Title: ${projectTree.title}`);
  console.log(`Layout Style: ${projectTree.layoutStyle}`);
  console.log(`Number of children: ${projectTree.children.length}`);

  // Traverse the tree
  console.log('\n--- Tree Contents ---');
  function printNode(node: LayoutNode | CompositeNode | LeafNode, indent = 0) {
    const prefix = '  '.repeat(indent);
    if (node.type === 'item') {
      const leaf = node as LeafNode;
      console.log(`${prefix}├─ [ITEM] ${leaf.data.title}`);
    } else {
      const composite = node as CompositeNode;
      console.log(`${prefix}├─ [CONTAINER] ${composite.title || composite.id}`);
      composite.children.forEach((child, i) => {
        printNode(child, indent + 1);
      });
    }
  }

  projectTree.children.forEach(child => printNode(child, 0));

  // Example: Build another tree with different structure
  console.log('\n--- Building Blog Tree (Different Structure) ---');
  const blogTree = new ContentBuilder('blog-root', 'column', 'My Writings')
    .addContainer('journey', 'timeline', 'Tech Journey')
    .addItem({
      id: 'b1',
      type: 'blog',
      title: 'First Framework I Learned',
      description: 'My experience with React',
      date: '2023-01-20',
      meta: ['React', 'Personal']
    })
    .up()
    .addContainer('lifestyle', 'list', 'Lifestyle', {
      id: 'b2',
      type: 'blog',
      title: 'Why I Love Coffee',
      description: 'A look at caffeine',
      date: '2023-05-10',
      meta: ['Lifestyle']
    })
    .up()
    .build();

  console.log(`Blog tree children: ${blogTree.children.length}`);
  console.log(`First container: ${(blogTree.children[0] as CompositeNode).title}`);
  console.log(`Second container: ${(blogTree.children[1] as CompositeNode).title}`);

  console.log('\n✓ Builder: Complex trees built with method chaining\n');
}

demoContentBuilder();

// ====================================
// EXPORTS
// ====================================
export {
  ContentBuilder,
  type CompositeNode,
  type LeafNode,
  type LayoutNode,
  type UnifiedContentItem,
  type ComponentType,
  type LayoutStyleType,
  buildProjectsTree
};
