import { PartialStateUpdater } from '@ngrx/signals';
import { TrucksEntriesSlice } from '../truck-entries.slice';

export function disconnectToSseEventsUpdater(): PartialStateUpdater<TrucksEntriesSlice> {
  return (store) => {
    if (store._eventsSubscription) store._eventsSubscription.unsubscribe();
    return {
      _eventsSubscription: null,
    };
  };
}
