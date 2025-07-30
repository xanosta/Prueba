import { PartialStateUpdater } from '@ngrx/signals';
import { ContainersSlice } from '../containers.slice';

export function setFiltersOpenUpdater(
  state: boolean = true
): PartialStateUpdater<ContainersSlice> {
  return (store) => {
    return {
      areFiltersOpen: state,
    };
  };
}
