import { PartialStateUpdater } from '@ngrx/signals';
import { DomiciliaryTrucksSlice } from '../domiciliary-trucks.slice';

export function resetTruckFiltersUpdater(): PartialStateUpdater<DomiciliaryTrucksSlice> {
    return (_) => {
        return {
            _filters: {
                plate: undefined,
                state: [],
                residueType: undefined,
                originId: [],
                from: undefined,
                to: undefined,
            },
        };
    };
}