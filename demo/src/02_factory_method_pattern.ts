/**
 * FACTORY METHOD PATTERN - Creational
 * 
 * Purpose:
 * ให้ subclass decide ว่าจะ create object type ไหน
 * โดยไม่ต้องให้ client code รู้ว่า concrete class ชื่ออะไร
 * 
 * Components:
 * - Product: interface หรือ abstract class ที่ define contract
 * - Concrete Product: class ที่ implement product interface
 * - Creator: abstract class ที่มี abstract factory method
 * - Concrete Creator: class ที่ implement factory method
 */

// ============================================================
// PRODUCT (Abstract/Interface)
// ============================================================
abstract class Product {
  abstract getName(): string;
}

// ============================================================
// CONCRETE PRODUCTS
// ============================================================
class ConcreteProductA extends Product {
  getName(): string {
    return "Product A";
  }
}

class ConcreteProductB extends Product {
  getName(): string {
    return "Product B";
  }
}

// ============================================================
// CREATOR (Abstract)
// ============================================================
abstract class Creator {
  // Abstract factory method - subclass ต้อง implement
  abstract createProduct(): Product;
}

// ============================================================
// CONCRETE CREATORS
// ============================================================
class ConcreteCreatorA extends Creator {
  createProduct(): Product {
    return new ConcreteProductA();
  }
}

class ConcreteCreatorB extends Creator {
  createProduct(): Product {
    return new ConcreteProductB();
  }
}

// ============================================================
// CLIENT CODE - การใช้งาน Factory Method
// ============================================================

// CLIENT ไม่ต้องรู้ว่าจะสร้าง Product ชนิดไหน
// เพียงแต่เลือก Creator ที่ต้องการ

const creatorA: Creator = new ConcreteCreatorA();
const productA: Product = creatorA.createProduct();

const creatorB: Creator = new ConcreteCreatorB();
const productB: Product = creatorB.createProduct();

// CLIENT ใช้ abstraction (Product) ไม่ใช่ concrete classes
console.log("Product A name:", productA.getName());
console.log("Product B name:", productB.getName());
