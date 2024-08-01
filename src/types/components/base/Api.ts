import { IUserInfo } from "../model/User";

export interface IProduct {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
}

export type ApiListResponse<Type> = {
	total: number;
	items: Type[];
};

export interface IApi {
    baseUrl: string;
    getList:() => Promise<ApiListResponse<IProduct>>;
    getItem(id: string): Promise<IProduct | IApiError>;
    postOrder(user: IUserInfo, total: number, items: string[]): Promise<IResponse | IApiError>;
}

export interface IApiError {
    error: string;
}

export interface IResponse {
    id: string;
    total: number;
}

export enum EnumApiMethods {
	POST = 'POST',
	PUT = 'PUT',
	DELETE = 'DELETE',
	GET = 'GET',
}

export type ErrorState = {
	error: string;
};