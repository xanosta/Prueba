import { PartialStateUpdater } from '@ngrx/signals';
import { ContainersSlice } from '../containers.slice';
import { ContainersFilters } from '../../models/containers-filters.model';
import { filter } from 'rxjs';

export function setContainersFiltersUpdater(
  filters: Partial<ContainersFilters>
): PartialStateUpdater<ContainersSlice> {
  return (store) => {
    return {
      filters: {
        ...store.filters,
        ...filters,
      },
    };
  };
}
