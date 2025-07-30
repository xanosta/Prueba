import { PartialStateUpdater } from '@ngrx/signals';
import { ContainersSlice } from '../containers.slice';

export function changeCurrentPageUpdater(
  currentPage: number
): PartialStateUpdater<ContainersSlice> {
  return (store) => {
    return {
      filters: {
        ...store.filters,
        currentPage: currentPage,
      },
    };
  };
}
