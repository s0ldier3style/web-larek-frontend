import { Contacts,
    IProductApi,
    IProduct,
    Order,
    OrderResult,
    IBasketItems,
    IApiError
 } from "../../types/components/model/ProductApi";

 import { AppState,
    AppStateChanges,
    AppStateModals,
    AppStateSettings,
    BasketData,
    ProductDescription,
    PersistedState,
    ProductData,
    ProductInBasketData
  } from "../../types/components/model/AppState";
import { IBasketModel } from "../../types/components/model/Basket";

  export class AppStateModel implements AppState {
    basket: Map<string, IBasketModel>;
    contacts: Contacts = {
        email: '',
        phone: '',
        address: ''
    };
    order: Order;

    _productList: Map<string, IProduct>;

    openedModal: AppStateModals = AppStateModals.none;
    modalMessage: string | null = null;
    isError: false;

    constructor(protected api: IProductApi, protected settings: AppStateSettings) {}

    get basketTotal(): number {
        return
    }

    get isOrderReady(): boolean {
        return
    }

    get productList(): Map<string, IProduct> {
        return
    }

    loadProductList(): Promise<void> {
        return
    }

    addToBasket(id: string): void {
        
    }

    removeFromBasket(id: string): void {
        
    }

    fillContacts(contacts: Partial<Contacts>): void {
        
    }

    isValidContacts(): boolean {
        return
    }

    openModal(modal: AppStateModals): void {
        
    }

    setMessage(message: string | null, isError: boolean): void {
        
    }

    restoreState(): void {
        
    }

    persistState(): void {
        
    }
  }