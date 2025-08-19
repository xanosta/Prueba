import { PartialStateUpdater } from '@ngrx/signals';
import { AlertsSlice } from '../alerts.slice';

export function resetAlertFiltersUpdater():PartialStateUpdater<AlertsSlice> {
  return (_) => {
    return {
      _alertsFilters: {
        alertType: undefined,
        severity: undefined,
        // from: undefined,
        // to: undefined,
      },
    };
  };
}
