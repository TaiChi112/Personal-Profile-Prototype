/**
 * COMMAND PATTERN - Behavioral
 * 
 * Purpose:
 * encapsulate request เป็น object เพื่อให้สามารถ parameterize clients และ queue requests
 * ใช้เมื่อต้องการ undo/redo, queuing, logging operations
 * 
 * Components:
 * - Command Interface: interface ที่ define execute method
 * - Concrete Command: class ที่ encapsulate request
 * - Receiver: object ที่ทำงาน
 * - Invoker: class ที่เรียก command
 */

// ============================================================
// RECEIVER - object ที่ทำงาน
// ============================================================
class Receiver {
  action(a: string, b: string): string {
    return `Receiver: action(${a}, ${b})`;
  }
}

// ============================================================
// COMMAND INTERFACE
// ============================================================
abstract class Command {
  abstract execute(): string;
}

// ============================================================
// CONCRETE COMMANDS
// ============================================================
class ConcreteCommandA extends Command {
  private receiver: Receiver;
  private a: string;
  private b: string;

  constructor(receiver: Receiver, a: string, b: string) {
    super();
    this.receiver = receiver;
    this.a = a;
    this.b = b;
  }

  execute(): string {
    return this.receiver.action(this.a, this.b);
  }
}

class ConcreteCommandB extends Command {
  private receiver: Receiver;
  private a: string;

  constructor(receiver: Receiver, a: string) {
    super();
    this.receiver = receiver;
    this.a = a;
  }

  execute(): string {
    return `Command B: ${this.receiver.action(this.a, this.a)}`;
  }
}

// ============================================================
// INVOKER
// ============================================================
class Invoker {
  private command: Command | null = null;

  setCommand(command: Command): void {
    this.command = command;
  }

  execute(): string {
    if (this.command) {
      return this.command.execute();
    }
    return "No command set";
  }
}

// ============================================================
// CLIENT CODE - การใช้งาน Command
// ============================================================

// CLIENT สร้าง receiver
const receiver: Receiver = new Receiver();

// CLIENT สร้าง commands
const commandA: Command = new ConcreteCommandA(receiver, "A", "B");
const commandB: Command = new ConcreteCommandB(receiver, "C");

// CLIENT สร้าง invoker
const invoker: Invoker = new Invoker();

// CLIENT set และ execute commands
invoker.setCommand(commandA);
console.log("Command A:", invoker.execute());

invoker.setCommand(commandB);
console.log("Command B:", invoker.execute());
