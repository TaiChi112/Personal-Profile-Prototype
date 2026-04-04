/**
 * MEDIATOR PATTERN - Centralized Communication
 * 
 * Problem: page.tsx components communicate directly, creating tight coupling
 *          - Input updates value and triggers validation
 *          - Validation updates error display
 *          - Form state updates submit button
 *          - Multiple dependencies and circular references
 * 
 * Solution: Introduce mediator that handles all communication
 *          Components only talk to mediator, not each other
 */

// ====================================
// TYPE DEFINITIONS
// ====================================

export type ColleagueEventData = string | boolean | { isValid: boolean; error: string } | undefined;

// ====================================
// MEDIATOR INTERFACE
// ====================================

export interface Mediator {
  notify(sender: Colleague, event: string, data?: ColleagueEventData): void;
}

// ====================================
// COLLEAGUE (COMPONENT) INTERFACE
// ====================================

export abstract class Colleague {
  protected mediator: Mediator;
  protected name: string;

  constructor(mediator: Mediator, name: string) {
    this.mediator = mediator;
    this.name = name;
  }

  getName(): string {
    return this.name;
  }

  abstract handleEvent(event: string, data?: ColleagueEventData): void;
}

// ====================================
// CONCRETE COLLEAGUES
// ====================================

/**
 * Input field colleague
 */
export class InputField extends Colleague {
  private value: string = '';

  handleEvent(event: string, data?: ColleagueEventData): void {
    if (event === 'input') {
      this.value = (data as string) || '';
      console.log(`[${this.name}] Input changed: "${this.value}"`);
      // Notify mediator about the change
      this.mediator.notify(this, 'valueChanged', this.value);
    }
  }

  setValue(value: string): void {
    this.value = value;
    this.mediator.notify(this, 'valueChanged', value);
  }

  getValue(): string {
    return this.value;
  }

  reset(): void {
    this.value = '';
    console.log(`[${this.name}] Reset`);
  }
}

/**
 * Validator colleague
 */
export class Validator extends Colleague {
  private isValid: boolean = true;
  private errorMessage: string = '';

  handleEvent(event: string, data?: ColleagueEventData): void {
    if (event === 'validate') {
      const value = data as string;
      this.isValid = this.performValidation(value);
      this.errorMessage = this.isValid ? '' : 'Invalid input';
      console.log(`[${this.name}] Validation: ${this.isValid ? '✓ Valid' : '✗ Invalid'}`);
      // Notify mediator about validation result
      this.mediator.notify(this, 'validationComplete', {
        isValid: this.isValid,
        error: this.errorMessage,
      });
    }
  }

  private performValidation(value: string): boolean {
    return value.length > 0 && value.length <= 50;
  }

  isInputValid(): boolean {
    return this.isValid;
  }

  getError(): string {
    return this.errorMessage;
  }
}

/**
 * Display colleague - shows errors
 */
export class ErrorDisplay extends Colleague {
  private message: string = '';

  handleEvent(event: string, data?: ColleagueEventData): void {
    if (event === 'displayError') {
      this.message = (data as string) || '';
      if (this.message) {
        console.log(`[${this.name}] Error: ${this.message}`);
      } else {
        console.log(`[${this.name}] Error cleared`);
      }
    }
  }

  setError(message: string): void {
    this.message = message;
  }

  getError(): string {
    return this.message;
  }

  clearError(): void {
    this.message = '';
  }
}

/**
 * Button colleague - submit button
 */
export class SubmitButton extends Colleague {
  private enabled: boolean = false;

  handleEvent(event: string, data?: ColleagueEventData): void {
    if (event === 'enableButton') {
      this.enabled = data === true;
      console.log(`[${this.name}] ${this.enabled ? '✓ Enabled' : '✗ Disabled'}`);
    }
  }

  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  click(): void {
    if (this.enabled) {
      console.log(`[${this.name}] Clicked - Submitting form...`);
      this.mediator.notify(this, 'submit');
    } else {
      console.log(`[${this.name}] Cannot click - disabled`);
    }
  }
}

// ====================================
// CONCRETE MEDIATOR
// ====================================

/**
 * Form mediator - orchestrates form components
 */
export class FormMediator implements Mediator {
  private inputField: InputField;
  private validator: Validator;
  private errorDisplay: ErrorDisplay;
  private submitButton: SubmitButton;

  constructor() {
    this.inputField = new InputField(this, 'Input');
    this.validator = new Validator(this, 'Validator');
    this.errorDisplay = new ErrorDisplay(this, 'ErrorDisplay');
    this.submitButton = new SubmitButton(this, 'SubmitButton');
  }

  notify(sender: Colleague, event: string, data?: ColleagueEventData): void {
    if (sender === this.inputField && event === 'valueChanged') {
      // Input changed - validate it
      console.log('[Mediator] Processing input change...');
      this.validator.handleEvent('validate', data);
    } else if (sender === this.validator && event === 'validationComplete') {
      // Validation complete - update UI
      console.log('[Mediator] Processing validation result...');
      const { isValid, error } = data as { isValid: boolean; error: string };
      this.errorDisplay.handleEvent('displayError', isValid ? '' : error);
      this.submitButton.handleEvent('enableButton', isValid);
    } else if (sender === this.submitButton && event === 'submit') {
      // Submit button clicked
      console.log('[Mediator] Form submitted!');
      this.submitForm();
    }
  }

  private submitForm(): void {
    const value = this.inputField.getValue();
    console.log(`\n✓ Form submission successful: "${value}"`);
    this.inputField.reset();
    this.errorDisplay.clearError();
    this.submitButton.setEnabled(false);
  }

  /**
   * Public API for form
   */
  setInputValue(value: string): void {
    this.inputField.setValue(value);
  }

  getInputValue(): string {
    return this.inputField.getValue();
  }

  submit(): void {
    this.submitButton.click();
  }

  getEmailField(): InputField {
    return this.inputField;
  }

  getSubmitButton(): SubmitButton {
    return this.submitButton;
  }

  getComponents() {
    return {
      input: this.inputField,
      validator: this.validator,
      errorDisplay: this.errorDisplay,
      submitButton: this.submitButton,
    };
  }
}

// ====================================
// DEMO
// ====================================

export function demoMediatorPattern() {
  console.log('\n🤝 MEDIATOR PATTERN - Centralized Communication\n');

  const form = new FormMediator();

  console.log('📝 Form Interaction Simulation:\n');

  // User types something invalid
  console.log('User input: "x" (too short)\n');
  form.setInputValue('x');

  // Try to submit (should be disabled)
  console.log('\nUser clicks submit:\n');
  form.submit();

  // User types valid input
  console.log('\n\nUser input: "Hello World" (valid)\n');
  form.setInputValue('Hello World');

  // Submit now works
  console.log('\nUser clicks submit:\n');
  form.submit();

  console.log('\n✅ Mediator Pattern Benefits:');
  console.log('  ✓ Centralize complex communication');
  console.log('  ✓ Decouple colleagues from each other');
  console.log('  ✓ Reusable mediator for multiple sets of colleagues');
  console.log('  ✓ Easy to understand and modify communication logic');
  console.log('  ✓ Single point of control for interactions');
}
