import { PartialStateUpdater } from '@ngrx/signals';
import { AlertFilters } from '../../models/alert-filters';
import { AlertsSlice } from '../alerts.slice';

export function setFiltersUpdater(
  filters: AlertFilters
): PartialStateUpdater<AlertsSlice> {
  return (store) => {
    return {
      _alertsFilters: {
        ...store._alertsFilters,
        ...filters,
      }
    };
  };
}
