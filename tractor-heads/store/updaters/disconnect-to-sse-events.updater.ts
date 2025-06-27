import { PartialStateUpdater } from '@ngrx/signals';
import { TractorHeadsSlice } from '../tractor-heads.slice';

export function disconnectToSseEventsUpdater(): PartialStateUpdater<TractorHeadsSlice> {
    return (state) => {
        if (state._eventsSubscription) {
            state._eventsSubscription.unsubscribe();
        }
        return {
            _eventsSubscription: null,
        };
    };
}