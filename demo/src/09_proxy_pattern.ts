/**
 * PROXY PATTERN - Structural
 * 
 * Purpose:
 * ให้ placeholder หรือ surrogate สำหรับ object อื่น
 * ใช้เมื่อต้องการ lazy initialization, access control, หรือ logging
 * 
 * Components:
 * - Subject Interface: interface ที่ define common operations
 * - Real Subject: actual object ที่ต้องการ protect หรือ lazy load
 * - Proxy: class ที่ implement subject interface และ control access
 * - Client: ใช้ proxy แทนที่จะใช้ real subject โดยตรง
 */

// ============================================================
// SUBJECT INTERFACE
// ============================================================
interface Subject {
  request(): string;
}

// ============================================================
// REAL SUBJECT - actual object
// ============================================================
class RealSubject implements Subject {
  request(): string {
    return "RealSubject: Handling request";
  }
}

// ============================================================
// PROXY - control access ไปยัง real subject
// ============================================================
class Proxy implements Subject {
  private realSubject: RealSubject | null = null;

  // Lazy initialization - สร้าง real subject เมื่อต้องการเท่านั้น
  request(): string {
    if (!this.realSubject) {
      this.realSubject = new RealSubject();
    }
    return `Proxy: ${this.realSubject.request()}`;
  }
}

// ============================================================
// CLIENT CODE - การใช้งาน Proxy
// ============================================================

// CLIENT ใช้ proxy แทนที่จะใช้ real subject โดยตรง
const proxy: Subject = new Proxy();

// CLIENT เรียก proxy ซึ่งจะสร้าง real subject เฉพาะเมื่อต้องการ
console.log("Proxy result:", proxy.request());
console.log("Proxy result (cached):", proxy.request());
