import { PartialStateUpdater } from '@ngrx/signals';
import { DomiciliaryTrucksSlice } from '../domiciliary-trucks.slice';

export function setSelectedTruckUpdater(
    truckId?: number
): PartialStateUpdater<DomiciliaryTrucksSlice> {
    return (_) => {
        return {
            _selectedTruckId: truckId ?? -1,
        };
    };
}