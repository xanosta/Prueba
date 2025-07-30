import { PartialStateUpdater } from '@ngrx/signals';
import { TractorHead } from '../../features/tractor-heads/models/tractor-head.model';
import { TractorHeadOperatorConfigSlice } from '../tractor-head-operator-config.slice';

export function setTractorHeadsUpdater(
  tractorHeads: Array<TractorHead>
): PartialStateUpdater<TractorHeadOperatorConfigSlice> {
  return (store) => {
    return {
      tractorHeads: tractorHeads,
    };
  };
}
