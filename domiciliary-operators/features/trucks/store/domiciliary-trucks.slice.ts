import { Subscription } from 'rxjs';
import { Truck } from '../models/truck';
import { TruckFilters } from '../models/truck-filters';
import { OrderType } from '@shared/models/order';
import { TruckOrder, TruckOrderBy } from '../models/truck-orders';

export interface DomiciliaryTrucksSlice {
    _trucks: Map<number, Truck>;
    _eventsSubscription: Subscription | null;
    _filters: TruckFilters;
    _order: TruckOrder;
    areTruckFiltersOpen: boolean;
    _selectedTruckId: number;
    isBusy: boolean;
    updateSucceeded: boolean | null;
}

export const domiciliaryTrucksInitialValue: DomiciliaryTrucksSlice = {
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
    areTruckFiltersOpen: false,
    _selectedTruckId: -1,
    isBusy: false,
    updateSucceeded: null,
};