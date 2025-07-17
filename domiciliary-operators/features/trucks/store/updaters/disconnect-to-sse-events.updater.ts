import { PartialStateUpdater } from '@ngrx/signals';
import { DomiciliaryTrucksSlice } from '../domiciliary-trucks.slice';

export function disconnectToSseEventsUpdater(): PartialStateUpdater<DomiciliaryTrucksSlice> {
    return (store) => {
        if (store._eventsSubscription) store._eventsSubscription.unsubscribe();
        return {
            _eventsSubscription: null,
        };
    };
}
