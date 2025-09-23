import { Location, Device, Hopper, EntryArea, WeighingPlatform } from '../models/device.model';
import { DevicesFilters } from '../models/device-filters.model';
import { Pagination } from '@shared/models/pagination';

export interface DevicesSlice {
  _locations: Location[];
  filters: DevicesFilters;
  paginationInfo: Pagination;
  isBusy: boolean;
  areFiltersOpen: boolean;
  selectedDeviceDetail: Device | null;
  selectedHopper: Hopper | null;
  selectedEntryArea: EntryArea | null;
  selectedWeighingPlatform: WeighingPlatform | null;
}

export const devicesSliceInitialValue: DevicesSlice = {
  _locations: [],
  filters: {
    currentPage: 1,
  },
  paginationInfo: {
    offset: 0,
    pageSize: 20,
    total: 0,
  },
  isBusy: false,
  areFiltersOpen: true,
  selectedDeviceDetail: null,
  selectedHopper: null,
  selectedEntryArea: null,
  selectedWeighingPlatform: null,
};
