type NotifyLevel = 'SUCCESS' | 'WARNING' | 'INFO' | 'ERROR';

type NotifyFn = (message: string, level: NotifyLevel) => void;

interface IMediator {
  notify(sender: object, event: string): void;
}

class BaseComponent {
  protected mediator: IMediator;

  constructor(mediator?: IMediator) {
    this.mediator = mediator!;
  }

  setMediator(mediator: IMediator) {
    this.mediator = mediator;
  }
}

class ContactInput extends BaseComponent {
  constructor(public value = '', public name: string) {
    super();
  }

  setValue(value: string) {
    this.value = value;
    this.mediator.notify(this, 'change');
  }
}

class ContactButton extends BaseComponent {
  public disabled = true;

  click() {
    if (!this.disabled) this.mediator.notify(this, 'click');
  }

  setDisabled(isDisabled: boolean) {
    this.disabled = isDisabled;
  }
}

export interface ContactFormState {
  email: string;
  message: string;
  isSubmitDisabled: boolean;
}

export class ContactFormMediator implements IMediator {
  public email: ContactInput;
  public message: ContactInput;
  public submitButton: ContactButton;

  constructor(
    private readonly uiUpdater: (state: ContactFormState) => void,
    private readonly notifier: NotifyFn,
  ) {
    this.email = new ContactInput('', 'email');
    this.email.setMediator(this);

    this.message = new ContactInput('', 'message');
    this.message.setMediator(this);

    this.submitButton = new ContactButton();
    this.submitButton.setMediator(this);
  }

  notify(sender: object, event: string): void {
    if (event === 'change') {
      const isEmailValid = this.email.value.includes('@') && this.email.value.includes('.');
      const isMessageValid = this.message.value.length >= 10;
      this.submitButton.setDisabled(!(isEmailValid && isMessageValid));
      this.syncState();
    }

    if (event === 'click') {
      this.notifier('Sending Message...', 'INFO');
      setTimeout(() => {
        this.notifier('Message Sent Successfully!', 'SUCCESS');
        this.email.value = '';
        this.message.value = '';
        this.submitButton.setDisabled(true);
        this.syncState();
      }, 1500);
    }
  }

  private syncState() {
    this.uiUpdater({
      email: this.email.value,
      message: this.message.value,
      isSubmitDisabled: this.submitButton.disabled,
    });
  }
}
