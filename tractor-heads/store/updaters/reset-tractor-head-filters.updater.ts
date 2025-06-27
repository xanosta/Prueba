import { PartialStateUpdater } from '@ngrx/signals';
import { TractorHeadsSlice, tractorHeadsSliceInitialValue } from '../tractor-heads.slice';

export function resetTractorHeadFiltersUpdater(): PartialStateUpdater<TractorHeadsSlice> {
  return () => ({
    _filters: tractorHeadsSliceInitialValue._filters,
  });
}