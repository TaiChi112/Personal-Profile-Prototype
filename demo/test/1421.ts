// ==========================================
// 1. Shared Types & Enums (Type Safety)
// ==========================================
// Professional: ใช้ Enum แทน String เพื่อลดความผิดพลาด (Typo)
enum AppTheme {
    Dark = "css-dark-theme",
    Light = "css-light-theme",
    HighContrast = "css-hc-theme"
}

// ==========================================
// 2. Receiver (Business Logic)
// ==========================================
class ThemeEngine {
    private currentTheme: AppTheme = AppTheme.Light;

    public setTheme(theme: AppTheme): void {
        // Validation logic can go here
        if (this.currentTheme === theme) {
            console.warn(`⚠️ System is already using ${theme}`);
            return;
        }

        this.currentTheme = theme;

        // Simulating DOM manipulation
        console.log(`[ENGINE] 🎨 Applied Theme: "${theme}"`);
        this.applyToDOM(theme);
    }

    private applyToDOM(theme: AppTheme) {
        if (typeof document !== "undefined" && document.body) {
            document.body.className = theme;
        }
    }
}

// ==========================================
// 3. Command Interface & Concrete Commands
// ==========================================
interface ICommand {
    execute(): void;
    // Optional: undo(): void; // Command pattern usually comes with undo
}

// Professional: ใช้ Class เดียวแต่รับ Payload แทนการสร้างหลาย Class (Generic Command)
class SetThemeCommand implements ICommand {
    constructor(
        private receiver: ThemeEngine,
        private themePayload: AppTheme
    ) { }

    execute(): void {
        console.log(`[CMD] 🚀 Executing: SetTheme to ${this.themePayload}`);
        this.receiver.setTheme(this.themePayload);
    }
}

// Professional: Macro Command (Composite Pattern)
// รวมหลายคำสั่งให้ทำงานพร้อมกัน (เช่น "Presentation Mode" = Light Theme + Reset Zoom)
class MacroCommand implements ICommand {
    private commands: ICommand[] = [];

    add(command: ICommand): void {
        this.commands.push(command);
    }

    execute(): void {
        console.log(`[MACRO] 📦 Executing batch of ${this.commands.length} commands...`);
        this.commands.forEach(cmd => cmd.execute());
    }
}

// ==========================================
// 4. Invokers (Smart Controllers)
// ==========================================

// Generic Invoker สำหรับ Input ทั่วไป
class InputHandler {
    private commands: Map<string, ICommand> = new Map();

    // Mapping Key/Trigger กับ Command
    register(triggerName: string, command: ICommand): void {
        this.commands.set(triggerName, command);
    }

    // Trigger Action
    trigger(triggerName: string): void {
        const command = this.commands.get(triggerName);
        if (command) {
            console.log(`\n⚡ Triggered by: [${triggerName}]`);
            command.execute();
        } else {
            console.error(`❌ No command assigned for: ${triggerName}`);
        }
    }
}

// ==========================================
// 5. Client Code (Usage)
// ==========================================

// Setup System
const engine = new ThemeEngine(); // Receiver
const inputHandler = new InputHandler(); // Invoker (One handler for all)

// Setup Commands
const cmdDark = new SetThemeCommand(engine, AppTheme.Dark);
const cmdLight = new SetThemeCommand(engine, AppTheme.Light);
const cmdContrast = new SetThemeCommand(engine, AppTheme.HighContrast);

// Setup Macro (Example: Reset System)
const cmdResetSequence = new MacroCommand();
cmdResetSequence.add(cmdLight); // สั่งกลับเป็น Light
// cmdResetSequence.add(new ResetFontCommand(engine)); // สมมติมีคำสั่งอื่นด้วย

// Registering Triggers (Binding)
// เราใช้ Invoker ตัวเดียวจัดการได้หลาย Channel
inputHandler.register("Btn_DarkMode", cmdDark);
inputHandler.register("Ctrl+L", cmdLight);
inputHandler.register("Voice_HighContrast", cmdContrast);
inputHandler.register("Btn_ResetAll", cmdResetSequence); // Bind Macro

// --- Simulation ---

// 1. User clicks UI Button
inputHandler.trigger("Btn_DarkMode");

// 2. User uses Keyboard Shortcut
inputHandler.trigger("Ctrl+L");

// 3. User uses Voice Command
inputHandler.trigger("Voice_HighContrast");

// 4. User clicks "Reset" (Running Macro)
inputHandler.trigger("Btn_ResetAll");