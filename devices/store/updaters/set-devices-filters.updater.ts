import { PartialStateUpdater } from '@ngrx/signals';
import { DevicesSlice } from '../devices.slice';
import { DevicesFilters } from '../../models/device-filters.model';

export function setDevicesFiltersUpdater(
  filters: Partial<DevicesFilters>
): PartialStateUpdater<DevicesSlice> {
  return store => {
    return {
      filters: {
        ...store.filters,
        ...filters,
      },
    };
  };
}
