import { Component } from '../../base/Component';
import { ensureElement, formatNumber } from '../../../utils/utils'
import { IEvents } from './../../base/EventEmitter';

interface ISuccess {
	total: number;
}

export class Success extends Component<ISuccess> {
	protected _buttonclose: HTMLElement;
	protected _description: HTMLElement;

	constructor(container: HTMLElement, events: IEvents) {
		super(container);
		this._buttonclose = ensureElement<HTMLElement>(
			'.order-success__close',
			this.container
		);
		this._description = ensureElement<HTMLElement>(
			'.order-success__description',
			this.container
		);

		this._buttonclose.addEventListener('click', () => {
			events.emit('sucess:close');
		});
	}

	set total(value: number) {
    this.setText(this._description, `Списано ${formatNumber(value)} синапсов`);
  }
}