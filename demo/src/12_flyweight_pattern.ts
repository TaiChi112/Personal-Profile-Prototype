/**
 * FLYWEIGHT PATTERN - Structural
 * 
 * Purpose:
 * ใช้ shared objects เพื่อประหยัด memory เมื่อมี objects ที่เหมือนกันจำนวนมาก
 * ใช้เมื่อต้องการลด memory footprint สำหรับ objects ที่ซ้ำกัน
 * 
 * Components:
 * - Flyweight Interface: interface ที่ define operations
 * - Concrete Flyweight: shared object ที่เก็บ intrinsic state
 * - Flyweight Factory: create และ manage flyweight objects
 * - Client: ใช้ flyweight objects พร้อม extrinsic state
 */

// ============================================================
// FLYWEIGHT INTERFACE
// ============================================================
interface Flyweight {
  operation(extrinsicState: string): string;
}

// ============================================================
// CONCRETE FLYWEIGHT - shared object
// ============================================================
class ConcreteFlyweight implements Flyweight {
  // Intrinsic state - shared across all instances
  private intrinsicState: string;

  constructor(intrinsicState: string) {
    this.intrinsicState = intrinsicState;
  }

  operation(extrinsicState: string): string {
    return `Flyweight: Intrinsic=${this.intrinsicState}, Extrinsic=${extrinsicState}`;
  }
}

// ============================================================
// FLYWEIGHT FACTORY - create และ manage flyweights
// ============================================================
class FlyweightFactory {
  private flyweights: Map<string, Flyweight> = new Map();

  // Get หรือ create flyweight
  getFlyweight(intrinsicState: string): Flyweight {
    if (!this.flyweights.has(intrinsicState)) {
      this.flyweights.set(intrinsicState, new ConcreteFlyweight(intrinsicState));
    }
    return this.flyweights.get(intrinsicState)!;
  }

  // Get count ของ flyweights
  getFlyweightCount(): number {
    return this.flyweights.size;
  }
}

// ============================================================
// CLIENT CODE - การใช้งาน Flyweight
// ============================================================

// CLIENT สร้าง factory
const factory: FlyweightFactory = new FlyweightFactory();

// CLIENT ขอ flyweights จาก factory พร้อม extrinsic state
const flyweight1: Flyweight = factory.getFlyweight("State A");
const flyweight2: Flyweight = factory.getFlyweight("State B");
const flyweight3: Flyweight = factory.getFlyweight("State A"); // reuse existing

// CLIENT ใช้ flyweights
console.log("Flyweight 1:", flyweight1.operation("Context 1"));
console.log("Flyweight 2:", flyweight2.operation("Context 2"));
console.log("Flyweight 3:", flyweight3.operation("Context 3"));

// CLIENT ตรวจสอบการ reuse
console.log("Flyweight1 === Flyweight3:", flyweight1 === flyweight3); // true
console.log("Total flyweights created:", factory.getFlyweightCount()); // 2
