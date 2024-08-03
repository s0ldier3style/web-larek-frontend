import { Api } from "../base/Api";
import type { 
    ApiListResponse,
    IProduct,
    Order,
    OrderResult,
    IProductApi,
    IApiError
 } from "../../types/components/model/ProductApi";

 /**
 * Класс для работы с API товаров
 */
export class ProductAPI extends Api implements IProductApi {
	readonly cdn: string;

	constructor(cdn: string, baseUrl: string, options?: RequestInit) {
		super(baseUrl, options);
		this.cdn = cdn;
	}

	
	
	async getItem(id: string): Promise<IProduct | IApiError> {
		return
	}

	
	async getList(): Promise<ApiListResponse<IProduct>> {
        return
    }


	async postOrder(order: Order): Promise<OrderResult[]> {
		return
	}
}