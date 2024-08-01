import { IProduct } from "../base/Api";
import { IUserInfo } from "./User";
import { IBasketModel } from "./Basket";
import { IApi } from "../base/Api";

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

// Модель данных приложения
export interface AppState {
    // Загружаемые с сервера данные
    productList: Map<string, IProduct>;

    // Заполняемые пользователем данные
    basket: Map<string, IBasketModel>;
    basketTotal: number;
    contacts: IUserInfo;
    // order: ORder;

    // Состояние интерфейса
    openedModal: AppStateModals;
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
    fillContacts(contacts: Partial<IUserInfo>): void;
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
	new (api: IApi, settings: AppStateSettings): AppState;
}