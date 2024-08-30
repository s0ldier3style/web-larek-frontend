import { IOrderForm } from '../../../types/index';
import { IEvents } from '..//../base/EventEmitter';
import { Form } from './Form';

export class FormContacts extends Form<IOrderForm> {
	constructor(protected container: HTMLFormElement, protected events: IEvents) {
		super(container, events);
	}

	set email(value: string) {
		(this.container.elements.namedItem('email') as HTMLInputElement).value =
			value;
	}

	set phone(value: string) {
		(this.container.elements.namedItem('phone') as HTMLInputElement).value =
			value;
	}
}