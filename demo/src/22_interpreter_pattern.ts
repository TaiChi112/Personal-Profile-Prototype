/**
 * INTERPRETER PATTERN - Behavioral
 * 
 * Purpose:
 * define representation ของ grammar สำหรับ language
 * และ interpreter ที่ interpret sentences
 * ใช้เมื่อต้องการ parse หรือ interpret custom language/notation
 * 
 * Components:
 * - Expression Interface: interface ที่ define interpret method
 * - Terminal Expression: implement interpret สำหรับ terminal symbols
 * - Non-Terminal Expression: implement interpret สำหรับ non-terminal symbols
 * - Context: contain information ที่ interpreter ต้องการ
 */

// ============================================================
// EXPRESSION INTERFACE
// ============================================================
interface Expression {
  interpret(context: string): boolean;
}

// ============================================================
// TERMINAL EXPRESSION
// ============================================================
class TerminalExpression implements Expression {
  private data: string;

  constructor(data: string) {
    this.data = data;
  }

  interpret(context: string): boolean {
    return context.includes(this.data);
  }
}

// ============================================================
// NON-TERMINAL EXPRESSION
// ============================================================
class OrExpression implements Expression {
  private expr1: Expression;
  private expr2: Expression;

  constructor(expr1: Expression, expr2: Expression) {
    this.expr1 = expr1;
    this.expr2 = expr2;
  }

  interpret(context: string): boolean {
    return this.expr1.interpret(context) || this.expr2.interpret(context);
  }
}

class AndExpression implements Expression {
  private expr1: Expression;
  private expr2: Expression;

  constructor(expr1: Expression, expr2: Expression) {
    this.expr1 = expr1;
    this.expr2 = expr2;
  }

  interpret(context: string): boolean {
    return this.expr1.interpret(context) && this.expr2.interpret(context);
  }
}

// ============================================================
// CLIENT CODE - การใช้งาน Interpreter
// ============================================================

// CLIENT สร้าง terminal expressions
const exprA: Expression = new TerminalExpression("A");
const exprB: Expression = new TerminalExpression("B");
const exprC: Expression = new TerminalExpression("C");

// CLIENT สร้าง non-terminal expressions (grammar rules)
const orExpr: Expression = new OrExpression(exprA, exprB);
const andExpr: Expression = new AndExpression(orExpr, exprC);

// CLIENT interpret context
console.log("Interpreter Pattern:");
console.log('Interpret "A": ', orExpr.interpret("A")); // true
console.log('Interpret "B": ', orExpr.interpret("B")); // true
console.log('Interpret "D": ', orExpr.interpret("D")); // false
console.log('Interpret "AC": ', andExpr.interpret("AC")); // true
console.log('Interpret "BD": ', andExpr.interpret("BD")); // false
