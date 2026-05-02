#!/bin/bash
# QUICK REFERENCE - ALL 23 DESIGN PATTERNS

# ============================================================================
# 🎯 RUN EXAMPLES
# ============================================================================

# Run all creational pattern examples
bun -e "import { runAllExamples } from './src/patterns/USAGE_EXAMPLES'; runAllExamples()"

# Run all structural pattern examples
bun -e "import { runAllStructuralExamples } from './src/patterns/STRUCTURAL_EXAMPLES'; runAllStructuralExamples()"

# Run all behavioral pattern examples
bun -e "import { runAllBehavioralExamples } from './src/patterns/BEHAVIORAL_EXAMPLES'; runAllBehavioralExamples()"

# ============================================================================
# 🧪 RUN TESTS
# ============================================================================

# Test creational patterns
bun test src/patterns/TESTS.ts

# Test structural patterns
bun test src/patterns/STRUCTURAL_TESTS.ts

# Test behavioral patterns
bun test src/patterns/BEHAVIORAL_TESTS.ts

# Test all patterns
bun test src/patterns/

# ============================================================================
# 📚 VIEW DOCUMENTATION
# ============================================================================

# Print all pattern summaries
bun -e "import { printAllPatternsSummary } from './src/patterns/index'; printAllPatternsSummary()"

# Print quick reference
bun -e "import { PATTERNS_QUICK_REFERENCE } from './src/patterns/index'; console.log(JSON.stringify(PATTERNS_QUICK_REFERENCE, null, 2))"

# ============================================================================
# 📥 IMPORT PATTERNS IN YOUR CODE
# ============================================================================

# Creational patterns
import {
  NotificationService,           # Singleton: notification manager
  CommandHistory,                # Singleton: undo/redo history
  LOCALES,                        # Factory: language labels
  STYLES,                         # Abstract Factory: theme families
  ContentBuilder,                 # Builder: content tree construction
  ProjectTemplate,                # Prototype: template cloning
} from './patterns/index'

# Structural patterns
import {
  ComponentManager,               # Adapter: unify component APIs
  ThemePalette,                   # Bridge: theme × renderer
  NavTreeBuilder,                 # Composite: navigation tree
  ComponentDecorator,             # Decorator: feature composition
  ApplicationFacade,              # Facade: simplified API
  LazyLoadingProxy,               # Proxy: lazy loading
  CardFlyweightFactory,           # Flyweight: memory efficiency
} from './patterns/index'

# Behavioral patterns
import {
  SupportSystem,                  # Chain of Responsibility
  CommandExecutor,                # Command: undo/redo
  ProjectList,                    # Iterator: collection traversal
  ThemeSubject,                   # Observer: state notifications
  Sorter,                         # Strategy: algorithm selection
  DocumentWorkflow,               # State: state machine
  DataExportTemplate,             # Template Method: skeleton
  FormMediator,                   # Mediator: coordination
  StateManager,                   # Memento: snapshots
  Calculator,                     # Interpreter: expression parser
  ContainerComponent,             # Visitor: tree operations
} from './patterns/index'

# ============================================================================
# 🔨 CREATIONAL PATTERNS - QUICK EXAMPLES
# ============================================================================

# 1. SINGLETON - NotificationService
import { NotificationService } from './patterns/index'
const notify = NotificationService.getInstance()
notify.notify('Welcome!', 'SUCCESS')

# 2. FACTORY METHOD - Localization
import { LOCALES } from './patterns/index'
const enLabels = LOCALES['en'].getLabels()
const thLabels = LOCALES['th'].getLabels()

# 3. ABSTRACT FACTORY - Styles
import { STYLES } from './patterns/index'
const modernButtons = STYLES['modern'].getButtonClass('primary')
const futureButtons = STYLES['future'].getButtonClass('primary')

# 4. BUILDER - ContentTree
import { ContentBuilder } from './patterns/index'
const tree = new ContentBuilder('root', 'grid', 'Root')
  .addContainer('group', 'list')
  .addItem({ id: 1, name: 'Item 1' })
  .up()
  .build()

# 5. PROTOTYPE - Templates
import { ProjectTemplate, ProjectTemplateRegistry } from './patterns/index'
const registry = new ProjectTemplateRegistry()
const template = registry.get('ecommerce')
const clone = template.clone() // New ID

# ============================================================================
# 🏗️ STRUCTURAL PATTERNS - QUICK EXAMPLES
# ============================================================================

# 7. ADAPTER - ComponentManager
import { ComponentManager } from './patterns/index'
const manager = new ComponentManager()
manager.registerComponent(reactComponent)
manager.registerComponent(htmlElement)

# 8. BRIDGE - ThemePalette
import { ThemePalette } from './patterns/index'
const palette = new ThemePalette()
const bridge = palette.createBridge('modern', 'web')

# 9. COMPOSITE - Navigation
import { NavTreeBuilder } from './patterns/index'
const nav = new NavTreeBuilder()
  .addItem({ id: 'home', label: 'Home' })
  .addGroup('Projects', [...])
  .build()

# 10. DECORATOR - Features
import { WithTooltip, WithAnimation } from './patterns/index'
const enhanced = new WithTooltip(
  new WithAnimation(
    new Button('Click me')
  )
)

# 11. FACADE - SimplifiedAPI
import { ApplicationFacade } from './patterns/index'
const app = new ApplicationFacade()
app.changeTheme('dark')      # Hides complexity
app.changeLanguage('th')

# 12. PROXY - LazyLoading
import { LazyLoadingProxy } from './patterns/index'
const image = new LazyLoadingProxy(() => new HeavyImage(...))
image.render() # Only loads when rendered

# 13. FLYWEIGHT - Memory Efficiency
import { CardFlyweightFactory } from './patterns/index'
const fw = factory.getFlyweight('project')
fw.render(data1, renderer)
fw.render(data2, renderer) # Same flyweight

# ============================================================================
# 🎭 BEHAVIORAL PATTERNS - QUICK EXAMPLES
# ============================================================================

# 14. CHAIN OF RESPONSIBILITY
import { SupportSystem } from './patterns/index'
const system = new SupportSystem()
system.handleRequest({ priority: 'high', ... })

# 15. COMMAND - Undo/Redo
import { CommandExecutor, SetTextCommand } from './patterns/index'
const executor = new CommandExecutor(document)
executor.execute(new SetTextCommand(doc, 'text'))
executor.undo()

# 16. ITERATOR - Collections
import { ProjectList } from './patterns/index'
const list = new ProjectList(projects)
const iter = list.createIterator()
while(iter.hasNext()) { const p = iter.next() }

# 17. OBSERVER - Pub/Sub
import { ThemeSubject } from './patterns/index'
const subject = new ThemeSubject()
subject.attach(observer)
subject.setTheme('dark') # Notifies all

# 18. STRATEGY - Algorithm Selection
import { Sorter, SortByNameStrategy } from './patterns/index'
const sorter = new Sorter(new SortByNameStrategy())
const sorted = sorter.sort(items)

# 19. STATE - State Machine
import { Document, DocumentWorkflow } from './patterns/index'
const workflow = new DocumentWorkflow()
workflow.publish(doc)  # Changes state

# 20. TEMPLATE METHOD - Skeleton
import { CSVExport } from './patterns/index'
new CSVExport().export(data) # Uses template method

# 21. MEDIATOR - Coordination
import { FormMediator } from './patterns/index'
const mediator = new FormMediator()
const field = mediator.getInputField('email')
field.setValue('test@example.com')

# 22. MEMENTO - Snapshots
import { Application, UndoRedoController, StateManager } from './patterns/index'
const app = new Application()
const manager = new StateManager()
const controller = new UndoRedoController(app, manager)
controller.checkpoint('Before')
app.setTheme('dark')
controller.undo() # Restore

# 23. INTERPRETER - Expression Parser
import { Calculator } from './patterns/index'
const calc = new Calculator()
calc.setVariable('price', 100)
const total = calc.evaluate('price * 1.1')

# 24. VISITOR - Tree Operations
import { HtmlRenderingVisitor, ContainerComponent } from './patterns/index'
const renderer = new HtmlRenderingVisitor()
component.accept(renderer)
const html = renderer.getHtml()

# ============================================================================
# 📊 KEY STATISTICS
# ============================================================================

Total Patterns:         23 (+ 1 variant = 24)
Pattern Files:          24
Support Files:          7 (index, README, tests, examples, etc)
Total Lines:            13,700+
Total Classes:          100+
Total Interfaces:       30+
Test Cases:             140+
Examples:               34

# ============================================================================
# 📁 FILE LOCATIONS
# ============================================================================

All patterns:           src/patterns/
Creational:             01-06_*.ts
Structural:             07-13_*.ts
Behavioral:             14-24_*.ts
Examples:               USAGE_EXAMPLES.ts (creational)
                        STRUCTURAL_EXAMPLES.ts
                        BEHAVIORAL_EXAMPLES.ts
Tests:                  TESTS.ts (creational)
                        STRUCTURAL_TESTS.ts
                        BEHAVIORAL_TESTS.ts
Documentation:          index.ts
                        README_PATTERNS.ts
                        PATTERNS_COMPLETE.md
                        COMPLETION_SUMMARY.txt

# ============================================================================
# ✨ HELPFUL COMMANDS
# ============================================================================

# List all patterns
ls -la src/patterns/*.ts | grep -E "0[1-9]|1[0-9]|2[0-4]"

# Count lines of code
wc -l src/patterns/*.ts

# Find pattern by name
grep -l "export.*class.*ClassName" src/patterns/*.ts

# Find imports to use pattern
grep "^export" src/patterns/XXX_pattern_name.ts

# Run specific test
bun test src/patterns/BEHAVIORAL_TESTS.ts --test-name-pattern "Iterator"

# ============================================================================
