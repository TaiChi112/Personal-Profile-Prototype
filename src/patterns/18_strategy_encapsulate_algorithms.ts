/**
 * STRATEGY PATTERN - Encapsulate Algorithms
 * 
 * Problem: page.tsx needs different sorting/payment/export strategies
 *          - Sort by date, price, name
 *          - Pay with card, paypal, crypto
 *          - Export to PDF, CSV, JSON
 *          - Don't want giant if/else chains
 * 
 * Solution: Encapsulate each algorithm in strategy object
 *          Select strategy at runtime
 */

// ====================================
// STRATEGY INTERFACES
// ====================================

export interface SortStrategy<T> {
  sort(items: T[]): T[];
  getName(): string;
}

export interface PaymentStrategy {
  pay(amount: number): boolean;
  getName(): string;
}

export interface ExportStrategy<T = unknown> {
  export(data: T): string;
  getFileExtension(): string;
  getName(): string;
}

// ====================================
// SORT STRATEGIES
// ====================================

export class SortByNameStrategy<T extends { name: string }> implements SortStrategy<T> {
  sort(items: T[]): T[] {
    return [...items].sort((a, b) => a.name.localeCompare(b.name));
  }

  getName(): string {
    return 'By Name';
  }
}

export class SortByDateStrategy<T extends { date: Date }> implements SortStrategy<T> {
  sort(items: T[]): T[] {
    return [...items].sort((a, b) => a.date.getTime() - b.date.getTime());
  }

  getName(): string {
    return 'By Date';
  }
}

export class SortByPriceStrategy<T extends { price: number }> implements SortStrategy<T> {
  sort(items: T[]): T[] {
    return [...items].sort((a, b) => a.price - b.price);
  }

  getName(): string {
    return 'By Price';
  }
}

// ====================================
// PAYMENT STRATEGIES
// ====================================

export class CreditCardPayment implements PaymentStrategy {
  constructor(private cardNumber: string) {}

  pay(amount: number): boolean {
    console.log(`[Credit Card] Processing $${amount} with card ending in ${this.cardNumber.slice(-4)}`);
    return Math.random() > 0.1; // 90% success
  }

  getName(): string {
    return 'Credit Card';
  }
}

export class PayPalPayment implements PaymentStrategy {
  constructor(private email: string) {}

  pay(amount: number): boolean {
    console.log(`[PayPal] Processing $${amount} via ${this.email}`);
    return Math.random() > 0.05; // 95% success
  }

  getName(): string {
    return 'PayPal';
  }
}

export class CryptoPayment implements PaymentStrategy {
  constructor(private walletAddress: string) {}

  pay(amount: number): boolean {
    console.log(`[Crypto] Processing $${amount} to ${this.walletAddress.slice(0, 8)}...`);
    return Math.random() > 0.2; // 80% success
  }

  getName(): string {
    return 'Cryptocurrency';
  }
}

export class BankTransferPayment implements PaymentStrategy {
  constructor(private accountNumber: string) {}

  pay(amount: number): boolean {
    console.log(`[Bank Transfer] Processing $${amount} to account ${this.accountNumber}`);
    return Math.random() > 0.15; // 85% success
  }

  getName(): string {
    return 'Bank Transfer';
  }
}

// ====================================
// EXPORT STRATEGIES
// ====================================

export class PDFExportStrategy implements ExportStrategy<unknown> {
  export(data: unknown): string {
    return `%PDF\n${JSON.stringify(data, null, 2)}`;
  }

  getFileExtension(): string {
    return 'pdf';
  }

  getName(): string {
    return 'PDF';
  }
}

export class CSVExportStrategy implements ExportStrategy<Record<string, unknown>[]> {
  export(data: Record<string, unknown>[]): string {
    if (!Array.isArray(data)) return '';
    const headers = Object.keys(data[0] || {});
    const csv = [
      headers.join(','),
      ...data.map((row: Record<string, unknown>) => headers.map((h) => row[h]).join(',')),
    ];
    return csv.join('\n');
  }

  getFileExtension(): string {
    return 'csv';
  }

  getName(): string {
    return 'CSV';
  }
}

export class JSONExportStrategy implements ExportStrategy<unknown> {
  export(data: unknown): string {
    return JSON.stringify(data, null, 2);
  }

  getFileExtension(): string {
    return 'json';
  }

  getName(): string {
    return 'JSON';
  }
}

export class XMLExportStrategy implements ExportStrategy<unknown> {
  export(data: unknown): string {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<root>${JSON.stringify(data)}</root>`;
    return xml;
  }

  getFileExtension(): string {
    return 'xml';
  }

  getName(): string {
    return 'XML';
  }
}

// ====================================
// CONTEXT - Uses strategies
// ====================================

/**
 * Sorter context
 */
export class Sorter<T> {
  private strategy: SortStrategy<T>;

  constructor(strategy: SortStrategy<T>) {
    this.strategy = strategy;
  }

  setStrategy(strategy: SortStrategy<T>): void {
    this.strategy = strategy;
    console.log(`Sorting strategy changed to: ${strategy.getName()}`);
  }

  sort(items: T[]): T[] {
    console.log(`Sorting by ${this.strategy.getName()}...`);
    return this.strategy.sort(items);
  }
}

/**
 * Payment processor context
 */
export class PaymentProcessor {
  private strategy: PaymentStrategy;

  constructor(strategy: PaymentStrategy) {
    this.strategy = strategy;
  }

  setPaymentMethod(strategy: PaymentStrategy): void {
    this.strategy = strategy;
    console.log(`Payment method changed to: ${strategy.getName()}`);
  }

  processPayment(amount: number): boolean {
    console.log(`\nProcessing payment of $${amount}...`);
    const success = this.strategy.pay(amount);
    console.log(`Result: ${success ? '✓ Success' : '✗ Failed'}`);
    return success;
  }
}

/**
 * Exporter context
 */
export class DataExporter {
  private strategy: ExportStrategy<unknown>;

  constructor(strategy: ExportStrategy<unknown>) {
    this.strategy = strategy;
  }

  setExportFormat(strategy: ExportStrategy<unknown>): void {
    this.strategy = strategy;
  }

  export(data: unknown): { content: string; filename: string } {
    const content = this.strategy.export(data);
    const filename = `export.${this.strategy.getFileExtension()}`;
    console.log(`Exported as ${this.strategy.getName()}: ${filename}`);
    return { content, filename };
  }
}

// ====================================
// DEMO
// ====================================

export function demoStrategyPattern() {
  console.log('\n🎯 STRATEGY PATTERN - Encapsulate Algorithms\n');

  // === SORTING STRATEGIES ===
  console.log('📋 Sorting Examples:\n');

  interface Item {
    name: string;
    date: Date;
    price: number;
  }

  const items: Item[] = [
    { name: 'Apple', date: new Date('2024-03-15'), price: 5 },
    { name: 'Banana', date: new Date('2024-01-10'), price: 2 },
    { name: 'Cherry', date: new Date('2024-02-20'), price: 8 },
  ];

  const sorter = new Sorter<Item>(new SortByNameStrategy<Item>());
  console.log('Names:', sorter.sort(items).map((i) => i.name));

  sorter.setStrategy(new SortByPriceStrategy<Item>());
  console.log('Prices:', sorter.sort(items).map((i) => i.price));

  sorter.setStrategy(new SortByDateStrategy<Item>());
  console.log('Dates:', sorter.sort(items).map((i) => i.date.toDateString()));

  // === PAYMENT STRATEGIES ===
  console.log('\n💳 Payment Methods:\n');

  const processor = new PaymentProcessor(new CreditCardPayment('1234-5678-9999-0000'));
  processor.processPayment(99.99);

  processor.setPaymentMethod(new PayPalPayment('user@example.com'));
  processor.processPayment(49.99);

  processor.setPaymentMethod(new CryptoPayment('0x123abc...'));
  processor.processPayment(0.5);

  // === EXPORT STRATEGIES ===
  console.log('\n💾 Export Formats:\n');

  const data = [{ id: 1, name: 'Project A' }];
  const exporter = new DataExporter(new JSONExportStrategy());
  const json = exporter.export(data);
  console.log(`Filename: ${json.filename}`);

  exporter.setExportFormat(new CSVExportStrategy());
  const csv = exporter.export(data);
  console.log(`Filename: ${csv.filename}`);

  console.log('\n✅ Strategy Pattern Benefits:');
  console.log('  ✓ Encapsulate each algorithm separately');
  console.log('  ✓ Select algorithm at runtime');
  console.log('  ✓ Easy to add new strategies');
  console.log('  ✓ Eliminate conditional logic');
}
