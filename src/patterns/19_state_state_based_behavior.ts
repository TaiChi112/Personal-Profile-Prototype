/**
 * STATE PATTERN - State-Based Behavior
 * 
 * Problem: page.tsx workflow has states (Draft → Review → Published)
 *          - Different actions available in each state
 *          - Changing states requires conditional logic
 *          - State transitions scattered throughout code
 * 
 * Solution: Encapsulate state in objects, delegate behavior to state
 *          Each state handles its own transitions
 */

// ====================================
// STATE INTERFACE
// ====================================

export interface State {
  publish(): void;
  draft(): void;
  review(): void;
  approve(): void;
  reject(): void;
  getName(): string;
}


// ====================================
// CONTEXT
// ====================================

export class Document {
  private state: State;
  private title: string;
  private content: string;

  constructor(title: string) {
    this.title = title;
    this.content = '';
    this.state = new DraftState(this);
  }

  setState(state: State): void {
    console.log(`Document state changed: ${this.state.getName()} → ${state.getName()}`);
    this.state = state;
  }

  getState(): State {
    return this.state;
  }

  // Delegate actions to current state
  publish(): void {
    this.state.publish();
  }

  draft(): void {
    this.state.draft();
  }

  review(): void {
    this.state.review();
  }

  approve(): void {
    this.state.approve();
  }

  reject(): void {
    this.state.reject();
  }

  setTitle(title: string): void {
    this.title = title;
  }

  setContent(content: string): void {
    this.content = content;
  }

  getTitle(): string {
    return this.title;
  }

  getContent(): string {
    return this.content;
  }
}

// ====================================
// CONCRETE STATES
// ====================================

/**
 * Draft state - document being edited
 */
export class DraftState implements State {
  constructor(private document: Document) { }

  publish(): void {
    console.log('✓ Document published from Draft');
    this.document.setState(new PublishedState(this.document));
  }

  draft(): void {
    console.log('ℹ Already in Draft state');
  }

  review(): void {
    console.log('✓ Document sent for review');
    this.document.setState(new ReviewState(this.document));
  }

  approve(): void {
    console.log('✗ Cannot approve - must go through Review first');
  }

  reject(): void {
    console.log('✗ No review to reject');
  }

  getName(): string {
    return 'Draft';
  }
}

/**
 * Review state - waiting for approval
 */
export class ReviewState implements State {
  constructor(private document: Document) { }

  publish(): void {
    console.log('✗ Cannot publish - awaiting approval');
  }

  draft(): void {
    console.log('✓ Returned to Draft for edits');
    this.document.setState(new DraftState(this.document));
  }

  review(): void {
    console.log('ℹ Already in Review state');
  }

  approve(): void {
    console.log('✓ Document approved - publishing');
    this.document.setState(new PublishedState(this.document));
  }

  reject(): void {
    console.log('✓ Document rejected - returning to Draft');
    this.document.setState(new DraftState(this.document));
  }

  getName(): string {
    return 'Review';
  }
}

/**
 * Published state - document is live
 */
export class PublishedState implements State {
  constructor(private document: Document) { }

  publish(): void {
    console.log('ℹ Already published');
  }

  draft(): void {
    console.log('✓ Document unpublished, returned to Draft');
    this.document.setState(new DraftState(this.document));
  }

  review(): void {
    console.log('✓ Document sent for review before revision');
    this.document.setState(new ReviewState(this.document));
  }

  approve(): void {
    console.log('✗ Already approved');
  }

  reject(): void {
    console.log('✓ Document rejected - unpublishing');
    this.document.setState(new DraftState(this.document));
  }

  getName(): string {
    return 'Published';
  }
}

/**
 * Archived state - document is archived
 */
export class ArchivedState implements State {
  constructor(private document: Document) { }

  publish(): void {
    console.log('✗ Cannot publish archived document');
  }

  draft(): void {
    console.log('✗ Cannot edit archived document');
  }

  review(): void {
    console.log('✗ Archived documents cannot be reviewed');
  }

  approve(): void {
    console.log('✗ Cannot approve archived document');
  }

  reject(): void {
    console.log('✗ Archived document already final');
  }

  getName(): string {
    return 'Archived';
  }
}

// ====================================
// WORKFLOW SIMULATOR
// ====================================

export class DocumentWorkflow {
  private document: Document;
  private history: string[] = [];

  constructor(title: string) {
    this.document = new Document(title);
  }

  reviewDocument() {
    // Implement the logic for reviewing the document, e.g.:
    this.document.review();
  }

  logAction(action: string): void {
    const log = `[${this.document.getState().getName()}] ${action}`;
    this.history.push(log);
  }

  publishDocument(): void {
    console.log('\n→ Attempting to publish');
    this.document.publish();
    this.logAction('publish()');
  }

  sendForReview(): void {
    console.log('\n→ Attempting to send for review');
    this.document.review();
    this.logAction('review()');
  }

  approveDocument(): void {
    console.log('\n→ Attempting to approve');
    this.document.approve();
    this.logAction('approve()');
  }

  rejectDocument(): void {
    console.log('\n→ Attempting to reject');
    this.document.reject();
    this.logAction('reject()');
  }

  draftDocument(): void {
    console.log('\n→ Returning to draft');
    this.document.draft();
    this.logAction('draft()');
  }

  archiveDocument(): void {
    console.log('\n→ Archiving document');
    this.document.setState(new ArchivedState(this.document));
    this.logAction('archive()');
  }

  getHistory(): string[] {
    return this.history;
  }

  getCurrentState(): string {
    return this.document.getState().getName();
  }
}

// ====================================
// DEMO
// ====================================

export function demoStatePattern() {
  console.log('\n🔄 STATE PATTERN - State-Based Behavior\n');

  const workflow = new DocumentWorkflow('Project Proposal');

  console.log(`Document: "${workflow.getCurrentState()}"\n`);

  // Try to approve in Draft
  workflow.approveDocument();

  // Send to review
  workflow.sendForReview();

  // Approve in review
  workflow.approveDocument();

  // Try to review again (already published)
  workflow.sendForReview();

  // Return to draft
  workflow.draftDocument();

  // Publish directly
  workflow.publishDocument();

  console.log('\n📋 State History:');
  workflow.getHistory().forEach((entry) => console.log(`  ${entry}`));

  console.log('\n✅ State Pattern Benefits:');
  console.log('  ✓ Encapsulate state-specific behavior');
  console.log('  ✓ State transitions are explicit');
  console.log('  ✓ No giant if/else chains');
  console.log('  ✓ Easy to add new states');
  console.log('  ✓ Context delegates to state');
}
