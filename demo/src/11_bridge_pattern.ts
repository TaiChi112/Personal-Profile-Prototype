/**
 * BRIDGE PATTERN - Structural
 * 
 * Purpose:
 * แยก abstraction ออกจาก implementation เพื่อให้ทั้งสองสามารถเปลี่ยนแปลงได้อย่างอิสระ
 * ใช้เมื่อต้องการหลีกเลี่ยง permanent binding ระหว่าง abstraction และ implementation
 * 
 * Components:
 * - Abstraction: class ที่ define high-level interface
 * - Refined Abstraction: extend abstraction ด้วย features เพิ่มเติม
 * - Implementor Interface: interface สำหรับ low-level implementation
 * - Concrete Implementor: implement implementor interface
 */

// ============================================================
// IMPLEMENTOR INTERFACE - low-level implementation interface
// ============================================================
interface Implementor {
  implementationMethod(): string;
}

// ============================================================
// CONCRETE IMPLEMENTORS
// ============================================================
class ConcreteImplementorA implements Implementor {
  implementationMethod(): string {
    return "Concrete Implementor A";
  }
}

class ConcreteImplementorB implements Implementor {
  implementationMethod(): string {
    return "Concrete Implementor B";
  }
}

// ============================================================
// ABSTRACTION - high-level abstraction
// ============================================================
abstract class Abstraction {
  protected implementor: Implementor;

  constructor(implementor: Implementor) {
    this.implementor = implementor;
  }

  abstract operation(): string;
}

// ============================================================
// REFINED ABSTRACTION - extend abstraction
// ============================================================
class RefinedAbstraction extends Abstraction {
  operation(): string {
    return `Refined Abstraction: ${this.implementor.implementationMethod()}`;
  }
}

// ============================================================
// CLIENT CODE - การใช้งาน Bridge
// ============================================================

// CLIENT สร้าง implementor
const implementorA: Implementor = new ConcreteImplementorA();
const implementorB: Implementor = new ConcreteImplementorB();

// CLIENT สร้าง abstraction และ inject implementor
let abstractionA: Abstraction = new RefinedAbstraction(implementorA);
const abstractionB: Abstraction = new RefinedAbstraction(implementorB);

// CLIENT เรียก operation ผ่าน abstraction
console.log("Bridge A:", abstractionA.operation());
console.log("Bridge B:", abstractionB.operation());

// CLIENT สามารถเปลี่ยน implementor ได้
abstractionA = new RefinedAbstraction(implementorB);
console.log("Bridge A (changed):", abstractionA.operation());
