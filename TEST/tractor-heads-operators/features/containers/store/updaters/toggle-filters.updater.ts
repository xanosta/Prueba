import { PartialStateUpdater } from '@ngrx/signals';
import { ContainersSlice } from '../containers.slice';

export function toggleFiltersUpdater(
  filtersOpen?: boolean
): PartialStateUpdater<ContainersSlice> {
  return (store) => {
    if (!filtersOpen)
      return {
        areFiltersOpen: !store.areFiltersOpen,
      };

    return {
      areFiltersOpen: filtersOpen,
    };
  };
}
