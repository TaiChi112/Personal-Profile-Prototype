/**
 * CHAIN OF RESPONSIBILITY PATTERN - Behavioral
 * 
 * Purpose:
 * ส่ง request ตามลำดับผ่าน chain ของ handlers
 * ใช้เมื่อต้องการให้ multiple objects มีโอกาสจัดการ request
 * 
 * Components:
 * - Handler Interface: interface ที่ define handling method และ successor
 * - Concrete Handler: class ที่ handle request หรือส่งต่อให้ successor
 * - Client: ส่ง request ไปยัง chain
 */

// ============================================================
// HANDLER INTERFACE
// ============================================================
abstract class Handler {
  protected successor: Handler | null = null;

  setSuccessor(successor: Handler): Handler {
    this.successor = successor;
    return successor;
  }

  abstract handle(request: string): string;
}

// ============================================================
// CONCRETE HANDLERS
// ============================================================
class ConcreteHandlerA extends Handler {
  handle(request: string): string {
    if (request === "A") {
      return `Handler A: Handled request "${request}"`;
    }
    if (this.successor) {
      return this.successor.handle(request);
    }
    return `Request "${request}" not handled`;
  }
}

class ConcreteHandlerB extends Handler {
  handle(request: string): string {
    if (request === "B") {
      return `Handler B: Handled request "${request}"`;
    }
    if (this.successor) {
      return this.successor.handle(request);
    }
    return `Request "${request}" not handled`;
  }
}

class ConcreteHandlerC extends Handler {
  handle(request: string): string {
    if (request === "C") {
      return `Handler C: Handled request "${request}"`;
    }
    if (this.successor) {
      return this.successor.handle(request);
    }
    return `Request "${request}" not handled`;
  }
}

// ============================================================
// CLIENT CODE - การใช้งาน Chain of Responsibility
// ============================================================

// CLIENT สร้าง handlers
const handlerA: Handler = new ConcreteHandlerA();
const handlerB: Handler = new ConcreteHandlerB();
const handlerC: Handler = new ConcreteHandlerC();

// CLIENT สร้าง chain
handlerA.setSuccessor(handlerB).setSuccessor(handlerC);

// CLIENT ส่ง requests ผ่าน chain
console.log("Chain of Responsibility:");
console.log(handlerA.handle("A"));
console.log(handlerA.handle("B"));
console.log(handlerA.handle("C"));
console.log(handlerA.handle("D"));
