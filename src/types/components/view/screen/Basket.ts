import { HeaderData } from '../common/Header';

export interface BasketData {
	header: HeaderData;
	isActive: boolean;
	isDisabled: boolean;
	total: string;
}

export interface BasketSettings {
	onRemove: (id: string) => void;
	onClose: () => void;
	onNext: () => void;
	onBack: () => void;
}
