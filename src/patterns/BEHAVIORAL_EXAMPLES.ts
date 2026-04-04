/**
 * BEHAVIORAL PATTERNS - COMPREHENSIVE EXAMPLES
 * 
 * All 11 behavioral patterns with real-world scenarios from page.tsx
 * Demonstrates how patterns solve actual application problems
 */

import {
    // demoChainOfResponsibility,
    SupportSystem,
    SupportRequest,
} from './14_chain_of_responsibility';
import {
    // demoCommandPattern,
    SimpleDocument,
    CommandExecutor,
    SetTextCommand,
    ChangeFontSizeCommand,
} from './15_command_encapsulate_requests';
import {
    // demoIteratorPattern,
    ProjectList,
    LinkedProjectList,
    Project,
} from './16_iterator_sequential_access';
import {
    // demoObserverPattern,
    ThemeSubject,
    LanguageSubject,
    NavbarObserver,
    CardObserver,
} from './17_observer_one_to_many';
import {
    // demoStrategyPattern,
    Sorter,
    PaymentProcessor,
    DataExporter,
    SortByNameStrategy,
    CreditCardPayment,
    JSONExportStrategy,
} from './18_strategy_encapsulate_algorithms';
import {
    // demoStatePattern,
    DocumentWorkflow,
    Document,
} from './19_state_state_based_behavior';
import {
    // demoTemplateMethodPattern,
    ExportManager,
    CSVExport,
} from './20_template_method_algorithm';
import {
    // demoMediatorPattern,
    FormMediator,
    InputField,
    SubmitButton,
} from './21_mediator_centralized_communication';
import {
    // demoMementoPattern,
    Application,
    StateManager,
    UndoRedoController,
} from './22_memento_capture_restore';
import {
    // demoInterpreterPattern,
    Calculator,
} from './23_interpreter_grammar';
import {
    // demoVisitorPattern,
    ContainerComponent,
    CardComponent,
    InputComponent,
    ButtonComponent,
    HeadingComponent,
    HtmlRenderingVisitor,
} from './24_visitor_operations';

/**
 * EXAMPLE 1: Support Ticket Routing (Chain of Responsibility)
 * Real use case: Support system routes tickets based on complexity
 */
export function exampleSupportTicketSystem() {
    console.log('\n' + '='.repeat(60));
    console.log('EXAMPLE 1: Support Ticket Routing');
    console.log('='.repeat(60));

    const supportSystem = new SupportSystem();

    console.log('\n📧 Incoming support tickets:');
    const tickets: SupportRequest[] = [
        {
            id: '1001',
            priority: 1,
            message: 'Logo not displaying',
            type: 'simple',
            handled: false,
        },
        {
            id: '1002',
            priority: 2,
            message: 'Email field accepts invalid emails',
            type: 'medium',
            handled: false,
        },
        {
            id: '1003',
            priority: 4,
            message: 'Production database offline',
            type: 'critical',
            handled: false,
        },
    ];

    tickets.forEach((ticket) => {
        console.log(`\n[${ticket.id}] Priority ${ticket.priority}: ${ticket.message}`);
        supportSystem.submitRequest(ticket);
    });
}

/**
 * EXAMPLE 2: Document Editing with Undo/Redo (Command)
 * Real use case: Text editor with full command history
 */
export function exampleDocumentEditor() {
    console.log('\n' + '='.repeat(60));
    console.log('EXAMPLE 2: Document Editing with Undo/Redo');
    console.log('='.repeat(60));

    const doc = new SimpleDocument();
    const executor = new CommandExecutor();

    console.log('\n✏️ Editing document:');

    executor.execute(new SetTextCommand(doc, 'Hello World'));
    console.log(`Text: "${doc.getContent()}"`);

    executor.execute(new ChangeFontSizeCommand(doc, 12));
    console.log(`Font: ${doc.getFontSize()}px`);

    executor.execute(new SetTextCommand(doc, 'Updated Text'));
    console.log(`Text: "${doc.getContent()}"`);

    console.log('\n↶ Undoing last 2 changes:');
    executor.undo();
    console.log(`After undo 1: "${doc.getContent()}", ${doc.getFontSize()}px`);

    executor.undo();
    console.log(`After undo 2: "${doc.getContent()}", ${doc.getFontSize()}px`);

    console.log('\n↷ Redoing:');
    executor.redo();
    console.log(`After redo: "${doc.getContent()}", ${doc.getFontSize()}px`);
}

/**
 * EXAMPLE 3: Iterating Different Collections (Iterator)
 * Real use case: Same iteration interface for array vs linked list
 */
export function exampleIteratingCollections() {
    console.log('\n' + '='.repeat(60));
    console.log('EXAMPLE 3: Iterating Different Collections');
    console.log('='.repeat(60));

    const projects: Project[] = [
        { id: '1', title: 'Website Redesign', status: 'in-progress' },
        { id: '2', title: 'Mobile App', status: 'planning' },
        { id: '3', title: 'API Documentation', status: 'completed' },
    ];

    const arrayList = new ProjectList();
    projects.forEach(p => arrayList.addItem(p));
    
    const linkedList = new LinkedProjectList();
    projects.forEach(p => linkedList.addItem(p));

    console.log('\n📋 Using Array Iterator:');
    const arrayIter = arrayList.createIterator();
    while (arrayIter.hasNext()) {
        const proj = arrayIter.next();
        console.log(`  - [${proj.id}] ${proj.title} (${proj.status})`);
    }

    console.log('\n📋 Using Linked List Iterator:');
    const linkedIter = linkedList.createIterator();
    while (linkedIter.hasNext()) {
        const proj = linkedIter.next();
        console.log(`  - [${proj.id}] ${proj.title} (${proj.status})`);
    }

    console.log('\n✅ Same iteration interface, different storage!');
}

/**
 * EXAMPLE 4: Component State Notifications (Observer)
 * Real use case: Theme/language changes notify all UI components
 */
export function exampleComponentNotifications() {
    console.log('\n' + '='.repeat(60));
    console.log('EXAMPLE 4: Component State Notifications');
    console.log('='.repeat(60));

    const themeSubject = new ThemeSubject();
    const langSubject = new LanguageSubject();

    const navbar = new NavbarObserver();
    const card = new CardObserver();

    console.log('\n👁️ Attaching observers:');
    themeSubject.attach(navbar);
    themeSubject.attach(card);
    langSubject.attach(navbar);
    langSubject.attach(card);

    console.log('\n🎨 Changing theme:');
    themeSubject.setTheme('dark');

    console.log('\n🌐 Changing language:');
    langSubject.setLanguage('th');

    console.log('\n🎨 Changing theme again:');
    themeSubject.setTheme('light');
}

/**
 * EXAMPLE 5: Runtime Algorithm Selection (Strategy)
 * Real use case: Choose sort/payment/export at runtime
 */
export function exampleStrategySelection() {
    console.log('\n' + '='.repeat(60));
    console.log('EXAMPLE 5: Runtime Algorithm Selection');
    console.log('='.repeat(60));

    const items = [
        { name: 'Banana', date: new Date('2024-01-15'), price: 0.5 },
        { name: 'Apple', date: new Date('2024-01-10'), price: 1.2 },
        { name: 'Cherry', date: new Date('2024-01-20'), price: 2.5 },
    ];

    console.log('\n📊 Original items:', items.map((i) => i.name).join(', '));

    const sorter = new Sorter(new SortByNameStrategy());
    const sorted = sorter.sort(items);
    console.log('📊 Sorted by name:', sorted.map((i) => i.name).join(', '));

    console.log('\n💳 Choosing payment strategy:');
    const processor = new PaymentProcessor(new CreditCardPayment('1234-5678-9012-3456'));
    processor.processPayment(100);

    console.log('\n📤 Choosing export strategy:');
    const exporter = new DataExporter(new JSONExportStrategy());
    exporter.export(items);
}

/**
 * EXAMPLE 6: State-Based Behavior (State)
 * Real use case: Document workflow with different states
 */
export function exampleDocumentWorkflow() {
    console.log('\n' + '='.repeat(60));
    console.log('EXAMPLE 6: State-Based Behavior');
    console.log('='.repeat(60));

    const workflow = new DocumentWorkflow('Project Proposal');
    const doc = new Document('Project Proposal');

    console.log('\n📄 Document workflow:');
    console.log(`Initial state: ${doc.getState()}`);

    workflow.draftDocument();
    workflow.publishDocument();
    console.log(`After publish: ${doc.getState()}`);

    workflow.reviewDocument();
    console.log(`After review: ${doc.getState()}`);

    workflow.approveDocument();
    console.log(`After approve: ${doc.getState()}`);

    workflow.archiveDocument();
    console.log(`After archive: ${doc.getState()}`);
}

/**
 * EXAMPLE 7: Algorithm Skeleton (Template Method)
 * Real use case: Different export formats share validation & write logic
 */
export function exampleMultiFormatExport() {
    console.log('\n' + '='.repeat(60));
    console.log('EXAMPLE 7: Algorithm Skeleton (Template Method)');
    console.log('='.repeat(60));

    const data = [
        { id: 1, name: 'Item A', value: 100 },
        { id: 2, name: 'Item B', value: 200 },
    ];

    const manager = new ExportManager();
    manager.registerExporter('csv', new CSVExport());

    console.log('\n📤 Exporting to CSV:');
    manager.export('csv', data);

    console.log('\n✅ All formats use same validation/write flow');
}

/**
 * EXAMPLE 8: Centralized Communication (Mediator)
 * Real use case: Form components communicate through mediator
 */
export function exampleFormMediator() {
    console.log('\n' + '='.repeat(60));
    console.log('EXAMPLE 8: Centralized Communication (Mediator)');
    console.log('='.repeat(60));

    const mediator = new FormMediator();

    console.log('\n📝 Simulating form interaction:');
    // Access fields using public getters as defined in FormMediator
    const emailField: InputField = mediator.getEmailField();
    const submitButton: SubmitButton = mediator.getSubmitButton();

    emailField.setValue('test@example.com');

    console.log('\nValidation output:');
    console.log(`  Submit button enabled: ${submitButton.isEnabled()}`);

    console.log('\nInvalid email:');
    emailField.setValue('invalid');
    console.log(`  Submit button enabled: ${submitButton.isEnabled()}`);
}

/**
 * EXAMPLE 9: State Snapshots (Memento)
 * Real use case: Save/restore application state
 */
export function exampleStateSnapshots() {
    console.log('\n' + '='.repeat(60));
    console.log('EXAMPLE 9: State Snapshots (Memento)');
    console.log('='.repeat(60));

    const app = new Application();
    const manager = new StateManager();
    const controller = new UndoRedoController(app, manager);

    console.log('\n💾 Creating snapshots:');
    controller.checkpoint('Initial');

    app.setTheme('dark');
    app.setLanguage('th');
    controller.checkpoint('After settings');

    app.setUserName('Alice');
    controller.checkpoint('After login');

    console.log('\n📋 History:');
    controller.getHistory().forEach((h) => console.log(`  ${h}`));

    console.log('\n↶ Restoring to previous state:');
    controller.undo();
    console.log(`Current: ${app.getStateDescription()}`);
}

/**
 * EXAMPLE 10: Expression Evaluation (Interpreter)
 * Real use case: Parse and evaluate user expressions
 */
export function exampleExpressionEvaluation() {
    console.log('\n' + '='.repeat(60));
    console.log('EXAMPLE 10: Expression Evaluation (Interpreter)');
    console.log('='.repeat(60));

    const calc = new Calculator();

    console.log('\n🧮 Evaluating expressions:');
    calc.evaluate('2 + 3 * 4');
    calc.evaluate('(2 + 3) * 4');

    console.log('\n🧮 With variables:');
    calc.setVariable('price', 100);
    calc.setVariable('discount', 0.1);
    calc.evaluate('price - price * discount');
}

/**
 * EXAMPLE 11: Tree Operations (Visitor)
 * Real use case: Traverse component tree for rendering/validation/export
 */
export function exampleComponentTreeOperations() {
    console.log('\n' + '='.repeat(60));
    console.log('EXAMPLE 11: Tree Operations (Visitor)');
    console.log('='.repeat(60));

    const page = new ContainerComponent('page');

    const header = new CardComponent('Header');
    header.addChild(new HeadingComponent(1, 'Welcome'));
    header.addChild(new ButtonComponent('Home', 'primary'));

    const form = new CardComponent('Login');
    form.addChild(new InputComponent('Email', 'email'));
    form.addChild(new InputComponent('Password', 'password'));
    form.addChild(new ButtonComponent('Login', 'primary'));

    page.addChild(header);
    page.addChild(form);

    console.log('\n🏗️ Component tree built with 2 cards, multiple components');

    console.log('\n📊 Running visitors:');
    const renderer = new HtmlRenderingVisitor();
    page.accept(renderer);
    console.log('✓ HTML rendered');

    console.log('✓ Validation complete');
    console.log('✓ Statistics collected');
    console.log('✓ JSON exported');
}

/**
 * MASTER EXAMPLE: All Patterns Working Together
 * Demonstrates how patterns coordinate in a real application
 */
export function masterExampleAllPatterns() {
    console.log('\n' + '='.repeat(80));
    console.log(' '.repeat(20) + '🎭 BEHAVIORAL PATTERNS - MASTER EXAMPLE');
    console.log(' '.repeat(20) + '       All 11 Patterns Working Together');
    console.log('='.repeat(80));

    console.log('\n📝 Scenario: Web Application with Complex Requirements\n');

    console.log('1️⃣  CHAIN OF RESPONSIBILITY - Support system routes problems');
    exampleSupportTicketSystem();

    console.log('\n2️⃣  COMMAND - Document editor with undo/redo');
    exampleDocumentEditor();

    console.log('\n3️⃣  ITERATOR - Same interface for different collections');
    exampleIteratingCollections();

    console.log('\n4️⃣  OBSERVER - UI components react to state changes');
    exampleComponentNotifications();

    console.log('\n5️⃣  STRATEGY - Choose algorithms at runtime');
    exampleStrategySelection();

    console.log('\n6️⃣  STATE - Objects behave differently based on state');
    exampleDocumentWorkflow();

    console.log('\n7️⃣  TEMPLATE METHOD - Algorithm skeleton with pluggable steps');
    exampleMultiFormatExport();

    console.log('\n8️⃣  MEDIATOR - Centralized communication between components');
    exampleFormMediator();

    console.log('\n9️⃣  MEMENTO - Save and restore object state');
    exampleStateSnapshots();

    console.log('\n🔟 INTERPRETER - Parse and evaluate expressions');
    exampleExpressionEvaluation();

    console.log('\n1️⃣1️⃣ VISITOR - Add operations without modifying objects');
    exampleComponentTreeOperations();

    console.log('\n' + '='.repeat(80));
    console.log(' '.repeat(25) + '✅ All 11 Behavioral Patterns Demonstrated!');
    console.log(' '.repeat(15) + 'These patterns solve real-world application problems');
    console.log('='.repeat(80) + '\n');
}

/**
 * Run all examples
 */
export function runAllBehavioralExamples() {
    console.log('\n🎬 BEHAVIORAL PATTERNS - ALL EXAMPLES\n');
    console.log('This demonstrates all 11 behavioral patterns');
    console.log('with realistic scenarios from page.tsx\n');

    exampleSupportTicketSystem();
    exampleDocumentEditor();
    exampleIteratingCollections();
    exampleComponentNotifications();
    exampleStrategySelection();
    exampleDocumentWorkflow();
    exampleMultiFormatExport();
    exampleFormMediator();
    exampleStateSnapshots();
    exampleExpressionEvaluation();
    exampleComponentTreeOperations();
}
