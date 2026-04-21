/**
 * TEMPLATE METHOD PATTERN - Behavioral
 * 
 * Purpose:
 * define skeleton ของ algorithm ใน base class
 * ให้ subclasses override specific steps โดยไม่เปลี่ยน algorithm structure
 * 
 * Components:
 * - Abstract Class: define template method และ abstract methods
 * - Concrete Class: implement abstract methods
 * - Template Method: define algorithm structure
 */

// ============================================================
// ABSTRACT CLASS - define template method
// ============================================================
abstract class AbstractClass {
  // Template method - define algorithm skeleton
  templateMethod(): string {
    let result = this.step1() + "\n";
    result += this.step2() + "\n";
    result += this.step3();
    return result;
  }

  // Abstract methods ที่ subclasses ต้อง implement
  abstract step1(): string;
  abstract step2(): string;
  abstract step3(): string;
}

// ============================================================
// CONCRETE CLASSES
// ============================================================
class ConcreteClassA extends AbstractClass {
  step1(): string {
    return "Class A: Step 1";
  }

  step2(): string {
    return "Class A: Step 2";
  }

  step3(): string {
    return "Class A: Step 3";
  }
}

class ConcreteClassB extends AbstractClass {
  step1(): string {
    return "Class B: Step 1";
  }

  step2(): string {
    return "Class B: Step 2";
  }

  step3(): string {
    return "Class B: Step 3";
  }
}

// ============================================================
// CLIENT CODE - การใช้งาน Template Method
// ============================================================

// CLIENT สร้าง concrete classes
const classA: AbstractClass = new ConcreteClassA();
const classB: AbstractClass = new ConcreteClassB();

// CLIENT เรียก template method ซึ่งมี fixed structure
console.log("Template Method Pattern:");
console.log("Class A:\n", classA.templateMethod());
console.log("\nClass B:\n", classB.templateMethod());
