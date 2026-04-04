/**
 * INTERPRETER PATTERN - Define Grammar & Evaluate Expressions
 * 
 * Problem: page.tsx needs to parse & evaluate custom expressions
 *          - Handle mathematical expressions: "2 + 3 * 4"
 *          - Support variables: "price * 1.1"
 *          - Extensible grammar for new operations
 * 
 * Solution: Define Expression grammar with terminal & non-terminal expressions
 *          Each expression knows how to interpret itself
 */

// ====================================
// EXPRESSION INTERFACE
// ====================================

export interface Context {
  [key: string]: number;
}

/**
 * Expression - defines interpret() method
 */
export interface Expression {
  interpret(context: Context): number;
  toString(): string;
}

// ====================================
// TERMINAL EXPRESSIONS (Leaves)
// ====================================

/**
 * Number literal
 */
export class NumberExpression implements Expression {
  constructor(private value: number) {}

  interpret(): number {
    return this.value;
  }

  toString(): string {
    return this.value.toString();
  }
}

/**
 * Variable reference
 */
export class VariableExpression implements Expression {
  constructor(private variableName: string) {}

  interpret(context: Context): number {
    const value = context[this.variableName];
    if (value === undefined) {
      throw new Error(`Undefined variable: ${this.variableName}`);
    }
    return value;
  }

  toString(): string {
    return this.variableName;
  }
}

// ====================================
// NON-TERMINAL EXPRESSIONS (Operations)
// ====================================

/**
 * Addition
 */
export class AddExpression implements Expression {
  constructor(
    private left: Expression,
    private right: Expression
  ) {}

  interpret(context: Context): number {
    return this.left.interpret(context) + this.right.interpret(context);
  }

  toString(): string {
    return `(${this.left.toString()} + ${this.right.toString()})`;
  }
}

/**
 * Subtraction
 */
export class SubtractExpression implements Expression {
  constructor(
    private left: Expression,
    private right: Expression
  ) {}

  interpret(context: Context): number {
    return this.left.interpret(context) - this.right.interpret(context);
  }

  toString(): string {
    return `(${this.left.toString()} - ${this.right.toString()})`;
  }
}

/**
 * Multiplication
 */
export class MultiplyExpression implements Expression {
  constructor(
    private left: Expression,
    private right: Expression
  ) {}

  interpret(context: Context): number {
    return this.left.interpret(context) * this.right.interpret(context);
  }

  toString(): string {
    return `(${this.left.toString()} * ${this.right.toString()})`;
  }
}

/**
 * Division
 */
export class DivideExpression implements Expression {
  constructor(
    private left: Expression,
    private right: Expression
  ) {}

  interpret(context: Context): number {
    const rightVal = this.right.interpret(context);
    if (rightVal === 0) {
      throw new Error('Division by zero');
    }
    return this.left.interpret(context) / rightVal;
  }

  toString(): string {
    return `(${this.left.toString()} / ${this.right.toString()})`;
  }
}

/**
 * Modulo
 */
export class ModuloExpression implements Expression {
  constructor(
    private left: Expression,
    private right: Expression
  ) {}

  interpret(context: Context): number {
    return this.left.interpret(context) % this.right.interpret(context);
  }

  toString(): string {
    return `(${this.left.toString()} % ${this.right.toString()})`;
  }
}

/**
 * Power
 */
export class PowerExpression implements Expression {
  constructor(
    private base: Expression,
    private exponent: Expression
  ) {}

  interpret(context: Context): number {
    return Math.pow(
      this.base.interpret(context),
      this.exponent.interpret(context)
    );
  }

  toString(): string {
    return `(${this.base.toString()} ^ ${this.exponent.toString()})`;
  }
}

// ====================================
// PARSER
// ====================================

/**
 * Simple recursive descent parser
 * Grammar:
 *   expression := term (('+' | '-') term)*
 *   term := factor (('*' | '/' | '%') factor)*
 *   factor := power ('^' power)*
 *   power := number | variable | '(' expression ')'
 */
export class ExpressionParser {
  private tokens: string[] = [];
  private position: number = 0;

  parse(input: string): Expression {
    this.tokenize(input);
    this.position = 0;
    const expr = this.parseExpression();
    if (this.position < this.tokens.length) {
      throw new Error(`Unexpected token: ${this.tokens[this.position]}`);
    }
    return expr;
  }

  private tokenize(input: string): void {
    // Simple tokenizer: split on operators and parentheses, keep alphanumeric groups
    const tokenPattern = /(\d+|[a-zA-Z_]\w*|\+|\-|\*|\/|%|\^|\(|\))/g;
    this.tokens = [];
    let match;
    while ((match = tokenPattern.exec(input)) !== null) {
      this.tokens.push(match[0]);
    }
  }

  private currentToken(): string {
    return this.position < this.tokens.length ? this.tokens[this.position] : '';
  }

  private consume(expected?: string): string {
    const token = this.currentToken();
    if (expected && token !== expected) {
      throw new Error(`Expected ${expected} but got ${token}`);
    }
    this.position++;
    return token;
  }

  private parseExpression(): Expression {
    let left = this.parseTerm();

    while (this.currentToken() === '+' || this.currentToken() === '-') {
      const op = this.consume();
      const right = this.parseTerm();
      left = op === '+' ? new AddExpression(left, right) : new SubtractExpression(left, right);
    }

    return left;
  }

  private parseTerm(): Expression {
    let left = this.parseFactor();

    while (
      this.currentToken() === '*' ||
      this.currentToken() === '/' ||
      this.currentToken() === '%'
    ) {
      const op = this.consume();
      const right = this.parseFactor();
      if (op === '*') {
        left = new MultiplyExpression(left, right);
      } else if (op === '/') {
        left = new DivideExpression(left, right);
      } else {
        left = new ModuloExpression(left, right);
      }
    }

    return left;
  }

  private parseFactor(): Expression {
    let left = this.parsePrimary();

    while (this.currentToken() === '^') {
      this.consume();
      const right = this.parsePrimary();
      left = new PowerExpression(left, right);
    }

    return left;
  }

  private parsePrimary(): Expression {
    const token = this.currentToken();

    if (token === '(') {
      this.consume('(');
      const expr = this.parseExpression();
      this.consume(')');
      return expr;
    }

    if (/^\d+$/.test(token)) {
      this.consume();
      return new NumberExpression(parseInt(token, 10));
    }

    if (/^[a-zA-Z_]\w*$/.test(token)) {
      this.consume();
      return new VariableExpression(token);
    }

    throw new Error(`Unexpected token: ${token}`);
  }
}

// ====================================
// EXPRESSION EVALUATOR
// ====================================

export class Calculator {
  private parser = new ExpressionParser();
  private context: Context = {};

  setVariable(name: string, value: number): void {
    this.context[name] = value;
    console.log(`[Calc] Set ${name} = ${value}`);
  }

  evaluate(expressionString: string): number {
    try {
      const expression = this.parser.parse(expressionString);
      const result = expression.interpret(this.context);
      console.log(`[Calc] ${expression.toString()} = ${result}`);
      return result;
    } catch (error) {
      console.error(`[Calc] Error: ${(error as Error).message}`);
      throw error;
    }
  }

  getContext(): Context {
    return { ...this.context };
  }
}

// ====================================
// DEMO
// ====================================

export function demoInterpreterPattern() {
  console.log('\n📝 INTERPRETER PATTERN - Define Grammar & Evaluate\n');

  const calc = new Calculator();

  // Example 1: Simple arithmetic
  console.log('=== Example 1: Simple Arithmetic ===\n');
  calc.evaluate('2 + 3');
  calc.evaluate('10 - 5');
  calc.evaluate('4 * 5');
  calc.evaluate('20 / 4');

  // Example 2: Complex expressions with operator precedence
  console.log('\n=== Example 2: Operator Precedence ===\n');
  calc.evaluate('2 + 3 * 4'); // 14
  calc.evaluate('(2 + 3) * 4'); // 20
  calc.evaluate('10 - 2 - 3'); // 5
  calc.evaluate('2 ^ 3 ^ 2'); // 512 (right associative power)

  // Example 3: Variables
  console.log('\n=== Example 3: Variables ===\n');
  calc.setVariable('price', 100);
  calc.setVariable('tax', 0.1);
  calc.evaluate('price + price * tax'); // 110
  calc.evaluate('price / 2 + 25'); // 75

  calc.setVariable('quantity', 5);
  calc.evaluate('price * quantity'); // 500

  // Example 4: Advanced expressions
  console.log('\n=== Example 4: Advanced ===\n');
  calc.setVariable('a', 2);
  calc.setVariable('b', 3);
  calc.setVariable('c', 4);
  calc.evaluate('a ^ 2 + b ^ 2 + c ^ 2'); // 29
  calc.evaluate('(a + b) * c - 5'); // 23

  console.log('\n✅ Interpreter Pattern Benefits:');
  console.log('  ✓ Define custom grammar/expressions');
  console.log('  ✓ Each expression type knows how to evaluate itself');
  console.log('  ✓ Easy to extend with new operations');
  console.log('  ✓ Composable expressions (trees)');
  console.log('  ✓ Support variables and context');
}
