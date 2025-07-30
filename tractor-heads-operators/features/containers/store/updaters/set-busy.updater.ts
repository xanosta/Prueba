import { PartialStateUpdater } from '@ngrx/signals';
import { ContainersSlice } from '../containers.slice';

export function setBusyUpdater(
  busy: boolean = true
): PartialStateUpdater<ContainersSlice> {
  return (_) => {
    return {
      isBusy: busy,
    };
  };
}
