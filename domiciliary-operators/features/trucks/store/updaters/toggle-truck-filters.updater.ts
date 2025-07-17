import { PartialStateUpdater } from '@ngrx/signals';
import { DomiciliaryTrucksSlice } from '../domiciliary-trucks.slice';

export function toggleTruckFiltersUpdater(
    isOpen: boolean = true
): PartialStateUpdater<DomiciliaryTrucksSlice> {
    return (_) => {
        return {
            areTruckFiltersOpen: isOpen,
        };
    };
}
