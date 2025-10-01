import { PartialStateUpdater } from '@ngrx/signals';
import { DevicesSlice } from '../devices.slice';

export function changeCurrentPageUpdater(currentPage: number): PartialStateUpdater<DevicesSlice> {
  return store => {
    return {
      filters: {
        ...store.filters,
        currentPage: currentPage,
      },
    };
  };
}
