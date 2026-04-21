// [Flyweight: Flyweight Interface] -> เป็น Interface กลางที่ Flyweight ต้องมี

import { group } from "console";

/// Target/Component/Flyweight Interface
interface IContent {
    getTitle(): string;
    getStructureString(indent: string): string;
}

// [Flyweight: Intrinsic State (Data)] -> ข้อมูลดิบที่ "หนัก" และ "เหมือนกัน" (ห้ามแก้)
// Adaptee/Intrinsic
class Article {
    constructor(private id: string, private title: string) { }
    public getTitle(): string { return this.title; }
}

// [Flyweight: Intrinsic State (Data)]
// Adaptee/Intrinsic
class Project {
    constructor(private id: string, private title: string) { }
    public getTitle(): string { return this.title; }
}

// [Flyweight: Concrete Flyweight] -> วัตถุที่ถูกแชร์ (ถูกสร้างครั้งเดียว เก็บใน Factory)
// Adapter/Leaf/Concrete Flyweight
class ArticleAdapter implements IContent {
    constructor(private article: Article) { }

    public getTitle(): string {
        return this.article.getTitle();
    }

    public getStructureString(indent: string): string {
        return `${indent}- 📝 [Article] ${this.getTitle()}\n`;
    }
}

// [Flyweight: Concrete Flyweight]
// Adapter/Leaf/Concrete Flyweight
class ProjectAdapter implements IContent {
    constructor(private project: Project) { }

    public getTitle(): string {
        return this.project.getTitle();
    }

    public getStructureString(indent: string): string {
        return `${indent}- 🛠️  [Project] ${this.getTitle()}\n`;
    }
}

// [Composite: Composite]
// [Flyweight: Concrete Flyweight (Shared Node)] -> Group ก็เป็น Flyweight ได้ ถ้าเราแชร์ทั้งก้อน
// [Flyweight: Context (Container)] -> ในขณะเดียวกัน มันก็ทำหน้าที่เป็น Context เก็บ Reference ของลูกๆ
// Composite/Concrete Flyweight/Context
class ContentGroup implements IContent {
    private children: IContent[] = [];

    constructor(private id: string, private title: string) { }

    public add(content: IContent): void {
        if (!content) {
            console.warn(`[ContentGroup] Warning: Attempted to add undefined content to '${this.title}'`);
            return;
        }
        this.children.push(content);
    }

    public getTitle(): string { return this.title; }

    public getStructureString(indent: string): string {
        let output = `${indent}+ 📂 [Category] ${this.title}\n`;

        for (const child of this.children) {
            output += child.getStructureString(indent + "  ");
        }
        return output;
    }
}


// [Flyweight: Flyweight Factory] -> ผู้จัดการคลัง Content
// Flyweight Factory
class ContentFactory {
    private cache: Map<string, IContent> = new Map(); // content:IContent[] but this is Map // Flyweight

    /**
     * เมธอดหลัก: "มีก็เอาของเดิม ไม่มีค่อยสร้างใหม่"
     * @param key คีย์สำหรับอ้างอิง (เช่น ID ของบทเรียน)
     * @param createFn ฟังก์ชันสำหรับสร้าง Object ถ้ายังไม่มีใน Cache
     */
    public getContent(key: string, createFn: () => IContent): IContent {
        if (this.cache.has(key)) {
            // console.log(`♻️ [Factory] Reusing existing content: ${key}`);
            return this.cache.get(key)!;
        }

        // console.log(`✨ [Factory] Creating NEW content: ${key}`);
        const newContent = createFn();
        this.cache.set(key, newContent);
        return newContent;
    }

    public getCacheSize(): number {
        return this.cache.size;
    }
}



// 1. สร้างหรือดึง "CNN Basics" (Shared Group)
// Key: 'SHARED-CNN-BASE'
const FlyweightContentFactory = new ContentFactory();

FlyweightContentFactory.getContent("SHARED-CNN-BASE", () => {// สร้างครั้งแรก count 1 
    const group:ContentGroup = new ContentGroup("SHARED-01", "Foundation of CNN");

    // สร้างลูกๆ ผ่าน Factory ด้วย เพื่อให้ลูกๆ เป็น Flyweight เช่นกัน
    group.add(FlyweightContentFactory.getContent("ART-S01", () => // สร้าง Article S-01 ครั้งแรก count 2
        new ArticleAdapter(new Article("S-01", "Convolution Operation"))
    ));
    group.add(FlyweightContentFactory.getContent("ART-S02", () => // สร้าง Article S-02 ครั้งแรก count 3
        new ArticleAdapter(new Article("S-02", "Pooling Layers"))
    ));

    return group;
});

const cvCourse = new ContentGroup("CV-101", "Applied Computer Vision");

cvCourse.add(FlyweightContentFactory.getContent("PROJ-IMG-CLASS", () => // สร้าง Project Image Classification ครั้งแรก count 4
    new ProjectAdapter(new Project("P-99", "Image Classification Project"))
));

// เพิ่ม Article (ใช้ Factory สร้าง)
cvCourse.add(FlyweightContentFactory.getContent("ART-CV-HIST", () => // สร้าง Article History of CV ครั้งแรก count 5
    new ArticleAdapter(new Article("A-99", "History of CV"))
));

// สร้าง Group ย่อย
const detectionGroup = new ContentGroup("CV-G2", "Object Detection");

// เรียก key เดิม 'SHARED-CNN-BASE' -> Factory จะส่ง Object ตัวเดิมมาให้ ไม่สร้างใหม่
detectionGroup.add(FlyweightContentFactory.getContent("SHARED-CNN-BASE", () => {// เรียกใช้ Shared Content เดิม ด้วยการส่ง key check ก่อนว่ามีใน cache หรือไม่
    throw new Error("This shouldn't be called because it exists!"); // ถ้ามีเเล้ว ฟังก์ชันนี้จะไม่ถูกเรียก
}));

detectionGroup.add(FlyweightContentFactory.getContent("PROJ-YOLO", () => // ของใหม่ยังไม่เคยสร้าง
    new ProjectAdapter(new Project("P-01", "YOLO Implementation")) // สร้าง Project ใหม่ count 6
));

cvCourse.add(detectionGroup);// ใส่ของ detectionGroup(composite) ลงใน cvCourse(composite)


const dlCourse = new ContentGroup("DL-101", "Applied Deep Learning");

// เรียก key เดิม 'SHARED-CNN-BASE' -> ได้ Object ตัวเดิมเป๊ะๆ
dlCourse.add(FlyweightContentFactory.getContent("SHARED-CNN-BASE", () => {// เรียกใช้ Shared Content เดิม ด้วยการส่ง key check ก่อนว่ามีใน cache หรือไม่
    throw new Error("This shouldn't be called!"); // ถ้ามีเเล้ว ฟังก์ชันนี้จะไม่ถูกเรียก
}));

dlCourse.add(FlyweightContentFactory.getContent("ART-BACKPROP", () => // สร้าง Article Backprop ครั้งแรก count 7
    new ArticleAdapter(new Article("A-100", "Backprop Explained")) // สร้าง Article ใหม่
));


console.log("=== 👁️ Computer Vision Course Structure ===");
console.log(cvCourse.getStructureString(""));

console.log("\n=== 🧠 Deep Learning Course Structure ===");
console.log(dlCourse.getStructureString(""));

console.log("==========================================");
console.log(`📊 Total Objects in Memory (Factory Cache): ${FlyweightContentFactory.getCacheSize()}`);