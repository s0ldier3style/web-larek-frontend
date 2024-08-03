import { Contacts, IProduct, Order } from "./ProductApi";
import { IBasketModel } from "./Basket";
import { IProductApi } from "./ProductApi";

// Такие данные нам нужны, чтобы сформировать временный уникальный ключ товара
export type ProductData = {
	title: string;
	price: number;
	category: string;

};

// Полное описание товара, которое мы будем хранить в корзине и в localStorage
// Для удобства добавим в него название товара, цену и категорию
// это позволит корректно отображать корзину даже без загрузки списка товаров
export type BasketData = ProductData & {
	id: string;
	title: string;
	category: string;
	price: number;
    image: string
    description: string;
};

// Форматированные данные товара для отображения в корзине
export type ProductInBasketData = {
	id: string;
	title: string;
	price: string;
};

// Описание фильма для отображения в открытой карточке
export type ProductDescription = {
	title: string;
	category: string;
	price: number;
    image: string
    description: string;
};

// Краткое описание фильма для отображения в модальных окнах
export type MovieDescription = {
	title: string;
	day: string;
	time: string;
};


// Какие модальные окна у нас есть
export enum AppStateModals {
    none = 'modal:none',
    productCard = 'modal:productCard',
    basket = 'modal:basket',
    paymentForm = 'modal:paymentForm',
    contactsForm = 'modal:contactsForm',
    succesForm = 'modal:succesForm'
}

// Какие изменения состояния приложения могут происходить
export enum AppStateChanges {
    productCard = 'click:productCard',
    basket = 'click:basket',
    paymentForm = 'submit:paymentForm',
    contactsForm = 'submit:contactsForm ',
    succesForm = 'submit:succesForm'
}

// Состояние приложения, которое мы будем хранить в localStorage
export type PersistedState = {
	basket: IBasketModel;
	contacts: Contacts;
};

// Модель данных приложения
export interface AppState {
    // Загружаемые с сервера данные
    productList: Map<string, IProduct>;

    // Заполняемые пользователем данные
    basket: Map<string, IBasketModel>;
    basketTotal: number;
    contacts: Contacts;
    order: Order;

    // Состояние интерфейса
    openedModal: AppStateModals; //- это не модель, а состояние для открытого модального окна.
    isOrderReady: boolean;
    modalMessage: string | null;
    isError: boolean;

    // Действия с API
    loadProductList(): Promise<void>;
    

    // Действия с localStorage
    restoreState(): void;
	persistState(): void;

    // Пользовательские действия
    addToBasket(id: string): void;
    removeFromBasket(id: string): void;
    fillContacts(contacts: Partial<Contacts>): void;
    isValidContacts(): boolean;

    // Вспомогательные методы
    // getProductDescription(): IProductDescription | null;
    // formatProductDescription(product: IProductDescription): string;

    // Методы для работы с модальными окнами
	openModal(modal: AppStateModals): void;
	setMessage(message: string | null, isError: boolean): void;
}

// Настройки модели данных
export interface AppStateSettings {
	formatCurrency: (value: number) => string;
	storageKey: string;
	// Функция, которая будет вызываться при изменении состояния
	onChange: (changed: AppStateChanges) => void;
}

// Конструктор модели данных
export interface AppStateConstructor {
	new (api: IProductApi, settings: AppStateSettings): AppState;
}