import { PartialStateUpdater } from '@ngrx/signals';
import { TractorHeadsSlice } from '../tractor-heads.slice';

export function toggleTractorHeadFiltersUpdater(
    isOpen: boolean = true
): PartialStateUpdater<TractorHeadsSlice> {
    return () => ({
        areFiltersOpen: isOpen,
    });
}