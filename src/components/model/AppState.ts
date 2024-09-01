import { Model } from '../base/Model';
import {
	IAppState,
	IProductCard,
	IFormError,
	TPayment,
	IOrder,
	IOrderForm,
} from '../../types/index';

enum OrderError {
	PAYMENT = 'Необходимо указать способ оплаты',
	ADDRESS = 'Необходимо указать адрес',
}

enum ContactError {
	EMAIL = 'Необходимо указать email',
	PHONE = 'Необходимо указать телефон',
}


export class AppState extends Model<IAppState> {
	//каталог со всеми товарами
	protected catalog: IProductCard[];
	//каталог с купленными товарами
	protected basket: IProductCard[] = [];
	//заказ клиента
	order: IOrder = {
		address: '',
		payment: 'Online',
		email: '',
		total: 0,
		phone: '',
		items: [],
	};

	protected formErrors: IFormError = {};

	setCatalog(items: IProductCard[]) {
		this.catalog = items.map((item) => {
			// Если цена равна null, устанавливаем selected в true
			if (item.price === null) {
				item.selected = true;
			}
			return item;
		});
		this.emitChanges('items:changed', { catalog: this.catalog });
	}

	//получение каталога
	getCatalog(): IProductCard[] {
		return this.catalog;
	}
	//получение карточки продукта
	getProduct(id: string): IProductCard {
		return this.catalog.find((item) => item.id === id);
	}

	//добавление товара в корзину
	addItemToBasket(item: IProductCard) {
		this.basket.push(item);
	}

	//удаление товара из корзины
	removeFromBasket(id: string) {
		this.basket = this.basket.filter((item) => item.id !== id);
		this.emitChanges('basket:changed', { basket: this.basket });
	}

	//очистка корзины
	clearBasket() {
		this.basket = [];
		this.emitChanges('basket:changed', { basket: this.basket });
	}

	//вывод итоговой стоимости
	getTotalPrice() {
		return this.basket.reduce((total, item) => {
			return total + (item.price || 0);
		}, 0);
	}

	//вывод количества товаров находящихся в корзине
	getBasketQuantity() {
		return this.basket.length;
	}

	//вывод товаров находящихся в корзине
	getBasketList(): IProductCard[] {
		return this.basket;
	}

	//методы предназначен для установки значений в объекте заказа order и валидации введенных данных.
	setOrderField(field: keyof IOrderForm, value: string) {
		if (field === 'payment') {
			this.order[field] = value as TPayment;
		} else {
			this.order[field] = value;
		}

		if (this.validateForms()) {
			this.events.emit('order:ready', this.order);
		}
	}

	setContactField(field: keyof IOrderForm, value: string) {
		if (field !== 'payment') {
			this.order[field] = value;
		}

		console.log('state emit: ', field, value);
		if (this.validateForms()) {
			this.events.emit('contacts:ready', this.order);
		}
	}

	// валидация форм
	validateForms() {
		const errors: typeof this.formErrors = {};

		if (!this.order.payment) {
			errors.payment = OrderError.PAYMENT;
		}

		if (!this.order.address) {
			errors.address = OrderError.ADDRESS;
		}

		if (!this.order.email) {
			errors.email = ContactError.EMAIL;
		}

		if (!this.order.phone) {
			errors.phone = ContactError.PHONE;
		}

		this.formErrors = errors;
		this.events.emit('formErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}

	//очистка
	clearOrder() {
		this.order = {
			address: '',
			payment: 'Online',
			email: '',
			total: 0,
			phone: '',
			items: [],
		};
	}
}