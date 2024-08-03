import { ModalScreen } from './ModalScreen';
import { cloneTemplate } from '../../../utils/utils';
import { settings } from '../../../utils/constants';

import { OrderFormData, OrderFormSettings } from '../../../types/components/view/screen/OrderForm';
import { HeaderData } from '../../../types/components/view/common/Header';
import { OrderData } from '../../../types/components/view/partial/Order';
import { HeaderView } from '../common/Header';
import { OrderView } from '../partial/Order';
import { IChangeableEvent } from '../../../types/components/base/View';


export class OrderFormScreen extends ModalScreen {
	initHeader() {
		
	}

	initContent() {
		
	}

	protected onFormChange({ value }: IChangeableEvent<OrderData>) {
		
	}

	set contacts(value: OrderData) {
		
	}

	set total(total: string) {
		
	}
}
