import { Alert } from '../models/alert';
import { AlertFilters } from '../models/alert-filters';

export interface AlertsSlice {
  readonly _alerts: Map<number, Alert>;
  readonly _alertsFilters: AlertFilters;
  readonly _selectedAlertId: number | null;
  readonly isBusy: boolean;
  areAlertFiltersOpen: boolean;
}

export const alertsSliceInitialValue: AlertsSlice = {
  _alerts: new Map<number, Alert>(),
  _alertsFilters: {
    alertType: undefined,
    severity: undefined,
  },
  _selectedAlertId: null,
  isBusy: false,
  areAlertFiltersOpen: false,
};
