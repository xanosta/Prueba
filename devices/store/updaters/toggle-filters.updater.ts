import { PartialStateUpdater } from '@ngrx/signals';
import { DevicesSlice } from '../devices.slice';

export function toggleFiltersUpdater(filtersOpen?: boolean): PartialStateUpdater<DevicesSlice> {
  return store => {
    if (!filtersOpen)
      return {
        areFiltersOpen: !store.areFiltersOpen,
      };

    return {
      areFiltersOpen: filtersOpen,
    };
  };
}
