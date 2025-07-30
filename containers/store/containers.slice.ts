import { Subscription } from 'rxjs';
import { ContainerFilters } from '../models/container-filters.model';
import { Container } from '../models/container.model';
import { ContainerDetail } from '../models/container-detail.model';

export interface ContainersSlice {
  readonly _containers: Map<number, Container>;
  readonly _filters: ContainerFilters;
  readonly _sseSubscription: Subscription | undefined;
  readonly _selectedContainer: ContainerDetail | undefined;
  readonly isBusy: boolean;
  readonly areFiltersOpen: boolean;
}

export const containersStateInitialValue: ContainersSlice = {
  _containers: new Map(),
  _filters: {},
  _sseSubscription: undefined,
  _selectedContainer: undefined,
  isBusy: false,
  areFiltersOpen: false,
};
