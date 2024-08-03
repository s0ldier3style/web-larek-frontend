import { EventEmitter } from "../base/EventEmitter";
import { IProductApi } from "../../types/components/model/ProductApi";
import { 
    AppState,
    AppStateChanges,
    AppStateConstructor,
    AppStateModals,
    AppStateSettings
 } from "../../types/components/model/AppState";

 export class AppStateEmitter extends EventEmitter {
    public model: AppState;
    protected previousModal: AppStateModals = AppStateModals.none;

    constructor(
        api: IProductApi,
        settings: Omit<AppStateSettings, 'onChange'>,
        Model: AppStateConstructor
    ) {
        super()
    }

    protected onModelChange(changed: AppStateChanges) {

    }
 }