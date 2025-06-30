import { PartialStateUpdater } from '@ngrx/signals';
import { TrucksEntriesSlice } from '../truck-entries.slice';
import { Subscription } from 'rxjs';

export function subscribeToEventsUpdater(
  eventsSubscription: Subscription
): PartialStateUpdater<TrucksEntriesSlice> {
  return (store) => {
    if (store._eventsSubscription) return {};

    return {
      _eventsSubscription: eventsSubscription,
    };
  };
}
