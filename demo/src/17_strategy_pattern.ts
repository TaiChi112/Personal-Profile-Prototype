/**
 * STRATEGY PATTERN - Behavioral
 * 
 * Purpose:
 * define family of algorithms และ encapsulate แต่ละอัน
 * ให้สามารถ interchangeable algorithms ได้
 * 
 * Components:
 * - Strategy Interface: interface ที่ define algorithm interface
 * - Concrete Strategy: implement different algorithms
 * - Context: use strategy object
 */

// ============================================================
// STRATEGY INTERFACE
// ============================================================
interface Strategy {
  execute(a: number, b: number): number;
}

// ============================================================
// CONCRETE STRATEGIES
// ============================================================
class ConcreteStrategyAdd implements Strategy {
  execute(a: number, b: number): number {
    return a + b;
  }
}

class ConcreteStrategySubtract implements Strategy {
  execute(a: number, b: number): number {
    return a - b;
  }
}

class ConcreteStrategyMultiply implements Strategy {
  execute(a: number, b: number): number {
    return a * b;
  }
}

// ============================================================
// CONTEXT
// ============================================================
class Context {
  private strategy: Strategy;

  constructor(strategy: Strategy) {
    this.strategy = strategy;
  }

  setStrategy(strategy: Strategy): void {
    this.strategy = strategy;
  }

  executeStrategy(a: number, b: number): number {
    return this.strategy.execute(a, b);
  }
}

// ============================================================
// CLIENT CODE - การใช้งาน Strategy
// ============================================================

// CLIENT สร้าง strategies
const strategyAdd: Strategy = new ConcreteStrategyAdd();
const strategySubtract: Strategy = new ConcreteStrategySubtract();
const strategyMultiply: Strategy = new ConcreteStrategyMultiply();

// CLIENT สร้าง context ด้วย strategy
const context: Context = new Context(strategyAdd);

// CLIENT execute context ด้วยหลาย strategies
console.log("Strategy Pattern:");
console.log("Add: ", context.executeStrategy(5, 3));

context.setStrategy(strategySubtract);
console.log("Subtract:", context.executeStrategy(5, 3));

context.setStrategy(strategyMultiply);
console.log("Multiply:", context.executeStrategy(5, 3));
