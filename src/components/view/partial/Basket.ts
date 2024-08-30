import { IBasketCard, IActions } from './../../../types/index';
import { Component } from '../../base/Component';
import { ensureElement, createElement, formatNumber } from'../../../utils/utils';
import { EventEmitter } from '../../base/EventEmitter';

export class CardBasket extends Component<IBasketCard> {
	protected _title: HTMLElement;
	protected _index: HTMLElement;
	protected _price: HTMLElement;
	protected _deleteButton: HTMLButtonElement;

	constructor(
		protected blockName: string,
		container: HTMLElement,
		actions?: IActions
	) {
		super(container);

		this._title = ensureElement<HTMLElement>(
			`.${blockName}__title`,
			this.container
		);
		this._index = ensureElement<HTMLElement>(
			`.basket__item-index`,
			this.container
		);
		this._price = ensureElement<HTMLElement>(
			`.${blockName}__price`,
			this.container
		);
		this._deleteButton = ensureElement<HTMLButtonElement>(
			`.${blockName}__button`,
			this.container
		);

		this._deleteButton.addEventListener('click', actions.onClick);
	}

	set index(value: number) {
		this.setText(this._index, value.toString());
	}

	set title(value: string) {
		this.setText(this._title, value);
	}
	set price(value: number | null) {
		const priceText = value !== null ? value.toString() : 'Бесценно';
		this.setText(this._price, priceText);
	}

	set id(id: string) {
		this.id = id;
	}
}

export interface IBasket {
	basketList: HTMLElement[];
	total: number;
	button: HTMLButtonElement;
}

export class Basket extends Component<IBasket> {
	protected basketList: HTMLElement;
	protected total: HTMLElement;
	protected button: HTMLButtonElement;

	constructor(container: HTMLElement, protected events: EventEmitter) {
		super(container);

		this.basketList = ensureElement<HTMLElement>(
			'.basket__list',
			this.container
		);
		this.total = ensureElement<HTMLElement>('.basket__price', this.container);
		this.button = ensureElement<HTMLButtonElement>(
			'.basket__button',
			this.container
		);

		this.button.addEventListener('click', () => {
			events.emit('orderform:open');
		});

		this.items = [];
	}

	set items(items: HTMLElement[]) {
		if (items.length) {
			this.basketList.replaceChildren(...items);
		} else {
			this.basketList.replaceChildren(
				createElement<HTMLParagraphElement>('p', {
					textContent: 'Корзина пуста',
				})
			);
		}
	}

	set selected(items: string[]) {
		if (items.length) {
			this.setDisabled(this.button, false);
		} else {
			this.setDisabled(this.button, true);
		}
	}

	disableButton() {
		this.setDisabled(this.button, true);
	}

	undisableButton() {
		this.setDisabled(this.button, false);
	}

	set totalPrice(total: number) {
		this.setText(this.total, `${formatNumber(total)} синапсов`);
	}

	getContainer(): HTMLElement {
		return this.container;
	}
}