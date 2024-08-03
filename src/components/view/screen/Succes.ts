import { Screen } from '../../base/Screen';
import { cloneTemplate } from '../../../utils/utils';
import { settings } from '../../../utils/constants';

import { SuccessData, SuccessSettings } from '../../../types/components/view/screen/Succes'; 
import { ModalView } from '../common/Modal';
import { HeaderView } from '../common/Header';
import { HeaderData } from '../../../types/components/view/common/Header';


export class SuccessScreen extends Screen {
	protected declare modal: ModalView<never, HeaderData>;

	init() {

	}

	set content(value: HeaderData) {

	}

	set isActive(value: boolean) {
		
	}
}
