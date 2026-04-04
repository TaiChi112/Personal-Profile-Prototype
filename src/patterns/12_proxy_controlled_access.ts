/**
 * PROXY PATTERN - Controlled Access & Lazy Loading
 * 
 * Problem: page.tsx loads heavy resources upfront (images, data, components)
 *          - Page loads slowly
 *          - Some resources never used
 *          - Want to control access and defer initialization
 * 
 * Solution: Create proxy that defers real object creation until needed
 *          Can also add access control, logging, caching
 * 
 * Real-world usage from page.tsx:
 *   - Heavy images loaded only when scrolled into view (lazy loading proxy)
 *   - API data fetched only when component accessed (data proxy)
 *   - Sensitive features protected with access control (protection proxy)
 */

// ====================================
// SUBJECT INTERFACE
// ====================================

export interface ResourceLoader {
  load(): Promise<string>;
  getData(): string;
  getName(): string;
}

// ====================================
// REAL SUBJECT - Heavy Resource
// ====================================

/**
 * Real component that's expensive to create/load
 */
export class HeavyImage implements ResourceLoader {
  private url: string;
  private data: string = '';
  private loadTime: number = 0;

  constructor(url: string) {
    this.url = url;
    console.log(`[HeavyImage] Constructor - NOT loading yet: ${url}`);
  }

  async load(): Promise<string> {
    console.log(`[HeavyImage] Actually loading from: ${this.url}`);
    // Simulate heavy loading
    const startTime = Date.now();
    this.data = `<img src="${this.url}" alt="Image" />`;
    this.loadTime = Date.now() - startTime;
    console.log(`[HeavyImage] Loaded in ${this.loadTime}ms`);
    return this.data;
  }

  getData(): string {
    if (!this.data) {
      console.warn('[HeavyImage] Data not loaded! Call load() first');
      return '';
    }
    return this.data;
  }

  getName(): string {
    return `Image: ${this.url}`;
  }
}

/**
 * Real API client - expensive to initialize
 */
export class APIClient implements ResourceLoader {
  private data: string = '';
  private initialized: boolean = false;

  constructor(private endpoint: string) {
    console.log(`[APIClient] Constructor - NOT initializing: ${endpoint}`);
  }

  async load(): Promise<string> {
    console.log(`[APIClient] Initializing client for: ${this.endpoint}`);
    this.data = `{
      "status": "ok",
      "data": "Fetched from ${this.endpoint}",
      "timestamp": "${new Date().toISOString()}"
    }`;
    this.initialized = true;
    return this.data;
  }

  getData(): string {
    if (!this.initialized) {
      console.warn('[APIClient] Not initialized! Call load() first');
      return '';
    }
    return this.data;
  }

  getName(): string {
    return `API: ${this.endpoint}`;
  }
}

// ====================================
// PROXY - Lazy Loading
// ====================================

/**
 * Proxy for lazy loading resources
 */
export class LazyLoadingProxy implements ResourceLoader {
  private realResource: ResourceLoader | null = null;
  private loaded: boolean = false;

  constructor(
    private resourceFactory: () => ResourceLoader,
    private name: string
  ) {
    console.log(`[LazyLoadingProxy] Created for: ${name} - Real resource NOT created yet`);
  }

  async load(): Promise<string> {
    if (!this.realResource) {
      console.log(`[LazyLoadingProxy] First access - Creating real resource...`);
      this.realResource = this.resourceFactory();
      await this.realResource.load();
      this.loaded = true;
    }
    return this.realResource.getData();
  }

  getData(): string {
    if (!this.realResource) {
      console.warn('[LazyLoadingProxy] Resource not loaded yet');
      return '';
    }
    return this.realResource.getData();
  }

  getName(): string {
    return `Lazy[${this.name}]`;
  }

  isLoaded(): boolean {
    return this.loaded;
  }
}

// ====================================
// PROXY - Caching
// ====================================

/**
 * Proxy with caching to avoid repeated loads
 */
export class CachingProxy implements ResourceLoader {
  private realResource: ResourceLoader;
  private cache: string | null = null;
  private accessCount: number = 0;

  constructor(realResource: ResourceLoader) {
    this.realResource = realResource;
    console.log(`[CachingProxy] Wrapping: ${realResource.getName()}`);
  }

  async load(): Promise<string> {
    console.log('[CachingProxy] Load requested');
    const data = await this.realResource.load();
    this.cache = data;
    return data;
  }

  getData(): string {
    this.accessCount++;
    if (this.cache) {
      console.log(`[CachingProxy] Cache HIT (${this.accessCount} total accesses)`);
      return this.cache;
    }
    console.log('[CachingProxy] Cache MISS - fetching from real resource');
    const data = this.realResource.getData();
    this.cache = data;
    return data;
  }

  getName(): string {
    return `Cached[${this.realResource.getName()}]`;
  }

  getAccessStats(): { total: number; cacheHits: number } {
    return {
      total: this.accessCount,
      cacheHits: this.cache ? this.accessCount - 1 : 0,
    };
  }

  clearCache(): void {
    console.log('[CachingProxy] Cache cleared');
    this.cache = null;
  }
}

// ====================================
// PROXY - Access Control
// ====================================

export interface AccessControl {
  canAccess(resource: string): boolean;
}

/**
 * Proxy with access control
 */
export class ProtectionProxy implements ResourceLoader {
  constructor(
    private realResource: ResourceLoader,
    private accessControl: AccessControl
  ) {
    console.log(`[ProtectionProxy] Protecting: ${realResource.getName()}`);
  }

  async load(): Promise<string> {
    if (!this.accessControl.canAccess(this.realResource.getName())) {
      throw new Error(`❌ Access denied to: ${this.realResource.getName()}`);
    }
    return this.realResource.load();
  }

  getData(): string {
    if (!this.accessControl.canAccess(this.realResource.getName())) {
      throw new Error(`❌ Access denied to: ${this.realResource.getName()}`);
    }
    return this.realResource.getData();
  }

  getName(): string {
    return `Protected[${this.realResource.getName()}]`;
  }
}

// ====================================
// PROXY - Virtual Proxy (deferred initialization)
// ====================================

/**
 * Virtual proxy that creates object only when needed
 */
export class VirtualProxy implements ResourceLoader {
  private realResource: HeavyImage | null = null;

  constructor(private url: string) {
    console.log(`[VirtualProxy] Created without loading: ${url}`);
  }

  async load(): Promise<string> {
    if (!this.realResource) {
      console.log('[VirtualProxy] First use - Creating real object');
      this.realResource = new HeavyImage(this.url);
      return await this.realResource.load();
    }
    return await this.realResource.load();
  }

  getData(): string {
    if (!this.realResource) {
      console.warn('[VirtualProxy] Object not created yet');
      return '';
    }
    return this.realResource.getData();
  }

  getName(): string {
    return `Virtual[${this.url}]`;
  }
}

// ====================================
// RESOURCE MANAGER - Uses proxies
// ====================================

export class ResourceManager {
  private resources: Map<string, ResourceLoader> = new Map();

  registerLazy(id: string, factory: () => ResourceLoader): void {
    const proxy = new LazyLoadingProxy(factory, id);
    this.resources.set(id, proxy);
    console.log(`✓ Registered lazy: ${id}`);
  }

  registerCached(id: string, resource: ResourceLoader): void {
    const proxy = new CachingProxy(resource);
    this.resources.set(id, proxy);
    console.log(`✓ Registered cached: ${id}`);
  }

  registerProtected(
    id: string,
    resource: ResourceLoader,
    control: AccessControl
  ): void {
    const proxy = new ProtectionProxy(resource, control);
    this.resources.set(id, proxy);
    console.log(`✓ Registered protected: ${id}`);
  }

  async loadResource(id: string): Promise<string> {
    const resource = this.resources.get(id);
    if (!resource) {
      throw new Error(`Resource not found: ${id}`);
    }
    return await resource.load();
  }

  getResource(id: string): ResourceLoader | undefined {
    return this.resources.get(id);
  }

  listResources(): string[] {
    return Array.from(this.resources.keys());
  }
}

// ====================================
// DEMO
// ====================================

export function demoProxyPattern() {
  console.log('\n🔐 PROXY PATTERN - Controlled Access & Lazy Loading\n');

  // === EXAMPLE 1: Lazy Loading ===
  console.log('📌 Example 1: Lazy Loading Proxy\n');
  const lazyImage = new LazyLoadingProxy(
    () => new HeavyImage('https://example.com/large-image.jpg'),
    'Hero Image'
  );
  console.log('Created proxy (real object not created)');
  console.log('Proxy created:', (lazyImage as LazyLoadingProxy).isLoaded() === false); // true

  // === EXAMPLE 2: Caching Proxy ===
  console.log('\n📌 Example 2: Caching Proxy\n');
  const realClient = new APIClient('https://api.example.com/data');
  const cachedClient = new CachingProxy(realClient);

  console.log('First access:');
  cachedClient.getData(); // Cache miss

  console.log('Second access:');
  cachedClient.getData(); // Cache hit

  console.log('Third access:');
  cachedClient.getData(); // Cache hit

  const stats = (cachedClient as CachingProxy).getAccessStats();
  console.log(`Stats: ${stats.total} total, ${stats.cacheHits} cache hits`);

  // === EXAMPLE 3: Virtual Proxy ===
  console.log('\n📌 Example 3: Virtual Proxy\n');
  const virtualImg = new VirtualProxy('https://example.com/image.jpg');
  console.log('Created virtual proxy - no real object yet');
  // Real object created when first accessed
  virtualImg.getData();

  // === EXAMPLE 4: Protection Proxy ===
  console.log('\n📌 Example 4: Protection Proxy\n');

  const adminControl: AccessControl = {
    canAccess: (resource: string) => resource.includes('admin'),
  };

  const publicControl: AccessControl = {
    canAccess: () => true,
  };

  const adminResource = new ProtectionProxy(
    new APIClient('https://api.example.com/admin'),
    adminControl
  );

  const publicResource = new ProtectionProxy(
    new APIClient('https://api.example.com/public'),
    publicControl
  );

  try {
    console.log('Attempting public access...');
    publicResource.getData();
    console.log('✓ Public access allowed');
  } catch {
    console.log('✗ Public access denied');
  }

  try {
    console.log('Attempting admin access...');
    adminResource.getData();
    console.log('✓ Admin access allowed');
  } catch (e) {
    console.log('✗ Admin access denied:', (e as Error).message);
  }

  // === EXAMPLE 5: Resource Manager ===
  console.log('\n📌 Example 5: Resource Manager\n');
  const manager = new ResourceManager();

  manager.registerLazy('image1', () => new HeavyImage('/images/hero.jpg'));
  manager.registerLazy('image2', () => new HeavyImage('/images/gallery.jpg'));
  manager.registerCached('api-users', new APIClient('/api/users'));
  manager.registerProtected('api-admin', new APIClient('/api/admin'), adminControl);

  console.log('\nRegistered resources:', manager.listResources());

  console.log(
    '\n✅ Proxy Pattern Benefits:'
  );
  console.log(
    '  ✓ Defer expensive object creation (lazy loading)'
  );
  console.log(
    '  ✓ Cache frequently accessed resources'
  );
  console.log(
    '  ✓ Control access with permissions'
  );
  console.log(
    '  ✓ Log/monitor all accesses'
  );
  console.log(
    '  ✓ Improve performance and security'
  );
}
