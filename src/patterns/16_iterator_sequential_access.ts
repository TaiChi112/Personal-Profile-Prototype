/**
 * ITERATOR PATTERN - Sequential Access to Elements
 * 
 * Problem: page.tsx displays projects in different ways
 *          - List view, grid view, timeline view
 *          - Different storage: array, linked list, tree
 *          - Want same iteration interface for all
 * 
 * Solution: Create iterator that abstracts traversal
 *          Client doesn't know about storage structure
 */

// ====================================
// ITERATOR INTERFACE
// ====================================

export interface Iterator<T> {
  hasNext(): boolean;
  next(): T;
  reset(): void;
  current(): T | null;
  getIndex(): number;
}

// ====================================
// COLLECTION INTERFACE
// ====================================

export interface Collection<T> {
  createIterator(): Iterator<T>;
  addItem(item: T): void;
  removeItem(item: T): void;
  getSize(): number;
}

// ====================================
// CONCRETE ITERATORS
// ====================================

/**
 * Iterator for Array-based collection
 */
export class ArrayIterator<T> implements Iterator<T> {
  private position: number = 0;

  constructor(private items: T[]) {}

  hasNext(): boolean {
    return this.position < this.items.length;
  }

  next(): T {
    if (!this.hasNext()) {
      throw new Error('No more items');
    }
    return this.items[this.position++];
  }

  reset(): void {
    this.position = 0;
  }

  current(): T | null {
    return this.position > 0 ? this.items[this.position - 1] : null;
  }

  getIndex(): number {
    return this.position - 1;
  }
}

/**
 * Reverse iterator for arrays
 */
export class ReverseArrayIterator<T> implements Iterator<T> {
  private position: number;

  constructor(private items: T[]) {
    this.position = items.length;
  }

  hasNext(): boolean {
    return this.position > 0;
  }

  next(): T {
    if (!this.hasNext()) {
      throw new Error('No more items');
    }
    return this.items[--this.position];
  }

  reset(): void {
    this.position = this.items.length;
  }

  current(): T | null {
    return this.position < this.items.length ? this.items[this.position] : null;
  }

  getIndex(): number {
    return this.position;
  }
}

/**
 * Iterator for linked list
 */
export class LinkedListIterator<T> implements Iterator<T> {
  private currentNode: Node<T> | null;
  private head: Node<T> | null;

  constructor(head: Node<T> | null) {
    this.head = head;
    this.currentNode = null;
  }

  hasNext(): boolean {
    if (this.currentNode === null) {
      return this.head !== null;
    }
    return this.currentNode.next !== null;
  }

  next(): T {
    if (!this.hasNext()) {
      throw new Error('No more items');
    }
    this.currentNode = this.currentNode === null ? this.head : this.currentNode.next;
    return this.currentNode!.value;
  }

  reset(): void {
    this.currentNode = null;
  }

  current(): T | null {
    return this.currentNode?.value || null;
  }

  getIndex(): number {
    let index = 0;
    let node = this.head;
    while (node && node !== this.currentNode) {
      index++;
      node = node.next;
    }
    return this.currentNode ? index : -1;
  }
}

/**
 * Node for linked list
 */
export class Node<T> {
  constructor(
    public value: T,
    public next: Node<T> | null = null
  ) {}
}

// ====================================
// CONCRETE COLLECTIONS
// ====================================

/**
 * Array-based collection
 */
export class ProjectList implements Collection<Project> {
  private items: Project[] = [];

  // constructor(initialItems?: Project[]) {
  //   if (initialItems) {
  //     this.items = [...initialItems];
  //   }
  // }

  createIterator(): Iterator<Project> {
    return new ArrayIterator(this.items);
  }

  createReverseIterator(): Iterator<Project> {
    return new ReverseArrayIterator(this.items);
  }

  addItem(item: Project): void {
    this.items.push(item);
  }

  removeItem(item: Project): void {
    const index = this.items.indexOf(item);
    if (index > -1) {
      this.items.splice(index, 1);
    }
  }

  getSize(): number {
    return this.items.length;
  }
}

/**
 * Linked list collection
 */
export class LinkedProjectList implements Collection<Project> {
  private head: Node<Project> | null = null;
  private size: number = 0;

  createIterator(): Iterator<Project> {
    return new LinkedListIterator(this.head);
  }

  addItem(item: Project): void {
    const newNode = new Node(item);
    if (this.head === null) {
      this.head = newNode;
    } else {
      let current = this.head;
      while (current.next) {
        current = current.next;
      }
      current.next = newNode;
    }
    this.size++;
  }

  removeItem(item: Project): void {
    if (this.head === null) return;

    if (this.head.value === item) {
      this.head = this.head.next;
      this.size--;
      return;
    }

    let current = this.head;
    while (current.next) {
      if (current.next.value === item) {
        current.next = current.next.next;
        this.size--;
        return;
      }
      current = current.next;
    }
  }

  getSize(): number {
    return this.size;
  }
}

// ====================================
// DATA MODEL
// ====================================

export interface Project {
  id: string;
  title: string;
  status: string;
}

// ====================================
// CLIENT CODE
// ====================================

export function iterateCollection<T>(
  collection: Collection<T>,
  processor: (item: T, index: number) => void
) {
  const iterator = collection.createIterator();
  let index = 0;

  while (iterator.hasNext()) {
    const item = iterator.next();
    processor(item, index++);
  }
}

// ====================================
// DEMO
// ====================================

export function demoIteratorPattern() {
  console.log('\n🔄 ITERATOR PATTERN - Sequential Access\n');

  // Sample data
  const projects: Project[] = [
    { id: '1', title: 'Website Redesign', status: 'active' },
    { id: '2', title: 'Mobile App', status: 'active' },
    { id: '3', title: 'API Development', status: 'planning' },
    { id: '4', title: 'Database Migration', status: 'completed' },
  ];

  // === Array-based collection ===
  console.log('📋 Array-based Collection:\n');
  const arrayList = new ProjectList();
  projects.forEach((p) => arrayList.addItem(p));

  console.log('Forward iteration:');
  const iterator = arrayList.createIterator();
  while (iterator.hasNext()) {
    const project = iterator.next();
    console.log(`  [${iterator.getIndex()}] ${project.title}`);
  }

  console.log('\nReverse iteration:');
  const reverseIterator = arrayList.createReverseIterator();
  while (reverseIterator.hasNext()) {
    const project = reverseIterator.next();
    console.log(`  [${reverseIterator.getIndex()}] ${project.title}`);
  }

  // === Linked list collection ===
  console.log('\n📋 Linked List Collection:\n');
  const linkedList = new LinkedProjectList();
  projects.forEach((p) => linkedList.addItem(p));

  console.log('Iterating linked list:');
  const linkedIterator = linkedList.createIterator();
  while (linkedIterator.hasNext()) {
    const project = linkedIterator.next();
    console.log(`  ✓ ${project.title}`);
  }

  console.log('\n📊 Collection stats:');
  console.log(`  Array list size: ${arrayList.getSize()}`);
  console.log(`  Linked list size: ${linkedList.getSize()}`);
  console.log('  Same iteration interface, different storage!');

  console.log('\n✅ Iterator Pattern Benefits:');
  console.log('  ✓ Uniform access regardless of storage');
  console.log('  ✓ Client doesn\'t know collection structure');
  console.log('  ✓ Support different traversal orders');
  console.log('  ✓ Multiple iterators on same collection');
}
