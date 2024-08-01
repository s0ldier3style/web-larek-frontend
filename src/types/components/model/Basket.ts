export interface IBasketModel {
    
    productList: Map<string, number>; // { id: amount } 
    add(id: string): void;
    remove(id: string): void;
}

