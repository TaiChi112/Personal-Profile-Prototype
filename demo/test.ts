// interface ILayout {
//     render(): void;
// }
// class ListLayout implements ILayout {
//     render(): void {
//         console.log("Rendering in List Layout");
//     }
// }
// class GridLayout implements ILayout {
//     render(): void {
//         console.log("Rendering in Grid Layout");
//     }
// }

// abstract class Layout {
//     abstract createLayout(): ILayout;
//     renderLayout(): void {
//         const layout = this.createLayout();
//         layout.render();
//     }
// }
// class CreateListLayout extends Layout {
//     createLayout(): ILayout {
//         return new ListLayout();
//     }
// }
// class CreateGridLayout extends Layout {
//     createLayout(): ILayout {
//         return new GridLayout();
//     }
// }

// class User {
//     id: string;
//     name: string;
//     constructor(id: string, name: string) {
//         this.id = id;
//         this.name = name;
//     }
//     changeLayout(layout: Layout): Layout {
//         const newLayout = layout;
//         return newLayout;
//     }
// }

// // CLIENT CODE - การใช้งาน Factory Method

// const user1 = new User("1", "Alice");

// const createDefaultLayout: Layout = new CreateListLayout();
// createDefaultLayout.renderLayout();

// const createGridLayout: Layout = new CreateGridLayout();
// user1.changeLayout(createGridLayout);
// createGridLayout.renderLayout();

/**
 * ==================================================================================
 * 🏗️ SYSTEM: PERSONAL KNOWLEDGE MANAGEMENT (PKM)
 * Pattern Stack: Composite + Builder + Adapter
 * ==================================================================================
 */

// ----------------------------------------------------------------------------------
// 1. DATA DEFINITIONS (The Raw Materials)
// ----------------------------------------------------------------------------------

// [Inputs] Data ที่มี Attribute ต่างกัน
interface ArticleProps { author: string; readTime: number; content: string; }
interface ProjectProps { repoUrl: string; techStack: string[]; status: 'active' | 'archived'; }
interface TopicProps { description: string; icon?: string; }

// [Target Interface] Output มาตรฐานที่หน้าเว็บต้องการ (UI Card)
// นี่คือ "Target" ของ Adapter Pattern
interface UICard {
    getDisplayTitle(): string;
    getDisplaySubtitle(): string;
    getBadge(): string;
    getActionLink(): string;
}

// ----------------------------------------------------------------------------------
// 2. COMPOSITE PATTERN (The Structure)
// ----------------------------------------------------------------------------------

/**
 * [Composite: Component]
 * [Builder: Product Part]
 * [Adapter: Adaptee]
 * - เป็น Base Class ของทุก Node ใน Tree
 * - เป็น "Adaptee" เพราะมันมีข้อมูลดิบที่ UI เอาไปใช้ตรงๆ ไม่ได้ (ต้องผ่าน Adapter)
 */
abstract class KnowledgeNode {
    protected children: KnowledgeNode[] = [];

    constructor(
        public id: string,
        public title: string
    ) { }

    // Operation ของ Composite
    public add(node: KnowledgeNode): void {
        this.children.push(node);
    }

    public getChildren(): KnowledgeNode[] {
        return this.children;
    }

    // Abstract method เพื่อให้ Concrete Class บอกว่าตัวเองเป็น type อะไร
    public abstract getType(): string;
}

/**
 * [Composite: Composite]
 * [Builder: Concrete Product]
 * - เป็น Node ที่มีลูกได้ (เช่น Folder, Category)
 */
class TopicNode extends KnowledgeNode {
    constructor(title: string, public data: TopicProps) {
        super(`topic-${Date.now()}`, title);
    }

    public getType(): string { return 'TOPIC'; }
}

/**
 * [Composite: Leaf]
 * [Builder: Concrete Product]
 * - เป็น Node ปลายทาง (เช่น Article) ไม่มีลูก
 */
class ArticleNode extends KnowledgeNode {
    constructor(title: string, public data: ArticleProps) {
        super(`art-${Date.now()}`, title);
    }

    // Leaf มักจะ Override add() เพื่อป้องกันการใส่ลูก (หรือปล่อยว่างไว้)
    public add(node: KnowledgeNode): void {
        throw new Error("Cannot add child to a Leaf node (Article).");
    }

    public getType(): string { return 'ARTICLE'; }
}

/**
 * [Composite: Leaf]
 * [Builder: Concrete Product]
 */
class ProjectNode extends KnowledgeNode {
    constructor(title: string, public data: ProjectProps) {
        super(`proj-${Date.now()}`, title);
    }

    public add(node: KnowledgeNode): void {
        throw new Error("Cannot add child to a Leaf node (Project).");
    }

    public getType(): string { return 'PROJECT'; }
}

// ----------------------------------------------------------------------------------
// 3. ADAPTER PATTERN (The Translator)
// ----------------------------------------------------------------------------------

/**
 * [Adapter: Adapter]
 * ทำหน้าที่: ห่อหุ้ม KnowledgeNode (Adaptee) ให้กลายเป็น UICard (Target)
 * เหตุผล: เพื่อให้ Client (UI Renderer) ไม่ต้องเขียน if-else เช็ค type ของ Node
 */
class NodeToUIAdapter implements UICard {
    // [Adapter: Adaptee Reference]
    private adaptee: KnowledgeNode;

    constructor(node: KnowledgeNode) {
        this.adaptee = node;
    }

    // Implements Target Interface methods
    public getDisplayTitle(): string {
        return this.adaptee.title.toUpperCase();
    }

    public getDisplaySubtitle(): string {
        // Logic การแปลงข้อมูลที่ซับซ้อน (Specific Logic) อยู่ที่นี่
        if (this.adaptee instanceof ArticleNode) {
            const d = this.adaptee.data;
            return `✍️ ${d.author} (${d.readTime} min)`;
        }
        else if (this.adaptee instanceof ProjectNode) {
            const d = this.adaptee.data;
            return `🛠️ Stack: ${d.techStack.join(', ')}`;
        }
        else if (this.adaptee instanceof TopicNode) {
            return `📂 ${this.adaptee.data.description}`;
        }
        return "Unknown Content";
    }

    public getBadge(): string {
        if (this.adaptee instanceof ProjectNode) {
            return this.adaptee.data.status === 'active' ? '🟢 Active' : '⚫ Archived';
        }
        return this.adaptee.getType();
    }

    public getActionLink(): string {
        if (this.adaptee instanceof ProjectNode) {
            return this.adaptee.data.repoUrl;
        }
        return `/view/${this.adaptee.id}`;
    }
}

// ----------------------------------------------------------------------------------
// 4. BUILDER PATTERN (The Constructor)
// ----------------------------------------------------------------------------------

/**
 * [Builder: Builder Interface]
 * กำหนดสัญญาว่า Builder ต้องสามารถสร้างส่วนประกอบอะไรได้บ้าง
 */
interface IKnowledgeBuilder {
    reset(rootTitle: string): void;
    buildTopic(title: string, props: TopicProps): void;
    buildArticle(title: string, props: ArticleProps): void;
    buildProject(title: string, props: ProjectProps): void;
    closeScope(): void; // ถอยออกจาก Folder ปัจจุบัน
    getResult(): KnowledgeNode;
}

/**
 * [Builder: Concrete Builder]
 * ลงมือสร้าง Object จริง และจัดการ State (Stack)
 */
class KnowledgeTreeBuilder implements IKnowledgeBuilder {
    private root: TopicNode | null = null;
    private currentContainer: TopicNode | null = null;

    // Stack ช่วยจัดการ Nested Structure (Composite Logic inside Builder)
    private stack: TopicNode[] = [];

    public reset(rootTitle: string): void {
        this.root = new TopicNode(rootTitle, { description: "Root Knowledge Base" });
        this.currentContainer = this.root;
        this.stack = [this.root];
    }

    public buildTopic(title: string, props: TopicProps): void {
        this.validateState();
        const node = new TopicNode(title, props);

        // Add to current composite
        this.currentContainer!.add(node);

        // Drill down: ย้าย Focus ไปที่ Topic ใหม่เพื่อรอใส่ลูก
        this.stack.push(node);
        this.currentContainer = node;
    }

    public buildArticle(title: string, props: ArticleProps): void {
        this.validateState();
        const node = new ArticleNode(title, props);
        this.currentContainer!.add(node);
        // Leaf node ไม่ต้อง push stack
    }

    public buildProject(title: string, props: ProjectProps): void {
        this.validateState();
        const node = new ProjectNode(title, props);
        this.currentContainer!.add(node);
    }

    public closeScope(): void {
        if (this.stack.length > 1) {
            this.stack.pop();
            this.currentContainer = this.stack[this.stack.length - 1];
        }
    }

    public getResult(): KnowledgeNode {
        if (!this.root) throw new Error("Build not started!");
        return this.root;
    }

    private validateState(): void {
        if (!this.currentContainer) throw new Error("Builder state invalid. Call reset() first.");
    }
}

// ----------------------------------------------------------------------------------
// 5. DIRECTOR (The Recipe) - Optional but requested for "Full Scale"
// ----------------------------------------------------------------------------------

/**
 * [Builder: Director]
 * เก็บ "สูตรสำเร็จ" ในการสร้าง Content ที่ซับซ้อน
 * ช่วยให้ Client ไม่ต้องเรียก builder.add() ทีละบรรทัดเอง
 */
class CurriculumDirector {
    public constructComputerVisionCourse(builder: IKnowledgeBuilder): void {
        builder.reset("Computer Vision Mastery");

        // Chapter 1
        builder.buildTopic("Image Processing 101", { description: "Pixel manipulation basics" });
        builder.buildArticle("What is a Pixel?", { author: "FumadProff", readTime: 5, content: "..." });
        builder.buildProject("OpenCV Greyscale", {
            repoUrl: "github.com/cv/grey",
            techStack: ["Python", "OpenCV"],
            status: "active"
        });
        builder.closeScope(); // จบ Chapter 1

        // Chapter 2
        builder.buildTopic("Deep Learning for Vision", { description: "CNNs & Transformers" });
        builder.buildArticle("Understanding Convolution", { author: "FumadProff", readTime: 15, content: "..." });
        builder.closeScope(); // จบ Chapter 2

        // Root scope ไม่ต้อง close เพราะ getResult() จะคืนค่า Root
    }
}

// ----------------------------------------------------------------------------------
// 6. CLIENT CODE (The Usage)
// ----------------------------------------------------------------------------------

/**
 * [Adapter: Client] -> ใช้ UICard interface
 * [Builder: Client] -> ใช้ Director และ Builder
 */
function mainApp() {

    // 1. Setup Builder & Director
    const builder = new KnowledgeTreeBuilder();
    const director = new CurriculumDirector();

    // 2. Construct the Product (Complex Tree)
    director.constructComputerVisionCourse(builder);
    const knowledgeTree = builder.getResult(); // ได้ [Product] ออกมา

    // 3. Render Loop (Simulate UI Framework)
    console.log("\n🎨 Rendering UI (via Adapter)...");

    // ฟังก์ชัน Recursive สำหรับแสดงผล
    function renderNode(node: KnowledgeNode, level: number) {
        // [Adapter Pattern In Action]
        // ห่อ Node ดิบด้วย Adapter เพื่อให้คุยกับ UI รู้เรื่อง
        const uiCard: UICard = new NodeToUIAdapter(node);

        const indent = "  ".repeat(level);
        const icon = node instanceof TopicNode ? "📁" : "📄";

        console.log(`${indent}${icon} CARD: ${uiCard.getDisplayTitle()}`);
        console.log(`${indent}   Info: ${uiCard.getDisplaySubtitle()}`);
        console.log(`${indent}   Badge: [${uiCard.getBadge()}] Link: ${uiCard.getActionLink()}`);

        // ถ้าเป็น Composite ให้วนลูปต่อ
        if (node instanceof TopicNode) {
            node.getChildren().forEach(child => renderNode(child, level + 1));
        }
    }

    renderNode(knowledgeTree, 0);
}

mainApp();