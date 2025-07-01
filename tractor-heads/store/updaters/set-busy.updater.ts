import { PartialStateUpdater } from '@ngrx/signals';
import { TractorHeadsSlice } from '../tractor-heads.slice';

export function setBusyUpdater(
    busy: boolean = true
): PartialStateUpdater<TractorHeadsSlice> {
    return () => ({
        isBusy: busy,
    });
}