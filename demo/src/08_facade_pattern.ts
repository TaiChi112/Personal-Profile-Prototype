/**
 * FACADE PATTERN - Structural
 * 
 * Purpose:
 * ให้ simplified interface สำหรับ complex subsystem
 * ใช้เมื่อต้องการซ่อนความซับซ้อนและให้ client ใช้งานง่าย
 * 
 * Components:
 * - Facade: class ที่ provide simplified interface
 * - Subsystem Classes: complex classes ที่อยู่เบื้องหลัง facade
 * - Client: ใช้ facade แทนที่จะใช้ subsystem directly
 */

// ============================================================
// SUBSYSTEM CLASSES - complex subsystem
// ============================================================
class SubsystemA {
  operationA(): string {
    return "Subsystem A operation";
  }
}

class SubsystemB {
  operationB(): string {
    return "Subsystem B operation";
  }
}

class SubsystemC {
  operationC(): string {
    return "Subsystem C operation";
  }
}

// ============================================================
// FACADE - simplified interface สำหรับ subsystem
// ============================================================
class Facade {
  private subsystemA: SubsystemA;
  private subsystemB: SubsystemB;
  private subsystemC: SubsystemC;

  constructor() {
    this.subsystemA = new SubsystemA();
    this.subsystemB = new SubsystemB();
    this.subsystemC = new SubsystemC();
  }

  // Simplified operations ที่รวม multiple subsystems
  simpleOperation(): string {
    return (
      this.subsystemA.operationA() +
      " -> " +
      this.subsystemB.operationB() +
      " -> " +
      this.subsystemC.operationC()
    );
  }
}

// ============================================================
// CLIENT CODE - การใช้งาน Facade
// ============================================================

// CLIENT ใช้ facade แทนที่จะเข้าถึง subsystems โดยตรง
const facade: Facade = new Facade();

// CLIENT เรียก simplified operation ผ่าน facade
console.log("Facade result:", facade.simpleOperation());
