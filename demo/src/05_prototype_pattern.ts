/**
 * PROTOTYPE PATTERN - Creational
 * 
 * Purpose:
 * สร้าง object ใหม่ผ่านการ clone จาก prototype ที่อยู่แล้ว
 * แทนที่จะสร้างจาก scratch โดยประหยัด cost ของการ instantiation
 * 
 * Components:
 * - Prototype Interface: define clone() method
 * - Concrete Prototype: classes ที่ implement clone() method
 * - Clone Method: สร้าง independent copy ของ object
 * - Registry (Optional): จัดการและเรียกใช้ prototypes
 */

// ============================================================
// PROTOTYPE INTERFACE
// ============================================================
interface Prototype {
  clone(): Prototype;
}

// ============================================================
// CONCRETE PROTOTYPES
// ============================================================
class ConcretePrototype implements Prototype {
  private data: string;

  constructor(data: string) {
    this.data = data;
  }

  clone(): Prototype {
    // Create a new instance with same data
    const cloned = Object.create(Object.getPrototypeOf(this));
    Object.assign(cloned, this);
    return cloned;
  }

  getData(): string {
    return this.data;
  }

  setData(data: string): void {
    this.data = data;
  }
}

class SubclassPrototype extends ConcretePrototype {
  private extraData: number;
  constructor(data: string, extraData: number) {
    super(data);
    this.extraData = extraData;
  }
  clone(): Prototype {
    const cloned = super.clone() as SubclassPrototype;
    cloned.extraData = this.extraData;
    return cloned;
  }
  getExtraData(): number {
    return this.extraData;
  }
  setExtraData(extraData: number): void {
    this.extraData = extraData;
  }
}

// ============================================================
// PROTOTYPE REGISTRY (Optional)
// ============================================================
class PrototypeRegistry {
  private prototypes: Map<string, Prototype> = new Map();

  register(name: string, prototype: Prototype): void {
    this.prototypes.set(name, prototype);
  }

  clone(name: string): Prototype {
    const prototype = this.prototypes.get(name);
    if (!prototype) {
      throw new Error(`Prototype ${name} not found`);
    }
    return prototype.clone();
  }
}

// ============================================================
// CLIENT CODE - การใช้งาน Prototype
// ============================================================

// CLIENT สร้าง prototype
const prototype: Prototype = new ConcretePrototype("Original Data");

// CLIENT ทำการ clone จาก prototype
const clonedPrototype1 = prototype.clone() as ConcretePrototype;
const clonedPrototype2 = prototype.clone() as ConcretePrototype;

const subclassPrototype: Prototype = new SubclassPrototype("Subclass Data", 42);
const clonedSubclass = subclassPrototype.clone() as SubclassPrototype;

// CLIENT แก้ไข cloned objects โดยไม่กระทบต้นแบบ
clonedPrototype1.setData("Modified Data 1");
clonedPrototype2.setData("Modified Data 2");
clonedSubclass.setExtraData(100);

console.log("Original:", (prototype as ConcretePrototype).getData());
console.log("Cloned 1:", clonedPrototype1.getData());
console.log("Cloned 2:", clonedPrototype2.getData());
console.log("Cloned Subclass:", clonedSubclass.getExtraData());

// CLIENT ใช้ registry เพื่อจัดการ prototypes
const registry: PrototypeRegistry = new PrototypeRegistry();
registry.register("prototype-a", new ConcretePrototype("Data A"));
registry.register("prototype-b", new ConcretePrototype("Data B"));

const clonedFromRegistry = registry.clone("prototype-a") as ConcretePrototype;
console.log("Cloned from registry:", clonedFromRegistry.getData());
