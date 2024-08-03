

export interface IProduct {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
}

export interface IBasketItems {
	product: IProduct[];
}

export type ApiListResponse<Type> = {
	total: number;
	items: Type[];
};

export interface IProductApi {
    getList:() => Promise<ApiListResponse<IProduct>>;
    getItem(id: string): Promise<IProduct | IApiError>;
    postOrder(order: Order): Promise<OrderResult[]>;
}

export interface IApiError {
    error: string;
}

export interface IResponse {
    id: string;
    total: number;
}

export type PaymentType = "online" | "offline" | null;

export interface IUser {
    clear(): void;
    inputValueHandler(data: Contacts): void;
}

export interface Contacts {
	email: string;
	phone: string;
    address?: string;
}

export interface Order extends Contacts {
	payment: PaymentType;
}

export interface OrderResult extends IBasketItems {
	id: string;
}
