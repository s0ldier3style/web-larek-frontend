import { AppStateModals, AppStateChanges } from "../model/AppState";

export type EventData = object;
export type EventHandler = (args: EventData) => void;
export type EventsMap = Map<string, Set<EventHandler>>;


export interface IEventEmitter {
    emit: (event: AppStateModals | AppStateChanges, data: EventData) => void;
}