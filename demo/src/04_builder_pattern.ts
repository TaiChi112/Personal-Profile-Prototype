/**
 * BUILDER PATTERN - Creational
 * 
 * Purpose:
 * สร้าง complex objects ทีละ step โดยแยก construction logic
 * ออกจาก representation ของ product
 * 
 * Components:
 * - Product: object ที่ต้องสร้างขึ้น
 * - Abstract Builder: interface ที่ define step-by-step building methods
 * - Concrete Builder: classes ที่ implement builder interface
 * - Director (Optional): orchestrate building steps ในลำดับที่ถูกต้อง
 */

// ============================================================
// PRODUCT
// ============================================================
class Product {
  public parts: string[] = [];

  addPart(part: string): void {
    this.parts.push(part);
  }
}

// ============================================================
// ABSTRACT BUILDER
// ============================================================
abstract class Builder {
  protected product: Product = new Product();

  abstract buildPartA(): void;
  abstract buildPartB(): void;
  abstract buildPartC(): void;

  getProduct(): Product {
    return this.product;
  }

  reset(): void {
    this.product = new Product();
  }
}

// ============================================================
// CONCRETE BUILDERS
// ============================================================
class ConcreteBuilder1 extends Builder {
  buildPartA(): void {
    this.product.addPart("Part A - Type 1");
  }

  buildPartB(): void {
    this.product.addPart("Part B - Type 1");
  }

  buildPartC(): void {
    this.product.addPart("Part C - Type 1");
  }
}

class ConcreteBuilder2 extends Builder {
  buildPartA(): void {
    this.product.addPart("Part A - Type 2");
  }

  buildPartB(): void {
    this.product.addPart("Part B - Type 2");
  }

  buildPartC(): void {
    this.product.addPart("Part C - Type 2");
  }
}

// ============================================================
// DIRECTOR (Optional)
// ============================================================
class Director {
  private builder: Builder;

  constructor(builder: Builder) {
    this.builder = builder;
  }

  setBuilder(builder: Builder): void {
    this.builder = builder;
  }

  construct(): Product {
    this.builder.reset();
    this.builder.buildPartA();
    this.builder.buildPartB();
    this.builder.buildPartC();
    return this.builder.getProduct();
  }
}

// ============================================================
// CLIENT CODE - การใช้งาน Builder
// ============================================================

// CLIENT สร้าง builder
const builder1: Builder = new ConcreteBuilder1();
const builder2: Builder = new ConcreteBuilder2();

// CLIENT ใช้ director เพื่อ orchestrate building process
const director: Director = new Director(builder1);

// CLIENT ได้ product สำเร็จจาก director
const product1: Product = director.construct();
console.log("Product 1 parts:", product1.parts);

// CLIENT สามารถเปลี่ยน builder
director.setBuilder(builder2);
const product2: Product = director.construct();
console.log("Product 2 parts:", product2.parts);
