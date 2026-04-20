/**
 * COMPOSITE PATTERN - Structural
 * 
 * Purpose:
 * สร้าง tree structures เพื่อแสดง part-whole hierarchies
 * ให้ client ใช้ individual objects และ compositions ได้แบบเดียวกัน
 * 
 * Components:
 * - Component Interface: interface สำหรับ leaf และ composite objects
 * - Leaf: object ที่ไม่มี children
 * - Composite: object ที่มี children และสามารถ contain leaf/composite อื่น
 * - Client: ทำงานกับ component objects ผ่าน interface
 */

// ============================================================
// COMPONENT INTERFACE
// ============================================================
interface Component {
  getName(): string;
  display(): string;
}

// ============================================================
// LEAF - object ที่ไม่มี children
// ============================================================
class Leaf implements Component {
  private name: string;

  constructor(name: string) {
    this.name = name;
  }

  getName(): string {
    return this.name;
  }

  display(): string {
    return `Leaf: ${this.name}`;
  }
}

// ============================================================
// COMPOSITE - object ที่มี children
// ============================================================
class Composite implements Component {
  private name: string;
  private children: Component[] = [];

  constructor(name: string) {
    this.name = name;
  }

  getName(): string {
    return this.name;
  }

  // Add child component
  add(component: Component): void {
    this.children.push(component);
  }

  // Remove child component
  remove(component: Component): void {
    const index = this.children.indexOf(component);
    if (index > -1) {
      this.children.splice(index, 1);
    }
  }

  display(): string {
    let result = `Composite: ${this.name}\n`;
    for (const child of this.children) {
      result += `  - ${child.display()}\n`;
    }
    return result;
  }
}

// ============================================================
// CLIENT CODE - การใช้งาน Composite
// ============================================================

// CLIENT สร้าง leaf objects
const leaf1: Component = new Leaf("Leaf 1");
const leaf2: Component = new Leaf("Leaf 2");
const leaf3: Component = new Leaf("Leaf 3");

// CLIENT สร้าง composite objects
const composite1: Composite = new Composite("Composite 1");
const composite2: Composite = new Composite("Composite 2");

// CLIENT สร้าง tree structure
composite1.add(leaf1);
composite1.add(leaf2);

composite2.add(leaf3);
composite2.add(composite1);

// CLIENT ใช้ component interface เหมือนกันสำหรับ leaf และ composite
console.log("Tree structure:");
console.log(composite2.display());
