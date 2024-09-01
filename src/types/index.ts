export type TPayment = 'Online' | 'Receipt';

export type CategoryType = 'другое' | 'софт-скил' | 'дополнительное' | 'кнопка' | 'хард-скил';

export interface IProductCard {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
  selected: boolean
}

export interface IBasketCard {
	index: number;
	title: string;
	price: string | null;
}

export interface IBasketRemoveItem {
  item: IProductCard;
  element: HTMLElement;
}

export interface IActions {
	onClick: (event: MouseEvent) => void;
}

export interface IOrderForm {
  payment?: TPayment;
  address?: string;
  email?: string;
  phone?: string;
  total?: string | number;
}

export interface IOrder extends IOrderForm {
  items: string[];
}

export interface IOrderModelPost extends IOrderForm {
  items: string[];
  total: number
}

export interface IFormError {
  payment?: string;
  email?: string;
  phone?: string;
  address?: string;
}

export interface IOrderModelGet {
  id: string
  total: number
}

// Интерфейс данных приложения 
export interface IAppState {
  setCatalog(items:IProductCard[]):void;
  getCatalog(): IProductCard[];
  getProduct(id:number): IProductCard;
  addItemToBasket(item:IProductCard):void;
  removeFromBasket(id:string):void;
  clearBasket(): void;
  getTotalPrice():number;
  getBasketQuantity(): number;
  getBasketList():IProductCard[];
  setOrderField(field: keyof IOrderForm, value: string): void;
  validateOrder(): boolean;
  clearOrder(): void;
}