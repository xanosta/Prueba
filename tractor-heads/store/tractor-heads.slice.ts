import { Subscription } from 'rxjs';
import { TractorHead } from '../models/tractor-head';
import { TractorHeadFilters } from '../models/tractor-head-filters';

export interface TractorHeadsSlice {
  _tractorHeads: Map<string, TractorHead>; // Usamos la matrícula (string) como clave única.
  _eventsSubscription: Subscription | null;
  _filters: TractorHeadFilters;
  areFiltersOpen: boolean;
  isBusy: boolean;
}

export const tractorHeadsSliceInitialValue: TractorHeadsSlice = {
  _tractorHeads: new Map(),
  _eventsSubscription: null,
  _filters: {
    // Valores iniciales para los filtros.
    tractorHeadPlate: undefined,
    //userId: undefined,
    originId: undefined,
    destinationId: undefined,
    tractorHeadStatus: undefined,
    ArrivalResidueTypes: [],
    ExitResidueTypes: [],
    from: undefined,
    to: undefined,
  },
  areFiltersOpen: false,
  isBusy: false,
};