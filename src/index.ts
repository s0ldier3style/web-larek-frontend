import './scss/styles.scss';



/* export class Api implements IApi {
    baseUrl: string = 'baseUrl';

    private getResponseData(res: any) {
        if (!res.ok) {
          return Promise.reject(`Ошибка: ${res.status}`);
        }
        return res.json();
      }

    getList(): void {
        
        fetch(`${this.baseUrl}/product/`)
        .then((res) => {
            return this.getResponseData(res);
        })
        .then((data) => {
            return data;
        })
    };

    
    getItem(id: string): IProduct | IApiError;


    postOrder(user: IUserInfo, total: number, items: string[]): {
        id: string;
        total: number;
    } | IApiError
}

export class User implements IUser  {

    protected payment: PaymentType = null;
    protected email: string = '';
    protected phone: string = '';
    protected address: string = '';
    clear(): void {
        this.payment = null;
        this.email = '';
        this.phone = '';
        this.address= '';
    }

    inputValueHandler(data: IUserInfo): void  {
        if (data.payment)  this.payment = data.payment;
        if (data.address)  this.address = data.address;
        if (data.phone)  this.phone = data.phone;
        if (data.email)  this.email = data.email;
    }

    getUserInfo(): IUserInfo {
        return {
            payment: this.payment,
            email: this.email,
            phone: this.phone,
            address: this.address
        }
 
    }
}

export class BasketModel implements IBasketModel {
    productList: Map<string, number> = new Map();
    constructor(protected events: IEventEmitter) {
        this.events = events;
    };

    add(id: string): void {
        if (!this.productList.has(id)) {
            this.productList.set(id, 0)
        }
        this.productList.set(id, this.productList.get(id)! + 1);
        this._changed();
    };

    remove(id: string): void {
        if (!this.productList.has(id)) return;
        if (this.productList.get(id)! > 0) {
            this.productList.set(id, this.productList.get(id)! -1);
            if (this.productList.get(id) === 0) this.productList.delete(id);
        }
        this._changed();
    };

    protected _changed(): void {
        this.events.emit('basket:changed', { items: Array.from(this.productList.keys())})
    }
}
        
*/