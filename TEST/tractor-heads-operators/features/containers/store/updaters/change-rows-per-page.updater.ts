import { PartialStateUpdater } from '@ngrx/signals';
import { ContainersSlice } from '../containers.slice';

export function changeRowsPerPage(
  rowsPerPage: number
): PartialStateUpdater<ContainersSlice> {
  return (store) => {
    return {
      paginationInfo: {
        ...store.paginationInfo,
        pageSize: rowsPerPage,
      },
    };
  };
}
