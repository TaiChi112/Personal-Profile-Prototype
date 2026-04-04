/**
 * TEMPLATE METHOD PATTERN - Algorithm Skeleton
 * 
 * Problem: page.tsx has similar processes with different steps
 *          - Data export: validate → transform → format → write
 *          - Report generation: collect → analyze → format → export
 *          - Different implementations, same structure
 * 
 * Solution: Define algorithm skeleton, subclasses implement specific steps
 *          Inversion of control - framework calls subclass methods
 */


// ====================================
// ABSTRACT TEMPLATE
// ====================================

/**
 * Abstract class defining algorithm skeleton
 */
export abstract class DataExportTemplate<T = unknown> {
  /**
   * Template method - defines algorithm skeleton
   */
  export(data: T): void {
    this.validate(data);
    const transformed = this.transform(data);
    const formatted = this.format(transformed);
    this.write(formatted);
    this.finalize();
  }

  /**
   * Required step - must be implemented by subclass
   */
  protected abstract validate(data: T): void;

  /**
   * Required step - must be implemented by subclass
   */
  protected abstract transform(data: T): unknown;

  /**
   * Required step - must be implemented by subclass
   */
  protected abstract format(data: unknown): string;

  /**
   * Required step - must be implemented by subclass
   */
  protected abstract write(output: string): void;

  /**
   * Optional hook - can be overridden
   */
  protected finalize(): void {
    console.log('  ✓ Export complete');
  }

  getName(): string {
    return this.constructor.name;
  }
}

// ====================================
// CONCRETE TEMPLATES
// ====================================

/**
 * CSV export implementation
 */
export class CSVExport extends DataExportTemplate<Record<string, unknown>[]> {
  protected validate(data: Record<string, unknown>[]): void {
    console.log('[CSV] Validating data...');
    if (!Array.isArray(data)) {
      throw new Error('CSV export requires array data');
    }
  }

  protected transform(data: Record<string, unknown>[]): unknown {
    console.log('[CSV] Transforming data...');
    return data.map((item) => ({
      ...item,
      processed: true,
    }));
  }

  protected format(data: unknown): string {
    const typedData = data as Record<string, unknown>[];
    console.log('[CSV] Formatting as CSV...');
    if (typedData.length === 0) return '';
    const headers = Object.keys(typedData[0]);
    const csv = [
      headers.join(','),
      ...typedData.map((row) => headers.map((h) => row[h]).join(',')),
    ];
    return csv.join('\n');
  }

  protected write(output: string): void {
    console.log('[CSV] Writing file: export.csv');
    console.log(`  Content size: ${output.length} bytes`);
  }
}

/**
 * JSON export implementation
 */
export class JSONExport extends DataExportTemplate<unknown> {
  protected validate(data: unknown): void {
    console.log('[JSON] Validating data...');
    if (typeof data !== 'object') {
      throw new Error('JSON export requires object data');
    }
  }

  protected transform(data: unknown): unknown {
    console.log('[JSON] Transforming data...');
    return {
      exported: new Date().toISOString(),
      data,
    };
  }

  protected format(data: unknown): string {
    console.log('[JSON] Formatting as JSON...');
    return JSON.stringify(data, null, 2);
  }

  protected write(output: string): void {
    console.log('[JSON] Writing file: export.json');
    console.log(`  Content size: ${output.length} bytes`);
  }

  protected finalize(): void {
    console.log('  ✓ JSON export complete');
    console.log('  ℹ Pretty-printed for readability');
  }
}

/**
 * XML export implementation
 */
export class XMLExport extends DataExportTemplate<unknown> {
  protected validate(data: unknown): void {
    console.log('[XML] Validating data...');
    if (!data) {
      throw new Error('XML export requires non-null data');
    }
  }

  protected transform(data: unknown): unknown {
    console.log('[XML] Transforming data...');
    return {
      root: data,
      timestamp: new Date().toISOString(),
    };
  }

  protected format(data: unknown): string {
    console.log('[XML] Formatting as XML...');
    const xml = [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<document>',
      ...this.objectToXml(data as Record<string, unknown>, 1),
      '</document>',
    ];
    return xml.join('\n');
  }

  private objectToXml(obj: Record<string, unknown>, depth: number): string[] {
    const lines: string[] = [];
    const indent = '  '.repeat(depth);

    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'object') {
        lines.push(`${indent}<${key}>`);
        lines.push(...this.objectToXml(value as Record<string, unknown>, depth + 1));
        lines.push(`${indent}</${key}>`);
      } else {
        lines.push(`${indent}<${key}>${value}</${key}>`);
      }
    }
    return lines;
  }

  protected write(output: string): void {
    console.log('[XML] Writing file: export.xml');
    console.log(`  Content size: ${output.length} bytes`);
  }
}

/**
 * PDF export implementation
 */
export class PDFExport extends DataExportTemplate<unknown> {
  protected validate(data: unknown): void {
    console.log('[PDF] Validating data...');
    if (!data) {
      throw new Error('PDF export requires data');
    }
  }

  protected transform(data: unknown): unknown {
    console.log('[PDF] Transforming data for PDF...');
    return {
      title: 'Exported Report',
      content: data,
      pageSize: 'A4',
    };
  }

  protected format(data: unknown): string {
    console.log('[PDF] Formatting as PDF...');
    return `%PDF-1.4\n${JSON.stringify(data)}`;
  }

  protected write(output: string): void {
    console.log('[PDF] Writing file: export.pdf');
    console.log(`  Content size: ${output.length} bytes`);
    console.log('  ℹ PDF generation in progress...');
  }

  protected finalize(): void {
    console.log('  ✓ PDF export complete');
    console.log('  ℹ PDF file ready for download');
  }
}

// ====================================
// CLIENT CODE
// ====================================

export class ExportManager {
  private exporters: Map<string, DataExportTemplate> = new Map();

  public constructor() {
    this.registerExporter('csv', new CSVExport());
    this.registerExporter('json', new JSONExport());
    this.registerExporter('xml', new XMLExport());
    this.registerExporter('pdf', new PDFExport());
  }

  public registerExporter(format: string, exporter: DataExportTemplate): void {
    this.exporters.set(format, exporter);
  }

  export(format: string, data: unknown): void {
    const exporter = this.exporters.get(format);
    if (!exporter) {
      console.log(`✗ Unknown format: ${format}`);
      return;
    }

    console.log(`\n📤 Exporting as ${format.toUpperCase()}...\n`);
    try {
      exporter.export(data);
    } catch (error) {
      console.log(`✗ Export failed: ${(error as Error).message}`);
    }
  }

  getAvailableFormats(): string[] {
    return Array.from(this.exporters.keys());
  }
}

// ====================================
// DEMO
// ====================================

export function demoTemplateMethodPattern() {
  console.log('\n📋 TEMPLATE METHOD PATTERN - Algorithm Skeleton\n');

  const manager = new ExportManager();

  // Sample data
  const data = [
    { id: 1, name: 'Project A', status: 'active' },
    { id: 2, name: 'Project B', status: 'completed' },
    { id: 3, name: 'Project C', status: 'planning' },
  ];

  // Export to different formats
  const formats = manager.getAvailableFormats();
  console.log(`Available formats: ${formats.join(', ')}\n`);

  manager.export('csv', data);
  manager.export('json', data);
  manager.export('xml', { projects: data });
  manager.export('pdf', data);

  console.log('\n✅ Template Method Pattern Benefits:');
  console.log('  ✓ Define algorithm skeleton once');
  console.log('  ✓ Subclasses implement specific steps');
  console.log('  ✓ Code reuse for common structure');
  console.log('  ✓ Easy to add new export formats');
  console.log('  ✓ Inversion of control - framework calls subclass');
}
