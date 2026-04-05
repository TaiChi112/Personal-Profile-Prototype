// ==========================================
// 1. Product Interface
// ==========================================
interface ILayout {
    render(): void;
}

class ListLayout implements ILayout {
    render(): void {
        console.log("📋 Rendering in List Layout");
    }
}

class GridLayout implements ILayout {
    render(): void {
        console.log("📊 Rendering in Grid Layout");
    }
}

// ==========================================
// 2. Factory Method Pattern (Creator)
// ==========================================
abstract class LayoutFactory {
    abstract createLayout(): ILayout;
    abstract getLayoutType(): string;  // ✅ แต่ละ Factory บอก type ของตัวเอง
}

class ListLayoutFactory extends LayoutFactory {
    createLayout(): ILayout {
        return new ListLayout();
    }
    getLayoutType(): string {
        return "list";
    }
}

class GridLayoutFactory extends LayoutFactory {
    createLayout(): ILayout {
        return new GridLayout();
    }
    getLayoutType(): string {
        return "grid";
    }
}

// ==========================================
// 3. Factory Registry (Central Registry)
// ==========================================
class LayoutFactoryRegistry {
    private static instance: LayoutFactoryRegistry;
    private factories: Map<string, LayoutFactory> = new Map();

    private constructor() { }

    public static getInstance(): LayoutFactoryRegistry {
        if (!LayoutFactoryRegistry.instance) {
            LayoutFactoryRegistry.instance = new LayoutFactoryRegistry();
        }
        return LayoutFactoryRegistry.instance;
    }

    // ✅ Factory register ตัวเอง
    public register(factory: LayoutFactory): void {
        const type = factory.getLayoutType();
        this.factories.set(type, factory);
        console.log(`✓ Registered: ${type} layout`);
    }

    // ✅ ดึง Factory ตาม type
    public getFactory(type: string): LayoutFactory | undefined {
        return this.factories.get(type);
    }

    // ✅ List ทั้งหมด
    public getAvailableTypes(): string[] {
        return Array.from(this.factories.keys());
    }
}

// ==========================================
// 4. Page/View Component (Render & State)
// ==========================================
class Page {
    private currentLayout: ILayout;
    private currentType: string;
    private registry: LayoutFactoryRegistry;

    constructor(defaultType: string = "list") {
        this.registry = LayoutFactoryRegistry.getInstance();
        this.currentType = defaultType;

        // Initial render
        const factory = this.registry.getFactory(defaultType);
        this.currentLayout = factory!.createLayout();
    }

    // ✅ ไม่ต้อง hard-code type แล้ว - รับ string ธรรมดา
    public changeLayout(layoutType: string): boolean {
        const factory = this.registry.getFactory(layoutType);

        if (!factory) {
            console.log(`❌ Layout type "${layoutType}" not found`);
            console.log(`   Available: ${this.registry.getAvailableTypes().join(", ")}`);
            return false;
        }

        this.currentType = layoutType;
        this.currentLayout = factory.createLayout();
        console.log(`🔄 Layout changed to: ${layoutType}`);
        this.displayLayout();
        return true;
    }

    public displayLayout(): void {
        console.log(`\n📺 Current Layout: ${this.currentType}`);
        this.currentLayout.render();
    }

    public getAvailableLayouts(): string[] {
        return this.registry.getAvailableTypes();
    }
}

// ==========================================
// 5. User (Interaction Only)
// ==========================================
class User {
    id: string;
    name: string;

    constructor(id: string, name: string) {
        this.id = id;
        this.name = name;
    }

    // ✅ รับ string ธรรมดา ไม่ต้อง hard-code type
    clickChangeLayout(page: Page, layoutType: string): void {
        console.log(`\n👤 ${this.name} clicked: Change to "${layoutType}" layout`);
        page.changeLayout(layoutType);
    }
}

// ==========================================
// 6. Bootstrap: Register All Factories
// ==========================================
// ✅ จุดเดียวที่ต้องแก้เมื่อเพิ่ม Layout ใหม่
const registry = LayoutFactoryRegistry.getInstance();
registry.register(new ListLayoutFactory());
registry.register(new GridLayoutFactory());

// ==========================================
// 7. CLIENT CODE - Usage Demo
// ==========================================
console.log("=== Factory Method with Registry Pattern ===\n");

// Setup
const myPage = new Page("list");  // Default layout
const alice = new User("1", "Alice");

// Display default
console.log("📍 Step 1: Initial page load");
myPage.displayLayout();

// User clicks
alice.clickChangeLayout(myPage, "grid");
alice.clickChangeLayout(myPage, "timeline");  // ✨ ใช้งาน Timeline ได้เลย!

// Error handling
console.log("\n📍 Step 2: Try invalid layout");
alice.clickChangeLayout(myPage, "invalid");

// List available layouts
console.log(`\n📋 Available layouts: ${myPage.getAvailableLayouts().join(", ")}`);