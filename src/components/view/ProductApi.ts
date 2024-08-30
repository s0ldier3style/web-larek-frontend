import { IProductCard, IOrderModelPost, IOrderModelGet } from './../../types/index';
import { Api, ApiListResponse } from "../base/Api";


export class ProductApi extends Api {
	readonly cdn: string;

	constructor(cdn: string, baseUrl: string, options?: RequestInit) {
		super(baseUrl, options);
		this.cdn = cdn;
	}

	getProductList(): Promise<IProductCard[]> {
		return this.get<ApiListResponse<IProductCard>>('/product').then((data) => {
			const response = data;
			return response.items.map((item) => ({
				...item,
				image: this.cdn + item.image,
			}));
		});
	}

	getProductCard(id: string): Promise<IProductCard> {
		return this.get<IProductCard>(`/product/${id}`).then((data) => {
			const item = data;
			return {
				...item,
				image: this.cdn + item.image,
			};
		});
	}
}

export class OrderApi extends Api {
	readonly cdn: string;

	constructor(cdn: string, baseUrl: string, options?: RequestInit) {
		super(baseUrl, options);
		this.cdn = cdn;
	}

	orderProduct(order: IOrderModelPost): Promise<IOrderModelGet> {
		return this.post<IOrderModelGet>('/order', order);
	}
}