import { PartialStateUpdater } from '@ngrx/signals';
import { ContainerFilters } from '../../models/container-filters.model';
import { ContainersSlice } from '../containers.slice';

export function setFiltersUpdater(
  filters: ContainerFilters
): PartialStateUpdater<ContainersSlice> {
  return (store) => {
    return {
      _filters: {
        ...store._filters,
        ...filters,
      },
    };
  };
}
