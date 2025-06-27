import { PartialStateUpdater } from '@ngrx/signals';
import { TractorHeadsSlice } from '../tractor-heads.slice';
import { TractorHead } from '../../models/tractor-head';

export function resetTractorHeadsListUpdater(): PartialStateUpdater<TractorHeadsSlice> {
    return () => ({
        _tractorHeads: new Map<string, TractorHead>(),
    });
}