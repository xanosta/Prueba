import { PartialStateUpdater } from '@ngrx/signals';
import { ContainersSlice } from '../containers.slice';
import { Pagination } from '@shared/models/pagination';

export function setPaginationInfoUpdater(
  paginationInfo: Pagination
): PartialStateUpdater<ContainersSlice> {
  return (store) => {
    return {
      paginationInfo: paginationInfo,
    };
  };
}
