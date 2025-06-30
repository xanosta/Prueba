import { PartialStateUpdater } from '@ngrx/signals';
import { TrucksEntriesSlice } from '../truck-entries.slice';

export function setBusyUpdater(
  busy: boolean = true
): PartialStateUpdater<TrucksEntriesSlice> {
  return (_) => {
    return {
      isBusy: busy,
    };
  };
}
