import { HeaderData } from "../common/Header";

export interface SuccessData {
	content: HeaderData;
	isActive: boolean;
}

export interface SuccessSettings {
	onClose: () => void;
}
