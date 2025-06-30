import { Observable, Subscription } from 'rxjs';
import { Truck } from '../models/truck';
import { TruckFilters } from '../models/truck-filters';
import { TruckOrder, TruckOrderBy } from '../models/truck-orders';
import { OrderType } from '@shared/models/order';

export interface TrucksEntriesSlice {
  _trucks: Map<number, Truck>;
  _eventsSubscription: Subscription | null;
  _filters: TruckFilters;
  _order: TruckOrder;
  _selectedTruckId: number;
  areTruckFiltersOpen: boolean;
  isBusy: boolean;
}

export const trucksEntriesSliceInitialValue: TrucksEntriesSlice = {
  _trucks: new Map(),
  _eventsSubscription: null,
  _filters: {
    plate: undefined,
    state: undefined,
    residueType: undefined,
    originId: undefined,
    from: undefined,
    to: undefined,
  },
  _order: {
    by: TruckOrderBy.arrival,
    type: OrderType.DESC,
  },
  _selectedTruckId: -1,
  areTruckFiltersOpen: false,
  isBusy: false,
};
