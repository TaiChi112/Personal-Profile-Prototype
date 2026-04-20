/**
 * DECORATOR PATTERN - Structural
 * 
 * Purpose:
 * เพิ่มความสามารถให้กับ object โดยไม่เปลี่ยน structure ของต้นแบบ
 * ใช้เมื่อต้องการเพิ่มฟีเจอร์ให้กับ object ด้วยความยืดหยุ่น
 * 
 * Components:
 * - Component Interface: interface ของ object ที่สามารถ decorate ได้
 * - Concrete Component: class ที่จะถูก decorate
 * - Decorator: abstract class ที่ implement component interface
 * - Concrete Decorator: class ที่เพิ่มความสามารถให้กับ component
 */

// ============================================================
// COMPONENT INTERFACE
// ============================================================
interface Component {
  operation(): string;
}

// ============================================================
// CONCRETE COMPONENT - object ที่จะถูก decorate
// ============================================================
class ConcreteComponent implements Component {
  operation(): string {
    return "ConcreteComponent";
  }
}

// ============================================================
// DECORATOR - abstract decorator class
// ============================================================
abstract class Decorator implements Component {
  protected component: Component;

  constructor(component: Component) {
    this.component = component;
  }

  operation(): string {
    return this.component.operation();
  }
}

// ============================================================
// CONCRETE DECORATORS - เพิ่มความสามารถให้กับ component
// ============================================================
class ConcreteDecoratorA extends Decorator {
  operation(): string {
    return `ConcreteDecoratorA(${super.operation()})`;
  }
}

class ConcreteDecoratorB extends Decorator {
  operation(): string {
    return `ConcreteDecoratorB(${super.operation()})`;
  }
}

// ============================================================
// CLIENT CODE - การใช้งาน Decorator
// ============================================================

// CLIENT สร้าง concrete component
const component: Component = new ConcreteComponent();

// CLIENT เพิ่มความสามารถโดยใช้ decorators
const decoratorA: Component = new ConcreteDecoratorA(component);
const decoratorB: Component = new ConcreteDecoratorB(decoratorA);

// CLIENT เรียก operation ที่มีการ decorate
console.log("Decorated result:", decoratorB.operation());
