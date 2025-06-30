import { PartialStateUpdater } from '@ngrx/signals';
import { TruckFilters } from '../../models/truck-filters';
import { TrucksEntriesSlice } from '../truck-entries.slice';

export function setTruckFiltersUpdater(
  filters: TruckFilters
): PartialStateUpdater<TrucksEntriesSlice> {
  return (store) => {
    return {
      _filters: {
        ...store._filters,
        ...filters,
      },
    };
  };
}
