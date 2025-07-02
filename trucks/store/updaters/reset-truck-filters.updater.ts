import { PartialStateUpdater } from '@ngrx/signals';
import { TrucksEntriesSlice } from '../truck-entries.slice';

export function resetTruckFiltersUpdater(): PartialStateUpdater<TrucksEntriesSlice> {
  return (_) => {
    return {
      _filters: {
        plate: undefined,
        state: [],
        residueType: undefined,
        originId: [],
        from: undefined,
        to: undefined,
      },
    };
  };
}
