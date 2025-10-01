import { PartialStateUpdater } from '@ngrx/signals';
import { DevicesSlice } from '../devices.slice';

export function setBusyUpdater(busy = true): PartialStateUpdater<DevicesSlice> {
  return () => ({
    isBusy: busy,
  });
}
