import { PartialStateUpdater } from '@ngrx/signals';
import { TractorHeadOperatorConfigSlice } from '../tractor-head-operator-config.slice';

export function setBusy(
  busy: boolean = true
): PartialStateUpdater<TractorHeadOperatorConfigSlice> {
  return (store) => {
    return {
      isBusy: busy,
    };
  };
}
