import { PartialStateUpdater } from '@ngrx/signals';
import { DomiciliaryTrucksSlice } from '../domiciliary-trucks.slice';
import { Subscription } from 'rxjs';

export function subscribeToEventsUpdater(
    eventsSubscription: Subscription
): PartialStateUpdater<DomiciliaryTrucksSlice> {
    return (store) => {
        if (store._eventsSubscription) return {};

        return {
            _eventsSubscription: eventsSubscription,
        };
    };
}
