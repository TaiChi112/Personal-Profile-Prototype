// ==========================================================
// 1. Adapter Pattern
// Concept: แปลง Data Source ที่ต่างกัน (Article, Blog) ให้เป็นมาตรฐานเดียว
// ==========================================================

// [Adapter: Target]
// อินเทอร์เฟซกลางที่ระบบ Layout และ Theme รู้จัก
interface IStandardContent {
    getTitle(): string;
    getSummary(): string; // ใช้สำหรับแสดงเนื้อหาย่อใน Card
    getMetadata(): string; // ข้อมูลประกอบ เช่น วันที่, ผู้เขียน
}

// [Adapter: Adaptee] - Legacy / 3rd Party Class A
class Article {
    constructor(
        public headline: string,
        public textBody: string,
        public author: string,
        public publishedAt: Date,
        public relatedTopics: string[]
    ) { }
}

// [Adapter: Adaptee] - Legacy / 3rd Party Class B
class Blog {
    constructor(
        public topic: string,
        public content: string,
        public author: string,
        public publishedAt: Date,
        public tags: string[]
    ) { }
}

// [Adapter: Adapter]
class ArticleAdapter implements IStandardContent {
    constructor(private article: Article) { }

    getTitle(): string { return this.article.headline; }
    getSummary(): string { return this.article.textBody.slice(0, 50) + "..."; }
    getMetadata(): string { return `By ${this.article.author} | ${this.article.publishedAt.toLocaleDateString()}`; }
}

// [Adapter: Adapter]
class BlogAdapter implements IStandardContent {
    constructor(private blog: Blog) { }

    getTitle(): string { return this.blog.topic; }
    getSummary(): string { return this.blog.content.slice(0, 50) + "..."; }
    getMetadata(): string { return `Blog (${this.blog.tags.join(',')}) | ${this.blog.publishedAt.toLocaleDateString()}`; }
}

// ==========================================================
// 2. Abstract Factory Pattern (The Theme System)
// Concept: กำหนด "Web Style" (Modern, Classic, Future)
// ==========================================================

// [Abstract Factory: Abstract Product A]
// การ์ด 1 ใบ แสดงผลอย่างไร? (ขึ้นอยู่กับ Theme)
interface ICard {
    render(content: IStandardContent): string;
}

// [Abstract Factory: Abstract Product B]
// ปุ่มสำหรับ interaction (ขึ้นอยู่กับ Theme)
interface IButton {
    renderButton(label: string): string;
}

// [Abstract Factory: Abstract Factory]
// โรงงานผลิต UI Component ตาม Theme ที่เลือก
interface ThemeFactory {
    createCard(): ICard;
    createButton(): IButton;
    getThemeName(): string;
}

// --- Theme 1: Classic (Box style) ---
// [Abstract Factory: Concrete Product 1]
class ClassicCard implements ICard {
    render(content: IStandardContent): string {
        return `
    +--------------------------------+
    | [CLASSIC] ${content.getTitle()}
    | ------------------------------
    | ${content.getSummary()}
    | [Meta]: ${content.getMetadata()}
    +--------------------------------+`;
    }
}

// [Abstract Factory: Concrete Product 1B]
class ClassicButton implements IButton {
    renderButton(label: string): string {
        return `[ ${label} ]`;
    }
}

// [Abstract Factory: Concrete Factory 1]
class ClassicThemeFactory implements ThemeFactory {
    createCard(): ICard { return new ClassicCard(); }
    createButton(): IButton { return new ClassicButton(); }
    getThemeName(): string { return "Classic 90s"; }
}

// --- Theme 2: Modern (Clean, Minimal) ---
// [Abstract Factory: Concrete Product 2]
class ModernCard implements ICard {
    render(content: IStandardContent): string {
        return `
    ✨ ${content.getTitle()}
       ${content.getSummary()}
       Running low key: ${content.getMetadata()}`;
    }
}

// [Abstract Factory: Concrete Product 2B]
class ModernButton implements IButton {
    renderButton(label: string): string {
        return `✨ ${label} ✨`;
    }
}

// [Abstract Factory: Concrete Factory 2]
class ModernThemeFactory implements ThemeFactory {
    createCard(): ICard { return new ModernCard(); }
    createButton(): IButton { return new ModernButton(); }
    getThemeName(): string { return "Modern 2025"; }
}

// --- Theme 3: Future (Cyberpunk) ---
// [Abstract Factory: Concrete Product 3]
class FutureCard implements ICard {
    render(content: IStandardContent): string {
        return `
    >>> STREAM_DATA: ${content.getTitle()}
    >>> CONTENT: ${content.getSummary()}
    >>> HASH: ${content.getMetadata()}
    _END_STREAM_`;
    }
}

// [Abstract Factory: Concrete Product 3B]
class FutureButton implements IButton {
    renderButton(label: string): string {
        return `>>> [${label.toUpperCase()}] <<<`;
    }
}

// [Abstract Factory: Concrete Factory 3]
class FutureThemeFactory implements ThemeFactory {
    createCard(): ICard { return new FutureCard(); }
    createButton(): IButton { return new FutureButton(); }
    getThemeName(): string { return "Cyberpunk 2077"; }
}

// ==========================================================
// 3. Factory Method Pattern (The Layout System)
// Concept: กำหนดโครงสร้างหน้าเว็บ (List vs Grid) โดยใช้ Theme ที่เลือก
// ==========================================================

// [Factory Method: Product]
interface ILayout {
    render(contents: IStandardContent[]): void;
}

// [Factory Method: Concrete Product A]
class ListLayout implements ILayout {
    constructor(private themeFactory: ThemeFactory) { }

    render(contents: IStandardContent[]): void {
        console.log(`\n=== 📜 Layout: LIST VIEW | Theme: ${this.themeFactory.getThemeName()} ===`);
        const cardRenderer = this.themeFactory.createCard();
        const buttonRenderer = this.themeFactory.createButton();

        contents.forEach(item => {
            // Layout แค่สั่ง Render ทีละชิ้นต่อกันลงมา
            console.log(cardRenderer.render(item));
            console.log(`   ${buttonRenderer.renderButton("Read More")} ${buttonRenderer.renderButton("Share")}`);
        });
        console.log("=================================================");
    }
}

// [Factory Method: Concrete Product B]
class GridLayout implements ILayout {
    constructor(private themeFactory: ThemeFactory) { }

    render(contents: IStandardContent[]): void {
        console.log(`\n=== ▦ Layout: GRID VIEW | Theme: ${this.themeFactory.getThemeName()} ===`);
        const cardRenderer = this.themeFactory.createCard();
        const buttonRenderer = this.themeFactory.createButton();

        // จำลองการจัดวางแบบ Grid (ใน Console อาจเห็นไม่ชัด แต่ Logic คือการจัดกลุ่ม)
        console.log("Row 1 [Col 1] [Col 2] ...");
        contents.forEach(item => {
            console.log(`[GRID-ITEM] ${cardRenderer.render(item).replace(/\n/g, "\n\t")}`);
            console.log(`\t   Actions: ${buttonRenderer.renderButton("View")} ${buttonRenderer.renderButton("Edit")}`);
        });
        console.log("=================================================");
    }
}

// [Factory Method: Creator]
abstract class LayoutFactory {
    abstract createLayout(theme: ThemeFactory): ILayout;
}

// [Factory Method: Concrete Creator A]
class ListLayoutFactory extends LayoutFactory {
    createLayout(theme: ThemeFactory): ILayout {
        return new ListLayout(theme);
    }
}

// [Factory Method: Concrete Creator B]
class GridLayoutFactory extends LayoutFactory {
    createLayout(theme: ThemeFactory): ILayout {
        return new GridLayout(theme);
    }
}

// Client / Application

class WebApplication {
    constructor(private contents: IStandardContent[]) { }

    // funtion จำลองการที่ User กดเลือก setting บนหน้าเว็บ
    public renderPage(layoutType: LayoutFactory, themeType: ThemeFactory) {
        const layout = layoutType.createLayout(themeType);

        layout.render(this.contents);
    }
}

const rawData = [
    new Article("Design Patterns", "Adapter is compatible with Factory.", "Bob", new Date(), ["Code"]),
    new Blog("My Day", "Sunny day in Bangkok.", "Alice", new Date(), ["Lifestyle"])
];

const standardizedData: IStandardContent[] = [
    new ArticleAdapter(rawData[0] as Article),
    new BlogAdapter(rawData[1] as Blog)
];

const app = new WebApplication(standardizedData);

console.log("Scenario 1: User like to read simply (List + Classic)");
app.renderPage(new ListLayoutFactory(), new ClassicThemeFactory());

console.log("\nScenario 2: User like modern style (Grid + Modern)");
app.renderPage(new GridLayoutFactory(), new ModernThemeFactory());

console.log("\nScenario 3: User like tech style (List + Future)");
app.renderPage(new ListLayoutFactory(), new FutureThemeFactory());