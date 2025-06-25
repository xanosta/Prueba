import { PartialStateUpdater } from '@ngrx/signals';
import { TractorHeadFilters } from '../../models/tractor-head-filters';
import { TractorHeadsSlice } from '../tractor-heads.slice';

export function setTruckFiltersUpdater(
    filters: TractorHeadFilters
): PartialStateUpdater<TractorHeadsSlice> {
    return (store) => {
        return {
            _filters: {
                ...store._filters,
                ...filters,
            },
        };
    };
}