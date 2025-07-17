import { PartialStateUpdater } from '@ngrx/signals';
import { TruckFilters } from '../../models/truck-filters';
import { DomiciliaryTrucksSlice } from '../domiciliary-trucks.slice';

export function setTruckFiltersUpdater(
    filters: TruckFilters
): PartialStateUpdater<DomiciliaryTrucksSlice> {
    return (store) => {
        return {
            _filters: {
                ...store._filters,
                ...filters,
            },
        };
    };
}