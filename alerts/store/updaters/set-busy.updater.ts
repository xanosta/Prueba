import { PartialStateUpdater } from '@ngrx/signals';
import { AlertsSlice } from '../alerts.slice';

export function setBusy(
  busy: boolean = true
): PartialStateUpdater<AlertsSlice> {
  return (state) => {
    return {
      isBusy: busy,
    };
  };
}
