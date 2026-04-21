/**
 * VISITOR PATTERN - Behavioral
 * 
 * Purpose:
 * define new operations บน objects ของ class hierarchy
 * โดยไม่เปลี่ยน classes ของ elements ที่ operate on
 * 
 * Components:
 * - Element Interface: interface ที่ define accept method
 * - Concrete Element: implement element interface
 * - Visitor Interface: interface ที่ define visit methods
 * - Concrete Visitor: implement specific operations
 */

// ============================================================
// VISITOR INTERFACE
// ============================================================
interface Visitor {
  visitElementA(element: ElementA): string;
  visitElementB(element: ElementB): string;
}

// ============================================================
// ELEMENT INTERFACE
// ============================================================
interface Element {
  accept(visitor: Visitor): string;
}

// ============================================================
// CONCRETE ELEMENTS
// ============================================================
class ElementA implements Element {
  accept(visitor: Visitor): string {
    return visitor.visitElementA(this);
  }

  operationA(): string {
    return "Operation A";
  }
}

class ElementB implements Element {
  accept(visitor: Visitor): string {
    return visitor.visitElementB(this);
  }

  operationB(): string {
    return "Operation B";
  }
}

// ============================================================
// CONCRETE VISITORS
// ============================================================
class ConcreteVisitorA implements Visitor {
  visitElementA(element: ElementA): string {
    return `Visitor A visits Element A: ${element.operationA()}`;
  }

  visitElementB(element: ElementB): string {
    return `Visitor A visits Element B: ${element.operationB()}`;
  }
}

class ConcreteVisitorB implements Visitor {
  visitElementA(element: ElementA): string {
    return `Visitor B visits Element A: ${element.operationA()}`;
  }

  visitElementB(element: ElementB): string {
    return `Visitor B visits Element B: ${element.operationB()}`;
  }
}

// ============================================================
// CLIENT CODE - การใช้งาน Visitor
// ============================================================

// CLIENT สร้าง elements
const elementA: Element = new ElementA();
const elementB: Element = new ElementB();

// CLIENT สร้าง visitors
const visitorA: Visitor = new ConcreteVisitorA();
const visitorB: Visitor = new ConcreteVisitorB();

// CLIENT accept visitors
console.log("Visitor Pattern:");
console.log(elementA.accept(visitorA));
console.log(elementB.accept(visitorA));
console.log(elementA.accept(visitorB));
console.log(elementB.accept(visitorB));
