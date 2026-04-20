/**
 * ABSTRACT FACTORY PATTERN - Creational
 * 
 * Purpose:
 * สร้าง families of related objects โดยไม่ให้ client code รู้ concrete classes
 * ใช้เมื่อ products มี dependencies หลาย ๆ ชนิดและต้องใช้ร่วมกัน
 * 
 * Components:
 * - Abstract Product Families: interfaces ที่ define product types
 * - Concrete Products: classes ที่ implement product interfaces
 * - Abstract Factory: interface ที่ define factory methods สำหรับ create families
 * - Concrete Factories: classes ที่ implement factory interface
 */

// ============================================================
// ABSTRACT PRODUCT A (Family 1)
// ============================================================
abstract class AbstractProductA {
  abstract operationA(): string;
}

// ============================================================
// CONCRETE PRODUCTS A
// ============================================================
class ConcreteProductA1 extends AbstractProductA {
  operationA(): string {
    return "Product A1";
  }
}

class ConcreteProductA2 extends AbstractProductA {
  operationA(): string {
    return "Product A2";
  }
}

// ============================================================
// ABSTRACT PRODUCT B (Family 2)
// ============================================================
abstract class AbstractProductB {
  abstract operationB(): string;
}

// ============================================================
// CONCRETE PRODUCTS B
// ============================================================
class ConcreteProductB1 extends AbstractProductB {
  operationB(): string {
    return "Product B1";
  }
}

class ConcreteProductB2 extends AbstractProductB {
  operationB(): string {
    return "Product B2";
  }
}

// ============================================================
// ABSTRACT FACTORY
// ============================================================
abstract class AbstractFactory {
  abstract createProductA(): AbstractProductA;
  abstract createProductB(): AbstractProductB;
}

// ============================================================
// CONCRETE FACTORIES
// ============================================================
class ConcreteFactory1 extends AbstractFactory {
  createProductA(): AbstractProductA {
    return new ConcreteProductA1();
  }

  createProductB(): AbstractProductB {
    return new ConcreteProductB1();
  }
}

class ConcreteFactory2 extends AbstractFactory {
  createProductA(): AbstractProductA {
    return new ConcreteProductA2();
  }

  createProductB(): AbstractProductB {
    return new ConcreteProductB2();
  }
}

// ============================================================
// CLIENT CODE - การใช้งาน Abstract Factory
// ============================================================

// CLIENT เลือก factory family ที่ต้องการ
const factory1: AbstractFactory = new ConcreteFactory1();
const productA1: AbstractProductA = factory1.createProductA();
const productB1: AbstractProductB = factory1.createProductB();

// CLIENT ไม่ต้องรู้ concrete classes ของ products
console.log("Factory 1 - Product A:", productA1.operationA());
console.log("Factory 1 - Product B:", productB1.operationB());

const factory2: AbstractFactory = new ConcreteFactory2();
const productA2: AbstractProductA = factory2.createProductA();
const productB2: AbstractProductB = factory2.createProductB();

console.log("Factory 2 - Product A:", productA2.operationA());
console.log("Factory 2 - Product B:", productB2.operationB());
