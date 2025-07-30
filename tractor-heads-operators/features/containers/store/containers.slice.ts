import { SmallLocation } from '@features/locations/models/location';
import { Container } from '../models/container.model';
import { ContainersFilters } from '../models/containers-filters.model';
import { Pagination } from '@shared/models/pagination';

export interface ContainersSlice {
  _containers: Map<number, Container>;
  filters: ContainersFilters;
  _selectedContainer: Container | null;
  _locations: {
    suggested: Array<SmallLocation>;
    others: Array<SmallLocation>;
  };
  paginationInfo: Pagination;
  isBusy: boolean;
  areFiltersOpen: boolean;
}

export const containersSliceInitialValue: ContainersSlice = {
  _containers: new Map<number, Container>(),
  filters: {
    currentPage: 1,
  },
  _selectedContainer: null,
  _locations: {
    suggested: [],
    others: [],
  },
  paginationInfo: {
    offset: 0,
    pageSize: 20,
    total: 0,
  },
  areFiltersOpen: true,
  isBusy: false,
};
