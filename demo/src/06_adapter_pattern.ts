/**
 * ADAPTER PATTERN - Structural
 * 
 * Purpose:
 * แปลง interface ของ class ให้สอดคล้องกับ interface ที่ client คาดหวัง
 * ใช้เมื่อต้องการให้ incompatible classes ทำงานร่วมกันได้
 * 
 * Components:
 * - Target Interface: interface ที่ client ต้องการใช้
 * - Adaptee: class ที่ต้องการให้ adapt (interface ไม่สอดคล้อง)
 * - Adapter: class ที่ implement target interface และ wrap adaptee
 * - Client: ใช้ target interface
 */

// ============================================================
// TARGET INTERFACE - interface ที่ client ต้องการ
// ============================================================
interface Target {
  request(): string;
}

// ============================================================
// ADAPTEE - class ที่มี incompatible interface
// ============================================================
class Adaptee {
  specificRequest(): string {
    return "Specific Request";
  }
}

// ============================================================
// ADAPTER - แปลง adaptee ให้ compatible กับ target
// ============================================================
class Adapter implements Target {
  private adaptee: Adaptee;

  constructor(adaptee: Adaptee) {
    this.adaptee = adaptee;
  }

  request(): string {
    // แปลง adaptee interface มาเป็น target interface
    return this.adaptee.specificRequest();
  }
}

// ============================================================
// CLIENT CODE - การใช้งาน Adapter
// ============================================================

// CLIENT มี adaptee ที่มี interface ไม่สอดคล้อง
const adaptee: Adaptee = new Adaptee();

// CLIENT สร้าง adapter เพื่อแปลง adaptee
const adapter: Target = new Adapter(adaptee);

// CLIENT เรียก adapter โดยใช้ target interface
console.log("Adapter result:", adapter.request());
