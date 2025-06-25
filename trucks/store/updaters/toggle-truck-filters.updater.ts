import { PartialStateUpdater } from '@ngrx/signals';
import { TrucksEntriesSlice } from '../truck-entries.slice';

export function toggleTruckFiltersUpdater(
  isOpen: boolean = true
): PartialStateUpdater<TrucksEntriesSlice> {
  return (_) => {
    return {
      areTruckFiltersOpen: isOpen,
    };
  };
}
