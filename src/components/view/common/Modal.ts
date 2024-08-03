import { View } from '../../base/View';
import { ModalData, ModalSettings } from '../../../types/components/view/common/Modal';


export class ModalView<H, C> extends View {
	protected static _openedModal: ModalView<unknown, unknown> | null;

	protected init() {
		
	}

	protected onCloseHandler(event?: MouseEvent) {
		
	}

	protected onOpenHandler() {
		
	}


	set header(data: H | undefined) {
		
	}

	set content(data: C) {
		
	}

	
	set message(value: string | undefined) {
		
	}

	set isError(state: boolean) {
		
	}

	
	set isActive(state: boolean) {
		
	}
}
