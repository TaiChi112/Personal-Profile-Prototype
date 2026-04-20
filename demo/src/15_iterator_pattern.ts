/**
 * ITERATOR PATTERN - Behavioral
 * 
 * Purpose:
 * เข้าถึง elements ของ collection ตามลำดับโดยไม่เปิดเผย underlying representation
 * ใช้เมื่อต้องการ iterate ผ่าน collection ด้วยหลายวิธี
 * 
 * Components:
 * - Iterator Interface: interface ที่ define iteration methods
 * - Concrete Iterator: implement iterator interface
 * - Collection Interface: interface ที่ define createIterator method
 * - Concrete Collection: implement collection interface
 */

// ============================================================
// ITERATOR INTERFACE
// ============================================================
interface Iterator {
  hasNext(): boolean;
  next(): string;
}

// ============================================================
// CONCRETE ITERATOR
// ============================================================
class ConcreteIterator implements Iterator {
  private collection: ConcreteCollection;
  private position: number = 0;

  constructor(collection: ConcreteCollection) {
    this.collection = collection;
  }

  hasNext(): boolean {
    return this.position < this.collection.getCount();
  }

  next(): string {
    if (this.hasNext()) {
      return this.collection.getItem(this.position++);
    }
    return "No more items";
  }
}

// ============================================================
// COLLECTION INTERFACE
// ============================================================
interface Collection {
  createIterator(): Iterator;
}

// ============================================================
// CONCRETE COLLECTION
// ============================================================
class ConcreteCollection implements Collection {
  private items: string[] = [];

  addItem(item: string): void {
    this.items.push(item);
  }

  getItem(index: number): string {
    return this.items[index];
  }

  getCount(): number {
    return this.items.length;
  }

  createIterator(): Iterator {
    return new ConcreteIterator(this);
  }
}

// ============================================================
// CLIENT CODE - การใช้งาน Iterator
// ============================================================

// CLIENT สร้าง collection
const collection: Collection = new ConcreteCollection();
(collection as ConcreteCollection).addItem("Item 1");
(collection as ConcreteCollection).addItem("Item 2");
(collection as ConcreteCollection).addItem("Item 3");

// CLIENT สร้าง iterator จาก collection
const iterator: Iterator = collection.createIterator();

// CLIENT iterate ผ่าน collection
console.log("Iterator Pattern:");
while (iterator.hasNext()) {
  console.log(iterator.next());
}
