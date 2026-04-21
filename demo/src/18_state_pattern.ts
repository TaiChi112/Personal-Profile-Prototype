/**
 * STATE PATTERN - Behavioral
 * 
 * Purpose:
 * allow object เปลี่ยน behavior เมื่อ internal state เปลี่ยนแปลง
 * object จะ appear ว่า changed its class
 * 
 * Components:
 * - State Interface: interface ที่ define state operations
 * - Concrete State: implement different states
 * - Context: use state object และ delegate work ไปยัง state
 */

// ============================================================
// STATE INTERFACE
// ============================================================
interface State {
  handle(context: Context): void;
}

// ============================================================
// CONCRETE STATES
// ============================================================
class ConcreteStateA implements State {
  handle(context: Context): void {
    console.log("State A: Handling request, transitioning to State B");
    context.setState(new ConcreteStateB());
  }
}

class ConcreteStateB implements State {
  handle(context: Context): void {
    console.log("State B: Handling request, transitioning to State C");
    context.setState(new ConcreteStateC());
  }
}

class ConcreteStateC implements State {
  handle(context: Context): void {
    console.log("State C: Handling request, transitioning to State A");
    context.setState(new ConcreteStateA());
  }
}

// ============================================================
// CONTEXT
// ============================================================
class Context {
  private state: State;

  constructor(state: State) {
    this.state = state;
  }

  setState(state: State): void {
    this.state = state;
  }

  request(): void {
    this.state.handle(this);
  }
}

// ============================================================
// CLIENT CODE - การใช้งาน State
// ============================================================

// CLIENT สร้าง context ด้วย initial state
const contextState: Context = new Context(new ConcreteStateA());

// CLIENT เรียก request หลายครั้ง
console.log("State Pattern:");
contextState.request();
contextState.request();
contextState.request();
contextState.request();
