import { PartialStateUpdater } from '@ngrx/signals';
import { AlertsSlice } from '../alerts.slice';

export function toggleAlertFiltersUpdater(
  isOpen: boolean = true
): PartialStateUpdater<AlertsSlice> {
  return (_) => {
    return {
      areAlertFiltersOpen: isOpen,
    };
  };
}
