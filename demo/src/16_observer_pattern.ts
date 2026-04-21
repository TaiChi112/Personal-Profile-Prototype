/**
 * OBSERVER PATTERN - Behavioral
 * 
 * Purpose:
 * notify multiple observers เมื่อ subject state เปลี่ยนแปลง
 * ใช้เมื่อต้องการ loose coupling ระหว่าง objects ที่ depend กัน
 * 
 * Components:
 * - Subject: interface/class ที่มี state และ notify observers
 * - Concrete Subject: implement subject
 * - Observer Interface: interface ที่ define update method
 * - Concrete Observer: implement observer interface
 */

// ============================================================
// OBSERVER INTERFACE
// ============================================================
interface Observer {
  update(subject: Subject): void;
}

// ============================================================
// SUBJECT INTERFACE
// ============================================================
interface Subject {
  attach(observer: Observer): void;
  detach(observer: Observer): void;
  notify(): void;
}

// ============================================================
// CONCRETE SUBJECT
// ============================================================
class ConcreteSubject implements Subject {
  private state: string = "";
  private observers: Observer[] = [];

  getState(): string {
    return this.state;
  }

  setState(state: string): void {
    this.state = state;
    this.notify();
  }

  attach(observer: Observer): void {
    if (!this.observers.includes(observer)) {
      this.observers.push(observer);
    }
  }

  detach(observer: Observer): void {
    const index = this.observers.indexOf(observer);
    if (index > -1) {
      this.observers.splice(index, 1);
    }
  }

  notify(): void {
    for (const observer of this.observers) {
      observer.update(this);
    }
  }
}

// ============================================================
// CONCRETE OBSERVERS
// ============================================================
class ConcreteObserverA implements Observer {
  update(subject: Subject): void {
    const concreteSubject = subject as ConcreteSubject;
    console.log(`Observer A: State changed to "${concreteSubject.getState()}"`);
  }
}

class ConcreteObserverB implements Observer {
  update(subject: Subject): void {
    const concreteSubject = subject as ConcreteSubject;
    console.log(`Observer B: State changed to "${concreteSubject.getState()}"`);
  }
}

// ============================================================
// CLIENT CODE - การใช้งาน Observer
// ============================================================

// CLIENT สร้าง subject
const subject: Subject = new ConcreteSubject();

// CLIENT สร้าง observers
const observerA: Observer = new ConcreteObserverA();
const observerB: Observer = new ConcreteObserverB();

// CLIENT attach observers ไปยัง subject
subject.attach(observerA);
subject.attach(observerB);

// CLIENT เปลี่ยน state ของ subject
console.log("Observer Pattern:");
(subject as ConcreteSubject).setState("State 1");
(subject as ConcreteSubject).setState("State 2");

// CLIENT detach observer
subject.detach(observerB);
(subject as ConcreteSubject).setState("State 3");
