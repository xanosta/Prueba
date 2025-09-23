import { PartialStateUpdater } from '@ngrx/signals';

import { DevicesSlice } from '../devices.slice';
import { Pagination } from '@shared/models/pagination';

export function setPaginationInfoUpdater(
  paginationInfo: Pagination
): PartialStateUpdater<DevicesSlice> {
  return () => ({
    paginationInfo,
  });
}
