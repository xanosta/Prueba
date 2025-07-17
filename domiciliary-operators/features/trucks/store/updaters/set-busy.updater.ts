import { PartialStateUpdater } from '@ngrx/signals';
import { DomiciliaryTrucksSlice } from '../domiciliary-trucks.slice';

export function setBusyUpdater(
  busy: boolean = true
): PartialStateUpdater<DomiciliaryTrucksSlice> {
  return (_) => {
    return {
      isBusy: busy,
    };
  };
}
