// abstract products
interface ILanguage {
    locale(): void;
}
interface IFont {
    style(): void;
}
// abstract factory
interface LocaleFactory {
    createLanguage(): ILanguage;
    createFont(): IFont;
}
// concrete products
class ENLanguage implements ILanguage {
    locale(): void { console.log("  🇬🇧 Language set to English"); }
}
class THLanguage implements ILanguage {
    locale(): void { console.log("  🇹🇭 Language set to Thai"); }
}
class ArialFont implements IFont {
    style(): void { console.log("  🔤 Font set to Arial"); }
}
class DBFont implements IFont {
    style(): void { console.log("  🔤 Font set to DB Font"); }
}
class ENLocaleFactory implements LocaleFactory {
    createLanguage(): ILanguage { return new ENLanguage(); }
    createFont(): IFont { return new ArialFont(); }
}
class THLocaleFactory implements LocaleFactory {
    createLanguage(): ILanguage { return new THLanguage(); }
    createFont(): IFont { return new DBFont(); }
}


// abstract product
interface ICard {
    render(): void;
}

interface IButton {
    click(): void;
}

// abstract factory
interface ThemeFactory {
    createCard(): ICard;
    createButton(): IButton;
}

// concrete products
class ModernCard implements ICard {
    render(): void { console.log("  🎨 [Modern] Rendering Card with Rounded Corners"); }
}
class ModernButton implements IButton {
    click(): void { console.log("  🎨 [Modern] Button Clicked (Ripple Effect)"); }
}

class ClassicCard implements ICard {
    render(): void { console.log("  📜 [Classic] Rendering Card with Border"); }
}
class ClassicButton implements IButton {
    click(): void { console.log("  📜 [Classic] Button Clicked (Simple Click)"); }
}
// concrete factory
class ModernThemeFactory implements ThemeFactory {
    createCard(): ICard { return new ModernCard(); }
    createButton(): IButton { return new ModernButton(); }
}

class ClassicThemeFactory implements ThemeFactory {
    createCard(): ICard { return new ClassicCard(); }
    createButton(): IButton { return new ClassicButton(); }
}
// client
class User {
    id: string;
    name: string;
    constructor(id: string, name: string) {
        this.id = id;
        this.name = name;
    }
    applyTheme(factory: ThemeFactory): void {
        console.log(`👤 ${this.name} applies theme`);
        const card = factory.createCard();
        const button = factory.createButton();

        card.render();
        button.click();
    }
    applyLocale(factory: LocaleFactory): void {
        console.log(`👤 ${this.name} applies locale`);
        const language = factory.createLanguage();
        const font = factory.createFont();

        language.locale();
        font.style();
    }
}


const alice = new User("1", "Alice");
alice.applyTheme(new ModernThemeFactory());
alice.applyTheme(new ClassicThemeFactory());

const bob = new User("2", "Bob");
bob.applyLocale(new ENLocaleFactory());
bob.applyLocale(new THLocaleFactory());

interface IThemeRenderer {
    renderCardStyle(): void;
    renderButtonEffect(): void;
}
class ModernRenderer implements IThemeRenderer {
    renderCardStyle(): void {
        console.log("  🎨 [Modern] Drawing Rounded Corners & Shadows");
    }
    renderButtonEffect(): void {
        console.log("  🎨 [Modern] Applying Ripple Effect");
    }
}
class ClassicRenderer implements IThemeRenderer {
    renderCardStyle(): void {
        console.log("  📜 [Classic] Drawing Solid Border");
    }
    renderButtonEffect(): void {
        console.log("  📜 [Classic] Handling Simple Click");
    }
}
abstract class UIComponent {
    protected renderer: IThemeRenderer;

    constructor(renderer: IThemeRenderer) {
        this.renderer = renderer;
    }

    abstract display(): void;
}
class Button extends UIComponent {
    click(): void {
        console.log("👤 User clicks button...");
        // Delegate งานภาพสวยงามไปให้ Renderer (Bridge)
        this.renderer.renderButtonEffect();
    }

    display(): void {
        this.renderer.renderButtonEffect();
    }
}
class Card extends UIComponent {
    showDetails(): void {
        console.log("📄 Showing card details...");
        // Delegate งานวาดกรอบไปให้ Renderer (Bridge)
        this.renderer.renderCardStyle();
    }

    display(): void {
        this.renderer.renderCardStyle();
    }
}