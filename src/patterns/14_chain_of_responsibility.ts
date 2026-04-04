/**
 * CHAIN OF RESPONSIBILITY PATTERN - Request Handler Chain
 * 
 * Problem: page.tsx has support tickets that need different handlers
 *          - Simple tickets → automated response
 *          - Medium tickets → team lead
 *          - Complex tickets → manager
 *          - Don't want client to know who handles what
 * 
 * Solution: Create chain of handlers, pass request down until handled
 *          Each handler decides: handle or pass to next
 */

// ====================================
// HANDLER INTERFACE
// ====================================

export interface SupportRequest {
  id: string;
  type: 'simple' | 'medium' | 'complex' | 'critical';
  message: string;
  priority: number;
  handled: boolean;
}

export interface RequestHandler {
  setNext(handler: RequestHandler): RequestHandler;
  handle(request: SupportRequest): SupportRequest;
  getName(): string;
}

// ====================================
// ABSTRACT HANDLER
// ====================================

export abstract class SupportHandler implements RequestHandler {
  protected nextHandler: RequestHandler | null = null;
  protected abstract requiredLevel: number;

  setNext(handler: RequestHandler): RequestHandler {
    this.nextHandler = handler;
    return handler;
  }

  handle(request: SupportRequest): SupportRequest {
    if (this.canHandle(request)) {
      console.log(`[${this.getName()}] Handling request #${request.id}: ${request.message}`);
      request.handled = true;
      return request;
    }

    if (this.nextHandler) {
      console.log(`[${this.getName()}] Passing to next handler`);
      return this.nextHandler.handle(request);
    }

    console.log(`[${this.getName()}] End of chain - request not handled`);
    return request;
  }

  protected canHandle(request: SupportRequest): boolean {
    return request.priority >= this.requiredLevel;
  }

  abstract getName(): string;
}

// ====================================
// CONCRETE HANDLERS
// ====================================

export class AutomatedHandler extends SupportHandler {
  protected requiredLevel = 1;

  getName(): string {
    return 'Automated System';
  }

  handle(request: SupportRequest): SupportRequest {
    if (request.type === 'simple' && this.canHandle(request)) {
      console.log(`[${this.getName()}] ✓ Auto-responding to simple request`);
      request.handled = true;
      return request;
    }
    return super.handle(request);
  }
}

export class TeamLeadHandler extends SupportHandler {
  protected requiredLevel = 2;

  getName(): string {
    return 'Team Lead';
  }

  handle(request: SupportRequest): SupportRequest {
    if (request.type === 'medium' && this.canHandle(request)) {
      console.log(`[${this.getName()}] ✓ Team Lead assigned to request`);
      request.handled = true;
      return request;
    }
    return super.handle(request);
  }
}

export class ManagerHandler extends SupportHandler {
  protected requiredLevel = 3;

  getName(): string {
    return 'Manager';
  }

  handle(request: SupportRequest): SupportRequest {
    if (request.type === 'complex' && this.canHandle(request)) {
      console.log(`[${this.getName()}] ✓ Manager reviewing complex request`);
      request.handled = true;
      return request;
    }
    return super.handle(request);
  }
}

export class ExecutiveHandler extends SupportHandler {
  protected requiredLevel = 4;

  getName(): string {
    return 'Executive';
  }

  handle(request: SupportRequest): SupportRequest {
    if (request.type === 'critical' && this.canHandle(request)) {
      console.log(`[${this.getName()}] ✓ Executive handling critical request`);
      request.handled = true;
      return request;
    }

    // Executive is last in chain
    if (this.nextHandler) {
      return this.nextHandler.handle(request);
    }

    console.log(`[${this.getName()}] Request escalated to maximum level`);
    request.handled = true;
    return request;
  }
}

// ====================================
// SUPPORT SYSTEM - Sets up chain
// ====================================

export class SupportSystem {
  private handlerChain: RequestHandler;

  constructor() {
    // Build chain: Automated → Team Lead → Manager → Executive
    const automated = new AutomatedHandler();
    const teamLead = new TeamLeadHandler();
    const manager = new ManagerHandler();
    const executive = new ExecutiveHandler();

    automated.setNext(teamLead).setNext(manager).setNext(executive);
    this.handlerChain = automated;
  }

  submitRequest(request: SupportRequest): SupportRequest {
    console.log(`\n📧 Submitting request: ${request.message}`);
    return this.handlerChain.handle(request);
  }
}

// ====================================
// DEMO
// ====================================

export function demoChainOfResponsibility() {
  console.log('\n⛓️  CHAIN OF RESPONSIBILITY - Request Handler Chain\n');

  const system = new SupportSystem();

  const requests: SupportRequest[] = [
    {
      id: '1',
      type: 'simple',
      message: 'How do I reset my password?',
      priority: 1,
      handled: false,
    },
    {
      id: '2',
      type: 'medium',
      message: 'Billing issue with my account',
      priority: 2,
      handled: false,
    },
    {
      id: '3',
      type: 'complex',
      message: 'Custom integration needed',
      priority: 3,
      handled: false,
    },
    {
      id: '4',
      type: 'critical',
      message: 'System outage affecting production',
      priority: 4,
      handled: false,
    },
  ];

  console.log('📨 Processing support requests:\n');
  const results = requests.map((req) => system.submitRequest(req));

  console.log('\n📊 Results:');
  results.forEach((result) => {
    console.log(`  Request #${result.id}: ${result.handled ? '✓ Handled' : '✗ Not handled'}`);
  });

  console.log('\n✅ Chain of Responsibility Benefits:');
  console.log('  ✓ Decouple sender from handlers');
  console.log('  ✓ Multiple objects can handle request');
  console.log('  ✓ Add/remove handlers without changing client');
  console.log('  ✓ Handler decides: process or forward');
}
