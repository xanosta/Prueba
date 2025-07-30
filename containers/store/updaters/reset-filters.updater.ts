import { PartialStateUpdater } from '@ngrx/signals';
import { ContainersSlice } from '../containers.slice';

export function resetFiltersUpdate(): PartialStateUpdater<ContainersSlice> {
  return () => {
    return {
      _filters: {},
    };
  };
}
