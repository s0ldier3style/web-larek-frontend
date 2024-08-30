import { IProductCard, CategoryType } from './../../../types/index';
import { Component } from '../../base/Component';
import { ensureElement } from '../../../utils/utils';
import { IEvents } from '@/components/base/EventEmitter';

export interface IActions {
	onClick: (event: MouseEvent) => void;
}

export class Card extends Component<IProductCard> {
	protected _category: HTMLElement;
	protected _title: HTMLElement;
	protected _image: HTMLImageElement;
	protected _price: HTMLElement;
	protected _id: string;
	protected _priceValue: number | null;

	constructor(
		protected blockName: string,
		container: HTMLElement,
		protected events: IEvents,
		actions?: IActions
	) {
		super(container);

		this._category = ensureElement<HTMLElement>(
			`.${blockName}__category`,
			container
		);
		this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
		this._image = ensureElement<HTMLImageElement>(
			`.${blockName}__image`,
			container
		);

		this._price = ensureElement<HTMLElement>(`.${blockName}__price`, container);

		if (actions?.onClick) {
			this.container.addEventListener('click', actions.onClick);
		}
	}

	set id(value: string) {
		this._id = value;
		this.container.dataset.id = value;
	}

	get id(): string {
		return this.container.dataset.id || '';
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	get title(): string {
		return this._title.textContent || '';
	}

	set image(value: string) {
		this.setImage(this._image, value, this.title);
	}

	set price(value: number | null) {
		this._priceValue = value;
		const priceText = value !== null ? value.toString() + ' синапсов' : 'Бесценно';
		this.setText(this._price, priceText)
	}

	get price(): number | null {
		return this._priceValue;
	}

	set category(value: CategoryType) {
		this.setText(this._category, value);
		if (value === 'софт-скил') {
			this._category.classList.add('card__category_soft');
		}
		if (value === 'другое') {
			this._category.classList.add('card__category_other');
		}
		if (value === 'дополнительное') {
			this._category.classList.add('card__category_additional');
		}
		if (value === 'хард-скил') {
			this._category.classList.add('card__category_hard');
		}
		if (value === 'кнопка') {
			this._category.classList.add('card__category__button');
		}
	}
}

export class CardPreview extends Card {
	protected _description: HTMLElement;
	protected _button: HTMLButtonElement;

	constructor(container: HTMLElement, events: IEvents) {
		super('card', container, events);
		this._description = ensureElement<HTMLElement>(
			`.${this.blockName}__text`,
			container
		);
		this._button = ensureElement<HTMLButtonElement>(
			`.${this.blockName}__button`,
			container
		);

		this._button.addEventListener('click', () => {
			this.events.emit('card:addtobasket', {
				id: this.id,
				title: this.title,
				price: this.price,
			});
		});
	}

	set selected(value: boolean) {
		this.setDisabled(this._button, value)
	}

	set description(value: string) {
		this.setText(this._description, value)
	}

	get description() {
		return this._description.textContent || '';
	}
}