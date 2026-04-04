/**
 * FLYWEIGHT PATTERN - Share Objects Efficiently
 * 
 * Problem: page.tsx renders many similar components
 *          - ProjectCard rendered 100 times with different data
 *          - DemoSection rendered many times
 *          - Each copy uses memory for shared structure
 *          - Wasteful when only data differs
 * 
 * Solution: Share intrinsic state (structure), keep extrinsic state (data) separate
 *          One template + many data objects = memory efficient
 * 
 * Real-world usage from page.tsx:
 *   - ProjectCardFlyweight (1 instance) + data objects (many instances)
 *   - Badge style shared across many badges
 *   - Theme styles shared across components
 */

// ====================================
// INTRINSIC STATE - Shared, unchanging
// ====================================

/**
 * Style/structure that's reused
 */
export interface CardStyle {
  borderRadius: number;
  padding: number;
  shadowBlur: number;
  animationDuration: number;
}

// ====================================
// EXTRINSIC STATE - Instance specific, changing
// ====================================

/**
 * Data specific to each instance
 */
export interface ProjectData {
  id: string;
  title: string;
  description: string;
  tags: string[];
  imageUrl: string;
  url: string;
}

export interface BadgeData {
  id: string;
  label: string;
  color: string;
}

// ====================================
// FLYWEIGHT - Card
// ====================================

/**
 * Flyweight that handles rendering with shared style
 */
export class CardFlyweight {
  constructor(
    private style: CardStyle,
    private cardType: 'project' | 'article' | 'feature' = 'project'
  ) {}

  /**
   * Render card with external data (extrinsic state)
   */
  render(data: ProjectData): string {
    const css = this.getStyleCSS();
    return `
      <div class="card ${this.cardType}" style="${css}">
        <img src="${data.imageUrl}" alt="${data.title}" class="card-img" />
        <div class="card-body">
          <h3>${data.title}</h3>
          <p>${data.description}</p>
          <div class="tags">
            ${data.tags.map((tag) => `<span class="tag">${tag}</span>`).join('')}
          </div>
          <a href="${data.url}" class="btn">View Project</a>
        </div>
      </div>
    `;
  }

  private getStyleCSS(): string {
    return `
      border-radius: ${this.style.borderRadius}px;
      padding: ${this.style.padding}px;
      box-shadow: 0 0 ${this.style.shadowBlur}px rgba(0,0,0,0.1);
      animation-duration: ${this.style.animationDuration}ms;
    `;
  }

  getType(): string {
    return this.cardType;
  }
}

/**
 * Flyweight for badges
 */
export class BadgeFlyweight {
  constructor(
    private style: { fontSize: number; padding: number; borderRadius: number }
  ) {}

  render(data: BadgeData): string {
    return `
      <span 
        class="badge" 
        style="
          font-size: ${this.style.fontSize}px;
          padding: ${this.style.padding}px;
          border-radius: ${this.style.borderRadius}px;
          background-color: ${data.color};
        "
      >
        ${data.label}
      </span>
    `;
  }
}

// ====================================
// FLYWEIGHT FACTORY - Create & cache flyweights
// ====================================

/**
 * Factory that ensures only one flyweight per configuration
 */
export class CardFlyweightFactory {
  private flyweights: Map<string, CardFlyweight> = new Map();
  private defaultStyle: CardStyle = {
    borderRadius: 8,
    padding: 20,
    shadowBlur: 8,
    animationDuration: 300,
  };

  /**
   * Get or create flyweight (cached)
   */
  getFlyweight(type: 'project' | 'article' | 'feature' = 'project'): CardFlyweight {
    const key = `card-${type}`;

    if (!this.flyweights.has(key)) {
      const style = this.getStyleForType(type);
      const flyweight = new CardFlyweight(style, type);
      this.flyweights.set(key, flyweight);
      console.log(`[Factory] Created new CardFlyweight: ${key}`);
    } else {
      console.log(`[Factory] Reusing existing CardFlyweight: ${key}`);
    }

    return this.flyweights.get(key)!;
  }

  /**
   * Get different style based on type
   */
  private getStyleForType(type: string): CardStyle {
    const styles: Record<string, CardStyle> = {
      project: { borderRadius: 8, padding: 20, shadowBlur: 8, animationDuration: 300 },
      article: { borderRadius: 0, padding: 16, shadowBlur: 4, animationDuration: 200 },
      feature: { borderRadius: 12, padding: 24, shadowBlur: 12, animationDuration: 400 },
    };
    return styles[type] || this.defaultStyle;
  }

  /**
   * Get flyweight stats
   */
  getStats(): { cached: number; types: string[] } {
    return {
      cached: this.flyweights.size,
      types: Array.from(this.flyweights.keys()),
    };
  }
}

/**
 * Factory for badges
 */
export class BadgeFlyweightFactory {
  private flyweights: Map<string, BadgeFlyweight> = new Map();
  private defaultStyle = { fontSize: 12, padding: 6, borderRadius: 4 };

  getFlyweight(size: 'small' | 'medium' | 'large' = 'medium'): BadgeFlyweight {
    const key = `badge-${size}`;

    if (!this.flyweights.has(key)) {
      const style = this.getStyleForSize(size);
      const flyweight = new BadgeFlyweight(style);
      this.flyweights.set(key, flyweight);
      console.log(`[Factory] Created BadgeFlyweight: ${key}`);
    }

    return this.flyweights.get(key)!;
  }

  private getStyleForSize(
    size: 'small' | 'medium' | 'large'
  ): { fontSize: number; padding: number; borderRadius: number } {
    const styles: Record<'small' | 'medium' | 'large', { fontSize: number; padding: number; borderRadius: number }> = {
      small: { fontSize: 10, padding: 4, borderRadius: 3 },
      medium: { fontSize: 12, padding: 6, borderRadius: 4 },
      large: { fontSize: 14, padding: 8, borderRadius: 5 },
    };
    return styles[size] || this.defaultStyle;
  }
}

// ====================================
// CONTEXT - Holds extrinsic state
// ====================================

/**
 * Holds data that varies (extrinsic state)
 * Paired with flyweight for complete rendering
 */
export class CardContext {
  constructor(
    private flyweight: CardFlyweight,
    private data: ProjectData
  ) {}

  render(): string {
    return this.flyweight.render(this.data);
  }

  getData(): ProjectData {
    return this.data;
  }
}

// ====================================
// CARD RENDERER - Uses flyweights
// ====================================

export class CardRenderer {
  constructor(
    private cardFactory: CardFlyweightFactory,
    private badgeFactory: BadgeFlyweightFactory
  ) {}

  /**
   * Render multiple cards efficiently
   */
  renderCards(projects: ProjectData[], type: 'project' | 'article' | 'feature' = 'project'): string {
    const flyweight = this.cardFactory.getFlyweight(type);
    let html = '';

    projects.forEach((project) => {
      html += flyweight.render(project);
    });

    return html;
  }

  /**
   * Render badges efficiently
   */
  renderBadges(badges: BadgeData[], size: 'small' | 'medium' | 'large' = 'medium'): string {
    const flyweight = this.badgeFactory.getFlyweight(size);
    let html = '';

    badges.forEach((badge) => {
      html += flyweight.render(badge);
    });

    return html;
  }

  /**
   * Get memory stats
   */
  getStats(): {
    cardFlyweights: number;
    badgeFlyweights: number;
  } {
    return {
      cardFlyweights: this.cardFactory.getStats().cached,
      badgeFlyweights: 3, // small, medium, large
    };
  }
}

// ====================================
// MEMORY COMPARISON - With vs Without Flyweight
// ====================================

export function compareMemoryUsage() {
  console.log('\n💾 Memory Usage Comparison\n');

  // Without Flyweight: Each card has full copy of style
  const cardSizeWithoutFlyweight = 8; // kb - approximate
  const numCards = 1000;
  const memoryWithout = cardSizeWithoutFlyweight * numCards;

  // With Flyweight: Share style, only store data
  const cardDataSize = 2; // kb - just data
  const flyweightSize = 0.5; // kb - one shared copy
  const memoryWith = flyweightSize + cardDataSize * numCards;

  console.log(`Without Flyweight Pattern:`);
  console.log(`  • Card size: ${cardSizeWithoutFlyweight}kb`);
  console.log(`  • Number of cards: ${numCards}`);
  console.log(`  • Total memory: ${memoryWithout}kb`);

  console.log(`\nWith Flyweight Pattern:`);
  console.log(`  • Flyweight size: ${flyweightSize}kb (shared once)`);
  console.log(`  • Data per card: ${cardDataSize}kb`);
  console.log(`  • Total memory: ${memoryWith}kb`);

  const saved = memoryWithout - memoryWith;
  const percentage = ((saved / memoryWithout) * 100).toFixed(1);
  console.log(`\n✅ Memory saved: ${saved}kb (${percentage}% reduction)`);
}

// ====================================
// DEMO
// ====================================

export function demoFlyweightPattern() {
  console.log('\n🪶 FLYWEIGHT PATTERN - Share Objects Efficiently\n');

  // Create factories
  const cardFactory = new CardFlyweightFactory();
  const badgeFactory = new BadgeFlyweightFactory();
  const renderer = new CardRenderer(cardFactory, badgeFactory);

  // Sample data
  const projects: ProjectData[] = [
    {
      id: '1',
      title: 'E-Commerce Platform',
      description: 'Full-stack online store',
      tags: ['React', 'Node.js', 'MongoDB'],
      imageUrl: '/images/ecommerce.jpg',
      url: 'https://example.com/ecommerce',
    },
    {
      id: '2',
      title: 'Task Manager App',
      description: 'Collaborative task management',
      tags: ['Vue', 'Firebase', 'Tailwind'],
      imageUrl: '/images/tasks.jpg',
      url: 'https://example.com/tasks',
    },
    {
      id: '3',
      title: 'Analytics Dashboard',
      description: 'Real-time data visualization',
      tags: ['React', 'D3.js', 'AWS'],
      imageUrl: '/images/analytics.jpg',
      url: 'https://example.com/analytics',
    },
  ];

  const badges: BadgeData[] = [
    { id: 'b1', label: 'React', color: '#61dafb' },
    { id: 'b2', label: 'TypeScript', color: '#3178c6' },
    { id: 'b3', label: 'Node.js', color: '#339933' },
    { id: 'b4', label: 'PostgreSQL', color: '#336791' },
  ];

  // Render cards
  console.log('🎴 Rendering 3 project cards (reusing 1 flyweight):');
  renderer.renderCards(projects, 'project');
  console.log('✓ Rendered');

  // Render more cards - flyweight reused
  console.log('\n🎴 Rendering 3 article cards (reusing 1 flyweight):');
  renderer.renderCards(projects, 'article');
  console.log('✓ Rendered');

  // Render badges
  console.log('\n🏷️  Rendering badges (reusing small flyweight):');
  renderer.renderBadges(badges, 'small');
  console.log('✓ Rendered');

  // Stats
  console.log('\n📊 Flyweight Factory Stats:');
  const stats = renderer.getStats();
  console.log(`  Card flyweights created: ${stats.cardFlyweights}`);
  console.log(`  Badge flyweights created: ${stats.badgeFlyweights}`);
  console.log('  → Flyweights are SHARED across all instances');

  // Memory comparison
  compareMemoryUsage();

  console.log(
    '\n✅ Flyweight Pattern Benefits:'
  );
  console.log(
    '  ✓ Reduce memory usage significantly'
  );
  console.log(
    '  ✓ Share intrinsic state (structure) across objects'
  );
  console.log(
    '  ✓ Keep extrinsic state (data) separate'
  );
  console.log(
    '  ✓ Efficient for large numbers of similar objects'
  );
  console.log(
    '  ✓ Improved performance with fewer objects'
  );
}
