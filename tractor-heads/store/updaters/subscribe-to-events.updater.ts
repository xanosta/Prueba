import { PartialStateUpdater } from '@ngrx/signals';
import { TractorHeadsSlice } from '../tractor-heads.slice';
import { Subscription } from 'rxjs';

export function subscribeToEventsUpdater(
    eventsSubscription: Subscription
): PartialStateUpdater<TractorHeadsSlice> {
    return (state) => {
        // Evita crear suscripciones duplicadas si ya existe una.
        if (state._eventsSubscription) return {};

        return {
            _eventsSubscription: eventsSubscription,
        };
    };
}