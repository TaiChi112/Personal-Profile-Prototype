/**
 * MEDIATOR PATTERN - Behavioral
 * 
 * Purpose:
 * define object ที่ encapsulate วิธีการ interact กับ collection ของ objects
 * reduce coupling โดยให้ objects communicate ผ่าน mediator
 * 
 * Components:
 * - Mediator Interface: interface ที่ define communication methods
 * - Concrete Mediator: implement mediator logic
 * - Colleague Interface: interface ของ objects ที่ interact
 * - Concrete Colleague: implement colleague interface
 */

// ============================================================
// MEDIATOR INTERFACE
// ============================================================
interface Mediator {
  send(message: string, colleague: Colleague): void;
}

// ============================================================
// COLLEAGUE INTERFACE
// ============================================================
abstract class Colleague {
  protected mediator: Mediator;

  constructor(mediator: Mediator) {
    this.mediator = mediator;
  }

  abstract send(message: string): void;
  abstract receive(message: string): void;
}

// ============================================================
// CONCRETE MEDIATOR
// ============================================================
class ConcreteMediator implements Mediator {
  private colleagueA: ConcreteColleagueA | null = null;
  private colleagueB: ConcreteColleagueB | null = null;

  setColleagueA(colleague: ConcreteColleagueA): void {
    this.colleagueA = colleague;
  }

  setColleagueB(colleague: ConcreteColleagueB): void {
    this.colleagueB = colleague;
  }

  send(message: string, colleague: Colleague): void {
    if (colleague === this.colleagueA && this.colleagueB) {
      this.colleagueB.receive(message);
    } else if (colleague === this.colleagueB && this.colleagueA) {
      this.colleagueA.receive(message);
    }
  }
}

// ============================================================
// CONCRETE COLLEAGUES
// ============================================================
class ConcreteColleagueA extends Colleague {
  send(message: string): void {
    this.mediator.send(`Colleague A: ${message}`, this);
  }

  receive(message: string): void {
    console.log(`Colleague A received: ${message}`);
  }
}

class ConcreteColleagueB extends Colleague {
  send(message: string): void {
    this.mediator.send(`Colleague B: ${message}`, this);
  }

  receive(message: string): void {
    console.log(`Colleague B received: ${message}`);
  }
}

// ============================================================
// CLIENT CODE - การใช้งาน Mediator
// ============================================================

// CLIENT สร้าง mediator
const mediator: ConcreteMediator = new ConcreteMediator();

// CLIENT สร้าง colleagues
const colleagueA: ConcreteColleagueA = new ConcreteColleagueA(mediator);
const colleagueB: ConcreteColleagueB = new ConcreteColleagueB(mediator);

// CLIENT register colleagues กับ mediator
mediator.setColleagueA(colleagueA);
mediator.setColleagueB(colleagueB);

// CLIENT ส่ง messages ผ่าน mediator
console.log("Mediator Pattern:");
colleagueA.send("Hello from A");
colleagueB.send("Hello from B");
