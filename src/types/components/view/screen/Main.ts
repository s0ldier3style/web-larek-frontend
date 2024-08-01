import { CardData } from '../partial/Card';
import { ProductData } from '../partial/Product';

export interface ProductItem extends ProductData {
	id: string;
	cover: string;
}

export interface MainData {
	counter: number;
	items: CardData[];
	selected: ProductItem;
}

export interface MainSettings {
	onOpenBasket: () => void;
	onSelectFilm: (id: string) => void;
	onOpenFilm: (id: string) => void;
}
