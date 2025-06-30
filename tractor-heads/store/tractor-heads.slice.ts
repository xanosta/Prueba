import { Subscription } from 'rxjs';
import { TractorHead } from '../models/tractor-head';
import { TractorHeadFilters } from '../models/tractor-head-filters';
import { TractorHeadOrder, TractorHeadOrderBy } from '../models/tractor-head-orders';

export interface TractorHeadsSlice {
  _tractorHeads: Map<number, TractorHead>;
  _eventsSubscription: Subscription | null;
  _filters: TractorHeadFilters;
  order: TractorHeadOrder;
  areFiltersOpen: boolean;
  isBusy: boolean;
}

export const tractorHeadsSliceInitialValue: TractorHeadsSlice = {
  _tractorHeads: new Map(),
  _eventsSubscription: null,
  _filters: {

    tractorHeadPlate: undefined,
    originId: undefined,
    destinationId: undefined,
    tractorHeadStatus: undefined,
    ArrivalResidueTypes: [],
    ExitResidueTypes: [],
    from: undefined,
    to: undefined,
  },
  order: {
    by: TractorHeadOrderBy.ARRIVAL,
    direction: 'desc',
  },
  areFiltersOpen: false,
  isBusy: false,
};