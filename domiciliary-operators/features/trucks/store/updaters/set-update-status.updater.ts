import { PartialStateUpdater } from '@ngrx/signals';
import { DomiciliaryTrucksSlice } from '../domiciliary-trucks.slice';

export function setUpdateStatusUpdater(
    status: boolean | null
): PartialStateUpdater<DomiciliaryTrucksSlice> {
    return (_) => {
        return {
            updateSucceeded: status,
        };
    };
}