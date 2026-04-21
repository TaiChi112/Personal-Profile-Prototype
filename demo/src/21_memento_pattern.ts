/**
 * MEMENTO PATTERN - Behavioral
 * 
 * Purpose:
 * capture และ store object state ดังนั้นสามารถ restore ได้ในภายหลัง
 * ใช้เมื่อต้องการ undo/redo functionality
 * 
 * Components:
 * - Memento: store state ของ originator
 * - Originator: create memento และ restore state จาก memento
 * - Caretaker: manage mementos
 */

// ============================================================
// MEMENTO - store state
// ============================================================
class Memento {
  private state: string;

  constructor(state: string) {
    this.state = state;
  }

  getState(): string {
    return this.state;
  }
}

// ============================================================
// ORIGINATOR - create และ restore memento
// ============================================================
class Originator {
  private state: string = "";

  setState(state: string): void {
    this.state = state;
    console.log(`Originator: State set to "${state}"`);
  }

  getState(): string {
    return this.state;
  }

  saveToMemento(): Memento {
    return new Memento(this.state);
  }

  restoreFromMemento(memento: Memento): void {
    this.state = memento.getState();
    console.log(`Originator: State restored to "${this.state}"`);
  }
}

// ============================================================
// CARETAKER - manage mementos
// ============================================================
class Caretaker {
  private mementos: Memento[] = [];

  saveMemento(memento: Memento): void {
    this.mementos.push(memento);
  }

  getMemento(index: number): Memento | null {
    if (index >= 0 && index < this.mementos.length) {
      return this.mementos[index];
    }
    return null;
  }
}

// ============================================================
// CLIENT CODE - การใช้งาน Memento
// ============================================================

// CLIENT สร้าง originator
const originator: Originator = new Originator();

// CLIENT สร้าง caretaker
const caretaker: Caretaker = new Caretaker();

// CLIENT set state และ save memento
console.log("Memento Pattern:");
originator.setState("State 1");
caretaker.saveMemento(originator.saveToMemento());

originator.setState("State 2");
caretaker.saveMemento(originator.saveToMemento());

originator.setState("State 3");

// CLIENT restore จาก memento
const savedState1 = caretaker.getMemento(0);
if (savedState1) {
  originator.restoreFromMemento(savedState1);
}

const savedState2 = caretaker.getMemento(1);
if (savedState2) {
  originator.restoreFromMemento(savedState2);
}
