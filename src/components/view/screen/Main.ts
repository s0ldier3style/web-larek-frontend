import { Screen } from '../../base/Screen';
import { IClickableEvent } from '../../../types/components/base/View';
import { cloneTemplate, ensureElement } from '../../../utils/utils';
import { settings } from '../../../utils/constants';

import { ProductItem, MainData, MainSettings } from '../../../types/components/view/screen/Main';
import { ListView } from '../common/List';
import { CardView } from '../partial/Card';
import { PageView } from '../partial/Page';
import { CardData } from '../../../types/components/view/partial/Card';


export class MainScreen extends Screen {
	protected declare gallery: ListView<CardData>;
	public declare page: PageView;

	protected init() {
		
	}

	protected onSelectFilmHandler({ item }: IClickableEvent<string>) {
		
	}

	protected onOpenFilmHandler({ item }: IClickableEvent<ProductItem>) {
		
	}

	set counter(value: number) {
		
	}

	set items(value: CardData[]) {
		
	}

	set selected(value: ProductItem) {
		
	}
}
