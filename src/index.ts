import './scss/styles.scss';
import { ApiListResponse } from './components/base/Api';
import { API_URL, CDN_URL } from './utils/constants';
import { OrderApi, ProductApi } from './components/view/ProductApi';
import { cloneTemplate, ensureElement } from './utils/utils';
import { IOrderForm, IOrderModelPost, IProductCard } from './types/index';
import { EventEmitter } from './components/base/EventEmitter';
import { AppState } from './components/model/AppState';
import { Page } from './components/view/partial/Page';
import { Modal } from './components/view/common/Modal';
import { Card, CardPreview } from './components/view/partial/Card';
import { CardBasket, Basket } from './components/view/partial/Basket';
import { FormOrder } from './components/view/screen/FormOrder';
import { FormContacts } from './components/view/screen/FormContacts';
import { Success } from './components/view/screen/Success';
import { IBasketRemoveItem } from './types/index';

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const formOrderTempalte = ensureElement<HTMLTemplateElement>('#order');
const formContactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

const events = new EventEmitter();

const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

const basket = new Basket(cloneTemplate(basketTemplate), events);
const orderForm = new FormOrder(cloneTemplate(formOrderTempalte), events);
const contactsForm = new FormContacts(
	cloneTemplate(formContactsTemplate),
	events
);
const success = new Success(cloneTemplate(successTemplate), events);

const api = new ProductApi(CDN_URL, API_URL);
const appData = new AppState({}, events);
api.getProductList().then((response) => {
	appData.setCatalog(response);
})
.catch((error) => console.log(error));

const orderApi = new OrderApi(CDN_URL, API_URL);

events.on('items:changed', () => {
	page.catalog = appData.getCatalog().map((item) => {
		const card = new Card('card', cloneTemplate(cardCatalogTemplate), events, {
			onClick: () => events.emit('cardItem:open', item),
		});
		return card.render({
			category: item.category,
			title: item.title,
			image: item.image,
			price: item.price,
			id: item.id,
		});
	});
});

events.on('cardItem:open', (data) => {
	const cardItem = data as Card;
	const item = appData.getCatalog().find((item) => item.id === cardItem.id);
	const cardPreview = new CardPreview(
		cloneTemplate(cardPreviewTemplate),
		events
	);
	modal.render({ content: cardPreview.render(item) });
	page.locked = true;
});

events.on('card:addtobasket', (data) => {
	const cardItem = data as Card;
	const orderitem = appData
		.getCatalog()
		.find((item) => item.id === cardItem.id);
	orderitem.selected = true;
	appData.addItemToBasket(orderitem as IProductCard);
	page.counter = appData.getBasketList().length;
	modal.close();
});

events.on('basket:open', () => {
	const basketArray = appData.getBasketList();
	const cardBasketElements = basketArray.map((item, index) => {
		const cardBasketElement = cloneTemplate(cardBasketTemplate);
		const cardBasket = new CardBasket('card', cardBasketElement, {
			onClick: () => events.emit('basket:delete', {
				item,
				element: cardBasketElement
			}),
		});
		cardBasket.index = index + 1;
		cardBasket.title = item.title;
		cardBasket.price = item.price;
		return cardBasketElement;
	});
	if (basketArray.length === 0) {
		basket.disableButton();
	} else {
		basket.undisableButton();
	}
	basket.items = cardBasketElements;
	basket.totalPrice = basketArray.reduce(
		(total, item) => total + (item.price || 0),
		0
	);
	modal.render({ content: basket.getContainer() });
	page.locked = true;
});

events.on('basket:changed', (item: IProductCard) => {
	item.selected = false;
	page.counter = appData.getBasketList().length;
	const basketArray = appData.getBasketList();
	basket.totalPrice = basketArray.reduce(
		(total, item) => total + (item.price || 0),
		0
	);
})

events.on('basket:delete', (removeObj: IBasketRemoveItem) => {
	appData.removeFromBasket(removeObj.item.id);
	removeObj.element.remove();
	const orderitem = appData
		.getCatalog()
		.find((item) => item.id === removeObj.item.id);
	orderitem.selected = false;
});

events.on('orderform:open', () => {
	modal.render({
		content: orderForm.render({
			address: '',
			valid: false,
			errors: [],
		}),
	});
});

events.on('formErrors:change', (errors: Partial<IOrderForm>) => {
	const { email, phone, address, payment } = errors;
	orderForm.valid = !address && !payment;
	contactsForm.valid = !email && !phone;
	orderForm.errors = Object.values({ address, payment })
		.filter((i) => !!i)
		.join('; ');
	contactsForm.errors = Object.values({ email, phone })
		.filter((i) => !!i)
		.join('; ');
});

events.on(
	/^order\..*:change/,
	(data: { field: keyof IOrderForm; value: string }) => {
		appData.setOrderField(data.field, data.value);
	}
);

events.on(
	/^contacts\..*:change/,
	(data: { field: keyof IOrderForm; value: string }) => {
		appData.setContactField(data.field, data.value);
	}
);

events.on('order:submit', () => {
	appData.order.total = appData.getTotalPrice();
	modal.render({
		content: contactsForm.render({
			email: '',
			phone: '',
			valid: false,
			errors: [],
		}),
	});
});

events.on('contacts:submit', () => {
	appData.order.items = appData.getBasketList().map((item) => item.id);
	orderApi
		.orderProduct(appData.order as IOrderModelPost)
		.then((response: any) => {
			events.emit('order:success', response);
			appData.clearBasket();
			appData.clearOrder();
			page.counter = 0;
			appData.getCatalog().forEach((item) => {
				if (item.price === null) {
					item.selected = true;
				} else {
					item.selected = false;
				}
			});
		})
		.catch((error) => console.log(error));
});

events.on('order:success', (response: ApiListResponse<string>) => {
	modal.render({
		content: success.render({
			total: response.total,
		}),
	});
});

events.on('sucess:close', () => {
	modal.close();
});

events.on('modal:close', () => {
	page.locked = false;
});
