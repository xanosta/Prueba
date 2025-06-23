import { Observable, Subscription } from 'rxjs';
import { Truck } from '../models/truck';
import { TruckFilters } from '../models/truck-filters';

export interface TrucksEntriesSlice {
  _trucks: Map<number, Truck>;
  _eventsSubscription: Subscription | null;
  _filters: TruckFilters;
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
  _selectedTruckId: -1,
  areTruckFiltersOpen: false,
  isBusy: false,
};
