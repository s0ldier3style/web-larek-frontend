import { ModalScreen } from './ModalScreen';
import { IClickableEvent } from '../../../types/components/base/View';
import { cloneTemplate } from '../../../utils/utils';
import { settings } from '../../../utils/constants';

import { BasketData, BasketSettings } from '../../../types/components/view/screen/Basket';
import { HeaderData } from '../../../types/components/view/common/Header';
import { ListView } from '../common/List';
import { ProductInBasketData } from '../../../types/components/model/AppState';
import { HeaderView } from '../common/Header';
import { ListData } from '../../../types/components/view/common/List';


export class BasketScreen extends ModalScreen {
	initHeader() {
		
	}

	initContent() {
		
	}

	protected onRemoveTicket({ item }: IClickableEvent<ProductInBasketData>) {
		
	}

	set tickets(tickets: ProductInBasketData[]) {
		
	}

	set total(total: string) {
		
	}
}
